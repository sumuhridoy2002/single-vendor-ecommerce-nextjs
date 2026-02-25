"use client";

import { cn } from "@/lib/utils";
import {
  FlaskConical,
  Home,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Lab Test", href: "/category/lab-test", icon: FlaskConical },
  { label: "Beauty", href: "/category/beauty", icon: Sparkles },
  { label: "Health Care", href: "/category/healthcare", icon: Stethoscope },
] as const;

interface MobileBottomNavProps {
  onAccountClick: () => void;
}

export function MobileBottomNav({ onAccountClick }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onAccountClick}
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-colors",
            pathname.startsWith("/account")
              ? "text-primary font-medium"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Account menu"
        >
          <User className="size-5 shrink-0" aria-hidden />
          <span>Account</span>
        </button>
      </div>
    </nav>
  );
}
