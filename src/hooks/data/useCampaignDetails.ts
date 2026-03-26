"use client";

import { fetchCampaignById } from "@/lib/api/campaigns";
import { globalQueryKeys } from "@/lib/query-keys";
import type { CampaignDetails } from "@/types/campaign";
import { useQuery } from "@tanstack/react-query";

export function useCampaignDetails(id: number | null): {
  campaign: CampaignDetails | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
} {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: id == null ? ["campaigns", "detail", "invalid"] : globalQueryKeys.campaignById(id),
    queryFn: async () => {
      if (id == null) throw new Error("Invalid campaign id");
      return fetchCampaignById(id);
    },
    enabled: id != null,
  });

  return {
    campaign: data ?? null,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}
