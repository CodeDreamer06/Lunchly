import type { AnalysisRecord, AnalysisSource, LunchlyProfile } from "@/lib/lunchly-types";

export type AnalyzeLunchInput = {
  profile: LunchlyProfile;
  lunchTitle: string;
  notes: string;
  selectedItems: string[];
  imageDataUrl?: string;
};

export type AiLunchAnalysisDraft = Pick<
  AnalysisRecord,
  | "summary"
  | "detectedItems"
  | "score"
  | "proteinScore"
  | "fibreScore"
  | "hydrationScore"
  | "flags"
  | "highlights"
  | "suggestions"
>;

export type AnalyzeLunchResponse = {
  record: AnalysisRecord;
  warning?: string;
  debug?: Record<string, unknown>;
};

export type ProfileAssistantResponse = {
  foodPersonality: string[];
  familyPriorities: string[];
  schoolPolicyWatchouts: string[];
  reasoning: string;
  source: AnalysisSource;
  warning?: string;
  debug?: Record<string, unknown>;
};

export type AiTipCard = {
  category: string;
  title: string;
  body: string;
};

export type TipsResponse = {
  intro: string;
  tips: AiTipCard[];
  source: AnalysisSource;
  warning?: string;
  debug?: Record<string, unknown>;
};
