import { create } from "zustand";
import type { Product } from "@/types/product";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/api/cart";

export type DeliveryOption = "regular" | "express";

export interface CartItem {
  /** Cart line id from API (when synced from server) */
  lineId?: number;
  product: Product;
  quantity: number;
}

const MAX_QUANTITY = 10;
const EXPRESS_DELIVERY_CHARGE = 59;
const CASHBACK_AMOUNT = 10;

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
  removeItem: (productIdOrLineId: string | number) => Promise<void>;
  updateQuantity: (
    productIdOrLineId: string | number,
    quantity: number
  ) => Promise<void>;
  /** Update quantity in store only (no API). For optimistic UI before debounced API call. */
  setQuantityOptimistic: (
    productIdOrLineId: string | number,
    quantity: number
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

export const useCartStore = create<CartState>((set) => ({
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
    const items = await addToCart({
      product_id: Number(product.id),
      product_variation_id: options?.variationId,
      campaign_id: options?.campaignId,
      quantity,
    });
    set((state) => ({
      items,
      ...computeDerived(items, state.deliveryOption),
    }));
  },

  removeItem: async (productIdOrLineId) => {
    const state = useCartStore.getState();
    let cartId: number | null = null;
    if (typeof productIdOrLineId === "number") {
      cartId = productIdOrLineId;
    } else {
      const item = state.items.find(
        (i) => i.product.id === productIdOrLineId
      );
      cartId = item?.lineId ?? null;
    }
    if (cartId != null) {
      const items = await removeFromCart(cartId);
      set((s) => ({
        items,
        ...computeDerived(items, s.deliveryOption),
      }));
    } else {
      const nextItems = state.items.filter(
        (i) => i.product.id !== productIdOrLineId
      );
      set((s) => ({
        items: nextItems,
        ...computeDerived(nextItems, s.deliveryOption),
      }));
    }
  },

  updateQuantity: async (productIdOrLineId, quantity) => {
    const q = Math.max(1, Math.min(MAX_QUANTITY, quantity));
    const state = useCartStore.getState();
    let cartId: number | null = null;
    if (typeof productIdOrLineId === "number") {
      cartId = productIdOrLineId;
    } else {
      const item = state.items.find(
        (i) => i.product.id === productIdOrLineId
      );
      cartId = item?.lineId ?? null;
    }
    if (cartId != null) {
      const items = await updateCartQuantity(cartId, q);
      set((s) => ({
        items,
        ...computeDerived(items, s.deliveryOption),
      }));
    } else {
      const nextItems = state.items.map((i) => {
        const match = i.product.id === productIdOrLineId;
        return match ? { ...i, quantity: q } : i;
      });
      set((s) => ({
        items: nextItems,
        ...computeDerived(nextItems, s.deliveryOption),
      }));
    }
  },

  setQuantityOptimistic: (productIdOrLineId, quantity) => {
    const q = Math.max(1, Math.min(MAX_QUANTITY, quantity));
    set((state) => {
      const nextItems = state.items.map((i) => {
        const match =
          typeof productIdOrLineId === "number"
            ? i.lineId === productIdOrLineId
            : i.product.id === productIdOrLineId;
        return match ? { ...i, quantity: q } : i;
      });
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
