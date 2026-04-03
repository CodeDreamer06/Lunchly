"use client";

import { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import { getUserData, updateChildProfile, type ChildProfile } from "../lib/storage";

export default function Profile() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newPolicy, setNewPolicy] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData?.childProfile) {
      setProfile(userData.childProfile);
    }
    setIsLoading(false);
  }, []);

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

  if (isLoading) {
    return (
      <>
        <TopNav />
        <main className="pt-24 px-4 pb-20 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant">Loading profile...</p>
          </div>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <TopNav />
        <main className="pt-24 px-4 pb-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-on-surface-variant mb-4">No profile found. Please complete the setup.</p>
            <a href="/" className="bg-primary text-white px-6 py-3 rounded-3xl font-bold">
              Go to Setup
            </a>
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
            Tailor the LunchLogic experience to your child&apos;s unique needs, habits, and school environment.
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
            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15">
              <h3 className="font-headline font-bold text-2xl mb-6">Sensory Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "restaurant", title: "Picky Eater", desc: "Prioritizes familiar textures and predictable flavor profiles.", color: "primary" },
                  { icon: "psychology", title: "Sensory-Sensitive", desc: "Aversion to mixed textures, strong smells, or soggy foods.", color: "tertiary" },
                  { icon: "fitness_center", title: "Sports Day Focus", desc: "Higher protein and complex carbs for energy on PE days.", color: "secondary" },
                  { icon: "savings", title: "Budget-Conscious", desc: "Suggests ingredients that are currently seasonal or in-bulk.", color: "on-primary-container" },
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
                    <div className={`w-12 h-12 bg-surface-container-lowest rounded-lg flex items-center justify-center text-${item.color}`}>
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

          </section>
        </div>
      </main>

      <MobileNav />
    </>
  );
}
