export type ProductBadge = "new" | "sale" | "bestseller"

/** Single review (mapped from API recent_reviews / submit response). */
export interface ProductReview {
  id: number
  rating: number
  comment: string
  user_name: string
  user_avatar: string | null
  created_at: string
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
  description?: string
  longDescription?: string
  images?: string[]
  brand?: string
  brandId?: string
  brandHref?: string
  inStock?: boolean
  deliveryText?: string
  specification?: Record<string, string>
  /** From get-product-by-slug; used for size/color selectors. */
  variations?: { id: number; type: string; value: string; image?: string }[]
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
  children?: CategoryTreeNode[]
}
