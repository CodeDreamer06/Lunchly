"use client";

import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import ErrorToast from "../components/ErrorToast";
import { getUserData, getAvailableIngredients, setAvailableIngredients, saveLunchSuggestion, type ChildProfile } from "../lib/storage";
import { streamLLM } from "../lib/llm-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Fridge() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData?.childProfile) {
      setProfile(userData.childProfile);
    }
    const storedIngredients = getAvailableIngredients();
    if (storedIngredients.items.length > 0) {
      setIngredients(storedIngredients.items);
    }
  }, []);

  const addIngredient = () => {
    if (!newIngredient.trim()) return;
    if (!ingredients.includes(newIngredient.trim())) {
      const updated = [...ingredients, newIngredient.trim()];
      setIngredients(updated);
      setAvailableIngredients(updated);
    }
    setNewIngredient("");
  };

  const removeIngredient = (ingredient: string) => {
    const updated = ingredients.filter(i => i !== ingredient);
    setIngredients(updated);
    setAvailableIngredients(updated);
  };

  const handleScanFridge = async () => {
    if (!profile) {
      setError("Please set up a child profile first");
      return;
    }

    if (ingredients.length === 0) {
      setError("Please add some ingredients first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions("");

    try {
      const stream = streamLLM({
        type: "generateLunchSuggestions",
        childProfile: {
          name: profile.name,
          age: profile.age,
          grade: profile.grade,
          allergies: profile.allergies || [],
          preferences: profile.sensoryPreferences || [],
          schoolPolicies: profile.schoolPolicies || [],
          eatingHabits: profile.eatingHabits || "",
        },
        availableIngredients: ingredients,
      });

      let fullContent = "";
      for await (const chunk of stream) {
        fullContent += chunk;
        setSuggestions(fullContent);
      }

      // Save the complete result
      saveLunchSuggestion({
        id: Date.now().toString(),
        content: fullContent,
        ingredients: ingredients,
        generatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const remixes = [
    {
      name: "Chicken Pasta Skewers",
      from: "Roasted Chicken",
      desc: "Thread leftover penne and chicken chunks with fresh cherry tomatoes. Serve cold with pesto dip.",
      tag: "Fast",
      img: "/stitch-assets/b32b673b02abeb63af4311a35d4d7ee6cd11b5224af6fa840167a6b21290da12.png",
    },
    {
      name: "Crunchy Broccoli Slaw",
      from: "Broccoli",
      desc: "Finely chop the steamed broccoli and mix with yogurt, raisins, and sunflower seeds from the pantry.",
      tag: "No Heat",
      img: "/stitch-assets/c788282f9de5cc2df155dc968a56fdeab85efcb176eb7770859b164bdb47e6a4.png",
    },
    {
      name: "Shelf-Stable Fiesta Wrap",
      from: "Pantry Combo",
      desc: "Combine canned black beans, corn, and leftover chicken in a whole wheat wrap for an easy meal.",
      tag: "Pantry Focus",
      img: "/stitch-assets/100c6b366b02915ad2ef392550f07d32629bd7b3c4f99ceb11dca17de54bc346.png",
    },
  ];

  return (
    <>
      <TopNav />
      
      <main className="pt-24 p-4 md:p-8 max-w-7xl mx-auto">
        {/* Top Header Area */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <nav className="flex gap-2 text-xs font-bold text-primary mb-2 uppercase tracking-widest">
              <span>Remix</span>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface-variant">Pantry Prep</span>
            </nav>
            <h2 className="text-4xl font-headline font-black tracking-tight text-on-surface">Fridge Remix</h2>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-full">
            <button className="px-6 py-2 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/20">Fridge Mode</button>
            <button className="px-6 py-2 text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-colors rounded-full">Pantry Only</button>
          </div>
        </header>

        {/* Ingredients Input Section */}
        <section className="mb-12 bg-surface-container-lowest rounded-xl p-8 border border-primary/20">
          <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">kitchen</span>
            Available Ingredients
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addIngredient()}
              placeholder="Add ingredient (e.g., chicken, broccoli, pasta)"
              className="flex-1 px-4 py-3 bg-surface-container-low rounded-xl border border-transparent focus:border-primary outline-none"
            />
            <button
              onClick={addIngredient}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dim transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
          
          {/* Ingredient Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {ingredients.map((ingredient) => (
              <div key={ingredient} className="flex items-center gap-1 bg-primary-container px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-on-primary-container">{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="material-symbols-outlined text-on-primary-container hover:text-error text-sm"
                >
                  close
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleScanFridge}
            disabled={isLoading || ingredients.length === 0}
            className="w-full bg-gradient-to-r from-primary to-primary-dim text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            {isLoading ? "Generating Ideas..." : "Generate Lunch Ideas from Ingredients"}
          </button>

          {/* Generated Suggestions */}
          {suggestions !== null && (
            <div className="mt-8 bg-surface-container-low rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                  {isLoading ? "Generating Suggestions" : "AI-Generated Suggestions"}
                </span>
                <button
                  onClick={() => setSuggestions(null)}
                  className="material-symbols-outlined text-on-surface-variant hover:text-error"
                >
                  close
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-on-surface">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {suggestions || "_Thinking..._"}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </section>

        {/* Fridge Scan Hero */}
        <section className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-primary to-on-primary-fixed-variant rounded-xl p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[360px]">
            <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span className="text-xs font-bold uppercase tracking-tighter">AI Scan Complete</span>
              </div>
              <h3 className="text-5xl font-headline font-black mb-4 leading-none">Detected Leftovers</h3>
              <p className="text-primary-container text-lg font-medium">
                We found {ingredients.length} item{ingredients.length !== 1 ? "s" : ""} in your fridge ready for a lunch makeover.
              </p>
            </div>
            <div className="relative z-10 flex gap-4 mt-8 flex-wrap">
              {[
                { icon: "restaurant", label: "Main", value: ingredients[0] || "Add ingredients", color: "bg-secondary-container text-on-secondary-container" },
                { icon: "flatware", label: "Base", value: ingredients[1] || "--", color: "bg-tertiary-container text-on-tertiary-container" },
                { icon: "eco", label: "Veggie", value: ingredients[2] || "--", color: "bg-primary-container text-on-primary-container" },
              ].map((item, i) => (
                <div key={i} className="glass-card p-4 rounded-2xl flex items-center gap-3 border border-white/30 text-on-surface">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold opacity-60">{item.label}</p>
                    <p className="font-bold text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Decorative 3D-ish Image Leak */}
            <div className="absolute -right-12 -bottom-12 w-80 h-80 opacity-90 drop-shadow-2xl hidden lg:block">
              <img
                alt="Healthy Bowl"
                className="w-full h-full object-contain transform rotate-12"
                src="/stitch-assets/661bf1f1dd582a4a3d65703cd85cbc711c0fd3884711016cf61feba1d0f90e81.png"
              />
            </div>
          </div>

          {/* Quick Stats/Filters */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <div className="bg-secondary-container rounded-xl p-6 flex-1 flex flex-col justify-between">
              <h4 className="font-black text-on-secondary-container text-xl leading-tight">Quick Filters</h4>
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { icon: "ac_unit", text: "No Reheating" },
                  { icon: "cleaning_services", text: "Low Mess" },
                  { icon: "timer", text: "5-Min Prep" },
                  { icon: "school", text: "Nut Free" },
                ].map((filter, i) => (
                  <button key={i} className="bg-white/50 px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">{filter.icon}</span> {filter.text}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-highest rounded-xl p-6 h-32 flex items-center justify-between">
              <div>
                <p className="text-on-surface-variant font-bold text-sm">Pantry Items Used</p>
                <p className="text-3xl font-black">{ingredients.length} <span className="text-sm font-medium opacity-50">Items</span></p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                <div className="absolute inset-0 border-t-4 border-primary rounded-full"></div>
                <span className="text-xs font-bold text-primary">{Math.min(ingredients.length * 10, 100)}%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Remix Ideas Grid */}
        <h3 className="text-2xl font-headline font-black mb-8">Remix Ideas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {remixes.map((remix, i) => (
            <div key={i} className="group relative bg-surface-container-low rounded-xl overflow-hidden hover:bg-white transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <img alt={remix.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={remix.img} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary">
                  From: {remix.from}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-headline font-bold mb-2">{remix.name}</h4>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">{remix.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-surface-variant/50">
                  <div className="flex gap-2 items-center">
                    <span className="material-symbols-outlined text-secondary">bolt</span>
                    <span className="text-xs font-bold">{remix.tag}</span>
                  </div>
                  <button className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pantry Prep Section */}
        <section className="bg-surface-container rounded-xl p-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h3 className="text-3xl font-headline font-black mb-4">Pantry Prep Mode</h3>
            <p className="text-on-surface-variant font-medium max-w-lg mb-8">
              Running low on fresh items? Activate our end-of-week strategy to build nutritious lunches using only long-life pantry staples.
            </p>
            <div className="flex flex-wrap gap-6">
              {[
                { icon: "view_cozy", label: "Starch Base", value: "Quinoa & Rice" },
                { icon: "egg_alt", label: "Proteins", value: "Tuna & Beans" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant">{item.label}</p>
                    <p className="font-bold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-xl border border-surface-variant/20">
            <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-secondary">Smart Recommendation</h4>
            <div className="flex items-center gap-4 mb-4">
              <img
                alt="Ingredients"
                className="w-16 h-16 rounded-lg object-cover"
                src="/stitch-assets/3499c6326248208fefa4cc8c8548a28331618114ae78e9679287fc044abf74cb.png"
              />
              <div>
                <p className="font-bold">Mediterranean Grain Bowl</p>
                <p className="text-xs text-on-surface-variant">Couscous, Chickpeas, Olives</p>
              </div>
            </div>
            <button className="w-full py-4 bg-secondary-container text-on-secondary-container font-black rounded-full hover:scale-[1.02] transition-all">
              Build Pantry Lunch
            </button>
          </div>
        </section>
      </main>

      {error && (
        <ErrorToast
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* FAB for quick scan */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl material-symbols-outlined-filled">camera</span>
      </button>

      <MobileNav />
    </>
  );
}
