import { redirect } from "next/navigation";

import { FEATURED_SCREEN_SLUG } from "@/lib/stitch";

export default function HomePage() {
  redirect(`/screens/${FEATURED_SCREEN_SLUG}`);
}
