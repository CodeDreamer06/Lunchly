"use client";

import { startTransition, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { getStoredProfiles } from "@/lib/profile-storage";

const sections = [
  { id: "how-it-works", label: "How It Works" },
  { id: "why-lunchly", label: "Why Lunchly" },
  { id: "use-cases", label: "Use Cases" },
  { id: "privacy", label: "Privacy" },
];

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
    <div className="min-h-screen bg-[var(--background)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(186,185,178,0.26)] bg-[rgba(254,252,244,0.96)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="font-headline text-[2rem] font-black tracking-tight text-[var(--green-700)]">
            Lunchly
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="font-headline text-sm text-[color:rgba(56,56,51,0.6)] transition-colors hover:text-[var(--green-700)]"
              >
                {section.label}
              </a>
            ))}
            <Link href="/dashboard" className="font-headline text-sm text-[color:rgba(56,56,51,0.6)] transition-colors hover:text-[var(--green-700)]">
              Dashboard
            </Link>
          </nav>
          <button type="button" onClick={handleStart} className="app-button-primary !min-h-[2.9rem] !px-5 !text-sm">
            {isChecking ? "Opening..." : "Start"}
          </button>
        </div>
      </header>

      <main className="pt-16">
        <section className="px-4 py-12 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <div className="inline-flex rounded-full bg-[rgba(145,247,142,0.22)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green-700)]">
                AI tiffin analyzer for Indian families
              </div>
              <div className="space-y-5">
                <h1 className="font-headline max-w-4xl text-5xl font-extrabold tracking-[-0.06em] text-[var(--ink)] sm:text-6xl lg:text-7xl">
                  Make every lunchbox smarter, easier to finish, and more child-specific.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--muted-ink)]">
                  Lunchly helps parents build a child profile once, analyze today&apos;s tiffin in seconds, and get practical,
                  profile-aware suggestions for nutrition, sensory comfort, school rules, and prep.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button type="button" onClick={handleStart} className="app-button-primary min-w-[15rem] text-lg">
                  {isChecking ? "Opening Lunchly..." : "Start your first analysis"}
                </button>
                <Link href="/dashboard" className="app-button-secondary">
                  Explore dashboard
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="soft-card p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                    Child-aware
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                    Allergies, sensory preferences, and school policies shape every suggestion.
                  </p>
                </div>
                <div className="soft-card p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                    Local first
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                    Profile data and analysis history stay on-device for this frontend prototype.
                  </p>
                </div>
                <div className="soft-card p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                    Daily useful
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                    Dashboard, analysis, tips, history, and profile tools all work together.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
              <div className="rounded-[2rem] bg-[var(--surface-low)] p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.46)]">
                  The daily loop
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    "Create or update your child profile once with sensory needs, allergies, school rules, and weekly goals.",
                    "Open the dashboard each morning and tap Analyze to log what is going into the tiffin.",
                    "Get a fast AI-style result with nutrition score, sensory warnings, school-policy flags, and practical swaps.",
                    "Track what is improving over time in insights, history, and a personalized tips library.",
                  ].map((item, index) => (
                    <div key={item} className="rounded-[1.6rem] bg-white px-4 py-4">
                      <div className="flex gap-4">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(0,117,31,0.1)] font-headline text-lg font-bold text-[var(--green-700)]">
                          {index + 1}
                        </span>
                        <p className="text-sm leading-6 text-[var(--muted-ink)]">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-4 py-8 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.46)]">How it works</p>
              <h2 className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                Built for the messy, real-life tiffin decisions parents make every day
              </h2>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Profile-aware analysis",
                  body: "Lunchly adjusts results based on allergies, school rules, appetite, eating pace, and sensory preferences.",
                },
                {
                  title: "Indian lunchbox context",
                  body: "It is designed around tiffin realities like soggy sabzi, steel boxes, no-reheat policies, and PE-day energy needs.",
                },
                {
                  title: "Actionable next steps",
                  body: "You do not just get a score. You get what to keep, what to swap, and what to pack differently next time.",
                },
              ].map((card) => (
                <div key={card.title} className="soft-card p-6">
                  <h3 className="font-headline text-2xl font-bold text-[var(--ink)]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why-lunchly" className="px-4 py-8 sm:px-8 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] bg-[rgba(249,229,52,0.2)] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:#5b5300]">Why parents return</p>
              <h2 className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                A home hub, not a one-time report
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
                Lunchly is meant to become the daily place parents return to before school, after lunch, and during weekly planning.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                "Daily dashboard with one clear analyze CTA",
                "Saved analysis history for real progress tracking",
                "Weekly insights that feel encouraging, not clinical",
                "Smart tips tailored to each child profile",
              ].map((item) => (
                <div key={item} className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
                  <p className="font-headline text-xl font-bold text-[var(--ink)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="px-4 py-8 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.46)]">Use cases</p>
                <h2 className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  Everything in this frontend is clickable and local-storage powered
                </h2>
              </div>
              <button type="button" onClick={handleStart} className="app-button-primary">
                Start now
              </button>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                { title: "Onboarding wizard", href: "/onboarding", body: "Six guided steps with profile data saved locally." },
                { title: "Child dashboard", href: "/dashboard", body: "Greeting, summary cards, quick links, and the main analyze CTA." },
                { title: "Analyze page", href: "/analyze", body: "Submit a tiffin, get a child-aware result, and save it to history." },
                { title: "Insights page", href: "/insights", body: "See score trends, sensory risk, and weekly focus areas." },
                { title: "Tips library", href: "/tips", body: "Profile-driven tips with practical packing and swap suggestions." },
                { title: "Profiles + history", href: "/profiles", body: "Switch children, edit profiles, add siblings, and review saved analyses." },
              ].map((item) => (
                <Link key={item.title} href={item.href} className="gallery-card p-6">
                  <p className="font-headline text-2xl font-bold text-[var(--ink)]">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">{item.body}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="privacy" className="px-4 py-8 sm:px-8 sm:py-14">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-8 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.46)]">Privacy note</p>
            <h2 className="font-headline mt-3 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Your data stays on your device until you choose to sync
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted-ink)]">
              This prototype keeps profiles and analysis history in local storage only. That makes it fast to demo,
              easy to understand, and safe from backend blockers while the core experience is being refined.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-[rgba(145,247,142,0.24)] px-8 py-10 text-center">
            <h2 className="font-headline text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              Ready to turn your next tiffin into a smarter lunchbox?
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted-ink)]">
              Start with one child profile and Lunchly will guide the rest.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button type="button" onClick={handleStart} className="app-button-primary min-w-[14rem]">
                Start
              </button>
              <Link href="/onboarding" className="app-button-secondary">
                Create profile
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
