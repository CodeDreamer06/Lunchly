"use client";

import { ChangeEvent, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import type { AnalyzeLunchResponse } from "@/lib/ai-contracts";
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
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!lunchTitle.trim() && !notes.trim() && !selectedItems.length && !imageDataUrl) {
      setError("Add a lunch title, some items, notes, or a photo before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setWarning("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: activeProfile,
          lunchTitle,
          notes,
          selectedItems,
          imageDataUrl,
        }),
      });

      const data = (await response.json()) as AnalyzeLunchResponse | { error?: string };

      if (!response.ok || !("record" in data)) {
        const message = "error" in data && typeof data.error === "string"
          ? data.error
          : "Lunchly could not analyze this tiffin.";
        throw new Error(message);
      }

      const responseData = data as AnalyzeLunchResponse;

      saveAnalysis(responseData.record);
      refresh();
      setResult(responseData.record);
      setWarning(responseData.warning || "");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Lunchly could not analyze this tiffin.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppShell
      section="analyze"
      title="Analyze today&apos;s tiffin"
      description="Describe the tiffin or upload a photo and Lunchly will generate a child-aware nutrition, sensory, and policy readout."
      actions={
        <>
          <button type="button" onClick={handleAnalyze} className="app-button-primary" disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Analyze now"}
          </button>
          <button
            type="button"
            onClick={() => {
              setLunchTitle("Idli with coconut chutney and cucumber");
              setNotes("No reheating allowed. Prefer less mess.");
              setSelectedItems(["Idli", "Cucumber", "Buttermilk"]);
              setImageDataUrl("");
              setError("");
              setWarning("");
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

          <div className="mt-5 rounded-[1.5rem] bg-[var(--surface-low)] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--ink)]">Optional photo for vision analysis</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted-ink)]">
                  Upload a tiffin photo and Lunchly will combine the image with your notes.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-[var(--ink)] shadow-[0_12px_26px_rgba(56,56,51,0.05)]">
                Upload photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {imageDataUrl ? (
              <div className="mt-4 overflow-hidden rounded-[1.5rem] bg-white p-3">
                <Image
                  src={imageDataUrl}
                  alt="Tiffin preview"
                  width={960}
                  height={640}
                  unoptimized
                  className="h-48 w-full rounded-[1.2rem] object-cover"
                />
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="mt-5 rounded-[1.2rem] bg-[rgba(190,45,6,0.08)] px-4 py-3 text-sm font-medium text-[color:#7d2207]">
              {error}
            </p>
          ) : null}
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          {result ? (
            <div className="space-y-5">
              <div className="rounded-[1.8rem] bg-[rgba(145,247,142,0.18)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(0,94,23,0.72)]">
                  Latest result {result.source === "ai" ? "AI-powered" : "Local fallback"}
                </p>
                <h2 className="font-headline mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  {result.score}/100
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                  {result.lunchTitle} analyzed for {activeProfile.fullName}.
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">{result.summary}</p>
                {warning ? (
                  <p className="mt-3 rounded-[1rem] bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:#7d5b00]">
                    {warning}
                  </p>
                ) : null}
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

              {result.detectedItems.length ? (
                <div className="rounded-[1.5rem] bg-white p-1">
                  <p className="font-headline px-3 pt-3 text-xl font-bold text-[var(--ink)]">Detected items</p>
                  <div className="mt-3 flex flex-wrap gap-3 px-3 pb-3">
                    {result.detectedItems.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-[var(--surface-low)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

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
                Press Analyze now to send today&apos;s tiffin through Lunchly&apos;s AI analyzer and save the result to
                history.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
