"use client";

import { useEffect, useState } from "react";

import {
  getActiveProfile,
  getActiveProfileId,
  getStoredAnalyses,
  getStoredProfiles,
  setActiveProfileId,
} from "@/lib/profile-storage";
import type { AnalysisRecord, LunchlyProfile } from "@/lib/lunchly-types";

type LunchlyDataState = {
  ready: boolean;
  profiles: LunchlyProfile[];
  activeProfile: LunchlyProfile | null;
  activeProfileId: string | null;
  analyses: AnalysisRecord[];
};

const initialState: LunchlyDataState = {
  ready: false,
  profiles: [],
  activeProfile: null,
  activeProfileId: null,
  analyses: [],
};

export function useLunchlyData() {
  const [state, setState] = useState<LunchlyDataState>(initialState);

  const refresh = () => {
    const nextState: LunchlyDataState = {
      ready: true,
      profiles: getStoredProfiles(),
      activeProfile: getActiveProfile(),
      activeProfileId: getActiveProfileId(),
      analyses: getStoredAnalyses(),
    };

    setState(nextState);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(refresh);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const switchActiveProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    refresh();
  };

  return {
    ...state,
    refresh,
    switchActiveProfile,
  };
}
