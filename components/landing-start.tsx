"use client";

import { startTransition, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { getStoredProfiles } from "@/lib/profile-storage";

export function LandingStart() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const handleStart = () => {
    setIsChecking(true);

    startTransition(() => {
      const hasProfile = getStoredProfiles().length > 0;
      router.push(hasProfile ? "/dashboard" : "/onboarding");
    });
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="space-y-8">
            <div className="inline-flex rounded-full bg-[rgba(145,247,142,0.22)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green-700)]">
              Weekly Pattern Intelligence Inspired
            </div>
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:rgba(56,56,51,0.56)]">
                Child-specific lunchbox coaching
              </p>
              <h1 className="font-headline max-w-3xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
                Lunchly turns every tiffin into a smarter daily ritual.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted-ink)]">
                Build your child&apos;s profile once, analyze lunchboxes in seconds, and unlock tips that feel
                encouraging instead of clinical.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleStart}
                className="app-button-primary min-w-[14rem] text-lg"
              >
                {isChecking ? "Opening Lunchly..." : "Start"}
              </button>
              <Link href="/screens/weekly_pattern_intelligence" className="app-button-secondary">
                Preview Insights Screen
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="soft-card p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                  First-Time Friendly
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                  Zero dead-ends. Lunchly guides parents from setup to insight in one flow.
                </p>
              </div>
              <div className="soft-card p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                  Local First
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                  Your data stays on your device until you choose to sync.
                </p>
              </div>
              <div className="soft-card p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                  Child-Specific AI
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                  Sensory style, allergies, school rules, and family goals all shape the guidance.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
            <div className="rounded-[2rem] bg-[var(--surface-low)] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                What happens next
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "Press Start and Lunchly checks whether your child profile already exists in local storage.",
                  "If a profile exists, you'll land on the child dashboard with analyze, trends, and quick links ready to go.",
                  "If not, the six-step onboarding wizard walks you through allergies, sensory style, weekly goals, and school rules.",
                  "After creation, Lunchly shows a personalized teaser tip and redirects straight into the dashboard.",
                ].map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-[1.5rem] bg-white px-4 py-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(0,117,31,0.1)] font-headline text-lg font-bold text-[var(--green-700)]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-[var(--muted-ink)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
