/** Single zone row from GET /delivery-zones (nested under district → city). */
export interface DeliveryZoneItem {
  id: number
  district: string
  city: string
  name: string
  charge: number
  delivery_time: string
}

/** GET /delivery-zones — district name → city name → zone rows. */
export type DeliveryZonesApiData = Record<string, Record<string, DeliveryZoneItem[]>>
