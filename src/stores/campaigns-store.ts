import { create } from "zustand"
import type { CampaignListItem } from "@/types/campaign"

interface CampaignsState {
  campaigns: CampaignListItem[] | null
  setCampaigns: (campaigns: CampaignListItem[] | null) => void
}

export const useCampaignsStore = create<CampaignsState>((set) => ({
  campaigns: null,
  setCampaigns: (campaigns) => set({ campaigns }),
}))
