import { NextResponse } from "next/server";

import { getScreenBySlug, readScreenHtml } from "@/lib/stitch";

type PreviewRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

function replaceChildSpecificText(html: string, childName: string, caregiverName: string, profilesCount: string) {
  return html
    .replaceAll("Leo's", `${childName}'s`)
    .replaceAll("Leo", childName)
    .replaceAll("Managing 2 Profiles", `Managing ${profilesCount} Profiles`)
    .replaceAll(">Parent Portal<", `>${caregiverName}'s Portal<`);
}

export async function GET(request: Request, { params }: PreviewRouteProps) {
  const { slug } = await params;
  const screen = getScreenBySlug(slug);

  if (!screen) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? "embedded";
  const childName = searchParams.get("childName") ?? "Leo";
  const caregiverName = searchParams.get("caregiverName") ?? "Priya";
  const profilesCount = searchParams.get("profilesCount") ?? "2";
  const html = replaceChildSpecificText(
    await readScreenHtml(slug),
    childName,
    caregiverName,
    profilesCount,
  );

  if (mode === "standalone") {
    return new NextResponse(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

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
