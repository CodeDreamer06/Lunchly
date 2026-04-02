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
  independenceLevel: number;
  lunchEatingTime: string;
  appetiteStyle: string;
  foodPersonality: string[];
  activityLevel: string;
  specialDays: string[];
  familyPriorities: string[];
  createdAt: string;
};

const PROFILES_KEY = "lunchly_profiles_v1";
const ACTIVE_PROFILE_KEY = "lunchly_active_profile_v1";

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
