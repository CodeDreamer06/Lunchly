import TopNav from "../components/TopNav";
import SideNav from "../components/SideNav";
import MobileNav from "../components/MobileNav";

export default function Store() {
  const products = [
    { name: "Fresh Strawberries", desc: "1lb Organic Pack", price: "$3.49", original: "$4.99", discount: "-30%", discountColor: "bg-error", img: "/stitch-assets/02e28a4ddb1e9c1835e2e9c5b3c1fc91fd08073cf4180773ca45298920940eeb.png" },
    { name: "Sprouted Grain Bread", desc: "High-Fiber 20oz Loaf", price: "$3.25", original: "$6.49", discount: "BOGO", discountColor: "bg-secondary", img: "/stitch-assets/fe0fc967bf4a92d310ca936c6134963162490c7020165af660509b1230fd3806.png" },
    { name: "Baby Carrots", desc: "Snap Pack 12oz", price: "$1.95", original: "$2.29", discount: "-15%", discountColor: "bg-error", img: "/stitch-assets/34e14e1d5ef799c33d8fec5a88e4dc4075ceb13f15e95c85234279a9b554c39c.png" },
    { name: "Hummus Singles", desc: "Roasted Garlic 6pk", price: "$4.49", original: "$5.99", discount: "Member Deal", discountColor: "bg-primary-container text-on-primary-container", img: "/stitch-assets/2a15ce1d3723aab3197e591d6eb4cf8f12ea98f88ab994bd011d6ebfc7e34615.png" },
  ];

  const proteins = [
    { name: "Organic Eggs", cost: "$0.42 / srv", icon: "egg" },
    { name: "Greek Yogurt", cost: "$0.68 / srv", icon: "flatware" },
    { name: "Rotisserie Chicken", cost: "$0.35 / srv", icon: "restaurant", topPick: true },
  ];

  return (
    <>
      <TopNav />
      <SideNav />
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto md:ml-64 pt-20">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header & Budget Goal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-2">
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Smart Shopping Map</h1>
              <p className="text-on-surface-variant text-lg">
                Optimizing your weekly lunchbox at <span className="font-bold text-primary">Whole Foods Market</span>
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-[3rem] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-headline font-bold text-on-surface-variant">Weekly Budget Goal</span>
                  <span className="text-primary font-headline font-black text-xl">$2.50 / lunch</span>
                </div>
                <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[74%] rounded-full"></div>
                </div>
                <p className="text-xs text-on-surface-variant text-right">74% of budget utilized • <strong>$1.85 current avg.</strong></p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[100px] text-primary">savings</span>
              </div>
            </div>
          </div>

          {/* Bento Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Store Map Card */}
            <div className="md:col-span-8 bg-surface-container-low rounded-[3rem] p-8 relative min-h-[450px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-headline font-extrabold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">map</span>
                  Smart Store Route
                </h2>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-surface-container-lowest rounded-full text-xs font-bold shadow-sm">Aisle 4: Dairy</span>
                  <span className="px-4 py-2 bg-primary text-white rounded-full text-xs font-bold shadow-sm">Start Shopping</span>
                </div>
              </div>
              {/* Map Visualization */}
              <div className="relative w-full aspect-video bg-surface-container-highest rounded-lg border-4 border-white overflow-hidden shadow-inner">
                {/* Simulated Map Grid */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2 p-4 opacity-40">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-outline-variant rounded"></div>
                  ))}
                </div>
                {/* Path Logic */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
                  <path d="M40,160 Q100,160 100,100 T200,80 T300,120 T360,40" fill="none" stroke="#00751f" strokeDasharray="8 8" strokeWidth="4"></path>
                </svg>
                {/* Pins */}
                <div className="absolute top-[80%] left-[10%] group">
                  <span className="material-symbols-outlined text-primary text-3xl material-symbols-outlined-filled">location_on</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded mb-1 whitespace-nowrap">Entrance</div>
                </div>
                <div className="absolute top-[40%] left-[25%]">
                  <span className="material-symbols-outlined text-tertiary text-2xl material-symbols-outlined-filled">shopping_basket</span>
                </div>
                <div className="absolute top-[20%] left-[50%]">
                  <span className="material-symbols-outlined text-secondary text-2xl material-symbols-outlined-filled">nutrition</span>
                </div>
                <div className="absolute top-[10%] left-[90%]">
                  <span className="material-symbols-outlined text-primary text-3xl material-symbols-outlined-filled">check_circle</span>
                </div>
              </div>
            </div>

            {/* Best Value Protein Card */}
            <div className="md:col-span-4 bg-tertiary-container text-on-tertiary-container rounded-[3rem] p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-headline font-extrabold mb-2">Best Value Protein</h2>
                <p className="text-sm opacity-80 mb-6">Price comparison based on 15g protein serving</p>
                <div className="space-y-4">
                  {proteins.map((protein, i) => (
                    <div key={i} className={`bg-white/20 p-4 rounded-2xl flex items-center justify-between ${protein.topPick ? "border-2 border-white/50 bg-white/40" : ""}`}>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">{protein.icon}</span>
                        <span className="font-bold">{protein.name}</span>
                      </div>
                      <div className="text-right">
                        {protein.topPick && <span className="text-[10px] uppercase tracking-wider font-bold bg-primary text-white px-2 rounded block mb-1">Top Pick</span>}
                        <span className="font-headline font-black">{protein.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8">
                <button className="w-full py-4 bg-on-tertiary-container text-white rounded-xl font-headline font-bold text-sm">Update Preferences</button>
              </div>
            </div>

            {/* On-Sale Staples */}
            <div className="md:col-span-12">
              <div className="flex items-end justify-between mb-6 px-2">
                <div>
                  <h2 className="text-3xl font-headline font-extrabold">On-Sale Staples</h2>
                  <p className="text-on-surface-variant">Recommended lunchbox basics at Target</p>
                </div>
                <button className="text-primary font-bold flex items-center gap-1">
                  View Full Flyer
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, i) => (
                  <div key={i} className="bg-surface-container-low p-6 rounded-[3rem] group hover:bg-surface-container transition-colors">
                    <div className="aspect-square bg-white rounded-[3rem] mb-4 overflow-hidden relative">
                      <img className="w-full h-full object-cover" src={product.img} alt={product.name} />
                      <div className={`absolute top-3 right-3 ${product.discountColor} text-white text-[10px] font-black px-2 py-1 rounded-full`}>
                        {product.discount}
                      </div>
                    </div>
                    <h3 className="font-headline font-bold text-lg">{product.name}</h3>
                    <p className="text-on-surface-variant text-sm mb-4">{product.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-on-surface-variant line-through">{product.original}</span>
                        <span className="text-xl font-black text-primary">{product.price}</span>
                      </div>
                      <button className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">add</span>
                      </button>
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
