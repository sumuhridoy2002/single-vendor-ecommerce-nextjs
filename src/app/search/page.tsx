"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { SearchFiltersSidebar } from "@/components/search/SearchFiltersSidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryIdsForMain, useCategoryTree } from "@/hooks/data/useCategoryTree";
import { useProducts } from "@/hooks/data/useProducts";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";
import { LayoutGrid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount-desc", label: "Discount: High to Low" },
  { value: "discount-asc", label: "Discount: Low to High" },
  { value: "name-asc", label: "Name (A to Z)" },
] as const;

function filterByQuery(products: Product[], q: string): Product[] {
  const term = q.trim().toLowerCase();
  if (!term) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term)
  );
}

function filterByScope(products: Product[], categorySlug: string | null, tree: ReturnType<typeof useCategoryTree>): Product[] {
  if (!categorySlug) return products;
  const main = tree.find((c) => c.slug === categorySlug);
  if (!main) return products;
  const ids = getCategoryIdsForMain(main);
  return products.filter((p) => ids.includes(p.categoryId));
}

function filterByPrice(products: Product[], priceMin: number | null, priceMax: number | null): Product[] {
  return products.filter((p) => {
    if (priceMin != null && p.price < priceMin) return false;
    if (priceMax != null && p.price > priceMax) return false;
    return true;
  });
}

function filterByDiscount(products: Product[], discountMin: number | null): Product[] {
  if (discountMin == null) return products;
  return products.filter((p) => (p.discountPercent ?? 0) >= discountMin);
}

function filterByCategories(products: Product[], categoryIds: string[]): Product[] {
  if (categoryIds.length === 0) return products;
  return products.filter((p) => categoryIds.includes(p.categoryId));
}

function sortProducts(products: Product[], sort: string): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "discount-desc":
      return list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
    case "discount-asc":
      return list.sort((a, b) => (a.discountPercent ?? 0) - (b.discountPercent ?? 0));
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "popularity":
      return list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    case "relevance":
    default:
      return list;
  }
}

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tree = useCategoryTree();
  const allProducts = useProducts();

  const q = searchParams.get("q") ?? "";
  const scope = searchParams.get("scope");
  const priceMinParam = searchParams.get("priceMin");
  const priceMaxParam = searchParams.get("priceMax");
  const discountParam = searchParams.get("discount");
  const categoryFilterIds = searchParams.getAll("category");
  const sortParam = searchParams.get("sort") ?? "relevance";

  const searchResultSet = useMemo(() => {
    let result = filterByQuery(allProducts, q);
    result = filterByScope(result, scope, tree);
    return result;
  }, [allProducts, q, scope, tree]);

  const filteredProducts = useMemo(() => {
    const priceMin = priceMinParam != null && priceMinParam !== "" ? Number(priceMinParam) : null;
    const priceMax = priceMaxParam != null && priceMaxParam !== "" ? Number(priceMaxParam) : null;
    const discountMin = discountParam != null && discountParam !== "" ? Number(discountParam) : null;
    let result = filterByPrice(searchResultSet, priceMin, priceMax);
    result = filterByDiscount(result, discountMin);
    result = filterByCategories(result, categoryFilterIds);
    return sortProducts(result, sortParam);
  }, [searchResultSet, priceMinParam, priceMaxParam, discountParam, categoryFilterIds, sortParam]);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const handleAddToCart = (product: Product) => {
    addItem(product);
    openCart();
  };

  const setSort = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("sort", value);
    router.push(`/search?${next.toString()}`, { scroll: false });
  };

  if (!q.trim()) {
    return (
      <div className="container py-12 text-center text-muted-foreground">
        <p>Enter a search term to see results.</p>
      </div>
    );
  }

  return (
    <div className="container flex gap-6 py-6 px-10">
      <div className="hidden w-56 shrink-0 lg:block">
        <SearchFiltersSidebar searchResultSet={searchResultSet} />
      </div>
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing all results for <strong className="text-foreground">{q}</strong>{" "}
            ({filteredProducts.length}+ items)
          </p>
          <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">View:</span>
              <button
                type="button"
                aria-label="Grid view"
                onClick={() => setViewMode("grid")}
                className={`rounded p-1.5 ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                type="button"
                aria-label="List view"
                onClick={() => setViewMode("list")}
                className={`rounded p-1.5 ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No products match your filters. Try adjusting the filters or search term.
          </p>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid grid-cols-1 gap-3"
            }
          >
            {filteredProducts.map((product) => (
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
        <div className="container flex gap-6 py-6">
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
