"use client";

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
  eatingNotes: string;
  independenceLevel: number;
  lunchEatingTime: string;
  appetiteStyle: string;
  foodPersonality: string[];
  activityLevel: string;
  specialDays: string[];
  familyPriorities: string[];
  createdAt: string;
};

export type AnalysisRecord = {
  id: string;
  profileId: string;
  lunchTitle: string;
  notes: string;
  selectedItems: string[];
  score: number;
  proteinScore: number;
  fibreScore: number;
  hydrationScore: number;
  flags: string[];
  highlights: string[];
  suggestions: string[];
  createdAt: string;
};

const PROFILE_KEY = "lunchlogic_child_profile_v2";
const LEGACY_PROFILES_KEY = "lunchly_profiles_v1";
const LEGACY_ACTIVE_PROFILE_KEY = "lunchly_active_profile_v1";
const ANALYSES_KEY = "lunchly_analyses_v1";

function canUseStorage() {
  return typeof window !== "undefined";
}

function parseProfile(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
  const parsed = JSON.parse(raw) as LunchlyProfile;
    return parsed && typeof parsed === "object"
      ? {
          ...parsed,
          eatingNotes: typeof parsed.eatingNotes === "string" ? parsed.eatingNotes : "",
        }
      : null;
  } catch {
    return null;
  }
}

function migrateLegacyProfile() {
  if (!canUseStorage()) {
    return null;
  }

  const current = parseProfile(window.localStorage.getItem(PROFILE_KEY));
  if (current) {
    return current;
  }

  const rawLegacy = window.localStorage.getItem(LEGACY_PROFILES_KEY);
  if (!rawLegacy) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawLegacy) as LunchlyProfile[];
    const firstProfile = Array.isArray(parsed) ? parsed[0] : null;

    if (firstProfile) {
      window.localStorage.setItem(PROFILE_KEY, JSON.stringify(firstProfile));
      window.localStorage.removeItem(LEGACY_PROFILES_KEY);
      window.localStorage.removeItem(LEGACY_ACTIVE_PROFILE_KEY);

      const legacyAnalyses = getStoredAnalyses().filter((record) => record.profileId === firstProfile.id);
      saveStoredAnalyses(legacyAnalyses);

      return firstProfile;
    }
  } catch {
    return null;
  }

  return null;
}

export function getStoredProfile(): LunchlyProfile | null {
  if (!canUseStorage()) {
    return null;
  }

  return parseProfile(window.localStorage.getItem(PROFILE_KEY)) ?? migrateLegacyProfile();
}

export function getStoredProfiles(): LunchlyProfile[] {
  const profile = getStoredProfile();
  return profile ? [profile] : [];
}

export function saveStoredProfile(profile: LunchlyProfile | null) {
  if (!canUseStorage()) {
    return;
  }

  if (!profile) {
    window.localStorage.removeItem(PROFILE_KEY);
    return;
  }

  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getActiveProfileId() {
  return getStoredProfile()?.id ?? null;
}

export function setActiveProfileId(profileId: string) {
  const current = getStoredProfile();

  if (!current || current.id !== profileId) {
    return;
  }

  saveStoredProfile(current);
}

export function getActiveProfile() {
  return getStoredProfile();
}

export function getStoredAnalyses(): AnalysisRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(ANALYSES_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as AnalysisRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredAnalyses(records: AnalysisRecord[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ANALYSES_KEY, JSON.stringify(records));
}

export function upsertProfile(profile: LunchlyProfile) {
  saveStoredProfile(profile);

  const scopedAnalyses = getStoredAnalyses().filter((record) => record.profileId === profile.id);
  saveStoredAnalyses(scopedAnalyses);

  return [profile];
}

export function saveAnalysis(record: AnalysisRecord) {
  const profile = getStoredProfile();
  if (!profile || record.profileId !== profile.id) {
    return getStoredAnalyses();
  }

  const records = [record, ...getStoredAnalyses().filter((entry) => entry.profileId === profile.id)];
  saveStoredAnalyses(records);
  return records;
}

export function deleteProfile(profileId: string) {
  const profile = getStoredProfile();

  if (!profile || profile.id !== profileId) {
    return getStoredProfiles();
  }

  saveStoredProfile(null);
  saveStoredAnalyses([]);

  return [];
}

export function buildTeaser(profile: Pick<LunchlyProfile, "fullName" | "foodPersonality" | "familyPriorities" | "schoolPolicies">) {
  if (profile.foodPersonality.includes("Sensory-Sensitive")) {
    return `Because ${profile.fullName.split(" ")[0]} is sensory-sensitive, we'll auto-flag soggy sabzi next time.`;
  }

  if (profile.familyPriorities.includes("Brain food & focus")) {
    return `We'll highlight steady-energy carbs and focus-friendly proteins for ${profile.fullName.split(" ")[0]}'s next lunch.`;
  }

  if (profile.schoolPolicies.includes("Plastic-free / only steel tiffin")) {
    return `LunchLogic will now favor steel-tiffin friendly ideas for ${profile.fullName.split(" ")[0]}.`;
  }

  return `LunchLogic is ready to suggest child-specific lunchbox improvements for ${profile.fullName.split(" ")[0]}.`;
}
