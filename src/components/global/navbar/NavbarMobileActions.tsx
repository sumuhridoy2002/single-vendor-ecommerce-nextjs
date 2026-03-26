"use client";

import { MessageCircle } from "lucide-react";
import { formatPriceSymbol } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useSettingsStore } from "@/stores/settings-store";
import { NavbarCartButton } from "./NavbarCartButton";

export function NavbarMobileActions() {
  const amountPayable = useCartStore((s) => s.amountPayable);
  const settings = useSettingsStore((s) => s.settings);

  const hasWhatsapp = Boolean(settings?.social_wa);
  const chatHref = hasWhatsapp
    ? settings?.social_wa?.startsWith("http")
      ? settings.social_wa
      : `https://wa.me/${settings?.social_wa?.replace(/\D/g, "")}`
    : settings?.social_fb || "https://m.me/";

  return (
    <div className="flex flex-col xs:flex-row shrink-0 justify-end items-end xs:items-center gap-1 md:hidden">
      <span className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium">
        {formatPriceSymbol(amountPayable)}
      </span>

      <div className="flex items-center gap-1">
        <a
          href={chatHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-8 xs:size-10 items-center justify-center rounded-full bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={hasWhatsapp ? "WhatsApp" : "Messenger"}
        >
          <MessageCircle className="size-5 text-muted-foreground" />
        </a>
        <NavbarCartButton />
      </div>
    </div>
  );
}
