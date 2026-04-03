import TopNav from "../components/TopNav";
import MobileNav from "../components/MobileNav";

export default function Caregiver() {
  const acceptedFoods = [
    { name: "Sliced Honeycrisp", note: "Skin-off, slight cinnamon", icon: "ios" },
    { name: "Mini Pita Pockets", note: "With hummus inside", icon: "bakery_dining" },
    { name: "Boiled Egg Stars", note: "Cut with star shape mold", icon: "egg" },
  ];

  const schoolPolicies = [
    { icon: "no_drinks", text: "100% Nut Free" },
    { icon: "wine_bar", text: "No Glass Containers" },
    { icon: "eco", text: "Waste-Free Preferred" },
    { icon: "water_drop", text: "Water Only Bottles" },
  ];

  return (
    <>
      <TopNav />
      
      <main className="min-h-screen pt-24 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-headline font-extrabold text-on-background tracking-tight">Caregiver Hub</h2>
              <p className="text-on-surface-variant mt-2 max-w-lg">
                Create a personalized Report Card for Leo&apos;s grandmas or nannies. Nutrition made easy, shared instantly.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-sm">
                <span className="material-symbols-outlined">share</span>
                Share Hub
              </button>
            </div>
          </header>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Best Accepted Foods */}
            <section className="md:col-span-4 bg-surface-container-low squircle-lg p-8 flex flex-col gap-6 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-xl">Best Accepted</h3>
                <span className="material-symbols-outlined text-primary material-symbols-outlined-filled">favorite</span>
              </div>
              <div className="space-y-4">
                {acceptedFoods.map((food, i) => (
                  <div key={i} className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 hover:scale-[1.02] transition-transform">
                    <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-primary-container">{food.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold">{food.name}</p>
                      <p className="text-xs text-on-surface-variant">{food.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-primary font-bold text-sm flex items-center gap-1 mt-auto hover:underline">
                Edit List <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
            </section>

            {/* Current Goals */}
            <section className="md:col-span-8 bg-gradient-to-br from-primary to-primary-dim p-8 squircle-lg text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined">star</span>
                  <h3 className="font-headline font-bold text-xl">Current Goals</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <h4 className="text-3xl font-black mb-2 tracking-tight">Color Quest: 3 Colors</h4>
                    <p className="text-primary-container/80 text-lg">
                      Goal: Include three vibrant colors in every lunchbox this week to boost phytonutrients.
                    </p>
                    <div className="mt-6 h-3 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-secondary-container w-2/3"></div>
                    </div>
                    <p className="text-xs mt-2 font-medium">4 of 7 days completed</p>
                  </div>
                  <div className="shrink-0">
                    <div className="bg-white/10 backdrop-blur-md p-4 squircle-lg border border-white/20">
                      <span className="material-symbols-outlined text-5xl material-symbols-outlined-filled">palette</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* 3D Illustration Leak */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            {/* Quick Wins & Foods to Avoid */}
            <div className="md:col-span-5 grid grid-rows-2 gap-6">
              <div className="bg-surface-container-high squircle-lg p-6 flex flex-col gap-4 border-l-8 border-primary">
                <div className="flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined">bolt</span>
                  <h4 className="font-bold">Quick Win</h4>
                </div>
                <p className="text-on-surface font-medium italic">
                  &quot;Freeze the yogurt tube! It stays cold until lunch and acts as an ice pack.&quot;
                </p>
              </div>
              <div className="bg-error-container/10 squircle-lg p-6 flex flex-col gap-4 border-l-8 border-error">
                <div className="flex items-center gap-2 text-error">
                  <span className="material-symbols-outlined">block</span>
                  <h4 className="font-bold">Avoid</h4>
                </div>
                <p className="text-on-surface-variant text-sm">
                  Don&apos;t pack berries directly with yogurt. They get soggy. Use a separate small container.
                </p>
              </div>
            </div>

            {/* School Policy Alert */}
            <section className="md:col-span-7 bg-surface-container-low squircle-lg p-8 relative">
              <div className="flex items-center gap-3 mb-6 text-on-surface">
                <span className="material-symbols-outlined text-error">warning</span>
                <h3 className="font-headline font-bold text-xl uppercase tracking-wider">School Policy Alert</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {schoolPolicies.map((policy, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center text-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-3xl">{policy.icon}</span>
                    <p className="font-bold text-sm">{policy.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Share Hub */}
            <section className="md:col-span-12 bg-surface-container-lowest p-8 squircle-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-surface-variant/50">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-secondary-container rounded-2xl flex items-center justify-center rotate-3">
                  <span className="material-symbols-outlined text-on-secondary-container text-4xl">qr_code_2</span>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-extrabold tracking-tight">Ready to hand off?</h3>
                  <p className="text-on-surface-variant">Your digital Report Card is ready to share.</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:brightness-110 transition-all shadow-lg active:scale-95">
                  <span className="material-symbols-outlined">chat</span>
                  WhatsApp
                </button>
                <button className="bg-tertiary text-on-tertiary px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:brightness-110 transition-all shadow-lg active:scale-95">
                  <span className="material-symbols-outlined">mail</span>
                  Email Hub
                </button>
                <button className="bg-surface-container-highest text-on-surface px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-surface-variant transition-all active:scale-95">
                  <span className="material-symbols-outlined">print</span>
                  PDF Card
                </button>
              </div>
            </section>
          </div>

          {/* Visual Flare - 3D Food Leak */}
          <div className="fixed bottom-12 right-12 w-32 h-32 opacity-20 pointer-events-none hidden lg:block">
            <img
              className="w-full h-full object-cover rounded-full shadow-2xl rotate-12"
              alt="Fresh salad"
              src="/stitch-assets/a0988e01d8ca56675c846ba6e69e768907b6c4f310cddc1ea6565ac0e440174c.png"
            />
          </div>
        </div>
      </main>

      <MobileNav />
    </>
  );
}
