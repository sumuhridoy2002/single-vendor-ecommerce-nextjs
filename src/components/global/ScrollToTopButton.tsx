"use client";

import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";

interface ScrollToTopButtonProps {
  wa?: string;
}

export function ScrollToTopButton({ wa }: ScrollToTopButtonProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const waHref = wa
    ? wa.startsWith("http")
      ? wa
      : `https://wa.me/${wa.replace(/\D/g, "")}`
    : null;

  return (
    <>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={cn(
          "fixed bottom-24 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-white/20 bg-white text-[#0a1628] shadow-lg transition-all hover:bg-white/95 md:bottom-8",
          showScrollTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <ArrowUp className="size-5" />
      </button>

      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "fixed right-4 z-40 flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all hover:scale-105",
            showScrollTop ? "bottom-40 md:bottom-24" : "bottom-24 md:bottom-8"
          )}
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="size-6" />
        </a>
      ) : null}
    </>
  );
}
