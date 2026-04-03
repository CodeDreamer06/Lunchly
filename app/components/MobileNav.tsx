"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "dashboard" },
  { href: "/analysis", label: "Scan", icon: "qr_code_scanner" },
  { href: "/trends", label: "Trends", icon: "trending_up" },
  { href: "/profile", label: "Kids", icon: "face" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-stone-200/30 flex justify-around items-center h-20 px-4 z-50 rounded-t-xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? "material-symbols-outlined-filled" : ""}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        );
      })}
      
      <button className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined">add</span>
        <span className="text-[10px] font-bold">Add</span>
      </button>
    </nav>
  );
}
