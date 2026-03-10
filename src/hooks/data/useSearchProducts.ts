"use client";

import { fetchProducts, type FetchProductsParams, type ProductsSortParam } from "@/lib/api/products";
import type { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { globalQueryKeys } from "@/lib/query-keys";

export interface UseSearchProductsParams {
  search?: string;
  category_id?: string;
  brand_id?: string;
  min_price?: number | null;
  max_price?: number | null;
  sort?: ProductsSortParam;
}

export interface UseSearchProductsOptions {
  enabled?: boolean;
}

function toFetchParams(p: UseSearchProductsParams): FetchProductsParams {
  return {
    search: p.search?.trim() || undefined,
    category_id: p.category_id || undefined,
    brand_id: p.brand_id || undefined,
    min_price: p.min_price ?? undefined,
    max_price: p.max_price ?? undefined,
    sort: p.sort,
  };
}

export function useSearchProducts(
  params: UseSearchProductsParams,
  options: UseSearchProductsOptions = {}
): {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
} {
  const { enabled = true } = options;
  const fetchParams = toFetchParams(params);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...globalQueryKeys.productsSearch, fetchParams],
    queryFn: () => fetchProducts(fetchParams),
    enabled,
  });

  return {
    products: data ?? [],
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}

/** Limit for navbar search suggestions. */
const SUGGESTIONS_LIMIT = 8;

export function useSearchProductSuggestions(searchQuery: string): {
  suggestions: Product[];
  isLoading: boolean;
  error: Error | null;
} {
  const trimmed = searchQuery.trim();
  const { products, isLoading, error } = useSearchProducts({
    search: trimmed || undefined,
  }, { enabled: trimmed.length >= 1 });

  const suggestions = products.slice(0, SUGGESTIONS_LIMIT);

  return {
    suggestions,
    isLoading,
    error,
  };
}
