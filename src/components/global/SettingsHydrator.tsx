"use client";

import { fetchSettings } from "@/lib/api/settings";
import { useSettingsStore } from "@/stores/settings-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const SETTINGS_QUERY_KEY = ["settings"] as const;
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

/**
 * Fetches global settings and syncs them to Zustand.
 * Uses React Query with 30min staleTime and persisted cache (see Provider).
 */
export function SettingsHydrator() {
  const setSettings = useSettingsStore((s) => s.setSettings);

  const { data } = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const res = await fetchSettings();
      return res.data;
    },
    staleTime: THIRTY_MINUTES_MS,
  });

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data, setSettings]);

  return null;
}
