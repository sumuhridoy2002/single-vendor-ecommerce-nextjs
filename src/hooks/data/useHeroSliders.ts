"use client";

import { fetchHeroSliders } from "@/lib/api/hero-sliders";
import { globalQueryKeys } from "@/lib/query-keys";
import { useHeroSlidersStore } from "@/stores/hero-sliders-store";
import type { HeroSliderItem } from "@/types/hero-slider";
import { useQuery } from "@tanstack/react-query";

export function useHeroSliders(): {
  heroSliders: HeroSliderItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
} {
  const { heroSliders: raw } = useHeroSlidersStore();

  const { data: queryData, refetch, isLoading, error } = useQuery({
    queryKey: globalQueryKeys.sliders,
    queryFn: fetchHeroSliders,
    enabled: false,
  });

  // Use store first, then query cache (e.g. after rehydration) so we don't show loading when we have cached data
  const heroSliders = raw ?? queryData ?? [];

  return {
    heroSliders,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}
