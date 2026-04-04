"use client";

import { useState, useEffect, useRef } from "react";
import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import ErrorToast from "../components/ErrorToast";
import ImageUploader from "../components/ImageUploader";
import ShareModal from "../components/ShareModal";
import { useToast } from "../components/ToastProvider";
import { getUserData, saveAnalysisResult, type ChildProfile, type StructuredAnalysis, type FoodItem } from "../lib/storage";
import { streamLLM } from "../lib/llm-client";

function getScoreDescriptor(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 45) return "Fair";
  return "Needs work";
}

// Leftover Risk Badge
function RiskBadge({ likelihood }: { likelihood: string }) {
  const configs = {
    High: { color: "#be2d06", bg: "bg-error/15", text: "text-error", icon: "warning" },
    Medium: { color: "#706500", bg: "bg-secondary/15", text: "text-secondary", icon: "error_outline" },
    Low: { color: "#00751f", bg: "bg-primary/15", text: "text-primary", icon: "check_circle" },
  };
  const config = configs[likelihood as keyof typeof configs] || configs.Medium;
  
  return (
    <div className={`${config.bg} ${config.text} text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5`}>
      <span className="material-symbols-outlined text-[14px]">{config.icon}</span>
      {likelihood} Risk
    </div>
  );
}

// Enhanced Leftover Item Card
function LeftoverCard({ 
  leftover, 
  idx,
  isFixed,
  onFix 
}: { 
  leftover: { item: string; likelihood: string; reason: string; suggestion: string };
  idx: number;
  isFixed: boolean;
  onFix: (idx: number) => void;
}) {
  const getRiskColor = () => {
    switch (leftover.likelihood) {
      case "High": return "#be2d06";
      case "Medium": return "#706500";
      case "Low": return "#00751f";
      default: return "#706500";
    }
  };
  
  const riskColor = getRiskColor();
  
  return (
    <div className="group relative overflow-hidden rounded-[1.25rem] bg-surface-container-lowest border border-surface-container-high shadow-[0_2px_12px_-4px_rgba(14,15,10,0.08)] transition-all duration-300 hover:shadow-[0_8px_24px_-8px_rgba(14,15,10,0.15)] hover:-translate-y-0.5">
      {/* Left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5" 
        style={{ backgroundColor: riskColor, opacity: isFixed ? 0.3 : 0.8 }}
      />
      
      <div className="p-5 pl-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: `${riskColor}15` }}
            >
              <span className="material-symbols-outlined text-xl" style={{ color: riskColor }}>
                {leftover.likelihood === "High" ? "priority_high" : leftover.likelihood === "Medium" ? "error_outline" : "check_circle"}
              </span>
            </div>
            <div>
              <p className="font-headline font-black text-lg text-on-surface leading-tight">{leftover.item}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Detected item</p>
            </div>
          </div>
          <RiskBadge likelihood={leftover.likelihood} />
        </div>
        
        {/* Reason */}
        <p className="text-sm text-on-surface-variant mb-4 leading-relaxed pl-[52px]">{leftover.reason}</p>
        
        {/* Fix Button */}
        <button
          onClick={() => onFix(idx)}
          disabled={isFixed}
          className={`w-full py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 ${
            isFixed 
              ? "bg-primary/10 text-primary cursor-default" 
              : "bg-gradient-to-r from-error to-error-dim text-white hover:shadow-[0_4px_16px_-4px_rgba(190,45,6,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          }`}
          style={isFixed ? {} : { background: `linear-gradient(135deg, ${riskColor}, ${riskColor}dd)` }}
        >
          <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${isFixed ? "" : "group-hover:rotate-12"}`}>
            {isFixed ? "check_circle" : "auto_fix_high"}
          </span>
          {isFixed ? "Improvement Applied" : leftover.suggestion}
        </button>
      </div>
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
  return <span className="material-symbols-outlined text-[1em]">{icons[category] || "restaurant"}</span>;
}

// Score Card Component - Redesigned with better visuals
function ScoreCard({ 
  score, 
  label, 
  color, 
  icon,
  description 
}: { 
  score: number; 
  label: string; 
  color: string; 
  icon: string;
  description: string;
}) {
  const descriptor = getScoreDescriptor(score);
  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Determine color scheme based on score color
  const getGradient = () => {
    if (color.includes("91f78e")) return "from-primary-fixed/30 to-primary-fixed/10"; // Green
    if (color.includes("f9e534")) return "from-secondary-fixed/30 to-secondary-fixed/10"; // Yellow
    if (color.includes("0067ad")) return "from-tertiary/20 to-tertiary/10"; // Blue
    if (color.includes("706500")) return "from-secondary-dim/20 to-secondary-dim/10"; // Olive
    return "from-primary/20 to-primary/10";
  };

  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-surface-container-high bg-surface-container-lowest p-4 shadow-[0_4px_20px_-8px_rgba(14,15,10,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(14,15,10,0.25)]">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      
      <div className="relative flex items-center gap-4">
        {/* Circular Progress */}
        <div className="relative shrink-0">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 84 84">
            {/* Track */}
            <circle
              cx="42"
              cy="42"
              r="38"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-surface-container-high"
            />
            {/* Progress */}
            <circle
              cx="42"
              cy="42"
              r="38"
              stroke={color}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black tracking-tight" style={{ color }}>{score}</span>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-base" style={{ color }}>{icon}</span>
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-on-surface-variant">{label}</span>
          </div>
          <p className="text-lg font-headline font-black text-on-surface leading-tight">{descriptor}</p>
          <p className="mt-1 text-xs leading-relaxed text-on-surface-variant/80 line-clamp-2">{description}</p>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-500 group-hover:w-full" 
        style={{ width: `${score}%`, backgroundColor: color, opacity: 0.6 }}
      />
    </div>
  );
}

// Interactive Box Image Layer
function InteractiveLunchboxImage({
  imageData,
  foods,
  activeFood,
  onFoodClick,
  isScanning = false,
}: {
  imageData: string;
  foods: FoodItem[];
  activeFood: string | null;
  onFoodClick: (name: string) => void;
  isScanning?: boolean;
}) {
  return (
    <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-surface-container-lowest aspect-square border-4 border-surface-container-lowest transition-all hover:shadow-primary/20 hover:border-primary/10">
      <img src={`data:image/jpeg;base64,${imageData}`} alt="Analyzed lunchbox" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
      
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="h-[2px] w-full bg-primary shadow-[0_0_20px_5px_rgba(0,117,31,0.5)] absolute top-0 animate-[scan_2s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay animate-[pulse_2s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold flex items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-primary-fixed">auto_awesome</span>
            <span className="tracking-widest uppercase text-sm">AI Scanning...</span>
          </div>
        </div>
      )}

      {!isScanning && foods.map((food) => {
        const isActive = activeFood === food.name;
        return (
          <button
            key={food.name}
            onClick={() => onFoodClick(food.name)}
            className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer group/spot z-20"
            style={{ left: `${food.position.x}%`, top: `${food.position.y}%` }}
          >
            <div className={`absolute inset-0 rounded-full opacity-40 transition-all duration-500 delay-75 ${isActive ? "animate-ping scale-150" : "group-hover/spot:animate-ping"}`} style={{ backgroundColor: food.color }} />
            <div
              className={`w-5 h-5 rounded-full shadow-2xl border-[3px] border-white transition-all duration-300 ${isActive ? "scale-150 ring-4 ring-white/50" : "scale-100 ring-0 hover:scale-125"}`}
              style={{ backgroundColor: food.color }}
            />
            <div className={`absolute -top-12 pr-1 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${isActive ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-0 group-hover/spot:opacity-100 group-hover/spot:-translate-y-2 pointer-events-none"}`}>
              <div className="bg-inverse-surface/90 backdrop-blur-md text-inverse-on-surface px-4 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2">
                <span style={{ color: food.color }} className="flex items-center"><CategoryIcon category={food.category} /></span>
                {food.name}
              </div>
            </div>
          </button>
        );
      })}

      {!isScanning && foods.length > 0 && (
        <>
          <div className="absolute bottom-6 left-6 z-20">
            <span className="glass-card text-on-surface text-[10px] px-4 py-2 rounded-full uppercase tracking-widest font-black flex items-center gap-2 shadow-lg">
              <span className="material-symbols-outlined text-[14px] animate-bounce text-primary">touch_app</span>
              Tap items to explore
            </span>
          </div>

          <div className="absolute top-6 right-6 z-20 glass-card px-4 py-2 rounded-full text-xs font-black text-on-surface shadow-lg flex items-center gap-2 border border-white/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {foods.length} items detected
          </div>
        </>
      )}
    </div>
  );
}

