export type AppSection = "dashboard" | "analyze" | "insights" | "tips" | "history" | "profiles";

export const APP_NAV_ITEMS: Array<{ label: string; href: string; section: AppSection }> = [
  { label: "Dashboard", href: "/dashboard", section: "dashboard" },
  { label: "Analyze", href: "/analyze", section: "analyze" },
  { label: "Insights", href: "/insights", section: "insights" },
  { label: "Tips", href: "/tips", section: "tips" },
  { label: "History", href: "/history", section: "history" },
  { label: "Profiles", href: "/profiles", section: "profiles" },
];
