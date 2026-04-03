import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";

export default function Trends() {
  return (
    <>
      <TopNav />
      
      <main className="pt-24 px-4 md:px-8 pb-20 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Parent Emotional UX Banner */}
          <div className="bg-primary-container/30 rounded-xl p-6 flex items-center gap-6 relative overflow-hidden">
            <div className="flex-1">
              <h3 className="font-headline font-bold text-xl text-on-primary-container">This is a solid lunch week!</h3>
              <p className="text-on-primary-container/80">Leo is trying new textures with confidence. Tomorrow can add more color.</p>
            </div>
            <div className="hidden md:block absolute right-[-20px] top-[-20px] opacity-20">
              <span className="material-symbols-outlined text-[120px] material-symbols-outlined-filled">eco</span>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Weekly Summary: Rainbow Meter */}
            <div className="md:col-span-8 bg-surface-container-low rounded-lg p-8 relative">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold">Diversity Metric</span>
                  <h2 className="text-4xl font-headline font-extrabold text-on-surface mt-1">Week 4 Variety Score</h2>
                </div>
                <div className="bg-surface-container-lowest px-4 py-2 rounded-full font-headline font-bold text-primary text-2xl">
                  84%
                </div>
              </div>
              <div className="relative h-12 w-full bg-surface-container-high rounded-full overflow-hidden mb-4">
                <div className="rainbow-meter h-full w-[84%] rounded-full relative">
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm material-symbols-outlined-filled">star</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs font-label text-on-surface-variant px-2">
                <span>Starting Out</span>
                <span>Balanced Palette</span>
                <span>Master Taster</span>
              </div>
            </div>

            {/* Color Quest Badge Progress */}
            <div className="md:col-span-4 bg-tertiary-container/20 rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-tertiary rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                <span className="material-symbols-outlined text-on-tertiary text-5xl material-symbols-outlined-filled">palette</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-xl text-on-tertiary-container">Color Quest</h4>
                <p className="text-sm text-on-tertiary-container/70 mb-4">4/5 colors eaten this week</p>
                <div className="flex gap-2 justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="w-3 h-3 rounded-full bg-surface-container-high border-2 border-dashed border-tertiary-dim"></div>
                </div>
              </div>
            </div>

            {/* Trend Charts Section */}
            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Veg Exposure Count */}
              <div className="bg-surface-container-lowest rounded-lg p-8 border border-surface-variant/20">
                <div className="flex items-center gap-3 mb-8">
                  <span className="material-symbols-outlined text-primary">eco</span>
                  <h3 className="font-headline font-bold text-lg">Veg Exposure Count</h3>
                </div>
                <div className="flex items-end justify-between h-48 gap-4 px-4">
                  {[{ h: "40%", l: false }, { h: "60%", l: false }, { h: "90%", l: true }, { h: "50%", l: false }, { h: "75%", l: false }].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                      <div className={`w-full ${bar.l ? "bg-primary" : "bg-primary-fixed-dim"} rounded-t-xl h-full`} style={{ height: bar.h }}></div>
                      <span className="text-[10px] font-label font-bold text-on-surface-variant">{["MON", "TUE", "WED", "THU", "FRI"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protein Consistency */}
              <div className="bg-surface-container-lowest rounded-lg p-8 border border-surface-variant/20">
                <div className="flex items-center gap-3 mb-8">
                  <span className="material-symbols-outlined text-secondary">fitness_center</span>
                  <h3 className="font-headline font-bold text-lg">Protein Consistency</h3>
                </div>
                <div className="flex items-end justify-between h-48 gap-4 px-4">
                  {[{ h: "70%", l: false }, { h: "65%", l: false }, { h: "80%", l: false }, { h: "95%", l: true }, { h: "75%", l: false }].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                      <div className={`w-full ${bar.l ? "bg-secondary" : "bg-secondary-container"} rounded-t-xl h-full`} style={{ height: bar.h }}></div>
                      <span className="text-[10px] font-label font-bold text-on-surface-variant">{["MON", "TUE", "WED", "THU", "FRI"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Food Exposure Tracker */}
            <div className="md:col-span-7 bg-surface-container-low rounded-lg p-8 overflow-hidden relative">
              <div className="mb-6">
                <h3 className="font-headline font-bold text-xl">The Picky Eater Lab</h3>
                <p className="text-on-surface-variant text-sm">Identifying winning combinations for Leo</p>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl flex items-center gap-6 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <img alt="Bell Pepper" className="object-cover w-12 h-12" src="/stitch-assets/db39dae4c9cd974ee97002825f87d5ba0e21a32ecae71b5fb32826895a8e13ba.png" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-label font-semibold text-primary mb-1">Winning Pair Alert!</p>
                    <p className="text-lg font-headline font-bold">Bell peppers were accepted 2/5 times when paired with hummus.</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl flex items-center gap-6 shadow-sm opacity-60">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
                    <img alt="Broccoli" className="object-cover w-12 h-12" src="/stitch-assets/7e59709ac93f33caa117b2a0d325e4b9a2a84937a2b3bba48f90be7f96b99fb7.png" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-label font-semibold text-on-surface-variant mb-1">Experiment in Progress</p>
                    <p className="text-lg font-headline font-bold">Broccoli + Parmesan trial: 1/5 acceptance</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-[-20px] right-[-10px] opacity-10">
                <span className="material-symbols-outlined text-[150px]">biotech</span>
              </div>
            </div>

            {/* Quest & Badges Section */}
            <div className="md:col-span-5 bg-secondary-container/10 rounded-lg p-8">
              <h3 className="font-headline font-bold text-xl mb-6">Upcoming Milestones</h3>
              <div className="space-y-6">
                {[
                  { icon: "water_drop", color: "blue", label: "Hydration Hero", pct: "80%", bg: "bg-blue-500", lightBg: "bg-blue-100", iconColor: "text-blue-600" },
                  { icon: "local_fire_department", color: "orange", label: "Lunch Streak", pct: "3/5 days", bg: "bg-orange-500", lightBg: "bg-orange-100", iconColor: "text-orange-600", subtitle: "60%" },
                  { icon: "auto_awesome", color: "purple", label: "Protein Prodigy", pct: "Locked", bg: "bg-purple-200", lightBg: "bg-purple-100", iconColor: "text-purple-600", locked: true, subtitle: "30%" },
                ].map((milestone, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-12 h-12 rounded-full ${milestone.lightBg} flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined ${milestone.iconColor}`}>{milestone.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-headline font-bold text-sm">{milestone.label}</span>
                        <span className="text-xs font-bold text-on-surface-variant">{milestone.locked ? milestone.subtitle : milestone.pct}</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-high rounded-full">
                        <div className={`h-full ${milestone.bg} rounded-full`} style={{ width: milestone.locked ? "30%" : milestone.label.includes("Hydration") ? "80%" : "60%" }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </>
  );
}
