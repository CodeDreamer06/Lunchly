import type { Metadata } from "next";

import { ProfilesExperience } from "@/components/profiles-experience";

export const metadata: Metadata = {
  title: "Profiles | Lunchly",
  description: "Manage child profiles, add siblings, and switch the active Lunchly child.",
};

export default function ProfilesPage() {
  return <ProfilesExperience />;
}
