"use client";

import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";
import ShareModal from "../components/ShareModal";
import { useToast } from "../components/ToastProvider";
import { useState } from "react";

export default function Logistics() {
  const { showToast } = useToast();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  const containers = [
    { name: "Thermos Cap", difficulty: "Easy", width: "20%", color: "bg-primary", icon: "kitchen" },
    { name: "Yogurt Foil", difficulty: "Hard", width: "90%", color: "bg-error", icon: "warning", warning: true },
    { name: "Bento Latches", difficulty: "Medium", width: "55%", color: "bg-secondary", icon: "lock" },
    { name: "Silicone Bag", difficulty: "Easy", width: "15%", color: "bg-primary", icon: "lunch_dining" },
  ];

  const tips = [
    { type: "PRO TIP", category: "Freshness", text: "Apple slices will brown without lemon juice. Spritz lightly or submerge in saltwater for 5 mins before packing." },
    { type: "DIP HACK", category: "Openability", text: "Fold a small piece of painter's tape over the edge of the foil top to create a 'pull tab' for easier opening." },
    { type: "TEMP CONTROL", category: "Logistics", text: "Pre-heat the thermos with boiling water for 5 mins to ensure pasta stays at 140°F until lunch." },
  ];

  return (
    <>
      <TopNav />
      
      <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
              Pre-Flight Review
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl">
              Reviewing lunchbox logistics for <span className="font-bold text-primary">Leo&apos;s Bento</span>. Ensuring every lid opens and every bite stays fresh.
            </p>
          </div>
          <div className="bg-primary-container text-on-primary-container px-6 py-4 rounded-3xl flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">Logistics Score</span>
              <span className="text-3xl font-black font-headline">85<span className="text-lg opacity-60">/100</span></span>
            </div>
            <div className="w-px h-12 bg-on-primary-container/20"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl material-symbols-outlined-filled">task_alt</span>
              <span className="font-bold leading-tight">Ready for<br/>Takeoff</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Compatibility Meter */}
          <section className="md:col-span-4 bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-xl font-headline font-bold mb-1">Pace of Eating</h2>
              <p className="text-sm text-on-surface-variant mb-6">Compatibility with 20min lunch window</p>
              <div className="space-y-6">
                <div className="relative h-4 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-primary rounded-full" style={{ width: "72%" }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase text-on-surface-variant">
                  <span>Slow Grazing</span>
                  <span className="text-primary">Perfect Fit</span>
                  <span>Speed Eater</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-surface-container-lowest rounded-lg border-l-4 border-secondary">
                <p className="text-sm italic">&quot;Leo averages 12 mins for mains. This layout leaves 8 mins for socializing and cleanup.&quot;</p>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          </section>

          {/* Independent Eating Guidance */}
          <section className="md:col-span-8 bg-tertiary-container/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border-2 border-tertiary-container/30">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-tertiary">child_care</span>
                <h2 className="text-xl font-headline font-bold text-on-tertiary-container">Independent Eating: Age 5</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  <span className="text-on-tertiary-container"><b>Pincer Grasp Ready:</b> Pasta wheels and apple wedges are sized perfectly for easy handling.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  <span className="text-on-tertiary-container"><b>Focus Recommendation:</b> Keep small loose items (seeds/peas) in the side compartment to avoid spills.</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-64 aspect-square bg-surface-container-lowest rounded-3xl overflow-hidden shadow-inner flex items-center justify-center p-4">
              <img
                alt="Independence visualization"
                className="w-full h-full object-contain"
                src="/stitch-assets/bc7f01cc0f6215b710b54095f59d9a1cef95d4c5854e0610e669cbc8e5f8dd4a.png"
              />
            </div>
          </section>

          {/* Openability Check */}
          <section className="md:col-span-12">
            <h2 className="text-2xl font-headline font-extrabold mb-6 px-2">Openability Check</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {containers.map((container, i) => (
                <div key={i} className={`bg-surface-container-lowest p-6 rounded-3xl shadow-sm border-b-4 ${container.warning ? "border-error/20 hover:border-error" : container.name.includes("Latch") ? "border-secondary/20 hover:border-secondary" : "border-primary/20 hover:border-primary"} transition-all`}>
                  <div className={`w-12 h-12 ${container.warning ? "bg-error/10" : container.name.includes("Latch") ? "bg-secondary/10" : "bg-primary/10"} rounded-full flex items-center justify-center mb-4`}>
                    <span className={`material-symbols-outlined ${container.warning ? "text-error" : container.name.includes("Latch") ? "text-secondary" : "text-primary"}`}>{container.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{container.name}</h3>
                  <p className={`text-xs text-on-surface-variant mb-4 uppercase font-bold tracking-widest ${container.warning ? "text-error" : ""}`}>Difficulty: {container.difficulty}</p>
                  <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full ${container.color}`} style={{ width: container.width }}></div>
                  </div>
                  <p className="mt-4 text-sm text-on-surface-variant">
                    {container.name === "Thermos Cap" && "Twist-off mechanism is well-worn and child-tested."}
                    {container.name === "Yogurt Foil" && "Tab is too small for small hands. Recommend pre-peeling or decanting."}
                    {container.name === "Bento Latches" && "Side latches require moderate thumb strength. Needs practice."}
                    {container.name === "Silicone Bag" && "Pinch-press seal is intuitive and requires minimal force."}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Mess Factor & Sogginess Predictor */}
          <section className="md:col-span-7 bg-surface-container-high rounded-3xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-headline font-extrabold">Texture Integrity</h2>
                  <p className="text-on-surface-variant">A 4-hour forecast from pack to bite</p>
                </div>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">AI PREVIEW</span>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-3xl text-secondary">
                    <span className="material-symbols-outlined">waves</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">Mess Factor: <span className="text-secondary">Moderate</span></h4>
                    <p className="text-sm text-on-surface-variant">Hummus dip may migrate if container is tilted 90°.</p>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-lg flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-3xl text-primary">
                    <span className="material-symbols-outlined">water_drop</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">Sogginess Predictor: <span className="text-primary">Low Risk</span></h4>
                    <p className="text-sm text-on-surface-variant">Crackers are safely separated from the cucumber slices.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </section>

          {/* AI Tips Sidebar */}
          <section className="md:col-span-5 bg-on-background text-white rounded-3xl p-8 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">lightbulb</span>
              <h2 className="text-xl font-headline font-bold">AI Optimization Tips</h2>
            </div>
            <div className="space-y-6">
              {tips.map((tip, i) => (
                <div key={i} className="group cursor-default">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-primary-container font-bold text-sm">{tip.type}</span>
                    <span className="text-[10px] uppercase opacity-40">{tip.category}</span>
                  </div>
                  <p className="text-sm leading-relaxed opacity-90 border-l-2 border-primary-container pl-4 group-hover:border-l-4 transition-all">{tip.text}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="mt-auto bg-primary py-4 rounded-3xl font-bold hover:bg-primary-dim transition-colors flex items-center justify-center gap-2"
            >
              Confirm & Export Report
              <span className="material-symbols-outlined">send</span>
            </button>
          </section>
        </div>
      </main>

      <ShareModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Logistics Report"
        text={`Lunchbox Logistics Report - Pre-Flight Review

Logistics Score: 85/100 - Ready for Takeoff

Openability Check:
- Thermos Cap: Easy (Twist-off mechanism)
- Bento Latches: Medium (Needs thumb strength practice)
- Silicone Bag: Easy (Pinch-press seal)

Texture Integrity (4-hour forecast):
- Mess Factor: Moderate
- Sogginess Predictor: Low Risk

Packing confirmed! Report ready for caregiver handoff.`}
      />

      <MobileNav />
    </>
  );
}
