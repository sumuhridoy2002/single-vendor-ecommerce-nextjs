"use client"

import { Disclaimer } from "@/components/product/Disclaimer"
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
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"

const SECTION_BG_CLASSES = [
  "bg-pink-50/60 dark:bg-pink-950/20",
  "bg-sky-50/60 dark:bg-sky-950/20",
  "bg-amber-50/60 dark:bg-amber-950/20",
  "bg-rose-50/60 dark:bg-rose-950/20",
]

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const product = useProductBySlug(slug)
  const categories = useCategory()
  const allProducts = useProducts()

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
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-foreground hover:underline">
          Home
        </Link>
        <ChevronRight className="size-4 shrink-0" aria-hidden />
        {category && (
          <>
            <Link
              href={categoryHref}
              className="hover:text-foreground hover:underline"
            >
              {category.title}
            </Link>
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          </>
        )}
        <span className="truncate text-foreground" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* Hero: Gallery + Info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
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
          sectionBgClassName={SECTION_BG_CLASSES[0]}
        />
        <RelatedProductsCarousel
          title={product.brand ? `More From ${product.brand}` : "More in this category"}
          products={moreFromBrand}
          viewAllHref={product.brandHref ?? categoryHref}
          sectionBgClassName={SECTION_BG_CLASSES[1]}
        />
        <RelatedProductsCarousel
          title="Frequently Bought Together"
          products={frequentlyBought}
          sectionBgClassName={SECTION_BG_CLASSES[2]}
        />
        <RelatedProductsCarousel
          title="Previously Viewed Items"
          products={previouslyViewed}
          sectionBgClassName={SECTION_BG_CLASSES[3]}
        />
      </div>

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  )
}
