import { getProductReviewSummary } from "@/lib/reviews"
import type { Product, ProductReview } from "@/types/product"
import type {
  ProductDetailsApi,
  ProductDetailsApiResponse,
  ProductDetailsCampaignApi,
  ProductListItemApi,
  ProductReviewApi,
  ProductVariationApi,
  ProductsListApiResponse,
  ProductsPaginatedMeta,
  ProductsPaginatedResponse,
  RelatedProductItemApi,
  RelatedProductsApiResponse,
  SubmitReviewApiResponse,
  SubmitReviewPayload,
} from "@/types/product-details"
import { getBaseUrl, normalizeMediaUrl } from "./client"

const TOKEN_KEY = "access_token"

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

/** API sometimes omits `meta` on error or non-standard payloads — pagination code must not crash. */
function ensureProductsPaginatedMeta(
  meta: ProductsPaginatedResponse["meta"] | undefined,
  path: string
): ProductsPaginatedMeta {
  if (
    meta &&
    typeof meta.current_page === "number" &&
    typeof meta.last_page === "number"
  ) {
    return meta
  }
  return {
    current_page: 1,
    from: null,
    last_page: 1,
    links: [],
    path,
    per_page: 10,
    to: null,
    total: 0,
  }
}

function campaignFieldsFromApi(
  campaign: ProductDetailsCampaignApi | null | undefined
): Pick<Product, "campaignId" | "campaignValidFrom" | "campaignValidTo"> | undefined {
  if (campaign?.is_active !== true || campaign.campaign_id == null) return undefined
  return {
    campaignId: campaign.campaign_id,
    campaignValidFrom: campaign.from,
    campaignValidTo: campaign.to,
  }
}

/** Map API review to app model (normalizes `image` URL). */
export function mapProductReviewFromApi(r: ProductReviewApi): ProductReview {
  return {
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    user_name: r.user_name,
    user_avatar: r.user_avatar,
    created_at: r.created_at,
    image: r.image ? (normalizeMediaUrl(r.image) ?? r.image) : undefined,
    reply: r.reply ?? undefined,
  }
}

