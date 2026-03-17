"use client";

import { MessageCircle } from "lucide-react";
import { NavbarCartButton } from "./NavbarCartButton";

export function NavbarMobileActions() {
  return (
    <div className="flex flex-col xs:flex-row shrink-0 justify-end items-end xs:items-center gap-1 md:hidden">
      <span className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium">
        ৳0.00
      </span>

      <div className="flex items-center gap-1">
        <a
          href="https://m.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-8 xs:size-10 items-center justify-center rounded-full bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Messenger"
        >
          <MessageCircle className="size-5 text-muted-foreground" />
        </a>
        <NavbarCartButton />
      </div>
    </div>
  );
}
