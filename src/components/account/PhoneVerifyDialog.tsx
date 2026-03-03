"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { phoneUpdateRequest, phoneUpdateVerify } from "@/lib/api/customer";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OTP_LENGTH = 4;

export interface PhoneVerifyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phone: string;
  onSuccess?: () => void;
}

export function PhoneVerifyDialog({
  open,
  onOpenChange,
  phone,
  onSuccess,
}: PhoneVerifyDialogProps) {
  const [otp, setOtp] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const normalizedPhone = phone.replace(/\D/g, "").trim();

  useEffect(() => {
    if (open && normalizedPhone) {
      setSendLoading(true);
      phoneUpdateRequest(normalizedPhone)
        .then(() => {
          toast.success("OTP sent to " + normalizedPhone);
          setOtp("");
        })
        .catch((err) => {
          toast.error(err instanceof Error ? err.message : "Failed to send OTP");
          onOpenChange(false);
        })
        .finally(() => setSendLoading(false));
    }
  }, [open, normalizedPhone, onOpenChange]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }
    if (!normalizedPhone) {
      toast.error("Phone number is required");
      return;
    }
    setVerifyLoading(true);
    try {
      await phoneUpdateVerify(normalizedPhone, otp);
      toast.success("Phone number verified successfully");
      onSuccess?.();
      onOpenChange(false);
      setOtp("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeInOutsideClick={false}
        className="sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Verify phone number</DialogTitle>
          <DialogDescription>
            {sendLoading
              ? "Sending OTP…"
              : `Enter the 4-digit code sent to ${normalizedPhone || phone}`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleVerify} className="flex flex-col gap-4 mt-2">
          <div className="space-y-2">
            <Label>OTP</Label>
            <InputOTP
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              containerClassName="justify-center"
              disabled={sendLoading}
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
            disabled={verifyLoading || otp.length !== OTP_LENGTH || sendLoading}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {verifyLoading ? "Verifying…" : "Verify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
