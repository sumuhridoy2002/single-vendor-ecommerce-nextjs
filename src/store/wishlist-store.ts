import { fetchWishlist, toggleWishlist } from "@/lib/api/wishlist";
import type { Product } from "@/types/product";
import { create } from "zustand";

export type WishlistItem = Pick<
  Product,
  | "id"
  | "name"
  | "slug"
  | "image"
  | "price"
  | "originalPrice"
  | "discountPercent"
  | "badge"
  | "rating"
  | "reviewCount"
  | "unit"
  | "categoryId"
  | "inStock"
  | "deliveryText"
  | "brand"
  | "brandId"
  | "brandHref"
>;

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  hasLoaded: boolean;
  pendingIds: string[];
  load: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  removeById: (productId: string) => Promise<void>;
  clear: () => void;
}

function withPendingIds(ids: string[], productId: string): string[] {
  if (ids.includes(productId)) return ids;
  return [...ids, productId];
}

function withoutPendingId(ids: string[], productId: string): string[] {
  return ids.filter((id) => id !== productId);
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  isLoading: false,
  hasLoaded: false,
  pendingIds: [],
  load: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const items = await fetchWishlist();
      set({ items, hasLoaded: true });
    } finally {
      set({ isLoading: false });
    }
  },
  toggle: async (productId) => {
    const parsedId = Number(productId);
    if (!Number.isFinite(parsedId)) return;
    if (get().pendingIds.includes(productId)) return;

    set((state) => ({
      pendingIds: withPendingIds(state.pendingIds, productId),
    }));

    try {
      await toggleWishlist(parsedId);
      const items = await fetchWishlist();
      set({ items, hasLoaded: true });
    } finally {
      set((state) => ({
        pendingIds: withoutPendingId(state.pendingIds, productId),
      }));
    }
  },
  removeById: async (productId) => {
    if (!get().items.some((item) => item.id === productId)) return;
    await get().toggle(productId);
  },
  clear: () => set({ items: [], hasLoaded: false, pendingIds: [] }),
}));

export function useWishlistCount(): number {
  return useWishlistStore((state) => state.items.length);
}

export function useIsInWishlist(productId: string | undefined): boolean {
  return useWishlistStore((state) =>
    productId ? state.items.some((item) => item.id === productId) : false
  );
}

