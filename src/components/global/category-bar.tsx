"use client";

import { Button } from "@/components/ui/button";
import { useCategoryTree } from "@/hooks/data/useCategoryTree";
import { usePagesStore } from "@/stores/pages-store";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdPhoneInTalk } from "react-icons/md";
import { RiLayoutMasonryFill } from "react-icons/ri";

const CLICK_SCROLL_PX = 120;

const STATIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
];

export function CategoryBar() {
  const pathname = usePathname();
  const tree = useCategoryTree();
  const pages = usePagesStore((s) => s.pages) ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const categoryLinks = useMemo(
    () => [
      ...STATIC_LINKS,
      ...tree.map((c) => ({ label: c.title, href: `/category/${c.slug}` })),
      ...pages.map((p) => ({ label: p.title, href: `/page/${p.slug}` })),
    ],
    [tree, pages]
  );

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
  }, []);

  const scrollRight = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: CLICK_SCROLL_PX, behavior: "smooth" });
  }, []);

  const scrollLeft = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -CLICK_SCROLL_PX, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
      updateScrollState();
    };

    checkOverflow();
    el.addEventListener("scroll", updateScrollState);
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState]);

  return (
    <div className="hidden lg:flex w-full items-center justify-between gap-4 border-b border-border bg-background px-4 py-2.5">
      <span
        className="flex shrink-0 gap-2 text-primary"
      >
        <RiLayoutMasonryFill className="size-5" />
        <span className="hidden font-medium sm:inline text-base">Shop By Category</span>
      </span>

      {/* Horizontal category links */}
      <div className="min-w-0 relative flex-1">
        <div
          ref={scrollRef}
          className="flex min-w-0 items-center gap-1 overflow-x-auto pr-5 mt-1 pb-1 scrollbar-hidden"
        >
          <div className="flex items-center gap-4 px-2">
            {categoryLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap text-base transition-colors",
                    isActive
                      ? "text-primary border-b-2 border-primary pb-0.5"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {isOverflowing && canScrollLeft && (
            <button
              type="button"
              className="absolute left-0 top-1/2 -translate-y-1/2 shrink-0 cursor-pointer rounded text-muted-foreground bg-linear-to-l from-white/10 via-white to-white z-10 pl-2 py-1 hover:text-foreground transition-colors"
              aria-label="Scroll categories left"
              onClick={scrollLeft}
            >
              <ChevronLeft className="size-5" />
            </button>
          )}

          {isOverflowing && (
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 shrink-0 cursor-pointer rounded text-muted-foreground bg-linear-to-r from-white/10 via-white to-white z-10 pl-2 py-1 hover:text-foreground transition-colors"
              aria-label="Scroll categories right"
              onClick={scrollRight}
            >
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>
      </div>

      {/* Call for Order */}
      <a href="tel:" className="shrink-0">
        <Button
          variant="ghost"
          className="gap-2 rounded-lg bg-danger-light/40 text-danger/80 hover:bg-danger-light/80 hover:text-danger-dark"
        >
          <MdPhoneInTalk className="size-6" />
          <span className="hidden font-medium sm:inline text-base">Call for Order</span>
        </Button>
      </a>
    </div>
  );
}
