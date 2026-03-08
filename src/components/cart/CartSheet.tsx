"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatPriceSymbol } from "@/lib/utils";
import { useAddressStore } from "@/store/address-store";
import {
  useCartStore,
  type DeliveryOption
} from "@/store/cart-store";
import {
  Bike,
  ChevronRight,
  Home,
  Info,
  Pencil,
  Rocket,
  ShoppingCart,
  Zap
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CartLineItem from "./CartLineItem";

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
  const deliveryOption = useCartStore((s) => s.deliveryOption);
  const setDeliveryOption = useCartStore((s) => s.setDeliveryOption);
  const additionalInfo = useCartStore((s) => s.additionalInfo);
  const setAdditionalInfo = useCartStore((s) => s.setAdditionalInfo);
  const clearCart = useCartStore((s) => s.clearCart);

  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const openAddressModal = useAddressStore((s) => s.openAddressModal);

  const handleOpenChange = (open: boolean) => {
    if (!open) closeCart();
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    toast.success("Order placed (demo). Checkout API can be wired later.");
    clearCart();
    closeCart();
  };

  const expressDate = new Date();
  expressDate.setDate(expressDate.getDate() + 1);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col gap-0 p-0 sm:max-w-md"
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
                    key={item.lineId ?? item.product.id}
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
                  {selectedAddress ? (
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

                {/* Coupon & Savings */}
                <section className="mt-4">
                  <button
                    type="button"
                    className="text-sm text-primary underline hover:no-underline"
                  >
                    Have coupon code ?
                  </button>
                  <div className="mt-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
                    <p className="flex items-center gap-1.5 text-sm">
                      <span className="text-primary">৳</span>
                      You are saving {formatPriceSymbol(Math.round(discountTotal))} in
                      this order.
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm">
                      <span className="text-primary">৳</span>
                      You will receive {formatPriceSymbol(cashbackAmount)} cashback
                      after delivery.
                    </p>
                  </div>
                </section>

                {/* Order summary */}
                <section className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal (MRP)</span>
                    <span>{formatPriceSymbol(subtotalMRP)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Discount Applied</span>
                    <span>-{formatPriceSymbol(Math.abs(discountTotal))}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Rounding Off</span>
                    <span>-{formatPriceSymbol(Math.abs(roundingOff))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Charge
                      {deliveryOption === "regular" ? " (Regular Delivery)" : ""}
                    </span>
                    <span
                      className={
                        deliveryCharge === 0 ? "text-primary" : undefined
                      }
                    >
                      {deliveryCharge === 0 ? "Free" : formatPriceSymbol(deliveryCharge)}
                    </span>
                  </div>
                </section>

                {/* Delivery options */}
                <section className="mt-4">
                  <p className="mb-2 text-sm font-medium">Delivery option</p>
                  <RadioGroup
                    value={deliveryOption}
                    onValueChange={(v) => setDeliveryOption(v as DeliveryOption)}
                    className="space-y-3"
                  >
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                        deliveryOption === "regular" && "border-primary bg-primary/5"
                      )}
                    >
                      <RadioGroupItem value="regular" className="mt-0.5" />
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                          <Bike className="size-3.5" />
                          Regular Delivery
                        </span>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Delivery Charge (First Order)
                        </p>
                        <p className="text-sm font-medium text-primary">Free</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Info className="size-3.5" />
                          Free Delivery Above 1999 Taka Order
                        </p>
                      </div>
                    </label>
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                        deliveryOption === "express" && "border-primary bg-primary/5"
                      )}
                    >
                      <RadioGroupItem value="express" className="mt-0.5" />
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          <Rocket className="size-3.5" />
                          Express Delivery
                        </span>
                        <p className="mt-1 text-sm">
                          {formatPriceSymbol(59)} · Delivery{" "}
                          {expressDate.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          , between 8am to 12pm
                        </p>
                      </div>
                    </label>
                  </RadioGroup>
                </section>

                {/* Amount Payable */}
                <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
                  <span className="text-sm font-medium">Amount Payable</span>
                  <span className="text-lg font-semibold">
                    {formatPriceSymbol(amountPayable)}
                  </span>
                </div>

                {/* Terms */}
                <p className="mt-4 text-xs text-muted-foreground">
                  By continuing you agree to{" "}
                  <Link href="#" className="text-primary underline">
                    Terms & Conditions
                  </Link>
                  ,{" "}
                  <Link href="#" className="text-primary underline">
                    Privacy Policy
                  </Link>{" "}
                  &{" "}
                  <Link href="#" className="text-primary underline">
                    Refund-Return Policy
                  </Link>
                </p>

                {/* Flash sale card */}
                <div className="mt-4 flex items-center justify-between rounded-lg border bg-warning/10 p-3">
                  <div className="flex items-center gap-2">
                    <Zap className="size-5 text-warning" />
                    <div>
                      <p className="text-sm font-semibold">FLASH SALE</p>
                      <p className="text-xs text-muted-foreground">
                        Save up to 83%
                      </p>
                    </div>
                    <Badge variant="destructive" className="text-[10px]">
                      • Live
                    </Badge>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </div>
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
              <span className="font-semibold">{formatPriceSymbol(amountPayable)}</span>
            </div>
            <Button
              onClick={handlePlaceOrder}
              className="gap-1.5 bg-primary hover:bg-primary/90"
            >
              Place Order
              <ChevronRight className="size-4" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
