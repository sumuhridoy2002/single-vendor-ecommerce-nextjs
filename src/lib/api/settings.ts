import type { SettingsApiResponse } from "@/types/settings";
import { getBaseUrl } from "./client";

export async function fetchSettings(): Promise<SettingsApiResponse> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/settings`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Settings fetch failed: ${res.status}`);
  }

  const json = (await res.json()) as SettingsApiResponse;
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load settings");
  }

  return json;
}

/** Safe fetch for use in generateMetadata; returns null if env or request fails. */
export async function fetchSettingsSafe(): Promise<SettingsApiResponse | null> {
  try {
    return await fetchSettings();
  } catch {
    return null;
  }
}
