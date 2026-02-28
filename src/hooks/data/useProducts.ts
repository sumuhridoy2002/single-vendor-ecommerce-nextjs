import type { Product } from "@/types/product"

export function useProducts(): Product[] {
  return []
}

/** Products for a category page: pass single id (sub) or array of ids (main = all children). */
export function useProductsByCategory(categoryIds: string | string[]): Product[] {
  const products = useProducts()
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds]
  return products.filter((p) => ids.includes(p.categoryId))
}

export function useProductBySlug(_slug: string): Product | null {
  return null
}

export function getSimilarProducts(
  _product: Product,
  allProducts: Product[],
  limit = 8
): Product[] {
  return allProducts.slice(0, limit)
}

export function getFrequentlyBoughtTogether(
  _product: Product,
  allProducts: Product[],
  limit = 6
): Product[] {
  return allProducts.slice(0, limit)
}

export function getPreviouslyViewed(
  _currentSlug: string,
  allProducts: Product[],
  limit = 6
): Product[] {
  return allProducts.slice(0, limit)
}
