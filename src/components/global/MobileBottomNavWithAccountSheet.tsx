"use client";

import { AccountSheet } from "@/components/account/AccountSheet";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/auth-modal-store";
import { useState } from "react";
import { MobileBottomNav } from "./MobileBottomNav";

export function MobileBottomNavWithAccountSheet() {
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setAccountSheetOpen(true);
    } else {
      openAuthModal();
    }
  };

  return (
    <>
      <MobileBottomNav onAccountClick={handleAccountClick} />
      <AccountSheet
        open={accountSheetOpen}
        onOpenChange={setAccountSheetOpen}
      />
    </>
  );
}
