import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

export type StitchScreen = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  category: string;
  accent: "green" | "yellow" | "blue";
  shellSection:
    | "dashboard"
    | "scanner"
    | "trends"
    | "swap"
    | "profiles"
    | "planning"
    | "shopping"
    | "caregiver";
  related: string[];
};

const STITCH_ROOT = path.join(process.cwd(), "stitch");

export const STITCH_SCREENS: StitchScreen[] = [
  {
    slug: "morning_rush_dashboard",
    title: "Morning Rush Dashboard",
    eyebrow: "Launch Flow",
    summary: "A fast, calm launchpad for scanning today's lunch and reading the most important nudges before school.",
    category: "Daily Dashboard",
    accent: "green",
    shellSection: "dashboard",
    related: ["ai_lunchbox_analysis_deep_dive", "weekly_pattern_intelligence", "tiny_tweaks_swap_engine"],
  },
  {
    slug: "child_profile_setup",
    title: "Child Profile Setup",
    eyebrow: "Profile",
    summary: "A sensory-first child profile with preferences, school policies, and independence notes.",
    category: "Profiles",
    accent: "green",
    shellSection: "profiles",
    related: ["lunchbox_lab_sensory_mode", "logistics_openability_review", "caregiver_report_card_share_hub"],
  },
  {
    slug: "weekly_pattern_intelligence",
    title: "Weekly Pattern Intelligence",
    eyebrow: "Insights",
    summary: "A weekly pulse on variety, exposure, and progress that feels encouraging instead of clinical.",
    category: "Trends",
    accent: "blue",
    shellSection: "trends",
    related: ["morning_rush_dashboard", "caregiver_report_card_share_hub", "tiny_tweaks_swap_engine"],
  },
  {
    slug: "tiny_tweaks_swap_engine",
    title: "Tiny Tweaks Swap Engine",
    eyebrow: "Swap Engine",
    summary: "Low-friction ingredient swaps and remix ideas that keep lunchboxes familiar but gently improving.",
    category: "Optimization",
    accent: "yellow",
    shellSection: "swap",
    related: ["fridge_remix_pantry_prep", "lunchbox_lab_sensory_mode", "smart_store_map_budget_builder"],
  },
  {
    slug: "lunchbox_lab_sensory_mode",
    title: "Lunchbox Lab",
    eyebrow: "Experiments",
    summary: "A playful experimentation mode for bridging textures, logging tries, and planning the next exposure.",
    category: "Sensory Lab",
    accent: "blue",
    shellSection: "swap",
    related: ["child_profile_setup", "tiny_tweaks_swap_engine", "weekly_pattern_intelligence"],
  },
  {
    slug: "ai_lunchbox_analysis_deep_dive",
    title: "AI Lunchbox Analysis",
    eyebrow: "Deep Dive",
    summary: "A richer breakdown of what is working in a lunchbox, where the friction is, and how to improve it.",
    category: "Analysis",
    accent: "green",
    shellSection: "scanner",
    related: ["morning_rush_dashboard", "logistics_openability_review", "tiny_tweaks_swap_engine"],
  },
  {
    slug: "logistics_openability_review",
    title: "Logistics & Openability Review",
    eyebrow: "Pre-Flight",
    summary: "A practical packing review for pace, openability, texture integrity, and school-day constraints.",
    category: "Logistics",
    accent: "blue",
    shellSection: "scanner",
    related: ["ai_lunchbox_analysis_deep_dive", "child_profile_setup", "weekly_planning_prep_ahead_planner"],
  },
  {
    slug: "weekly_planning_prep_ahead_planner",
    title: "Weekly Planning & Prep",
    eyebrow: "Prep Ahead",
    summary: "A prep-once weekly system with shopping, repurposable components, and speed-prep support.",
    category: "Planning",
    accent: "green",
    shellSection: "planning",
    related: ["fridge_remix_pantry_prep", "smart_store_map_budget_builder", "morning_rush_dashboard"],
  },
  {
    slug: "fridge_remix_pantry_prep",
    title: "Fridge Remix",
    eyebrow: "Remix",
    summary: "Detected leftovers become realistic lunch ideas, supported by pantry-prep and repurposing prompts.",
    category: "Planning",
    accent: "yellow",
    shellSection: "planning",
    related: ["tiny_tweaks_swap_engine", "weekly_planning_prep_ahead_planner", "smart_store_map_budget_builder"],
  },
  {
    slug: "smart_store_map_budget_builder",
    title: "Smart Store Map",
    eyebrow: "Budget Builder",
    summary: "A guided shopping view for value picks, sale items, and lunch-friendly budgeting decisions.",
    category: "Shopping",
    accent: "blue",
    shellSection: "shopping",
    related: ["weekly_planning_prep_ahead_planner", "fridge_remix_pantry_prep", "caregiver_report_card_share_hub"],
  },
  {
    slug: "caregiver_report_card_share_hub",
    title: "Caregiver Hub",
    eyebrow: "Share Hub",
    summary: "A handoff-friendly report card for caregivers with goals, wins, policies, and next steps.",
    category: "Collaboration",
    accent: "green",
    shellSection: "caregiver",
    related: ["weekly_pattern_intelligence", "child_profile_setup", "morning_rush_dashboard"],
  },
];

export const FEATURED_SCREEN_SLUG = "morning_rush_dashboard";

export function getAllScreens() {
  return STITCH_SCREENS;
}

export function getScreenBySlug(slug: string) {
  return STITCH_SCREENS.find((screen) => screen.slug === slug) ?? null;
}

function getScreenPath(slug: string, fileName: "code.html" | "screen.png") {
  return path.join(STITCH_ROOT, slug, fileName);
}

export async function readScreenHtml(slug: string) {
  return fs.readFile(getScreenPath(slug, "code.html"), "utf8");
}

export async function readScreenPng(slug: string) {
  return fs.readFile(getScreenPath(slug, "screen.png"));
}
