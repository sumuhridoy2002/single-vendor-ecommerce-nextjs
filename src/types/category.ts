/** Meta block for category SEO. */
export interface CategoryMetaApi {
  title: string
  keywords: string
  description: string
}

/** Single category node from /categories API (recursive). */
export interface CategoryApiNode {
  id: number
  name: string
  slug: string
  image: string
  children: CategoryApiNode[]
  description?: string | null
  banner?: string | null
  meta?: CategoryMetaApi
}

export interface CategoriesApiResponse {
  data: CategoryApiNode[]
  status: number
  message: string
}
