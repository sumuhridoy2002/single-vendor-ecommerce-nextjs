"use client";

import { fetchCampaigns } from "@/lib/api/campaigns";
import { globalQueryKeys } from "@/lib/query-keys";
import { useCampaignsStore } from "@/stores/campaigns-store";
import type { CampaignListItem } from "@/types/campaign";
import { useQuery } from "@tanstack/react-query";

export function useCampaigns(): {
  campaigns: CampaignListItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
} {
  const { campaigns: raw } = useCampaignsStore();

  const { data: queryData, refetch, isLoading, error } = useQuery({
    queryKey: globalQueryKeys.campaigns,
    queryFn: fetchCampaigns,
    enabled: false,
  });

  const campaigns = raw ?? queryData ?? [];

  return {
    campaigns,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}
