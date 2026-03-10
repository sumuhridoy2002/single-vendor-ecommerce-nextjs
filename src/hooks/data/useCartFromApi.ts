"use client";

import { fetchCart } from "@/lib/api/cart";
import { useCartStore } from "@/store/cart-store";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

/**
 * Fetches cart from GET /cart when user is logged in and syncs to cart store.
 * Does not call the API when not logged in. When user logs in, runs automatically.
 */
export function useCartFromApi() {
  const { isAuthenticated } = useAuth();
  const setItems = useCartStore((s) => s.setItems);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    let cancelled = false;
    fetchCart()
      .then((items) => {
        if (!cancelled) setItems(items);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, setItems]);
}
