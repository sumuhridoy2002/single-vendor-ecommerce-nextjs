"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Address, AddressType } from "@/store/address-store";
import { Briefcase, Building2, Home, MoreVertical } from "lucide-react";

const ADDRESS_TYPE_LABEL: Record<AddressType, string> = {
  home: "Home Address",
  office: "Office Address",
  hometown: "Hometown Address",
};

const ADDRESS_TYPE_ICON = { home: Home, office: Briefcase, hometown: Building2 };

function AddressTypeIcon({ type }: { type: AddressType }) {
  const Icon = ADDRESS_TYPE_ICON[type];
  return <Icon className="size-5 text-primary" aria-hidden />;
}

export interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSetDefault: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AddressCard({
  address,
  isSelected,
  onSetDefault,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const addressLine = [address.address, address.deliveryArea ? `, ${address.deliveryArea}` : ""].join("");

  return (
    <div className="relative rounded-xl border border-border bg-card p-4 md:p-5 flex gap-3">
      <div className="shrink-0 pt-0.5">
        <AddressTypeIcon type={address.addressType} />
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="font-medium truncate">
              {ADDRESS_TYPE_LABEL[address.addressType]}
              {address.isDefault && " (Shipping Address)"}
            </span>
            {address.isDefault && (
              <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-0 shrink-0">
                Default
              </Badge>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 absolute right-4 top-3"
                aria-label="Address options"
              >
                <MoreVertical className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48 p-2">
              <div className="flex flex-col gap-0.5">
                <Button variant="ghost" size="sm" className="justify-start" onClick={onEdit}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" onClick={onSetDefault}>
                  Make Default
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{address.fullName}</p>
        <p className="text-sm text-muted-foreground">{address.phone}</p>
        <p className="text-sm text-muted-foreground mt-0.5" title={addressLine}>
          {addressLine}
        </p>
      </div>
      <div className="shrink-0 flex items-center">
        <button
          type="button"
          aria-label={isSelected ? "Default address" : "Set as default"}
          onClick={onSetDefault}
          className="rounded-full border-2 border-muted-foreground/40 w-5 h-5 flex items-center justify-center hover:border-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isSelected && (
            <span className="rounded-full bg-primary w-2.5 h-2.5 block" />
          )}
        </button>
      </div>
    </div>
  );
}
