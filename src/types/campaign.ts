import type { ProductListItemApi } from "@/types/product-details"

export interface CampaignListItem {
  id: number
  title: string
  image: string
  start_date: string
  end_date: string
}

export interface CampaignMeta {
  title: string
  keywords: string
  description: string
}

export interface CampaignDetails extends CampaignListItem {
  products: ProductListItemApi[]
  meta: CampaignMeta
}

export interface CampaignsApiResponse {
  data: CampaignListItem[]
  status: number
  message: string
}

export interface CampaignByIdApiResponse {
  data: CampaignDetails
  status: number
  message: string
}
