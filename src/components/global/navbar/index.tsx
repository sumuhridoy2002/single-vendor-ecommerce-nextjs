"use client";

import { AddressModal } from "@/components/address/AddressModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CartSheet } from "@/components/cart/CartSheet";
import { addToSearchHistory, getSearchHistory } from "@/lib/search-history";
import { cn } from "@/lib/utils";
import { useAddressStore } from "@/store/address-store";
import { useCartStore, useCartItemCount } from "@/store/cart-store";
import { MapPin, Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const Navbar = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const openAddressModal = useAddressStore((s) => s.openAddressModal);
  const cartItemCount = useCartItemCount();
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();

  const refreshHistory = useCallback(() => {
    setRecentSearches(getSearchHistory());
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (inputRef.current?.value ?? searchValue).trim();
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

  return (
    <nav className="flex items-center justify-between gap-6 border-b border-border bg-background px-4 py-3 sticky top-0 z-50">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="w-auto h-10"
        />
      </Link>

      {/* Delivery */}
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
        className="hidden shrink-0 flex-col sm:flex text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        aria-label="Delivery address"
      >
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          Delivery to
        </span>
        <span className="text-sm font-medium">Bangladesh</span>
      </div>

      {/* Search bar */}
      <Popover open={showRecentSearches} onOpenChange={setShowRecentSearches}>
        <PopoverAnchor asChild>
          <form
            role="search"
            className="flex min-w-0 flex-1 max-w-2xl items-center overflow-hidden rounded-lg border border-border bg-muted/30 shadow-sm"
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
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                type="search"
                name="q"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder='Search for "medicine products"'
                className="h-10 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                aria-label="Search products"
                aria-expanded={showRecentSearches}
                aria-haspopup="listbox"
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
        </PopoverAnchor>
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
      </Popover>

      {/* User & Cart */}
      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          onClick={() => setAuthModalOpen(true)}
          className="hidden items-center gap-2 md:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
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
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
        <AddressModal />
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
        <CartSheet />
      </div>
    </nav>
  );
};

export default Navbar;
