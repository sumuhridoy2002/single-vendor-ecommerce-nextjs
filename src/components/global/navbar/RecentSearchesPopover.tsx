"use client";

import { PopoverContent } from "@/components/ui/popover";
import { clearSearchHistory } from "@/lib/search-history";
import type { Product } from "@/types/product";
import { Loader2, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type RecentSearchesPopoverProps = {
  recentSearches: string[];
  searchValue: string;
  onSelect: (query: string) => void;
  onClear?: () => void;
  onOpenAutoFocus?: (e: Event) => void;
  suggestionProducts?: Product[];
  suggestionLoading?: boolean;
  onSuggestionSelect?: () => void;
};

export function RecentSearchesPopover({
  recentSearches,
  searchValue,
  onSelect,
  onClear,
  onOpenAutoFocus,
  suggestionProducts = [],
  suggestionLoading = false,
  onSuggestionSelect,
}: RecentSearchesPopoverProps) {
  const handleClear = () => {
    clearSearchHistory();
    onClear?.();
  };

  const hasQuery = searchValue.trim().length > 0;
  const showSuggestions = hasQuery;

  return (
    <PopoverContent
      className="w-(--radix-popover-trigger-width) rounded-lg border border-border bg-popover p-0 shadow-md"
      align="start"
      sideOffset={4}
      onOpenAutoFocus={onOpenAutoFocus}
    >
      <div className="py-2">
        {showSuggestions ? (
          <>
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Search results
              </p>
            </div>
            <div className="max-h-60 overflow-auto">
              {suggestionLoading ? (
                <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Searching...
                </div>
              ) : suggestionProducts.length > 0 ? (
                <ul role="listbox" className="py-1" aria-label="Search suggestions">
                  {suggestionProducts.map((product) => (
                    <li key={product.id} role="option" aria-selected={false}>
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                        onClick={() => onSuggestionSelect?.()}
                      >
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={product.image || ""}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{product.name}</span>
                        {product.price != null && (
                          <span className="shrink-0 text-muted-foreground">
                            ৳{product.price}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-primary hover:bg-muted focus:bg-muted focus:outline-none"
                      onClick={() => onSelect(searchValue.trim())}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <Search className="size-4 shrink-0" />
                      See all results for &quot;{searchValue.trim()}&quot;
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No products found. Try different keywords.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Recent searches
              </p>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:bg-muted focus:outline-none"
                  aria-label="Clear search history"
                >
                  <Trash2 className="size-3.5" />
                  Clear
                </button>
              )}
            </div>
            <ul
              role="listbox"
              className="max-h-60 overflow-auto"
              aria-label="Recent searches"
            >
              {recentSearches.map((query) => (
                <li
                  key={query}
                  role="option"
                  aria-selected={query === searchValue}
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                    onClick={() => onSelect(query)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    {query}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </PopoverContent>
  );
}
