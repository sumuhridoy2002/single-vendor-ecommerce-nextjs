"use client";

import { fetchHomepage, mapHomepageProductToProduct } from "@/lib/api/homepage";
import { globalQueryKeys } from "@/lib/query-keys";
import { useHomepageStore } from "@/stores/homepage-store";
import type { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

export interface HomepageSections {
  newArrivals: Product[];
  popular: Product[];
  discounted: Product[];
  flashSale: Product[];
}

export function useHomepage(): {
  data: HomepageSections | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
} {
  const { data: raw } = useHomepageStore();

  const { data: queryData, refetch, isLoading, error } = useQuery({
    queryKey: globalQueryKeys.productsHomepage,
    queryFn: fetchHomepage,
    enabled: false,
  });

  // Use store first, then query cache (e.g. after rehydration) so we don't show loading when we have cached data
  const source = raw ?? queryData ?? null;
  const data: HomepageSections | null =
    source == null
      ? null
      : {
          newArrivals: source.new_arrivals.map(mapHomepageProductToProduct),
          popular: source.popular.map(mapHomepageProductToProduct),
          discounted: source.discounted.map(mapHomepageProductToProduct),
          flashSale: source.flash_sale.map(mapHomepageProductToProduct),
        };

  return {
    data,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}
