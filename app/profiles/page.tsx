import type { Metadata } from "next";

import { ProfilesExperience } from "@/components/profiles-experience";

export const metadata: Metadata = {
  title: "Child Profile | LunchLogic",
  description: "Review and edit the single child profile used by LunchLogic on this device.",
};

export default function ProfilesPage() {
  return <ProfilesExperience />;
}
