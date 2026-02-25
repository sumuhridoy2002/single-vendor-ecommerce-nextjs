"use client";

import { Heart } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="container max-w-2xl py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Wishlist</h1>
      <p className="text-sm text-muted-foreground mb-2">Tags:</p>

      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Heart className="size-12 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-muted-foreground font-medium">— No wishlist yet! —</p>
        <p className="text-muted-foreground text-sm mt-1">— You haven&apos;t marked any wishlist —</p>
      </div>
    </div>
  );
}
