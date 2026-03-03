"use client";

import { fetchCategories } from "@/lib/api/categories";
import { globalQueryKeys } from "@/lib/query-keys";
import { useCategoriesStore } from "@/stores/categories-store";
import type { CategoryApiNode } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

export function useCategories(): {
  categories: CategoryApiNode[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
} {
  const { categories: raw } = useCategoriesStore();

  const { data: queryData, refetch, isLoading, error } = useQuery({
    queryKey: globalQueryKeys.categories,
    queryFn: fetchCategories,
    enabled: false,
  });

  // Use store first, then query cache (e.g. after rehydration) so we don't show loading when we have cached data
  const categories = raw ?? queryData ?? [];

  return {
    categories,
    isLoading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}
