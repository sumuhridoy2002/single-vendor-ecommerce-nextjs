"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import FacebookIcon from "../icons/FacebookIcon";

const COUNTRY_CODES = [
  { value: "+88", label: "+88 BD" },
];

const OTP_LENGTH = 4;

function buildFullPhone(phone: string): string {
  const phoneDigits = phone.replace(/\D/g, "").trim();
  return phoneDigits;
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { sendOtp, verifyOtp, loginAsGuest } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const fullPhone = buildFullPhone(phone);

  useEffect(() => {
    if (open) setStep("phone");
  }, [open]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    setSendLoading(true);
    try {
      await sendOtp(fullPhone);
      toast.success("OTP sent successfully to " + fullPhone);
      setStep("otp");
      setOtp("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }
    setVerifyLoading(true);
    try {
      await verifyOtp(fullPhone, otp);
      toast.success("Login successful");
      onOpenChange(false);
      setStep("phone");
      setPhone("");
      setOtp("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
  };

  const handleSocialSignIn = (provider: "google" | "facebook") => {
    signIn(provider, { callbackUrl: typeof window !== "undefined" ? window.location.href : "/" });
  };

  const handleLoginAsGuest = async () => {
    setGuestLoading(true);
    try {
      await loginAsGuest();
      toast.success("Logged in as guest");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Guest login failed");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeInOutsideClick={false}
        showCloseButton={false}
        className="max-w-[calc(100%-2rem)] w-full p-0 gap-0 overflow-x-hidden sm:max-w-4xl rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] min-h-[480px]">
          {/* Left column - Promo */}
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
                    i === 0 ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-muted-foreground/30"
                  )}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {/* Right column - Form */}
          <div className="bg-background flex flex-col p-6 md:p-8 relative">
            <DialogClose
              className="absolute top-4 right-4 rounded-md opacity-70 hover:opacity-100 transition-opacity focus:outline-none flex items-center justify-center size-8 outline-none focus:ring-0"
              aria-label="Close"
            >
              <X className="size-5" />
            </DialogClose>
            <div className="pr-8">
              <DialogHeader className="text-left">
                <DialogTitle className="text-xl font-bold">Login</DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm mt-1">
                  Login to make an order, access your orders, special offers, health tips, and more!
                </DialogDescription>
              </DialogHeader>
            </div>

            {step === "phone" ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <span className="text-center flex justify-center items-center w-[100px] shrink-0 rounded-none focus:ring-0 bg-muted/30 h-9 border-r">
                      +88 BD
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter number"
                      value={phone}
                      maxLength={11}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-0 rounded-none focus-visible:ring-0 flex-1 min-w-0 text-base md:text-base"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={sendLoading}
                  className="w-full bg-primary hover:bg-primary-dark text-white h-10"
                >
                  {sendLoading ? "Sending…" : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  Enter the 4-digit code sent to {fullPhone}
                </p>
                <div className="space-y-2">
                  <Label>OTP</Label>
                  <InputOTP
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={setOtp}
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup className="gap-2">
                      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  type="submit"
                  disabled={verifyLoading || otp.length !== OTP_LENGTH}
                  className="w-full bg-primary hover:bg-primary-dark text-white h-10"
                >
                  {verifyLoading ? "Verifying…" : "Verify"}
                </Button>
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Change phone number
                </button>
              </form>
            )}

            <div className="flex items-center gap-3 my-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mb-4"
              onClick={handleLoginAsGuest}
              disabled={guestLoading}
            >
              {guestLoading ? "Signing in…" : "Continue as guest"}
            </Button>

            <div className="flex gap-4 justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-12 rounded-full"
                onClick={() => handleSocialSignIn("google")}
                aria-label="Sign in with Google"
              >
                <FcGoogle size={24} />
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
