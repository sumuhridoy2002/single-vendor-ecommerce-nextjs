"use client";

import { AddressModal } from "@/components/address/AddressModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { CartSheet } from "@/components/cart/CartSheet";
import LogoSvg from "@/components/svg/logo";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { addToSearchHistory, getSearchHistory } from "@/lib/search-history";
import { useAddressStore } from "@/store/address-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { NavbarDelivery } from "./NavbarDelivery";
import { NavbarDesktopActions } from "./NavbarDesktopActions";
import { NavbarMobileActions } from "./NavbarMobileActions";
import { NavbarSearch } from "./NavbarSearch";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const openAddressModal = useAddressStore((s) => s.openAddressModal);
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

  return (
    <nav className="flex flex-col gap-2 border-b border-border bg-background px-4 py-3 sticky top-0 z-50 md:flex-row md:items-center md:justify-between md:gap-6">
      {/* Row 1: Logo + Delivery + (mobile: Wallet, Messenger, Cart | desktop: Search, User, Cart) */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-2 md:contents">
        <div className="flex flex-col lg:flex-row lg:items-end gap-2 lg:gap-20">
          <Link href="/" className="shrink-0">
            <LogoSvg />
          </Link>

          <NavbarDelivery onOpenAddressModal={openAddressModal} />
        </div>

        <NavbarMobileActions />

        {/* Desktop: Search with recent searches popover */}
        <div className="hidden min-w-0 flex-1 md:block">
          <NavbarSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            searchCategory={searchCategory}
            setSearchCategory={setSearchCategory}
            showRecentSearches={showRecentSearches}
            setShowRecentSearches={setShowRecentSearches}
            recentSearches={recentSearches}
            onSubmit={handleSearchSubmit}
            onRecentSelect={handleRecentSelect}
            onSearchFocus={handleSearchFocus}
            variant="desktop"
            isMobile={isMobile}
          />
        </div>

        <NavbarDesktopActions
          isAuthenticated={isAuthenticated}
          user={user}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />
      </div>

      {/* Row 2 (mobile only): Full-width search with recent searches popover */}
      <NavbarSearch
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        showRecentSearches={showRecentSearches}
        setShowRecentSearches={setShowRecentSearches}
        recentSearches={recentSearches}
        onSubmit={handleSearchSubmit}
        onRecentSelect={handleRecentSelect}
        onSearchFocus={handleSearchFocus}
        variant="mobile"
        isMobile={isMobile}
      />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <AddressModal />
      <CartSheet />
    </nav>
  );
};

export default Navbar;
