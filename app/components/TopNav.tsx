"use client";

import { useEffect, useRef, useState } from "react";
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
];

export default function TopNav() {
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const notifications = [
    {
      title: "Lunchbox Lab follow-up",
      body: "Freeze-dried strawberries are ready to add as tomorrow's crunchy experiment.",
      href: "/lab",
      icon: "science",
    },
    {
      title: "Caregiver share card updated",
      body: "Profile now includes the handoff notes and school policy summary.",
      href: "/profile#caregiver-hub",
      icon: "family_restroom",
    },
    {
      title: "Weekly plan reminder",
      body: "Review next week's lunch rotation before Sunday evening prep.",
      href: "/planning",
      icon: "calendar_month",
    },
  ];

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
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
            onClick={() => {
              setIsNotificationsOpen((open) => !open);
              setIsProfileOpen(false);
            }}
            className="relative material-symbols-outlined text-stone-500 hover:text-primary transition-colors"
          >
            notifications
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-secondary" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 w-80 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-3 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between px-2 py-2">
                <div>
                  <p className="font-headline text-sm font-extrabold text-on-surface">Notifications</p>
                  <p className="text-xs text-on-surface-variant">Quick actions and recent nudges</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="material-symbols-outlined text-sm text-on-surface-variant hover:text-on-surface"
                >
                  close
                </button>
              </div>
              <div className="mt-1 space-y-2">
                {notifications.map((notification) => (
                  <Link
                    key={notification.title}
                    href={notification.href}
                    onClick={() => setIsNotificationsOpen(false)}
                    className="flex gap-3 rounded-3xl p-3 transition-colors hover:bg-surface-container-low"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-container/25 text-primary">
                      <span className="material-symbols-outlined text-xl">{notification.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{notification.title}</p>
                      <p className="text-xs leading-relaxed text-on-surface-variant">{notification.body}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            aria-label="Open profile menu"
            aria-expanded={isProfileOpen}
            onClick={() => {
              setIsProfileOpen((open) => !open);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 bg-surface-container rounded-full pl-1 pr-3 py-1 transition-colors hover:bg-surface-container-high"
          >
            <img
              alt="Child Profile Avatar"
              className="w-8 h-8 rounded-full"
              src="/stitch-assets/954feca66ac9c89903b8d369f8398c3b5c20aee131eedebd068548b10244bef5.png"
            />
            <span className="font-headline font-bold text-sm">Leo</span>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 w-72 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-3 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
              <div className="rounded-3xl bg-surface-container-low p-4">
                <p className="font-headline text-base font-extrabold text-on-surface">Leo&apos;s profile</p>
                <p className="mt-1 text-xs text-on-surface-variant">Profile settings, sensory details, and caregiver handoff tools now live together.</p>
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-primary">face</span>
                  Profile Overview
                </Link>
                <Link
                  href="/profile#sensory-preferences"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Sensory Preferences
                </Link>
                <Link
                  href="/profile#caregiver-hub"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-primary">family_restroom</span>
                  Caregiver Hub
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
