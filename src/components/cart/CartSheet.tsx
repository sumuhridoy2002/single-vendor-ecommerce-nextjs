"use client";

import { PolicyConsentLinks } from "@/components/legal/PolicyLinks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchCheckoutSummary,
  type CheckoutSummaryData,
} from "@/lib/api/checkout";
import { placeOrder } from "@/lib/api/orders";
import { cn, formatPriceSymbol } from "@/lib/utils";
import { useAddressStore } from "@/store/address-store";
import { useCartStore } from "@/store/cart-store";
import { useCouponStore } from "@/store/coupon-store";
import { usePaymentModalStore } from "@/store/payment-modal-store";
import { ChevronRight, Home, Pencil, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import FlashSale from "../category/FlashSale";
import CartLineItem from "./CartLineItem";

type PaymentMethodOption = "cod" | "bkash";

const PAYMENT_OPTIONS: {
  id: PaymentMethodOption;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
}[] = [
  {
    id: "cod",
    title: "Cash on Delivery",
    subtitle: "Pay when you receive your order",
    imageSrc: "/assets/images/cash-on-delivery.png",
    imageAlt: "Cash on delivery",
  },
  {
    id: "bkash",
    title: "bKash",
    subtitle: "Mobile payment — you will be redirected to pay",
    imageSrc: "/assets/images/bKash-icon-logo.png",
    imageAlt: "bKash",
  },
];

export function CartSheet() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount);
  const subtotalMRP = useCartStore((s) => s.subtotalMRP);
  const discountTotal = useCartStore((s) => s.discountTotal);
  const roundingOff = useCartStore((s) => s.roundingOff);
  const cashbackAmount = useCartStore((s) => s.cashbackAmount);
  const deliveryCharge = useCartStore((s) => s.deliveryCharge);
  const amountPayable = useCartStore((s) => s.amountPayable);
  const additionalInfo = useCartStore((s) => s.additionalInfo);
  const setAdditionalInfo = useCartStore((s) => s.setAdditionalInfo);
  const clearCart = useCartStore((s) => s.clearCart);

  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const openAddressModal = useAddressStore((s) => s.openAddressModal);
  const addressModalOpen = useAddressStore((s) => s.modalOpen);

  const appliedCoupon = useCouponStore((s) => s.appliedCoupon);
  const couponLoading = useCouponStore((s) => s.isLoading);
  const applyCoupon = useCouponStore((s) => s.applyCoupon);
  const resetCoupon = useCouponStore((s) => s.resetCoupon);

  const openPaymentModal = usePaymentModalStore((s) => s.openPaymentModal);

  const [couponInput, setCouponInput] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>("cod");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummaryData | null>(
    null
  );
  const [summaryLoading, setSummaryLoading] = useState(false);
  const prevAddressModalOpen = useRef(addressModalOpen);

  const cartFingerprint = useMemo(
    () =>
      items
        .map((i) => `${i.lineId ?? i.product.id}-${i.variation?.id ?? "x"}-${i.quantity}`)
        .join("|"),
    [items]
  );

  const loadCheckoutSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await fetchCheckoutSummary();
      setCheckoutSummary(data);
    } catch {
      setCheckoutSummary(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setCheckoutSummary(null);
      return;
    }
    void loadCheckoutSummary();
  }, [
    isOpen,
    cartFingerprint,
    selectedAddress?.id,
    loadCheckoutSummary,
    items.length,
  ]);

  useEffect(() => {
    if (prevAddressModalOpen.current && !addressModalOpen && isOpen && items.length > 0) {
      void loadCheckoutSummary();
    }
    prevAddressModalOpen.current = addressModalOpen;
  }, [addressModalOpen, isOpen, items.length, loadCheckoutSummary]);

  const afterProductDiscount = subtotalMRP - discountTotal;
  /** Subtotal basis for coupon: API checkout subtotal when available, else cart-derived. */
  const subtotalForCoupon = checkoutSummary?.amounts.subtotal ?? afterProductDiscount;
  const couponDiscountAmount = appliedCoupon
    ? appliedCoupon.discount_type === "percentage"
      ? (subtotalForCoupon * appliedCoupon.discount_amount) / 100
      : Math.min(appliedCoupon.discount_amount, subtotalForCoupon)
    : 0;
  const afterCoupon = subtotalForCoupon - couponDiscountAmount;
  const effectiveDeliveryCharge =
    checkoutSummary != null ? checkoutSummary.amounts.shipping_charge : deliveryCharge;
  const beforeRoundingWithCoupon = afterCoupon + effectiveDeliveryCharge;
  const amountPayableWithCoupon = Math.round(beforeRoundingWithCoupon);
  const roundingOffWithCoupon = amountPayableWithCoupon - beforeRoundingWithCoupon;

  const hasCheckoutSummary = checkoutSummary != null;
  const displayPayable = appliedCoupon
    ? amountPayableWithCoupon
    : hasCheckoutSummary
      ? checkoutSummary.amounts.payable_total
      : amountPayable;
  const roundingForDisplay = appliedCoupon
    ? roundingOffWithCoupon
    : hasCheckoutSummary
      ? checkoutSummary.amounts.payable_total -
      checkoutSummary.amounts.subtotal -
      checkoutSummary.amounts.shipping_charge
      : roundingOff;

  const handleOpenChange = (open: boolean) => {
    if (!open) closeCart();
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    if (!checkoutSummary?.shipping_address && !selectedAddress) {
      toast.error("Please select a shipping address.");
      return;
    }
    const addressId =
      checkoutSummary?.shipping_address?.id ?? Number(selectedAddress?.id);
    if (addressId == null || Number.isNaN(addressId)) {
      toast.error("Invalid address. Please select a valid address.");
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await placeOrder({
        address_id: addressId,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon?.code,
      });

      const redirectUrl = res.redirect_url?.trim();
      if (paymentMethod === "bkash" && redirectUrl) {
        resetCoupon();
        clearCart();
        closeCart();
        toast.success(res.message ?? "Redirecting to bKash…");
        window.location.assign(redirectUrl);
        return;
      }

      openPaymentModal(res.data);
      resetCoupon();
      clearCart();
      closeCart();
      if (paymentMethod === "bkash" && !redirectUrl) {
        toast.success(res.message ?? "Order placed successfully.", {
          description:
            "No redirect URL was returned. Complete bKash payment from your order or contact support if needed.",
        });
      } else {
        toast.success(res.message ?? "Order placed successfully.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleApplyCoupon = async () => {
    const result = await applyCoupon(couponInput);
    if (result.success) {
      toast.success("Coupon applied successfully");
      setShowCouponInput(false);
      setCouponInput("");
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    resetCoupon();
    setShowCouponInput(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 p-0 w-full sm:max-w-md"
      >
        <SheetHeader className="shrink-0 border-b px-4 py-3">
          <SheetTitle className="text-lg">Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Your cart is empty
              </p>
            ) : (
              <div className="space-y-3 py-2">
                {items.map((item) => (
                  <CartLineItem
                    key={`${item.lineId ?? "local"}-${item.product.id}-${item.variation?.id ?? "default"}`}
                    item={item}
                  />
                ))}
              </div>
            )}

            {items.length > 0 && (
              <>
                {/* Shipping Address */}
                <section className="mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Shipping Address</h3>
                    <button
                      type="button"
                      onClick={openAddressModal}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Pencil className="size-3.5" />
                      Change
                    </button>
                  </div>
                  {checkoutSummary?.shipping_address ? (
                    <div className="mt-2 flex gap-2 rounded-lg border bg-muted/30 p-3">
                      <Home className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 text-sm">
                        <p className="font-medium">
                          {checkoutSummary.shipping_address.receiver_name}
                        </p>
                        <p className="text-muted-foreground">
                          {checkoutSummary.shipping_address.receiver_phone}
                        </p>
                        <p className="text-muted-foreground">
                          {[
                            checkoutSummary.shipping_address.address_line,
                            checkoutSummary.shipping_address.city,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  ) : selectedAddress ? (
                    <div className="mt-2 flex gap-2 rounded-lg border bg-muted/30 p-3">
                      <Home className="size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 text-sm">
                        <p className="font-medium">{selectedAddress.fullName}</p>
                        <p className="text-muted-foreground">
                          {selectedAddress.phone}
                        </p>
                        <p className="text-muted-foreground">
                          {selectedAddress.deliveryArea}, {selectedAddress.address}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No address selected. Click Change to add one.
                    </p>
                  )}
                  <Textarea
                    placeholder="Write here any additional info"
                    className="mt-2 min-h-16"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                </section>

                {/* Payment method */}
                <section className="mt-6">
                  <h3 className="text-sm font-medium">Payment Method</h3>
                  <div className="mt-2 space-y-3">
                    {PAYMENT_OPTIONS.map((opt) => {
                      const selected = paymentMethod === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          aria-pressed={selected}
                          aria-label={`${opt.title}. ${selected ? "Selected" : "Not selected"}.`}
                          onClick={() => setPaymentMethod(opt.id)}
                          className={cn(
                            "relative w-full rounded-xl border border-border bg-card p-4 text-left flex gap-3 transition-colors",
                            "hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            selected && "border-primary bg-primary/5 ring-1 ring-primary/20"
                          )}
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted/50">
                            <Image
                              src={opt.imageSrc}
                              alt={opt.imageAlt}
                              fill
                              className="object-contain p-1"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{opt.title}</p>
                            <p className="text-sm text-muted-foreground">{opt.subtitle}</p>
                          </div>
                          <div className="shrink-0 flex items-center self-center">
                            <span
                              className={cn(
                                "rounded-full border-2 w-5 h-5 flex items-center justify-center transition-colors",
                                selected
                                  ? "border-primary"
                                  : "border-muted-foreground/40 hover:border-primary"
                              )}
                              aria-hidden
                            >
                              {selected && (
                                <span className="rounded-full bg-primary w-2.5 h-2.5 block" />
                              )}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Coupon & Savings */}
                <section className="mt-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-lg border border-primary/40 bg-primary/5 p-3">
                      <div>
                        <p className="text-sm font-medium text-primary">
                          Coupon applied: {appliedCoupon.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appliedCoupon.discount_type === "percentage"
                            ? `${appliedCoupon.discount_amount}% off`
                            : `${formatPriceSymbol(appliedCoupon.discount_amount)} off`}{" "}
                          · Valid until {appliedCoupon.valid_until}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={handleRemoveCoupon}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : showCouponInput ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyCoupon()
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                        >
                          {couponLoading ? "Applying..." : "Apply"}
                        </Button>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:underline"
                        onClick={() => setShowCouponInput(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-sm text-primary underline hover:no-underline"
                      onClick={() => setShowCouponInput(true)}
                    >
                      Have coupon code ?
                    </button>
                  )}
                  <div className="mt-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                    <p className="flex items-center gap-1.5 text-sm">
                      <span className="text-primary">৳</span>
                      You are saving {formatPriceSymbol(Math.round(discountTotal + couponDiscountAmount))} in
                      this order.
                    </p>
                    {/* <p className="mt-1 flex items-center gap-1.5 text-sm">
                      <span className="text-primary">৳</span>
                      You will receive {formatPriceSymbol(cashbackAmount)} cashback
                      after delivery.
                    </p> */}
                  </div>
                </section>

                {/* Order summary */}
                <section className="mt-4 space-y-1.5 text-sm">
                  {hasCheckoutSummary ? (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPriceSymbol(checkoutSummary.amounts.subtotal)}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal (MRP)</span>
                        <span>{formatPriceSymbol(subtotalMRP)}</span>
                      </div>
                      <div className="flex justify-between text-destructive">
                        <span>Discount Applied</span>
                        <span>-{formatPriceSymbol(Math.abs(discountTotal))}</span>
                      </div>
                    </>
                  )}
                  {appliedCoupon && couponDiscountAmount > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span>-{formatPriceSymbol(couponDiscountAmount)}</span>
                    </div>
                  )}
                  {Math.abs(roundingForDisplay) > 0.001 && (
                    <div className="flex justify-between text-destructive">
                      <span>Rounding Off</span>
                      <span>
                        -{formatPriceSymbol(Math.abs(roundingForDisplay))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span
                      className={
                        effectiveDeliveryCharge === 0 ? "text-primary" : undefined
                      }
                    >
                      {effectiveDeliveryCharge === 0
                        ? "Free"
                        : formatPriceSymbol(effectiveDeliveryCharge)}
                    </span>
                  </div>
                </section>

                {/* Terms */}
                <p className="mt-4 text-xs text-muted-foreground">
                  By continuing you agree to{" "}
                  <PolicyConsentLinks
                    enabled={isOpen}
                    linkClassName="text-primary underline"
                  />
                </p>

                {/* Flash sale card */}
                <Link href="/flash-sale" onClick={() => closeCart()} className="mt-4 flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <FlashSale />
                    <Badge variant="destructive" className="text-[10px]">
                      • Live
                    </Badge>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              </>
            )}
          </div>
        </div>

        {items.length > 0 && (
          <SheetFooter className="shrink-0 flex-row items-center justify-between gap-4 border-t bg-background px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <ShoppingCart className="size-5 text-muted-foreground" />
              <span>
                {itemCount} item{itemCount !== 1 ? "s" : ""}
              </span>
              <span className="font-semibold">{formatPriceSymbol(displayPayable)}</span>
            </div>
            <Button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="gap-1.5 bg-primary hover:bg-primary/90"
            >
              {placingOrder ? "Placing…" : "Place Order"}
              <ChevronRight className="size-4" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
