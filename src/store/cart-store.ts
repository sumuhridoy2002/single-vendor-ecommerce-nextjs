import { create } from "zustand";
import type { Product } from "@/types/product";

export type DeliveryOption = "regular" | "express";

export interface CartItem {
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
  isRecurringPurchase: boolean;

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
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDeliveryOption: (option: DeliveryOption) => void;
  setAdditionalInfo: (info: string) => void;
  setRecurringPurchase: (value: boolean) => void;
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
  isRecurringPurchase: false,
  ...initialDerived,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      let nextItems: CartItem[];
      if (existing) {
        nextItems = state.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(MAX_QUANTITY, i.quantity + quantity) }
            : i
        );
      } else {
        nextItems = [...state.items, { product, quantity: Math.min(MAX_QUANTITY, quantity) }];
      }
      const derived = computeDerived(nextItems, state.deliveryOption);
      return { items: nextItems, ...derived };
    }),

  removeItem: (productId) =>
    set((state) => {
      const nextItems = state.items.filter((i) => i.product.id !== productId);
      const derived = computeDerived(nextItems, state.deliveryOption);
      return { items: nextItems, ...derived };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      const q = Math.max(1, Math.min(MAX_QUANTITY, quantity));
      const nextItems = state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity: q } : i
      );
      const derived = computeDerived(nextItems, state.deliveryOption);
      return { items: nextItems, ...derived };
    }),

  setDeliveryOption: (option) =>
    set((state) => ({
      deliveryOption: option,
      ...computeDerived(state.items, option),
    })),

  setAdditionalInfo: (info) => set({ additionalInfo: info }),
  setRecurringPurchase: (value) => set({ isRecurringPurchase: value }),
  setCouponCode: (code) => set({ couponCode: code }),
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
