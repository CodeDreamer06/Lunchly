import { NextResponse } from "next/server";

import { getScreenBySlug, readScreenPng } from "@/lib/stitch";

type ScreenImageRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, { params }: ScreenImageRouteProps) {
  const { slug } = await params;
  const screen = getScreenBySlug(slug);

  if (!screen) {
    return new NextResponse("Not found", { status: 404 });
  }

  const image = await readScreenPng(slug);

  return new NextResponse(image, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=3600",
    },
  });
}
