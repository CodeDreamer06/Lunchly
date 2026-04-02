import { NextResponse } from "next/server";

import { getScreenBySlug, readScreenHtml } from "@/lib/stitch";

type PreviewRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, { params }: PreviewRouteProps) {
  const { slug } = await params;
  const screen = getScreenBySlug(slug);

  if (!screen) {
    return new NextResponse("Not found", { status: 404 });
  }

  const html = await readScreenHtml(slug);
  const injectedStyle = `
    <style>
      body {
        background: #fefcf4 !important;
      }

      body > header,
      body > aside,
      body > nav {
        display: none !important;
      }

      body > main {
        margin: 0 !important;
        padding: 1rem !important;
        min-height: auto !important;
      }

      @media (min-width: 768px) {
        body > main {
          padding: 1.25rem !important;
        }
      }
    </style>
  `;
  const transformedHtml = html.includes("</head>")
    ? html.replace("</head>", `${injectedStyle}</head>`)
    : `${injectedStyle}${html}`;

  return new NextResponse(transformedHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
