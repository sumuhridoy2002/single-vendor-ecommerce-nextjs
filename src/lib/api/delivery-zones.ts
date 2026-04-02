import type { DeliveryZonesApiData } from "@/types/delivery-zones"
import type { NestedSelectOption } from "@/components/ui/nested-select"
import { getBaseUrl } from "./client"

function asZonesData(value: unknown): DeliveryZonesApiData {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Invalid delivery zones response")
  }
  return value as DeliveryZonesApiData
}

/**
 * Fetch nested delivery zones (division → city → areas).
 * Backend may return either a raw map or `{ data, status }` like other endpoints.
 */
export async function fetchDeliveryZones(): Promise<DeliveryZonesApiData> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/delivery-zones`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Delivery zones fetch failed: ${res.status}`)
  }

  const json: unknown = await res.json()

  if (json && typeof json === "object" && "data" in json) {
    const wrapped = json as { data?: unknown; status?: number; message?: string }
    if (wrapped.status !== undefined && wrapped.status !== 200) {
      throw new Error(wrapped.message ?? "Failed to load delivery zones")
    }
    if (wrapped.data !== undefined) {
      return asZonesData(wrapped.data)
    }
  }

  return asZonesData(json)
}

function sortKeys<T extends Record<string, unknown>>(obj: T): (keyof T & string)[] {
  return Object.keys(obj).sort((a, b) => a.localeCompare(b)) as (keyof T & string)[]
}

/** Build NestedSelect tree: district → city → area (leaf value = zone id). */
export function deliveryZonesToNestedOptions(
  data: DeliveryZonesApiData
): NestedSelectOption[] {
  return sortKeys(data).map((district) => ({
    value: `d:${district}`,
    label: district,
    children: sortKeys(data[district]).map((city) => ({
      value: `d:${district}|c:${city}`,
      label: city,
      children: data[district][city].map((zone) => ({
        value: String(zone.id),
        label: zone.name,
      })),
    })),
  }))
}

/**
 * Resolve a NestedSelect path string for an existing address (city + area name from API).
 */
export function findDeliveryPathForAddress(
  data: DeliveryZonesApiData,
  city: string,
  area: string
): string | null {
  const cityTrim = city.trim()
  const areaTrim = area.trim()
  if (!cityTrim || !areaTrim) return null

  for (const district of sortKeys(data)) {
    const cities = data[district]
    const zones = cities[cityTrim]
    if (!zones?.length) continue
    const match = zones.find((z) => z.name === areaTrim)
    if (match) {
      return `${district} > ${cityTrim} > ${match.name}`
    }
  }
  return null
}
