"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ScreenPreview } from "@/components/screen-preview";
import type { StitchScreen } from "@/lib/stitch-data";
import { getActiveProfile, getStoredProfiles, type LunchlyProfile } from "@/lib/profile-storage";

type DashboardExperienceProps = {
  currentScreen: StitchScreen;
  screens: StitchScreen[];
  next: StitchScreen | null;
};

export function DashboardExperience({
  currentScreen,
  screens,
  next,
}: DashboardExperienceProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<LunchlyProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const activeProfile = getActiveProfile();

    if (!activeProfile && getStoredProfiles().length === 0) {
      router.replace("/onboarding");
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setProfile(activeProfile);
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [router]);

  if (!isReady) {
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

  const childFirstName = profile?.fullName.split(" ")[0] ?? "Arjun";
  const caregiverName = profile?.caregiverName || "Priya";

  return (
    <AppShell currentScreen={currentScreen} screens={screens} previous={null} next={next}>
      <section className="space-y-5">
        <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.52)]">
                Child Dashboard
              </p>
              <h2 className="font-headline mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                Namaste, {caregiverName}! Ready to make {childFirstName}&apos;s lunchbox a nutrition superstar today?
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted-ink)]">
                This is your daily home hub for profile-aware analysis, quick wins, and trend-driven tweaks.
              </p>
            </div>
            <Link href="/screens/ai_lunchbox_analysis_deep_dive" className="app-button-primary min-w-[16rem] text-base">
              Analyze Lunchbox Today
            </Link>
          </div>
          <p className="mt-3 text-sm font-medium text-[var(--green-700)]">Takes 8 seconds</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="soft-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
              Avg. Nutrition Score
            </p>
            <p className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              87/100
            </p>
            <p className="mt-2 text-sm text-[var(--muted-ink)]">A strong month for balanced, lunch-break friendly fuel.</p>
          </div>
          <div className="soft-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
              Top Win
            </p>
            <p className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              +18%
            </p>
            <p className="mt-2 text-sm text-[var(--muted-ink)]">Protein vs last week, thanks to easier-to-finish pairings.</p>
          </div>
          <div className="soft-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
              Current Streak
            </p>
            <p className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              5
            </p>
            <p className="mt-2 text-sm text-[var(--muted-ink)]">Healthy lunches in a row with fewer leftovers coming home.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/onboarding?mode=edit" className="tertiary-pill">
            Edit Profile
          </Link>
          <Link href="/screens/ai_lunchbox_analysis_deep_dive" className="tertiary-pill">
            Past Analyses
          </Link>
          <Link href="/screens/tiny_tweaks_swap_engine" className="tertiary-pill">
            Smart Tips Library
          </Link>
          <Link href="/onboarding?mode=add" className="tertiary-pill">
            Add Sibling
          </Link>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_18px_48px_rgba(56,56,51,0.05)] sm:p-4">
          <div className="flex items-center justify-between px-2 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.42)]">
            <span>Screen Preview</span>
            <span>Main Dashboard</span>
          </div>
          <ScreenPreview
            slug="morning_rush_dashboard"
            title="Morning Rush Dashboard"
            className="h-[78vh] min-h-[860px] w-full rounded-[1.6rem] bg-[var(--background)]"
          />
        </section>
      </section>
    </AppShell>
  );
}
