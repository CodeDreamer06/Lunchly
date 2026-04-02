import type { Metadata } from "next";

import { AnalyzeExperience } from "@/components/analyze-experience";

export const metadata: Metadata = {
  title: "Analyze | LunchLogic",
  description: "Analyze a tiffin locally with child-aware nutrition, sensory, and school-rule suggestions.",
};

export default function AnalyzePage() {
  return <AnalyzeExperience />;
}
