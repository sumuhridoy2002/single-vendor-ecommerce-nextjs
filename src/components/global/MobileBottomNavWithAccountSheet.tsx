"use client";

import { useState } from "react";
import { AccountSheet } from "@/components/account/AccountSheet";
import { MobileBottomNav } from "./MobileBottomNav";

export function MobileBottomNavWithAccountSheet() {
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);

  return (
    <>
      <MobileBottomNav onAccountClick={() => setAccountSheetOpen(true)} />
      <AccountSheet
        open={accountSheetOpen}
        onOpenChange={setAccountSheetOpen}
      />
    </>
  );
}
