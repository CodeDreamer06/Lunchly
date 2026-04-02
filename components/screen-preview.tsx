"use client";

import { useEffect, useMemo, useState } from "react";

import { getActiveProfile, getStoredProfiles } from "@/lib/profile-storage";

type ScreenPreviewProps = {
  slug: string;
  title: string;
  mode?: "embedded" | "standalone";
  className?: string;
};

export function ScreenPreview({
  slug,
  title,
  mode = "embedded",
  className,
}: ScreenPreviewProps) {
  const [childName, setChildName] = useState("Leo");
  const [caregiverName, setCaregiverName] = useState("Priya");
  const [profilesCount, setProfilesCount] = useState(2);

  useEffect(() => {
    const activeProfile = getActiveProfile();
    const profiles = getStoredProfiles();

    const frame = window.requestAnimationFrame(() => {
      if (activeProfile) {
        setChildName(activeProfile.fullName.split(" ")[0]);
        setCaregiverName(activeProfile.caregiverName || "Priya");
      }

      if (profiles.length) {
        setProfilesCount(profiles.length);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const src = useMemo(() => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    params.set("childName", childName);
    params.set("caregiverName", caregiverName);
    params.set("profilesCount", String(profilesCount));

    return `/preview/${slug}?${params.toString()}`;
  }, [caregiverName, childName, mode, profilesCount, slug]);

  return <iframe title={title} src={src} className={className} />;
}
