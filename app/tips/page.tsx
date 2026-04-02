import type { Metadata } from "next";

import { TipsExperience } from "@/components/tips-experience";

export const metadata: Metadata = {
  title: "Tips | LunchLogic",
  description: "A local smart tips library for tiffin packing, nutrition, sensory support, and budgeting.",
};

export default function TipsPage() {
  return <TipsExperience />;
}
