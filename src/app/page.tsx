"use client"

import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import { useCategory } from "@/hooks/data/useCategory"
import { useProducts } from "@/hooks/data/useProducts"

const SECTION_BG_CLASSES = [
  "bg-sky-50/60 dark:bg-sky-950/20",
  "bg-pink-50/60 dark:bg-pink-950/20",
  "bg-amber-50/60 dark:bg-amber-950/20",
  "bg-emerald-50/60 dark:bg-emerald-950/20",
  "bg-violet-50/60 dark:bg-violet-950/20",
  "bg-rose-50/60 dark:bg-rose-950/20",
]

export default function Home() {
  const categories = useCategory()
  const products = useProducts()

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
      {categories.map((category, index) => (
        <CategoryProductSection
          key={category.id}
          title={category.title}
          products={productsByCategoryId[category.id] ?? []}
          viewAllHref={category.viewAllHref}
          sectionBgClassName={SECTION_BG_CLASSES[index % SECTION_BG_CLASSES.length]}
        />
      ))}
    </div>
  )
}
