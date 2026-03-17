"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Gift, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const REFERRAL_REWARD = 40;
const REFERRAL_CODE_PLACEHOLDER = "2Y7YH9";

export default function ReferPage() {
  const { user } = useAuth();
  const [referralInput, setReferralInput] = useState("");
  const referralCode = REFERRAL_CODE_PLACEHOLDER; // TODO: from user or API

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${url}/?ref=${referralCode}`;
    void navigator.clipboard.writeText(shareUrl);
    toast.success("Shareable link copied to clipboard");
  };

  const handleRedeem = () => {
    if (!referralInput.trim()) {
      toast.error("Please enter a referral code");
      return;
    }
    toast.info("Referral code submitted. We will process it shortly.");
    setReferralInput("");
  };

  return (
    <div className="container max-w-2xl py-3 xs:py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">Refer and Earn</h1>

      <div className="flex justify-center gap-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-muted p-3">
            <Users className="size-8 text-muted-foreground" aria-hidden />
          </div>
          <span className="text-sm font-medium mt-2">৳{REFERRAL_REWARD}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-muted p-3">
            <Gift className="size-8 text-muted-foreground" aria-hidden />
          </div>
          <span className="text-sm font-medium mt-2">Bonus</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Invite friends. Earn money.</h2>
          <p className="text-muted-foreground mt-1">
            Tell a friend about Arogga and get {REFERRAL_REWARD} taka reward.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground mb-1">Your referral code:</p>
          <p className="text-xl font-bold text-foreground font-mono">{referralCode}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Enter Referral Code"
            value={referralInput}
            onChange={(e) => setReferralInput(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleRedeem} variant="outline">
            Redeem
          </Button>
        </div>

        <Button onClick={handleCopyLink} className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
          <Copy className="size-4 mr-2" aria-hidden />
          Copy Shareable Link
        </Button>

        <p className="text-sm text-muted-foreground">
          You will get {REFERRAL_REWARD} Taka each time your friends join with your referral code
          and place their first order. Make sure they enter this code while signing up for Arogga.
        </p>
        <p className="text-xs text-muted-foreground">* Your referral code is valid for lifetime.</p>
      </div>
    </div>
  );
}
