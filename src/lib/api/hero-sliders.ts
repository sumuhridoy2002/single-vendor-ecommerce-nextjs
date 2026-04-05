import type {
  HeroSliderItem,
  HeroSlidersApiResponse,
} from "@/types/hero-slider"
import { getBaseUrl } from "./client"

export async function fetchHeroSliders(): Promise<HeroSliderItem[]> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/sliders`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 },
  })

  if (!res.ok) {
    throw new Error(`Hero sliders fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as HeroSlidersApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load hero sliders")
  }

  return json.data
}
