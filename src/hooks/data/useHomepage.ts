"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchHomepage, mapHomepageProductToProduct } from "@/lib/api/homepage";
import { useHomepageStore } from "@/stores/homepage-store";
import type { Product } from "@/types/product";

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
  refetch: () => Promise<void>;
} {
  const { data: raw } = useHomepageStore();
  const [isLoading, setIsLoading] = useState(raw == null);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await fetchHomepage();
      useHomepageStore.getState().setData(payload);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (raw != null) {
      setIsLoading(false);
      return;
    }
    fetch();
  }, [raw, fetch]);

  const data: HomepageSections | null =
    raw == null
      ? null
      : {
          newArrivals: raw.new_arrivals.map(mapHomepageProductToProduct),
          popular: raw.popular.map(mapHomepageProductToProduct),
          discounted: raw.discounted.map(mapHomepageProductToProduct),
          flashSale: raw.flash_sale.map(mapHomepageProductToProduct),
        };

  return { data, isLoading, error, refetch: fetch };
}
