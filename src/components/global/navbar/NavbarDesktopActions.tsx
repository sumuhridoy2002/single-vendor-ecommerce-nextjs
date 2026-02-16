"use client";

import { NavbarCartButton } from "./NavbarCartButton";
import { NavbarUser } from "./NavbarUser";

type UserInfo = {
  name?: string | null;
  email?: string | null;
};

type NavbarDesktopActionsProps = {
  isAuthenticated: boolean;
  user: UserInfo | null;
  onOpenAuthModal: () => void;
};

export function NavbarDesktopActions({
  isAuthenticated,
  user,
  onOpenAuthModal,
}: NavbarDesktopActionsProps) {
  return (
    <div className="hidden shrink-0 items-center gap-4 md:flex">
      <NavbarUser
        isAuthenticated={isAuthenticated}
        user={user}
        onOpenAuthModal={onOpenAuthModal}
      />
      <NavbarCartButton />
    </div>
  );
}
