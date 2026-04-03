import TopNav from "../components/TopNav";
import SideNav from "../components/SideNav";
import MobileNav from "../components/MobileNav";

export default function Profile() {
  return (
    <>
      <TopNav />
      <SideNav />
      
      <main className="md:ml-64 pt-24 px-4 pb-20 max-w-7xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            Child Profile &amp; Sensory Preferences
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Tailor the LunchLogic experience to your child&apos;s unique needs, habits, and school environment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <section className="lg:col-span-4 space-y-8">
            {/* Profile Card */}
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 text-center flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full ring-4 ring-primary-container ring-offset-4 overflow-hidden bg-surface-container-high">
                  <img
                    alt="Leo's Profile"
                    className="w-full h-full object-cover"
                    src="/stitch-assets/1d2466329e3836060d4ee06a33a039da2fa09e8baa0023d13b5caa819469531e.png"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <h2 className="text-2xl font-headline font-bold text-on-surface">Leo Miller</h2>
              <p className="text-on-surface-variant font-medium">Grade 2 • 7 Years Old</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-tertiary-container/30 text-on-tertiary-container rounded-full text-xs font-semibold">
                  Active Profile
                </span>
                <span className="px-3 py-1 bg-secondary-container/30 text-on-secondary-container rounded-full text-xs font-semibold">
                  Morning School
                </span>
              </div>
            </div>

            {/* Allergy & School Policy */}
            <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">school</span>
                Allergy &amp; School Policy
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-error">dangerous</span>
                    <span className="text-sm font-medium">Nut-Free Policy</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">close</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">microwave</span>
                    <span className="text-sm font-medium">No Reheating</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">close</span>
                </div>
                <button className="w-full py-3 border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant text-sm font-semibold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add New Policy
                </button>
              </div>
            </div>
          </section>

          {/* Right Column */}
          <section className="lg:col-span-8 space-y-8">
            {/* Sensory Preferences */}
            <div className="bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15">
              <h3 className="font-headline font-bold text-2xl mb-6">Sensory Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "restaurant", title: "Picky Eater", desc: "Prioritizes familiar textures and predictable flavor profiles.", color: "primary", checked: true },
                  { icon: "psychology", title: "Sensory-Sensitive", desc: "Aversion to mixed textures, strong smells, or soggy foods.", color: "tertiary", checked: false },
                  { icon: "fitness_center", title: "Sports Day Focus", desc: "Higher protein and complex carbs for energy on PE days.", color: "secondary", checked: true },
                  { icon: "savings", title: "Budget-Conscious", desc: "Suggests ingredients that are currently seasonal or in-bulk.", color: "on-primary-container", checked: false },
                ].map((item, i) => (
                  <label key={i} className="group relative flex flex-col gap-4 p-5 rounded-xl bg-surface-container hover:bg-primary-container/10 border-2 border-transparent transition-all cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="absolute right-4 top-4 w-6 h-6 rounded-full text-primary focus:ring-primary-container border-outline"
                    />
                    <div className={`w-12 h-12 bg-surface-container-lowest rounded-lg flex items-center justify-center text-${item.color}`}>
                      <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-lg">{item.title}</p>
                      <p className="text-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Eating Habits & Independence */}
            <div className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                <h3 className="font-headline font-bold text-xl">Eating Habits &amp; Independence</h3>
              </div>
              <p className="text-on-surface-variant text-sm mb-4">
                How much help does your child need during lunch? We use this to suggest packaging and food prep levels.
              </p>
              <div className="relative">
                <textarea
                  className="w-full bg-surface-container-lowest rounded-lg border-none focus:ring-2 focus:ring-primary/20 p-4 font-body text-on-surface placeholder:text-outline-variant"
                  placeholder="e.g., Can peel an orange but struggles with tiny wrappers. Needs pre-cut apples."
                  rows={4}
                ></textarea>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold hover:bg-surface-container-highest transition-colors">
                    Needs pre-cut food
                  </button>
                  <button className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold hover:bg-surface-container-highest transition-colors">
                    Finger foods only
                  </button>
                  <button className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-semibold hover:bg-surface-container-highest transition-colors">
                    Self-sufficient
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex-1 bg-primary text-white py-4 rounded-xl font-headline font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
                Save Child Profile
              </button>
              <button className="px-10 py-4 bg-secondary-container text-on-secondary-container rounded-xl font-headline font-bold text-lg hover:bg-secondary-fixed transition-all">
                Cancel
              </button>
            </div>
          </section>
        </div>
      </main>

      <MobileNav />
    </>
  );
}
