import { create } from "zustand";
import type { HomepageDataApi } from "@/types/homepage";

interface HomepageState {
  data: HomepageDataApi | null;
  setData: (data: HomepageDataApi | null) => void;
}

export const useHomepageStore = create<HomepageState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
