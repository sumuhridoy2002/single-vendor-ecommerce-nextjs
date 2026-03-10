"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPriceSymbol } from "@/lib/utils";
import { usePaymentModalStore } from "@/store/payment-modal-store";
import { Check, ChevronDown, Info, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/** Placeholder logos - use actual image URLs or SVG for bKash / cards in production */
function BKashLogo() {
  return (
    <div className="flex h-8 w-14 items-center justify-center rounded bg-[#E2136E] text-[10px] font-bold text-white">
      bKash
    </div>
  );
}

function CardsLogo() {
  return (
    <div className="flex h-8 items-center gap-0.5">
      <span className="rounded border bg-[#1A1F71] px-1.5 py-0.5 text-[9px] font-medium text-white">Visa</span>
      <span className="rounded border bg-[#EB001B] px-1 py-0.5 text-[9px] font-medium text-white">MC</span>
      <span className="rounded border bg-[#006FCF] px-1 py-0.5 text-[9px] font-medium text-white">AMEX</span>
      <span className="rounded border bg-muted px-1 py-0.5 text-[9px] text-muted-foreground">+2</span>
    </div>
  );
}

export function PaymentModal() {
  const { isOpen, placedOrder, closePaymentModal } = usePaymentModalStore();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);

  if (!placedOrder) return null;

  const { order_no, tracking_no, shipping_info, amounts, status, items, date } =
    placedOrder;
  const savings = amounts.discount;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closePaymentModal()}>
      <DialogContent
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-[min(100vw-2rem,28rem)] flex-col gap-0 p-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 flex flex-row items-center justify-between border-b px-4 py-3">
          <DialogTitle className="text-lg">Payment</DialogTitle>
          <button
            type="button"
            onClick={() => closePaymentModal()}
            className="rounded-md opacity-70 hover:opacity-100 transition-opacity p-1 -m-1"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-6 px-4 py-4">
            {/* Order confirmation */}
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-8" strokeWidth={2.5} />
              </div>
              <p className="mt-3 text-lg font-semibold">Congratulations!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Order placed successfully by &quot;{status.payment_method}&quot;
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 font-medium text-primary">
                  <Check className="size-4" />
                  {status.order.charAt(0).toUpperCase() + status.order.slice(1)}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-4 rounded-full border-2 border-primary bg-primary/20" />
                  {status.payment.charAt(0).toUpperCase() + status.payment.slice(1)}
                </span>
              </div>
              <button
                type="button"
                className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
                onClick={() => setShowDetails(!showDetails)}
              >
                View details
                <ChevronDown
                  className={`size-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {/* Do you want to pay now? */}
            {/* <section>
              <p className="mb-3 text-sm font-medium">Do you want to pay now?</p>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                <label className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="bkash" className="border-muted-foreground" />
                    <span className="text-sm font-medium">bKash</span>
                  </div>
                  <BKashLogo />
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="cards" className="border-muted-foreground" />
                    <span className="text-sm font-medium">Cards & Others</span>
                  </div>
                  <CardsLogo />
                </label>
              </RadioGroup>
            </section> */}

            {/* Payment Details */}
            <section>
              <h3 className="mb-3 text-sm font-medium">Payment Details</h3>
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/50 bg-warning/10 px-3 py-2">
                <Info className="size-5 shrink-0 text-warning" />
                <p className="text-sm">
                  You are saving {formatPriceSymbol(savings)} in this order
                </p>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Order No</dt>
                  <dd className="font-medium">{order_no}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tracking No</dt>
                  <dd className="font-medium">{tracking_no}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium">{date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPriceSymbol(amounts.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-destructive">
                  <dt>Discount</dt>
                  <dd>- {formatPriceSymbol(amounts.discount)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{formatPriceSymbol(amounts.shipping)}</dd>
                </div>
                <div className="flex justify-between font-medium">
                  <dt>Grand Total</dt>
                  <dd>{formatPriceSymbol(amounts.grand_total)}</dd>
                </div>
              </dl>

              {showDetails && (
                <>
                  <h4 className="mt-4 mb-2 text-sm font-medium">Shipping</h4>
                  <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                    <p className="font-medium">{shipping_info.receiver_name}</p>
                    <p className="text-muted-foreground">{shipping_info.receiver_phone}</p>
                    <p className="text-muted-foreground">{shipping_info.address}</p>
                    <p className="text-muted-foreground">{shipping_info.city}</p>
                  </div>
                  <h4 className="mt-4 mb-2 text-sm font-medium">Items</h4>
                  <ul className="space-y-2 rounded-lg border bg-muted/30 p-3 text-sm">
                    {items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-2">
                        <span className="min-w-0 flex-1 truncate">
                          {item.product_name}
                          {item.variation ? ` · ${item.variation}` : ""} × {item.quantity}
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatPriceSymbol(item.total_price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          </div>
        </div>

        {/* Footer actions */}
        <div className="shrink-0 flex flex-col gap-2 border-t bg-background p-4">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => {
              /* Wire to payment gateway */
            }}
          >
            Pay Online: {formatPriceSymbol(amounts.grand_total)}
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link
              href={`/account/orders/track/${encodeURIComponent(tracking_no)}`}
              onClick={() => closePaymentModal()}
            >
              Track Order
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
