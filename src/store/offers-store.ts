import { create } from "zustand"
import type { Offer } from "@/types/offer"

interface OffersState {
  offers: Offer[]
  isLoading: boolean
  error: string | null
  setOffers: (offers: Offer[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchOffers: () => Promise<void>
}

const OFFERS_API = "/api/offers"

export const useOffersStore = create<OffersState>((set, get) => ({
  offers: [],
  isLoading: false,
  error: null,

  setOffers: (offers) => set({ offers, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchOffers: async () => {
    if (get().offers.length > 0) return
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(OFFERS_API)
      if (!res.ok) throw new Error("Failed to fetch offers")
      const data = await res.json()
      set({ offers: data.offers ?? [], isLoading: false, error: null })
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to fetch offers",
        isLoading: false,
      })
    }
  },
}))
