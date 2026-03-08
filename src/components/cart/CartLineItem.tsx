import {
  useCartStore,
  type CartItem as CartItemType
} from "@/store/cart-store";

import { fetchCart } from "@/lib/api/cart";
import { formatPriceSymbol } from "@/lib/utils";
import { Minus, Plus, Trash2, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const PLACEHOLDER_IMAGE = "/assets/images/placeholder-image.png";
const DEBOUNCE_MS = 500;

function CartLineItem({ item }: { item: CartItemType }) {
  const { product, quantity } = item;
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const setQuantityOptimistic = useCartStore((s) => s.setQuantityOptimistic);
  const setItems = useCartStore((s) => s.setItems);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError ? PLACEHOLDER_IMAGE : product.image;

  const itemId = item.lineId ?? product.id;

  const scheduleApiUpdate = useCallback(
    (newQuantity: number) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        updateQuantity(itemId, newQuantity).catch(async (e) => {
          toast.error(e?.message ?? "Failed to update quantity");
          const items = await fetchCart();
          setItems(items);
        });
      }, DEBOUNCE_MS);
    },
    [itemId, updateQuantity, setItems]
  );

  const handleDecrease = useCallback(() => {
    const newQty = quantity - 1;
    if (newQty < 1) return;
    setQuantityOptimistic(itemId, newQty);
    scheduleApiUpdate(newQty);
  }, [quantity, itemId, setQuantityOptimistic, scheduleApiUpdate]);

  const handleIncrease = useCallback(() => {
    const newQty = quantity + 1;
    if (newQty > 10) return;
    setQuantityOptimistic(itemId, newQty);
    scheduleApiUpdate(newQty);
  }, [quantity, itemId, setQuantityOptimistic, scheduleApiUpdate]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const hasDiscount =
    product.originalPrice != null && product.originalPrice > product.price;
  const discountLabel =
    product.discountPercent != null
      ? `${product.discountPercent}% OFF`
      : hasDiscount
        ? "Sale"
        : null;

  return (
    <div className="flex gap-3 rounded-lg border bg-card p-3">
      <Link
        href={`/product/${product.slug}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-md"
      >
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-foreground hover:underline"
        >
          {product.name}
        </Link>
        <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
          {product.brand && <span>{product.brand}</span>}
          {product.unit && <span>{product.unit}</span>}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {hasDiscount && product.originalPrice != null && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPriceSymbol(product.originalPrice)}
              </span>
            )}
            <span className="text-sm font-semibold text-foreground">
              {formatPriceSymbol(product.price)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-warning"
              aria-label="Flash offer"
            >
              <Zap className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-muted-foreground hover:text-destructive"
              aria-label="Remove from cart"
              onClick={() =>
                removeItem(itemId).catch((e) =>
                  toast.error(e?.message ?? "Failed to remove")
                )
              }
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Qty:</span>
          <div className="flex items-center rounded-md border border-input">
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 shrink-0 rounded-r-none hover:bg-muted"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={handleDecrease}
            >
              <Minus className="size-4" />
            </Button>
            <span className="min-w-8 shrink-0 text-center text-sm font-medium tabular-nums">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 shrink-0 rounded-l-none hover:bg-muted"
              aria-label="Increase quantity"
              disabled={quantity >= 10}
              onClick={handleIncrease}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default CartLineItem;