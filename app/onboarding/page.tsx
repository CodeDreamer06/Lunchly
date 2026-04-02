import { Suspense } from "react";

import type { Metadata } from "next";

import { OnboardingWizard } from "@/components/onboarding-wizard";

export const metadata: Metadata = {
  title: "Onboarding | LunchLogic",
  description: "Create or edit a child profile for LunchLogic using a six-step onboarding wizard.",
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--background)]" />}>
      <OnboardingWizard />
    </Suspense>
  );
}
