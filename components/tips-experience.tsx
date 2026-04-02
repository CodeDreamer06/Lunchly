"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import type { AiTipCard, TipsResponse } from "@/lib/ai-contracts";
import { defaultTipLibrary } from "@/lib/tip-library";
import { useLunchlyData } from "@/lib/use-lunchly-data";

export function TipsExperience() {
  const router = useRouter();
  const { ready, activeProfile, analyses } = useLunchlyData();
  const [filter, setFilter] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);
  const [intro, setIntro] = useState("");
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [aiTips, setAiTips] = useState<AiTipCard[]>([]);

  useEffect(() => {
    if (ready && !activeProfile) {
      router.replace("/onboarding");
    }
  }, [activeProfile, ready, router]);

  if (!ready || !activeProfile) {
    return null;
  }

  const childAnalyses = analyses.filter((record) => record.profileId === activeProfile.id);
  const activeTips = aiTips.length ? aiTips : defaultTipLibrary;
  const categories = ["All", ...new Set(activeTips.map((tip) => tip.category))];

  const personalizedTips = activeTips.filter((tip) => {
    if (filter !== "All" && tip.category !== filter) {
      return false;
    }

    if (activeProfile.foodPersonality.includes("Sensory-Sensitive") && tip.category === "Sensory") {
      return true;
    }

    if (activeProfile.foodPersonality.includes("Budget-Conscious") && tip.category === "Budget") {
      return true;
    }

    if (filter === "All") {
      return true;
    }

    return tip.category === filter;
  });

  const generateAiTips = async () => {
    setIsGenerating(true);
    setWarning("");
    setError("");

    try {
      const response = await fetch("/api/tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: activeProfile,
          analyses: childAnalyses,
        }),
      });

      const data = (await response.json()) as TipsResponse | { error?: string };

      if (!response.ok || "error" in data) {
        const message = "error" in data && typeof data.error === "string"
          ? data.error
          : "Lunchly could not generate smart tips.";
        throw new Error(message);
      }

      const responseData = data as TipsResponse;

      setIntro(responseData.intro);
      setAiTips(responseData.tips);
      setWarning(responseData.warning || "");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Lunchly could not generate smart tips.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell
      section="tips"
      title="Smart tips library"
      description="Practical child-aware ideas you can actually use while planning tomorrow&apos;s tiffin."
      actions={
        <button type="button" onClick={generateAiTips} className="app-button-primary" disabled={isGenerating}>
          {isGenerating ? "Generating tips..." : "Generate AI tips"}
        </button>
      }
    >
      {intro ? (
        <div className="rounded-[2rem] bg-[rgba(145,247,142,0.18)] p-5">
          <p className="font-headline text-2xl font-bold text-[var(--ink)]">This week&apos;s AI nudge</p>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">{intro}</p>
          {warning ? (
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[color:#7d5b00]">{warning}</p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-[1.2rem] bg-[rgba(190,45,6,0.08)] px-4 py-3 text-sm font-medium text-[color:#7d2207]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-3 text-sm font-semibold ${
              filter === item
                ? "bg-[var(--green-700)] text-white"
                : "bg-white text-[var(--ink)] shadow-[0_12px_26px_rgba(56,56,51,0.05)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {personalizedTips.map((tip) => (
          <article key={`${tip.category}-${tip.title}`} className="gallery-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">
              {tip.category}
            </p>
            <h2 className="font-headline mt-3 text-2xl font-bold text-[var(--ink)]">{tip.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">{tip.body}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
