"use client"

import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import { EspeciallyForYouSection } from "@/components/common/EspeciallyForYouSection"
import { HeroBannerSlider } from "@/components/common/HeroBannerSlider"
import { useCategory } from "@/hooks/data/useCategory"
import { useProducts } from "@/hooks/data/useProducts"
import { useCartStore } from "@/store/cart-store"
import type { Product } from "@/types/product"

const SECTION_BG_CLASSES = [
  "bg-info-light/10 dark:bg-info-dark/20",
  "bg-danger-light/10 dark:bg-danger-dark/20",
  "bg-warning-light/10 dark:bg-warning-dark/20",
  "bg-success-light/10 dark:bg-success-dark/20",
  "bg-primary-light/10 dark:bg-primary-dark/20",
  "bg-muted-light/10 dark:bg-muted-dark/20",
]

export default function Home() {
  const productCategories = useCategory()
  const products = useProducts()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const handleAddToCart = (product: Product) => {
    addItem(product)
    openCart()
  }

  const productsByCategoryId = products.reduce<Record<string, typeof products>>(
    (acc, product) => {
      const id = product.categoryId
      if (!acc[id]) acc[id] = []
      acc[id].push(product)
      return acc
    },
    {}
  )

  return (
    <div className="w-full">
      <HeroBannerSlider />

      <EspeciallyForYouSection />

      {productCategories.map((category, index) => (
        <CategoryProductSection
          key={category.id}
          title={category.title}
          products={productsByCategoryId[category.id] ?? []}
          viewAllHref={category.viewAllHref}
          sectionBgClassName={SECTION_BG_CLASSES[index % SECTION_BG_CLASSES.length]}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  )
}
