"use client";

import { ProductCard } from "@/components/common/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useWhenLoggedIn } from "@/hooks/useWhenLoggedIn";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { Product } from "@/types/product";
import { Heart } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const load = useWishlistStore((state) => state.load);
  const removeById = useWishlistStore((state) => state.removeById);
  const isLoading = useWishlistStore((state) => state.isLoading);
  const hasLoaded = useWishlistStore((state) => state.hasLoaded);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const whenLoggedIn = useWhenLoggedIn();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    load().catch((e) =>
      toast.error(e?.message ?? "Failed to load wishlist products")
    );
  }, [isAuthenticated, load]);

  const handleAddToCart = (product: Product) => {
    whenLoggedIn(() => {
      addItem(product)
        .then(() => openCart())
        .catch((e) => toast.error(e?.message ?? "Failed to add to cart"));
    });
  };

  const handleWishlist = (product: Product) => {
    removeById(product.id).catch((e) =>
      toast.error(e?.message ?? "Failed to update wishlist")
    );
  };

  const hasItems = items.length > 0;

  return (
    <div className="container py-3 xs:py-6 md:py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Wishlist</h1>
      <p className="mb-4 text-sm text-muted-foreground">Your saved products.</p>

      {isLoading && !hasLoaded && (
        <div className="py-8 text-sm text-muted-foreground">
          Loading wishlist products...
        </div>
      )}

      {!hasItems && (!isLoading || hasLoaded) && (
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

