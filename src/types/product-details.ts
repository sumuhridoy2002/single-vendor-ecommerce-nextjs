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
  variations: unknown[]
  flash_sale: ProductDetailsFlashSaleApi
  status: boolean
  recent_reviews: unknown[]
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
