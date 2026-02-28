import type {
  CategoriesApiResponse,
  CategoryApiNode,
} from "@/types/category"
import { getBaseUrl } from "./client"

export async function fetchCategories(): Promise<CategoryApiNode[]> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/categories`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Categories fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as CategoriesApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load categories")
  }

  return json.data
}
