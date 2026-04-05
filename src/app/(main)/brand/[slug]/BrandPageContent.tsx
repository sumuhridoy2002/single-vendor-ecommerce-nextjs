"use client"

import { ProductCard } from "@/components/common/ProductCard"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInfiniteProductsByBrand } from "@/hooks/data/useProducts"
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn"
import type { ProductsSortParam } from "@/lib/api/products"
import { useCartStore } from "@/store/cart-store"
import type { BrandApi } from "@/types/brand"
import type { AddToCartOptions, Product } from "@/types/product"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const SORT_OPTIONS: { value: ProductsSortParam; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
]

export interface BrandPageContentProps {
  brand: BrandApi
}

export function BrandPageContent({ brand }: BrandPageContentProps) {
  const [sort, setSort] = useState<ProductsSortParam | "">("")
  const sortParam = sort || undefined
  const {
    products,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProductsByBrand(brand.id, sortParam)
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

  const addItem = useCartStore((s) => s.addItem)
  const whenLoggedIn = useWhenLoggedIn()
  const handleAddToCart = (p: Product, options?: AddToCartOptions) => {
    whenLoggedIn(() => {
      addItem(p, 1, options).catch((e) =>
        toast.error(e?.message ?? "Failed to add to cart")
      )
    })
  }

  return (
    <div className="container w-full space-y-6 xs:space-y-8 py-3 xs:py-6 min-w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">{brand.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="flex flex-col items-center gap-4 rounded-xl border border-border bg-muted/20 p-6 md:p-8">
        {brand.image ? (
          <div className="relative h-24 w-40 shrink-0 md:h-32 md:w-52">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              className="object-contain"
              sizes="208px"
              priority
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-24 w-40 items-center justify-center rounded-lg bg-muted text-3xl font-bold text-muted-foreground md:h-32 md:w-52">
            {brand.name.charAt(0)}
          </div>
        )}
        <h1 className="text-center text-2xl font-semibold text-foreground md:text-3xl">
          {brand.name}
        </h1>
        {brand.description && (
          <p className="max-w-2xl text-center text-muted-foreground">
            {brand.description}
          </p>
        )}
      </section>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            Products by {brand.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <Select
              value={sort || "none"}
              onValueChange={(v) =>
                setSort(v === "none" ? "" : (v as ProductsSortParam))
              }
            >
              <SelectTrigger className="w-[180px]" size="sm">
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

        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="py-12 text-center text-destructive">
            Failed to load products. Please try again.
          </p>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No products found for this brand.
          </p>
        )}

        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
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
      </div>
    </div>
  )
}
