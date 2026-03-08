"use client"

import { CategoryProductSection } from "@/components/common/CategoryProductSection"
import type { ResolvedCategory } from "@/hooks/data/useCategoryTree"
import { useInfiniteProductsByCategory } from "@/hooks/data/useProducts"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"

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
  const { main } = resolved
  const {
    products,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteProductsByCategory(main.id)

  const title = `Products in ${main.title}`
  const viewAllHref = `/category/${main.slug}`

  if (isLoading) {
    return (
      <section className={`w-full min-w-full container py-6 md:py-8 ${sectionBgClassName}`}>
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-40 animate-pulse rounded bg-muted" />
      </section>
    )
  }

  if (error) {
    return (
      <section className={`w-full min-w-full container py-6 md:py-8 ${sectionBgClassName}`}>
        <p className="text-destructive">Failed to load products. Please try again.</p>
      </section>
    )
  }

  return (
    <>
      <CategoryProductSection
        title={title}
        products={products}
        viewAllHref={viewAllHref}
        sectionBgClassName={sectionBgClassName}
        onAddToCart={onAddToCart}
      />
      {hasNextPage && (
        <div className="flex justify-center pb-8">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </>
  )
}
