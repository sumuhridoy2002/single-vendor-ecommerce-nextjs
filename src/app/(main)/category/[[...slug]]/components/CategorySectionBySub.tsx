"use client"

import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import { useProductsByCategory } from "@/hooks/data/useProducts"
import type { CategoryTreeNode, Product } from "@/types/product"

export function CategorySectionBySub({
  sub,
  parentPathSlug,
  sectionBgClassName,
  onAddToCart,
}: {
  sub: CategoryTreeNode
  parentPathSlug: string
  sectionBgClassName: string
  onAddToCart?: (product: Product) => void
}) {
  const products = useProductsByCategory(sub.id)
  return (
    <CategoryProductSection
      title={sub.title}
      products={products}
      viewAllHref={`/category/${parentPathSlug}/${sub.slug}`}
      sectionBgClassName={sectionBgClassName}
      onAddToCart={onAddToCart}
    />
  )
}
