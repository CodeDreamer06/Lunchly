"use client";

import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import ErrorToast from "../components/ErrorToast";
import ImageUploader from "../components/ImageUploader";
import ShareModal from "../components/ShareModal";
import { useToast } from "../components/ToastProvider";
import { getUserData, saveAnalysisResult, type ChildProfile, type StructuredAnalysis, type FoodItem } from "../lib/storage";
import { streamLLM } from "../lib/llm-client";

// Circular Score Component
function CircularScore({ score, label, color, size = 80 }: { score: number; label: string; color: string; size?: number }) {
  const circumference = 2 * Math.PI * ((size - 8) / 2);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 8) / 2}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-surface-container-high"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size - 8) / 2}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">{label}</span>
    </div>
  );
}

// Category Icon
function CategoryIcon({ category }: { category: string }) {
  const icons: Record<string, string> = {
    protein: "egg_alt",
    carbs: "rice_bowl",
    vegetable: "eco",
    fruit: "nutrition",
    dairy: "local_drink",
    snack: "cookies",
    other: "restaurant",
  };
  return <span className="material-symbols-outlined text-sm">{icons[category] || "restaurant"}</span>;
}

// Energy Curve
function EnergyCurve({ data, childName }: { data: { time: string; energyLevel: number; label: string }[]; childName: string }) {
  const width = 400;
  const height = 120;
  const padding = 20;
  const xScale = (width - padding * 2) / (data.length - 1);
  const yScale = (height - padding * 2) / 100;

  const points = data.map((d, i) => ({
    x: padding + i * xScale,
    y: height - padding - d.energyLevel * yScale,
    ...d,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height + 30}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00751f" />
            <stop offset="50%" stopColor="#706500" />
            <stop offset="100%" stopColor="#00751f" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00751f" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00751f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`} fill="url(#areaGradient)" />
        <path d={pathD} fill="none" stroke="url(#energyGradient)" strokeWidth="4" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="#00751f" strokeWidth="3" />
            <text x={p.x} y={height - 5} textAnchor="middle" className="text-[10px] font-bold fill-on-surface-variant uppercase">{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Interactive Image
function InteractiveLunchboxImage({
  imageData,
  foods,
  activeFood,
  onFoodClick,
}: {
  imageData: string;
  foods: FoodItem[];
  activeFood: string | null;
  onFoodClick: (name: string) => void;
}) {
  return (
    <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-surface-container-lowest aspect-square">
      <img src={`data:image/jpeg;base64,${imageData}`} alt="Analyzed lunchbox" className="w-full h-full object-cover" />
      
      {foods.map((food) => (
        <button
          key={food.name}
          onClick={() => onFoodClick(food.name)}
          className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer group/spot"
          style={{ left: `${food.position.x}%`, top: `${food.position.y}%` }}
        >
          <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: food.color }} />
          <div
            className="w-4 h-4 rounded-full shadow-lg border-2 border-white transition-transform"
            style={{ backgroundColor: food.color, transform: activeFood === food.name ? "scale(1.5)" : "scale(1)" }}
          />
          <div className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all ${activeFood === food.name ? "opacity-100" : "opacity-0 group-hover/spot:opacity-100"}`}>
            <div className="bg-surface px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
              <CategoryIcon category={food.category} />
              {food.name}
            </div>
          </div>
        </button>
      ))}

      <div className="absolute bottom-4 left-4">
        <span className="bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest font-bold">
          Tap items to explore
        </span>
      </div>

      {foods.length > 0 && (
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold">
          {foods.length} items
        </div>
      )}
    </div>
  );
}

export default function Analysis() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<StructuredAnalysis | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [planApproved, setPlanApproved] = useState(false);
  const [activeFood, setActiveFood] = useState<string | null>(null);
  const [correctionApplied, setCorrectionApplied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const userData = getUserData();
    if (userData?.childProfile) {
      setProfile(userData.childProfile);
    }
  }, []);

  const parseJSONResponse = (response: string): StructuredAnalysis | null => {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return null;
    }
  };

  const handleImageSelected = (base64Image: string) => {
    setSelectedImage(base64Image);
    setAnalysisData(null);
    setError(null);
    setActiveFood(null);
    setPlanApproved(false);
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

    try {
      const stream = streamLLM({
        type: "analyzeLunchboxImage",
        base64Image: selectedImage,
        childProfile: {
          name: profile.name,
          age: profile.age,
          allergies: profile.allergies || [],
        },
      });

      let fullContent = "";
      for await (const chunk of stream) {
        fullContent += chunk;
      }

      const structuredData = parseJSONResponse(fullContent);
      
      if (structuredData) {
        setAnalysisData(structuredData);
        saveAnalysisResult({
          id: Date.now().toString(),
          imageData: selectedImage,
          analysis: fullContent,
          structuredData,
          analyzedAt: new Date().toISOString(),
        });
        showToast("Analysis complete!", "success");
      } else {
        setError("Could not parse analysis. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze lunchbox");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopNav />
      
      <main className="flex-1 space-y-8 px-4 pb-24 pt-24 md:px-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">AI-Powered</span>
            </div>
            <h1 className="font-headline font-black text-4xl md:text-5xl text-on-surface tracking-tight">
              Lunchbox Analysis
            </h1>
            <p className="text-on-surface-variant font-medium mt-2">
              Smart nutrition insights for {profile?.name || "your child"}&apos;s lunch
            </p>
          </div>
        </header>

        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">photo_camera</span>
                Upload Photo
              </h2>
              <ImageUploader onImageSelected={handleImageSelected} />
              {selectedImage && (
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined ${isLoading ? "animate-spin" : ""}`}>
                    {isLoading ? "progress_activity" : "auto_awesome"}
                  </span>
                  {isLoading ? "Analyzing..." : "Analyze Lunchbox"}
                </button>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">lightbulb</span>
                Pro Tips
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "nutrition", text: "Include 3+ food groups", color: "text-primary" },
                  { icon: "palette", text: "Add colorful veggies", color: "text-secondary" },
                  { icon: "timer", text: "Easy-to-eat items", color: "text-tertiary" },
                  { icon: "favorite", text: "Add a sweet surprise", color: "text-error" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface-container p-3 rounded-2xl">
                    <span className={`material-symbols-outlined ${tip.color}`}>{tip.icon}</span>
                    <span className="text-sm font-medium">{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {analysisData && selectedImage && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 space-y-6">
              <section className="bg-surface-container-lowest rounded-3xl p-4 shadow-lg">
                <InteractiveLunchboxImage
                  imageData={selectedImage}
                  foods={analysisData.foods}
                  activeFood={activeFood}
                  onFoodClick={setActiveFood}
                />
              </section>

              <section className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-6 border border-primary/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline font-bold text-xl">Bento Intelligence Score</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-black text-primary">{analysisData.nutritionScore.overall}</span>
                    <span className="text-lg text-on-surface-variant">/100</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  <CircularScore score={analysisData.nutritionScore.protein} label="Protein" color="#00751f" />
                  <CircularScore score={analysisData.nutritionScore.fiber} label="Fiber" color="#706500" />
                  <CircularScore score={100 - analysisData.nutritionScore.sugar} label="Low Sugar" color="#0067ad" />
                  <CircularScore score={analysisData.nutritionScore.variety} label="Variety" color="#91f78e" />
                  <CircularScore score={analysisData.nutritionScore.balance} label="Balance" color="#f9e534" />
                </div>
              </section>

              <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-lg">
                <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">bolt</span>
                  Energy Curve
                </h3>
                <EnergyCurve data={analysisData.energyCurve} childName={profile?.name || "Your child"} />
                <p className="text-sm text-on-surface-variant mt-4">{analysisData.summary}</p>
              </section>
            </div>

            <div className="xl:col-span-5 space-y-6">
              <section className="bg-surface-container-low rounded-3xl p-6 shadow-lg">
                <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary">restaurant_menu</span>
                  Detected Foods ({analysisData.foods.length})
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {analysisData.foods.map((food) => (
                    <button
                      key={food.name}
                      onClick={() => setActiveFood(activeFood === food.name ? null : food.name)}
                      className={`w-full text-left p-4 rounded-2xl transition-all ${activeFood === food.name ? "bg-primary/10 ring-2 ring-primary" : "bg-surface-container-lowest"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${food.color}20` }}>
                          <span style={{ color: food.color }}><CategoryIcon category={food.category} /></span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{food.name}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded-full">{food.confidence}%</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            {food.category} • {food.portionSize} • {food.calories} cal
                          </div>
                          {activeFood === food.name && (
                            <div className="mt-3 pt-3 border-t border-surface-variant/50">
                              <div className="flex flex-wrap gap-1">
                                {food.nutrients.map(n => (
                                  <span key={n} className="text-[10px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full">{n}</span>
                                ))}
                              </div>
                              <p className="text-xs mt-2">Kid-friendly: {food.kidFriendlyScore}/100</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-surface-container-low rounded-3xl p-6">
                <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">child_care</span>
                  Kid Acceptance
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-container-lowest p-4 rounded-2xl text-center">
                    <span className="material-symbols-outlined text-primary mb-2">lock_open</span>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">Easy to Open</p>
                    <p className="font-bold capitalize">{analysisData.kidAcceptance.easeOfOpening}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-2xl text-center">
                    <span className="material-symbols-outlined text-error mb-2">cleaning_services</span>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">Mess Factor</p>
                    <p className="font-bold capitalize">{analysisData.kidAcceptance.messFactor}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-2xl text-center">
                    <span className="material-symbols-outlined text-tertiary mb-2">schedule</span>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">Eating Time</p>
                    <p className="font-bold">{analysisData.kidAcceptance.eatingTime}</p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-2xl text-center">
                    <span className="material-symbols-outlined text-primary mb-2">check_circle</span>
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">Will Finish</p>
                    <p className="font-bold">{analysisData.kidAcceptance.likelihoodOfFinishing}%</p>
                  </div>
                </div>
              </section>

              {analysisData.leftovers.length > 0 && (
                <section className="space-y-3">
                  <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-error">psychology</span>
                    Leftovers Predictor
                  </h3>
                  {analysisData.leftovers.map((leftover, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border-l-4 bg-error/5 border-error">
                      <p className="font-bold text-sm">{leftover.item}</p>
                      <p className="text-sm text-on-surface-variant mt-1">{leftover.reason}</p>
                      <button
                        onClick={() => {
                          setCorrectionApplied(prev => ({ ...prev, [idx]: true }));
                          showToast(`Applied: ${leftover.suggestion}`, "success");
                        }}
                        className={`mt-3 text-xs font-bold border-b ${correctionApplied[idx] ? "text-primary border-primary" : "text-error border-error"}`}
                      >
                        {correctionApplied[idx] ? `✓ ${leftover.suggestion}` : `Fix: ${leftover.suggestion}`}
                      </button>
                    </div>
                  ))}
                </section>
              )}

              <section className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-3xl p-6 border border-secondary/20">
                <div className="flex gap-3">
                  <div className="p-2 bg-secondary rounded-xl text-white">
                    <span className="material-symbols-outlined">lightbulb</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">Improvement Tip</p>
                    <p className="text-sm leading-relaxed">{analysisData.improvementTip}</p>
                  </div>
                </div>
              </section>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">share</span> Share
                </button>
                <button 
                  onClick={() => {
                    setPlanApproved(true);
                    showToast("Plan approved!", "success");
                  }}
                  className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 ${planApproved ? "bg-secondary text-white" : "bg-primary text-on-primary"}`}
                >
                  <span className="material-symbols-outlined">{planApproved ? "check" : "check_circle"}</span>
                  {planApproved ? "Approved" : "Approve"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {error && <ErrorToast message={error} onClose={() => setError(null)} />}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Analysis"
        text={analysisData ? `${profile?.name || "My child"}'s lunch scored ${analysisData.nutritionScore.overall}/100! Foods: ${analysisData.foods.map(f => f.name).join(", ")}` : ""}
      />

      <MobileNav />
    </>
  );
}
