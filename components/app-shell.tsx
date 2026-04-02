"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { StitchScreen } from "@/lib/stitch-data";
import { getActiveProfile, getActiveProfileId, getStoredProfiles, setActiveProfileId } from "@/lib/profile-storage";

type AppShellProps = {
  currentScreen: StitchScreen;
  screens: StitchScreen[];
  previous: StitchScreen | null;
  next: StitchScreen | null;
  children: ReactNode;
};

const topNavItems = [
  { label: "Dashboard", section: "dashboard", slug: "dashboard" },
  { label: "Lunch Scanner", section: "scanner", slug: "ai_lunchbox_analysis_deep_dive" },
  { label: "Weekly Trends", section: "trends", slug: "weekly_pattern_intelligence" },
  { label: "Swap Engine", section: "swap", slug: "tiny_tweaks_swap_engine" },
  { label: "Prep Planner", section: "planning", slug: "weekly_planning_prep_ahead_planner" },
] as const;

const sidebarItems = [
  { label: "Dashboard", section: "dashboard", slug: "dashboard", icon: "DB" },
  { label: "Lunch Scanner", section: "scanner", slug: "ai_lunchbox_analysis_deep_dive", icon: "QR" },
  { label: "Weekly Trends", section: "trends", slug: "weekly_pattern_intelligence", icon: "WT" },
  { label: "Swap Engine", section: "swap", slug: "tiny_tweaks_swap_engine", icon: "SW" },
  { label: "Kid Profiles", section: "profiles", slug: "child_profile_setup", icon: "KP" },
  { label: "Prep Planner", section: "planning", slug: "weekly_planning_prep_ahead_planner", icon: "PP" },
  { label: "Smart Shopping", section: "shopping", slug: "smart_store_map_budget_builder", icon: "SS" },
  { label: "Caregiver Hub", section: "caregiver", slug: "caregiver_report_card_share_hub", icon: "CG" },
] as const;

const sectionMessages: Record<StitchScreen["shellSection"], string> = {
  dashboard: "A calm daily hub for scanning today's lunchbox and acting on the fastest wins.",
  scanner: "Review what the lunchbox is doing well before you decide on changes for tomorrow.",
  trends: "Use the weekly pulse to keep progress encouraging, visible, and easy to share.",
  swap: "Make tiny, low-friction adjustments that build confidence instead of resistance.",
  profiles: "Keep sensory needs, school policies, and independence notes in one shared source.",
  planning: "Prep once, repurpose smartly, and keep tomorrow morning calm.",
  shopping: "Translate insights into a store plan that works for budget and routine.",
  caregiver: "Turn progress into an easy handoff for the adults supporting lunch decisions.",
};

function getHref(slug: string) {
  return slug === "dashboard" ? "/dashboard" : `/screens/${slug}`;
}

