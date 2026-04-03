import { PaymentFailSkeleton, PaymentFailView } from "@/components/payment/PaymentFailView";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Payment failed",
  description: "Your payment could not be completed.",
  robots: { index: false, follow: false },
};

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<PaymentFailSkeleton />}>
      <PaymentFailView />
    </Suspense>
  );
}
