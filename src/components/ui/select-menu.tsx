"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, Search } from "lucide-react";
import React, { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

export interface SelectMenuItem {
  value: string;
  label: string;
}

export interface SelectMenuProps {
  items: SelectMenuItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

function SelectMenuComponent({
  items,
  value = "",
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search",
  emptyMessage = "Nothing found.",
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
}: SelectMenuProps) {
  const [filteredItems, setFilteredItems] = useState<SelectMenuItem[]>(items);
  const [search, setSearch] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget.value;
      setSearch(input);
      const query = input.trim().toLowerCase();
      if (!query) {
        setFilteredItems(items);
        return;
      }
      const results = items.filter((item) =>
        item.label.toLowerCase().includes(query)
      );
      setFilteredItems(results);
    },
    [items]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setSearch("");
        setFilteredItems(items);
      }
    },
    [items]
  );

  const selectedLabel = items.find((i) => i.value === value)?.label ?? value;

  return (
    <SelectPrimitive.Root
      value={value || undefined}
      onValueChange={onValueChange}
      onOpenChange={handleOpenChange}
      disabled={disabled}
    >
      <div className={cn("w-full max-w-full", className)}>
        <SelectPrimitive.Trigger
          className={cn(
            "border-input data-placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            triggerClassName
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder}>
            {selectedLabel || placeholder}
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="size-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            avoidCollisions={false}
            className={cn(
              "bg-popover text-popover-foreground z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              contentClassName
            )}
          >
            <div className="flex items-center border-b border-border px-2">
              <Search className="text-muted-foreground mx-2 size-4 shrink-0" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                className="placeholder:text-muted-foreground flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none"
                onInput={handleSearch}
              />
            </div>
            <SelectPrimitive.Viewport className="max-h-64 overflow-y-auto p-1">
              {filteredItems.length === 0 ? (
                <div className="text-muted-foreground px-3 py-2 text-sm">
                  {emptyMessage}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <SelectMenuItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectMenuItem>
                ))
              )}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </div>
    </SelectPrimitive.Root>
  );
}

const SelectMenuItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, forwardedRef) => (
  <SelectPrimitive.Item
    ref={forwardedRef}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[state=checked]:text-teal-600 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>
      <span className="line-clamp-1 pr-4">{children}</span>
    </SelectPrimitive.ItemText>
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-teal-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectMenuItem.displayName = "SelectMenuItem";

export const SelectMenu = SelectMenuComponent;
