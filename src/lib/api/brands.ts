import type {
  BrandApi,
  BrandDetailApiResponse,
  BrandDetailDataApi,
  BrandDetailProductApi,
  BrandsApiResponse,
} from "@/types/brand"
import type { Product } from "@/types/product"
import { getBaseUrl } from "./client"

function normalizeImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  const origin = new URL(getBaseUrl()).origin
  return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`
}

function mapBrandDetailProductToProduct(api: BrandDetailProductApi): Product {
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
    brand: api.brand?.name,
    brandId: api.brand?.id != null ? String(api.brand.id) : undefined,
    brandHref: api.brand?.slug ? `/brand/${api.brand.id}` : undefined,
    inStock: api.is_in_stock,
  }
}

export async function fetchBrands(): Promise<BrandApi[]> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/brands`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Brands fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as BrandsApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load brands")
  }

  return json.data.map((b) => ({
    ...b,
    image: normalizeImageUrl((b as { logo?: string }).logo ?? b.image),
  }))
}

export interface BrandDetailResult {
  brand: BrandApi
  products: Product[]
}

export async function fetchBrandById(
  id: string | number
): Promise<BrandDetailResult> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/brands/${id}`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Brand fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as BrandDetailApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load brand")
  }

  const data = json.data as BrandDetailDataApi
  const rawImage = (data as { logo?: string }).logo ?? data.image
  const imageUrl = normalizeImageUrl(rawImage)
  const brand: BrandApi = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    image: imageUrl,
    description: data.description,
    banner: data.banner,
  }
  const products: Product[] = (data.products ?? []).map(
    mapBrandDetailProductToProduct
  )

  return { brand, products }
}
