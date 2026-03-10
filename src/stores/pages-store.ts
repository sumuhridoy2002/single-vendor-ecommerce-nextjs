import { create } from "zustand";
import type { CmsPageListItem } from "@/types/cms-page";

interface PagesState {
  pages: CmsPageListItem[] | null;
  setPages: (pages: CmsPageListItem[] | null) => void;
}

export const usePagesStore = create<PagesState>((set) => ({
  pages: null,
  setPages: (pages) => set({ pages }),
}));
