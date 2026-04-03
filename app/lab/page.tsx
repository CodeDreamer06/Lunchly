import TopNav from "../components/TopNav";
import SideNav from "../components/SideNav";
import MobileNav from "../components/MobileNav";

export default function Lab() {
  const safeAnchors = [
    { name: "White Pasta", trust: "100%" },
    { name: "Breadsticks", trust: "95%" },
    { name: "Apple Juice", trust: "100%" },
  ];

  const experimentLog = [
    { food: "Whole Grain Toast Bits", date: "Wednesday, 2:45 PM", stages: [true, true, true, false] },
    { food: "Red Pepper Slices", date: "Monday, 6:15 PM", stages: [true, false, false, false] },
  ];

  return (
    <>
      <TopNav />
      <SideNav />
      
      <main className="lg:ml-64 pt-24 px-6 pb-20">
        {/* Hero Title Section */}
        <header className="max-w-7xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold font-label tracking-widest">
                SENSORY EXPERIMENT MODE
              </span>
              <h2 className="text-5xl font-black text-on-surface font-headline mt-2 leading-tight">Lunchbox Lab</h2>
              <p className="text-on-surface-variant mt-2 text-lg max-w-2xl">
                Turning &quot;No, thank you&quot; into &quot;I&apos;ll try a lick&quot; through intentional food bridges and sensory discovery.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-secondary-container text-on-secondary-fixed font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined">add_circle</span>
                Log New Exposure
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Taste Bridge (The Visual Map) */}
          <section className="lg:col-span-8 bg-surface-container-low rounded-xl p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-headline font-extrabold text-on-surface">The Taste Bridge</h3>
                <p className="text-on-surface-variant text-sm">Incremental paths to new food acceptances</p>
              </div>
              <button className="text-primary font-bold flex items-center gap-1 group">
                See Full Map
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="relative min-h-[400px] flex items-center justify-center">
              {/* Path Connector (SVG Decor) */}
              <svg className="absolute inset-0 w-full h-full opacity-20" fill="none" viewBox="0 0 800 400">
                <path d="M100 200 C 250 200, 350 100, 500 100 S 750 200, 800 250" stroke="#00751f" strokeDasharray="12 12" strokeWidth="4"></path>
                <path d="M100 200 C 250 200, 350 300, 500 300 S 750 200, 800 150" stroke="#706500" strokeDasharray="12 12" strokeWidth="4"></path>
              </svg>
              {/* Safe Anchor */}
              <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-xl border-4 border-primary/20 w-48 text-center transform -rotate-2">
                  <div className="w-20 h-20 bg-primary-container/30 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <img alt="Plain Crackers" className="object-cover w-full h-full" src="/stitch-assets/a227ea4fa827c018bb320508839a38f726460c45943bb3a87e9a94dc281ea350.png" />
                  </div>
                  <span className="font-black text-on-primary-container uppercase text-xs tracking-tighter">Safe Anchor</span>
                  <p className="font-bold text-on-surface">Plain Crackers</p>
                </div>
              </div>
              {/* Bridge 1 */}
              <div className="absolute left-1/2 top-1/4 -translate-x-1/2 z-20">
                <div className="bg-surface-container-lowest/80 p-5 rounded-xl shadow-lg w-44 text-center glass-panel transform rotate-3">
                  <div className="w-16 h-16 bg-secondary-container/30 rounded-full mx-auto mb-3 overflow-hidden">
                    <img alt="Whole Grain" className="object-cover w-full h-full" src="/stitch-assets/a535da97c1fdfc8bc40c91258eca7a8650263649dfde64982cb03fde075ce899.png" />
                  </div>
                  <span className="font-bold text-secondary text-xs uppercase tracking-tight">Step 1: Color</span>
                  <p className="font-bold text-on-surface">Whole Grain</p>
                  <div className="mt-2 h-1.5 w-full bg-surface-container-high rounded-full">
                    <div className="h-full bg-secondary w-3/4 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Bridge 2 */}
              <div className="absolute left-1/2 bottom-1/4 -translate-x-1/2 z-20">
                <div className="bg-surface-container-lowest/80 p-5 rounded-xl shadow-lg w-44 text-center glass-panel transform -rotate-1">
                  <div className="w-16 h-16 bg-secondary-container/30 rounded-full mx-auto mb-3 overflow-hidden">
                    <img alt="Sweet Potato" className="object-cover w-full h-full" src="/stitch-assets/287c3e836982dac95dcc15ab57748007c32d6c8271419b90b452340182d56890.png" />
                  </div>
                  <span className="font-bold text-secondary text-xs uppercase tracking-tight">Step 1: Texture</span>
                  <p className="font-bold text-on-surface">Sweet Potato</p>
                  <div className="mt-2 h-1.5 w-full bg-surface-container-high rounded-full">
                    <div className="h-full bg-secondary w-1/4 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Target Goal */}
              <div className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20">
                <div className="bg-surface-container-lowest p-6 rounded-xl shadow-2xl border-4 border-tertiary/20 w-48 text-center transform rotate-6">
                  <div className="w-20 h-20 bg-tertiary-container/30 rounded-full mx-auto mb-4 overflow-hidden">
                    <img alt="Sliced Apples" className="object-cover w-full h-full" src="/stitch-assets/16bfebeba44237a95fe683a4c9f8ce8fa0fb43772e38e7cbd7f1e3fc5ba83adb.png" />
                  </div>
                  <span className="font-black text-on-tertiary-container uppercase text-xs tracking-tighter">Ultimate Goal</span>
                  <p className="font-bold text-on-surface">Crisp Apple</p>
                  <span className="material-symbols-outlined text-tertiary mt-1">flag</span>
                </div>
              </div>
            </div>
          </section>

          {/* Safe Food Anchors */}
          <aside className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-primary rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-20">
                <span className="material-symbols-outlined text-[10rem]">anchor</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-headline font-black mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">anchor</span>
                  Safe Anchors
                </h3>
                <div className="space-y-3">
                  {safeAnchors.map((anchor, i) => (
                    <div key={i} className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
                      <span className="font-bold">{anchor.name}</span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full uppercase">{anchor.trust} Trust</span>
                    </div>
                  ))}
                </div>
                <button className="mt-6 w-full py-3 bg-secondary-container text-on-secondary-fixed rounded-xl font-black text-sm uppercase tracking-widest hover:scale-[0.98] transition-transform">
                  Update Anchor List
                </button>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-xl p-6">
              <h3 className="text-lg font-headline font-black mb-4">Quick Tip</h3>
              <div className="flex gap-4">
                <div className="bg-white p-3 rounded-full flex-shrink-0 self-start">
                  <span className="material-symbols-outlined text-secondary">lightbulb</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Try serving <strong>Sweet Potato Crackers</strong> next to <strong>Plain Crackers</strong> today. Use the &quot;Same Shape&quot; logic to reduce visual anxiety.
                </p>
              </div>
            </div>
          </aside>

          {/* Experiment Log */}
          <section className="lg:col-span-12 xl:col-span-7 bg-surface-container-lowest rounded-xl p-8 border-2 border-surface-container-high shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-headline font-black text-on-surface">Experiment Log</h3>
              <div className="flex gap-2">
                <span className="bg-primary-container text-on-primary-container text-xs font-bold px-3 py-1 rounded-full">8 Exposures this week</span>
              </div>
            </div>
            <div className="space-y-6">
              {experimentLog.map((entry, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-3xl">{i === 0 ? "restaurant" : "nutrition"}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-lg text-on-surface">{entry.food}</h4>
                    <p className="text-sm text-on-surface-variant">{entry.date}</p>
                  </div>
                  <div className="flex items-center gap-1 md:gap-3">
                    {["Touched", "Smelled", "Licked", "Tasted"].map((stage, j) => (
                      <div key={j} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full ${entry.stages[j] ? "bg-primary" : "bg-surface-container-highest"} flex items-center justify-center ${entry.stages[j] ? "text-white" : "text-on-surface-variant"}`}>
                          <span className="material-symbols-outlined text-sm">{j === 0 ? "touch_app" : j === 1 ? "air" : j === 2 ? "child_care" : "sentiment_satisfied"}</span>
                        </div>
                        <span className={`text-[10px] uppercase font-black ${entry.stages[j] ? "opacity-60" : "opacity-40"}`}>{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sensory Texture Map */}
          <section className="lg:col-span-12 xl:col-span-5 bg-surface-container-low rounded-xl p-8 overflow-hidden relative">
            <h3 className="text-2xl font-headline font-black text-on-surface mb-2">Sensory Map</h3>
            <p className="text-on-surface-variant text-sm mb-8">Balance of textures accepted vs. offered</p>
            <div className="relative w-full aspect-square max-w-[320px] mx-auto">
              {/* Radar/Spider Chart Visualization */}
              <div className="absolute inset-0 border-2 border-outline-variant rounded-full opacity-20"></div>
              <div className="absolute inset-[15%] border-2 border-outline-variant rounded-full opacity-20"></div>
              <div className="absolute inset-[30%] border-2 border-outline-variant rounded-full opacity-20"></div>
              <div className="absolute inset-[45%] border-2 border-outline-variant rounded-full opacity-20"></div>
              {/* Axes */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-outline-variant/30"></div>
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-outline-variant/30"></div>
              {/* Labels */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-black text-xs uppercase tracking-widest text-primary">Crunchy</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-black text-xs uppercase tracking-widest text-secondary">Soft</div>
              <div className="absolute top-1/2 -left-8 -translate-y-1/2 font-black text-xs uppercase tracking-widest text-tertiary origin-center -rotate-90">Wet</div>
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 font-black text-xs uppercase tracking-widest text-on-surface origin-center rotate-90">Dry</div>
              {/* Chart Polygon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-primary/20" style={{ clipPath: "polygon(50% 10%, 90% 50%, 50% 80%, 30% 40%)" }}></div>
                <div className="w-full h-full absolute inset-0 border-4 border-primary" style={{ clipPath: "polygon(50% 10%, 90% 50%, 50% 80%, 30% 40%)" }}></div>
              </div>
              {/* Floating Indicator Labels */}
              <div className="absolute top-[15%] right-[15%] bg-surface-container-lowest shadow-lg px-2 py-1 rounded-full text-[10px] font-bold">Pretzels</div>
              <div className="absolute bottom-[25%] left-[20%] bg-surface-container-lowest shadow-lg px-2 py-1 rounded-full text-[10px] font-bold">Yogurt (Fear)</div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="bg-surface-container-highest p-4 rounded-xl text-center">
                <span className="text-2xl font-black text-primary">72%</span>
                <p className="text-xs font-bold uppercase text-on-surface-variant">Crunch Preference</p>
              </div>
              <div className="bg-surface-container-highest p-4 rounded-xl text-center">
                <span className="text-2xl font-black text-error">12%</span>
                <p className="text-xs font-bold uppercase text-on-surface-variant">Wet Tolerance</p>
              </div>
            </div>
          </section>
        </div>

        {/* Recommendation Banner */}
        <section className="max-w-7xl mx-auto mt-12 bg-tertiary rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex-grow">
            <span className="bg-tertiary-container text-on-tertiary-container px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4 inline-block">
              AI Sensory Match
            </span>
            <h3 className="text-4xl font-headline font-black leading-tight">Next Experiment: Freeze-Dried Strawberries</h3>
            <p className="text-white/80 mt-4 text-lg max-w-xl">
              Since crunchy textures are highly accepted (72%), we suggest freeze-dried fruit. It provides the vitamin profile of fruit with the &quot;Safe Snap&quot; of a cracker.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-white text-tertiary font-black px-8 py-4 rounded-xl hover:bg-surface-container-lowest transition-colors">
                Add to Lab Queue
              </button>
              <button className="border-2 border-white/30 text-white font-black px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
                Why this works?
              </button>
            </div>
          </div>
          <div className="relative z-10 w-full md:w-1/3">
            <div className="aspect-square bg-surface-container-lowest rounded-full p-4 shadow-2xl relative">
              <img
                alt="Freeze Dried Strawberries"
                className="w-full h-full object-cover rounded-full"
                src="/stitch-assets/bd24447afb9fbd9a6cab200ef0a45ed86924fe92f4460870b4ae09db32070001.png"
              />
              {/* Overlay Badge */}
              <div className="absolute -top-4 -right-4 bg-secondary-container text-on-secondary-container p-4 rounded-full shadow-lg transform rotate-12">
                <span className="material-symbols-outlined text-3xl">star</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </>
  );
}
