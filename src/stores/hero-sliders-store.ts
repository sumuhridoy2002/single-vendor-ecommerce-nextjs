import { create } from "zustand"
import type { HeroSliderItem } from "@/types/hero-slider"

interface HeroSlidersState {
  heroSliders: HeroSliderItem[] | null
  setHeroSliders: (heroSliders: HeroSliderItem[] | null) => void
}

export const useHeroSlidersStore = create<HeroSlidersState>((set) => ({
  heroSliders: null,
  setHeroSliders: (heroSliders) => set({ heroSliders }),
}))
