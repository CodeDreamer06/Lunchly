import { Suspense } from "react";

import type { Metadata } from "next";

import { OnboardingWizard } from "@/components/onboarding-wizard";

export const metadata: Metadata = {
  title: "Child Profile Setup | LunchLogic",
  description: "Create or edit the single child profile used by LunchLogic on this device.",
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--background)]" />}>
      <OnboardingWizard />
    </Suspense>
  );
}
