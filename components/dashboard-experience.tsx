"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { useLunchlyData } from "@/lib/use-lunchly-data";

export function DashboardExperience() {
  const router = useRouter();
  const { ready, activeProfile, analyses } = useLunchlyData();

  useEffect(() => {
    if (ready && !activeProfile) {
      router.replace("/onboarding");
    }
  }, [activeProfile, ready, router]);

  if (!ready || !activeProfile) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center">
          <div className="rounded-[2rem] bg-white px-8 py-7 text-center shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
            <p className="font-headline text-2xl font-bold text-[var(--ink)]">Loading your dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  const childFirstName = activeProfile.fullName.split(" ")[0];
  const childAnalyses = analyses.filter((record) => record.profileId === activeProfile.id);
  const avgScore = childAnalyses.length
    ? Math.round(childAnalyses.reduce((sum, record) => sum + record.score, 0) / childAnalyses.length)
    : 87;
  const streak = childAnalyses.length ? Math.min(childAnalyses.length, 5) : 5;
  const topWin = activeProfile.familyPriorities.includes("Balanced macros (protein + carbs)")
    ? "+18% protein vs last week"
    : activeProfile.familyPriorities.includes("Brain food & focus")
      ? "Steadier energy for school mornings"
      : "Better lunchbox balance this week";

  return (
    <AppShell
      section="dashboard"
      title={`Namaste, ${activeProfile.caregiverName || "Priya"}! Ready to make ${childFirstName}'s lunchbox a nutrition superstar today?`}
      description="This is the daily home hub for analyzing tiffins, tracking progress, and acting on child-specific AI suggestions."
      actions={
        <Link href="/analyze" className="app-button-primary">
          Analyze Lunchbox Today
        </Link>
      }
    >
      <p className="-mt-2 text-sm font-medium text-[var(--green-700)]">Takes 8 seconds</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="soft-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
            Avg. Nutrition Score
          </p>
          <p className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            {avgScore}/100
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">A snapshot of this month&apos;s lunchbox quality.</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
            Top Win
          </p>
          <p className="font-headline mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            {topWin}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">A practical improvement Lunchly would keep building on.</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
            Current Streak
          </p>
          <p className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            {streak} in a row
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">Healthy lunches tracked recently for this child.</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/onboarding?mode=edit" className="tertiary-pill">
          Edit Profile
        </Link>
        <Link href="/history" className="tertiary-pill">
          Past Analyses
        </Link>
        <Link href="/tips" className="tertiary-pill">
          Smart Tips Library
        </Link>
        <Link href="/onboarding?mode=add" className="tertiary-pill">
          Add Sibling
        </Link>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
            Today&apos;s AI focus
          </p>
          <h2 className="font-headline mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            Lunchly will watch for sensory fit, protein balance, and school-rule conflicts
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.6rem] bg-[var(--surface-low)] p-4">
              <p className="font-headline text-lg font-bold text-[var(--ink)]">Sensory check</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                {activeProfile.foodPersonality.includes("Sensory-Sensitive")
                  ? "Flag soggy, mixed-texture, and strong-smell foods first."
                  : "Look for texture variety without overwhelming the child."}
              </p>
            </div>
            <div className="rounded-[1.6rem] bg-[var(--surface-low)] p-4">
              <p className="font-headline text-lg font-bold text-[var(--ink)]">Nutrition check</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                Prioritize {activeProfile.familyPriorities[0] ?? "balanced macros"} in the result summary.
              </p>
            </div>
            <div className="rounded-[1.6rem] bg-[var(--surface-low)] p-4">
              <p className="font-headline text-lg font-bold text-[var(--ink)]">Policy check</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                {activeProfile.schoolPolicies.length
                  ? `${activeProfile.schoolPolicies[0]} is already part of the analysis rules.`
                  : "No school restrictions saved yet, so Lunchly focuses on nutrition and ease."}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
            Next steps
          </p>
          <div className="mt-5 space-y-4">
            <Link href="/analyze" className="block rounded-[1.6rem] bg-[rgba(0,117,31,0.1)] px-5 py-5">
              <p className="font-headline text-xl font-bold text-[var(--ink)]">Run today&apos;s analysis</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                Enter today&apos;s tiffin items and save a new AI-style result.
              </p>
            </Link>
            <Link href="/insights" className="block rounded-[1.6rem] bg-[var(--surface-low)] px-5 py-5">
              <p className="font-headline text-xl font-bold text-[var(--ink)]">Review weekly pulse</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                See what is improving and where this child still needs support.
              </p>
            </Link>
            <Link href="/profiles" className="block rounded-[1.6rem] bg-[var(--surface-low)] px-5 py-5">
              <p className="font-headline text-xl font-bold text-[var(--ink)]">Manage child profiles</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                Switch active child, edit details, or add a sibling.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
