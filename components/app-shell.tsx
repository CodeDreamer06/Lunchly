"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type AppSection } from "@/lib/app-config";
import { useLunchlyData } from "@/lib/use-lunchly-data";

type AppShellProps = {
  section: AppSection;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

const TOP_NAV = [
  { label: "Dashboard", href: "/dashboard", section: "dashboard" as AppSection },
  { label: "Lunch Scanner", href: "/analyze", section: "analyze" as AppSection },
  { label: "Weekly Trends", href: "/insights", section: "insights" as AppSection },
  { label: "Tips", href: "/tips", section: "tips" as AppSection },
  { label: "History", href: "/history", section: "history" as AppSection },
  { label: "Kid Profiles", href: "/onboarding?mode=edit", section: "profiles" as AppSection },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppShell({
  section,
  title,
  description,
  actions,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const { activeProfile } = useLunchlyData();
  const avatarLabel = activeProfile ? getInitials(activeProfile.fullName) : "CL";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-stone-200/50 bg-[#fefcf4] px-8">
        <Link href="/" className="font-headline text-2xl font-black tracking-tight text-[#00751f]">
          LunchLogic
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden gap-6 md:flex">
            {TOP_NAV.map((item) => {
              const isActive =
                item.section === section ||
                (item.href === "/onboarding?mode=edit" && (pathname === "/onboarding" || pathname === "/profiles"));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    isActive
                      ? "border-b-2 border-[#00751f] font-headline font-semibold text-[#00751f]"
                      : "font-headline font-semibold text-stone-500 transition-colors hover:text-[#00751f]"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-stone-500">notifications</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--green-400)]">
              <span className="text-xs font-semibold text-[var(--green-700)]">{avatarLabel}</span>
            </div>
            <span className="material-symbols-outlined text-stone-500">expand_more</span>
          </div>
        </div>
      </header>

      <main className="pb-24 pt-24">
        <div className="mx-auto max-w-7xl px-4">
          <section className="mb-8">
            <h1 className="mb-2 font-headline text-4xl font-extrabold tracking-tight text-[var(--ink)]">{title}</h1>
            <p className="max-w-2xl text-lg text-[var(--muted-ink)]">{description}</p>
            {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
          </section>
          <div>{children}</div>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-stone-200/50 bg-white/80 px-6 py-3 backdrop-blur-xl md:hidden">
        <Link href="/dashboard" className={`flex flex-col items-center ${section === "dashboard" ? "text-[var(--green-700)]" : "text-stone-400"}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="mt-1 text-[10px] font-medium">Dash</span>
        </Link>
        <Link href="/analyze" className={`flex flex-col items-center ${section === "analyze" ? "text-[var(--green-700)]" : "text-stone-400"}`}>
          <span className="material-symbols-outlined">qr_code_scanner</span>
          <span className="mt-1 text-[10px] font-medium">Scan</span>
        </Link>
        <Link href="/analyze" className=" -mt-8 flex flex-col items-center rounded-full bg-[var(--green-400)] p-2 text-[var(--green-700)] shadow-xl">
          <span className="material-symbols-outlined text-2xl">add</span>
        </Link>
        <Link href="/insights" className={`flex flex-col items-center ${section === "insights" ? "text-[var(--green-700)]" : "text-stone-400"}`}>
          <span className="material-symbols-outlined">trending_up</span>
          <span className="mt-1 text-[10px] font-medium">Trends</span>
        </Link>
        <Link href="/onboarding?mode=edit" className={`flex flex-col items-center ${section === "profiles" ? "text-[var(--green-700)]" : "text-stone-400"}`}>
          <span className="material-symbols-outlined">face</span>
          <span className="mt-1 text-[10px] font-medium">Kids</span>
        </Link>
      </nav>
    </div>
  );
}
