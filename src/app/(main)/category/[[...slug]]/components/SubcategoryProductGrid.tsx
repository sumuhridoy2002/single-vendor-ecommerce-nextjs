"use client"

import { ProductCard } from "@/components/common/ProductCard"
import { useProductsByCategory } from "@/hooks/data/useProducts"
import type { CategoryTreeNode, Product } from "@/types/product"

/** Subcategory page: title, sort dropdown, and grid of all products. */
export function SubcategoryProductGrid({
  sub,
  onAddToCart,
}: {
  sub: CategoryTreeNode
  onAddToCart?: (product: Product) => void
}) {
  const products = useProductsByCategory(sub.id)

  return (
    <section className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {sub.title}
        </h1>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-subcategory" className="text-sm text-muted-foreground">
            Sort by:
          </label>
          <select
            id="sort-subcategory"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            defaultValue=""
          >
            <option value="">Select an option</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
      {products.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No products in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  )
}
