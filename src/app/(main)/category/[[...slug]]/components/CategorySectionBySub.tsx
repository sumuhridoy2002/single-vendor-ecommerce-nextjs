"use client"

import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import { useInfiniteProductsByCategory } from "@/hooks/data/useProducts"
import type { AddToCartOptions, CategoryTreeNode, Product } from "@/types/product"

export function CategorySectionBySub({
  sub,
  parentPathSlug,
  sectionBgClassName,
  onAddToCart,
}: {
  sub: CategoryTreeNode
  parentPathSlug: string
  sectionBgClassName: string
  onAddToCart?: (product: Product, options?: AddToCartOptions) => void
}) {
  const { data } = useInfiniteProductsByCategory(sub.id)
  const products = data?.pages[0]?.products ?? []

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
