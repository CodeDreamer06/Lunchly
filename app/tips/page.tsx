import type { Metadata } from "next";

import { TipsExperience } from "@/components/tips-experience";

export const metadata: Metadata = {
  title: "Tips | Lunchly",
  description: "AI-guided tiffin tips for packing, nutrition, sensory support, school rules, and budgeting.",
};

export default function TipsPage() {
  return <TipsExperience />;
}
