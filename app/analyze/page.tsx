import type { Metadata } from "next";

import { AnalyzeExperience } from "@/components/analyze-experience";

export const metadata: Metadata = {
  title: "Analyze | Lunchly",
  description: "Analyze a tiffin with AI vision and child-aware nutrition, sensory, and school-rule suggestions.",
};

export default function AnalyzePage() {
  return <AnalyzeExperience />;
}
