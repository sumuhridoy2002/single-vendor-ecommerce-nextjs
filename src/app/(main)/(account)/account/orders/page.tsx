"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getOrders, type OrderListItem } from "@/lib/api/orders";
import { formatPriceSymbol } from "@/lib/utils";
import { Bike, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function OrderCard({ order }: { order: OrderListItem }) {
  const orderStatus = order.status.order.toLowerCase();
  const statusVariant =
    orderStatus === "cancelled"
      ? "destructive"
      : orderStatus === "delivered"
        ? "default"
        : "secondary";

  const shipping = order.shipping_info;
  const addressLine = [shipping.address, shipping.city].filter(Boolean).join(", ");

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Order: {order.order_no}
        </span>
        <Badge
          variant="outline"
          className="border-green-600 text-green-700 bg-green-50 dark:bg-green-950/30 dark:border-green-700 dark:text-green-400"
        >
          <Bike className="size-3.5 mr-1" aria-hidden />
          {order.status.payment_method}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex gap-2 text-sm">
          <Home className="size-4 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
          <div>
            <p className="font-medium text-foreground">{shipping.receiver_name}</p>
            <p className="text-muted-foreground">{shipping.receiver_phone}</p>
            <p className="text-muted-foreground">{addressLine}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right">
          Date: {order.date}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm">
            <span className="text-muted-foreground">Grand Total</span>{" "}
            <span className="font-semibold text-foreground">
              {formatPriceSymbol(order.amounts.grand_total)}
            </span>
          </span>
          <span className="text-sm">
            <span className="text-muted-foreground">Status:</span>{" "}
            <Badge variant={statusVariant} className="ml-1 capitalize">
              {order.status.order}
            </Badge>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/account/orders/track/${encodeURIComponent(order.tracking_no)}`}>
              Track Order
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700">
            Order Again
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/account/orders/${order.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    current_page: number;
    last_page: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    getOrders(page)
      .then((res) => {
        if (!cancelled) {
          setOrders(res.data);
          setMeta({
            current_page: res.meta.current_page,
            last_page: res.meta.last_page,
            total: res.meta.total,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load orders.");
          setOrders([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const filteredByTab = (tab: string) => {
    if (tab === "all") return orders;
    return orders.filter((o) => o.status.order.toLowerCase() === tab);
  };

  return (
    <div className="container py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      {loading && orders.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList variant="pill" className="mb-6">
            <TabsTrigger variant="pill" value="all">
              All
            </TabsTrigger>
            <TabsTrigger variant="pill" value="pending">
              Pending
            </TabsTrigger>
            <TabsTrigger variant="pill" value="delivered">
              Delivered
            </TabsTrigger>
            <TabsTrigger variant="pill" value="cancelled">
              Cancelled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-4">
            {filteredByTab("all").length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No orders yet.
              </p>
            ) : (
              filteredByTab("all").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>
          <TabsContent value="pending" className="mt-0 space-y-4">
            {filteredByTab("pending").length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No pending orders.
              </p>
            ) : (
              filteredByTab("pending").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>
          <TabsContent value="delivered" className="mt-0 space-y-4">
            {filteredByTab("delivered").length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No delivered orders.
              </p>
            ) : (
              filteredByTab("delivered").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>
          <TabsContent value="cancelled" className="mt-0 space-y-4">
            {filteredByTab("cancelled").length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No cancelled orders.
              </p>
            ) : (
              filteredByTab("cancelled").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {meta && meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.current_page} of {meta.last_page} ({meta.total} orders)
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
