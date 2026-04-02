"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { useLunchlyData } from "@/lib/use-lunchly-data";

export function InsightsExperience() {
  const router = useRouter();
  const { ready, activeProfile, analyses } = useLunchlyData();

  useEffect(() => {
    if (ready && !activeProfile) {
      router.replace("/onboarding");
    }
  }, [activeProfile, ready, router]);

  if (!ready || !activeProfile) {
    return null;
  }

  const childAnalyses = analyses.filter((record) => record.profileId === activeProfile.id);
  const avgScore = childAnalyses.length
    ? Math.round(childAnalyses.reduce((sum, record) => sum + record.score, 0) / childAnalyses.length)
    : 84;
  const sensoryRisk = activeProfile.foodPersonality.includes("Sensory-Sensitive") ? "High" : "Moderate";
  const bestMetric = childAnalyses.length
    ? Math.max(
        Math.round(childAnalyses.reduce((sum, record) => sum + record.proteinScore, 0) / childAnalyses.length),
        Math.round(childAnalyses.reduce((sum, record) => sum + record.fibreScore, 0) / childAnalyses.length),
      )
    : 78;

  return (
    <AppShell
      section="insights"
      title="Weekly insights"
      description="Track how this child&apos;s lunchbox patterns are changing over time, without making parents feel judged."
      actions={<Link href="/analyze" className="app-button-primary">Analyze another tiffin</Link>}
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="soft-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">Average score</p>
          <p className="font-headline mt-3 text-4xl font-extrabold text-[var(--ink)]">{avgScore}%</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">A weekly pulse on overall lunchbox quality.</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">Sensory risk</p>
          <p className="font-headline mt-3 text-4xl font-extrabold text-[var(--ink)]">{sensoryRisk}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">Based on profile traits plus recent saved analyses.</p>
        </div>
        <div className="soft-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">Strongest metric</p>
          <p className="font-headline mt-3 text-4xl font-extrabold text-[var(--ink)]">{bestMetric}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">The area where Lunchly sees the most consistency so far.</p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <p className="font-headline text-2xl font-bold text-[var(--ink)]">This week&apos;s take</p>
          <div className="mt-5 space-y-4">
            {[
              `Lunchly sees ${activeProfile.fullName.split(" ")[0]} responding best to familiar textures with one new element at a time.`,
              `The current family priority of ${activeProfile.familyPriorities[0] ?? "balanced macros"} is showing up clearly in recent lunches.`,
              childAnalyses.length
                ? "Saved analyses are now strong enough to compare packing patterns from one week to the next."
                : "Run your first few analyses to unlock more child-specific trend signals here.",
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 text-sm leading-7 text-[var(--muted-ink)]">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <p className="font-headline text-2xl font-bold text-[var(--ink)]">Focus areas</p>
          <div className="mt-5 space-y-4">
            {[
              { label: "Protein support", value: childAnalyses.length ? 82 : 74 },
              { label: "Fibre exposure", value: childAnalyses.length ? 76 : 68 },
              { label: "Hydration support", value: childAnalyses.length ? 70 : 64 },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--ink)]">
                  <span>{metric.label}</span>
                  <span>{metric.value}%</span>
                </div>
                <div className="h-3 rounded-full bg-[var(--surface-low)]">
                  <div className="h-full rounded-full bg-[var(--green-700)]" style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
