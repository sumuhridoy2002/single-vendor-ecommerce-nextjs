import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageContent } from "./SearchPageContent";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for skincare, beauty, and personal care products.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container w-full flex gap-6">
          <div className="hidden w-56 shrink-0 lg:block" />
          <div className="min-w-0 flex-1 py-12 text-center text-muted-foreground">
            Loading search results...
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
