"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategory } from "@/hooks/data/useCategory";
import { cn } from "@/lib/utils";
import { ChevronRight, LayoutGrid, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CATEGORY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Medicine", href: "/category/medicine" },
  { label: "Healthcare", href: "/category/healthcare" },
  { label: "Lab Test", href: "/category/lab-test" },
  { label: "Beauty", href: "/category/beauty" },
  { label: "Sexual Wellness", href: "/category/sexual-wellness" },
  { label: "Baby & Mom Care", href: "/category/baby-mom-care" },
  { label: "Herbal Home Care", href: "/category/herbal-home-care" },
  { label: "Supplement", href: "/category/supplement" },
  { label: "Food and Nutrition", href: "/category/food-nutrition" },
  { label: "Pet Care", href: "/category/pet-care" },
  { label: "Veterinary", href: "/category/veterinary" },
  { label: "Homeopathy", href: "/category/homeopathy" },
  { label: "Blogs", href: "/blogs" },
  { label: "Up", href: "/up" },
];

export function CategoryBar() {
  const pathname = usePathname();
  const categories = useCategory();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-border bg-background px-4 py-2.5">
      {/* Shop By Category */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="shrink-0 gap-2 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
          >
            <LayoutGrid className="size-5" />
            <span className="hidden font-medium sm:inline">Shop By Category</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle>Shop By Category</SheetTitle>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.viewAllHref ?? `/category/${cat.slug}`}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {cat.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Horizontal category links */}
      <div
        ref={scrollRef}
        className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
      >
        <div className="flex items-center gap-4 px-2">
          {CATEGORY_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-sm font-medium transition-colors",
                  isActive
                    ? "text-teal-600 border-b-2 border-teal-600 pb-0.5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        {isOverflowing && (
          <span className="shrink-0 text-muted-foreground" aria-hidden>
            <ChevronRight className="size-5" />
          </span>
        )}
      </div>

      {/* Call for Order */}
      <a href="tel:" className="shrink-0">
        <Button
          variant="ghost"
          className="gap-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
        >
          <Phone className="size-4" />
          <span className="hidden font-medium sm:inline">Call for Order</span>
        </Button>
      </a>
    </div>
  );
}
