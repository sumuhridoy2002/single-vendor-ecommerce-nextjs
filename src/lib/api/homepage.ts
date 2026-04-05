import type {
  HomepageApiResponse,
  HomepageDataApi,
  HomepageProductApi,
} from "@/types/homepage"
import { getProductReviewSummary } from "@/lib/reviews"
import type { Product, ProductReview } from "@/types/product"
import { getBaseUrl, normalizeMediaUrl } from "./client"
import { mapProductReviewFromApi } from "./products"

/** Map API product to app Product type for sliders/cart. */
export function mapHomepageProductToProduct(api: HomepageProductApi): Product {
  const price =
    api.flash_sale?.is_active === true
      ? api.flash_sale.flash_final_price
      : api.final_price
  const originalPrice =
    api.base_price > price ? api.base_price : undefined
  const discountPercent =
    originalPrice != null && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined
  let badge: Product["badge"] | undefined
  if (api.flash_sale?.is_active) badge = "sale"
  else if (discountPercent != null && discountPercent > 0) badge = "sale"

  const recentReviews: ProductReview[] = Array.isArray(api.recent_reviews)
    ? api.recent_reviews.map(mapProductReviewFromApi)
    : []
  const reviewSummary = getProductReviewSummary(recentReviews, api.reviews_count)

  const variations =
    api.variations?.length && api.variations.length > 0
      ? api.variations.map((v) => ({
          id: v.id,
          type: v.type,
          value: v.value,
          image: v.image ? (normalizeMediaUrl(v.image) ?? v.image) : undefined,
        }))
      : undefined

  return {
    id: String(api.id),
    name: api.title,
    slug: api.slug,
    image: api.thumbnail,
    price,
    originalPrice,
    discountPercent,
    badge,
    rating: reviewSummary.averageRating,
    reviewCount: reviewSummary.reviewCount,
    recentReviews,
    categoryId: api.category ? String(api.category.id) : "",
    inStock: api.is_in_stock,
    ...(variations ? { variations } : {}),
  }
}

export async function fetchHomepage(): Promise<HomepageDataApi> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/products/homepage`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 900 },
  })

  if (!res.ok) {
    throw new Error(`Homepage fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as HomepageApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load homepage")
  }

  return json.data
}
