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
  { href: "/lab", label: "Lunchbox Lab", icon: "science" },
  { href: "/analysis", label: "Lunch Scanner", icon: "qr_code_scanner" },
  { href: "/trends", label: "Weekly Trends", icon: "trending_up" },
  { href: "/swaps", label: "Swap Engine", icon: "swap_horiz" },
  { href: "/fridge", label: "Fridge Remix", icon: "kitchen" },
  { href: "/planning", label: "Weekly Plan", icon: "calendar_month" },
  { href: "/caregiver", label: "Caregiver Hub", icon: "family_restroom" },
  { href: "/profile", label: "Profile", icon: "face" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full bg-surface border-b border-stone-200/50 flex justify-between items-center px-4 md:px-8 h-16">
      <Link href="/dashboard" className="text-2xl font-black text-primary tracking-tight font-headline">
        LunchLogic
      </Link>
      
      <div className="hidden md:flex gap-8 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`font-headline font-semibold transition-colors hover:text-primary ${
                isActive
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-stone-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button className="material-symbols-outlined text-stone-500 hover:text-primary transition-colors">
          notifications
        </button>
        <div className="flex items-center gap-2 bg-surface-container rounded-full pl-1 pr-3 py-1">
          <img
            alt="Child Profile Avatar"
            className="w-8 h-8 rounded-full"
            src="/stitch-assets/954feca66ac9c89903b8d369f8398c3b5c20aee131eedebd068548b10244bef5.png"
          />
          <span className="font-headline font-bold text-sm">Leo</span>
          <span className="material-symbols-outlined text-xs text-stone-500">expand_more</span>
        </div>
      </div>
    </nav>
  );
}
