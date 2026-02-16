"use client";

import { User } from "lucide-react";
import Link from "next/link";

type UserInfo = {
  name?: string | null;
  email?: string | null;
};

type NavbarUserProps = {
  isAuthenticated: boolean;
  user: UserInfo | null;
  onOpenAuthModal: () => void;
};

export function NavbarUser({
  isAuthenticated,
  user,
  onOpenAuthModal,
}: NavbarUserProps) {
  if (isAuthenticated && user) {
    return (
      <Link
        href="/account"
        className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        aria-label="Account & Orders"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-muted">
          <User className="size-5 text-muted-foreground" />
        </span>
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium">
            Hello, {user.name ?? user.email ?? "User"}
          </span>
          <span className="text-xs text-muted-foreground">
            Account & Orders
          </span>
        </div>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpenAuthModal}
      className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      aria-label="Account & Orders"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-muted">
        <User className="size-5 text-muted-foreground" />
      </span>
      <div className="flex flex-col text-left">
        <span className="text-sm font-medium">Hello, User</span>
        <span className="text-xs text-muted-foreground">
          Account & Orders
        </span>
      </div>
    </button>
  );
}
