import type { Metadata } from "next";

import { DashboardExperience } from "@/components/dashboard-experience";
import { getAllScreens, getScreenBySlug } from "@/lib/stitch";

export const metadata: Metadata = {
  title: "Dashboard | LunchLogic",
  description: "The child-specific LunchLogic dashboard for lunch analysis, profile-aware insights, and next actions.",
};

export default function DashboardPage() {
  const currentScreen = getScreenBySlug("morning_rush_dashboard");
  const screens = getAllScreens();
  const next = getScreenBySlug("ai_lunchbox_analysis_deep_dive");

  if (!currentScreen) {
    return null;
  }

  return <DashboardExperience currentScreen={currentScreen} screens={screens} next={next} />;
}
