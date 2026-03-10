"use client";

import { Button } from "@/components/ui/button";
import { OrderTracking } from "@/components/ui/order-tracking";
import { getTrackOrder, type TrackOrderHistoryItem } from "@/lib/api/orders";
import { formatPriceSymbol } from "@/lib/utils";
import {
  Bike,
  Home,
  Loader2,
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PlacedOrderData } from "@/lib/api/orders";

const TRACK_BASE = "/account/orders/track";

/** Show "---:---" when time is empty or looks like a status (e.g. "Pending") */
function formatStepTime(time: string): string {
  const trimmed = (time || "").trim();
  if (!trimmed) return "---:---";
  if (/^(pending|confirmed|packing|packed|delivering|delivered|cancelled)$/i.test(trimmed))
    return "---:---";
  return trimmed;
}

export default function TrackOrderResultPage() {
  const params = useParams();
  const trackingNo = params?.tracking_no as string | undefined;
  const [order, setOrder] = useState<PlacedOrderData | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<TrackOrderHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackingNo) return;

    const decoded = decodeURIComponent(trackingNo);
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    getTrackOrder(decoded)
      .then((res) => {
        if (!cancelled) {
          setOrder(res.data);
          setTrackingHistory(res.tracking_history ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(
            err instanceof Error ? err.message : "Failed to load tracking info."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [trackingNo]);

  const isLoading = !!trackingNo && loading;

  if (isLoading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="size-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading tracking details…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-md text-center">
          <Package className="size-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Order not found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn’t find an order with this tracking number. Please check
            and try again.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" asChild>
              <Link href={TRACK_BASE} className="gap-2">
                <ArrowLeft className="size-4" />
                Track another order
              </Link>
            </Button>
            <Button asChild>
              <Link href="/account/orders">My orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const shipping = order.shipping_info;
  const addressLine = [shipping.address, shipping.city]
    .filter(Boolean)
    .join(", ");

  const handleCopyOrderNo = () => {
    const text = order.order_no;
    navigator.clipboard.writeText(text).then(
      () => toast.success("Order number copied"),
      () => toast.error("Failed to copy")
    );
  };

  return (
    <div className="container py-6 md:py-10">
      {/* Header: View Order : #order_no + copy + Back to Orders */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">
            View Order : #{order.order_no}
          </h1>
          <button
            type="button"
            onClick={handleCopyOrderNo}
            className="rounded border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Copy order number"
          >
            <Copy className="size-4" />
          </button>
        </div>
        <Button variant="ghost" size="sm" asChild className="mt-2 -ml-2">
          <Link href="/account/orders" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
        {/* Left: Timeline */}
        <div className="rounded-xl border border-border bg-card p-5 md:p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Timeline</h2>
          <OrderTracking
            steps={trackingHistory.map((step, index) => ({
              name: step.title,
              timestamp: formatStepTime(step.time),
              isCompleted: index < trackingHistory.length - 1,
            }))}
          />
        </div>

        {/* Right: Order summary */}
        <div className="space-y-4 lg:space-y-5">
          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Order number
                </p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  #{order.order_no}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Tracking: {order.tracking_no}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="rounded-full border px-2.5 py-1 text-xs font-medium capitalize">
                  {order.status.order}
                </span>
                <span className="rounded-full border border-green-600 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400 flex items-center gap-1">
                  <Bike className="size-3" />
                  {order.status.payment_method}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{order.date}</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              Delivery address
            </h3>
            <div className="flex gap-2 text-sm">
              <Home className="size-4 shrink-0 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">
                  {shipping.receiver_name}
                </p>
                <p className="text-muted-foreground">
                  {shipping.receiver_phone}
                </p>
                <p className="text-muted-foreground">{addressLine}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CreditCard className="size-4 text-primary" />
              Payment Details
            </h3>
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/50 bg-warning/10 px-3 py-2">
              <p className="text-sm">
                You are saving {formatPriceSymbol(order.amounts.discount)} in this order
              </p>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Order ID</dt>
                <dd className="font-medium">#{order.order_no}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Order At</dt>
                <dd className="font-medium">{order.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal (MRP)</dt>
                <dd>{formatPriceSymbol(order.amounts.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-destructive">
                <dt>Discount applied</dt>
                <dd>- {formatPriceSymbol(order.amounts.discount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{formatPriceSymbol(order.amounts.shipping)}</dd>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <dt>Amount Payable</dt>
                <dd>{formatPriceSymbol(order.amounts.grand_total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Amount Paid</dt>
                <dd>৳0</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 md:p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Items ({order.items.length})
            </h3>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-2 text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {item.product_name}
                    {item.variation ? ` · ${item.variation}` : ""} ×{" "}
                    {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {formatPriceSymbol(item.total_price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link href={`/account/orders/${order.id}`}>
              View full order details
            </Link>
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        If you have any query,{" "}
        <Link href="/account/faq" className="text-primary underline hover:no-underline">
          contact support
        </Link>
        .
      </p>
    </div>
  );
}
