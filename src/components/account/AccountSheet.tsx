"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AccountSidebar } from "./AccountSidebar";

interface AccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSheet({ open, onOpenChange }: AccountSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="shrink-0 border-b border-border bg-muted/40 px-4 py-3">
          <SheetTitle className="text-base font-semibold">
            Account Menu
          </SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <AccountSidebar variant="sheet" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
