"use client";

import { fetchPageBySlug } from "@/lib/api/pages";
import { globalQueryKeys } from "@/lib/query-keys";
import type { CmsPageDetail } from "@/types/cms-page";
import { useQuery } from "@tanstack/react-query";

const THIRTY_MINUTES_MS = 30 * 60 * 1000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

export function usePageBySlug(slug: string | null | undefined): {
  page: CmsPageDetail | null | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
} {
  const {
    data: page,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: globalQueryKeys.pageBySlug(slug ?? ""),
    queryFn: () => fetchPageBySlug(slug!),
    enabled: !!slug,
    staleTime: THIRTY_MINUTES_MS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    gcTime: THREE_DAYS_MS,
  });

  return {
    page: slug ? page ?? null : undefined,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}
