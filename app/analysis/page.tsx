"use client";

import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorToast from "../components/ErrorToast";
import ImageUploader from "../components/ImageUploader";
import { analyzeLunchboxImage, type LLMError } from "../lib/openai";
import { getUserData, saveAnalysisResult, type ChildProfile } from "../lib/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Analysis() {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<{ imageData: string; analysis: string; date: string }[]>([]);

  useEffect(() => {
    const userData = getUserData();
    if (userData?.childProfile) {
      setProfile(userData.childProfile);
    }
  }, []);

  const handleImageSelected = (base64Image: string) => {
    setSelectedImage(base64Image);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError("Please upload a lunchbox photo first");
      return;
    }

    if (!profile) {
      setError("Please set up a child profile first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult("");

    try {
      const stream = analyzeLunchboxImage(selectedImage, {
        name: profile.name,
        age: profile.age,
        allergies: profile.allergies || [],
      });

      let fullContent = "";
      for await (const chunk of stream) {
        fullContent += chunk;
        setAnalysisResult(fullContent);
      }

      // Save the complete result
      saveAnalysisResult({
        id: Date.now().toString(),
        imageData: selectedImage,
        analysis: fullContent,
        analyzedAt: new Date().toISOString(),
      });
      setAnalysisHistory(prev => [{ imageData: selectedImage, analysis: fullContent, date: new Date().toLocaleString() }, ...prev].slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze lunchbox");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopNav />
      
      <main className="flex-1 p-4 md:p-8 space-y-8 pt-24 pb-24">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline font-black text-4xl text-on-surface tracking-tight">AI Lunchbox Analysis</h1>
            <p className="text-on-surface-variant font-medium">Upload a photo of {profile?.name || "your child"}&apos;s lunchbox for AI analysis</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-full font-bold text-sm hover:bg-surface-variant transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">share</span> Share Report
            </button>
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-dim transition-transform active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span> Approve Plan
            </button>
          </div>
        </header>

        {/* Image Upload Section */}
        <section className="bg-surface-container-lowest rounded-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-headline font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">camera_alt</span>
                Upload Lunchbox Photo
              </h2>
              <ImageUploader
                onImageSelected={handleImageSelected}
                className="mb-4"
              />
              {selectedImage && (
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dim transition-transform active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  {isLoading ? "Analyzing..." : "Analyze Lunchbox"}
                </button>
              )}
            </div>

            {/* Analysis Results */}
            <div>
              <h2 className="text-xl font-headline font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">analytics</span>
                Analysis Results
              </h2>
              {analysisResult ? (
                <div className="bg-surface-container-low rounded-xl p-6 border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">AI Analysis Complete</span>
                    <button
                      onClick={() => setAnalysisResult(null)}
                      className="material-symbols-outlined text-on-surface-variant hover:text-error"
                    >
                      close
                    </button>
                  </div>
                  <div className="prose prose-sm max-w-none text-on-surface">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {analysisResult}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-low rounded-xl p-6 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2">restaurant</span>
                  <p>Upload a photo and click Analyze to see AI insights</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Previous Analyses */}
        {analysisHistory.length > 0 && (
          <section className="bg-surface-container-low rounded-xl p-8">
            <h2 className="text-xl font-headline font-bold mb-6">Recent Analyses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisHistory.map((item, index) => (
                <div key={index} className="bg-surface-container-lowest rounded-lg p-4">
                  <img
                    src={`data:image/jpeg;base64,${item.imageData}`}
                    alt={`Analysis ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <p className="text-xs text-on-surface-variant">{item.date}</p>
                  <p className="text-sm line-clamp-3">{item.analysis.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left: Interactive Bento View */}
          <div className="xl:col-span-7 space-y-6">
            <div className="relative group rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
              <img
                alt="Top-down view of a colorful bento box"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="/stitch-assets/70905aa3af7fa5e5d3ebb5f425f8109a08a79e91595beaab931f3855e38dd2f4.png"
              />
              {/* Interactive Hotspots */}
              <div className="absolute top-1/4 left-1/4 bento-hotspot w-12 h-12 rounded-full flex items-center justify-center cursor-pointer group/spot">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/spot:opacity-100 transition-all bg-surface p-2 rounded-lg text-xs font-bold shadow-lg whitespace-nowrap">
                  Salmon Sushi Rolls
                </div>
              </div>
              <div className="absolute bottom-1/3 right-1/4 bento-hotspot w-12 h-12 rounded-full flex items-center justify-center cursor-pointer group/spot">
                <div className="w-3 h-3 bg-tertiary rounded-full animate-pulse"></div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/spot:opacity-100 transition-all bg-surface p-2 rounded-lg text-xs font-bold shadow-lg whitespace-nowrap">
                  Mixed Berries &amp; Mint
                </div>
              </div>
              <div className="absolute top-1/2 right-1/3 bento-hotspot w-12 h-12 rounded-full flex items-center justify-center cursor-pointer group/spot">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/spot:opacity-100 transition-all bg-surface p-2 rounded-lg text-xs font-bold shadow-lg whitespace-nowrap">
                  Roasted Broccolini
                </div>
              </div>
              {/* Overlay Legend */}
              <div className="absolute bottom-6 left-6 flex gap-2">
                <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                  Tap items to analyze
                </span>
              </div>
            </div>

            {/* Energy Curve Deep Dive */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-surface-variant/30">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline font-bold text-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">bolt</span>
                  Energy Curve Deep Dive
                </h3>
                <span className="text-primary font-bold text-sm bg-primary/10 px-4 py-1 rounded-full">+4h Steady Focus</span>
              </div>
              <div className="h-40 w-full relative mb-6">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="curveGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#00751f" stopOpacity="1"></stop>
                      <stop offset="50%" stopColor="#706500" stopOpacity="1"></stop>
                      <stop offset="100%" stopColor="#00751f" stopOpacity="1"></stop>
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 Q50,20 100,40 T200,30 T300,50 T400,60"
                    fill="none"
                    stroke="url(#curveGradient)"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></path>
                  <circle cx="200" cy="30" fill="#706500" r="4"></circle>
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-bold text-on-surface-variant pt-4">
                  <span>LUNCH (12:00)</span>
                  <span>RECESS</span>
                  <span>3RD PERIOD</span>
                  <span>PICKUP (15:30)</span>
                </div>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                The complex carbohydrates in the brown rice and fiber from the broccolini slow down glucose absorption, preventing the standard &quot;1:45 PM Slump&quot;. Mia will maintain <strong>92% higher focus levels</strong> compared to a white-bread sandwich.
              </p>
            </div>
          </div>

          {/* Right: Analysis Sidebar */}
          <div className="xl:col-span-5 space-y-6">
            {/* Scoring Bento Card */}
            <div className="glass-panel p-6 rounded-lg space-y-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-surface-variant pb-4">
                <h2 className="font-headline font-extrabold text-2xl">Bento Intelligence</h2>
                <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center font-black text-primary">88</div>
              </div>
              {/* Balance Score */}
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Balance Breakdown</p>
                <div className="space-y-3">
                  {[
                    { label: "Fiber Content", value: "High", width: "85%", color: "bg-primary" },
                    { label: "Sugar Load", value: "Optimal", width: "30%", color: "bg-secondary-container" },
                    { label: "Ultra-Processed Level", value: "Very Low", width: "12%", color: "bg-primary-container" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1 font-medium">
                        <span>{item.label}</span>
                        <span className={item.color.replace("bg-", "text-")}>{item.value}</span>
                      </div>
                      <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Kid Acceptance */}
              <div className="pt-4 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Kid Acceptance Profile</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest p-4 rounded-xl text-center">
                    <span className="material-symbols-outlined text-tertiary mb-2">lock_open</span>
                    <p className="text-[10px] font-bold text-on-surface-variant block">EASE OF OPEN</p>
                    <p className="font-headline font-extrabold">Easy</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl text-center">
                    <span className="material-symbols-outlined text-error mb-2">cleaning_services</span>
                    <p className="text-[10px] font-bold text-on-surface-variant block">MESS FACTOR</p>
                    <p className="font-headline font-extrabold">Medium</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sensory Profile */}
            <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
              <h3 className="font-headline font-bold text-lg mb-6">Sensory Texture Map</h3>
              <div className="flex justify-center py-4">
                <div className="relative w-48 h-48 border border-surface-variant rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="w-full h-px bg-on-surface"></div>
                    <div className="h-full w-px bg-on-surface absolute"></div>
                  </div>
                  <svg className="w-full h-full -rotate-45" viewBox="0 0 100 100">
                    <polygon
                      fill="rgba(0, 103, 173, 0.2)"
                      points="50,20 80,50 50,85 15,50"
                      stroke="#0067ad"
                      strokeWidth="1.5"
                    ></polygon>
                  </svg>
                  <span className="absolute top-0 -translate-y-6 text-[10px] font-bold text-on-surface-variant">CRUNCHY</span>
                  <span className="absolute right-0 translate-x-8 text-[10px] font-bold text-on-surface-variant">SOFT</span>
                  <span className="absolute bottom-0 translate-y-6 text-[10px] font-bold text-on-surface-variant">WET</span>
                  <span className="absolute left-0 -translate-x-8 text-[10px] font-bold text-on-surface-variant">MIXED</span>
                </div>
              </div>
              <div className="mt-8 bg-tertiary/5 p-4 rounded-xl border-l-4 border-tertiary">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-tertiary">info</span>
                  <div>
                    <p className="text-xs font-bold text-tertiary uppercase">Social Comfort Insight</p>
                    <p className="text-sm text-on-surface mt-1 leading-snug">
                      Great nutrients, but the sushi rolls may be hard to eat quickly during the short 15-min lunch break.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Leftovers Predictor */}
            <div className="bg-error/5 border-l-4 border-error p-6 rounded-xl relative">
              <div className="flex gap-4">
                <div className="p-3 bg-error/10 rounded-xl text-error shrink-0 self-start">
                  <span className="material-symbols-outlined">psychology</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-error">Leftovers Predictor</h4>
                  <p className="text-sm text-on-surface mt-2">
                    The <strong>apple slices</strong> are likely to brown and be rejected without acid protection (lemon juice) within 2 hours. Suggest swapping for whole grapes or pre-treating.
                  </p>
                  <button className="mt-4 text-xs font-bold text-error border-b border-error/30 hover:border-error transition-all pb-0.5">
                    Apply Correction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LoadingOverlay isVisible={isLoading} message="Analyzing lunchbox with AI..." />
      
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
