"use client"

import { useCallback, useEffect, useState } from "react"
import { fetchCategories } from "@/lib/api/categories"
import { useCategoriesStore } from "@/stores/categories-store"
import type { CategoryApiNode } from "@/types/category"

export function useCategories(): {
  categories: CategoryApiNode[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const { categories: raw } = useCategoriesStore()
  const [isLoading, setIsLoading] = useState(raw == null)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCategories()
      useCategoriesStore.getState().setCategories(data)
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
    categories: raw ?? [],
    isLoading,
    error,
    refetch: fetch,
  }
}
