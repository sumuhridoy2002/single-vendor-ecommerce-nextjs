import {
  PaymentSuccessSkeleton,
  PaymentSuccessView,
} from "@/components/payment/PaymentSuccessView";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Payment successful",
  description: "Your payment was completed successfully.",
  robots: { index: false, follow: false },
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessSkeleton />}>
      <PaymentSuccessView />
    </Suspense>
  );
}
