import type { Metadata } from "next";

import { HistoryExperience } from "@/components/history-experience";

export const metadata: Metadata = {
  title: "History | LunchLogic",
  description: "Saved local analysis history for LunchLogic&apos;s AI tiffin analyzer.",
};

export default function HistoryPage() {
  return <HistoryExperience />;
}
