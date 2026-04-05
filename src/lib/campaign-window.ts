import type { Product } from "@/types/product"

/** Backend sends "YYYY-MM-DD HH:mm:ss" without timezone; treat as local. */
export function parseApiDateTime(value: string): Date | null {
  const normalized = value.trim().replace(" ", "T")
  const d = new Date(normalized)
  return Number.isNaN(d.getTime()) ? null : d
}

/** True when `now` is within [from, to] inclusive on both ends. */
export function isNowWithinCampaignWindow(
  from: string | undefined,
  to: string | undefined,
  now: Date = new Date()
): boolean {
  if (!from?.trim() || !to?.trim()) return false
  const start = parseApiDateTime(from)
  const end = parseApiDateTime(to)
  if (!start || !end) return false
  return now.getTime() >= start.getTime() && now.getTime() <= end.getTime()
}

/** `campaign_id` for cart only when id exists and current time is inside the campaign window. */
export function getEffectiveCampaignIdForCart(product: Product): number | undefined {
  if (product.campaignId == null) return undefined
  if (!isNowWithinCampaignWindow(product.campaignValidFrom, product.campaignValidTo)) {
    return undefined
  }
  return product.campaignId
}
