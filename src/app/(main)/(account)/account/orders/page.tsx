"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bike, Home } from "lucide-react";

const MOCK_ORDERS = [
  {
    id: "3981696",
    deliveryType: "Regular Delivery" as const,
    recipientName: "Mahadi Hasan",
    phone: "+8801856878150",
    address: "ECB, Mirpur-10, Dhaka City, Dhaka",
    date: "08-Jan-2026 5:53 pm",
    amountPayable: 440,
    status: "Cancelled" as const,
  },
  {
    id: "3981695",
    deliveryType: "Regular Delivery" as const,
    recipientName: "Mahadi Hasan",
    phone: "+8801856878150",
    address: "ECB, Mirpur-10, Dhaka City, Dhaka",
    date: "07-Jan-2026 2:30 pm",
    amountPayable: 1200,
    status: "Delivered" as const,
  },
];

function OrderCard({
  order,
}: {
  order: (typeof MOCK_ORDERS)[number];
}) {
  const statusVariant =
    order.status === "Cancelled"
      ? "destructive"
      : order.status === "Delivered"
        ? "default"
        : "secondary";

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Order ID: #{order.id}
        </span>
        <Badge
          variant="outline"
          className="border-green-600 text-green-700 bg-green-50 dark:bg-green-950/30 dark:border-green-700 dark:text-green-400"
        >
          <Bike className="size-3.5 mr-1" aria-hidden />
          {order.deliveryType}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex gap-2 text-sm">
          <Home className="size-4 shrink-0 text-muted-foreground mt-0.5" aria-hidden />
          <div>
            <p className="font-medium text-foreground">{order.recipientName}</p>
            <p className="text-muted-foreground">{order.phone}</p>
            <p className="text-muted-foreground">{order.address}</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground sm:text-right">
          Date: {order.date}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm">
            <span className="text-muted-foreground">Amount Payable</span>{" "}
            <span className="font-semibold text-foreground">৳{order.amountPayable}</span>
          </span>
          <span className="text-sm">
            <span className="text-muted-foreground">Status:</span>{" "}
            <Badge variant={statusVariant} className="ml-1">
              {order.status}
            </Badge>
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700">
            Order Again
          </Button>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList variant="pill" className="mb-6">
          <TabsTrigger variant="pill" value="all">
            All
          </TabsTrigger>
          <TabsTrigger variant="pill" value="confirmed">
            Confirmed
          </TabsTrigger>
          <TabsTrigger variant="pill" value="delivered">
            Delivered
          </TabsTrigger>
          <TabsTrigger variant="pill" value="cancelled">
            Cancelled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0 space-y-4">
          {MOCK_ORDERS.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-0">
          <p className="py-8 text-center text-muted-foreground text-sm">
            No confirmed orders.
          </p>
        </TabsContent>
        <TabsContent value="delivered" className="mt-0 space-y-4">
          {MOCK_ORDERS.filter((o) => o.status === "Delivered").map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        <TabsContent value="cancelled" className="mt-0 space-y-4">
          {MOCK_ORDERS.filter((o) => o.status === "Cancelled").map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
