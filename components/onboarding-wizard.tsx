"use client";

import { type ChangeEvent, type ReactNode, startTransition, useEffect, useId, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  buildTeaser,
  getStoredProfile,
  type LunchlyProfile,
  upsertProfile,
} from "@/lib/profile-storage";

type DraftProfile = Omit<LunchlyProfile, "id" | "age" | "createdAt">;

const allergyOptions = [
  "Peanuts",
  "Tree nuts",
  "Milk",
  "Eggs",
  "Soy",
  "Wheat/Gluten",
  "Fish",
  "Sesame",
  "Mustard",
];

const schoolPolicyOptions = [
  "Nut-Free campus",
  "No reheating allowed",
  "No packaged snacks (only homemade)",
  "No outside food on birthdays",
  "Plastic-free / only steel tiffin",
  "Jain (no onion-garlic)",
  "Pure vegetarian / No non-veg",
  "No added sugar / No cold drinks",
];

const foodPersonalityCards = [
  {
    label: "Picky Eater",
    icon: "restaurant",
    accent: "text-[var(--green-700)]",
    description: "Prioritizes familiar textures and predictable flavor profiles.",
  },
  {
    label: "Sensory-Sensitive",
    icon: "psychology",
    accent: "text-[var(--blue-700)]",
    description: "Aversion to mixed textures, strong smells, or soggy foods.",
  },
  {
    label: "Sports Day Focus",
    icon: "fitness_center",
    accent: "text-[var(--sun-500)]",
    description: "Higher protein and complex carbs for energy on PE days.",
  },
  {
    label: "Budget-Conscious",
    icon: "savings",
    accent: "text-[var(--green-600)]",
    description: "Suggests ingredients that are currently seasonal or in bulk.",
  },
  {
    label: "Flavor Explorer",
    icon: "local_dining",
    accent: "text-[var(--blue-700)]",
    description: "Open to variety when presentation and textures still feel safe.",
  },
  {
    label: "Veggie Champion",
    icon: "nutrition",
    accent: "text-[var(--green-700)]",
    description: "Already enjoys more produce than average for their age.",
  },
];

const familyPriorityOptions = [
  "Brain food & focus",
  "Immunity & less sick days",
  "Healthy weight gain",
  "More veggies & fibre",
  "Balanced macros (protein + carbs)",
];

const specialDayOptions = [
  "Monday PE",
  "Tuesday PE",
  "Wednesday PE",
  "Thursday PE",
  "Friday PE",
  "Exam week",
  "Festival week",
];

const routineChips = [
  "Needs pre-cut food",
  "Finger foods only",
  "Self-sufficient",
  "Needs easy-open boxes",
  "Prefers dry foods",
];

function createDefaultDraft(): DraftProfile {
  return {
    caregiverName: "Priya",
    fullName: "",
    birthDate: "",
    grade: "",
    section: "",
    gender: "",
    height: "",
    weight: "",
    avatar: "Sprout",
    photoDataUrl: "",
    allergies: [],
    customAllergy: "",
    schoolPolicies: [],
    customPolicy: "",
    eatingNotes: "",
    independenceLevel: 2,
    lunchEatingTime: "20 min",
    appetiteStyle: "Average",
    foodPersonality: ["Picky Eater", "Sensory-Sensitive"],
    activityLevel: "Active (plays a lot)",
    specialDays: [],
    familyPriorities: ["Brain food & focus"],
  };
}

