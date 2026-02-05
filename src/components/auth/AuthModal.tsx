"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const COUNTRY_CODES = [
  { value: "+88", label: "+88 BD" },
  { value: "+91", label: "+91 IN" },
  { value: "+92", label: "+92 PK" },
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-5", className)}
      viewBox="0 0 24 24"
      fill="#1877F2"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+88");
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  const title = mode === "login" ? "Login" : "Sign up";
  const subDescription =
    mode === "login"
      ? "Login to make an order, access your orders, special offers, health tips, and more!"
      : "Create an account to place orders, save your addresses, and get exclusive offers.";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    setSendLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `${countryCode} ${phone.trim()}`,
          referralCode: referralCode || undefined,
        }),
      });
      if (res.ok) {
        toast.success("OTP sent to your number");
      } else {
        toast.info("OTP feature will be available soon. Use Google or Facebook to sign in.");
      }
    } catch {
      toast.info("OTP feature will be available soon. Use Google or Facebook to sign in.");
    } finally {
      setSendLoading(false);
    }
  };

  const handleSocialSignIn = (provider: "google" | "facebook") => {
    signIn(provider, { callbackUrl: typeof window !== "undefined" ? window.location.href : "/" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] w-full p-0 gap-0 overflow-hidden sm:max-w-4xl rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] min-h-[480px]">
          {/* Left column - Promo (static, no carousel) */}
          <div className="bg-muted/50 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-full max-w-[200px] h-[200px] mx-auto mb-6 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full text-muted-foreground/60"
                aria-hidden
              >
                <rect width="120" height="180" x="40" y="10" rx="8" fill="currentColor" opacity="0.3" />
                <rect width="60" height="90" x="70" y="30" rx="4" fill="currentColor" opacity="0.5" />
                <circle cx="100" cy="140" r="20" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Quick & easy ordering process
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Now you can order your medicine from Arogga. We provide all the medicines you need.
            </p>
            <div className="flex gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "rounded-full transition-all inline-block",
                    i === 0 ? "w-6 h-2 bg-teal-600" : "w-2 h-2 bg-muted-foreground/30"
                  )}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {/* Right column - Form */}
          <div className="bg-background flex flex-col p-6 md:p-8 relative">
            <DialogClose
              className="absolute top-4 right-4 rounded-md opacity-70 hover:opacity-100 transition-opacity focus:ring-2 focus:ring-offset-2 focus:outline-none"
              aria-label="Close"
            />
            <div className="pr-8">
              <DialogHeader className="text-left">
                <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm mt-1">
                  {subDescription}
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSend} className="flex flex-col gap-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-[100px] shrink-0 border-0 rounded-none focus:ring-0 bg-muted/30 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_CODES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-0 rounded-none focus-visible:ring-0 flex-1 min-w-0"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReferral(!showReferral)}
                className="flex items-center gap-1 text-sm text-primary hover:underline underline-offset-2"
              >
                Have a referral code?
                <ChevronRightIcon
                  className={cn("size-4 transition-transform", showReferral && "rotate-90")}
                />
              </button>
              {showReferral && (
                <Input
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="h-9"
                />
              )}

              <Button
                type="submit"
                disabled={sendLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white h-10"
              >
                {sendLoading ? "Sending…" : "Send"}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-12 rounded-full"
                onClick={() => handleSocialSignIn("google")}
                aria-label="Sign in with Google"
              >
                <GoogleIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-12 rounded-full"
                onClick={() => handleSocialSignIn("facebook")}
                aria-label="Sign in with Facebook"
              >
                <FacebookIcon />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4 text-center">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary font-medium hover:underline underline-offset-2"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary font-medium hover:underline underline-offset-2"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              By continuing you agree to{" "}
              <Link href="#" className="text-primary hover:underline underline-offset-2">
                Terms & Conditions
              </Link>
              ,{" "}
              <Link href="#" className="text-primary hover:underline underline-offset-2">
                Privacy Policy
              </Link>
              {" "}&{" "}
              <Link href="#" className="text-primary hover:underline underline-offset-2">
                Refund-Return Policy
              </Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
