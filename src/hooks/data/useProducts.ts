import { fetchProductsByCategoryPaginated, fetchProductsByBrandPaginated } from "@/lib/api/products"
import type { ProductsSortParam } from "@/lib/api/products"
import { globalQueryKeys } from "@/lib/query-keys"
import type { Product } from "@/types/product"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export function useProducts(): Product[] {
  return []
}

/** Products for a category page: pass single id (sub) or array of ids (main = all children). */
export function useProductsByCategory(categoryIds: string | string[]): Product[] {
  const products = useProducts()
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds]
  return products.filter((p) => ids.includes(p.categoryId))
}

/** Infinite pagination for products by category_id (category or subcategory). */
export function useInfiniteProductsByCategory(
  categoryId: string,
  sort?: ProductsSortParam
) {
  const query = useInfiniteQuery({
    queryKey: globalQueryKeys.productsByCategory(categoryId).concat(
      sort ?? ("no-sort" as const)
    ),
    queryFn: ({ pageParam }) =>
      fetchProductsByCategoryPaginated(categoryId, pageParam as number, sort),
    initialPageParam: 1 as number,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta
      return current_page < last_page ? current_page + 1 : undefined
    },
  })

  const products = useMemo(
    () => query.data?.pages.flatMap((p) => p.products) ?? [],
    [query.data]
  )

  return {
    ...query,
    products,
  }
}

/** Infinite pagination for products by brand_id. */
export function useInfiniteProductsByBrand(
  brandId: string | number,
  sort?: ProductsSortParam
) {
  const query = useInfiniteQuery({
    queryKey: globalQueryKeys.productsByBrand(brandId).concat(
      sort ?? ("no-sort" as const)
    ),
    queryFn: ({ pageParam }) =>
      fetchProductsByBrandPaginated(brandId, pageParam as number, sort),
    initialPageParam: 1 as number,
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta
      return current_page < last_page ? current_page + 1 : undefined
    },
  })

  const products = useMemo(
    () => query.data?.pages.flatMap((p) => p.products) ?? [],
    [query.data]
  )

  return {
    ...query,
    products,
  }
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
