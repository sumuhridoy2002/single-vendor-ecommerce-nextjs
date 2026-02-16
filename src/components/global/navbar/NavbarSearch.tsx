"use client";

import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  Popover,
  PopoverAnchor,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
  onSearchFocus,
  variant,
  isMobile,
}: NavbarSearchProps) {
  const showPopoverContent =
    variant === "desktop" ? !isMobile : isMobile;

  const searchForm = (
    <form
      role="search"
      className="w-full flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-border bg-muted/30"
      onSubmit={onSubmit}
    >
      <Select value={searchCategory} onValueChange={setSearchCategory}>
        <SelectTrigger
          className={cn(
            "w-[72px] shrink-0 rounded-none border-0 border-r bg-muted/50 shadow-none focus:ring-0",
            "h-10 rounded-l-lg border-r border-border"
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="medicine">Medicine</SelectItem>
          <SelectItem value="healthcare">Healthcare</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative flex-1 flex min-h-10">
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
      <Button
        type="submit"
        aria-label="Search"
        className="h-10 shrink-0 rounded-r-lg rounded-l-none bg-primary px-4 hover:bg-primary-dark"
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
          onOpenAutoFocus={(e) => e.preventDefault()}
        />
      )}
    </Popover>
  );
}
