import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchFlashSaleProductsPaginated } from "@/lib/api/products";
import { FlashSalePageContent } from "./FlashSalePageContent";

export const metadata: Metadata = {
  title: "Flash Sale",
  description: "Shop the best flash sale deals — limited time discounts on top products.",
};

export default async function FlashSalePage() {
  let initialProducts: Awaited<ReturnType<typeof fetchFlashSaleProductsPaginated>>["products"] = [];
  try {
    const result = await fetchFlashSaleProductsPaginated(1);
    initialProducts = result.products;
  } catch {
    // non-fatal — show empty state
  }

  return (
    <Suspense
      fallback={
        <div className="container w-full flex gap-6">
          <div className="hidden w-56 shrink-0 lg:block" />
          <div className="min-w-0 flex-1 py-12 text-center text-muted-foreground">
            Loading flash sale...
          </div>
        </div>
      }
    >
      <FlashSalePageContent initialProducts={initialProducts} />
    </Suspense>
  );
}
