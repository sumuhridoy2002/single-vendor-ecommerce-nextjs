"use client"

import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import { EspeciallyForYouSection } from "@/components/common/EspeciallyForYouSection"
import { HeroBannerSlider } from "@/components/common/HeroBannerSlider"
import { useHomepage } from "@/hooks/data/useHomepage"
import { useCartStore } from "@/store/cart-store"
import type { Product } from "@/types/product"

const SECTION_BG_CLASSES = [
  "bg-info-light/10 dark:bg-info-dark/20",
  "bg-danger-light/10 dark:bg-danger-dark/20",
  "bg-warning-light/10 dark:bg-warning-dark/20",
  "bg-success-light/10 dark:bg-success-dark/20",
]

export default function Home() {
  const { data, isLoading, error } = useHomepage()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const handleAddToCart = (product: Product) => {
    addItem(product)
    openCart()
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">
        <p>{error.message}</p>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="w-full">
        <HeroBannerSlider />
        <EspeciallyForYouSection />
        <div className="container py-8">
          <div className="h-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  const sections = [
    { title: "New Arrivals", products: data.newArrivals, viewAllHref: "/category/new-arrivals" },
    { title: "Popular", products: data.popular, viewAllHref: "/category/popular" },
    { title: "Discounted", products: data.discounted, viewAllHref: "/search?q=discount" },
    { title: "Flash Sale", products: data.flashSale, viewAllHref: "/flash-sale" },
  ]

  return (
    <div className="w-full">
      <HeroBannerSlider />
      <EspeciallyForYouSection />
      {sections.map((section, index) => (
        <CategoryProductSection
          key={section.title}
          title={section.title}
          products={section.products}
          viewAllHref={section.viewAllHref}
          sectionBgClassName={SECTION_BG_CLASSES[index % SECTION_BG_CLASSES.length]}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}
