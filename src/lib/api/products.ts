import type { Product } from "@/types/product"
import type {
  ProductDetailsApi,
  ProductDetailsApiResponse,
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
  category?: { id: number; slug: string } | null
  brand?: { name: string; slug: string } | null
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
