import { Suspense } from "react";

import type { Metadata } from "next";

import { OnboardingWizard } from "@/components/onboarding-wizard";

export const metadata: Metadata = {
  title: "Onboarding | Lunchly",
  description: "Create or edit a child profile for Lunchly using a six-step onboarding wizard with AI profile suggestions.",
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[var(--background)]" />}>
      <OnboardingWizard />
    </Suspense>
  );
}
