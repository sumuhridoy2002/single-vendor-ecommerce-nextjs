"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { SearchFiltersSidebar } from "@/components/search/SearchFiltersSidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSearchProducts } from "@/hooks/data/useSearchProducts";
import { useCartStore } from "@/store/cart-store";
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn";
import type { AddToCartOptions, Product } from "@/types/product";
import type { ProductsSortParam } from "@/lib/api/products";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

const SORT_OPTIONS: { value: ProductsSortParam; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const categoryId = searchParams.get("category_id") ?? undefined;
  const brandId = searchParams.get("brand_id") ?? undefined;
  const minPriceParam = searchParams.get("min_price");
  const maxPriceParam = searchParams.get("max_price");
  const sortParam = (searchParams.get("sort") as ProductsSortParam) ?? "latest";

  const minPrice = minPriceParam != null && minPriceParam !== "" ? Number(minPriceParam) : null;
  const maxPrice = maxPriceParam != null && maxPriceParam !== "" ? Number(maxPriceParam) : null;

  const { products, isLoading, error } = useSearchProducts({
    search: q || undefined,
    category_id: categoryId,
    brand_id: brandId,
    min_price: minPrice ?? undefined,
    max_price: maxPrice ?? undefined,
    sort: sortParam,
  });

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const whenLoggedIn = useWhenLoggedIn();
  const handleAddToCart = (product: Product, options?: AddToCartOptions) => {
    whenLoggedIn(() => {
      addItem(product, 1, options)
        .then(() => openCart())
        .catch((e) => toast.error(e?.message ?? "Failed to add to cart"));
    });
  };

  const setSort = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("sort", value);
    router.push(`/search?${next.toString()}`, { scroll: false });
  };

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const hasQueryOrFilters = q.trim() || categoryId || brandId || minPrice != null || maxPrice != null;

  if (!hasQueryOrFilters) {
    return (
      <div className="container py-12 text-center text-muted-foreground">
        <p>Enter a search term or use filters to see results.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center text-destructive">
        <p>Failed to load results. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container w-full min-w-full flex gap-6">
      <div className="hidden w-56 shrink-0 lg:block">
        <SearchFiltersSidebar searchResultSet={products} basePath="/search" />
      </div>
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {q.trim() ? (
              <>
                Showing results for <strong className="text-foreground">{q}</strong>
              </>
            ) : (
              "Showing results"
            )}{" "}
            ({isLoading ? "..." : products.length} items)
          </p>
          <div className="flex items-center gap-4">
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-1.5"
                  aria-label="Open filters"
                >
                  <Filter className="size-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(20rem,100vw-2rem)] py-4 flex flex-col">
                <SheetTitle className="sr-only">Filters</SheetTitle>
                <div className="flex-1 overflow-hidden flex flex-col min-h-0 px-4">
                  <SearchFiltersSidebar searchResultSet={products} embedded className="flex flex-col flex-1 min-h-0 border-0" basePath="/search" />
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <Select value={sortParam} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {isLoading ? (
          <p className="py-12 text-center text-muted-foreground">Loading...</p>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No products match your filters. Try adjusting the filters or search term.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container w-full flex gap-6">
          <div className="hidden w-56 shrink-0 lg:block" />
          <div className="min-w-0 flex-1 py-12 text-center text-muted-foreground">
            Loading search results...
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
