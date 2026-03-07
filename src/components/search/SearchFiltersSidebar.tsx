"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategoryIdToTitleMap, useCategoryTree } from "@/hooks/data/useCategoryTree";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const PRICE_PRESETS = [
  { label: "Under ৳500", min: undefined, max: 500 },
  { label: "৳500 - ৳1000", min: 500, max: 1000 },
  { label: "৳1000 - ৳2000", min: 1000, max: 2000 },
  { label: "Over ৳2000", min: 2000, max: undefined },
] as const;

/** Max height for each filter section's scrollable list */
const SECTION_SCROLL_HEIGHT = "max-h-[200px]";

export interface SearchFiltersSidebarProps {
  /** Current search result set (before applying filters) — used to compute dynamic options */
  searchResultSet: Product[];
  className?: string;
  /** When true, use flexible height for scroll area (e.g. inside a sheet) */
  embedded?: boolean;
  /** Base path for filter links (e.g. "/search" or "/flash-sale"). Defaults to "/search". */
  basePath?: string;
}

export function SearchFiltersSidebar({ searchResultSet, className, embedded, basePath = "/search" }: SearchFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tree = useCategoryTree();
  const categoryIdToTitle = useMemo(
    () => getCategoryIdToTitleMap(tree),
    [tree]
  );

  const priceMin = searchParams.get("min_price");
  const priceMax = searchParams.get("max_price");
  const categoryId = searchParams.get("category_id");
  const brandId = searchParams.get("brand_id");

  const sectionScrollHeight = embedded ? "max-h-[160px]" : SECTION_SCROLL_HEIGHT;

  const { minPrice, maxPrice } = useMemo(() => {
    if (searchResultSet.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = searchResultSet.map((p) => p.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [searchResultSet]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of searchResultSet) {
      if (p.categoryId) counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [searchResultSet]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of searchResultSet) {
      const id = p.brandId ?? p.brand ?? "";
      if (id) counts[id] = (counts[id] ?? 0) + 1;
    }
    return counts;
  }, [searchResultSet]);

  const brandIdToName = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of searchResultSet) {
      const id = p.brandId ?? p.brand ?? "";
      if (id && p.brand) map[id] = p.brand;
    }
    return map;
  }, [searchResultSet]);

  const categoryIds = useMemo(
    () => Object.keys(categoryCounts).sort((a, b) => (categoryIdToTitle[a] ?? a).localeCompare(categoryIdToTitle[b] ?? b)),
    [categoryCounts, categoryIdToTitle]
  );

  const brandIds = useMemo(
    () => Object.keys(brandCounts).sort((a, b) => (brandIdToName[a] ?? a).localeCompare(brandIdToName[b] ?? b)),
    [brandCounts, brandIdToName]
  );

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        next.delete(key);
        if (value === null) continue;
        if (Array.isArray(value)) {
          value.forEach((v) => next.append(key, v));
        } else {
          next.set(key, value);
        }
      }
      router.push(`${basePath}?${next.toString()}`, { scroll: false });
    },
    [router, searchParams, basePath]
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("min_price");
    next.delete("max_price");
    next.delete("category_id");
    next.delete("brand_id");
    router.push(`${basePath}?${next.toString()}`, { scroll: false });
  }, [router, searchParams, basePath]);

  const setPricePreset = (min: number | undefined, max: number | undefined) => {
    updateParams({
      min_price: min != null ? String(min) : null,
      max_price: max != null ? String(max) : null,
    });
  };

  const setCustomPrice = (field: "min_price" | "max_price", value: string) => {
    const num = value.trim() === "" ? null : value;
    updateParams({ [field]: num });
  };

  const setCategoryId = (id: string | null) => {
    updateParams({ category_id: id });
  };

  const setBrandId = (id: string | null) => {
    updateParams({ brand_id: id });
  };

  const hasAnyFilter = priceMin || priceMax || categoryId || brandId;

  return (
    <aside className={className}>
      <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        {hasAnyFilter && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
      <div className="space-y-6 pt-4">
        {/* Price range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Price Range</Label>
          <ScrollArea className={cn(sectionScrollHeight, "overflow-y-auto scrollbar-filter")}>
            <div className="space-y-3 pr-2">
              <RadioGroup
                value={
                  PRICE_PRESETS.find((pr) => {
                    const currentMin = priceMin != null && priceMin !== "" ? Number(priceMin) : undefined;
                    const currentMax = priceMax != null && priceMax !== "" ? Number(priceMax) : undefined;
                    return pr.min === currentMin && pr.max === currentMax;
                  })?.label ?? ""
                }
                onValueChange={(v) => {
                  const pr = PRICE_PRESETS.find((p) => p.label === v);
                  if (pr) setPricePreset(pr.min, pr.max);
                }}
                className="space-y-2"
              >
                {PRICE_PRESETS.map((pr) => {
                  const inRange =
                    (pr.max == null || maxPrice >= (pr.min ?? 0)) &&
                    (pr.min == null || minPrice <= (pr.max ?? Infinity));
                  const disabled = !inRange && searchResultSet.length > 0;
                  return (
                    <div key={pr.label} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={pr.label}
                        id={`price-${pr.label}`}
                        disabled={disabled}
                      />
                      <Label
                        htmlFor={`price-${pr.label}`}
                        className={disabled ? "text-muted-foreground" : ""}
                      >
                        {pr.label}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="Min"
                  className="h-9"
                  value={priceMin ?? ""}
                  onChange={(e) => setCustomPrice("min_price", e.target.value)}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  min={0}
                  placeholder="Max"
                  className="h-9"
                  value={priceMax ?? ""}
                  onChange={(e) => setCustomPrice("max_price", e.target.value)}
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Category (single: category_id for API) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">Category</Label>
            {categoryId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto py-0 text-xs text-destructive hover:text-destructive"
                onClick={() => setCategoryId(null)}
              >
                Clear
              </Button>
            )}
          </div>
          <ScrollArea className={cn(sectionScrollHeight, "overflow-y-auto scrollbar-filter")}>
            <RadioGroup
              value={categoryId ?? ""}
              onValueChange={(v) => setCategoryId(v || null)}
              className="space-y-2 pr-2"
            >
              {categoryIds.map((id) => {
                const title = categoryIdToTitle[id] ?? id;
                const count = categoryCounts[id] ?? 0;
                return (
                  <div key={id} className="flex items-center gap-2">
                    <RadioGroupItem value={id} id={`cat-${id}`} />
                    <Label
                      htmlFor={`cat-${id}`}
                      className="cursor-pointer text-sm font-normal capitalize flex-1"
                    >
                      {title} ({count})
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </ScrollArea>
        </div>

        {/* Brand (single: brand_id for API) */}
        {brandIds.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Brand</Label>
              {brandId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto py-0 text-xs text-destructive hover:text-destructive"
                  onClick={() => setBrandId(null)}
                >
                  Clear
                </Button>
              )}
            </div>
            <ScrollArea className={cn(sectionScrollHeight, "overflow-y-auto scrollbar-filter")}>
              <RadioGroup
                value={brandId ?? ""}
                onValueChange={(v) => setBrandId(v || null)}
                className="space-y-2 pr-2"
              >
                {brandIds.map((id) => {
                  const name = brandIdToName[id] ?? id;
                  const count = brandCounts[id] ?? 0;
                  return (
                    <div key={id} className="flex items-center gap-2">
                      <RadioGroupItem value={id} id={`brand-${id}`} />
                      <Label
                        htmlFor={`brand-${id}`}
                        className="cursor-pointer text-sm font-normal capitalize flex-1"
                      >
                        {name} ({count})
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </ScrollArea>
          </div>
        )}
      </div>
    </aside>
  );
}
