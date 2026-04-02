"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { useLunchlyData } from "@/lib/use-lunchly-data";
import { useRouter } from "next/navigation";

const allTips = [
  { category: "Packing", title: "Use a dry compartment for rotis", body: "This reduces sogginess and keeps textures more predictable by lunchtime." },
  { category: "Nutrition", title: "Pair carbs with easy protein", body: "Paneer, sprouts, egg, or curd make the lunchbox more filling without making it heavy." },
  { category: "Sensory", title: "Keep mixed textures separate", body: "Children with sensory sensitivity often do better when crunchy, wet, and soft foods are not touching." },
  { category: "Budget", title: "Lean on seasonal fruit", body: "Seasonal fruit is usually the easiest win for fibre, hydration, and cost control." },
  { category: "Packing", title: "Pre-cut with independence in mind", body: "If lunch time is short, cut fruit and remove difficult wrappers before packing." },
  { category: "Nutrition", title: "Aim for one visible vegetable", body: "Visible veg helps build weekly exposure even when hidden vegetables are also used." },
];

export function TipsExperience() {
  const router = useRouter();
  const { ready, activeProfile } = useLunchlyData();
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (ready && !activeProfile) {
      router.replace("/onboarding");
    }
  }, [activeProfile, ready, router]);

  if (!ready || !activeProfile) {
    return null;
  }

  const personalizedTips = allTips.filter((tip) => {
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

  return (
    <AppShell
      section="tips"
      title="Smart tips library"
      description="Practical child-aware ideas you can actually use while planning tomorrow&apos;s tiffin."
    >
      <div className="flex flex-wrap gap-3">
        {["All", "Packing", "Nutrition", "Sensory", "Budget"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-3 text-sm font-semibold ${
              filter === item ? "bg-[var(--green-700)] text-white" : "bg-white text-[var(--ink)] shadow-[0_12px_26px_rgba(56,56,51,0.05)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {personalizedTips.map((tip) => (
          <article key={`${tip.category}-${tip.title}`} className="gallery-card p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">{tip.category}</p>
            <h2 className="font-headline mt-3 text-2xl font-bold text-[var(--ink)]">{tip.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">{tip.body}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
