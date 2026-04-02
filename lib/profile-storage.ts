"use client";

import type { AnalysisRecord, LunchlyProfile } from "@/lib/lunchly-types";

export type { AnalysisRecord, AnalysisSource, LunchlyProfile } from "@/lib/lunchly-types";

const PROFILES_KEY = "lunchly_profiles_v1";
const ACTIVE_PROFILE_KEY = "lunchly_active_profile_v1";
const ANALYSES_KEY = "lunchly_analyses_v1";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getStoredProfiles(): LunchlyProfile[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(PROFILES_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as LunchlyProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredProfiles(profiles: LunchlyProfile[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfileId() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfileId(profileId: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
}

export function getActiveProfile() {
  const profiles = getStoredProfiles();
  const activeId = getActiveProfileId();

  if (!profiles.length) {
    return null;
  }

  const activeProfile = profiles.find((profile) => profile.id === activeId);
  return activeProfile ?? profiles[0];
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
    const parsed = JSON.parse(raw) as Partial<AnalysisRecord>[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((record) => ({
      id: typeof record.id === "string" ? record.id : `analysis_${crypto.randomUUID()}`,
      profileId: typeof record.profileId === "string" ? record.profileId : "",
      lunchTitle: typeof record.lunchTitle === "string" ? record.lunchTitle : "Saved tiffin",
      notes: typeof record.notes === "string" ? record.notes : "",
      selectedItems: Array.isArray(record.selectedItems)
        ? record.selectedItems.filter((item): item is string => typeof item === "string")
        : [],
      summary:
        typeof record.summary === "string" && record.summary.trim()
          ? record.summary
          : "Lunchly saved this earlier lunchbox analysis before the latest AI upgrade.",
      detectedItems: Array.isArray(record.detectedItems)
        ? record.detectedItems.filter((item): item is string => typeof item === "string")
        : Array.isArray(record.selectedItems)
          ? record.selectedItems.filter((item): item is string => typeof item === "string")
          : [],
      score: typeof record.score === "number" ? record.score : 0,
      proteinScore: typeof record.proteinScore === "number" ? record.proteinScore : 0,
      fibreScore: typeof record.fibreScore === "number" ? record.fibreScore : 0,
      hydrationScore: typeof record.hydrationScore === "number" ? record.hydrationScore : 0,
      flags: Array.isArray(record.flags) ? record.flags.filter((item): item is string => typeof item === "string") : [],
      highlights: Array.isArray(record.highlights)
        ? record.highlights.filter((item): item is string => typeof item === "string")
        : [],
      suggestions: Array.isArray(record.suggestions)
        ? record.suggestions.filter((item): item is string => typeof item === "string")
        : [],
      source: record.source === "ai" || record.source === "fallback" ? record.source : "fallback",
      createdAt: typeof record.createdAt === "string" ? record.createdAt : new Date().toISOString(),
    }));
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
  const profiles = getStoredProfiles();
  const existingIndex = profiles.findIndex((entry) => entry.id === profile.id);

  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }

  saveStoredProfiles(profiles);
  setActiveProfileId(profile.id);

  return profiles;
}

export function saveAnalysis(record: AnalysisRecord) {
  const records = [record, ...getStoredAnalyses()];
  saveStoredAnalyses(records);
  return records;
}

export function deleteProfile(profileId: string) {
  const profiles = getStoredProfiles().filter((profile) => profile.id !== profileId);
  saveStoredProfiles(profiles);

  if (!profiles.length) {
    if (canUseStorage()) {
      window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
    }
  } else if (getActiveProfileId() === profileId) {
    setActiveProfileId(profiles[0].id);
  }

  const records = getStoredAnalyses().filter((record) => record.profileId !== profileId);
  saveStoredAnalyses(records);

  return profiles;
}

export function buildTeaser(profile: Pick<LunchlyProfile, "fullName" | "foodPersonality" | "familyPriorities" | "schoolPolicies">) {
  if (profile.foodPersonality.includes("Sensory-Sensitive")) {
    return `Because ${profile.fullName.split(" ")[0]} is sensory-sensitive, we'll auto-flag soggy sabzi next time.`;
  }

  if (profile.familyPriorities.includes("Brain food & focus")) {
    return `We'll highlight steady-energy carbs and focus-friendly proteins for ${profile.fullName.split(" ")[0]}'s next lunch.`;
  }

  if (profile.schoolPolicies.includes("Plastic-free / only steel tiffin")) {
    return `Lunchly will now favor steel-tiffin friendly ideas for ${profile.fullName.split(" ")[0]}.`;
  }

  return `Lunchly is ready to suggest child-specific lunchbox improvements for ${profile.fullName.split(" ")[0]}.`;
}
