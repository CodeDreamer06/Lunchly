"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/analysis", label: "Lunch Scanner", icon: "qr_code_scanner" },
  { href: "/trends", label: "Weekly Trends", icon: "trending_up" },
  { href: "/swaps", label: "Swap Engine", icon: "swap_horiz" },
  { href: "/profile", label: "Kid Profiles", icon: "face" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-stone-200/50 bg-white/70 backdrop-blur-md pt-20 pb-8 z-40 shadow-[32px_0_32px_rgba(0,0,0,0.06)]">
      <div className="px-6 mb-8">
        <h2 className="text-xl font-headline font-extrabold text-primary">Parent Portal</h2>
        <p className="text-xs text-on-surface-variant">Managing 2 Profiles</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "font-variation-settings: 'FILL' 1;" : ""}`}>
                {item.icon}
              </span>
              <span className="font-headline text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="bg-surface-container-high p-4 rounded-xl flex items-center gap-3">
          <img
            alt="Mia Portrait"
            className="w-10 h-10 rounded-full object-cover"
            src="/stitch-assets/4868dd2b58d33256b47ca348b14dbc0e64240edfe884aec011e683305b871870.png"
          />
          <div>
            <p className="text-xs font-bold font-headline">Mia</p>
            <p className="text-[10px] text-on-surface-variant">3rd Grade</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
