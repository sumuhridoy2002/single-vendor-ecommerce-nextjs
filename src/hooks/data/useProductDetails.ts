"use client"

import { useCallback, useEffect, useState } from "react"
import {
  fetchProductBySlug,
  mapProductDetailsToProduct,
} from "@/lib/api/products"
import { useProductDetailsStore } from "@/stores/product-details-store"
import type { Product } from "@/types/product"

export function useProductDetails(
  slug: string | null | undefined,
  initialData?: Product | null
): {
  product: Product | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const setProduct = useProductDetailsStore((s) => s.setProduct)
  const cached = useProductDetailsStore((s) =>
    slug ? s.productById[slug] ?? null : null
  )
  const hasInitial = initialData != null && initialData.slug === slug
  const effective = cached ?? (hasInitial ? initialData : null)

  const [isLoading, setIsLoading] = useState(
    slug != null && effective == null && !hasInitial
  )
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (slug == null) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchProductBySlug(slug)
      const product = mapProductDetailsToProduct(data)
      setProduct(slug, product)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      setProduct(slug, null)
    } finally {
      setIsLoading(false)
    }
  }, [slug, setProduct])

  useEffect(() => {
    if (slug == null) {
      setIsLoading(false)
      setError(null)
      return
    }
    if (hasInitial) {
      setProduct(slug, initialData!)
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
  }, [slug, hasInitial, initialData, cached, setProduct, fetch])

  return {
    product: slug != null ? effective : null,
    isLoading,
    error,
    refetch: fetch,
  }
}
