import { create } from "zustand";

export interface PaymentOrderSummary {
  orderId: string;
  orderAt: string;
  subtotalMRP: number;
  deliveryLabel: string;
  deliveryCharge: number;
  discountApplied: number;
  roundingOff: number;
  amountPayable: number;
  amountPaid: number;
  savings: number;
}

interface PaymentModalState {
  isOpen: boolean;
  orderSummary: PaymentOrderSummary | null;
  openPaymentModal: (summary: PaymentOrderSummary) => void;
  closePaymentModal: () => void;
}

export const usePaymentModalStore = create<PaymentModalState>((set) => ({
  isOpen: false,
  orderSummary: null,

  openPaymentModal: (summary) =>
    set({ isOpen: true, orderSummary: summary }),

  closePaymentModal: () =>
    set({ isOpen: false, orderSummary: null }),
}));