/** Map a product API object (full or related) to app Product type. */
function mapProductApiToProduct(api: {
  id: number
  title: string
  slug: string
  base_price: number
  final_price: number
  reviews_count: number
  recent_reviews?: ProductReviewApi[]
  thumbnail: string
  gallery?: string[]
  short_description?: string
  long_description?: string
  is_in_stock: boolean
  flash_sale: { is_active: boolean; flash_final_price: number }
  campaign?: ProductDetailsCampaignApi | null
  category?: { id: number; name?: string; slug?: string } | null
  brand?: { id?: number; name: string; slug: string } | null
  stock?: number
  stock_qty?: number
  sold_out_qty?: number
  wishlist_count?: number
  variations?: ProductVariationApi[]
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

  const campaign = campaignFieldsFromApi(api.campaign)
  const recentReviews = api.recent_reviews?.map(mapProductReviewFromApi)
  const reviewSummary = getProductReviewSummary(recentReviews, api.reviews_count)
  const thumbnail = normalizeMediaUrl(api.thumbnail) ?? api.thumbnail
  const gallery = api.gallery?.map((image) => normalizeMediaUrl(image) ?? image)
  const stockQty = api.stock_qty ?? api.stock
  const variations =
    api.variations?.length && api.variations.length > 0
      ? api.variations.map((v) => ({
        id: v.id,
        type: v.type,
        value: v.value,
        image: v.image,
      }))
      : undefined
  return {
    id: String(api.id),
    name: api.title,
    slug: api.slug,
    image: thumbnail,
    price,
    originalPrice,
    discountPercent,
    badge,
    rating: reviewSummary.averageRating,
    reviewCount: reviewSummary.reviewCount,
    recentReviews,
    categoryId: api.category ? String(api.category.id) : "",
    categoryTitle: api.category?.name,
    categoryHref: api.category?.slug ? `/category/${api.category.slug}` : undefined,
    description: api.short_description || undefined,
    longDescription: api.long_description || undefined,
    images: gallery && gallery.length > 0 ? [thumbnail, ...gallery] : [thumbnail],
    brand: api.brand?.name,
    brandId: api.brand?.id != null ? String(api.brand.id) : undefined,
    brandHref: api.brand?.slug ? `/brand/${api.brand.slug}` : undefined,
    inStock: api.is_in_stock,
    stockQty,
    soldOutQty: api.sold_out_qty,
    wishlistCount: api.wishlist_count,
    specification: {},
    ...(variations ? { variations } : {}),
    ...campaign,
  }
}

/** Map /products/{id} API response to app Product type. */
export function mapProductDetailsToProduct(api: ProductDetailsApi): Product {
  const base = mapProductApiToProduct(api)
  const variations =
    api.variations?.length > 0
      ? api.variations.map((v) => ({
        id: v.id,
        type: v.type,
        value: v.value,
        image: v.image,
      }))
      : undefined
  return { ...base, variations }
}

export async function fetchProductBySlug(
  slug: string
): Promise<ProductDetailsApi> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/products/${slug}`, {
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

/** Filters for GET /products?flash_sale=1&… */
export interface FlashSaleProductsParams {
  brand_id?: string | number
  category_id?: string | number
  min_price?: number
  max_price?: number
  sort?: ProductsSortParam
}

export function mapProductListItemToProduct(api: ProductListItemApi): Product {
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

export async function fetchProductsByBrandPaginated(
  brandId: string | number,
  page = 1,
  sort?: ProductsSortParam
): Promise<FetchProductsByCategoryPaginatedResult> {
  const baseUrl = getBaseUrl()
  const searchParams = new URLSearchParams()
  searchParams.set("brand_id", String(brandId))
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

/** GET /products?flash_sale=1&brand_id=&category_id=&min_price=&max_price=&sort=&page= */
export async function fetchFlashSaleProductsPaginated(
  page = 1,
  params: FlashSaleProductsParams = {}
): Promise<FetchProductsByCategoryPaginatedResult> {
  const baseUrl = getBaseUrl()
  const searchParams = new URLSearchParams()
  searchParams.set("flash_sale", "1")
  if (params.brand_id != null) searchParams.set("brand_id", String(params.brand_id))
  if (params.category_id != null) searchParams.set("category_id", String(params.category_id))
  if (params.min_price != null) searchParams.set("min_price", String(params.min_price))
  if (params.max_price != null) searchParams.set("max_price", String(params.max_price))
  if (params.sort) searchParams.set("sort", params.sort)
  if (page > 1) searchParams.set("page", String(page))

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
    throw new Error(`Flash sale products fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as ProductsPaginatedResponse
  const metaPath = `${baseUrl}/products`
  if (json.status !== 200 || !Array.isArray(json.data)) {
    return {
      products: [],
      meta: ensureProductsPaginatedMeta(json.meta, metaPath),
      links: json.links ?? {
        first: url,
        last: url,
        prev: null,
        next: null,
      },
    }
  }

  const products = json.data.map(mapProductListItemToProduct)
  return {
    products,
    meta: ensureProductsPaginatedMeta(json.meta, metaPath),
    links: json.links ?? {
      first: url,
      last: url,
      prev: null,
      next: null,
    },
  }
}

/** Fetch every page of flash sale products for the given API filters. */
export async function fetchAllFlashSaleProducts(
  params: FlashSaleProductsParams = {}
): Promise<Product[]> {
  const first = await fetchFlashSaleProductsPaginated(1, params)
  const all = [...first.products]
  const m = first.meta
  const lastPage = m.last_page >= 1 ? m.last_page : 1
  let page = m.current_page + 1
  while (page <= lastPage) {
    const next = await fetchFlashSaleProductsPaginated(page, params)
    all.push(...next.products)
    page += 1
  }
  return all
}

/** Submit a review for a product. POST /products/{id}/review (multipart/form-data: rating, comment, image?) */
export async function submitProductReview(
  productId: string | number,
  body: SubmitReviewPayload
): Promise<SubmitReviewApiResponse> {
  const baseUrl = getBaseUrl()
  const formData = new FormData()
  formData.append("rating", String(body.rating))
  formData.append("comment", body.comment)
  if (body.image) {
    formData.append("image", body.image)
  }
  const res = await fetch(`${baseUrl}/products/${productId}/review`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...getAuthHeaders(),
    },
    body: formData,
  })

  const json = (await res.json()) as SubmitReviewApiResponse & { message?: string }
  if (!res.ok) {
    throw new Error(json.message ?? `Submit review failed: ${res.status}`)
  }
  return json
}
