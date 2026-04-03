"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAuth, type User } from "@/contexts/AuthContext";
import { useAuthModalStore } from "@/store/auth-modal-store";

export function SocialAuthSync() {
  const { data: session } = useSession();
  const { loginWithSocial, isAuthenticated } = useAuth();
  const { closeAuthModal } = useAuthModalStore();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current || !session?.backendToken || isAuthenticated) return;
    synced.current = true;
    loginWithSocial(session.backendToken, session.backendUser as User);
    closeAuthModal();
  }, [session, isAuthenticated, loginWithSocial, closeAuthModal]);

  return null;
}
