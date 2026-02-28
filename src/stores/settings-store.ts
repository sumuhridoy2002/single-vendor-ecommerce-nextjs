import { create } from "zustand";
import type { GlobalSettings } from "@/types/settings";

interface SettingsState {
  settings: GlobalSettings | null;
  setSettings: (settings: GlobalSettings | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
}));
