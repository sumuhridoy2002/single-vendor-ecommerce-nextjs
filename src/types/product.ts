export type ProductBadge = "new" | "sale" | "bestseller"

/** Passed from product cards / PDP when adding a specific variant to the cart. */
export interface AddToCartOptions {
  variationId?: number
}

/** Single review (mapped from API recent_reviews / submit response). */
export interface ProductReview {
  id: number
  rating: number
  comment: string
  user_name: string
  user_avatar: string | null
  created_at: string
  /** Optional review photo URL (from API `image`). */
  image?: string | null
  /** Optional reply from admin/store. */
  reply?: string | null
}

export interface Product {
  id: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice?: number
  discountPercent?: number
  badge?: ProductBadge
  rating?: number
  reviewCount?: number
  /** Recent reviews from product details (recent_reviews). */
  recentReviews?: ProductReview[]
  unit?: string
  categoryId: string
  categoryTitle?: string
  categoryHref?: string
  description?: string
  longDescription?: string
  images?: string[]
  brand?: string
  brandId?: string
  brandHref?: string
  inStock?: boolean
  stockQty?: number
  soldOutQty?: number
  wishlistCount?: number
  deliveryText?: string
  specification?: Record<string, string>
  /** From get-product-by-slug; used for size/color selectors. */
  variations?: { id: number; type: string; value: string; image?: string }[]
  /** When `campaign.is_active` on product details / list; sent as `campaign_id` on add-to-cart when in window. */
  campaignId?: number
  /** Campaign start from API (`campaign.from`), e.g. "2026-02-26 23:54:00". */
  campaignValidFrom?: string
  /** Campaign end from API (`campaign.to`). */
  campaignValidTo?: string
}

export interface ProductCategory {
  id: string
  title: string
  slug: string
  viewAllHref?: string
}

/** Navigation tree: main category with sub-categories (for category page / sidebar). */
export interface CategoryTreeNode {
  id: string
  title: string
  slug: string
  image?: string
  children?: CategoryTreeNode[]
}
