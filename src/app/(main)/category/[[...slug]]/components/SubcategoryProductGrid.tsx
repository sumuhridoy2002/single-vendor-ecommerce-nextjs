"use client"

import { ProductCard } from "@/components/common/ProductCard"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInfiniteProductsByCategory } from "@/hooks/data/useProducts"
import type { ProductsSortParam } from "@/lib/api/products"
import type { CategoryTreeNode, Product } from "@/types/product"
import { useEffect, useRef, useState } from "react"

const SORT_OPTIONS: { value: ProductsSortParam; label: string }[] = [
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
]

/** Subcategory page: title, sort dropdown, and grid of all products with infinite scroll. */
export function SubcategoryProductGrid({
  sub,
  onAddToCart,
}: {
  sub: CategoryTreeNode
  onAddToCart?: (product: Product) => void
}) {
  const [sort, setSort] = useState<ProductsSortParam | "">("")
  const sortParam = sort || undefined
  const {
    products,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProductsByCategory(sub.id, sortParam)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage()
      },
      { rootMargin: "100px", threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <section className="w-full space-y-4">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full space-y-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {sub.title}
        </h1>
        <p className="py-12 text-center text-destructive">
          Failed to load products. Please try again.
        </p>
      </section>
    )
  }

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {sub.title}
        </h1>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-subcategory" className="text-sm text-muted-foreground">
            Sort by:
          </label>
          <Select
            value={sort || "none"}
            onValueChange={(v) => setSort(v === "none" ? "" : (v as ProductsSortParam))}
          >
            <SelectTrigger id="sort-subcategory" className="w-[180px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select an option</SelectItem>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {products.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No products in this category yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
          <div ref={loadMoreRef} className="flex justify-center py-6">
            {hasNextPage && (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
