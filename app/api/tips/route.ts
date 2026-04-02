import { NextResponse } from "next/server";

import type { AiTipCard, TipsResponse } from "@/lib/ai-contracts";
import { defaultTipLibrary } from "@/lib/tip-library";
import type { AnalysisRecord, LunchlyProfile } from "@/lib/lunchly-types";
import { createVoidAIJsonCompletion } from "@/lib/voidai";

export const runtime = "nodejs";
const IS_DEV = process.env.NODE_ENV !== "production";

type TipsInput = {
  profile: LunchlyProfile;
  analyses: AnalysisRecord[];
};

function toTipCards(value: unknown, fallback: AiTipCard[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const nextCards = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Partial<AiTipCard>;

      if (
        typeof candidate.category !== "string" ||
        typeof candidate.title !== "string" ||
        typeof candidate.body !== "string"
      ) {
        return null;
      }

      return {
        category: candidate.category.trim() || "Smart tip",
        title: candidate.title.trim(),
        body: candidate.body.trim(),
      } satisfies AiTipCard;
    })
    .filter((item): item is AiTipCard => Boolean(item))
    .slice(0, 6);

  return nextCards.length ? nextCards : fallback;
}

function buildFallbackTips({ profile, analyses }: TipsInput): TipsResponse {
  const childName = profile.fullName.split(" ")[0];
  const recentFlags = analyses.flatMap((analysis) => analysis.flags).join(" ").toLowerCase();
  const selected = [...defaultTipLibrary];

  if (profile.foodPersonality.includes("Sensory-Sensitive")) {
    selected.unshift({
      category: "Sensory",
      title: "Keep crunch and moisture apart",
      body: `Because ${childName} is sensory-sensitive, separate crunchy veg from wet sabzi or chutney whenever possible.`,
    });
  }

  if (profile.schoolPolicies.includes("No reheating allowed")) {
    selected.unshift({
      category: "School Rules",
      title: "Favor room-temperature wins",
      body: "Pick lunches that still taste good without reheating, like stuffed parathas, paneer wraps, or dry idlis.",
    });
  }

  if (recentFlags.includes("protein")) {
    selected.unshift({
      category: "Nutrition",
      title: "Repeat one easy protein anchor",
      body: "If protein keeps showing up as a gap, build around one dependable option like paneer, sprouts, egg, or thick curd.",
    });
  }

  return {
    intro: `Lunchly prepared a simple weekly tip set for ${childName} using saved profile details and recent lunchbox patterns.`,
    tips: selected.slice(0, 6),
    source: "fallback",
    warning: "AI-generated tips were temporarily unavailable, so Lunchly used a local tip set.",
  };
}

export async function POST(request: Request) {
  let body: TipsInput | null = null;

  try {
    body = (await request.json()) as TipsInput;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body?.profile?.id || !body?.profile?.fullName) {
    return NextResponse.json({ error: "A valid active child profile is required." }, { status: 400 });
  }

  const slimAnalyses = (Array.isArray(body.analyses) ? body.analyses : []).slice(0, 5).map((analysis) => ({
    lunchTitle: analysis.lunchTitle,
    summary: analysis.summary,
    score: analysis.score,
    flags: analysis.flags,
    suggestions: analysis.suggestions,
  }));

  const fallback = buildFallbackTips({
    profile: body.profile,
    analyses: Array.isArray(body.analyses) ? body.analyses : [],
  });

  const systemPrompt = `
You are Lunchly's AI weekly tip coach for Indian school tiffins.
Generate practical, warm, child-specific advice that parents can use this week.
Return only valid JSON with this exact shape:
{
  "intro": "string",
  "tips": [
    {
      "category": "string",
      "title": "string",
      "body": "string"
    }
  ]
}
Rules:
- Generate 4-6 tips.
- Each tip should be actionable and realistic for Indian lunchboxes.
- Use the child profile, school rules, food personality, and recent analyses.
- Prefer encouraging language over judgment.
`.trim();

  try {
    const { data: aiResponse, debug } = await createVoidAIJsonCompletion<{
      intro?: string;
      tips?: AiTipCard[];
    }>({
      systemPrompt,
      userContent: JSON.stringify({
        profile: {
          fullName: body.profile.fullName,
          age: body.profile.age,
          allergies: [...body.profile.allergies, body.profile.customAllergy].filter(Boolean),
          schoolPolicies: [...body.profile.schoolPolicies, body.profile.customPolicy].filter(Boolean),
          foodPersonality: body.profile.foodPersonality,
          activityLevel: body.profile.activityLevel,
          familyPriorities: body.profile.familyPriorities,
        },
        recentAnalyses: slimAnalyses,
      }),
      maxTokens: 900,
      temperature: 0.45,
      reasoningEffort: "medium",
    });

    const response: TipsResponse = {
      intro:
        typeof aiResponse.intro === "string" && aiResponse.intro.trim()
          ? aiResponse.intro.trim()
          : fallback.intro,
      tips: toTipCards(aiResponse.tips, fallback.tips),
      source: "ai",
      ...(IS_DEV ? { debug } : {}),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Lunchly tips AI failure", error);
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
