import { create } from "zustand";

export interface AppliedCoupon {
  id: number;
  code: string;
  discount_amount: number;
  discount_type: string;
  valid_until: string;
}

interface CouponState {
  appliedCoupon: AppliedCoupon | null;
  isLoading: boolean;
  error: string | null;
  applyCoupon: (couponCode: string) => Promise<{ success: true } | { success: false; message: string }>;
  resetCoupon: () => void;
  setError: (error: string | null) => void;
}

export const useCouponStore = create<CouponState>((set) => ({
  appliedCoupon: null,
  isLoading: false,
  error: null,

  applyCoupon: async (couponCode: string) => {
    const code = couponCode.trim();
    if (!code) {
      const msg = "Please enter a coupon code";
      set({ error: msg });
      return { success: false, message: msg };
    }
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/apply-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("access_token")
            ? { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
            : {}),
        },
        body: JSON.stringify({ coupon_code: code }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (json.message as string) || "Failed to apply coupon";
        set({
          isLoading: false,
          error: msg,
          appliedCoupon: null,
        });
        return { success: false, message: msg };
      }
      if (json.status === 200 && json.data) {
        set({
          appliedCoupon: json.data as AppliedCoupon,
          isLoading: false,
          error: null,
        });
        return { success: true };
      }
      const msg = (json.message as string) || "Invalid coupon";
      set({
        isLoading: false,
        error: msg,
        appliedCoupon: null,
      });
      return { success: false, message: msg };
    } catch {
      const msg = "Failed to apply coupon";
      set({
        isLoading: false,
        error: msg,
        appliedCoupon: null,
      });
      return { success: false, message: msg };
    }
  },

  resetCoupon: () =>
    set({ appliedCoupon: null, error: null }),

  setError: (error) => set({ error }),
}));
