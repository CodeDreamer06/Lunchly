"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { useLunchlyData } from "@/lib/use-lunchly-data";

export function ProfilesExperience() {
  const router = useRouter();
  const { ready, profile } = useLunchlyData();

  useEffect(() => {
    if (ready && !profile) {
      router.replace("/onboarding");
    }
  }, [profile, ready, router]);

  if (!ready || !profile) {
    return null;
  }

  return (
    <AppShell
      section="profiles"
      title="Child profile"
      description="This device keeps one child profile at a time. Edit setup details here whenever routines, allergies, or school rules change."
      actions={
        <Link href="/onboarding?mode=edit" className="app-button-primary">
          Edit Child Profile
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-headline text-3xl font-extrabold text-[var(--ink)]">{profile.fullName}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                Age {profile.age} | {profile.grade} {profile.section || ""} | {profile.foodPersonality.join(", ")}
              </p>
            </div>
            <span className="rounded-full bg-[rgba(145,247,142,0.24)] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--green-700)]">
              Active
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--surface-low)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">Allergies</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                {[...profile.allergies, profile.customAllergy].filter(Boolean).join(", ") || "None"}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--surface-low)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">School policies</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                {[...profile.schoolPolicies, profile.customPolicy].filter(Boolean).join(", ") || "None"}
              </p>
            </div>
                <div className="rounded-[1.5rem] bg-[var(--surface-low)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">Lunch habits</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                    {profile.eatingNotes || `${profile.lunchEatingTime} | ${profile.appetiteStyle} | Independence ${profile.independenceLevel}/3`}
                  </p>
                </div>
            <div className="rounded-[1.5rem] bg-[var(--surface-low)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">Family goals</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                {profile.familyPriorities.join(", ") || "None selected"}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">
            Single-child mode
          </p>
          <h2 className="font-headline mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            One child profile, one active experience
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-ink)]">
            LunchLogic now assumes one child is signed in on this device. The analyzer, tips, insights, and history all read from this single local profile.
          </p>
          <div className="mt-6 space-y-3">
            <Link href="/onboarding?mode=edit" className="app-button-primary w-full">
              Update Profile Details
            </Link>
            <Link href="/dashboard" className="app-button-secondary w-full">
              Back to Dashboard
            </Link>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
