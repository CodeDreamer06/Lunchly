import type { Metadata } from "next";

import { HistoryExperience } from "@/components/history-experience";

export const metadata: Metadata = {
  title: "History | Lunchly",
  description: "Saved local analysis history for Lunchly&apos;s AI tiffin analyzer.",
};

export default function HistoryPage() {
  return <HistoryExperience />;
}
