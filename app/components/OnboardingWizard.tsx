"use client";

import { useState } from "react";
import { createInitialUserData, markOnboardingComplete } from "../lib/storage";

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    grade: "",
    allergies: [] as string[],
    schoolPolicies: [] as string[],
    sensoryPreferences: [] as string[],
    eatingHabits: "",
  });
  const [newAllergy, setNewAllergy] = useState("");
  const [newPolicy, setNewPolicy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      createInitialUserData({
        name: formData.name,
        age: parseInt(formData.age) || 5,
        grade: formData.grade,
        allergies: formData.allergies,
        schoolPolicies: formData.schoolPolicies,
        sensoryPreferences: formData.sensoryPreferences,
        eatingHabits: formData.eatingHabits,
      });
      
      markOnboardingComplete();
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
      setIsSubmitting(false);
    }
  };

  const toggleSensoryPreference = (pref: string) => {
    setFormData(prev => ({
      ...prev,
      sensoryPreferences: prev.sensoryPreferences.includes(pref)
        ? prev.sensoryPreferences.filter(p => p !== pref)
        : [...prev.sensoryPreferences, pref]
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addPolicy = () => {
    if (newPolicy.trim() && !formData.schoolPolicies.includes(newPolicy.trim())) {
      setFormData(prev => ({
        ...prev,
        schoolPolicies: [...prev.schoolPolicies, newPolicy.trim()]
      }));
      setNewPolicy("");
    }
  };

  const removePolicy = (policy: string) => {
    setFormData(prev => ({
      ...prev,
      schoolPolicies: prev.schoolPolicies.filter(p => p !== policy)
    }));
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl text-on-primary-container">child_care</span>
          </div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-2">
            Welcome to LunchLogic
          </h1>
          <p className="text-on-surface-variant">
            Let&apos;s set up your child&apos;s profile to create perfect lunches
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-10 h-2 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-surface-container-high"
              }`}
            />
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-error-container/20 border border-error rounded-3xl flex items-center gap-3">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-error text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-headline font-bold text-on-surface mb-6">
              Basic Information
            </h2>
            
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                Child&apos;s Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface-container rounded-3xl px-4 py-3 border-2 border-transparent focus:border-primary outline-none"
                placeholder="e.g., Leo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-surface-container rounded-3xl px-4 py-3 border-2 border-transparent focus:border-primary outline-none"
                  placeholder="e.g., 7"
                  min="2"
                  max="18"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">
                  Grade
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full bg-surface-container rounded-3xl px-4 py-3 border-2 border-transparent focus:border-primary outline-none"
                >
                  <option value="">Select grade</option>
                  <option value="Preschool">Preschool</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Allergies & Policies */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-headline font-bold text-on-surface mb-6">
              Allergies & School Policies
            </h2>
            
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                Allergies & Restrictions
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                  className="flex-1 bg-surface-container rounded-3xl px-4 py-3 border-2 border-transparent focus:border-primary outline-none"
                  placeholder="e.g., Peanuts"
                />
                <button
                  onClick={addAllergy}
                  className="bg-primary text-white px-4 py-3 rounded-3xl font-bold hover:scale-105 transition-transform"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="bg-error-container/30 text-error px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {allergy}
                    <button
                      onClick={() => removeAllergy(allergy)}
                      className="material-symbols-outlined text-xs cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                ))}
                {formData.allergies.length === 0 && (
                  <span className="text-on-surface-variant text-sm italic">No allergies added</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                School Policies
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newPolicy}
                  onChange={(e) => setNewPolicy(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPolicy())}
                  className="flex-1 bg-surface-container rounded-3xl px-4 py-3 border-2 border-transparent focus:border-primary outline-none"
                  placeholder="e.g., Nut-Free Policy"
                />
                <button
                  onClick={addPolicy}
                  className="bg-primary text-white px-4 py-3 rounded-3xl font-bold hover:scale-105 transition-transform"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.schoolPolicies.map((policy) => (
                  <span
                    key={policy}
                    className="bg-tertiary-container/30 text-on-tertiary-container px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {policy}
                    <button
                      onClick={() => removePolicy(policy)}
                      className="material-symbols-outlined text-xs cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                ))}
                {formData.schoolPolicies.length === 0 && (
                  <span className="text-on-surface-variant text-sm italic">No policies added</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Sensory Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-headline font-bold text-on-surface mb-6">
              Sensory Preferences
            </h2>
            <p className="text-on-surface-variant text-sm mb-4">
              Select all that apply to your child
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: "restaurant", title: "Picky Eater", desc: "Prefers familiar textures and flavors", color: "primary" },
                { icon: "psychology", title: "Sensory-Sensitive", desc: "Avoids mixed textures or strong smells", color: "tertiary" },
                { icon: "fitness_center", title: "Sports Day Focus", desc: "Needs high energy foods on active days", color: "secondary" },
                { icon: "savings", title: "Budget-Conscious", desc: "Prioritize seasonal and bulk items", color: "on-primary-container" },
              ].map((item) => (
                <label
                  key={item.title}
                  className={`relative flex flex-col gap-3 p-5 rounded-3xl bg-surface-container hover:bg-primary-container/10 border-2 transition-all cursor-pointer ${
                    formData.sensoryPreferences.includes(item.title)
                      ? "border-primary bg-primary-container/10"
                      : "border-transparent"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.sensoryPreferences.includes(item.title)}
                    onChange={() => toggleSensoryPreference(item.title)}
                    className="absolute right-4 top-4 w-5 h-5 rounded-full text-primary"
                  />
                  <div className={`w-12 h-12 bg-surface-container-lowest rounded-lg flex items-center justify-center text-${item.color}`}>
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-on-surface">{item.title}</p>
                    <p className="text-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Eating Habits */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-headline font-bold text-on-surface mb-6">
              Eating Habits & Independence
            </h2>
            
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">
                How much help does your child need during lunch?
              </label>
              <p className="text-on-surface-variant text-sm mb-3">
                This helps us suggest appropriate packaging and food prep levels.
              </p>
              <textarea
                value={formData.eatingHabits}
                onChange={(e) => setFormData({ ...formData, eatingHabits: e.target.value })}
                className="w-full bg-surface-container rounded-3xl px-4 py-3 border-2 border-transparent focus:border-primary outline-none min-h-[120px] resize-none"
                placeholder="e.g., Can peel an orange but struggles with tiny wrappers. Needs pre-cut apples."
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["Needs pre-cut food", "Finger foods only", "Self-sufficient", "Needs help opening containers"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const currentHabits = formData.eatingHabits;
                    setFormData({
                      ...formData,
                      eatingHabits: currentHabits ? `${currentHabits}, ${tag.toLowerCase()}` : tag.toLowerCase()
                    });
                  }}
                  className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold hover:bg-surface-container-highest transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-10">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-8 py-4 bg-surface-container text-on-surface rounded-3xl font-headline font-bold hover:bg-surface-container-high transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isSubmitting || (step === 1 && (!formData.name || !formData.age))}
            className="flex-1 bg-primary text-white py-4 rounded-3xl font-headline font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Saving...
              </>
            ) : step === 4 ? (
              <>
                Complete Setup
                <span className="material-symbols-outlined">check</span>
              </>
            ) : (
              <>
                Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
