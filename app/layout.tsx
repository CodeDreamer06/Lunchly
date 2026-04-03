import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LunchLogic - Smart Lunch Planning",
  description: "AI-powered lunchbox analysis, weekly meal planning, and smart food swaps for families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body">
        {children}
      </body>
    </html>
  );
}
