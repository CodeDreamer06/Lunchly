"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { deleteProfile } from "@/lib/profile-storage";
import { useLunchlyData } from "@/lib/use-lunchly-data";

export function ProfilesExperience() {
  const router = useRouter();
  const { ready, profiles, activeProfileId, switchActiveProfile, refresh } = useLunchlyData();

  useEffect(() => {
    if (ready && !profiles.length) {
      router.replace("/onboarding");
    }
  }, [profiles.length, ready, router]);

  if (!ready) {
    return null;
  }

  return (
    <AppShell
      section="profiles"
      title="Profiles and sibling support"
      description="Switch children, edit details, and manage who Lunchly is analyzing right now."
      actions={<Link href="/onboarding?mode=add" className="app-button-primary">Add sibling</Link>}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;

          return (
            <article key={profile.id} className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-headline text-3xl font-extrabold text-[var(--ink)]">{profile.fullName}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                    Age {profile.age} | {profile.grade} {profile.section} | {profile.foodPersonality.join(", ")}
                  </p>
                </div>
                {isActive ? (
                  <span className="rounded-full bg-[rgba(145,247,142,0.24)] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--green-700)]">
                    Active
                  </span>
                ) : null}
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
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {!isActive ? (
                  <button type="button" onClick={() => switchActiveProfile(profile.id)} className="app-button-secondary">
                    Make active
                  </button>
                ) : null}
                <Link href="/onboarding?mode=edit" className="tertiary-pill">
                  Edit profile
                </Link>
                {profiles.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteProfile(profile.id);
                      refresh();
                    }}
                    className="tertiary-pill"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
