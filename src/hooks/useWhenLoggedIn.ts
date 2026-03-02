"use client";

import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/auth-modal-store";

/**
 * Returns a callback that runs your action only when the user is logged in.
 * If not logged in, opens the auth modal instead.
 *
 * @example
 * const whenLoggedIn = useWhenLoggedIn();
 * <button onClick={() => whenLoggedIn(() => router.push("/account"))}>
 *   My Account
 * </button>
 */
export function useWhenLoggedIn(): (action: () => void) => void {
  const { isAuthenticated } = useAuth();
  const openAuthModal = useAuthModalStore((s) => s.openAuthModal);

  return useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        openAuthModal();
      }
    },
    [isAuthenticated, openAuthModal]
  );
}
