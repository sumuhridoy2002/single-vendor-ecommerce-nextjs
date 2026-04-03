"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import paymentFailedAnimation from "@/lottie/payment-failed.json";
import Lottie from "lottie-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function PaymentFailView() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status")?.trim() ?? "";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-10 sm:py-14">
      <div
        className="relative mb-6 h-52 w-full max-w-[220px] sm:h-56 sm:max-w-[240px]"
        aria-hidden
      >
        <Lottie
          animationData={paymentFailedAnimation}
          loop
          className="h-full w-full"
        />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="mb-2 flex items-center gap-2 text-destructive">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Payment failed
          </h1>
        </div>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground sm:text-base">
          We couldn&apos;t complete your payment. No money was taken. You can try again or use a
          different payment method.
        </p>
      </div>

      {status ? (
        <p className="mt-6 w-full rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-muted-foreground">
          Status:{" "}
          <span className="font-mono font-medium text-foreground">{status}</span>
        </p>
      ) : null}

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button variant="outline" className="w-full sm:w-auto" asChild>
          <Link href="/account/orders">My orders</Link>
        </Button>
      </div>
    </div>
  );
}

export function PaymentFailSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-14",
        className
      )}
    >
      <div className="h-52 w-full max-w-[220px] animate-pulse rounded-2xl bg-muted" />
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
