"use client";

import { AddressModal } from "@/components/address/AddressModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAddressStore } from "@/store/address-store";
import { MapPin, Plus, Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const openAddressModal = useAddressStore((s) => s.openAddressModal);

  return (
    <nav className="flex items-center justify-between gap-6 border-b border-border bg-background px-4 py-3">
      {/* Logo */}
      <Link href="/" className="flex shrink-0 flex-col">
        <span className="flex items-center gap-0.5 text-xl font-semibold tracking-tight text-teal-600">
          ar
          <span className="flex size-6 items-center justify-center rounded-full bg-teal-600 text-white">
            <Plus className="size-3.5 rotate-45 stroke-[2.5]" />
          </span>
          gga
        </span>
        <span className="text-xs font-medium text-teal-500">
          For better health
        </span>
      </Link>

      {/* Delivery */}
      <div
        role="button"
        tabIndex={0}
        onClick={openAddressModal}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openAddressModal();
          }
        }}
        className="hidden shrink-0 flex-col sm:flex text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
        aria-label="Delivery address"
      >
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" />
          Delivery to
        </span>
        <span className="text-sm font-medium">Bangladesh</span>
      </div>

      {/* Search bar */}
      <form
        role="search"
        className="flex min-w-0 flex-1 max-w-2xl items-center overflow-hidden rounded-lg border border-border bg-muted/30 shadow-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <Select defaultValue="all">
          <SelectTrigger
            className={cn(
              "w-[72px] shrink-0 rounded-none border-0 border-r bg-muted/50 shadow-none focus:ring-0",
              "h-10 rounded-l-lg border-r border-border"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="medicine">Medicine</SelectItem>
            <SelectItem value="health">Health</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Input
            type="search"
            name="q"
            placeholder='Search for "medicine products"'
            className="h-10 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
          />
        </div>
        <Button
          type="submit"
          aria-label="Search"
          className="h-10 shrink-0 rounded-r-lg rounded-l-none bg-teal-600 px-4 hover:bg-teal-700"
        >
          <Search className="size-5 text-white" />
        </Button>
      </form>

      {/* User & Cart */}
      <div className="flex shrink-0 items-center gap-4">
        <button
          type="button"
          onClick={() => setAuthModalOpen(true)}
          className="hidden items-center gap-2 md:flex focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
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
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
        <AddressModal />
        <Link
          href="/cart"
          className="relative flex size-10 items-center justify-center rounded-full bg-muted"
          aria-label="Shopping cart"
        >
          <ShoppingCart className="size-5 text-muted-foreground" />
          <Badge
            variant="destructive"
            className="absolute -right-0.5 -top-0.5 size-5 rounded-full p-0 text-[10px]"
          >
            0
          </Badge>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
