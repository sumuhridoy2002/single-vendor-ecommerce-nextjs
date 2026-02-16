"use client";

import { Badge } from "@/components/ui/badge";
import { useCartItemCount, useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";

export function NavbarCartButton() {
  const cartItemCount = useCartItemCount();
  const openCart = useCartStore((s) => s.openCart);

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex size-10 items-center justify-center rounded-full bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="size-5 text-muted-foreground" />
      {cartItemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-0.5 -top-0.5 size-5 rounded-full p-0 text-[10px]"
        >
          {cartItemCount}
        </Badge>
      )}
    </button>
  );
}
