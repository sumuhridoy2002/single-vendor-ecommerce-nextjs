"use client";

import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  Popover,
  PopoverAnchor,
} from "@/components/ui/popover";
import { useSearchProductSuggestions } from "@/hooks/data/useSearchProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";
import { RecentSearchesPopover } from "./RecentSearchesPopover";

type NavbarSearchProps = {
  searchValue: string;
  setSearchValue: (v: string) => void;
  searchCategory: string;
  setSearchCategory: (v: string) => void;
  showRecentSearches: boolean;
  setShowRecentSearches: (v: boolean) => void;
  recentSearches: string[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onRecentSelect: (query: string) => void;
  onClearRecentSearches?: () => void;
  onSearchFocus: () => void;
  variant: "desktop" | "mobile";
  isMobile: boolean;
};

export function NavbarSearch({
  searchValue,
  setSearchValue,
  searchCategory,
  setSearchCategory,
  showRecentSearches,
  setShowRecentSearches,
  recentSearches,
  onSubmit,
  onRecentSelect,
  onClearRecentSearches,
  onSearchFocus,
  variant,
  isMobile,
}: NavbarSearchProps) {
  const debouncedSearch = useDebounce(searchValue, 300);
  const { suggestions, isLoading } = useSearchProductSuggestions(debouncedSearch);

  const showPopoverContent =
    variant === "desktop" ? !isMobile : isMobile;

  const searchForm = (
    <form
      role="search"
      className="w-full flex min-w-0 flex-1 items-center overflow-hidden"
      onSubmit={onSubmit}
    >
      <div className="flex-1 flex items-center gap-2 border border-border bg-muted/30 rounded-l-lg h-12">
        <div className="relative flex-1 flex min-h-12">
          <PlaceholdersAndVanishInput
            placeholders={[
              "Search products",
              "Search by category",
              "Search medicine...",
            ]}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSubmit={onSubmit}
            onFocus={onSearchFocus}
            embedded
          />
        </div>
      </div>
      <Button
        type="submit"
        aria-label="Search"
        className="h-12 shrink-0 rounded-r-lg rounded-l-none bg-primary px-6 hover:bg-primary-dark"
      >
        <Search className="size-5 text-white" />
      </Button>
    </form>
  );

  return (
    <Popover open={showRecentSearches} onOpenChange={setShowRecentSearches}>
      <PopoverAnchor asChild>
        <div
          className={
            variant === "desktop"
              ? "min-w-0 flex-1"
              : "w-full md:hidden"
          }
        >
          {searchForm}
        </div>
      </PopoverAnchor>
      {showPopoverContent && (
        <RecentSearchesPopover
          recentSearches={recentSearches}
          searchValue={searchValue}
          onSelect={onRecentSelect}
          onClear={onClearRecentSearches}
          onOpenAutoFocus={(e) => e.preventDefault()}
          suggestionProducts={suggestions}
          suggestionLoading={isLoading}
          onSuggestionSelect={() => setShowRecentSearches(false)}
        />
      )}
    </Popover>
  );
}
