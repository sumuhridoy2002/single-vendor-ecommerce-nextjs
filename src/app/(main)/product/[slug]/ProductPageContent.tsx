"use client"

import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductInfo } from "@/components/product/ProductInfo"
import { ProductTabs } from "@/components/product/ProductTabs"
import { RelatedProductsCarousel } from "@/components/product/RelatedProductsCarousel"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useProductDetails } from "@/hooks/data/useProductDetails"
import { useRelatedProducts } from "@/hooks/data/useRelatedProducts"
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn"
import { useCartStore } from "@/store/cart-store"
import type { Product } from "@/types/product"
import Link from "next/link"
import { notFound } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export interface ProductPageContentProps {
  slug: string
  initialProduct?: Product | null
}

export function ProductPageContent({
  slug,
  initialProduct,
}: ProductPageContentProps) {
  const { product, isLoading, error, refetch } = useProductDetails(slug, initialProduct)
  const [selectedVariantImage, setSelectedVariantImage] = useState<string | undefined>(
    undefined
  )
  const { products: relatedProducts } = useRelatedProducts(product?.id)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const whenLoggedIn = useWhenLoggedIn()
  const handleAddToCart = (
    p: Product,
    quantity = 1,
    options?: { variationId?: number }
  ) => {
    whenLoggedIn(() => {
      if (p.inStock === false || (p.stockQty != null && p.stockQty <= 0)) {
        toast.error("This product is currently out of stock")
        return
      }

      if (p.stockQty != null && quantity > p.stockQty) {
        toast.error(`You can add up to ${p.stockQty} item(s) for this product`)
        return
      }

      addItem(p, quantity, options)
        .then(() => openCart())
        .catch((e) => toast.error(e?.message ?? "Failed to add to cart"))
    })
  }

  if (error) notFound()
  if (isLoading || !product) {
    return (
      <div className="container space-y-8 py-6">
        <div className="h-6 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  const categoryHref = product.categoryHref
  const categoryTitle = product.categoryTitle

  return (
    <div className="container space-y-8 min-w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {categoryTitle && categoryHref && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={categoryHref}>{categoryTitle}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 lg:gap-8 xl:gap-32">
        <ProductGallery
          product={product}
          variantImage={selectedVariantImage}
          onVariantImageChange={setSelectedVariantImage}
        />
        <ProductInfo
          product={product}
          onAddToCart={handleAddToCart}
          onVariantImageChange={setSelectedVariantImage}
        />
      </div>

      <section className="rounded-xl border bg-card p-6">
        <ProductTabs product={product} onReviewSubmitted={refetch} />
      </section>

      <div className="space-y-0">
        {relatedProducts.length > 0 && (
          <RelatedProductsCarousel
            title="Related Products"
            products={relatedProducts}
            viewAllHref={categoryHref ?? undefined}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  )
}
