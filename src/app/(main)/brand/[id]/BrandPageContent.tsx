"use client"

import { useMemo, useState } from "react"
import { ProductCard } from "@/components/common/ProductCard"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCartStore } from "@/store/cart-store"
import type { BrandApi } from "@/types/brand"
import type { Product } from "@/types/product"
import type { ProductsSortParam } from "@/lib/api/products"
import Image from "next/image"
import Link from "next/link"

const SORT_OPTIONS: { value: ProductsSortParam; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
]

export interface BrandPageContentProps {
  brand: BrandApi
  products: Product[]
}

export function BrandPageContent({ brand, products: initialProducts }: BrandPageContentProps) {
  const [sort, setSort] = useState<ProductsSortParam>("latest")
  const products = useMemo(() => {
    const list = [...initialProducts]
    switch (sort) {
      case "price_low":
        return list.sort((a, b) => a.price - b.price)
      case "price_high":
        return list.sort((a, b) => b.price - a.price)
      case "popular":
        return list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
      default:
        return list
    }
  }, [initialProducts, sort])
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const handleAddToCart = (p: Product) => {
    addItem(p)
    openCart()
  }

  return (
    <div className="container w-full space-y-8 py-6">
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
              value={sort}
              onValueChange={(v) => setSort(v as ProductsSortParam)}
            >
              <SelectTrigger className="w-[180px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {products.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No products found for this brand.
          </p>
        )}
        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
