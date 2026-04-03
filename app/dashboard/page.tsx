"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import ErrorToast from "../components/ErrorToast";
import ShareModal from "../components/ShareModal";
import { useToast } from "../components/ToastProvider";
import { getUserData, getAvailableIngredients, saveLunchSuggestion, getAnalysisResults, type ChildProfile, type AnalysisResult } from "../lib/storage";
import { streamLLM } from "../lib/llm-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Dashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeCard, setShowUpgradeCard] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sensoryProfile, setSensoryProfile] = useState({
    soft: 3,
    crunch: 1,
  });
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const userData = getUserData();
    if (userData?.childProfile) {
      setProfile(userData.childProfile);
    }
    const storedIngredients = getAvailableIngredients();
    if (storedIngredients.items.length > 0) {
      setIngredients(storedIngredients.items);
    }
    const analyses = getAnalysisResults();
    if (analyses.length > 0) {
      setLatestAnalysis(analyses[0]);
    }
  }, []);

  const handleGenerateSuggestions = async () => {
    if (!profile) {
      setError("Please set up a child profile first");
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
        availableIngredients: ingredients.length > 0 ? ingredients : undefined,
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
        ingredients: ingredients.length > 0 ? ingredients : undefined,
        generatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopNav />
      
      <main className="pt-24 px-4 pb-24 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dim p-8 md:p-12 text-on-primary">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              {latestAnalysis ? "Analysis Ready" : "Morning Rush Mode"}
            </span>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-6 leading-tight">
              Ready to fuel {profile?.name || "your child"}&apos;s day?
            </h1>
            <button
              onClick={handleGenerateSuggestions}
              disabled={isLoading}
              className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-3xl font-headline font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined material-symbols-outlined-filled">qr_code_scanner</span>
              {isLoading ? "Generating..." : "Get Lunch Suggestions"}
            </button>
          </div>
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 opacity-90 hidden sm:block">
            <img
              alt="Lunchbox Analysis"
              className="w-full h-full object-contain"
              src="/stitch-assets/83f77f0f9479aa2b5dc79423030eecb657bd2f623fe728339b625d096682b078.png"
            />
          </div>
        </section>

        {/* Latest Analysis Result */}
        {latestAnalysis && (
          <section className="mb-12 bg-surface-container-lowest rounded-3xl p-8 border border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Latest Analysis
              </h2>
              <button
                onClick={() => setLatestAnalysis(null)}
                className="material-symbols-outlined text-on-surface-variant hover:text-error"
              >
                close
              </button>
            </div>
            <div className="prose prose-sm max-w-none text-on-surface">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {latestAnalysis.analysis}
              </ReactMarkdown>
            </div>
            <p className="text-xs text-on-surface-variant mt-4">
              Analyzed {new Date(latestAnalysis.analyzedAt).toLocaleString()}
            </p>
          </section>
        )}

        {/* AI Suggestions Display */}
        {suggestions !== null && (
          <section className="mb-12 bg-surface-container-lowest rounded-3xl p-8 border border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                {isLoading ? "Generating Lunch Ideas..." : "AI-Generated Lunch Ideas"}
              </h2>
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
          </section>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Analysis Widget (Rainbow Meter) - Shows real data or placeholder */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-lg p-8 shadow-[0_32px_32px_rgba(0,0,0,0.03)] border-b-4 border-primary">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-2xl font-headline font-bold mb-1">Latest Scan Results</h2>
                <p className="text-on-surface-variant">
                  {latestAnalysis 
                    ? `Analyzed on ${new Date(latestAnalysis.analyzedAt).toLocaleDateString()}`
                    : "No scan yet — upload a lunchbox photo to analyze"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  disabled={!latestAnalysis}
                  className="bg-surface-container-high text-on-surface px-3 py-2 rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                  Share
                </button>
                {latestAnalysis && (
                  <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-bold text-sm">
                    {Math.round((Date.now() - new Date(latestAnalysis.analyzedAt).getTime()) / 60000)}m ago
                  </div>
                )}
              </div>
            </div>
            
            {latestAnalysis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Rainbow Meter Column */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold">Analysis Complete</span>
                      <span className="text-sm font-bold text-primary">View Details</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    {latestAnalysis.analysis.substring(0, 150)}...
                  </p>
                </div>
                {/* Scores & Logistics */}
                <div className="flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container p-4 rounded-lg text-center">
                      <span className="material-symbols-outlined text-primary text-3xl block mb-2">analytics</span>
                      <p className="text-xs uppercase font-bold text-on-surface-variant">Scan Status</p>
                      <p className="text-2xl font-headline font-black">Done</p>
                    </div>
                    <div className="bg-surface-container p-4 rounded-lg text-center">
                      <span className="material-symbols-outlined text-secondary text-3xl block mb-2">schedule</span>
                      <p className="text-xs uppercase font-bold text-on-surface-variant">When</p>
                      <p className="text-2xl font-headline font-black">
                        {new Date(latestAnalysis.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">camera_alt</span>
                <p className="text-on-surface-variant mb-4">No lunchbox scans yet</p>
                <button
                  onClick={() => router.push('/analysis')}
                  className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold hover:bg-primary-dim transition-colors"
                >
                  Scan Your First Lunchbox
                </button>
              </div>
            )}
          </div>

          {/* One-Minute Upgrade Banner - Dynamic tip based on profile */}
          {showUpgradeCard && (
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="bg-secondary-container rounded-lg p-6 flex flex-col justify-between relative overflow-hidden h-full min-h-[280px]">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-secondary mb-4">
                    <span className="material-symbols-outlined font-bold">bolt</span>
                    <span className="font-headline font-bold uppercase tracking-widest text-xs">One-Minute Upgrade</span>
                  </div>
                  <h3 className="text-2xl font-headline font-extrabold text-on-secondary-container mb-2">Tiny Tweak</h3>
                  <p className="text-on-secondary-container font-medium opacity-80 mb-6">
                    {profile?.sensoryPreferences?.length 
                      ? `Consider adding something ${profile.sensoryPreferences[0].toLowerCase()} to match ${profile.name}'s preferences.`
                      : `"Add one crunchy veggie like a baby carrot for better fiber density."`}
                  </p>
                  <button 
                    onClick={() => {
                      setShowUpgradeCard(false);
                      showToast("Upgrade tip dismissed");
                    }}
                    className="bg-on-secondary-container text-white px-6 py-2 rounded-full text-sm font-bold w-fit hover:opacity-90 transition-opacity"
                  >
                    Got it!
                  </button>
                </div>
                <span className="absolute -bottom-4 -right-4 material-symbols-outlined text-[120px] text-on-secondary-container/10 rotate-12">
                  nutrition
                </span>
              </div>
            </div>
          )}

          {/* Sensory Overview Widget */}
          <div className="lg:col-span-5 bg-surface-container-low rounded-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                <span className="material-symbols-outlined">texture</span>
              </div>
              <h3 className="text-xl font-headline font-bold">Sensory Profile</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Soft &amp; Smooth</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <button
                      key={`soft-${dot}`}
                      onClick={() => {
                        setSensoryProfile(prev => ({ ...prev, soft: dot }));
                        showToast(`Soft & Smooth preference: ${dot}/5`);
                      }}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        dot <= sensoryProfile.soft ? "bg-tertiary" : "bg-surface-variant"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Crunch Factor</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <button
                      key={`crunch-${dot}`}
                      onClick={() => {
                        setSensoryProfile(prev => ({ ...prev, crunch: dot }));
                        showToast(`Crunch preference: ${dot}/5`);
                      }}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        dot <= sensoryProfile.crunch ? "bg-secondary" : "bg-surface-variant"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 p-4 bg-surface-container rounded-lg italic text-sm text-on-surface-variant">
                &quot;{profile?.name || "Your child"} prefers {sensoryProfile.crunch > sensoryProfile.soft ? "crunchier" : "softer"} textures; today&apos;s lunch needs more {sensoryProfile.crunch > sensoryProfile.soft ? "crunch" : "soft options"}.&quot;
              </div>
            </div>
          </div>

          {/* Energy Curve Prediction */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-lg p-8 shadow-[0_32px_32px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-headline font-bold">Energy Curve Prediction</h3>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                {latestAnalysis ? "Based on latest scan" : "Simulated prediction"}
              </div>
            </div>
            <div className="relative h-48 w-full mt-12">
              {/* Simple SVG Energy Curve */}
              <svg className="w-full h-full drop-shadow-lg overflow-visible" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="curveGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="1"></stop>
                    <stop offset="70%" stopColor="var(--primary)" stopOpacity="1"></stop>
                    <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.6"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M 0,80 Q 50,20 150,30 T 300,40 T 400,90"
                  fill="none"
                  stroke="url(#curveGradient)"
                  strokeLinecap="round"
                  strokeWidth="6"
                ></path>
                {/* Highlight Point */}
                <circle className="fill-primary" cx="280" cy="38" r="8"></circle>
              </svg>
              <div className="absolute top-0 left-[70%] -translate-x-1/2 -translate-y-full bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                Peak Focus: {profile?.name ? `${profile.name}'s Peak` : "Afternoon"} (1:30 PM)
              </div>
              {/* Time Markers */}
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant mt-4 uppercase tracking-widest">
                <span>8 AM</span>
                <span>12 PM</span>
                <span>3 PM</span>
                <span>6 PM</span>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-surface-container pt-6">
              <p className="text-sm font-bold text-primary">
                {latestAnalysis ? "Energy curve based on your lunch" : "Scan a lunchbox for personalized curve"}
              </p>
              <span className="text-xs text-on-surface-variant font-medium">Based on Glycemic Load Index</span>
            </div>
          </div>
        </div>
      </main>

      {error && (
        <ErrorToast
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Scan Results"
        text={latestAnalysis 
          ? `Latest lunch scan for ${profile?.name || "your child"} from ${new Date(latestAnalysis.analyzedAt).toLocaleDateString()}: ${latestAnalysis.analysis.substring(0, 200)}...`
          : `Lunch suggestions for ${profile?.name || "your child"}. Generate AI-powered lunch ideas with Lunchly!`}
      />

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-24 right-4 z-40">
        <button
          onClick={handleGenerateSuggestions}
          disabled={isLoading}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      <MobileNav />
    </>
  );
}
