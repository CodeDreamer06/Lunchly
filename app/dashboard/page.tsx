import TopNav from "../components/TopNav";
import SideNav from "../components/SideNav";
import MobileNav from "../components/MobileNav";

export default function Dashboard() {
  return (
    <>
      <TopNav />
      <SideNav />
      
      <main className="lg:ml-64 pt-20 px-4 pb-24 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-dim p-8 md:p-12 text-on-primary">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Morning Rush Mode
            </span>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-6 leading-tight">
              Ready to fuel Leo&apos;s day?
            </h1>
            <button className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl font-headline font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform">
              <span className="material-symbols-outlined material-symbols-outlined-filled">qr_code_scanner</span>
              Scan Lunchbox Now
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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active Analysis Widget (Rainbow Meter) */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-lg p-8 shadow-[0_32px_32px_rgba(0,0,0,0.03)] border-b-4 border-primary">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-2xl font-headline font-bold mb-1">Latest Scan Results</h2>
                <p className="text-on-surface-variant">Today&apos;s Bento: &quot;The Power Pack&quot;</p>
              </div>
              <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-bold text-sm">
                Analyzed 2m ago
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Rainbow Meter Column */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold">Protein (Muscle Power)</span>
                    <span className="text-sm font-bold text-primary">85%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold">Fiber (Digestive Health)</span>
                    <span className="text-sm font-bold text-secondary">60%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-fixed rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold">Micronutrients (Immunity)</span>
                    <span className="text-sm font-bold text-tertiary">92%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
              </div>
              {/* Scores & Logistics */}
              <div className="flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container p-4 rounded-lg text-center">
                    <span className="material-symbols-outlined text-primary text-3xl block mb-2">psychology</span>
                    <p className="text-xs uppercase font-bold text-on-surface-variant">Brain Fuel</p>
                    <p className="text-2xl font-headline font-black">9.2</p>
                  </div>
                  <div className="bg-surface-container p-4 rounded-lg text-center">
                    <span className="material-symbols-outlined text-secondary text-3xl block mb-2">bolt</span>
                    <p className="text-xs uppercase font-bold text-on-surface-variant">Explorer Energy</p>
                    <p className="text-2xl font-headline font-black">8.5</p>
                  </div>
                </div>
                {/* Logistics Alert */}
                <div className="mt-6 flex gap-4 bg-error-container/10 p-4 rounded-lg border-l-4 border-error">
                  <span className="material-symbols-outlined text-error">warning</span>
                  <p className="text-sm font-medium text-on-surface leading-snug">
                    This portion may be too large for a kindergartener&apos;s 20-minute lunch break.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* One-Minute Upgrade Banner */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-secondary-container rounded-lg p-6 flex flex-col justify-between relative overflow-hidden h-full min-h-[280px]">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-secondary mb-4">
                  <span className="material-symbols-outlined font-bold">bolt</span>
                  <span className="font-headline font-bold uppercase tracking-widest text-xs">One-Minute Upgrade</span>
                </div>
                <h3 className="text-2xl font-headline font-extrabold text-on-secondary-container mb-2">Tiny Tweak</h3>
                <p className="text-on-secondary-container font-medium opacity-80 mb-6">
                  &quot;Add one crunchy veggie like a baby carrot for better fiber density.&quot;
                </p>
                <button className="bg-on-secondary-container text-white px-6 py-2 rounded-full text-sm font-bold w-fit">
                  Got it!
                </button>
              </div>
              <span className="absolute -bottom-4 -right-4 material-symbols-outlined text-[120px] text-on-secondary-container/10 rotate-12">
                nutrition
              </span>
            </div>
          </div>

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
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                  <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Crunch Factor</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                  <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                  <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                  <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-surface-container rounded-lg italic text-sm text-on-surface-variant">
                &quot;Leo prefers crunchier textures in the morning; today&apos;s lunch needs more crunch.&quot;
              </div>
            </div>
          </div>

          {/* Energy Curve Prediction */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-lg p-8 shadow-[0_32px_32px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-headline font-bold">Energy Curve Prediction</h3>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
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
                Peak Focus: Math (1:30 PM)
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
              <p className="text-sm font-bold text-primary">Steady Energy until 3 PM</p>
              <span className="text-xs text-on-surface-variant font-medium">Based on Glycemic Load Index</span>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-24 right-4 z-50">
        <button className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      <MobileNav />
    </>
  );
}
