"use client";

import { useEffect, useState } from "react";

import {
  getActiveProfile,
  getActiveProfileId,
  getStoredAnalyses,
  getStoredProfiles,
  type AnalysisRecord,
  type LunchlyProfile,
} from "@/lib/profile-storage";

type LunchlyDataState = {
  ready: boolean;
  profiles: LunchlyProfile[];
  profile: LunchlyProfile | null;
  activeProfile: LunchlyProfile | null;
  activeProfileId: string | null;
  analyses: AnalysisRecord[];
};

const initialState: LunchlyDataState = {
  ready: false,
  profiles: [],
  profile: null,
  activeProfile: null,
  activeProfileId: null,
  analyses: [],
};

export function useLunchlyData() {
  const [state, setState] = useState<LunchlyDataState>(initialState);

  const refresh = () => {
    const profile = getActiveProfile();

    setState({
      ready: true,
      profiles: profile ? [profile] : [],
      profile,
      activeProfile: profile,
      activeProfileId: getActiveProfileId(),
      analyses: getStoredAnalyses(),
    });
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(refresh);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return {
    ...state,
    refresh,
  };
}
