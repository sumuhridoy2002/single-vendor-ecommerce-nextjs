"use client"

import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductInfo } from "@/components/product/ProductInfo"
import { ProductTabs } from "@/components/product/ProductTabs"
import { RatingReviews } from "@/components/product/RatingReviews"
import { RelatedProductsCarousel } from "@/components/product/RelatedProductsCarousel"
import {
  getCategoryHrefById,
  getCategoryIdToTitleMap,
  useCategoryTree,
} from "@/hooks/data/useCategoryTree"
import { useProductDetails } from "@/hooks/data/useProductDetails"
import { useRelatedProducts } from "@/hooks/data/useRelatedProducts"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useCartStore } from "@/store/cart-store"
import type { Product } from "@/types/product"
import Link from "next/link"
import { notFound } from "next/navigation"

export interface ProductPageContentProps {
  id: string
  initialProduct?: Product | null
}

export function ProductPageContent({
  id,
  initialProduct,
}: ProductPageContentProps) {
  const { product, isLoading, error } = useProductDetails(id, initialProduct)
  const { products: relatedProducts } = useRelatedProducts(id)
  const tree = useCategoryTree()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const handleAddToCart = (p: Product) => {
    addItem(p)
    openCart()
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

  const categoryHref = getCategoryHrefById(tree, product.categoryId)
  const categoryTitle = getCategoryIdToTitleMap(tree)[product.categoryId]

  return (
    <div className="container space-y-8 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {categoryTitle && (
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductInfo product={product} onAddToCart={handleAddToCart} />
      </div>

      <section className="rounded-xl border bg-card p-6">
        <ProductTabs product={product} />
      </section>

      <RatingReviews product={product} />

      <div className="space-y-0">
        {relatedProducts.length > 0 && (
          <RelatedProductsCarousel
            title="Related Products"
            products={relatedProducts}
            viewAllHref={categoryHref}
            onAddToCart={handleAddToCart}
          />
        )}
      </div>
    </div>
  )
}
