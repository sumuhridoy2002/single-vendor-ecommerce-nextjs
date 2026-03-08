/** Single review as returned in product details recent_reviews or submit response. */
export interface ProductReviewApi {
  id: number
  rating: number
  comment: string
  user_name: string
  user_avatar: string | null
  created_at: string
}

/** Request body for POST /products/{id}/review */
export interface SubmitReviewRequestBody {
  rating: number
  comment: string
}

/** Response from POST /products/{id}/review */
export interface SubmitReviewApiResponse {
  data: ProductReviewApi
  status: number
  message: string
}

/** Meta block for product/category/brand SEO. */
export interface ProductDetailsMetaApi {
  title: string
  keywords: string
  description: string
}

/** Category as returned by /products/{id}. */
export interface ProductDetailsCategoryApi {
  id: number
  name: string
  slug: string
  description: string | null
  image: string
  banner: string | null
  meta: ProductDetailsMetaApi
}

/** Brand as returned by /products/{id}. */
export interface ProductDetailsBrandApi {
  id: number
  name: string
  slug: string
  description: string | null
  image: string
  banner: string | null
  meta: ProductDetailsMetaApi
}

/** Flash sale block on product details. */
export interface ProductDetailsFlashSaleApi {
  is_active: boolean
  discount: number
  type: string
  flash_final_price: number
}

/** Single variation as returned by GET /products/{slug}. */
export interface ProductVariationApi {
  id: number
  type: string
  value: string
  image?: string
}

/** Single product as returned by GET /products/{id} (data object). */
export interface ProductDetailsApi {
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
  thumbnail: string
  gallery: string[]
  category: ProductDetailsCategoryApi
  brand: ProductDetailsBrandApi
  variations: ProductVariationApi[]
  flash_sale: ProductDetailsFlashSaleApi
  status: boolean
  recent_reviews: ProductReviewApi[]
  meta: ProductDetailsMetaApi
}

export interface ProductDetailsApiResponse {
  data: ProductDetailsApi
  status: number
  message: string
}

/** Product item as returned by GET /products/{id}/related (no category/brand). */
export interface RelatedProductItemApi {
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
  thumbnail: string
  gallery: string[]
  flash_sale: ProductDetailsFlashSaleApi
  status: boolean
  meta: ProductDetailsMetaApi
}

export interface RelatedProductsApiResponse {
  data: RelatedProductItemApi[]
  status: number
  message: string
}

/** Product list item as returned by GET /products (search/filter). */
export interface ProductListItemApi {
  id: number
  title: string
  slug: string
  base_price: number
  final_price: number
  reviews_count: number
  thumbnail: string
  gallery?: string[]
  short_description?: string
  is_in_stock: boolean
  flash_sale: ProductDetailsFlashSaleApi
  category?: { id: number; name?: string; slug?: string } | null
  brand?: { id: number; name: string; slug: string } | null
}

export interface ProductsListApiResponse {
  data: ProductListItemApi[]
  status: number
  message: string
}

/** Pagination links from GET /products (paginated). */
export interface ProductsPaginatedLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

/** Pagination meta from GET /products (paginated). */
export interface ProductsPaginatedMetaLink {
  url: string | null
  label: string
  active: boolean
}

export interface ProductsPaginatedMeta {
  current_page: number
  from: number | null
  last_page: number
  links: ProductsPaginatedMetaLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

/** Full paginated response from GET /products?category_id=&page=. */
export interface ProductsPaginatedResponse {
  data: ProductListItemApi[]
  links: ProductsPaginatedLinks
  meta: ProductsPaginatedMeta
  status: number
  message: string
}
