import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";

export const metadata: Metadata = {
  title: "Lunchly - Smart Lunch Planning",
  description: "AI-powered lunchbox analysis, weekly meal planning, and smart food swaps for families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
