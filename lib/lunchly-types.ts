export type LunchlyProfile = {
  id: string;
  caregiverName: string;
  fullName: string;
  birthDate: string;
  age: number;
  grade: string;
  section: string;
  gender: string;
  height: string;
  weight: string;
  avatar: string;
  photoDataUrl: string;
  allergies: string[];
  customAllergy: string;
  schoolPolicies: string[];
  customPolicy: string;
  independenceLevel: number;
  lunchEatingTime: string;
  appetiteStyle: string;
  foodPersonality: string[];
  activityLevel: string;
  specialDays: string[];
  familyPriorities: string[];
  createdAt: string;
};

export type AnalysisSource = "ai" | "fallback";

export type AnalysisRecord = {
  id: string;
  profileId: string;
  lunchTitle: string;
  notes: string;
  selectedItems: string[];
  summary: string;
  detectedItems: string[];
  score: number;
  proteinScore: number;
  fibreScore: number;
  hydrationScore: number;
  flags: string[];
  highlights: string[];
  suggestions: string[];
  source: AnalysisSource;
  createdAt: string;
};
