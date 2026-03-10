"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/api/newsletter";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email address");
      return;
    }
    if (!isValidEmail(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await subscribeNewsletter(trimmed);
      toast.success(res.message ?? "Subscribed successfully");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:gap-2">
      <Input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        className="min-w-0 flex-1"
        aria-label="Email for newsletter"
      />
      <Button type="submit" disabled={loading} size="default" className="shrink-0">
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Subscribe"
        )}
      </Button>
    </form>
  );
}
