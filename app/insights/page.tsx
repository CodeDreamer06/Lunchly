import type { Metadata } from "next";

import { InsightsExperience } from "@/components/insights-experience";

export const metadata: Metadata = {
  title: "Insights | Lunchly",
  description: "Weekly lunchbox insights and child-specific trend summaries for Lunchly.",
};

export default function InsightsPage() {
  return <InsightsExperience />;
}