function calculateAge(birthDate: string) {
  if (!birthDate) {
    return 0;
  }

  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function toDraft(profile: LunchlyProfile): DraftProfile {
  return {
    caregiverName: profile.caregiverName || "Priya",
    fullName: profile.fullName,
    birthDate: profile.birthDate,
    grade: profile.grade,
    section: profile.section,
    gender: profile.gender,
    height: profile.height,
    weight: profile.weight,
    avatar: profile.avatar,
    photoDataUrl: profile.photoDataUrl,
    allergies: profile.allergies,
    customAllergy: profile.customAllergy,
    schoolPolicies: profile.schoolPolicies,
    customPolicy: profile.customPolicy,
    eatingNotes: profile.eatingNotes ?? "",
    independenceLevel: profile.independenceLevel,
    lunchEatingTime: profile.lunchEatingTime,
    appetiteStyle: profile.appetiteStyle,
    foodPersonality: profile.foodPersonality,
    activityLevel: profile.activityLevel,
    specialDays: profile.specialDays,
    familyPriorities: profile.familyPriorities,
  };
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-[var(--ink)]">{label}</span>
      {children}
    </label>
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uploadId = useId();
  const isExplicitEdit = searchParams.get("mode") === "edit";
  const [draft, setDraft] = useState<DraftProfile>(createDefaultDraft);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [successTip, setSuccessTip] = useState("");
  const [customHabitChip, setCustomHabitChip] = useState("");

  useEffect(() => {
    const existingProfile = getStoredProfile();

    const frame = window.requestAnimationFrame(() => {
      if (existingProfile) {
        setDraft(toDraft(existingProfile));
        setProfileId(existingProfile.id);
        setCreatedAt(existingProfile.createdAt);
      }

      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!successTip) {
      return;
    }

    const timeout = window.setTimeout(() => {
      startTransition(() => {
        router.push("/dashboard");
      });
    }, 1600);

    return () => window.clearTimeout(timeout);
  }, [router, successTip]);

  const age = calculateAge(draft.birthDate);
  const hasExistingProfile = Boolean(profileId);
  const isEditMode = ready && (isExplicitEdit || hasExistingProfile);
  const displayName = draft.fullName.trim() || "Your Child";
  const firstName = displayName.split(" ")[0];
  const visiblePolicies = [...draft.schoolPolicies, draft.customPolicy].filter(Boolean);
  const visibleAllergies = [...draft.allergies, draft.customAllergy].filter(Boolean);

  const validateDraft = () => {
    if (!draft.caregiverName.trim() || !draft.fullName.trim() || !draft.birthDate || !draft.grade || !draft.gender) {
      return "Add the core child details before saving.";
    }

    if (draft.foodPersonality.length < 2) {
      return "Choose at least two sensory preference cards so LunchLogic can personalize results.";
    }

    if (!draft.familyPriorities.length) {
      return "Select at least one family priority.";
    }

    return "";
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({
        ...current,
        photoDataUrl: typeof reader.result === "string" ? reader.result : "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const addCustomAllergy = () => {
    const value = draft.customAllergy.trim();

    if (!value) {
      return;
    }

    setDraft((current) => ({
      ...current,
      allergies: current.allergies.includes(value) ? current.allergies : [...current.allergies, value],
      customAllergy: "",
    }));
  };

  const addCustomPolicy = () => {
    const value = draft.customPolicy.trim();

    if (!value) {
      return;
    }

    setDraft((current) => ({
      ...current,
      schoolPolicies: current.schoolPolicies.includes(value) ? current.schoolPolicies : [...current.schoolPolicies, value],
      customPolicy: "",
    }));
  };

  const addCustomHabitChip = () => {
    const value = customHabitChip.trim();

    if (!value) {
      return;
    }

    setDraft((current) => ({
      ...current,
      specialDays: current.specialDays.includes(value) ? current.specialDays : [...current.specialDays, value],
    }));
    setCustomHabitChip("");
  };

  const saveProfile = () => {
    const validationError = validateDraft();
    setError(validationError);

    if (validationError) {
      return;
    }

    const profile: LunchlyProfile = {
      ...draft,
      id: profileId ?? `profile_${crypto.randomUUID()}`,
      fullName: draft.fullName.trim(),
      caregiverName: draft.caregiverName.trim(),
      age,
      createdAt: createdAt || new Date().toISOString(),
    };

    upsertProfile(profile);
    setProfileId(profile.id);
    setCreatedAt(profile.createdAt);
    setSuccessTip(buildTeaser(profile));
  };

  if (!ready) {
    return <main className="min-h-screen bg-[var(--background)]" />;
  }

  if (successTip) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
        <div className="relative w-full max-w-2xl rounded-[3rem] border border-white/80 bg-white/90 p-12 text-center shadow-[0_30px_100px_rgba(34,197,94,0.15)] backdrop-blur-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(145,247,142,0.26)] text-[var(--green-700)]">
            <span className="material-symbols-outlined text-4xl">check</span>
          </div>
          <h1 className="font-headline mt-6 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
            {firstName}&apos;s profile is ready
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted-ink)]">{successTip}</p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--green-700)]">
            Redirecting to dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fafcf9] via-[#f1f7f0] to-[#f8f9f7] text-[var(--ink)] selection:bg-[var(--green-200)] pb-20">
      <header className="fixed top-4 left-1/2 z-50 flex h-16 w-[95%] max-w-7xl -translate-x-1/2 items-center justify-between rounded-full border border-white/60 bg-white/80 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl">
        <Link href={hasExistingProfile ? "/dashboard" : "/"} className="font-headline text-2xl font-black tracking-tight text-[var(--green-700)]">
          LunchLogic
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden gap-6 md:flex">
            <Link className="font-headline font-semibold text-stone-500 transition-colors hover:text-[var(--green-700)]" href="/dashboard">
              Dashboard
            </Link>
            <Link className="font-headline font-semibold text-stone-500 transition-colors hover:text-[var(--green-700)]" href="/analyze">
              Lunch Scanner
            </Link>
            <Link className="font-headline font-semibold text-stone-500 transition-colors hover:text-[var(--green-700)]" href="/insights">
              Weekly Trends
            </Link>
            <Link className="font-headline font-semibold text-stone-500 transition-colors hover:text-[var(--green-700)]" href="/tips">
              Tips
            </Link>
            <Link className="font-headline font-semibold text-stone-500 transition-colors hover:text-[var(--green-700)]" href="/history">
              History
            </Link>
            <Link className="border-b-2 border-[var(--green-700)] font-headline font-bold text-[var(--green-700)]" href="/onboarding">
              Kid Profiles
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-stone-500">notifications</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--green-400)] text-xs font-bold text-[var(--green-700)]">
              {getInitials(displayName) || "CL"}
            </div>
            <span className="material-symbols-outlined text-stone-500">expand_more</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-32 pt-32">
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            {isEditMode ? "Edit Child Profile & Sensory Preferences" : "Child Profile & Sensory Preferences"}
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-[var(--muted-ink)]">
            {!hasExistingProfile
              ? "Set up your child once before using LunchLogic. We save everything locally on this device."
              : "Tailor the LunchLogic experience to your child&apos;s current needs, habits, and school environment."}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <section className="space-y-8 lg:col-span-4">
            <div className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 p-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <div className="relative mb-6">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-container-high)] ring-4 ring-[var(--green-400)] ring-offset-4">
                  {draft.photoDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={`${displayName} profile`} className="h-full w-full object-cover" src={draft.photoDataUrl} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--surface-container-high)] font-headline text-3xl font-extrabold text-[var(--green-700)]">
                      {getInitials(displayName) || "CL"}
                    </div>
                  )}
                </div>
                <label
                  htmlFor={uploadId}
                  className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[var(--green-700)] p-2 text-white shadow-lg transition-transform hover:scale-105"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </label>
                <input id={uploadId} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>
              <h2 className="font-headline text-2xl font-bold text-[var(--ink)]">{displayName}</h2>
              <p className="font-medium text-[var(--muted-ink)]">
                {draft.grade || "Grade"} {draft.section ? `• ${draft.section}` : ""} {age ? `• ${age} Years Old` : ""}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-[rgba(112,181,255,0.18)] px-3 py-1 text-xs font-semibold text-[color:#003258]">
                  Active Profile
                </span>
                <span className="rounded-full bg-[rgba(249,229,52,0.24)] px-3 py-1 text-xs font-semibold text-[color:#5b5300]">
                  Morning School
                </span>
              </div>
            </div>

            <div className="relative rounded-[2.5rem] border border-white/60 bg-white/50 p-8 shadow-[0_8px_40px_rgba(0,0,0,0.03)] backdrop-blur-xl">
              <h3 className="mb-4 flex items-center gap-2 font-headline text-lg font-bold">
                <span className="material-symbols-outlined text-[var(--green-700)]">school</span>
                Allergy & School Policy
              </h3>
              <div className="space-y-3">
                {visiblePolicies.map((policy) => (
                  <div key={policy} className="flex items-center justify-between rounded-lg bg-white p-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[var(--blue-700)]">policy</span>
                      <span className="text-sm font-medium">{policy}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          schoolPolicies: current.schoolPolicies.filter((item) => item !== policy),
                          customPolicy: current.customPolicy === policy ? "" : current.customPolicy,
                        }))
                      }
                    >
                      <span className="material-symbols-outlined cursor-pointer text-[var(--muted-ink)]">close</span>
                    </button>
                  </div>
                ))}
                {visibleAllergies.map((allergy) => (
                  <div key={allergy} className="flex items-center justify-between rounded-lg bg-white p-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[color:#be2d06]">dangerous</span>
                      <span className="text-sm font-medium">{allergy}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          allergies: current.allergies.filter((item) => item !== allergy),
                          customAllergy: current.customAllergy === allergy ? "" : current.customAllergy,
                        }))
                      }
                    >
                      <span className="material-symbols-outlined cursor-pointer text-[var(--muted-ink)]">close</span>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[color:var(--outline-variant)] bg-white/50 py-4 text-sm font-semibold text-[var(--muted-ink)] transition-all hover:border-[var(--green-500)] hover:bg-white hover:text-[var(--green-700)] hover:shadow-lg"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add New Policy
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-8 lg:col-span-8">
            <div className="relative rounded-[2.5rem] border border-white/60 bg-white/80 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <h3 className="mb-6 font-headline text-2xl font-bold">Basic Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Parent / Caregiver name">
                  <input
                    value={draft.caregiverName}
                    onChange={(event) => setDraft((current) => ({ ...current, caregiverName: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                    placeholder="Priya"
                  />
                </Field>
                <Field label="Child full name">
                  <input
                    value={draft.fullName}
                    onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                    placeholder="Leo Miller"
                  />
                </Field>
                <Field label="Date of birth">
                  <input
                    type="date"
                    value={draft.birthDate}
                    onChange={(event) => setDraft((current) => ({ ...current, birthDate: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                  />
                </Field>
                <Field label="Gender">
                  <select
                    value={draft.gender}
                    onChange={(event) => setDraft((current) => ({ ...current, gender: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                  >
                    <option value="">Select</option>
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </Field>
                <Field label="Grade">
                  <input
                    value={draft.grade}
                    onChange={(event) => setDraft((current) => ({ ...current, grade: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                    placeholder="Grade 2"
                  />
                </Field>
                <Field label="Section / Class">
                  <input
                    value={draft.section}
                    onChange={(event) => setDraft((current) => ({ ...current, section: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                    placeholder="B"
                  />
                </Field>
                <Field label="Height">
                  <input
                    value={draft.height}
                    onChange={(event) => setDraft((current) => ({ ...current, height: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                    placeholder="124 cm"
                  />
                </Field>
                <Field label="Weight">
                  <input
                    value={draft.weight}
                    onChange={(event) => setDraft((current) => ({ ...current, weight: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                    placeholder="24 kg"
                  />
                </Field>
              </div>
            </div>

            <div className="relative rounded-[2.5rem] border border-white/60 bg-white/80 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <h3 className="mb-6 font-headline text-2xl font-bold">Sensory Preferences</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {foodPersonalityCards.map((item) => {
                  const checked = draft.foodPersonality.includes(item.label);

                  return (
                    <label
                      key={item.label}
                      className={`group relative flex cursor-pointer flex-col gap-4 rounded-2xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        checked
                          ? "border-[var(--green-500)] bg-[var(--green-50)] shadow-[0_0_0_2px_rgba(34,197,94,0.1)]"
                          : "border-transparent bg-white shadow-sm hover:border-[var(--green-200)]"
                      }`}
                    >
                      <input
                        checked={checked}
                        className="absolute right-4 top-4 h-6 w-6 rounded-full border-[color:var(--outline)]"
                        type="checkbox"
                        onChange={() =>
                          setDraft((current) => ({
                            ...current,
                            foodPersonality: toggleValue(current.foodPersonality, item.label).slice(0, 4),
                          }))
                        }
                      />
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-white ${item.accent}`}>
                        <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-headline text-lg font-bold">{item.label}</p>
                        <p className="text-sm text-[var(--muted-ink)]">{item.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="relative rounded-[2.5rem] border border-[color:var(--outline-variant)]/20 bg-white/60 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.03)] backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-[var(--green-700)]">edit_note</span>
                <h3 className="font-headline text-xl font-bold">Eating Habits & Independence</h3>
              </div>
              <p className="mb-4 text-sm text-[var(--muted-ink)]">
                How much help does your child need during lunch? We use this to suggest packaging and food prep levels.
              </p>
              <textarea
                value={draft.eatingNotes}
                onChange={(event) => setDraft((current) => ({ ...current, eatingNotes: event.target.value }))}
                className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] p-5 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--outline-variant)]"
                placeholder="e.g., Can peel an orange but struggles with tiny wrappers. Needs pre-cut apples."
                rows={4}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {routineChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        eatingNotes: current.eatingNotes.includes(chip)
                          ? current.eatingNotes.replace(chip, "").replace(/,\s*,/g, ",").trim()
                          : `${current.eatingNotes}${current.eatingNotes ? ", " : ""}${chip}`,
                      }))
                    }
                    className="rounded-full bg-[var(--surface-container-high)] px-4 py-2 text-xs font-semibold transition-colors hover:bg-[var(--surface-container-highest)]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Independence level">
                  <select
                    value={String(draft.independenceLevel)}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, independenceLevel: Number(event.target.value) }))
                    }
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                  >
                    <option value="1">Needs a lot of help</option>
                    <option value="2">Needs some help</option>
                    <option value="3">Mostly independent</option>
                  </select>
                </Field>
                <Field label="Lunch eating time">
                  <select
                    value={draft.lunchEatingTime}
                    onChange={(event) => setDraft((current) => ({ ...current, lunchEatingTime: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                  >
                    <option>10 min</option>
                    <option>20 min</option>
                    <option>30+ min</option>
                  </select>
                </Field>
                <Field label="Appetite style">
                  <select
                    value={draft.appetiteStyle}
                    onChange={(event) => setDraft((current) => ({ ...current, appetiteStyle: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                  >
                    <option>Big eater</option>
                    <option>Average</option>
                    <option>Small / fussy eater</option>
                  </select>
                </Field>
              </div>
            </div>

            <div className="relative rounded-[2.5rem] border border-white/60 bg-white/80 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl">
              <h3 className="mb-6 font-headline text-2xl font-bold">Routine, School Rules & Weekly Goals</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Common allergies">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {allergyOptions.map((item) => {
                        const active = draft.allergies.includes(item);

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                allergies: toggleValue(current.allergies, item),
                              }))
                            }
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                              active
                                ? "bg-[rgba(249,86,48,0.14)] text-[color:#520c00]"
                                : "bg-[var(--surface-container)] text-[var(--ink)]"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={draft.customAllergy}
                        onChange={(event) => setDraft((current) => ({ ...current, customAllergy: event.target.value }))}
                        className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                        placeholder="Add another allergy"
                      />
                      <button type="button" onClick={addCustomAllergy} className="app-button-secondary">
                        Add
                      </button>
                    </div>
                  </div>
                </Field>

                <Field label="School policies">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {schoolPolicyOptions.map((item) => {
                        const active = draft.schoolPolicies.includes(item);

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                schoolPolicies: toggleValue(current.schoolPolicies, item),
                              }))
                            }
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                              active
                                ? "bg-[rgba(112,181,255,0.18)] text-[color:#003258]"
                                : "bg-[var(--surface-container)] text-[var(--ink)]"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={draft.customPolicy}
                        onChange={(event) => setDraft((current) => ({ ...current, customPolicy: event.target.value }))}
                        className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                        placeholder="Add another policy"
                      />
                      <button type="button" onClick={addCustomPolicy} className="app-button-secondary">
                        Add
                      </button>
                    </div>
                  </div>
                </Field>

                <Field label="Activity level">
                  <select
                    value={draft.activityLevel}
                    onChange={(event) => setDraft((current) => ({ ...current, activityLevel: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                  >
                    <option>Mostly sedentary</option>
                    <option>Active (plays a lot)</option>
                    <option>Sports champion</option>
                  </select>
                </Field>

                <Field label="Family priorities">
                  <div className="flex flex-wrap gap-2">
                    {familyPriorityOptions.map((item) => {
                      const active = draft.familyPriorities.includes(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              familyPriorities: toggleValue(current.familyPriorities, item).slice(0, 3),
                            }))
                          }
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                            active
                              ? "bg-[rgba(145,247,142,0.18)] text-[var(--green-700)]"
                              : "bg-[var(--surface-container)] text-[var(--ink)]"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field label="Special days">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {specialDayOptions.map((item) => {
                        const active = draft.specialDays.includes(item);

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                specialDays: toggleValue(current.specialDays, item),
                              }))
                            }
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                              active
                                ? "bg-[rgba(249,229,52,0.24)] text-[color:#5b5300]"
                                : "bg-[var(--surface-container)] text-[var(--ink)]"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={customHabitChip}
                        onChange={(event) => setCustomHabitChip(event.target.value)}
                        className="w-full rounded-2xl border-2 border-transparent bg-[var(--surface-container)] px-5 py-4 text-[var(--ink)] font-medium transition-all hover:bg-[var(--surface-container-low)] focus:border-[var(--green-500)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.1)] outline-none placeholder:text-[var(--muted-ink)]/60"
                        placeholder="Add another special day"
                      />
                      <button type="button" onClick={addCustomHabitChip} className="app-button-secondary">
                        Add
                      </button>
                    </div>
                  </div>
                </Field>
              </div>
            </div>

            {error ? (
              <div className="rounded-[1rem] border border-[rgba(249,86,48,0.35)] bg-[rgba(249,86,48,0.08)] px-4 py-3 text-sm text-[color:#520c00]">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={saveProfile}
                className="group relative flex-1 overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--green-600)] to-[#15803d] py-5 font-headline text-xl font-bold text-white shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(34,197,94,0.4)] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-[-100%] transition-transform duration-500 group-hover:translate-y-[100%]" />
                <span className="relative z-10">{isEditMode ? "Save Child Profile" : "Finish Child Setup"}</span>
              </button>
              {/* closed by python script */}
              <button
                type="button"
                onClick={() => router.push(hasExistingProfile ? "/dashboard" : "/")}
                className="rounded-3xl bg-white px-10 py-5 font-headline text-xl font-bold text-stone-600 shadow-[0_4px_15px_rgba(0,0,0,0.05)] border border-stone-200 transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t border-stone-200/50 bg-[rgba(255,255,255,0.82)] px-6 py-3 backdrop-blur-xl md:hidden">
        {[
          { icon: "dashboard", label: "Dash", href: "/dashboard" },
          { icon: "qr_code_scanner", label: "Scan", href: "/analyze" },
          { icon: "add", label: "Add", href: "/analyze", featured: true },
          { icon: "trending_up", label: "Trends", href: "/insights" },
          { icon: "face", label: "Kids", href: "/onboarding", active: true },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center ${
              item.featured
                ? "-mt-8 rounded-full bg-[var(--green-400)] p-2 text-[var(--green-700)] shadow-xl"
                : item.active
                  ? "text-[var(--green-700)]"
                  : "text-stone-400"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {!item.featured ? <span className="mt-1 text-[10px] font-medium">{item.label}</span> : null}
          </Link>
        ))}
      </nav>
    </div>
  );
}
