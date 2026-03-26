"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useWishlistStore } from "@/store/wishlist-store";
import { useEffect } from "react";

/**
 * Fetches wishlist from GET /wishlist when user is logged in and syncs to store.
 * Does not call API when not logged in. Clears wishlist on logout.
 */
export function useWishlistFromApi() {
  const { isAuthenticated } = useAuth();
  const load = useWishlistStore((s) => s.load);
  const clear = useWishlistStore((s) => s.clear);

  useEffect(() => {
    if (!isAuthenticated) {
      clear();
      return;
    }

    load().catch(() => {
      clear();
    });
  }, [isAuthenticated, load, clear]);
}
