"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import ErrorToast from "../components/ErrorToast";
import ShareModal from "../components/ShareModal";
import { useToast } from "../components/ToastProvider";
import { getUserData, saveFoodSwap, getFoodSwaps, type ChildProfile, type FoodSwap } from "../lib/storage";
import { streamLLM } from "../lib/llm-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Swaps() {
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [rejectedFood, setRejectedFood] = useState("");
  const [swapResult, setSwapResult] = useState<string | null>(null);
  const [swapHistory, setSwapHistory] = useState<FoodSwap[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedSwaps, setAppliedSwaps] = useState<Set<number>>(new Set());
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [addedRemixes, setAddedRemixes] = useState<Set<number>>(new Set());

  useEffect(() => {
    const userData = getUserData();
    if (userData?.childProfile) {
      setProfile(userData.childProfile);
    }
    const history = getFoodSwaps();
    setSwapHistory(history);
  }, []);

  const handleGetSwaps = async () => {
    if (!rejectedFood.trim()) {
      setError("Please enter a food that was rejected");
      return;
    }

    if (!profile) {
      setError("Please set up a child profile first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSwapResult("");

    try {
      const stream = streamLLM({
        type: "suggestFoodSwaps",
        rejectedFood,
        childProfile: {
          preferences: profile.sensoryPreferences || [],
          allergies: profile.allergies || [],
        },
      });

      let fullContent = "";
      for await (const chunk of stream) {
        fullContent += chunk;
        setSwapResult(fullContent);
      }

      // Save the complete result
      const newSwap: FoodSwap = {
        id: Date.now().toString(),
        rejectedFood: rejectedFood,
        suggestions: fullContent,
        generatedAt: new Date().toISOString(),
      };
      saveFoodSwap(newSwap);
      setSwapHistory(prev => [newSwap, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get food swap suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const swaps = [
    {
      before: { name: "Potato Chips", img: "/stitch-assets/f2b41e39e32622df780b19791caf5f3d6f85f7055f21d059621732a94904f6a2.png" },
      after: { name: "Air-Popped Popcorn", img: "/stitch-assets/263f996339044eb8a815ea0c5fd56d9f331f6685569517fb64159b27cb916bf4.png" },
      tags: [
        { icon: "psychology", text: "Focus Fuel", color: "bg-tertiary/10 text-tertiary" },
        { icon: "payments", text: "Same Budget", color: "bg-secondary/10 text-secondary" },
      ],
    },
    {
      before: { name: "Sugary Yogurt", img: "/stitch-assets/6eea22bee667bb7412f50d803500fd16c8c81fc18b2ccfbc0ac88f4a82016ffb.png" },
      after: { name: "Greek Yogurt + Berries", img: "/stitch-assets/8654e8f9e9d19ec1a5fa6f4c5820ebcc6c67fa018be851de2e6fefa3c58474eb.png" },
      tags: [
        { icon: "bolt", text: "Steady Energy", color: "bg-primary/10 text-primary" },
        { icon: "health_and_safety", text: "Gut Health", color: "bg-secondary/10 text-secondary" },
      ],
    },
    {
      before: { name: "White Bread Deli", img: "/stitch-assets/13ce22ef05d627c756d914a3a0963eae70d502f44268e073770fa738057e2cb7.png" },
      after: { name: "Whole Grain Wrap", img: "/stitch-assets/d2389f6e54e33b6ee14c6733f2d9a5238203048a66c31217926d8df5fdde85c9.png" },
      tags: [
        { icon: "shield", text: "Allergy Safe", color: "bg-error/10 text-error" },
        { icon: "fitness_center", text: "Protein Punch", color: "bg-tertiary/10 text-tertiary" },
      ],
    },
  ];

  const remixes = [
    { name: "Leftover Roast Chicken", transform: "Pesto Wrap", time: "2 Mins", img: "/stitch-assets/4604915810f1b7b87aa02c69216c47a68c27aacf7b8735a78129b6725dad5d76.png" },
    { name: "Steamed White Rice", transform: "Fried Rice Balls", time: "5 Mins", img: "/stitch-assets/ea08fe07f988e60d9d6e66aaabe081ae2bcd169f179f6b52fd6407c7e3b58e97.png" },
  ];

  return (
    <>
      <TopNav />
      
      <main className="pt-24 px-4 md:px-8 pb-20 min-h-screen lg:pl-72 lg:pr-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-4">
            Tiny Tweaks
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Small changes, massive impact. The Swap Engine uses data to find healthier alternatives that kids actually love.
          </p>
        </header>

        {/* AI Swap Generator */}
        <section className="mb-16 bg-surface-container-lowest rounded-3xl p-8 border border-primary/20">
          <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_fix_high</span>
            AI Swap Generator
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-2">
                What did your child reject today?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rejectedFood}
                  onChange={(e) => setRejectedFood(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleGetSwaps()}
                  placeholder="e.g., broccoli, apple slices, yogurt"
                  className="flex-1 px-4 py-3 bg-surface-container-low rounded-3xl border border-transparent focus:border-primary outline-none"
                />
                <button
                  onClick={handleGetSwaps}
                  disabled={isLoading}
                  className="bg-primary text-white px-6 py-3 rounded-3xl font-bold hover:bg-primary-dim transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
            <div>
              {swapResult !== null ? (
                <div className="bg-surface-container-low rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-primary uppercase tracking-wider">
                      {isLoading ? "Generating Suggestions" : "AI Suggestions"}
                    </span>
                    <button
                      onClick={() => setSwapResult(null)}
                      className="material-symbols-outlined text-on-surface-variant hover:text-error"
                    >
                      close
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-on-surface">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {swapResult || "_Thinking..._"}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-low rounded-3xl p-6 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2">swap_horiz</span>
                  <p>Enter a rejected food to get AI-powered swap suggestions</p>
                </div>
              )}
            </div>
          </div>

          {/* Swap History */}
          {swapHistory.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4">Recent Swaps</h3>
              <div className="flex flex-wrap gap-2">
                {swapHistory.map((swap) => (
                  <button
                    key={swap.id}
                    onClick={() => {
                      setRejectedFood(swap.rejectedFood);
                      setSwapResult(swap.suggestions);
                    }}
                    className="px-4 py-2 bg-surface-container-high rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    {swap.rejectedFood}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Swap Gallery Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_fix_high</span>
              Smart Swaps Gallery
            </h2>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-surface-container-highest rounded-full text-xs font-semibold uppercase tracking-wider">All Filters</span>
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">Budget Friendly</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {swaps.map((swap, i) => (
              <div key={i} className="bg-surface-container-low rounded-3xl p-6 flex flex-col gap-6 relative overflow-visible group">
                <div className="flex justify-between items-center gap-4 relative">
                  <div className="flex-1 text-center">
                    <div className="w-full aspect-square rounded-2xl bg-surface-container-highest mb-3 overflow-hidden border-2 border-white/50">
                      <img className="w-full h-full object-cover grayscale opacity-60" src={swap.before.img} alt={swap.before.name} />
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant uppercase">Before</span>
                    <p className="font-bold text-sm">{swap.before.name}</p>
                  </div>
                  <div className="flex items-center justify-center bg-white shadow-lg w-10 h-10 rounded-full z-10 -mx-4">
                    <span className="material-symbols-outlined text-primary font-bold">arrow_forward</span>
                  </div>
                  <div className="flex-1 text-center relative">
                    <div className="w-full aspect-square rounded-2xl bg-primary-container mb-3 overflow-hidden border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                      <img className="w-full h-full object-cover" src={swap.after.img} alt={swap.after.name} />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase">After</span>
                    <p className="font-bold text-sm">{swap.after.name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {swap.tags.map((tag, j) => (
                    <span key={j} className={`px-3 py-1 ${tag.color} text-xs font-bold rounded-full flex items-center gap-1`}>
                      <span className="material-symbols-outlined text-[14px]">{tag.icon}</span>
                      {tag.text}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    if (appliedSwaps.has(i)) {
                      showToast("Swap already applied!");
                      return;
                    }
                    setAppliedSwaps(prev => new Set([...prev, i]));
                    showToast(`Swapped ${swap.before.name} for ${swap.after.name}!`, "success");
                  }}
                  className={`w-full py-4 font-bold rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                    appliedSwaps.has(i) 
                      ? "bg-secondary-container text-on-secondary-container" 
                      : "bg-primary text-on-primary hover:bg-primary-dim shadow-primary/20"
                  }`}
                >
                  {appliedSwaps.has(i) ? (
                    <>
                      Applied
                      <span className="material-symbols-outlined">check</span>
                    </>
                  ) : (
                    <>
                      Apply this Swap
                      <span className="material-symbols-outlined">upgrade</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Fridge Remix Widget */}
        <section className="bg-surface-container-high rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3">
              <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <span className="material-symbols-outlined text-secondary text-3xl">kitchen</span>
              </div>
              <h2 className="text-3xl font-headline font-extrabold mb-4 tracking-tight">Fridge Remix</h2>
              <p className="text-on-surface-variant mb-6">
                Stop wasting, start remixing. We scanned your pantry—here&apos;s what you can make with yesterday&apos;s leftovers.
              </p>
              <button 
                onClick={() => router.push("/fridge")}
                className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Scan Fridge Again
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {remixes.map((remix, i) => (
                <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden flex-shrink-0">
                      <img className="w-full h-full object-cover" src={remix.img} alt={remix.name} />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-black uppercase text-secondary tracking-widest bg-secondary-container px-2 py-0.5 rounded">Remix #{i + 1}</span>
                      <h4 className="font-bold mt-1">{remix.name}</h4>
                      <p className="text-sm text-on-surface-variant mb-3">Turn into a {remix.transform}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">timer</span>
                          {remix.time}
                        </span>
                        <button 
                          onClick={() => {
                            if (addedRemixes.has(i)) {
                              showToast("Already added to plan!");
                              return;
                            }
                            setAddedRemixes(prev => new Set([...prev, i]));
                            showToast(`${remix.name} added to lunch plan!`);
                          }}
                          className={`material-symbols-outlined p-1 rounded-full transition-colors ${
                            addedRemixes.has(i) 
                              ? "bg-secondary text-white" 
                              : "bg-surface-container-high group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          {addedRemixes.has(i) ? "check" : "add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* One-Minute Upgrade CTA Section */}
        <section className="mt-16 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-3xl p-8 lg:p-16 flex flex-col items-center text-center">
          <h2 className="text-3xl lg:text-4xl font-headline font-black mb-4">Ready for an Upgrade?</h2>
          <p className="max-w-xl text-primary-fixed opacity-90 mb-8 text-lg">
            Our &quot;One-Minute Upgrade&quot; automatically scans your current week&apos;s plan and finds 5 healthier alternatives for a 20% nutrition boost.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={() => {
                setIsUpgradeModalOpen(true);
                showToast("Scanning your weekly plan for upgrades...");
              }}
              className="px-8 py-4 bg-secondary-container text-on-secondary-container font-bold rounded-full flex items-center justify-center gap-3 hover:scale-105 transition-transform"
            >
              <span className="material-symbols-outlined material-symbols-outlined-filled">bolt</span>
              Run One-Minute Upgrade
            </button>
            <button 
              onClick={() => setIsImpactModalOpen(true)}
              className="px-8 py-4 border-2 border-primary-fixed text-primary-fixed font-bold rounded-full flex items-center justify-center gap-3 hover:bg-white/10 transition-colors"
            >
              View Impact Report
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

      <ShareModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        title="Nutrition Impact Report"
        text={`One-Minute Upgrade Impact Report:
- Swapped Potato Chips → Air-Popped Popcorn (Focus Fuel, Same Budget)
- Swapped Sugary Yogurt → Greek Yogurt + Berries (Steady Energy)
- Swapped White Bread → Whole Grain Wrap (Protein Punch)

Estimated nutrition boost: 20% more fiber, 15% less sugar, same cost!`}
      />

      <MobileNav />
    </>
  );
}
