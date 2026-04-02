import type { Metadata } from "next";

import { DashboardExperience } from "@/components/dashboard-experience";

export const metadata: Metadata = {
  title: "Dashboard | LunchLogic",
  description: "The daily home hub for LunchLogic&apos;s AI tiffin analyzer.",
};

export default function DashboardPage() {
  return <DashboardExperience />;
}
