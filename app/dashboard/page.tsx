import type { Metadata } from "next";

import { DashboardExperience } from "@/components/dashboard-experience";

export const metadata: Metadata = {
  title: "Dashboard | Lunchly",
  description: "The daily home hub for Lunchly&apos;s AI tiffin analyzer.",
};

export default function DashboardPage() {
  return <DashboardExperience />;
}
