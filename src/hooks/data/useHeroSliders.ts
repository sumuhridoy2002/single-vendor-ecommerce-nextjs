"use client"

import { useCallback, useEffect, useState } from "react"
import { fetchHeroSliders } from "@/lib/api/hero-sliders"
import { useHeroSlidersStore } from "@/stores/hero-sliders-store"
import type { HeroSliderItem } from "@/types/hero-slider"

export function useHeroSliders(): {
  heroSliders: HeroSliderItem[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const { heroSliders: raw } = useHeroSlidersStore()
  const [isLoading, setIsLoading] = useState(raw == null)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchHeroSliders()
      useHeroSlidersStore.getState().setHeroSliders(data)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (raw != null) {
      setIsLoading(false)
      return
    }
    fetch()
  }, [raw, fetch])

  return {
    heroSliders: raw ?? [],
    isLoading,
    error,
    refetch: fetch,
  }
}
