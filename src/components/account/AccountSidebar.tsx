"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Banknote,
  Bell,
  BellRing,
  ChevronRight,
  FileCheck,
  FileText,
  FlaskConical,
  Heart,
  HelpCircle,
  Leaf,
  LogOut,
  MapPin,
  Package,
  Pill,
  RefreshCw,
  Shield,
  Star,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Notification", href: "/account/notifications", icon: Bell },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "My Lab Test", href: "/account/lab-test", icon: FlaskConical },
  { label: "Prescriptions", href: "/account/prescriptions", icon: FileText },
  { label: "Notified Products", href: "/account/notified-products", icon: BellRing },
  { label: "Suggest Products", href: "/account/suggest-products", icon: Pill },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Manage Address", href: "/account/addresses", icon: MapPin },
  { label: "Transaction History", href: "/account/transactions", icon: Banknote },
  { label: "Special Offers", href: "/account/offers", icon: Tag },
  { label: "Refer and Earn", href: "/account/refer", icon: Users },
  { label: "Health Tips", href: "/account/health-tips", icon: Leaf },
  { label: "Rate us", href: "/account/rate-us", icon: Star },
] as const;

const LEGAL_ITEMS = [
  { label: "Terms & Conditions", href: "/account/terms", icon: FileCheck },
  { label: "Privacy Policy", href: "/account/privacy", icon: Shield },
  { label: "Return and Refund Policy", href: "/account/refund-policy", icon: RefreshCw },
  { label: "FAQ", href: "/account/faq", icon: HelpCircle },
] as const;

export function AccountSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const displayName = user?.name ?? "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const aroggaCash = "৳ ৮০";

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside
      className={cn(
        "w-64 shrink-0 border-r border-border flex flex-col",
        "min-h-0 overflow-y-auto"
      )}
    >
      {/* User card */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col items-center gap-2 text-center">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground truncate max-w-full">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground">Arogga Cash {aroggaCash}</p>
          </div>
          <Link
            href="/account/profile"
            className="text-sm text-primary hover:underline font-medium"
          >
            View Profile
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 py-2" aria-label="Account navigation">
        <ul className="space-y-0">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden />
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Legal & Support */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Legal & Support
          </p>
          <ul className="space-y-0">
            {LEGAL_ITEMS.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                    "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-border">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground",
            "hover:bg-muted hover:text-foreground transition-colors rounded-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <LogOut className="size-5 shrink-0" aria-hidden />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
