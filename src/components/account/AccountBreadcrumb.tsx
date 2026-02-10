"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SEGMENT_LABELS: Record<string, string> = {
  profile: "Profile",
  orders: "Orders",
  notifications: "Notifications",
  "lab-test": "My Lab Test",
  prescriptions: "Prescriptions",
  "notified-products": "Notified Products",
  "suggest-products": "Suggest Products",
  wishlist: "Wishlist",
  addresses: "Manage Address",
  transactions: "Transaction History",
  offers: "Special Offers",
  refer: "Refer and Earn",
  "health-tips": "Health Tips",
  "rate-us": "Rate us",
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  "refund-policy": "Return and Refund Policy",
  faq: "FAQ",
};

export function AccountBreadcrumb() {
  const pathname = usePathname();
  const path = pathname ?? "";
  const accountBase = "/account";
  const relative = path.startsWith(accountBase)
    ? path.slice(accountBase.length).replace(/^\//, "")
    : "";
  const segment = relative.split("/")[0] || "";
  const label = segment ? SEGMENT_LABELS[segment] ?? segment : null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {label ? (
            <BreadcrumbLink asChild>
              <Link href="/account">Account</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Account</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {label && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
