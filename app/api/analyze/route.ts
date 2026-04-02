import { NextResponse } from "next/server";

import type { AiLunchAnalysisDraft, AnalyzeLunchInput, AnalyzeLunchResponse } from "@/lib/ai-contracts";
import { createMockAnalysis } from "@/lib/mock-analyzer";
import type { AnalysisRecord, LunchlyProfile } from "@/lib/lunchly-types";
import { createVoidAIJsonCompletion } from "@/lib/voidai";

export const runtime = "nodejs";

function clampScore(value: unknown, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
}

function toStringList(value: unknown, fallback: string[] = [], limit = 4) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, limit);
}

function buildProfileContext(profile: LunchlyProfile) {
  return {
    fullName: profile.fullName,
    age: profile.age,
    grade: profile.grade,
    allergies: [...profile.allergies, profile.customAllergy].filter(Boolean),
    schoolPolicies: [...profile.schoolPolicies, profile.customPolicy].filter(Boolean),
    independenceLevel: profile.independenceLevel,
    lunchEatingTime: profile.lunchEatingTime,
    appetiteStyle: profile.appetiteStyle,
    foodPersonality: profile.foodPersonality,
    activityLevel: profile.activityLevel,
    specialDays: profile.specialDays,
    familyPriorities: profile.familyPriorities,
  };
}

function buildAnalysisRecord(input: AnalyzeLunchInput, draft: AiLunchAnalysisDraft): AnalysisRecord {
  return {
    id: `analysis_${crypto.randomUUID()}`,
    profileId: input.profile.id,
    lunchTitle: input.lunchTitle,
    notes: input.notes,
    selectedItems: input.selectedItems,
    summary: draft.summary.trim() || "Lunchly created a balanced analysis for this tiffin.",
    detectedItems: draft.detectedItems.length ? draft.detectedItems : input.selectedItems,
    score: clampScore(draft.score, 78),
    proteinScore: clampScore(draft.proteinScore, 72),
    fibreScore: clampScore(draft.fibreScore, 68),
    hydrationScore: clampScore(draft.hydrationScore, 64),
    flags: toStringList(draft.flags, [], 4),
    highlights: toStringList(draft.highlights, ["Lunchly found a strong base to build on."], 4),
    suggestions: toStringList(draft.suggestions, ["Add one easy protein or fruit upgrade for better lunch balance."], 4),
    source: "ai",
    createdAt: new Date().toISOString(),
  };
}

function normalizeAiDraft(value: Partial<AiLunchAnalysisDraft>, input: AnalyzeLunchInput): AiLunchAnalysisDraft {
  return {
    summary:
      typeof value.summary === "string" && value.summary.trim()
        ? value.summary.trim()
        : `Lunchly reviewed ${input.lunchTitle || "today's tiffin"} for ${input.profile.fullName.split(" ")[0]}.`,
    detectedItems: toStringList(value.detectedItems, input.selectedItems, 8),
    score: clampScore(value.score, 78),
    proteinScore: clampScore(value.proteinScore, 72),
    fibreScore: clampScore(value.fibreScore, 68),
    hydrationScore: clampScore(value.hydrationScore, 64),
    flags: toStringList(value.flags),
    highlights: toStringList(value.highlights, ["Lunchly found a usable lunch foundation."]),
    suggestions: toStringList(value.suggestions, ["Add one practical swap to improve tomorrow's tiffin."]),
  };
}

function isValidProfile(profile: unknown): profile is LunchlyProfile {
  return Boolean(
    profile &&
      typeof profile === "object" &&
      "id" in profile &&
      "fullName" in profile &&
      typeof profile.id === "string" &&
      typeof profile.fullName === "string",
  );
}

export async function POST(request: Request) {
  let body: Partial<AnalyzeLunchInput> | null = null;

  try {
    body = (await request.json()) as Partial<AnalyzeLunchInput>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || !isValidProfile(body.profile)) {
    return NextResponse.json({ error: "A valid child profile is required." }, { status: 400 });
  }

  const lunchTitle = typeof body.lunchTitle === "string" ? body.lunchTitle.trim() : "";
  const notes = typeof body.notes === "string" ? body.notes.trim() : "";
  const selectedItems = toStringList(body.selectedItems, [], 8);
  const imageDataUrl = typeof body.imageDataUrl === "string" ? body.imageDataUrl : "";

  if (!lunchTitle && !notes && !selectedItems.length && !imageDataUrl) {
    return NextResponse.json(
      { error: "Add a tiffin title, notes, selected items, or a photo to analyze." },
      { status: 400 },
    );
  }

  const input: AnalyzeLunchInput = {
    profile: body.profile,
    lunchTitle: lunchTitle || "Today's tiffin",
    notes,
    selectedItems,
    imageDataUrl,
  };

  const analysisPrompt = `
You are Lunchly, an encouraging AI tiffin analyzer for Indian school lunchboxes.
Review the lunch for nutrition, protein, fibre, hydration, sensory fit, allergies, and school-rule compliance.
Avoid clinical tone. Be practical, parent-friendly, and child-specific.
Be conservative about what you infer from the image. If uncertain, say less.
Return only valid JSON with this exact shape:
{
  "summary": "string",
  "detectedItems": ["string"],
  "score": 0,
  "proteinScore": 0,
  "fibreScore": 0,
  "hydrationScore": 0,
  "highlights": ["string"],
  "suggestions": ["string"],
  "flags": ["string"]
}
Rules:
- Scores must be integers from 0 to 100.
- Use 2-4 highlights.
- Use 2-4 suggestions.
- Use 0-4 flags.
- Penalize policy or allergy conflicts clearly.
- Factor in food personality, appetite, independence, and family priorities.
- Suggest realistic Indian lunchbox improvements.
`.trim();

  const userText = JSON.stringify({
    childProfile: buildProfileContext(input.profile),
    lunchTitle: input.lunchTitle,
    notes: input.notes,
    selectedItems: input.selectedItems,
    imageProvided: Boolean(input.imageDataUrl),
  });

  try {
    const aiDraft = await createVoidAIJsonCompletion<AiLunchAnalysisDraft>({
      systemPrompt: analysisPrompt,
      userContent: input.imageDataUrl
        ? [
            {
              type: "text",
              text: userText,
            },
            {
              type: "image_url",
              image_url: {
                url: input.imageDataUrl,
                detail: "high",
              },
            },
          ]
        : userText,
      maxTokens: 1100,
      reasoningEffort: "medium",
      temperature: 0.3,
    });

    const record = buildAnalysisRecord(input, normalizeAiDraft(aiDraft, input));
    return NextResponse.json({ record } satisfies AnalyzeLunchResponse);
  } catch {
    const record = createMockAnalysis(input);
    return NextResponse.json({
      record,
      warning: "Lunchly used a local fallback because the AI provider was unavailable just now.",
    } satisfies AnalyzeLunchResponse);
  }
}
