import type { PlacedOrderData } from "@/lib/api/orders";
import { create } from "zustand";

interface PaymentModalState {
  isOpen: boolean;
  /** Placed order data from POST /orders/place */
  placedOrder: PlacedOrderData | null;
  openPaymentModal: (order: PlacedOrderData) => void;
  closePaymentModal: () => void;
}

export const usePaymentModalStore = create<PaymentModalState>((set) => ({
  isOpen: false,
  placedOrder: null,

  openPaymentModal: (order) =>
    set({ isOpen: true, placedOrder: order }),

  closePaymentModal: () =>
    set({ isOpen: false, placedOrder: null }),
}));
