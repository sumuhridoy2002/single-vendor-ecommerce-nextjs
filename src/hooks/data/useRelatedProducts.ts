"use client"

import { useCallback, useEffect, useState } from "react"
import { fetchRelatedProducts } from "@/lib/api/products"
import type { Product } from "@/types/product"

export function useRelatedProducts(productId: string | null | undefined): {
  products: Product[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(productId != null)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (productId == null) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchRelatedProducts(productId)
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    if (productId == null) {
      setProducts([])
      setIsLoading(false)
      setError(null)
      return
    }
    fetch()
  }, [productId, fetch])

  return {
    products,
    isLoading,
    error,
    refetch: fetch,
  }
}
