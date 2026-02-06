"use client"

import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductInfo } from "@/components/product/ProductInfo"
import { ProductTabs } from "@/components/product/ProductTabs"
import { RatingReviews } from "@/components/product/RatingReviews"
import { RelatedProductsCarousel } from "@/components/product/RelatedProductsCarousel"
import { useCategory } from "@/hooks/data/useCategory"
import {
  getFrequentlyBoughtTogether,
  getPreviouslyViewed,
  getSimilarProducts,
  useProductBySlug,
  useProducts,
} from "@/hooks/data/useProducts"
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
import { use } from "react"

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const product = useProductBySlug(slug)
  const categories = useCategory()
  const allProducts = useProducts()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const handleAddToCart = (p: Product) => {
    addItem(p)
    openCart()
  }

  if (!product) notFound()

  const category = categories.find((c) => c.id === product.categoryId)
  const categoryHref = category?.viewAllHref ?? `/category/${product.categoryId}`

  const similarProducts = getSimilarProducts(product, allProducts, 8)
  const moreFromBrand = product.brand
    ? allProducts
      .filter(
        (p) =>
          p.brand === product.brand &&
          p.id !== product.id
      )
      .slice(0, 8)
    : similarProducts.slice(0, 8)
  const frequentlyBought = getFrequentlyBoughtTogether(product, allProducts, 6)
  const previouslyViewed = getPreviouslyViewed(slug, allProducts, 6)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {category && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={categoryHref}>{category.title}</Link>
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

      {/* Hero: Gallery + Info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductInfo product={product} onAddToCart={handleAddToCart} />
      </div>

      {/* Product Details & Specification tabs */}
      <section className="rounded-xl border bg-card p-6">
        <ProductTabs product={product} />
      </section>

      {/* Rating & Reviews */}
      <RatingReviews product={product} />

      {/* Related sections */}
      <div className="space-y-0">
        <RelatedProductsCarousel
          title="Similar Products"
          products={similarProducts}
          viewAllHref={categoryHref}
          onAddToCart={handleAddToCart}
        />
        <RelatedProductsCarousel
          title={product.brand ? `More From ${product.brand}` : "More in this category"}
          products={moreFromBrand}
          viewAllHref={product.brandHref ?? categoryHref}
          onAddToCart={handleAddToCart}
        />
        <RelatedProductsCarousel
          title="Frequently Bought Together"
          products={frequentlyBought}
          onAddToCart={handleAddToCart}
        />
        <RelatedProductsCarousel
          title="Previously Viewed Items"
          products={previouslyViewed}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  )
}
