import type { Product } from "@/types/product"
import type {
  ProductDetailsApi,
  ProductDetailsApiResponse,
  ProductListItemApi,
  ProductsListApiResponse,
  ProductsPaginatedResponse,
  RelatedProductItemApi,
  RelatedProductsApiResponse,
} from "@/types/product-details"
import { getBaseUrl } from "./client"

/** Map a product API object (full or related) to app Product type. */
function mapProductApiToProduct(api: {
  id: number
  title: string
  slug: string
  base_price: number
  final_price: number
  reviews_count: number
  thumbnail: string
  gallery?: string[]
  short_description?: string
  long_description?: string
  is_in_stock: boolean
  flash_sale: { is_active: boolean; flash_final_price: number }
  category?: { id: number; slug?: string } | null
  brand?: { id?: number; name: string; slug: string } | null
}): Product {
  const price =
    api.flash_sale?.is_active === true
      ? api.flash_sale.flash_final_price
      : api.final_price
  const originalPrice = api.base_price > price ? api.base_price : undefined
  const discountPercent =
    originalPrice != null && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined
  let badge: Product["badge"] | undefined
  if (api.flash_sale?.is_active) badge = "sale"
  else if (discountPercent != null && discountPercent > 0) badge = "sale"

  return {
    id: String(api.id),
    name: api.title,
    slug: api.slug,
    image: api.thumbnail,
    price,
    originalPrice,
    discountPercent,
    badge,
    rating: undefined,
    reviewCount: api.reviews_count,
    categoryId: api.category ? String(api.category.id) : "",
    description: api.short_description || undefined,
    longDescription: api.long_description || undefined,
    images:
      api.gallery && api.gallery.length > 0
        ? [api.thumbnail, ...api.gallery]
        : [api.thumbnail],
    brand: api.brand?.name,
    brandId: api.brand?.id != null ? String(api.brand.id) : undefined,
    brandHref: api.brand?.slug ? `/brand/${api.brand.slug}` : undefined,
    inStock: api.is_in_stock,
    specification: {},
  }
}

/** Map /products/{id} API response to app Product type. */
export function mapProductDetailsToProduct(api: ProductDetailsApi): Product {
  return mapProductApiToProduct(api)
}

export async function fetchProductById(
  id: string | number
): Promise<ProductDetailsApi> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/products/${id}`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    if (res.status === 404) throw new Error("Product not found")
    throw new Error(`Product fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as ProductDetailsApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load product")
  }

  return json.data
}

export function mapRelatedProductToProduct(api: RelatedProductItemApi): Product {
  return mapProductApiToProduct(api)
}

export async function fetchRelatedProducts(
  productId: string | number
): Promise<Product[]> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/products/${productId}/related`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    if (res.status === 404) return []
    throw new Error(`Related products fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as RelatedProductsApiResponse
  if (json.status !== 200 || !Array.isArray(json.data)) {
    return []
  }

  return json.data.map(mapRelatedProductToProduct)
}

/** Sort values supported by GET /products API. */
export type ProductsSortParam = "price_low" | "price_high" | "latest" | "popular"

export interface FetchProductsParams {
  search?: string
  category_id?: string | number
  brand_id?: string | number
  min_price?: number
  max_price?: number
  sort?: ProductsSortParam
}

function mapProductListItemToProduct(api: ProductListItemApi): Product {
  return mapProductApiToProduct(api)
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<Product[]> {
  const baseUrl = getBaseUrl()
  const searchParams = new URLSearchParams()
  if (params.search?.trim()) searchParams.set("search", params.search.trim())
  if (params.category_id != null) searchParams.set("category_id", String(params.category_id))
  if (params.brand_id != null) searchParams.set("brand_id", String(params.brand_id))
  if (params.min_price != null) searchParams.set("min_price", String(params.min_price))
  if (params.max_price != null) searchParams.set("max_price", String(params.max_price))
  if (params.sort) searchParams.set("sort", params.sort)

  const url = `${baseUrl}/products?${searchParams.toString()}`
  const res = await fetch(url, { headers: { Accept: "application/json" } })

  if (!res.ok) {
    if (res.status === 404) return []
    throw new Error(`Products fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as ProductsListApiResponse
  if (json.status !== 200 || !Array.isArray(json.data)) {
    return []
  }

  return json.data.map(mapProductListItemToProduct)
}

export interface FetchProductsByCategoryPaginatedResult {
  products: Product[]
  meta: ProductsPaginatedResponse["meta"]
  links: ProductsPaginatedResponse["links"]
}

export async function fetchProductsByCategoryPaginated(
  categoryId: string | number,
  page = 1,
  sort?: ProductsSortParam
): Promise<FetchProductsByCategoryPaginatedResult> {
  const baseUrl = getBaseUrl()
  const searchParams = new URLSearchParams()
  searchParams.set("category_id", String(categoryId))
  if (page > 1) searchParams.set("page", String(page))
  if (sort) searchParams.set("sort", sort)

  const url = `${baseUrl}/products?${searchParams.toString()}`
  const res = await fetch(url, { headers: { Accept: "application/json" } })

  if (!res.ok) {
    if (res.status === 404) {
      return {
        products: [],
        meta: {
          current_page: 1,
          from: null,
          last_page: 1,
          links: [],
          path: `${baseUrl}/products`,
          per_page: 10,
          to: null,
          total: 0,
        },
        links: {
          first: url,
          last: url,
          prev: null,
          next: null,
        },
      }
    }
    throw new Error(`Products fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as ProductsPaginatedResponse
  if (json.status !== 200 || !Array.isArray(json.data)) {
    return {
      products: [],
      meta: json.meta,
      links: json.links,
    }
  }

  const products = json.data.map(mapProductListItemToProduct)
  return {
    products,
    meta: json.meta,
    links: json.links,
  }
}
