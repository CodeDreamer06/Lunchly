import type { AnalysisRecord, LunchlyProfile } from "@/lib/profile-storage";

const proteinItems = ["paneer", "egg", "eggs", "dal", "sprouts", "chicken", "tofu", "curd", "yogurt", "chana"];
const fibreItems = ["fruit", "apple", "banana", "carrot", "cucumber", "salad", "beans", "broccoli", "peas"];
const hydrationItems = ["water", "buttermilk", "coconut water", "orange", "cucumber"];
const riskyWords = ["chips", "fried", "cola", "sugary", "pastry"];
const soggyWords = ["soggy", "gravy", "curry", "sabzi"];

export function createMockAnalysis(input: {
  profile: LunchlyProfile;
  lunchTitle: string;
  notes: string;
  selectedItems: string[];
}): AnalysisRecord {
  const { profile, lunchTitle, notes, selectedItems } = input;
  const allText = `${lunchTitle} ${notes} ${selectedItems.join(" ")}`.toLowerCase();

  let score = 72;
  let proteinScore = 58;
  let fibreScore = 52;
  let hydrationScore = 48;

  const hasProtein = proteinItems.some((item) => allText.includes(item));
  const hasFibre = fibreItems.some((item) => allText.includes(item));
  const hasHydration = hydrationItems.some((item) => allText.includes(item));
  const hasRisky = riskyWords.some((item) => allText.includes(item));
  const hasSoggy = soggyWords.some((item) => allText.includes(item));

  if (hasProtein) {
    score += 10;
    proteinScore += 22;
  }

  if (hasFibre) {
    score += 8;
    fibreScore += 24;
  }

  if (hasHydration) {
    score += 5;
    hydrationScore += 28;
  }

  if (hasRisky) {
    score -= 9;
  }

  if (profile.foodPersonality.includes("Sensory-Sensitive") && hasSoggy) {
    score -= 8;
  }

  if (profile.schoolPolicies.includes("No packaged snacks (only homemade)") && allText.includes("packaged")) {
    score -= 10;
  }

  const flags: string[] = [];
  const suggestions: string[] = [];
  const highlights: string[] = [];

  if (profile.foodPersonality.includes("Sensory-Sensitive") && hasSoggy) {
    flags.push("Texture warning: this lunch may get soggy before the lunch break.");
    suggestions.push("Pack dry sabzi or keep wet items in a separate steel container.");
  }

  if (!hasProtein) {
    flags.push("Protein looks light for a midday school lunch.");
    suggestions.push("Add paneer cubes, sprouts chaat, egg, or thick curd for steadier energy.");
  } else {
    highlights.push("Protein support looks solid for better energy and fullness.");
  }

  if (!hasFibre) {
    suggestions.push("A fruit or crunchy veg side would improve fibre and lunchbox balance.");
  } else {
    highlights.push("There is visible fibre support from fruits or vegetables.");
  }

  if (profile.schoolPolicies.length) {
    highlights.push(`School policy check passed for ${profile.schoolPolicies[0]}.`);
  }

  if (profile.familyPriorities.includes("Brain food & focus")) {
    suggestions.push("Favor steady carbs plus protein to support focus through the afternoon.");
  }

  if (profile.familyPriorities.includes("More veggies & fibre")) {
    suggestions.push("Keep one easy-to-finish vegetable side every day to build exposure.");
  }

  if (!highlights.length) {
    highlights.push("Lunchly found a reasonable lunch base with room for one or two upgrades.");
  }

  const boundedScore = Math.max(45, Math.min(96, score));

  return {
    id: `analysis_${crypto.randomUUID()}`,
    profileId: profile.id,
    lunchTitle,
    notes,
    selectedItems,
    score: boundedScore,
    proteinScore: Math.max(40, Math.min(98, proteinScore)),
    fibreScore: Math.max(38, Math.min(98, fibreScore)),
    hydrationScore: Math.max(35, Math.min(98, hydrationScore)),
    flags,
    highlights,
    suggestions,
    createdAt: new Date().toISOString(),
  };
}
