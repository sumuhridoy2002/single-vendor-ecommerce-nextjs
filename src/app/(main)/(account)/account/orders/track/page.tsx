"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const TRACK_BASE = "/account/orders/track";

export default function TrackOrderPage() {
  const router = useRouter();
  const [trackingNo, setTrackingNo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = trackingNo.trim();
    if (!value) {
      toast.error("Please enter your tracking number.");
      return;
    }
    router.push(`${TRACK_BASE}/${encodeURIComponent(value)}`);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">Track your order</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Enter the tracking number from your order confirmation or email.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g. TRK-051A1B1E"
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            className="flex-1"
            aria-label="Tracking number"
          />
          <Button type="submit" className="gap-2 shrink-0">
            <Search className="size-4" />
            Track
          </Button>
        </form>
      </div>
    </div>
  );
}
