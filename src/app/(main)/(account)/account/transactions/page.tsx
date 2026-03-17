"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Banknote } from "lucide-react";

export default function TransactionsPage() {
  const { user } = useAuth();
  const displayName = (user?.name ?? "User").toUpperCase();
  const balance = "৮০"; // placeholder

  return (
    <div className="container max-w-2xl py-3 xs:py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Transaction History</h1>

      <div className="rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm opacity-90">{displayName}</p>
          <p className="text-xs uppercase tracking-wider opacity-80 mt-0.5">Arogga Balance</p>
          <p className="text-3xl font-bold mt-2">৳{balance}</p>
          <p className="text-sm opacity-90 mt-1">Arogga Cash (Usable)</p>
        </div>
        <div className="text-right text-sm opacity-80">
          <p className="font-semibold">Arogga</p>
          <p>For better health</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-border bg-muted/20">
        <Banknote className="size-12 text-muted-foreground mb-4" aria-hidden />
        <p className="text-muted-foreground">No transactions yet.</p>
      </div>
    </div>
  );
}
