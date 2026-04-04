"use client";

import Link from "next/link";
import { useState } from "react";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import { getUserData, updateChildProfile, type ChildProfile } from "../lib/storage";

const caregiverAcceptedFoods = [
  { name: "Sliced Honeycrisp", note: "Skin-off, slight cinnamon", icon: "nutrition" },
  { name: "Mini Pita Pockets", note: "With hummus inside", icon: "bakery_dining" },
  { name: "Boiled Egg Stars", note: "Cut with star shape mold", icon: "egg" },
];

const caregiverPolicies = [
  { icon: "no_drinks", text: "100% Nut Free" },
  { icon: "wine_bar", text: "No Glass Containers" },
  { icon: "eco", text: "Waste-Free Preferred" },
  { icon: "water_drop", text: "Water Only Bottles" },
];

export default function Profile() {
  const [profile, setProfile] = useState<ChildProfile | null>(() => getUserData()?.childProfile ?? null);
  const [newPolicy, setNewPolicy] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [caregiverMessage, setCaregiverMessage] = useState<string | null>(null);

  const handleUpdateProfile = (updates: Partial<ChildProfile>) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    
    try {
      updateChildProfile(updates);
      setSaveMessage("Profile updated!");
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setSaveMessage("Failed to save. Please try again.");
    }
  };

  const toggleSensoryPreference = (pref: string) => {
    if (!profile) return;
    
    const current = profile.sensoryPreferences || [];
    const updated = current.includes(pref)
      ? current.filter(p => p !== pref)
      : [...current, pref];
    
    handleUpdateProfile({ sensoryPreferences: updated });
  };

  const addPolicy = () => {
    if (!profile || !newPolicy.trim()) return;
    
    const currentPolicies = profile.schoolPolicies || [];
    if (!currentPolicies.includes(newPolicy.trim())) {
      handleUpdateProfile({ schoolPolicies: [...currentPolicies, newPolicy.trim()] });
      setNewPolicy("");
    }
  };

  const removePolicy = (policy: string) => {
    if (!profile) return;
    
    const currentPolicies = profile.schoolPolicies || [];
    handleUpdateProfile({ schoolPolicies: currentPolicies.filter(p => p !== policy) });
  };

  const setTimedMessage = (message: string) => {
    setCaregiverMessage(message);
    window.setTimeout(() => setCaregiverMessage(null), 2500);
  };

  const getCaregiverSummary = () => {
    if (!profile) return "";

    const sensorySummary = (profile.sensoryPreferences || []).join(", ") || "No sensory preferences saved yet";
    const schoolSummary = (profile.schoolPolicies || []).join(", ") || "No school policies saved yet";

    return [
      `${profile.name}'s caregiver handoff`,
      `${profile.grade}, age ${profile.age}`,
      `Sensory preferences: ${sensorySummary}`,
      `Eating habits: ${profile.eatingHabits || "No notes yet"}`,
      `School policies: ${schoolSummary}`,
      "Quick win: Freeze the yogurt tube so it stays cold until lunch.",
      "Avoid: Keep berries separate from yogurt to prevent sogginess.",
    ].join("\n");
  };

  const handleCaregiverAction = async (action: "share" | "whatsapp" | "email" | "print") => {
    if (!profile) return;

    const summary = getCaregiverSummary();

    try {
      if (action === "share") {
        if (navigator.share) {
          await navigator.share({
            title: `${profile.name}'s Caregiver Hub`,
            text: summary,
          });
          setTimedMessage("Caregiver summary shared.");
          return;
        }

        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(summary);
          setTimedMessage("Caregiver summary copied to clipboard.");
          return;
        }

        setTimedMessage("Sharing isn't available in this browser.");
        return;
      }

      if (action === "whatsapp") {
        window.open(`https://wa.me/?text=${encodeURIComponent(summary)}`, "_blank", "noopener,noreferrer");
        setTimedMessage("Opened WhatsApp share.");
        return;
      }

      if (action === "email") {
        window.location.href = `mailto:?subject=${encodeURIComponent(`${profile.name}'s Lunchly Handoff`)}&body=${encodeURIComponent(summary)}`;
        setTimedMessage("Opened email draft.");
        return;
      }

      window.print();
      setTimedMessage("Print dialog opened.");
    } catch (error) {
      console.error("Caregiver action failed:", error);
      setTimedMessage("That action could not be completed.");
    }
  };

  if (!profile) {
    return (
      <>
        <TopNav />
        <main className="pt-24 px-4 pb-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-on-surface-variant mb-4">No profile found. Please complete the setup.</p>
            <Link href="/" className="bg-primary text-white px-6 py-3 rounded-3xl font-bold">
              Go to Setup
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopNav />
      
      <main className="pt-24 px-4 pb-20 max-w-7xl mx-auto">
        {/* Save Message Toast */}
        {saveMessage && (
          <div className="fixed top-20 right-4 bg-primary text-white px-4 py-3 rounded-3xl shadow-lg z-50 animate-fade-in">
            {saveMessage}
          </div>
        )}

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            Child Profile &amp; Sensory Preferences
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Tailor the Lunchly experience to your child&apos;s unique needs, habits, and school environment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <section className="lg:col-span-4 space-y-8">
            {/* Profile Card */}
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 text-center flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full ring-4 ring-primary-container ring-offset-4 overflow-hidden bg-surface-container-high">
                  <img
                    alt={`${profile.name}'s Profile`}
                    className="w-full h-full object-cover"
                    src="/stitch-assets/1d2466329e3836060d4ee06a33a039da2fa09e8baa0023d13b5caa819469531e.png"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <h2 className="text-2xl font-headline font-bold text-on-surface">{profile.name}</h2>
              <p className="text-on-surface-variant font-medium">{profile.grade} • {profile.age} Years Old</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-tertiary-container/30 text-on-tertiary-container rounded-full text-xs font-semibold">
                  Active Profile
                </span>
                <span className="px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full text-xs font-semibold">
                  Morning School
                </span>
              </div>
            </div>

            {/* Allergy & School Policy */}
            <div className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">school</span>
                Allergy &amp; School Policy
              </h3>
              <div className="space-y-3">
                {(profile.schoolPolicies || []).map((policy) => (
                  <div key={policy} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-tertiary">policy</span>
                      <span className="text-sm font-medium">{policy}</span>
                    </div>
                    <button 
                      onClick={() => removePolicy(policy)}
                      className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
                    >
                      close
                    </button>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPolicy}
                    onChange={(e) => setNewPolicy(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPolicy())}
                    placeholder="Add new policy"
                    className="flex-1 px-3 py-2 bg-surface-container-lowest rounded-lg text-sm border border-transparent focus:border-primary outline-none"
                  />
                  <button 
                    onClick={addPolicy}
                    className="px-3 py-2 bg-primary text-white rounded-lg hover:scale-105 transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column */}
          <section className="lg:col-span-8 space-y-8">
            {/* Sensory Preferences */}
            <div id="sensory-preferences" className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 scroll-mt-24">
              <h3 className="font-headline font-bold text-2xl mb-6">Sensory Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "restaurant", title: "Picky Eater", desc: "Prioritizes familiar textures and predictable flavor profiles.", iconClass: "text-primary" },
                  { icon: "psychology", title: "Sensory-Sensitive", desc: "Aversion to mixed textures, strong smells, or soggy foods.", iconClass: "text-tertiary" },
                  { icon: "fitness_center", title: "Sports Day Focus", desc: "Higher protein and complex carbs for energy on PE days.", iconClass: "text-secondary" },
                  { icon: "savings", title: "Budget-Conscious", desc: "Suggests ingredients that are currently seasonal or in-bulk.", iconClass: "text-on-primary-container" },
                ].map((item) => (
                  <label 
                    key={item.title} 
                    className={`group relative flex flex-col gap-4 p-5 rounded-3xl bg-surface-container hover:bg-primary-container/10 border-2 transition-all cursor-pointer ${
                      (profile.sensoryPreferences || []).includes(item.title) 
                        ? "border-primary bg-primary-container/5" 
                        : "border-transparent"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(profile.sensoryPreferences || []).includes(item.title)}
                      onChange={() => toggleSensoryPreference(item.title)}
                      className="absolute right-4 top-4 w-6 h-6 rounded-full text-primary focus:ring-primary-container border-outline"
                    />
                    <div className={`w-12 h-12 bg-surface-container-lowest rounded-lg flex items-center justify-center ${item.iconClass}`}>
                      <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-lg">{item.title}</p>
                      <p className="text-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Eating Habits & Independence */}
            <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                <h3 className="font-headline font-bold text-xl">Eating Habits &amp; Independence</h3>
              </div>
              <p className="text-on-surface-variant text-sm mb-4">
                How much help does your child need during lunch? We use this to suggest packaging and food prep levels.
              </p>
              <div className="relative">
                <textarea
                  value={profile.eatingHabits || ""}
                  onChange={(e) => handleUpdateProfile({ eatingHabits: e.target.value })}
                  className="w-full bg-surface-container-lowest rounded-lg border-none focus:ring-2 focus:ring-primary/20 p-4 font-body text-on-surface placeholder:text-outline-variant"
                  placeholder="e.g., Can peel an orange but struggles with tiny wrappers. Needs pre-cut apples."
                  rows={4}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Needs pre-cut food", "Finger foods only", "Self-sufficient"].map((tag) => (
                    <button 
                      key={tag}
                      onClick={() => {
                        const current = profile.eatingHabits || "";
                        handleUpdateProfile({ 
                          eatingHabits: current ? `${current}, ${tag.toLowerCase()}` : tag.toLowerCase()
                        });
                      }}
                      className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold hover:bg-surface-container-highest transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Caregiver Hub */}
            <section id="caregiver-hub" className="scroll-mt-24 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-headline text-2xl font-extrabold text-on-surface">Caregiver Hub</h3>
                  <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                    Keep the handoff notes, accepted foods, and school-day rules inside the profile so whoever packs lunch gets the same guidance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCaregiverAction("share")}
                  className="rounded-full bg-secondary-container px-6 py-3 font-bold text-on-secondary-container shadow-sm transition-transform hover:scale-105"
                >
                  Share Hub
                </button>
              </div>

              {caregiverMessage && (
                <div className="rounded-3xl border border-primary/15 bg-primary-container/20 px-4 py-3 text-sm font-semibold text-on-primary-container">
                  {caregiverMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                <section className="md:col-span-4 bg-surface-container-low squircle-lg p-8 flex flex-col gap-6 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-bold text-xl">Best Accepted</h4>
                    <span className="material-symbols-outlined text-primary material-symbols-outlined-filled">favorite</span>
                  </div>
                  <div className="space-y-4">
                    {caregiverAcceptedFoods.map((food) => (
                      <div key={food.name} className="bg-surface-container-lowest p-4 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-primary-container">{food.icon}</span>
                        </div>
                        <div>
                          <p className="font-bold">{food.name}</p>
                          <p className="text-xs text-on-surface-variant">{food.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTimedMessage("Accepted foods reflect the current caregiver card.")}
                    className="mt-auto flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                  >
                    Review List <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                </section>

                <section className="md:col-span-8 bg-gradient-to-br from-primary to-primary-dim p-8 squircle-lg text-white relative overflow-hidden shadow-lg">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="material-symbols-outlined">star</span>
                      <h4 className="font-headline font-bold text-xl">Current Goals</h4>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1">
                        <h5 className="text-3xl font-black mb-2 tracking-tight">Color Quest: 3 Colors</h5>
                        <p className="text-primary-container/80 text-lg">
                          Goal: Include three vibrant colors in every lunchbox this week to boost phytonutrients.
                        </p>
                        <div className="mt-6 h-3 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary-container w-2/3" />
                        </div>
                        <p className="text-xs mt-2 font-medium">4 of 7 days completed</p>
                      </div>
                      <div className="shrink-0">
                        <div className="bg-white/10 backdrop-blur-md p-4 squircle-lg border border-white/20">
                          <span className="material-symbols-outlined text-5xl material-symbols-outlined-filled">palette</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                </section>

                <div className="md:col-span-5 grid grid-rows-2 gap-6">
                  <div className="bg-surface-container-high squircle-lg p-6 flex flex-col gap-4 border-l-8 border-primary">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined">bolt</span>
                      <h4 className="font-bold">Quick Win</h4>
                    </div>
                    <p className="text-on-surface font-medium italic">
                      &quot;Freeze the yogurt tube! It stays cold until lunch and acts as an ice pack.&quot;
                    </p>
                  </div>
                  <div className="bg-error-container/10 squircle-lg p-6 flex flex-col gap-4 border-l-8 border-error">
                    <div className="flex items-center gap-2 text-error">
                      <span className="material-symbols-outlined">block</span>
                      <h4 className="font-bold">Avoid</h4>
                    </div>
                    <p className="text-on-surface-variant text-sm">
                      Don&apos;t pack berries directly with yogurt. They get soggy. Use a separate small container.
                    </p>
                  </div>
                </div>

                <section className="md:col-span-7 bg-surface-container-low squircle-lg p-8 relative">
                  <div className="flex items-center gap-3 mb-6 text-on-surface">
                    <span className="material-symbols-outlined text-error">warning</span>
                    <h4 className="font-headline font-bold text-xl uppercase tracking-wider">School Policy Alert</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {caregiverPolicies.map((policy) => (
                      <div key={policy.text} className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center text-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant text-3xl">{policy.icon}</span>
                        <p className="font-bold text-sm">{policy.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="md:col-span-12 bg-surface-container-lowest p-8 squircle-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-surface-variant/50">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-secondary-container rounded-2xl flex items-center justify-center rotate-3">
                      <span className="material-symbols-outlined text-on-secondary-container text-4xl">qr_code_2</span>
                    </div>
                    <div>
                      <h4 className="text-2xl font-headline font-extrabold tracking-tight">Ready to hand off?</h4>
                      <p className="text-on-surface-variant">Use the profile as the single caregiver handoff card.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => void handleCaregiverAction("whatsapp")}
                      className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:brightness-110 transition-all shadow-lg active:scale-95"
                    >
                      <span className="material-symbols-outlined">chat</span>
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCaregiverAction("email")}
                      className="bg-tertiary text-on-tertiary px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:brightness-110 transition-all shadow-lg active:scale-95"
                    >
                      <span className="material-symbols-outlined">mail</span>
                      Email Hub
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCaregiverAction("print")}
                      className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-surface-variant transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined">print</span>
                      PDF Card
                    </button>
                  </div>
                </section>
              </div>
            </section>
          </section>
        </div>
      </main>

      <MobileNav />
    </>
  );
}
