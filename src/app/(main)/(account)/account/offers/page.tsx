"use client";

import { Percent } from "lucide-react";

const OFFERS = [
  { amount: 50, minPurchase: 5000, gradient: "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" },
  { amount: 40, minPurchase: 4000, gradient: "from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30" },
  { amount: 30, minPurchase: 3000, gradient: "from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30" },
  { amount: 20, minPurchase: 2000, gradient: "from-violet-100 to-violet-200 dark:from-violet-900/30 dark:to-violet-800/30" },
  { amount: 10, minPurchase: 1000, gradient: "from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30" },
];

export default function OffersPage() {
  return (
    <div className="container max-w-2xl py-3 xs:py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Special Offers</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {OFFERS.map((offer) => (
          <div
            key={offer.amount}
            className={`rounded-xl bg-gradient-to-br ${offer.gradient} border border-border/50 p-5 flex items-center gap-4`}
          >
            <div className="rounded-full bg-background/60 p-3">
              <Percent className="size-6 text-foreground" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-foreground">Cashback ৳{offer.amount}</p>
              <p className="text-sm text-muted-foreground">
                For purchasing above ৳{offer.minPurchase.toLocaleString()}+
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
