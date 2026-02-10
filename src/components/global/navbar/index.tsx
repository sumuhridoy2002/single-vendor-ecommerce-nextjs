"use client";

import { AddressModal } from "@/components/address/AddressModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { CartSheet } from "@/components/cart/CartSheet";
import LogoSvg from "@/components/svg/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { addToSearchHistory, getSearchHistory } from "@/lib/search-history";
import { cn } from "@/lib/utils";
import { useAddressStore } from "@/store/address-store";
import { useCartItemCount, useCartStore } from "@/store/cart-store";
import { ChevronDown, MapPin, MessageCircle, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const openAddressModal = useAddressStore((s) => s.openAddressModal);
  const cartItemCount = useCartItemCount();
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();
  const isMobile = useIsMobile();

  const refreshHistory = useCallback(() => {
    setRecentSearches(getSearchHistory());
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchValue.trim();
    if (!q) return;
    addToSearchHistory(q);
    refreshHistory();
    setShowRecentSearches(false);
    const params = new URLSearchParams({ q });
    if (searchCategory && searchCategory !== "all") {
      params.set("scope", searchCategory);
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleRecentSelect = (query: string) => {
    addToSearchHistory(query);
    refreshHistory();
    setShowRecentSearches(false);
    const params = new URLSearchParams({ q: query });
    if (searchCategory && searchCategory !== "all") {
      params.set("scope", searchCategory);
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleSearchFocus = () => {
    refreshHistory();
    setShowRecentSearches(getSearchHistory().length > 0);
  };

  const searchForm = (
    <form
      role="search"
      className="w-full flex min-w-0 flex-1 items-center overflow-hidden rounded-lg border border-border bg-muted/30"
      onSubmit={handleSearchSubmit}
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
          onSubmit={handleSearchSubmit}
          onFocus={handleSearchFocus}
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
    <nav className="flex flex-col gap-2 border-b border-border bg-background px-4 py-3 sticky top-0 z-50 md:flex-row md:items-center md:justify-between md:gap-6">
      {/* Row 1: Logo + Delivery + (mobile: Wallet, Messenger, Cart | desktop: Search, User, Cart) */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2 md:contents">
        <Link href="/" className="shrink-0">
          <LogoSvg />
        </Link>

        {/* Delivery - visible on all screens */}
        <div
          role="button"
          tabIndex={0}
          onClick={openAddressModal}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openAddressModal();
            }
          }}
          className="flex shrink-0 min-w-0 flex-col text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          aria-label="Delivery address"
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            Delivery to
          </span>
          <span className="flex items-center gap-0.5 truncate text-sm font-medium">
            Choose A...
            <ChevronDown className="size-4 shrink-0" />
          </span>
        </div>

        {/* Mobile only: Wallet, Messenger, Cart */}
        <div className="flex shrink-0 items-center gap-1 md:hidden">
          <span className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium">
            ৳0.00
          </span>
          <a
            href="https://m.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-full bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Messenger"
          >
            <MessageCircle className="size-5 text-muted-foreground" />
          </a>
          <button
            type="button"
            onClick={openCart}
            className="relative flex size-10 items-center justify-center rounded-full bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="size-5 text-muted-foreground" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-0.5 -top-0.5 size-5 rounded-full p-0 text-[10px]"
              >
                {cartItemCount}
              </Badge>
            )}
          </button>
        </div>

        {/* Desktop: Search with recent searches popover */}
        <div className="hidden min-w-0 flex-1 md:block">
          <Popover open={showRecentSearches} onOpenChange={setShowRecentSearches}>
            <PopoverAnchor asChild>
              <div className="min-w-0 flex-1">{searchForm}</div>
            </PopoverAnchor>
            {!isMobile && (
              <PopoverContent
                className="w-(--radix-popover-trigger-width) rounded-lg border border-border bg-popover p-0 shadow-md"
                align="start"
                sideOffset={4}
                onOpenAutoFocus={(e) => e.preventDefault()}
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
                          onClick={() => handleRecentSelect(query)}
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
            )}
          </Popover>
        </div>

        {/* Desktop: User & Cart */}
        <div className="hidden shrink-0 items-center gap-4 md:flex">
          {isAuthenticated && user ? (
            <Link
              href="/account"
              className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
              aria-label="Account & Orders"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                <User className="size-5 text-muted-foreground" />
              </span>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">
                  Hello, {user.name ?? user.email ?? "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Account & Orders
                </span>
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
              aria-label="Account & Orders"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                <User className="size-5 text-muted-foreground" />
              </span>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">Hello, User</span>
                <span className="text-xs text-muted-foreground">
                  Account & Orders
                </span>
              </div>
            </button>
          )}
          <button
            type="button"
            onClick={openCart}
            className="relative flex size-10 items-center justify-center rounded-full bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Shopping cart"
          >
            <ShoppingCart className="size-5 text-muted-foreground" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-0.5 -top-0.5 size-5 rounded-full p-0 text-[10px]"
              >
                {cartItemCount}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Row 2 (mobile only): Full-width search with recent searches popover */}
      <Popover open={showRecentSearches} onOpenChange={setShowRecentSearches}>
        <PopoverAnchor asChild>
          <div className="w-full md:hidden">{searchForm}</div>
        </PopoverAnchor>
        {isMobile && (
          <PopoverContent
            className="w-(--radix-popover-trigger-width) rounded-lg border border-border bg-popover p-0 shadow-md"
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()}
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
                      onClick={() => handleRecentSelect(query)}
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
        )}
      </Popover>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <AddressModal />
      <CartSheet />
    </nav>
  );
};

export default Navbar;
