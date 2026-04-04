"use client";

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  photo?: string;
  allergies: string[];
  schoolPolicies: string[];
  sensoryPreferences: string[];
  eatingHabits: string;
}

export interface UserData {
  isOnboarded: boolean;
  childProfile: ChildProfile;
}

const STORAGE_KEY = "lunchlogic_user_data";

export function getUserData(): UserData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UserData;
  } catch (error) {
    console.error("Error reading user data from localStorage:", error);
    return null;
  }
}

export function setUserData(data: UserData): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("lunchlogic-user-data-changed"));
  } catch (error) {
    console.error("Error saving user data to localStorage:", error);
    throw new Error("Failed to save user data");
  }
}

export function updateChildProfile(profile: Partial<ChildProfile>): void {
  const current = getUserData();
  if (!current) {
    throw new Error("No existing user data found");
  }
  
  const updated: UserData = {
    ...current,
    childProfile: {
      ...current.childProfile,
      ...profile,
    },
  };
  
  setUserData(updated);
}

export function markOnboardingComplete(): void {
  const current = getUserData();
  if (!current) {
    throw new Error("No user data found to complete onboarding");
  }
  
  setUserData({
    ...current,
    isOnboarded: true,
  });
}

export function createInitialUserData(profile: Omit<ChildProfile, "id">): UserData {
  const userData: UserData = {
    isOnboarded: false,
    childProfile: {
      ...profile,
      id: "default",
    },
  };
  
  setUserData(userData);
  return userData;
}

// AI-Generated Content Storage

export interface LunchSuggestion {
  id: string;
  content: string;
  ingredients?: string[];
  generatedAt: string;
}

export interface FoodItem {
  name: string;
  category: "protein" | "carbs" | "vegetable" | "fruit" | "dairy" | "snack" | "other";
  nutrients: string[];
  portionSize: string;
  calories: number;
  confidence: number;
  position: { x: number; y: number };
  color: string;
  kidFriendlyScore: number;
  allergens: string[];
}

export interface NutritionScore {
  overall: number;
  protein: number;
  fiber: number;
  sugar: number;
  variety: number;
  balance: number;
}

export interface EnergyCurvePoint {
  time: string;
  energyLevel: number;
  label: string;
}

export interface KidAcceptanceProfile {
  easeOfOpening: "easy" | "medium" | "hard";
  messFactor: "low" | "medium" | "high";
  eatingTime: string;
  likelihoodOfFinishing: number;
}

export interface LeftoverPrediction {
  item: string;
  reason: string;
  likelihood: "low" | "medium" | "high";
  suggestion: string;
}

export interface SensoryTextureMap {
  crunchy: number;
  soft: number;
  wet: number;
  mixed: number;
}

export interface StructuredAnalysis {
  foods: FoodItem[];
  nutritionScore: NutritionScore;
  energyCurve: EnergyCurvePoint[];
  kidAcceptance: KidAcceptanceProfile;
  leftovers: LeftoverPrediction[];
  sensoryMap: SensoryTextureMap;
  summary: string;
  improvementTip: string;
  allergyWarnings: string[];
}

export interface AnalysisResult {
  id: string;
  imageData: string;
  analysis: string;
  structuredData?: StructuredAnalysis;
  analyzedAt: string;
}

export interface WeeklyPlan {
  id: string;
  content: string;
  budget?: number;
  generatedAt: string;
}

export interface FoodSwap {
  id: string;
  rejectedFood: string;
  suggestions: string;
  generatedAt: string;
}

export interface AvailableIngredients {
  items: string[];
  lastUpdated: string;
}

const AI_STORAGE_KEY = "lunchlogic_ai_data";

interface AIData {
  suggestions: LunchSuggestion[];
  analyses: AnalysisResult[];
  weeklyPlans: WeeklyPlan[];
  foodSwaps: FoodSwap[];
  ingredients: AvailableIngredients;
}

function getAIData(): AIData {
  if (typeof window === "undefined") {
    return { suggestions: [], analyses: [], weeklyPlans: [], foodSwaps: [], ingredients: { items: [], lastUpdated: "" } };
  }
  
  try {
    const stored = localStorage.getItem(AI_STORAGE_KEY);
    if (!stored) {
      return { suggestions: [], analyses: [], weeklyPlans: [], foodSwaps: [], ingredients: { items: [], lastUpdated: "" } };
    }
    return JSON.parse(stored) as AIData;
  } catch (error) {
    console.error("Error reading AI data from localStorage:", error);
    return { suggestions: [], analyses: [], weeklyPlans: [], foodSwaps: [], ingredients: { items: [], lastUpdated: "" } };
  }
}

function setAIData(data: AIData): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving AI data to localStorage:", error);
    throw new Error("Failed to save AI data");
  }
}

export function saveLunchSuggestion(suggestion: LunchSuggestion): void {
  const data = getAIData();
  data.suggestions.unshift(suggestion);
  if (data.suggestions.length > 10) data.suggestions.pop();
  setAIData(data);
}

export function getLunchSuggestions(): LunchSuggestion[] {
  return getAIData().suggestions;
}

export function saveAnalysisResult(result: AnalysisResult): void {
  const data = getAIData();
  data.analyses.unshift(result);
  if (data.analyses.length > 20) data.analyses.pop();
  setAIData(data);
}

export function getAnalysisResults(): AnalysisResult[] {
  return getAIData().analyses;
}

export function saveWeeklyPlan(plan: WeeklyPlan): void {
  const data = getAIData();
  data.weeklyPlans.unshift(plan);
  if (data.weeklyPlans.length > 5) data.weeklyPlans.pop();
  setAIData(data);
}

export function getWeeklyPlans(): WeeklyPlan[] {
  return getAIData().weeklyPlans;
}

export function saveFoodSwap(swap: FoodSwap): void {
  const data = getAIData();
  data.foodSwaps.unshift(swap);
  if (data.foodSwaps.length > 20) data.foodSwaps.pop();
  setAIData(data);
}

export function getFoodSwaps(): FoodSwap[] {
  return getAIData().foodSwaps;
}

export function setAvailableIngredients(items: string[]): void {
  const data = getAIData();
  data.ingredients = { items, lastUpdated: new Date().toISOString() };
  setAIData(data);
}

export function getAvailableIngredients(): AvailableIngredients {
  return getAIData().ingredients;
}
