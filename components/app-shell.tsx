"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV_ITEMS, type AppSection } from "@/lib/app-config";
import { useLunchlyData } from "@/lib/use-lunchly-data";

type AppShellProps = {
  section: AppSection;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

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
  const childName = activeProfile?.fullName.split(" ")[0] ?? "Child";
  const avatarLabel = activeProfile ? getInitials(activeProfile.fullName) : "CL";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[rgba(186,185,178,0.28)] bg-[rgba(254,252,244,0.96)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="font-headline text-[2rem] font-black tracking-tight text-[var(--green-700)]">
            LunchLogic
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {APP_NAV_ITEMS.map((item) => {
              const isActive = item.section === section || pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
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
          <div className="flex items-center gap-3">
            {activeProfile ? (
              <>
                <Link href="/onboarding?mode=edit" className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--green-700)] shadow-[0_12px_26px_rgba(56,56,51,0.06)] sm:inline-flex">
                  Edit {childName}
                </Link>
                <div className="flex items-center gap-3 rounded-full bg-white px-2 py-2 shadow-[0_12px_26px_rgba(56,56,51,0.06)]">
                  <span className="material-symbols-outlined text-[color:rgba(56,56,51,0.62)]">notifications</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--green-400)] font-headline text-sm font-extrabold text-[var(--green-700)]">
                    {avatarLabel}
                  </div>
                </div>
              </>
            ) : (
              <Link href="/onboarding" className="app-button-secondary !min-h-[2.75rem] !px-4 !text-sm">
                Set Up Child
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="pb-24 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
          <section className="rounded-[2rem] bg-[rgba(145,247,142,0.24)] px-6 py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:rgba(0,94,23,0.7)]">
                  Parent Portal
                </p>
                <h1 className="font-headline mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  {title}
                </h1>
                <p className="mt-3 text-base leading-7 text-[var(--muted-ink)]">{description}</p>
                {activeProfile ? (
                  <p className="mt-3 text-sm font-semibold text-[var(--green-700)]">
                    Active child: {activeProfile.fullName}
                  </p>
                ) : null}
              </div>
              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </section>

          <div className="mt-6">{children}</div>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-[rgba(186,185,178,0.28)] bg-[rgba(255,255,255,0.96)] px-2 md:hidden">
        {APP_NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = item.section === section || pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 text-[11px] ${
                isActive ? "font-bold text-[var(--green-700)]" : "text-[var(--muted-ink)]"
              }`}
            >
              <span className="text-base">{item.label.slice(0, 1)}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
