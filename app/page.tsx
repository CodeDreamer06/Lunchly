"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "./lib/storage";
import OnboardingWizard from "./components/OnboardingWizard";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const userData = getUserData();
    
    if (!userData || !userData.isOnboarded) {
      setNeedsOnboarding(true);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  const handleOnboardingComplete = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (needsOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return null;
}
