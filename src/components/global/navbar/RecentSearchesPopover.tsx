"use client";

import { PopoverContent } from "@/components/ui/popover";
import { Search } from "lucide-react";

type RecentSearchesPopoverProps = {
  recentSearches: string[];
  searchValue: string;
  onSelect: (query: string) => void;
  onOpenAutoFocus?: (e: Event) => void;
};

export function RecentSearchesPopover({
  recentSearches,
  searchValue,
  onSelect,
  onOpenAutoFocus,
}: RecentSearchesPopoverProps) {
  return (
    <PopoverContent
      className="w-(--radix-popover-trigger-width) rounded-lg border border-border bg-popover p-0 shadow-md"
      align="start"
      sideOffset={4}
      onOpenAutoFocus={onOpenAutoFocus}
    >
      <div className="py-2">
        <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Recent searches
        </p>
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
      </div>
    </PopoverContent>
  );
}
