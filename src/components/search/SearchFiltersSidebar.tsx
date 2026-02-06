"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategoryIdToTitleMap } from "@/hooks/data/useCategoryTree";
import type { Product } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const PRICE_PRESETS = [
  { label: "Under ৳500", min: undefined, max: 500 },
  { label: "৳500 - ৳1000", min: 500, max: 1000 },
  { label: "৳1000 - ৳2000", min: 1000, max: 2000 },
  { label: "Over ৳2000", min: 2000, max: undefined },
] as const;

const DISCOUNT_BUCKETS = [10, 20, 30, 40, 50] as const;

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface SearchFiltersSidebarProps {
  /** Current search result set (before applying filters) — used to compute dynamic options */
  searchResultSet: Product[];
  className?: string;
}

export function SearchFiltersSidebar({ searchResultSet, className }: SearchFiltersSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const discount = searchParams.get("discount");
  const categories = searchParams.getAll("category");

  const categoryIdToTitle = useMemo(() => getCategoryIdToTitleMap(), []);

  const { minPrice, maxPrice } = useMemo(() => {
    if (searchResultSet.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = searchResultSet.map((p) => p.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [searchResultSet]);

  const discountCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const pct of DISCOUNT_BUCKETS) {
      counts[pct] = searchResultSet.filter(
        (p) => (p.discountPercent ?? 0) >= pct
      ).length;
    }
    return counts;
  }, [searchResultSet]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of searchResultSet) {
      counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [searchResultSet]);

  const categoryIds = useMemo(
    () => Object.keys(categoryCounts).sort((a, b) => (categoryIdToTitle[a] ?? a).localeCompare(categoryIdToTitle[b] ?? b)),
    [categoryCounts, categoryIdToTitle]
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
      router.push(`/search?${next.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("priceMin");
    next.delete("priceMax");
    next.delete("discount");
    next.delete("category");
    router.push(`/search?${next.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const setPricePreset = (min: number | undefined, max: number | undefined) => {
    updateParams({
      priceMin: min != null ? String(min) : null,
      priceMax: max != null ? String(max) : null,
    });
  };

  const setCustomPrice = (field: "priceMin" | "priceMax", value: string) => {
    const num = value.trim() === "" ? null : value;
    updateParams({ [field]: num });
  };

  const setDiscount = (pct: number | null) => {
    updateParams({ discount: pct != null ? String(pct) : null });
  };

  const toggleCategory = (categoryId: string) => {
    const next = categories.includes(categoryId)
      ? categories.filter((c) => c !== categoryId)
      : [...categories, categoryId];
    updateParams({ category: next.length ? next : null });
  };

  const hasAnyFilter = priceMin || priceMax || discount || categories.length > 0;

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
      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <div className="space-y-6 pt-4">
          {/* Price range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Price Range</Label>
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
                onChange={(e) => setCustomPrice("priceMin", e.target.value)}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                min={0}
                placeholder="Max"
                className="h-9"
                value={priceMax ?? ""}
                onChange={(e) => setCustomPrice("priceMax", e.target.value)}
              />
            </div>
          </div>

          {/* Discount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Discount</Label>
              {discount && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto py-0 text-xs"
                  onClick={() => setDiscount(null)}
                >
                  Clear
                </Button>
              )}
            </div>
            <RadioGroup
              value={discount ?? "none"}
              onValueChange={(v) => setDiscount(v === "none" ? null : Number(v))}
              className="space-y-2"
            >
              {DISCOUNT_BUCKETS.map((pct) => {
                const count = discountCounts[pct] ?? 0;
                const disabled = count === 0;
                return (
                  <div key={pct} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={String(pct)}
                      id={`discount-${pct}`}
                      disabled={disabled}
                    />
                    <Label
                      htmlFor={`discount-${pct}`}
                      className={disabled ? "text-muted-foreground" : ""}
                    >
                      {pct}% and above
                      {count > 0 && (
                        <span className="ml-1 text-muted-foreground">({count})</span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Category</Label>
              {categories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto py-0 text-xs"
                  onClick={() => updateParams({ category: null })}
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {categoryIds.map((id) => {
                const title = categoryIdToTitle[id] ?? id;
                const count = categoryCounts[id] ?? 0;
                return (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${id}`}
                      checked={categories.includes(id)}
                      onCheckedChange={() => toggleCategory(id)}
                    />
                    <Label
                      htmlFor={`cat-${id}`}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {title} ({count})
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
