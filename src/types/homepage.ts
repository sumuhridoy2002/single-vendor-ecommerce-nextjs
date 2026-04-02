/** Meta block used in category, brand, product API responses. */
import type { ProductReviewApi } from "@/types/product-details"

/** Meta block used in category, brand, product API responses. */
export interface MetaBlock {
  title: string
  keywords: string
  description: string
}

/** Category as returned by homepage/products API. */
export interface HomepageCategoryApi {
  id: number
  name: string
  slug: string
  description: string
  image: string
  banner: string
  meta: MetaBlock
}

/** Brand as returned by homepage/products API. */
export interface HomepageBrandApi {
  id: number
  name: string
  slug: string
  description: string
  image: string
  banner: string
  meta: MetaBlock
}

/** Flash sale block on a product. */
export interface FlashSaleBlock {
  is_active: boolean
  discount: number
  type: string
  flash_final_price: number
}

/** Single product as returned by /products/homepage API. */
export interface HomepageProductApi {
  id: number
  title: string
  slug: string
  sku: string
  short_description: string
  long_description: string
  base_price: number
  discount: number
  discount_type: string
  final_price: number
  stock: number
  is_in_stock: boolean
  view_count: number
  reviews_count: number
  recent_reviews?: ProductReviewApi[]
  thumbnail: string
  gallery: string[]
  category: HomepageCategoryApi
  brand: HomepageBrandApi
  flash_sale: FlashSaleBlock
  status: boolean
  meta: MetaBlock
}

/** Homepage API response data payload. */
export interface HomepageDataApi {
  new_arrivals: HomepageProductApi[]
  popular: HomepageProductApi[]
  discounted: HomepageProductApi[]
  flash_sale: HomepageProductApi[]
}

export interface HomepageApiResponse {
  status: number
  message: string
  data: HomepageDataApi
}
