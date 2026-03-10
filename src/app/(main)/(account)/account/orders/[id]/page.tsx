"use client";

import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/api/orders";
import { formatPriceSymbol } from "@/lib/utils";
import { Bike, Home, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { PlacedOrderData } from "@/lib/api/orders";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [order, setOrder] = useState<PlacedOrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    getOrderById(id)
      .then((res) => {
        if (!cancelled) setOrder(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load order.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const isLoading = !!id && loading;

  if (isLoading) {
    return (
      <div className="container py-6 md:py-8">
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-6 md:py-8">
        <p className="text-muted-foreground">Order not found.</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/account/orders">
            <ArrowLeft className="size-4 mr-1" />
            Back to orders
          </Link>
        </Button>
      </div>
    );
  }

  const shipping = order.shipping_info;
  const addressLine = [shipping.address, shipping.city].filter(Boolean).join(", ");

  return (
    <div className="container py-6 md:py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/account/orders" className="gap-1.5">
          <ArrowLeft className="size-4" />
          Back to orders
        </Link>
      </Button>

      <div className="rounded-xl border border-border bg-card p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Order {order.order_no}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tracking: {order.tracking_no} · {order.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border px-3 py-1 text-sm font-medium capitalize">
              {order.status.order}
            </span>
            <span className="rounded-full border border-green-600 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400">
              <Bike className="size-3.5 inline mr-1" />
              {order.status.payment_method}
            </span>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">Shipping</h2>
          <div className="flex gap-2 text-sm rounded-lg border bg-muted/30 p-3">
            <Home className="size-4 shrink-0 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium text-foreground">{shipping.receiver_name}</p>
              <p className="text-muted-foreground">{shipping.receiver_phone}</p>
              <p className="text-muted-foreground">{addressLine}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-foreground mb-2">Items</h2>
          <ul className="space-y-3 rounded-lg border bg-muted/30 p-3">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 text-sm"
              >
                <span className="min-w-0 flex-1">
                  {item.product_name}
                  {item.variation ? ` · ${item.variation}` : ""}
                </span>
                <span className="text-muted-foreground">
                  × {item.quantity} × {formatPriceSymbol(item.unit_price)}
                </span>
                <span className="font-medium shrink-0">
                  {formatPriceSymbol(item.total_price)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-2 border-t">
          <h2 className="text-sm font-semibold text-foreground mb-2">Summary</h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPriceSymbol(order.amounts.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-destructive">
              <dt>Discount</dt>
              <dd>- {formatPriceSymbol(order.amounts.discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{formatPriceSymbol(order.amounts.shipping)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2">
              <dt>Grand Total</dt>
              <dd>{formatPriceSymbol(order.amounts.grand_total)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
