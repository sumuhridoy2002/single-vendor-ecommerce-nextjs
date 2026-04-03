import { create } from "zustand";
import type { Product } from "@/types/product";
import {
  addToCart,
  fetchCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/api/cart";
import { getEffectiveCampaignIdForCart } from "@/lib/campaign-window";

export type DeliveryOption = "regular" | "express";

export interface CartItem {
  /** Cart line id from API (when synced from server) */
  lineId?: number;
  /** Selected product variation (e.g. Color: Red) */
  variation?: { id: number; type: string; value: string };
  product: Product;
  quantity: number;
}

const MAX_QUANTITY = 10;
const EXPRESS_DELIVERY_CHARGE = 59;
const CASHBACK_AMOUNT = 10;

/** Match a line when resolving string product id (line id from API is preferred and unambiguous). */
function findItemIndex(
  items: CartItem[],
  productIdOrLineId: string | number,
  variationId?: number
): number {
  if (typeof productIdOrLineId === "number") {
    return items.findIndex((i) => i.lineId === productIdOrLineId);
  }
  return items.findIndex((i) => {
    if (i.product.id !== productIdOrLineId) return false;
    if (variationId === undefined) return i.variation == null;
    return i.variation?.id === variationId;
  });
}

/** Local-only cart lines for instant feedback before POST /cart/add completes. */
function buildOptimisticItemsAfterAdd(
  current: CartItem[],
  product: Product,
  quantity: number,
  options?: { variationId?: number; campaignId?: number }
): CartItem[] {
  const q = Math.max(1, Math.min(MAX_QUANTITY, quantity));
  const variationId = options?.variationId;
  const idx = findItemIndex(current, product.id, variationId);

  if (idx >= 0) {
    const existing = current[idx];
    const mergedQty = Math.min(MAX_QUANTITY, existing.quantity + q);
    const next = [...current];
    next[idx] = { ...existing, quantity: mergedQty };
    return next;
  }

  let variation: CartItem["variation"];
  let productForLine = product;
  if (variationId != null && product.variations?.length) {
    const row = product.variations.find((v) => v.id === variationId);
    if (row) {
      variation = { id: row.id, type: row.type, value: row.value };
      if (row.image) {
        productForLine = { ...product, image: row.image };
      }
    }
  }

  const newItem: CartItem = {
    product: productForLine,
    quantity: q,
    variation,
  };
  return [...current, newItem];
}

function getSubtotalMRP(items: CartItem[]): number {
  return items.reduce((sum, { product, quantity }) => {
    const mrp = product.originalPrice ?? product.price;
    return sum + mrp * quantity;
  }, 0);
}

function getDiscountTotal(items: CartItem[]): number {
  return items.reduce((sum, { product, quantity }) => {
    const mrp = product.originalPrice ?? product.price;
    const discount = (mrp - product.price) * quantity;
    return sum + discount;
  }, 0);
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  deliveryOption: DeliveryOption;
  additionalInfo: string;

  // Derived (computed in getState / selectors)
  itemCount: number;
  subtotalMRP: number;
  discountTotal: number;
  roundingOff: number;
  cashbackAmount: number;
  deliveryCharge: number;
  amountPayable: number;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  /** Add item via API then refetch cart. Options: variationId, campaignId for product variants/campaigns. */
  addItem: (
    product: Product,
    quantity?: number,
    options?: { variationId?: number; campaignId?: number }
  ) => Promise<void>;
  removeItem: (
    productIdOrLineId: string | number,
    variationId?: number
  ) => Promise<void>;
  updateQuantity: (
    productIdOrLineId: string | number,
    quantity: number,
    variationId?: number
  ) => Promise<void>;
  /** Update quantity in store only (no API). For optimistic UI before debounced API call. */
  setQuantityOptimistic: (
    productIdOrLineId: string | number,
    quantity: number,
    variationId?: number
  ) => void;
  /** Replace cart with items from API (e.g. after fetchCart) */
  setItems: (items: CartItem[]) => void;
  setDeliveryOption: (option: DeliveryOption) => void;
  setAdditionalInfo: (info: string) => void;
  setCouponCode: (code: string) => void;
  clearCart: () => void;
}

function computeDerived(items: CartItem[], deliveryOption: DeliveryOption) {
  const subtotalMRP = getSubtotalMRP(items);
  const discountTotal = getDiscountTotal(items);
  const afterDiscount = subtotalMRP - discountTotal;
  const deliveryCharge = deliveryOption === "express" ? EXPRESS_DELIVERY_CHARGE : 0;
  const beforeRounding = afterDiscount + deliveryCharge;
  const amountPayable = Math.round(beforeRounding);
  const roundingOff = amountPayable - beforeRounding;

  return {
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotalMRP,
    discountTotal,
    roundingOff,
    cashbackAmount: items.length > 0 ? CASHBACK_AMOUNT : 0,
    deliveryCharge,
    amountPayable,
  };
}

const initialDerived = computeDerived([], "regular");

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  isOpen: false,
  couponCode: "",
  deliveryOption: "regular",
  additionalInfo: "",
  ...initialDerived,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  addItem: async (product, quantity = 1, options) => {
    const stateBefore = useCartStore.getState();
    const previousItems = stateBefore.items;
    const optimisticItems = buildOptimisticItemsAfterAdd(
      previousItems,
      product,
      quantity,
      options
    );
    set({
      isOpen: true,
      items: optimisticItems,
      ...computeDerived(optimisticItems, stateBefore.deliveryOption),
    });

    try {
      const items = await addToCart({
        product_id: Number(product.id),
        product_variation_id: options?.variationId,
        campaign_id:
          options?.campaignId ?? getEffectiveCampaignIdForCart(product),
        quantity,
      });
      set((state) => ({
        items,
        ...computeDerived(items, state.deliveryOption),
      }));
    } catch (err) {
      try {
        const items = await fetchCart();
        set((state) => ({
          items,
          ...computeDerived(items, state.deliveryOption),
        }));
      } catch {
        set((state) => ({
          items: previousItems,
          ...computeDerived(previousItems, state.deliveryOption),
        }));
      }
      throw err;
    }
  },

  removeItem: async (productIdOrLineId, variationId) => {
    const state = useCartStore.getState();
    const previousItems = state.items;
    let idx: number;
    let cartId: number | null = null;

    if (typeof productIdOrLineId === "number") {
      idx = findItemIndex(previousItems, productIdOrLineId);
      cartId = productIdOrLineId;
    } else {
      idx = findItemIndex(previousItems, productIdOrLineId, variationId);
      cartId = idx >= 0 ? previousItems[idx]?.lineId ?? null : null;
    }

    if (idx < 0) return;

    const optimisticItems = previousItems.filter((_, i) => i !== idx);
    set((s) => ({
      items: optimisticItems,
      ...computeDerived(optimisticItems, s.deliveryOption),
    }));

    if (cartId == null) {
      return;
    }

    try {
      const items = await removeFromCart(cartId);
      set((s) => ({
        items,
        ...computeDerived(items, s.deliveryOption),
      }));
    } catch (err) {
      try {
        const items = await fetchCart();
        set((s) => ({
          items,
          ...computeDerived(items, s.deliveryOption),
        }));
      } catch {
        set((s) => ({
          items: previousItems,
          ...computeDerived(previousItems, s.deliveryOption),
        }));
      }
      throw err;
    }
  },

  updateQuantity: async (productIdOrLineId, quantity, variationId) => {
    const q = Math.max(1, Math.min(MAX_QUANTITY, quantity));
    const state = useCartStore.getState();
    const previousItems = state.items;
    let cartId: number | null = null;
    if (typeof productIdOrLineId === "number") {
      cartId = productIdOrLineId;
    } else {
      const idx = findItemIndex(state.items, productIdOrLineId, variationId);
      cartId = idx >= 0 ? state.items[idx]?.lineId ?? null : null;
    }
    if (cartId != null) {
      try {
        const items = await updateCartQuantity(cartId, q);
        set((s) => ({
          items,
          ...computeDerived(items, s.deliveryOption),
        }));
      } catch (err) {
        try {
          const items = await fetchCart();
          set((s) => ({
            items,
            ...computeDerived(items, s.deliveryOption),
          }));
        } catch {
          set((s) => ({
            items: previousItems,
            ...computeDerived(previousItems, s.deliveryOption),
          }));
        }
        throw err;
      }
    } else {
      const idx = findItemIndex(state.items, productIdOrLineId, variationId);
      if (idx < 0) return;
      const nextItems = state.items.map((i, iIdx) =>
        iIdx === idx ? { ...i, quantity: q } : i
      );
      set((s) => ({
        items: nextItems,
        ...computeDerived(nextItems, s.deliveryOption),
      }));
    }
  },

  setQuantityOptimistic: (productIdOrLineId, quantity, variationId) => {
    const q = Math.max(1, Math.min(MAX_QUANTITY, quantity));
    set((state) => {
      const idx = findItemIndex(state.items, productIdOrLineId, variationId);
      if (idx < 0) return state;
      const nextItems = state.items.map((i, iIdx) =>
        iIdx === idx ? { ...i, quantity: q } : i
      );
      return {
        items: nextItems,
        ...computeDerived(nextItems, state.deliveryOption),
      };
    });
  },

  setDeliveryOption: (option) =>
    set((state) => ({
      deliveryOption: option,
      ...computeDerived(state.items, option),
    })),

  setAdditionalInfo: (info) => set({ additionalInfo: info }),
  setCouponCode: (code) => set({ couponCode: code }),
  setItems: (items) =>
    set((state) => ({
      items,
      ...computeDerived(items, state.deliveryOption),
    })),
  clearCart: () =>
    set((state) => ({
      items: [],
      ...computeDerived([], state.deliveryOption),
    })),
}));

export function useCartItemCount(): number {
  return useCartStore((s) => s.itemCount);
}

export function useCartTotals() {
  return useCartStore((s) => ({
    itemCount: s.itemCount,
    subtotalMRP: s.subtotalMRP,
    discountTotal: s.discountTotal,
    roundingOff: s.roundingOff,
    cashbackAmount: s.cashbackAmount,
    deliveryCharge: s.deliveryCharge,
    amountPayable: s.amountPayable,
  }));
}
