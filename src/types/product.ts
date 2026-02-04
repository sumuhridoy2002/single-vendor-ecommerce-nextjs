export type ProductBadge = "new" | "sale" | "bestseller"

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
  unit?: string
  categoryId: string
  /** Product details page */
  description?: string
  images?: string[]
  brand?: string
  brandHref?: string
  inStock?: boolean
  deliveryText?: string
  specification?: Record<string, string>
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
