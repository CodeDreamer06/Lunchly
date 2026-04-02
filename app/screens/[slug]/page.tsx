import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { getAllScreens, getScreenBySlug } from "@/lib/stitch";

type ScreenPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllScreens().map((screen) => ({
    slug: screen.slug,
  }));
}

export async function generateMetadata({
  params,
}: ScreenPageProps): Promise<Metadata> {
  const { slug } = await params;
  const screen = getScreenBySlug(slug);

  if (!screen) {
    return {
      title: "Screen Not Found | LunchLogic",
    };
  }

  return {
    title: `${screen.title} | LunchLogic`,
    description: screen.summary,
  };
}

export default async function ScreenPage({ params }: ScreenPageProps) {
  const { slug } = await params;
  const screen = getScreenBySlug(slug);

  if (!screen) {
    notFound();
  }

  const screens = getAllScreens();
  const currentIndex = screens.findIndex((entry) => entry.slug === slug);
  const previous = currentIndex > 0 ? screens[currentIndex - 1] : null;
  const next = currentIndex < screens.length - 1 ? screens[currentIndex + 1] : null;

  return (
    <AppShell currentScreen={screen} screens={screens} previous={previous} next={next}>
      <section className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_18px_48px_rgba(56,56,51,0.05)] sm:p-4">
        <div className="flex items-center justify-between px-2 pb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:rgba(56,56,51,0.42)]">
          <span>Screen Preview</span>
          <span>Frontend only</span>
        </div>
        <iframe
          title={screen.title}
          src={`/preview/${screen.slug}`}
          className="h-[76vh] min-h-[860px] w-full rounded-[1.6rem] bg-[var(--background)]"
        />
      </section>
    </AppShell>
  );
}
