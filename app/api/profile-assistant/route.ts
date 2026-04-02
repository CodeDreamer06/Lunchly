import { NextResponse } from "next/server";

import type { ProfileAssistantResponse } from "@/lib/ai-contracts";
import { createVoidAIJsonCompletion } from "@/lib/voidai";

export const runtime = "nodejs";
const IS_DEV = process.env.NODE_ENV !== "production";

const allowedFoodPersonalities = [
  "Picky Eater",
  "Sensory-Sensitive",
  "Sports Day Hero",
  "Budget-Conscious",
  "Flavor Explorer",
  "Veggie Champion",
  "Eco Kid",
];

const allowedFamilyPriorities = [
  "Brain food & focus",
  "Immunity & less sick days",
  "Healthy weight gain",
  "More veggies & fibre",
  "Balanced macros (protein + carbs)",
];

type ProfileAssistantInput = {
  age: number;
  draft: {
    fullName?: string;
    allergies?: string[];
    customAllergy?: string;
    schoolPolicies?: string[];
    customPolicy?: string;
    activityLevel?: string;
    appetiteStyle?: string;
  };
};

function pickAllowed(values: unknown, allowed: string[], fallback: string[], limit: number) {
  if (!Array.isArray(values)) {
    return fallback;
  }

  const nextValues = Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .filter((value) => allowed.includes(value)),
    ),
  );

  return nextValues.length ? nextValues.slice(0, limit) : fallback;
}

function heuristicAssistantResponse(input: ProfileAssistantInput): ProfileAssistantResponse {
  const traits = new Set<string>();
  const priorities = new Set<string>();
  const watchouts: string[] = [];

  if (input.age <= 8) {
    traits.add("Picky Eater");
    traits.add("Sensory-Sensitive");
  }

  if (input.draft.activityLevel === "Sports champion") {
    traits.add("Sports Day Hero");
    priorities.add("Balanced macros (protein + carbs)");
  }

  if (input.draft.schoolPolicies?.includes("Plastic-free / only steel tiffin")) {
    traits.add("Eco Kid");
    watchouts.push("Favor steel-tiffin friendly foods and low-mess packing.");
  }

  if (input.draft.schoolPolicies?.includes("No packaged snacks (only homemade)")) {
    watchouts.push("Skip packaged snacks and keep swaps homemade.");
  }

  if (!priorities.size) {
    priorities.add("Brain food & focus");
  }

  return {
    foodPersonality: Array.from(traits).slice(0, 4),
    familyPriorities: Array.from(priorities).slice(0, 2),
    schoolPolicyWatchouts: watchouts.slice(0, 3),
    reasoning: "Lunchly suggested a simple profile starter based on age, activity, and the school rules you already selected.",
    source: "fallback",
    warning: "AI suggestions were temporarily unavailable, so Lunchly used a local profile assistant.",
  };
}

export async function POST(request: Request) {
  let body: ProfileAssistantInput | null = null;

  try {
    body = (await request.json()) as ProfileAssistantInput;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body.age !== "number" || !body.draft || typeof body.draft !== "object") {
    return NextResponse.json({ error: "Age and draft profile details are required." }, { status: 400 });
  }

  const systemPrompt = `
You are Lunchly's AI onboarding assistant for Indian school lunch planning.
Suggest profile defaults that help personalize future tiffin analysis.
Return only valid JSON with this exact shape:
{
  "foodPersonality": ["string"],
  "familyPriorities": ["string"],
  "schoolPolicyWatchouts": ["string"],
  "reasoning": "string"
}
Rules:
- foodPersonality must only use: ${allowedFoodPersonalities.join(", ")}.
- familyPriorities must only use: ${allowedFamilyPriorities.join(", ")}.
- Suggest 2-4 food personalities.
- Suggest 1-2 family priorities.
- schoolPolicyWatchouts should have 0-3 concise parent-friendly strings.
- Make choices based on age, allergies, activity, appetite, and school rules.
`.trim();

  try {
    const { data: aiResponse, debug } = await createVoidAIJsonCompletion<Partial<ProfileAssistantResponse>>({
      systemPrompt,
      userContent: JSON.stringify(body),
      maxTokens: 650,
      temperature: 0.4,
      reasoningEffort: "medium",
    });

    const fallback = heuristicAssistantResponse(body);
    const normalized: ProfileAssistantResponse = {
      foodPersonality: pickAllowed(aiResponse.foodPersonality, allowedFoodPersonalities, fallback.foodPersonality, 4),
      familyPriorities: pickAllowed(
        aiResponse.familyPriorities,
        allowedFamilyPriorities,
        fallback.familyPriorities,
        2,
      ),
      schoolPolicyWatchouts: Array.isArray(aiResponse.schoolPolicyWatchouts)
        ? aiResponse.schoolPolicyWatchouts
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 3)
        : fallback.schoolPolicyWatchouts,
      reasoning:
        typeof aiResponse.reasoning === "string" && aiResponse.reasoning.trim()
          ? aiResponse.reasoning.trim()
          : fallback.reasoning,
      source: "ai",
      ...(IS_DEV ? { debug } : {}),
    };

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Lunchly profile assistant AI failure", error);
    const fallback = heuristicAssistantResponse(body);
    return NextResponse.json(
      IS_DEV
        ? {
            ...fallback,
            debug: {
              error: error instanceof Error ? error.message : String(error),
              provider:
                error instanceof Error && "debug" in error && error.debug && typeof error.debug === "object"
                  ? error.debug
                  : undefined,
            },
          }
        : fallback,
    );
  }
}