export function AppShell({
  currentScreen,
  screens,
  previous,
  next,
  children,
}: AppShellProps) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ReturnType<typeof getStoredProfiles>>([]);
  const [profilesCount, setProfilesCount] = useState(0);
  const [childName, setChildName] = useState("Leo");
  const [activeProfileId, setActiveProfile] = useState<string | null>(null);
  const [caregiverName, setCaregiverName] = useState("Priya");

  useEffect(() => {
    const profiles = getStoredProfiles();
    const activeProfile = getActiveProfile();

    const frame = window.requestAnimationFrame(() => {
      setProfiles(profiles);
      setProfilesCount(profiles.length);
      setActiveProfile(getActiveProfileId());

      if (activeProfile) {
        setChildName(activeProfile.fullName.split(" ")[0]);
        setCaregiverName(activeProfile.caregiverName || "Priya");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const relatedScreens = useMemo(
    () =>
      currentScreen.related
        .map((slug) => screens.find((screen) => screen.slug === slug) ?? null)
        .filter((screen): screen is StitchScreen => Boolean(screen)),
    [currentScreen.related, screens],
  );

  const hasProfiles = profilesCount > 0;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[rgba(186,185,178,0.3)] bg-[rgba(254,252,244,0.97)] px-4 sm:px-8">
        <Link
          href={hasProfiles ? "/dashboard" : "/"}
          className="font-headline text-[2rem] font-black tracking-tight text-[var(--green-700)]"
        >
          LunchLogic
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {topNavItems.map((item) => {
            const isActive = currentScreen.shellSection === item.section;

            return (
              <Link
                key={item.slug}
                href={getHref(item.slug)}
                className={`font-headline text-sm transition-colors ${
                  isActive
                    ? "border-b-2 border-[var(--green-700)] pb-1 font-bold text-[var(--green-700)]"
                    : "text-[color:rgba(56,56,51,0.58)] hover:text-[var(--green-700)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-[18px] text-[color:rgba(56,56,51,0.55)]">o</span>
          {hasProfiles ? (
            <select
              value={activeProfileId ?? ""}
              onChange={(event) => {
                setActiveProfileId(event.target.value);
                setActiveProfile(event.target.value);
                const nextProfile = profiles.find((profile) => profile.id === event.target.value);
                if (nextProfile) {
                  setChildName(nextProfile.fullName.split(" ")[0]);
                  setCaregiverName(nextProfile.caregiverName || "Priya");
                }
                router.refresh();
              }}
              className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] shadow-[0_12px_26px_rgba(56,56,51,0.06)] outline-none"
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.fullName.split(" ")[0]}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] shadow-[0_12px_26px_rgba(56,56,51,0.06)]">
              Demo Child
            </div>
          )}
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-[rgba(186,185,178,0.26)] bg-[rgba(255,255,255,0.74)] pt-20 md:flex md:flex-col">
        <div className="px-6 pb-8">
          <h2 className="font-headline text-lg font-bold text-[var(--ink)]">Parent Portal</h2>
          <p className="text-xs text-[var(--muted-ink)]">Managing {Math.max(profilesCount, 1)} Profiles</p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {sidebarItems.map((item) => {
            const isActive = currentScreen.shellSection === item.section;

            return (
              <Link
                key={item.slug}
                href={getHref(item.slug)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-headline text-sm transition-all ${
                  isActive
                    ? "bg-[rgba(0,117,31,0.1)] font-bold text-[var(--green-700)]"
                    : "text-[color:rgba(56,56,51,0.72)] hover:bg-[rgba(245,244,235,0.94)]"
                }`}
              >
                <span className="inline-flex h-5 w-7 items-center justify-center text-[10px] font-bold tracking-[0.08em]">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="pb-24 pt-20 md:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
          <div className="rounded-[2rem] bg-[rgba(145,247,142,0.26)] px-6 py-5 text-[var(--green-700)]">
            <h1 className="font-headline text-xl font-bold">
              {hasProfiles
                ? `Namaste, ${caregiverName}! Ready to support ${childName}'s lunch wins today?`
                : "This is a connected LunchLogic flow."}
            </h1>
            <p className="mt-1 text-sm leading-6 text-[color:rgba(0,94,23,0.82)]">
              {sectionMessages[currentScreen.shellSection]}
            </p>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="space-y-5">
              <div className="rounded-[2rem] bg-[var(--surface-low)] p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:rgba(56,56,51,0.48)]">
                      {currentScreen.category}
                    </p>
                    <h2 className="font-headline mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                      {currentScreen.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted-ink)] sm:text-base">
                      {currentScreen.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {previous ? (
                      <Link href={`/screens/${previous.slug}`} className="app-button-secondary">
                        Previous
                      </Link>
                    ) : null}
                    {next ? (
                      <Link href={`/screens/${next.slug}`} className="app-button-primary">
                        Continue Flow
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>

              {children}
            </section>

            <aside className="space-y-5">
              <div className="rounded-[2rem] bg-[rgba(249,229,52,0.18)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:rgba(91,83,0,0.7)]">
                  Review Path
                </p>
                <div className="mt-4 space-y-3">
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm ${
                      currentScreen.slug === "morning_rush_dashboard"
                        ? "bg-white font-semibold text-[var(--green-700)]"
                        : "text-[var(--ink)]"
                    }`}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[var(--green-700)]">
                      00
                    </span>
                    Home Dashboard
                  </Link>
                  {screens.map((screen, index) => {
                    const isActive = screen.slug === currentScreen.slug;

                    return (
                      <Link
                        key={screen.slug}
                        href={`/screens/${screen.slug}`}
                        className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm ${
                          isActive ? "bg-white font-semibold text-[var(--green-700)]" : "text-[var(--ink)]"
                        }`}
                      >
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[var(--green-700)]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {screen.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>

          <footer className="mt-6 rounded-[2rem] bg-white p-5 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.46)]">
                  Connected Flows
                </p>
                <h3 className="font-headline mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--ink)]">
                  Where to go next in the LunchLogic journey
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className="app-button-secondary">
                  Child Dashboard
                </Link>
                <Link href="/onboarding?mode=add" className="app-button-primary">
                  Add Sibling
                </Link>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {relatedScreens.map((screen) => (
                <Link
                  key={screen.slug}
                  href={`/screens/${screen.slug}`}
                  className="block rounded-[1.5rem] bg-[var(--surface-low)] px-5 py-5 transition hover:bg-[rgba(0,117,31,0.08)]"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.42)]">
                    {screen.category}
                  </p>
                  <p className="font-headline mt-2 text-xl font-bold text-[var(--ink)]">{screen.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">{screen.summary}</p>
                </Link>
              ))}
            </div>
          </footer>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-[rgba(186,185,178,0.28)] bg-[rgba(255,255,255,0.94)] px-4 md:hidden">
        {topNavItems.slice(0, 4).map((item) => {
          const isActive = currentScreen.shellSection === item.section;

          return (
            <Link
              key={item.slug}
              href={getHref(item.slug)}
              className={`flex flex-col items-center gap-1 text-[11px] ${
                isActive ? "font-bold text-[var(--green-700)]" : "text-[var(--muted-ink)]"
              }`}
            >
              <span className="text-base">{item.label.slice(0, 1)}</span>
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
