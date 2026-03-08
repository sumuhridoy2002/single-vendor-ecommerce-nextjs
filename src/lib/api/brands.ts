import type {
  BrandApi,
  BrandDetailApiResponse,
  BrandDetailDataApi,
  BrandsApiResponse,
} from "@/types/brand"
import { getBaseUrl } from "./client"

function normalizeImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  const origin = new URL(getBaseUrl()).origin
  return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`
}

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
    image: normalizeImageUrl((b as { logo?: string }).logo ?? b.image),
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
  const imageUrl = normalizeImageUrl(rawImage)
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
