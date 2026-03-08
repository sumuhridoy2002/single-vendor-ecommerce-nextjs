/** Single brand from GET /brands or GET /brands/{slug} API. */
export interface BrandApi {
  id: number
  name: string
  slug: string
  image?: string | null
  description?: string | null
  banner?: string | null
  meta?: {
    title?: string | null
    keywords?: string | null
    description?: string | null
  } | null
}

export interface BrandsApiResponse {
  data: BrandApi[]
  status: number
  message?: string
}

/** Brand detail payload from GET /brands/{slug} (may include products and meta). */
export interface BrandDetailDataApi extends BrandApi {
  products?: BrandDetailProductApi[]
}

/** Product item as returned inside GET /brands/{id} response. */
export interface BrandDetailProductApi {
  id: number
  title: string
  slug: string
  thumbnail: string
  base_price: number
  final_price: number
  flash_sale?: { is_active: boolean; flash_final_price: number }
  category?: { id: number } | null
  brand?: { id?: number; name: string; slug: string } | null
  is_in_stock: boolean
  reviews_count: number
}

/** Response for GET /brands/{slug}. */
export interface BrandDetailApiResponse {
  data: BrandDetailDataApi
  status: number
  message?: string
}
