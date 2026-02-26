import { create } from "zustand"
import type { CategoryApiNode } from "@/types/category"

interface CategoriesState {
  categories: CategoryApiNode[] | null
  setCategories: (categories: CategoryApiNode[] | null) => void
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: null,
  setCategories: (categories) => set({ categories }),
}))
