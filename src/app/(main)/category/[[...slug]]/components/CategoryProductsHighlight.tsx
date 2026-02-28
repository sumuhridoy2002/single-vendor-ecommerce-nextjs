"use client"

import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import type { ResolvedCategory } from "@/hooks/data/useCategoryTree"
import { getCategoryIdsForMain } from "@/hooks/data/useCategoryTree"
import { useProductsByCategory } from "@/hooks/data/useProducts"
import type { Product } from "@/types/product"

/** Top product section for current category (main page only; same style as home page). */
export function CategoryProductsHighlight({
  resolved,
  sectionBgClassName,
  onAddToCart,
}: {
  resolved: ResolvedCategory
  sectionBgClassName: string
  onAddToCart?: (product: Product) => void
}) {
  const { main, type, current, path } = resolved
  const categoryIds = type === "sub" ? current.id : getCategoryIdsForMain(main)
  const products = useProductsByCategory(categoryIds)
  const title = type === "sub" ? current.title : `Products in ${main.title}`
  const viewAllHref =
    type === "sub"
      ? `/category/${path.map((p) => p.slug).join("/")}`
      : `/category/${main.slug}`

  return (
    <CategoryProductSection
      title={title}
      products={products}
      viewAllHref={viewAllHref}
      sectionBgClassName={sectionBgClassName}
      onAddToCart={onAddToCart}
    />
  )
}
