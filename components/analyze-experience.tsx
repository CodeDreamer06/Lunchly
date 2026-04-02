"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { createMockAnalysis } from "@/lib/mock-analyzer";
import { saveAnalysis, type AnalysisRecord } from "@/lib/profile-storage";
import { useLunchlyData } from "@/lib/use-lunchly-data";

const suggestedItems = [
  "Paneer roll",
  "Idli",
  "Sprouts chaat",
  "Roti",
  "Dal cheela",
  "Fruit",
  "Carrot sticks",
  "Cucumber",
  "Curd",
  "Buttermilk",
  "Packaged snack",
];

export function AnalyzeExperience() {
  const router = useRouter();
  const { ready, activeProfile, refresh } = useLunchlyData();
  const [lunchTitle, setLunchTitle] = useState("Paneer roll with fruit");
  const [notes, setNotes] = useState("Steel tiffin. Needs to stay easy to eat in 20 minutes.");
  const [selectedItems, setSelectedItems] = useState<string[]>(["Paneer roll", "Fruit", "Cucumber"]);
  const [result, setResult] = useState<AnalysisRecord | null>(null);

  useEffect(() => {
    if (ready && !activeProfile) {
      router.replace("/onboarding");
    }
  }, [activeProfile, ready, router]);

  if (!ready || !activeProfile) {
    return null;
  }

  const toggleItem = (item: string) => {
    setSelectedItems((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
    );
  };

  const handleAnalyze = () => {
    const analysis = createMockAnalysis({
      profile: activeProfile,
      lunchTitle,
      notes,
      selectedItems,
    });

    saveAnalysis(analysis);
    refresh();
    setResult(analysis);
  };

  return (
    <AppShell
      section="analyze"
      title="Analyze today&apos;s tiffin"
      description="Log what is going into the lunchbox and Lunchly will generate a child-aware nutrition and sensory readout."
      actions={
        <>
          <button type="button" onClick={handleAnalyze} className="app-button-primary">
            Analyze now
          </button>
          <button
            type="button"
            onClick={() => {
              setLunchTitle("Idli with coconut chutney and cucumber");
              setNotes("No reheating allowed. Prefer less mess.");
              setSelectedItems(["Idli", "Cucumber", "Buttermilk"]);
            }}
            className="app-button-secondary"
          >
            Load demo lunch
          </button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <label className="block">
            <span className="text-sm font-semibold text-[var(--ink)]">Lunch title</span>
            <input
              value={lunchTitle}
              onChange={(event) => setLunchTitle(event.target.value)}
              className="mt-2 w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-[var(--ink)]">What should the analyzer know?</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={5}
              className="mt-2 w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
              placeholder="Examples: no reheating, gets soggy, child dislikes mixed textures..."
            />
          </label>

          <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--ink)]">Select lunchbox items</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {suggestedItems.map((item) => {
                const isActive = selectedItems.includes(item);

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(item)}
                    className={`rounded-full px-4 py-3 text-sm font-semibold ${
                      isActive ? "bg-[var(--green-700)] text-white" : "bg-[var(--surface-low)] text-[var(--ink)]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          {result ? (
            <div className="space-y-5">
              <div className="rounded-[1.8rem] bg-[rgba(145,247,142,0.18)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(0,94,23,0.72)]">
                  Latest result
                </p>
                <h2 className="font-headline mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  {result.score}/100
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                  {result.lunchTitle} analyzed for {activeProfile.fullName}.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Protein", value: result.proteinScore },
                  { label: "Fibre", value: result.fibreScore },
                  { label: "Hydration", value: result.hydrationScore },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[1.5rem] bg-[var(--surface-low)] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">
                      {metric.label}
                    </p>
                    <p className="font-headline mt-2 text-3xl font-extrabold text-[var(--ink)]">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.5rem] bg-[var(--surface-low)] p-4">
                <p className="font-headline text-xl font-bold text-[var(--ink)]">Highlights</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-ink)]">
                  {result.highlights.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[1.5rem] bg-[rgba(249,229,52,0.18)] p-4">
                <p className="font-headline text-xl font-bold text-[var(--ink)]">Suggestions</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-ink)]">
                  {result.suggestions.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>

              {result.flags.length ? (
                <div className="rounded-[1.5rem] bg-[rgba(190,45,6,0.08)] p-4">
                  <p className="font-headline text-xl font-bold text-[var(--ink)]">Flags</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted-ink)]">
                    {result.flags.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Link href="/history" className="tertiary-pill">
                  View history
                </Link>
                <Link href="/tips" className="tertiary-pill">
                  Open smart tips
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-[1.8rem] bg-[var(--surface-low)] p-6">
              <p className="font-headline text-2xl font-bold text-[var(--ink)]">Ready when you are</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
                Press Analyze now to generate a local AI-style result for this tiffin and save it to history.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
