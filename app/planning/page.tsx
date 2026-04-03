"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import ErrorToast from "../components/ErrorToast";
import WeeklyTrendsSection from "../components/WeeklyTrendsSection";
import { useToast } from "../components/ToastProvider";
import { getUserData, saveWeeklyPlan, getWeeklyPlans, type ChildProfile, type WeeklyPlan } from "../lib/storage";
import { streamLLM } from "../lib/llm-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Planning() {
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [budget, setBudget] = useState<number | undefined>(undefined);
  const [generatedPlan, setGeneratedPlan] = useState<WeeklyPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<WeeklyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"generated" | "saved">("generated");
  
  // Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [timerCompleted, setTimerCompleted] = useState(false);
  
  // Shopping list state
  const [shoppingItems, setShoppingItems] = useState([
    { name: "Organic Apples (1 bag)", checked: false, category: "produce" },
    { name: "English Cucumbers (2)", checked: true, category: "produce" },
    { name: "Bell Pepper Trio (1 pack)", checked: false, category: "produce" },
    { name: "Ripe Avocados (3)", checked: false, category: "produce" },
    { name: "Chicken Breast/Thighs (2.5 lbs)", checked: false, category: "protein" },
    { name: "Greek Yogurt (Large Tub)", checked: false, category: "protein" },
    { name: "Turkey Breast Slices (12oz)", checked: false, category: "protein" },
  ]);
  
  // Speed prep state
  const [speedPrepActive, setSpeedPrepActive] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData?.childProfile) {
      setProfile(userData.childProfile);
    }
    const plans = getWeeklyPlans();
    setSavedPlans(plans);
    if (plans.length > 0) {
      setGeneratedPlan(plans[0]);
    }
  }, []);

  const handleGeneratePlan = async () => {
    if (!profile) {
      setError("Please set up a child profile first");
      return;
    }

    setIsLoading(true);
    setError(null);
    const planId = Date.now().toString();
    setGeneratedPlan({
      id: planId,
      content: "",
      budget: budget,
      generatedAt: new Date().toISOString(),
    });

    try {
      const stream = streamLLM({
        type: "generateWeeklyPlan",
        childProfile: {
          name: profile.name,
          age: profile.age,
          preferences: profile.sensoryPreferences || [],
          allergies: profile.allergies || [],
          schoolPolicies: profile.schoolPolicies || [],
        },
        budgetConstraint: budget,
      });

      let fullContent = "";
      for await (const chunk of stream) {
        fullContent += chunk;
        const tempPlan: WeeklyPlan = {
          id: planId,
          content: fullContent,
          budget: budget,
          generatedAt: new Date().toISOString(),
        };
        setGeneratedPlan(tempPlan);
      }

      // Save the complete result
      const finalPlan: WeeklyPlan = {
        id: planId,
        content: fullContent,
        budget: budget,
        generatedAt: new Date().toISOString(),
      };
      setGeneratedPlan(finalPlan);
      saveWeeklyPlan(finalPlan);
      setSavedPlans(prev => [finalPlan, ...prev].slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate weekly plan");
    } finally {
      setIsLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimerCompleted(true);
            showToast("Prep timer completed! Great job!", "success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, showToast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleShoppingItem = (index: number) => {
    setShoppingItems(prev => prev.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ));
  };

  const handlePrint = () => {
    window.print();
    showToast("Shopping list sent to printer");
  };

  const handleAddToCart = () => {
    const uncheckedItems = shoppingItems.filter(item => !item.checked);
    if (uncheckedItems.length === 0) {
      showToast("All items already in your cart!");
    } else {
      showToast(`${uncheckedItems.length} items added to cart`);
    }
  };

  const handleSpeedPrep = () => {
    setSpeedPrepActive(true);
    showToast("Speed Prep activated! Simplified 3-ingredient plan generated.");
  };

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
    showToast(`${day} meal plan opened`);
  };

  const days = [
    { day: "Monday", main: "Lemon Roast Chicken Skewers", side: "Apple Slices + Sunbutter", tag: "REPURPOSABLE", tagColor: "bg-primary-container text-on-primary-container" },
    { day: "Tuesday", main: "Rainbow Quinoa Salad", side: "Greek Yogurt Parfait", tag: "VEGGIE BOOST", tagColor: "bg-tertiary-container text-on-tertiary-container" },
    { day: "Wednesday", main: "Roast Chicken & Avocado Wraps", side: "Oatmeal Raisin Bites", tag: "LINKED TO MON", tagColor: "text-primary", linked: true },
    { day: "Thursday", main: "Turkey & Cheese Bento", side: "Cucumber Spears", tag: "KID FAVORITE", tagColor: "bg-secondary-container text-on-secondary-container" },
    { day: "Friday", main: "Sunbutter & Jelly Stars", side: "Popcorn Mix", tag: "NUT-FREE SAFE", tagColor: "text-on-surface-variant" },
  ];

  return (
    <>
      <TopNav />
      
      <main className="flex-1 p-4 md:p-10 space-y-10 pt-24">
        {/* Header & Action Row */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
              Prep Once, Pack All Week
            </h1>
            <p className="text-on-surface-variant text-lg">Your weekly bento strategy for zero morning stress.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 bg-surface-container-high px-4 py-3 rounded-full">
              <span className="material-symbols-outlined text-on-surface-variant">payments</span>
              <input
                type="number"
                placeholder="Budget per lunch ($)"
                value={budget || ""}
                onChange={(e) => setBudget(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="bg-transparent text-sm font-medium outline-none w-32"
              />
            </div>
            <button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="bg-primary text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">magic_button</span>
              {isLoading ? "Generating..." : "Smart Fill"}
            </button>
          </div>
        </header>

        {/* AI Generated Plan Display */}
        {generatedPlan && (
          <section className="bg-surface-container-lowest rounded-3xl p-8 border border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <h2 className="text-xl font-headline font-bold">
                  {isLoading ? "Generating Weekly Plan..." : "AI-Generated Weekly Plan"}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("generated")}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${activeTab === "generated" ? "bg-primary text-white" : "bg-surface-container-high text-on-surface"}`}
                >
                  Latest
                </button>
                {savedPlans.length > 1 && (
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`px-4 py-2 rounded-full text-sm font-bold ${activeTab === "saved" ? "bg-primary text-white" : "bg-surface-container-high text-on-surface"}`}
                  >
                    History ({savedPlans.length})
                  </button>
                )}
              </div>
            </div>
            <div className="prose prose-sm max-w-none text-on-surface bg-surface-container-low rounded-3xl p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {activeTab === "generated"
                  ? generatedPlan?.content || "_Thinking..._"
                  : savedPlans[0]?.content || ""}
              </ReactMarkdown>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant">
              <span>Generated: {new Date(generatedPlan.generatedAt).toLocaleString()}</span>
              {generatedPlan.budget && <span>Budget: ${generatedPlan.budget}/lunch</span>}
            </div>
          </section>
        )}

        {/* 5-Day Calendar Grid */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {days.map((d, i) => (
            <div 
              key={i} 
              onClick={() => handleDayClick(d.day)}
              className={`bg-surface-container-low p-6 rounded-lg flex flex-col gap-4 relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${d.day === "Wednesday" ? "border-2 border-primary/20 ring-4 ring-primary/5" : ""}`}
            >
              <div className="flex justify-between items-center">
                <span className={`font-black uppercase tracking-widest text-xs ${d.day === "Wednesday" ? "text-primary" : "text-on-surface-variant"}`}>{d.day}</span>
                <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
              </div>
              <div className={`bg-surface-container-lowest p-4 rounded-lg shadow-sm ${d.day === "Wednesday" ? "border-l-4 border-primary" : ""}`}>
                <div className="text-xs font-bold text-on-surface-variant mb-1 uppercase">
                  {d.day === "Wednesday" ? "Repurposed Mon" : d.day === "Friday" ? "Pantry Hero" : "Batch Cooked"}
                </div>
                <div className="font-bold text-on-surface text-base">{d.main}</div>
                <div className="flex items-center gap-2 mt-2">
                  {d.linked ? (
                    <>
                      <span className="material-symbols-outlined text-primary text-xs">link</span>
                      <span className="text-[10px] font-bold text-primary">{d.tag}</span>
                    </>
                  ) : (
                    <span className={`${d.tagColor} text-[10px] px-2 py-0.5 rounded-full font-bold`}>{d.tag}</span>
                  )}
                </div>
              </div>
              <div className="bg-surface-container-lowest/50 p-3 rounded-lg flex items-center gap-3">
                <span className={`material-symbols-outlined ${i % 2 === 0 ? "text-secondary" : i % 3 === 0 ? "text-primary" : "text-tertiary"}`}>
                  {i % 2 === 0 ? "nutrition" : i % 3 === 0 ? "energy_savings_leaf" : "water_drop"}
                </span>
                <span className="text-sm font-medium">{d.side}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Bento Layout for Prep & Shopping */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Prep Night Alert */}
          <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary-dim text-white rounded-lg p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 opacity-20 transform rotate-12">
              <span className="material-symbols-outlined text-[12rem]">skillet</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary-container material-symbols-outlined-filled">notifications_active</span>
                <span className="font-black uppercase tracking-widest text-sm text-primary-container">Tonight&apos;s Prep (Sun)</span>
              </div>
              <h2 className="text-3xl font-headline font-extrabold mb-8 leading-tight">Save 45 Minutes Tomorrow Morning</h2>
              <div className="space-y-6">
                {[
                  { icon: "flatware", title: "Roast the Chicken", desc: "2 lbs breast + thighs. Shred half for Wednesday's wraps." },
                  { icon: "restaurant", title: "Batch Cook Quinoa", desc: "Cook 2 cups. Ready for Tuesday's salad and Thursday's side." },
                  { icon: "kitchen", title: "Chop 'The Rainbow'", desc: "Bell peppers, carrots, cucumbers. Store in cold water containers." },
                ].map((task, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white">{task.icon}</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{task.title}</div>
                      <div className="text-white/80 text-sm">{task.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  if (timerActive) {
                    setTimerActive(false);
                    showToast("Timer paused");
                  } else if (timerCompleted) {
                    setTimerCompleted(false);
                    setTimeRemaining(25 * 60);
                    setTimerActive(true);
                    showToast("Timer restarted!");
                  } else {
                    setTimerActive(true);
                    showToast("25-minute prep timer started!");
                  }
                }}
                className={`mt-10 w-full py-4 rounded-3xl font-bold flex items-center justify-center gap-2 transition-colors ${
                  timerActive 
                    ? "bg-error text-white hover:bg-error-dim" 
                    : timerCompleted
                    ? "bg-secondary text-white hover:bg-secondary-dim"
                    : "bg-white text-primary hover:bg-primary-container"
                }`}
              >
                <span className="material-symbols-outlined">
                  {timerActive ? "pause" : timerCompleted ? "refresh" : "timer"}
                </span>
                {timerActive 
                  ? `Pause (${formatTime(timeRemaining)})` 
                  : timerCompleted 
                  ? "Restart Timer (25m)" 
                  : "Start Timer (25m)"}
              </button>
            </div>
          </div>

          {/* Shopping List & Repurposable Components */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Repurposable Insight */}
            <div className="bg-tertiary-container/30 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline font-bold text-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">recycling</span>
                  Repurposable Components
                </h3>
                <span className="text-tertiary text-xs font-black uppercase">EFFICIENCY SCORE: 92%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-tertiary/10">
                  <div className="font-bold text-tertiary mb-1 text-sm">Roast Chicken</div>
                  <p className="text-xs text-on-surface-variant">Used in Monday&apos;s Skewers &amp; Wednesday&apos;s Avocado Wraps.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-tertiary/10">
                  <div className="font-bold text-tertiary mb-1 text-sm">Quinoa Base</div>
                  <p className="text-xs text-on-surface-variant">Used in Tuesday&apos;s Rainbow Salad &amp; Friday&apos;s Grain Bowl option.</p>
                </div>
              </div>
            </div>

            {/* Auto-Generated Shopping List */}
            <div className="bg-surface-container-low rounded-lg p-8 flex-1">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline font-bold text-2xl">Shopping List</h3>
                <button 
                  onClick={handlePrint}
                  className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">print</span> Print
                </button>
              </div>
              <div className="space-y-8">
                <div>
                  <div className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-4">Produce</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {shoppingItems.filter(item => item.category === "produce").map((item, i) => (
                      <div 
                        key={item.name} 
                        onClick={() => toggleShoppingItem(shoppingItems.findIndex(si => si.name === item.name))}
                        className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-high/50 p-1 rounded transition-colors"
                      >
                        <div className={`w-5 h-5 rounded border-2 ${item.checked ? "border-primary bg-primary" : "border-outline-variant"} flex items-center justify-center transition-colors`}>
                          {item.checked && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                        </div>
                        <span className={`text-sm ${item.checked ? "line-through text-on-surface-variant" : ""}`}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-4">Proteins &amp; Dairy</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {shoppingItems.filter(item => item.category === "protein").map((item, i) => (
                      <div 
                        key={item.name} 
                        onClick={() => toggleShoppingItem(shoppingItems.findIndex(si => si.name === item.name))}
                        className="flex items-center gap-3 cursor-pointer hover:bg-surface-container-high/50 p-1 rounded transition-colors"
                      >
                        <div className={`w-5 h-5 rounded border-2 ${item.checked ? "border-primary bg-primary" : "border-outline-variant"} flex items-center justify-center transition-colors`}>
                          {item.checked && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                        </div>
                        <span className={`text-sm ${item.checked ? "line-through text-on-surface-variant" : ""}`}>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-white text-secondary font-bold py-3 rounded-full border border-secondary/20 hover:bg-secondary-container transition-colors"
                >
                  Add Items to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <WeeklyTrendsSection />

        {/* Suggestion Footer Card */}
        <div className="bg-secondary-container rounded-lg p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden shadow-xl rotate-3">
            <img
              alt="Healthy bento box"
              className="w-full h-full object-cover"
              src="/stitch-assets/92018b6242eb1c00d33baa2511b9562be6559f0818d3101537231c1f54f25f85.png"
            />
          </div>
          <div>
            <h3 className="text-2xl font-headline font-extrabold text-on-secondary-container mb-2">Feeling Overwhelmed?</h3>
            <p className="text-on-secondary-container/80 mb-6">
              Try our &quot;Speed Prep&quot; mode. We&apos;ll strip down the menu to only 3 core ingredients that can be mixed and matched across the whole week.
            </p>
            <button 
              onClick={handleSpeedPrep}
              className={`px-8 py-3 rounded-full font-bold transition-opacity ${
                speedPrepActive 
                  ? "bg-secondary text-white hover:opacity-90" 
                  : "bg-on-secondary-container text-white hover:opacity-90"
              }`}
            >
              {speedPrepActive ? "Speed Prep Active ✓" : "Activate Speed Prep"}
            </button>
          </div>
        </div>
      </main>

      {error && (
        <ErrorToast
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <MobileNav />
    </>
  );
}
