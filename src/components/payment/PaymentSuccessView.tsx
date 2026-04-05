"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import paymentSuccessAnimation from "@/lottie/payment-success.json";
import Lottie from "lottie-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function PaymentSuccessView() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order")?.trim() ?? "";
  const trxID = searchParams.get("trxID")?.trim() ?? "";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10 sm:py-14">
      <div
        className="relative mb-6 h-52 w-full max-w-[220px] sm:h-56 sm:max-w-[240px]"
        aria-hidden
      >
        <Lottie
          animationData={paymentSuccessAnimation}
          loop
          className="h-full w-full"
        />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-2 flex items-center gap-2 text-success">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Payment successful
          </h1>
        </div>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground sm:text-base">
          Your payment went through. You will receive order updates on your phone and email.
        </p>
      </div>

      <dl className="mt-8 w-full space-y-3 rounded-2xl border bg-card p-5 text-left shadow-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
          <dt className="text-sm text-muted-foreground">Order</dt>
          <dd className="font-mono text-sm font-medium break-all sm:text-right">
            {order || "—"}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
          <dt className="text-sm text-muted-foreground">Transaction ID</dt>
          <dd className="font-mono text-sm font-medium break-all sm:text-right">
            {trxID || "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/account/orders">View orders</Link>
        </Button>
      </div>
    </div>
  );
}

export function PaymentSuccessSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-14",
        className
      )}
    >
      <div className="h-52 w-full max-w-[220px] animate-pulse rounded-2xl bg-muted" />
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-24 w-full animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
