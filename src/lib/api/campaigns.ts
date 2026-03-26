import type {
  CampaignByIdApiResponse,
  CampaignDetails,
  CampaignListItem,
  CampaignsApiResponse,
} from "@/types/campaign"
import { getBaseUrl } from "./client"

export async function fetchCampaigns(): Promise<CampaignListItem[]> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/campaigns`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Campaigns fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as CampaignsApiResponse
  if (json.status !== 200 || !Array.isArray(json.data)) {
    throw new Error(json.message ?? "Failed to load campaigns")
  }

  return json.data
}

export async function fetchCampaignById(id: number): Promise<CampaignDetails> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/campaigns/${id}`, {
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    if (res.status === 404) throw new Error("Campaign not found")
    throw new Error(`Campaign fetch failed: ${res.status}`)
  }

  const json = (await res.json()) as CampaignByIdApiResponse
  if (json.status !== 200 || !json.data) {
    throw new Error(json.message ?? "Failed to load campaign")
  }

  return json.data
}
