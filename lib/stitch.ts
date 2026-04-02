import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

export {
  FEATURED_SCREEN_SLUG,
  STITCH_SCREENS,
  getAllScreens,
  getScreenBySlug,
} from "@/lib/stitch-data";
export type { StitchScreen } from "@/lib/stitch-data";

const STITCH_ROOT = path.join(process.cwd(), "stitch");

function getScreenPath(slug: string, fileName: "code.html" | "screen.png") {
  return path.join(STITCH_ROOT, slug, fileName);
}

export async function readScreenHtml(slug: string) {
  return fs.readFile(getScreenPath(slug, "code.html"), "utf8");
}

export async function readScreenPng(slug: string) {
  return fs.readFile(getScreenPath(slug, "screen.png"));
}
