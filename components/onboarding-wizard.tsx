"use client";

import { ChangeEvent, startTransition, useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  buildTeaser,
  getActiveProfile,
  type LunchlyProfile,
  upsertProfile,
} from "@/lib/profile-storage";

type DraftProfile = Omit<LunchlyProfile, "id" | "age" | "createdAt">;

const allergies = [
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

const schoolPolicies = [
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
  "Picky Eater",
  "Sensory-Sensitive",
  "Sports Day Hero",
  "Budget-Conscious",
  "Flavor Explorer",
  "Veggie Champion",
  "Eco Kid",
];

const activityLevels = ["Mostly sedentary", "Active (plays a lot)", "Sports champion"];
const lunchEatingTimes = ["10 min", "20 min", "30+ min"];
const appetiteStyles = ["Big eater", "Average", "Small / fussy eater"];
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
const avatarOptions = ["Sprout", "Rocket", "Rainbow", "Tiger"];

const stepCopy = [
  {
    title: "Basic Child Info",
    why: "We personalize age-appropriate portion sizing, milestones, and school-day guidance from the start.",
  },
  {
    title: "Allergies & School Policies",
    why: "Lunchly will automatically reject foods that conflict with allergies or school rules in future analysis.",
  },
  {
    title: "Eating Habits & Independence",
    why: "We suggest easy-open packaging, pacing, and lunch ideas that are realistic for your child at school.",
  },
  {
    title: "Sensory Preferences & Food Personality",
    why: "These traits help Lunchly explain nutrition improvements in a way your child is actually likely to accept.",
  },
  {
    title: "Lifestyle & Weekly Goals",
    why: "This helps the analyzer shift recommendations for sports days, focus support, fibre, or healthy weight gain.",
  },
  {
    title: "Review & Create Profile",
    why: "A final review builds trust and gives parents a clear picture of what Lunchly will use in the analyzer.",
  },
] as const;

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

export function OnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<DraftProfile>(createDefaultDraft);
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successTip, setSuccessTip] = useState("");

  useEffect(() => {
    const activeProfile = getActiveProfile();

    const frame = window.requestAnimationFrame(() => {
      if (isEditMode && activeProfile) {
        setDraft(toDraft(activeProfile));
        setExistingProfileId(activeProfile.id);
      }

      if (isAddMode) {
        setDraft((current) => ({
          ...createDefaultDraft(),
          caregiverName: activeProfile?.caregiverName || current.caregiverName,
        }));
        setExistingProfileId(null);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isAddMode, isEditMode]);

  useEffect(() => {
    if (!successTip) {
      return;
    }

    const timeout = window.setTimeout(() => {
      startTransition(() => {
        router.push("/dashboard");
      });
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [router, successTip]);

  const age = useMemo(() => calculateAge(draft.birthDate), [draft.birthDate]);
  const currentStep = stepCopy[step - 1];

  const validateStep = () => {
    if (step === 1 && (!draft.fullName || !draft.birthDate || !draft.grade || !draft.gender)) {
      return "Please complete the required child details before continuing.";
    }

    if (step === 4 && draft.foodPersonality.length < 2) {
      return "Pick at least two food personality cards so Lunchly can personalize suggestions.";
    }

    if (step === 5 && draft.familyPriorities.length < 1) {
      return "Choose at least one family priority so the analyzer knows what to optimize for.";
    }

    return "";
  };

  const goNext = () => {
    const validationError = validateStep();
    setError(validationError);

    if (validationError) {
      return;
    }

    setStep((current) => Math.min(current + 1, 6));
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  };

  const saveProfile = () => {
    const fullName = draft.fullName.trim();
    const profile: LunchlyProfile = {
      ...draft,
      id: existingProfileId ?? `profile_${crypto.randomUUID()}`,
      fullName,
      age,
      createdAt: new Date().toISOString(),
    };

    upsertProfile(profile);
    setSuccessTip(buildTeaser(profile));
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

  const applyAiDefaults = () => {
    const nextTraits = new Set(draft.foodPersonality);

    if (age <= 8) {
      nextTraits.add("Picky Eater");
      nextTraits.add("Sensory-Sensitive");
    }

    if (draft.activityLevel === "Sports champion") {
      nextTraits.add("Sports Day Hero");
    }

    if (draft.schoolPolicies.includes("Plastic-free / only steel tiffin")) {
      nextTraits.add("Eco Kid");
    }

    setDraft((current) => ({
      ...current,
      foodPersonality: Array.from(nextTraits).slice(0, 4),
      familyPriorities: current.familyPriorities.length
        ? current.familyPriorities
        : ["Brain food & focus", "Balanced macros (protein + carbs)"],
    }));
  };

  if (successTip) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center">
          <div className="w-full rounded-[2.5rem] bg-white p-10 text-center shadow-[0_22px_60px_rgba(56,56,51,0.06)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(145,247,142,0.26)] text-3xl font-black text-[var(--green-700)] animate-pulse">
              OK
            </div>
            <h1 className="font-headline mt-6 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
              {draft.fullName.split(" ")[0]}&apos;s profile is ready!
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted-ink)]">{successTip}</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--green-700)]">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <Link href="/" className="tertiary-pill">
              Back
            </Link>
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.48)]">
                Profile Wizard
              </p>
              <h1 className="font-headline mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                {isEditMode ? "Edit Child Profile" : isAddMode ? "Add Sibling" : "Create Child Profile"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-ink)]">
                Six guided steps, clear trust-building copy, and no dead-ends after setup.
              </p>
              <div className="mt-6 space-y-3">
                {stepCopy.map((item, index) => {
                  const stepNumber = index + 1;
                  const isActive = step === stepNumber;
                  const isDone = step > stepNumber;

                  return (
                    <div
                      key={item.title}
                      className={`rounded-[1.5rem] px-4 py-4 ${
                        isActive ? "bg-[rgba(0,117,31,0.1)]" : "bg-[var(--surface-low)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                            isDone || isActive
                              ? "bg-[var(--green-700)] text-white"
                              : "bg-white text-[var(--muted-ink)]"
                          }`}
                        >
                          {stepNumber}
                        </span>
                        <div>
                          <p className="font-headline text-sm font-bold text-[var(--ink)]">{item.title}</p>
                          <p className="text-xs leading-5 text-[var(--muted-ink)]">{item.why}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="rounded-[2.5rem] bg-white p-6 shadow-[0_18px_48px_rgba(56,56,51,0.05)] sm:p-8">
            <div className="flex flex-col gap-4 border-b border-[rgba(186,185,178,0.25)] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.52)]">
                  Step {step} of 6
                </p>
                <h2 className="font-headline mt-2 text-4xl font-extrabold tracking-[-0.05em] text-[var(--ink)]">
                  {currentStep.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted-ink)]">
                  {currentStep.why}
                </p>
              </div>
              <div className="h-3 w-full max-w-xs rounded-full bg-[var(--surface-low)] sm:w-72">
                <div
                  className="h-full rounded-full bg-[var(--green-700)] transition-all"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-8 space-y-8">
              {step === 1 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Parent / Caregiver name</span>
                    <input
                      value={draft.caregiverName}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, caregiverName: event.target.value }))
                      }
                      className="w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                      placeholder="Priya"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Full name</span>
                    <input
                      value={draft.fullName}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, fullName: event.target.value }))
                      }
                      className="w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                      placeholder="Arjun Mehta"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Date of birth</span>
                    <input
                      type="date"
                      value={draft.birthDate}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, birthDate: event.target.value }))
                      }
                      className="w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Grade</span>
                    <input
                      value={draft.grade}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, grade: event.target.value }))
                      }
                      className="w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                      placeholder="Grade 2"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Section</span>
                    <input
                      value={draft.section}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, section: event.target.value }))
                      }
                      className="w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                      placeholder="B"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Gender</span>
                    <select
                      value={draft.gender}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, gender: event.target.value }))
                      }
                      className="w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Boy">Boy</option>
                      <option value="Girl">Girl</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Height (optional)</span>
                    <input
                      value={draft.height}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, height: event.target.value }))
                      }
                      className="w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                      placeholder="124 cm"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Weight (optional)</span>
                    <input
                      value={draft.weight}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, weight: event.target.value }))
                      }
                      className="w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                      placeholder="24 kg"
                    />
                  </label>
                  <div className="space-y-3 sm:col-span-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Avatar or photo</span>
                    <div className="flex flex-wrap gap-3">
                      {avatarOptions.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setDraft((current) => ({ ...current, avatar }))}
                          className={`rounded-full px-4 py-3 text-sm font-semibold ${
                            draft.avatar === avatar
                              ? "bg-[var(--green-700)] text-white"
                              : "bg-[var(--surface-low)] text-[var(--ink)]"
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                      <label className="inline-flex cursor-pointer items-center rounded-full bg-[var(--surface-low)] px-4 py-3 text-sm font-semibold text-[var(--ink)]">
                        Upload photo
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                    <p className="text-sm text-[var(--muted-ink)]">
                      Age auto-calculates to <span className="font-semibold text-[var(--green-700)]">{age || "--"}</span> years.
                    </p>
                  </div>
                </div>
              ) : null}
              {step === 2 ? (
                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                      Allergies
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {allergies.map((item) => {
                        const isActive = draft.allergies.includes(item);

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
                            className={`rounded-full px-4 py-3 text-sm font-semibold ${
                              isActive ? "bg-[var(--green-700)] text-white" : "bg-[var(--surface-low)] text-[var(--ink)]"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      value={draft.customAllergy}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, customAllergy: event.target.value }))
                      }
                      className="mt-4 w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                      placeholder="Other allergy"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.48)]">
                      School Policies
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {schoolPolicies.map((item) => {
                        const isActive = draft.schoolPolicies.includes(item);

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
                            className={`rounded-[1.5rem] px-4 py-4 text-left text-sm font-semibold ${
                              isActive ? "bg-[rgba(0,117,31,0.1)] text-[var(--green-700)]" : "bg-[var(--surface-low)] text-[var(--ink)]"
                            }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      value={draft.customPolicy}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, customPolicy: event.target.value }))
                      }
                      className="mt-4 w-full rounded-[1.5rem] bg-[var(--surface-low)] px-4 py-4 outline-none"
                      placeholder="Custom policy"
                    />
                  </div>

                  <button type="button" onClick={applyAiDefaults} className="app-button-secondary">
                    Let Lunchly&apos;s AI suggest preferences for my {age || 8}-year-old
                  </button>
                </div>
              ) : null}
              {step === 3 ? (
                <div className="space-y-8">
                  <div className="rounded-[1.8rem] bg-[var(--surface-low)] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-headline text-xl font-bold text-[var(--ink)]">
                          How much help does your child need during lunch?
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                          1 means fully independent. 3 means they still need full help.
                        </p>
                      </div>
                      <span className="font-headline text-4xl font-extrabold text-[var(--green-700)]">
                        {draft.independenceLevel}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="1"
                      value={draft.independenceLevel}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          independenceLevel: Number(event.target.value),
                        }))
                      }
                      className="mt-5 w-full accent-[var(--green-700)]"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[var(--ink)]">Average lunch eating time</p>
                      {lunchEatingTimes.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setDraft((current) => ({ ...current, lunchEatingTime: item }))}
                          className={`block w-full rounded-[1.5rem] px-4 py-4 text-left text-sm font-semibold ${
                            draft.lunchEatingTime === item
                              ? "bg-[rgba(0,117,31,0.1)] text-[var(--green-700)]"
                              : "bg-[var(--surface-low)] text-[var(--ink)]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[var(--ink)]">Appetite style</p>
                      {appetiteStyles.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setDraft((current) => ({ ...current, appetiteStyle: item }))}
                          className={`block w-full rounded-[1.5rem] px-4 py-4 text-left text-sm font-semibold ${
                            draft.appetiteStyle === item
                              ? "bg-[rgba(0,117,31,0.1)] text-[var(--green-700)]"
                              : "bg-[var(--surface-low)] text-[var(--ink)]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              {step === 4 ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {foodPersonalityCards.map((item) => {
                      const isActive = draft.foodPersonality.includes(item);

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setDraft((current) => {
                              const nextValues = toggleValue(current.foodPersonality, item);
                              return {
                                ...current,
                                foodPersonality: nextValues.slice(0, 4),
                              };
                            })
                          }
                          className={`rounded-[1.8rem] px-5 py-5 text-left ${
                            isActive ? "bg-[rgba(0,117,31,0.1)]" : "bg-[var(--surface-low)]"
                          }`}
                        >
                          <p className="font-headline text-lg font-bold text-[var(--ink)]">{item}</p>
                          <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                            {item === "Picky Eater" && "Loves familiar textures and predictable flavors."}
                            {item === "Sensory-Sensitive" && "Aversion to mixed textures, strong smells, or soggy food."}
                            {item === "Sports Day Hero" && "Needs higher protein and complex carbs on PE days."}
                            {item === "Budget-Conscious" && "Prefers seasonal, value-friendly ingredients."}
                            {item === "Flavor Explorer" && "Enjoys mild spices and new Indian tastes."}
                            {item === "Veggie Champion" && "We will push more hidden-veg opportunities."}
                            {item === "Eco Kid" && "Reusable and zero-waste packaging matters."}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-[var(--muted-ink)]">Pick two to four cards.</p>
                </div>
              ) : null}
              {step === 5 ? (
                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">Activity level</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {activityLevels.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setDraft((current) => ({ ...current, activityLevel: item }))}
                          className={`rounded-full px-4 py-3 text-sm font-semibold ${
                            draft.activityLevel === item
                              ? "bg-[var(--green-700)] text-white"
                              : "bg-[var(--surface-low)] text-[var(--ink)]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">Special days selector</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {specialDayOptions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setDraft((current) => ({
                              ...current,
                              specialDays: toggleValue(current.specialDays, item),
                            }))
                          }
                          className={`rounded-full px-4 py-3 text-sm font-semibold ${
                            draft.specialDays.includes(item)
                              ? "bg-[rgba(0,103,173,0.12)] text-[var(--blue-700)]"
                              : "bg-[var(--surface-low)] text-[var(--ink)]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">Family priority (choose one or two)</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {familyPriorityOptions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setDraft((current) => {
                              const nextValues = toggleValue(current.familyPriorities, item);
                              return {
                                ...current,
                                familyPriorities: nextValues.slice(0, 2),
                              };
                            })
                          }
                          className={`rounded-[1.5rem] px-4 py-4 text-left text-sm font-semibold ${
                            draft.familyPriorities.includes(item)
                              ? "bg-[rgba(249,229,52,0.42)] text-[color:#4f4700]"
                              : "bg-[var(--surface-low)] text-[var(--ink)]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              {step === 6 ? (
                <div className="space-y-6">
                  <div className="rounded-[2rem] bg-[var(--surface-low)] p-6">
                    <h3 className="font-headline text-2xl font-extrabold text-[var(--ink)]">Profile summary</h3>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] bg-white px-4 py-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">
                          Child
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                          {draft.fullName || "No name yet"} | Age {age || "--"} | {draft.grade} {draft.section}
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] bg-white px-4 py-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">
                          Allergies & policies
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                          {[...draft.allergies, draft.customAllergy].filter(Boolean).join(", ") || "None selected"}.
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted-ink)]">
                          {[...draft.schoolPolicies, draft.customPolicy].filter(Boolean).join(", ") || "No school policies selected"}.
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] bg-white px-4 py-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">
                          Eating style
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                          Independence level {draft.independenceLevel}, {draft.lunchEatingTime}, {draft.appetiteStyle}.
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] bg-white px-4 py-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(56,56,51,0.46)]">
                          Personality & goals
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted-ink)]">
                          {draft.foodPersonality.join(", ")}.
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[var(--muted-ink)]">
                          Priorities: {draft.familyPriorities.join(", ")}.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={saveProfile} className="app-button-primary min-w-[14rem] text-lg">
                    {isEditMode ? "Save Profile" : "Create Profile"}
                  </button>
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="mt-6 rounded-[1.2rem] bg-[rgba(190,45,6,0.08)] px-4 py-3 text-sm font-medium text-[color:#7d2207]">
                {error}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-4">
              <button type="button" onClick={goBack} className="app-button-secondary" disabled={step === 1}>
                Back
              </button>
              {step < 6 ? (
                <button type="button" onClick={goNext} className="app-button-primary">
                  Continue
                </button>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
