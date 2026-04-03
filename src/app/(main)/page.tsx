"use client"

import { useCallback, useMemo } from "react"
import dynamic from "next/dynamic"
import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import { HeroBannerSlider } from "@/components/common/HeroBannerSlider"

const CampaignsSection = dynamic(
  () => import("@/components/common/CampaignsSection").then((m) => m.CampaignsSection),
  { ssr: false }
)
const EspeciallyForYouSection = dynamic(
  () => import("@/components/common/EspeciallyForYouSection").then((m) => m.EspeciallyForYouSection),
  { ssr: false }
)
import { useHomepage } from "@/hooks/data/useHomepage"
import { useHasMounted } from "@/hooks/useHasMounted"
import { useCartStore } from "@/store/cart-store"
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn"
import type { AddToCartOptions, Product } from "@/types/product"
import { toast } from "sonner"

const SECTION_BG_CLASSES = [
  "bg-info-light/10 dark:bg-info-dark/20",
  "bg-danger-light/10 dark:bg-danger-dark/20",
  "bg-warning-light/10 dark:bg-warning-dark/20",
  "bg-success-light/10 dark:bg-success-dark/20",
]

export default function Home() {
  const { data, isLoading, error } = useHomepage()
  const hasMounted = useHasMounted()
  const addItem = useCartStore((s) => s.addItem)
  const whenLoggedIn = useWhenLoggedIn()
  const handleAddToCart = useCallback(
    (product: Product, options?: AddToCartOptions) => {
      whenLoggedIn(() => {
        addItem(product, 1, options).catch((e) =>
          toast.error(e?.message ?? "Failed to add to cart")
        )
      })
    },
    [whenLoggedIn, addItem]
  )

  const sections = useMemo(
    () =>
      data
        ? [
            { title: "New Arrivals", products: data.newArrivals, viewAllHref: "/category/new-arrivals" },
            { title: "Popular", products: data.popular, viewAllHref: "/category/popular" },
            { title: "Discounted", products: data.discounted, viewAllHref: "/search?q=discount" },
            { title: "Flash Sale", products: data.flashSale, viewAllHref: "/flash-sale" },
          ]
        : [],
    [data]
  )

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">
        <p>{error.message}</p>
      </div>
    )
  }

  if (!hasMounted || isLoading || !data) {
    return (
      <div className="w-full">
        <HeroBannerSlider />
        <CampaignsSection />
        <EspeciallyForYouSection />
        <div className="container py-8">
          <div className="h-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <HeroBannerSlider />
      <CampaignsSection />
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
