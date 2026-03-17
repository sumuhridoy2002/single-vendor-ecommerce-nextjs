"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types/product";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const remove = useWishlistStore((state) => state.remove);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const whenLoggedIn = useWhenLoggedIn();

  const handleAddToCart = (product: Product) => {
    whenLoggedIn(() => {
      addItem(product)
        .then(() => openCart())
        .catch((e) => toast.error(e?.message ?? "Failed to add to cart"));
    });
  };

  const handleWishlist = (product: Product) => {
    remove(product.id);
  };

  const hasItems = items.length > 0;

  return (
    <div className="container py-3 xs:py-6 md:py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Wishlist</h1>
      <p className="mb-4 text-sm text-muted-foreground">Your saved products.</p>

      {!hasItems && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-6">
            <Heart className="size-12 text-muted-foreground" aria-hidden />
          </div>
          <p className="font-medium text-muted-foreground">
            — No wishlist yet! —
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            — You haven&apos;t marked any wishlist —
          </p>
        </div>
      )}

      {hasItems && (
        <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={handleAddToCart}
              onWishlist={handleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

