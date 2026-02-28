"use client"

import { useCallback, useEffect, useState } from "react"
import {
  fetchProductById,
  mapProductDetailsToProduct,
} from "@/lib/api/products"
import { useProductDetailsStore } from "@/stores/product-details-store"
import type { Product } from "@/types/product"

export function useProductDetails(
  id: string | null | undefined,
  initialData?: Product | null
): {
  product: Product | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const setProduct = useProductDetailsStore((s) => s.setProduct)
  const cached = useProductDetailsStore((s) =>
    id ? s.productById[id] ?? null : null
  )
  const hasInitial = initialData != null && initialData.id === id
  const effective = cached ?? (hasInitial ? initialData : null)

  const [isLoading, setIsLoading] = useState(
    id != null && effective == null && !hasInitial
  )
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (id == null) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchProductById(id)
      const product = mapProductDetailsToProduct(data)
      setProduct(id, product)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      setProduct(id, null)
    } finally {
      setIsLoading(false)
    }
  }, [id, setProduct])

  useEffect(() => {
    if (id == null) {
      setIsLoading(false)
      setError(null)
      return
    }
    if (hasInitial) {
      setProduct(id, initialData!)
      setIsLoading(false)
      setError(null)
      return
    }
    if (cached != null) {
      setIsLoading(false)
      setError(null)
      return
    }
    fetch()
  }, [id, hasInitial, initialData, cached, setProduct, fetch])

  return {
    product: id != null ? effective : null,
    isLoading,
    error,
    refetch: fetch,
  }
}
