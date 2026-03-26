import type {
  BrandApi,
  BrandDetailApiResponse,
  BrandDetailDataApi,
  BrandsApiResponse,
} from "@/types/brand"
import { getBaseUrl, normalizeMediaUrl } from "./client"

export async function fetchBrands(): Promise<BrandApi[]> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/brands`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Brands fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as BrandsApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load brands")
  }

  return json.data.map((b) => ({
    ...b,
    image: normalizeMediaUrl((b as { logo?: string }).logo ?? b.image),
  }))
}

export interface BrandDetailResult {
  brand: BrandApi
}

export async function fetchBrandBySlug(
  slug: string
): Promise<BrandDetailResult> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/brands/${slug}`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Brand fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as BrandDetailApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load brand")
  }

  const data = json.data as BrandDetailDataApi
  const rawImage = (data as { logo?: string }).logo ?? data.image
  const imageUrl = normalizeMediaUrl(rawImage)
  const brand: BrandApi = {
    id: data.id,
    name: data.name,
    slug: data.slug,
    image: imageUrl,
    description: data.description,
    banner: data.banner,
    meta: data.meta ?? undefined,
  }

  return { brand }
}
