"use client";

import { cn } from "@/lib/utils";
import { useAddressStore } from "@/store/address-store";
import { ChevronDown, MapPin } from "lucide-react";

type NavbarDeliveryProps = {
  onOpenAddressModal: () => void;
};

export function NavbarDelivery({ onOpenAddressModal }: NavbarDeliveryProps) {
  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  return (
    <button
      role="button"
      tabIndex={0}
      onClick={onOpenAddressModal}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenAddressModal();
        }
      }}
      className="flex shrink-0 min-w-0 flex-row lg:flex-col gap-2 lg:gap-0 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      aria-label="Delivery address"
    >
      <span className={cn(
        "flex items-center gap-1 text-sm",
        selectedAddress ? "text-muted-foreground" : "text-foreground font-semibold"
      )}>
        <MapPin className="size-3.5 shrink-0" />
        Delivery to
      </span>
      <span className="flex min-w-0 w-28 items-center gap-0.5 text-sm font-semibold">
        <span className="min-w-0 truncate">
          {selectedAddress ? `${selectedAddress.address} (${selectedAddress.addressType})` : "Choose Address"}
        </span>
        <ChevronDown className="size-4 shrink-0" />
      </span>
    </button>
  );
}
