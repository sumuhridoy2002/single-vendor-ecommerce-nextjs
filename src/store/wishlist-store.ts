import type { Product } from "@/types/product";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  add: (product: Product) => void;
  remove: (productId: string) => void;
  toggle: (product: Product) => void;
  clear: () => void;
}

type PersistedWishlist = { items: WishlistItem[] };

const storage =
  typeof window === "undefined"
    ? undefined
    : createJSONStorage<PersistedWishlist>(() => window.localStorage);

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state;
          }
          const nextItem: WishlistItem = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            discountPercent: product.discountPercent,
            badge: product.badge,
            rating: product.rating,
            reviewCount: product.reviewCount,
            unit: product.unit,
            categoryId: product.categoryId,
            inStock: product.inStock,
            deliveryText: product.deliveryText,
            brand: product.brand,
            brandId: product.brandId,
            brandHref: product.brandHref,
          };
          return { items: [...state.items, nextItem] };
        }),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      toggle: (product) => {
        const { items } = get();
        const exists = items.some((item) => item.id === product.id);
        if (exists) {
          set({
            items: items.filter((item) => item.id !== product.id),
          });
        } else {
          const nextItem: WishlistItem = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            discountPercent: product.discountPercent,
            badge: product.badge,
            rating: product.rating,
            reviewCount: product.reviewCount,
            unit: product.unit,
            categoryId: product.categoryId,
            inStock: product.inStock,
            deliveryText: product.deliveryText,
            brand: product.brand,
            brandId: product.brandId,
            brandHref: product.brandHref,
          };
          set({ items: [...items, nextItem] });
        }
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "wishlist",
      storage,
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function useWishlistCount(): number {
  return useWishlistStore((state) => state.items.length);
}

export function useIsInWishlist(productId: string | undefined): boolean {
  return useWishlistStore((state) =>
    productId ? state.items.some((item) => item.id === productId) : false
  );
}

