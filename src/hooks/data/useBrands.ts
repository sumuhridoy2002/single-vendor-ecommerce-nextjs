"use client"

import { fetchBrands } from "@/lib/api/brands"
import { globalQueryKeys } from "@/lib/query-keys"
import type { BrandApi } from "@/types/brand"
import { useQuery } from "@tanstack/react-query"

export function useBrands(): {
  brands: BrandApi[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<unknown>
} {
  const { data: brands = [], isLoading, error, refetch } = useQuery({
    queryKey: globalQueryKeys.brands,
    queryFn: fetchBrands,
  })

  return {
    brands,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  }
}
