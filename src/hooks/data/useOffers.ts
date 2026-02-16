import { useEffect } from "react"
import { useOffersStore } from "@/store/offers-store"

export function useOffers() {
  const offers = useOffersStore((s) => s.offers)
  const isLoading = useOffersStore((s) => s.isLoading)
  const error = useOffersStore((s) => s.error)
  const fetchOffers = useOffersStore((s) => s.fetchOffers)

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return { offers, isLoading, error }
}