// JSON Code Viewer Component
function JSONViewer({ data }: { data: any }) {
  const codeString = JSON.stringify(data, null, 2);
  return (
    <div className="relative group max-h-[500px] overflow-hidden rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#161b22] border-b border-[#30363d] flex items-center px-4 gap-2 z-10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <span className="ml-2 text-xs font-mono text-[#8b949e]">llm-response.json</span>
        <div className="ml-auto flex items-center gap-2 bg-[#21262d] py-1 px-3 rounded-md text-[#c9d1d9] text-[10px] font-bold uppercase tracking-widest border border-[#30363d]">
          <span className="material-symbols-outlined text-[12px] text-primary-fixed">auto_awesome</span> Raw Response
        </div>
      </div>
      <div className="p-4 pt-14 overflow-y-auto max-h-[500px] text-[12px] md:text-sm font-mono leading-relaxed text-[#c9d1d9] no-scrollbar">
        <pre className="m-0">
          <code dangerouslySetInnerHTML={{
            __html: codeString
              .replace(/"(.*?)":/g, '<span class="text-[#7ee787]">"$1"</span>:')
              .replace(/: (true|false)/g, ': <span class="text-[#79c0ff]">$1</span>')
              .replace(/: (-?\d+\.?\d*)/g, ': <span class="text-[#79c0ff]">$1</span>')
              .replace(/: "(.*?)"/g, ': <span class="text-[#a5d6ff]">"$1"</span>')
          }} />
        </pre>
      </div>
    </div>
  );
}

export default function Analysis() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawAnalysisContent, setRawAnalysisContent] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<StructuredAnalysis | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [planApproved, setPlanApproved] = useState(false);
  const [activeFood, setActiveFood] = useState<string | null>(null);
  const [correctionApplied, setCorrectionApplied] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"visual" | "json">("visual");

  const resultsRef = useRef<HTMLDivElement>(null);

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
    setRawAnalysisContent("");
    setError(null);
    setActiveFood(null);
    setPlanApproved(false);
    setViewMode("visual");
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
    setAnalysisData(null);
    setRawAnalysisContent("");

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
        setRawAnalysisContent(fullContent); // Stream in the raw content!
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
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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
      <style suppressHydrationWarning>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}</style>
      <TopNav />
      
      <main className="flex-1 space-y-12 px-4 pb-24 pt-24 md:px-8 max-w-7xl mx-auto">
        <header className="flex flex-col items-center text-center max-w-3xl mx-auto gap-4">
          <div className="inline-flex items-center gap-2 mb-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <span className="material-symbols-outlined text-primary text-xl animate-pulse">auto_awesome</span>
            <span className="text-xs font-black uppercase tracking-widest text-primary">AI-Powered Magic</span>
          </div>
          <h1 className="font-headline font-black text-5xl md:text-6xl text-on-surface tracking-tight leading-tight">
            Analyze the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Lunchbox</span>
          </h1>
          <p className="text-on-surface-variant font-medium text-lg leading-relaxed max-w-2xl">
            Upload a photo of {profile?.name || "your child"}&apos;s meal and let our LLM vision model extract ingredients, build a nutritional profile, and map the visual landscape.
          </p>
        </header>

        <section className={`transition-all duration-1000 ${analysisData ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-2xl border border-surface-container-highest max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-headline font-black mb-2 text-on-surface">Snap a pic</h2>
                  <p className="text-on-surface-variant">Upload the packed lunch. Make sure it's well-lit so our AI can see every crumb!</p>
                </div>
                
                {selectedImage && isLoading ? (
                  <div className="aspect-square w-full rounded-2xl overflow-hidden relative border-4 border-surface-container shadow-inner">
                    <InteractiveLunchboxImage
                      imageData={selectedImage}
                      foods={[]}
                      activeFood={null}
                      onFoodClick={() => {}}
                      isScanning={true}
                    />
                  </div>
                ) : (
                  <div className="bg-surface-container/50 rounded-3xl p-2 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors">
                    <ImageUploader onImageSelected={handleImageSelected} />
                  </div>
                )}
                
                {selectedImage && !isLoading && !analysisData && (
                  <button
                    onClick={handleAnalyze}
                    className="w-full bg-gradient-to-r from-primary to-primary-dim text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_-10px_rgba(0,117,31,0.6)] hover:shadow-[0_10px_40px_-5px_rgba(0,117,31,0.8)] hover:-translate-y-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    Start AI Analysis
                  </button>
                )}
              </div>

              <div className="space-y-6 bg-surface-container p-8 rounded-3xl h-full border border-surface-container-highest">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">memory</span>
                  </div>
                  <h2 className="text-xl font-headline font-black">Under the hood</h2>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                  When you upload an image, we send it directly to an LLM endpoint. The model generates this beautiful UI entirely from <span className="font-mono text-primary font-bold">structured JSON</span>, extracting properties like coordinates for hotspots!
                </p>
                <div className="space-y-4">
                  {[
                    { icon: "crop_free", text: "Maps X/Y visual coordinates", color: "text-tertiary" },
                    { icon: "palette", text: "Extracts hex colors for elements", color: "text-error" },
                    { icon: "nutrition", text: "Nutritional breakdown & scores", color: "text-primary" },
                    { icon: "mood_bad", text: "Predicts picky eating rejection", color: "text-secondary" },
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-variant/30 hover:border-surface-variant transition-colors group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface-container \${tip.color} group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-sm">{tip.icon}</span>
                      </div>
                      <span className="text-sm font-bold text-on-surface">{tip.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {(analysisData || isLoading) && selectedImage && (
          <div ref={resultsRef} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-surface-variant pb-6">
              <h2 className="text-3xl font-headline font-black flex items-center gap-3">
                Analysis Results
                {isLoading && (
                  <span className="bg-primary-container text-on-primary-container text-xs px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full border-t border-on-primary-container animate-spin"/> Generating
                  </span>
                )}
              </h2>
              {analysisData && (
                <div className="bg-surface-container-high rounded-full p-1 flex">
                  <button
                    onClick={() => setViewMode("visual")}
                    className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${viewMode === "visual" ? "bg-surface-container-lowest text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span> Visual UI
                  </button>
                  <button
                    onClick={() => setViewMode("json")}
                    className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${viewMode === "json" ? "bg-inverse-surface text-inverse-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">data_object</span> Raw JSON
                  </button>
                </div>
              )}
            </div>

            {viewMode === "json" ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 bg-tertiary/10 border border-tertiary/20 rounded-2xl p-6 flex gap-4 items-start">
                  <span className="material-symbols-outlined text-tertiary text-3xl">lightbulb</span>
                  <div>
                    <h3 className="font-black text-tertiary mb-1">Look at this JSON magic!</h3>
                    <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
                      This entire UI is dynamically driven by the JSON output of the LLM. Notice the <code className="bg-surface font-mono text-primary px-1 rounded">position: {`{x,y}`}</code> nodes! We use those to place the interactive dots directly on the image you uploaded. We love combining beautiful UX with structured LLM data.
                    </p>
                  </div>
                </div>
                {isLoading ? (
                  <JSONViewer data={rawAnalysisContent ? parseJSONResponse(rawAnalysisContent) || { streaming: true, raw: rawAnalysisContent } : { status: "Starting stream..." }} />
                ) : (
                  <JSONViewer data={analysisData} />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="xl:col-span-7 space-y-8">
                  <section className="bg-surface-container-lowest rounded-[2rem] p-2 shadow-2xl relative">
                    <InteractiveLunchboxImage
                      imageData={selectedImage}
                      foods={analysisData?.foods || []}
                      activeFood={activeFood}
                      onFoodClick={setActiveFood}
                      isScanning={isLoading}
                    />
                  </section>

                  {analysisData && (
                    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-xl border border-surface-container-highest relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                      
                      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-stretch mb-8 relative z-10">
                        <div className="rounded-[2rem] border border-surface-container-high bg-linear-to-br from-surface-container-lowest via-surface-container-lowest to-surface-container-low p-6 shadow-[0_24px_50px_-34px_rgba(14,15,10,0.45)]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-xl">workspace_premium</span>
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Nutrition</span>
                          </div>
                          <h3 className="font-headline font-black text-3xl">Bento Score</h3>
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
                            A quick health read on the lunch composition, weighted across protein, fiber, sugar control, variety, and overall balance.
                          </p>
                        </div>
                        <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-[radial-gradient(circle_at_top_left,rgba(145,247,142,0.65),rgba(255,255,255,0)_45%),linear-gradient(135deg,#fffef9_0%,#f5f4eb_100%)] p-6 shadow-[0_28px_60px_-34px_rgba(0,117,31,0.45)]">
                          <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-2xl" />
                          <p className="relative z-10 text-[11px] font-black uppercase tracking-[0.26em] text-on-surface-variant">Overall</p>
                          <div className="relative z-10 mt-4 flex items-end gap-2">
                            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-dim tracking-tighter">{analysisData.nutritionScore.overall}</span>
                            <span className="pb-2 text-2xl font-bold text-on-surface-variant">/100</span>
                          </div>
                          <div className="relative z-10 mt-5 flex items-center justify-between gap-4 rounded-2xl bg-white/70 px-4 py-3 backdrop-blur-sm">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Verdict</p>
                              <p className="mt-1 text-lg font-headline font-black text-on-surface">
                                {getScoreDescriptor(analysisData.nutritionScore.overall)}
                              </p>
                            </div>
                            <div className="h-14 w-px bg-surface-container-high" />
                            <p className="max-w-[10rem] text-sm leading-relaxed text-on-surface-variant">
                              {analysisData.improvementTip || "Solid structure with room for a few smarter swaps."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 relative z-10">
                        <ScoreCard 
                          score={analysisData.nutritionScore.protein} 
                          label="Protein" 
                          color="var(--primary)" 
                          icon="egg_alt"
                          description="Amino acids fuel growth and sustained energy throughout the school day."
                        />
                        <ScoreCard 
                          score={analysisData.nutritionScore.fiber} 
                          label="Fiber" 
                          color="var(--secondary)" 
                          icon="eco"
                          description="Promotes healthy digestion and helps maintain steady blood sugar levels."
                        />
                        <ScoreCard 
                          score={100 - analysisData.nutritionScore.sugar} 
                          label="Low Sugar" 
                          color="var(--tertiary)" 
                          icon="water_drop"
                          description="Lower sugar swings keep the lunch steadier through the afternoon."
                        />
                        <ScoreCard 
                          score={analysisData.nutritionScore.variety} 
                          label="Variety" 
                          color="var(--primary-fixed-dim)" 
                          icon="palette"
                          description="Diverse nutrients from colorful foods support overall development."
                        />
                        <ScoreCard 
                          score={analysisData.nutritionScore.balance} 
                          label="Balance" 
                          color="var(--secondary-fixed)" 
                          icon="scale"
                          description="Well-proportioned macronutrients for optimal energy and satisfaction."
                        />
                      </div>
                    </section>
                  )}
                </div>

                <div className="xl:col-span-5 space-y-8">
                  {analysisData && (
                    <>
                      <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl border border-surface-container-highest">
                        <h3 className="font-headline font-black text-xl mb-4 flex items-center gap-3">
                          <div className="p-2 bg-tertiary/10 rounded-xl text-tertiary">
                            <span className="material-symbols-outlined">restaurant_menu</span>
                          </div>
                          Detected Ingredients
                          <span className="ml-auto bg-surface px-3 py-1 rounded-full text-xs font-bold text-on-surface-variant border border-outline-variant">{analysisData.foods.length}</span>
                        </h3>
                        
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                          {analysisData.foods.map((food) => {
                            const isActive = activeFood === food.name;
                            return (
                              <button
                                key={food.name}
                                onClick={() => setActiveFood(isActive ? null : food.name)}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border ${isActive ? "bg-primary/5 border-primary/30 shadow-md translate-x-2" : "bg-surface-container-low border-surface-container hover:bg-surface-container-high hover:border-surface-variant"}`}
                              >
                                <div className="flex items-start gap-4">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform ${isActive ? "scale-110" : ""}`} style={{ backgroundColor: `${food.color}25` }}>
                                    <span style={{ color: food.color, filter: 'brightness(0.8)' }} className="text-2xl drop-shadow-sm"><CategoryIcon category={food.category} /></span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-black text-lg">{food.name}</span>
                                      <span className="text-[10px] font-bold bg-surface-container px-2 py-1 rounded-md text-on-surface border border-outline-variant/30 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px] text-primary">verified</span>
                                        {food.confidence}%
                                      </span>
                                    </div>
                                    <div className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
                                      <span className="capitalize">{food.category}</span>
                                      <div className="w-1 h-1 rounded-full bg-outline-variant" />
                                      <span>{food.portionSize}</span>
                                      <div className="w-1 h-1 rounded-full bg-outline-variant" />
                                      <span className="text-primary-dim font-bold">{food.calories} cal</span>
                                    </div>
                                    
                                    {/* Expandable Info */}
                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? "max-h-40 opacity-100 mt-4 pt-4 border-t border-surface-variant/50" : "max-h-0 opacity-0 mt-0 pt-0 border-transparent"}`}>
                                      <div className="flex flex-wrap gap-2 mb-3">
                                        {food.nutrients.map(n => (
                                          <span key={n} className="text-[10px] font-bold bg-surface-container-highest text-on-surface px-2.5 py-1 rounded-md border border-surface-variant shadow-sm">{n}</span>
                                        ))}
                                      </div>
                                      <div className="flex items-center justify-between bg-surface-container-lowest p-3 rounded-xl border border-surface-variant/30">
                                        <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Kid-friendly</span>
                                        <div className="flex items-center gap-2">
                                          <div className="w-24 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                            <div className="h-full bg-tertiary" style={{ width: `${food.kidFriendlyScore}%` }} />
                                          </div>
                                          <span className="font-black text-xs">{food.kidFriendlyScore}/100</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      {analysisData.leftovers.length > 0 && (
                        <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl border border-surface-container-highest">
                          <div className="flex items-center justify-between mb-5">
                            <h3 className="font-headline font-black text-xl flex items-center gap-3">
                              <div className="p-2.5 bg-gradient-to-br from-error/20 to-error/5 rounded-xl text-error shadow-sm">
                                <span className="material-symbols-outlined">psychology</span>
                              </div>
                              Leftovers Predictor
                            </h3>
                            <span className="text-[11px] font-black uppercase tracking-wider text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
                              {analysisData.leftovers.length} items
                            </span>
                          </div>
                          <div className="space-y-4">
                            {analysisData.leftovers.map((leftover, idx) => (
                              <LeftoverCard 
                                key={idx}
                                leftover={leftover}
                                idx={idx}
                                isFixed={correctionApplied[idx] || false}
                                onFix={(idx) => {
                                  setCorrectionApplied(prev => ({ ...prev, [idx]: true }));
                                  if (!correctionApplied[idx]) {
                                    showToast(`Applied: ${leftover.suggestion}`, "success");
                                  }
                                }}
                              />
                            ))}
                          </div>
                        </section>
                      )}

                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={() => setIsShareModalOpen(true)}
                          className="flex-1 bg-surface-container py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors text-on-surface border border-outline-variant/30 hover:border-outline-variant"
                        >
                          <span className="material-symbols-outlined">ios_share</span> Share Report
                        </button>
                        <button 
                          onClick={() => {
                            setPlanApproved(true);
                            showToast("You're all set! A perfect lunch.", "success");
                          }}
                          className={`flex-1 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all duration-500 shadow-xl overflow-hidden relative group ${planApproved ? "bg-primary text-white" : "bg-inverse-surface text-inverse-on-surface hover:-translate-y-1"}`}
                        >
                          {planApproved && (
                            <div className="absolute inset-0 z-0">
                              <div className="absolute inset-0 bg-[url('https://cdn.pixabay.com/photo/2018/11/03/06/37/confetti-3791444_1280.png')] opacity-20 bg-cover animate-[scan_2s_linear_infinite]" />
                            </div>
                          )}
                          <div className="relative z-10 flex items-center gap-2">
                            <span className={`material-symbols-outlined transition-transform duration-500 ${planApproved ? "scale-125" : "group-hover:rotate-12"}`}>{planApproved ? "celebration" : "thumb_up"}</span>
                            {planApproved ? "Approved!" : "Approve Plan"}
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
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
