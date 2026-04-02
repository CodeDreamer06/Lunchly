"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { useLunchlyData } from "@/lib/use-lunchly-data";

export function HistoryExperience() {
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

  return (
    <AppShell
      section="history"
      title="Past analyses"
      description="Every saved lunchbox analysis for the active child lives here so parents can spot progress over time."
      actions={<Link href="/analyze" className="app-button-primary">Analyze another tiffin</Link>}
    >
      {childAnalyses.length ? (
        <div className="grid gap-5">
          {childAnalyses.map((record) => (
            <article key={record.id} className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                  <h2 className="font-headline mt-2 text-2xl font-bold text-[var(--ink)]">{record.lunchTitle}</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-ink)]">{record.notes || "No extra notes added."}</p>
                </div>
                <div className="rounded-full bg-[rgba(145,247,142,0.22)] px-4 py-3 font-headline text-2xl font-extrabold text-[var(--green-700)]">
                  {record.score}/100
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[1.5rem] bg-[var(--surface-low)] p-4 text-sm leading-6 text-[var(--muted-ink)]">
                  <p className="font-headline text-lg font-bold text-[var(--ink)]">Highlights</p>
                  <ul className="mt-2 space-y-1">
                    {record.highlights.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.5rem] bg-[rgba(249,229,52,0.18)] p-4 text-sm leading-6 text-[var(--muted-ink)]">
                  <p className="font-headline text-lg font-bold text-[var(--ink)]">Suggestions</p>
                  <ul className="mt-2 space-y-1">
                    {record.suggestions.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[1.5rem] bg-[rgba(190,45,6,0.08)] p-4 text-sm leading-6 text-[var(--muted-ink)]">
                  <p className="font-headline text-lg font-bold text-[var(--ink)]">Flags</p>
                  <ul className="mt-2 space-y-1">
                    {record.flags.length ? record.flags.map((item) => <li key={item}>- {item}</li>) : <li>- No major flags saved.</li>}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <h2 className="font-headline text-3xl font-extrabold text-[var(--ink)]">No saved analyses yet</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
            Run today&apos;s tiffin through the analyzer and Lunchly will save the result here automatically.
          </p>
        </div>
      )}
    </AppShell>
  );
}
