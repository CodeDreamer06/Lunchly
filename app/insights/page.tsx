import type { Metadata } from "next";

import { InsightsExperience } from "@/components/insights-experience";

export const metadata: Metadata = {
  title: "Insights | LunchLogic",
  description: "Weekly lunchbox insights and child-specific trend summaries for LunchLogic.",
};

export default function InsightsPage() {
  return <InsightsExperience />;
}
