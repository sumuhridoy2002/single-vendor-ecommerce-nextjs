"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

const FAQ_SECTIONS = [
  {
    title: "Medicine and Healthcare Orders",
    items: [
      { q: "When will I receive my order?", a: "Delivery times vary by location. Inside Dhaka you can expect 12–24 hours; outside Dhaka typically 2–5 days." },
      { q: "I have received damaged items.", a: "Please contact support within 7 days with your order ID and photos. We will arrange replacement or refund." },
      { q: "Items are different from what I ordered.", a: "Contact us with your order details and we will correct the order or offer a refund." },
      { q: "What if items are missing from my order?", a: "Report missing items as soon as possible. We may offer instant refund or ship the missing items." },
      { q: "How do I cancel my order?", a: "You can request cancellation from your order history before it is shipped. Contact support for assistance." },
      { q: "I want to modify my order.", a: "Reach out to support quickly; we can modify the order if it has not been dispatched." },
      { q: "What is the shelf life of medicines being provided?", a: "We ensure medicines have adequate shelf life. Expiry dates are visible on packaging." },
    ],
  },
  {
    title: "Delivery",
    items: [
      { q: "What areas do you deliver to?", a: "We deliver across Bangladesh. Delivery time and charges depend on your area." },
      { q: "Can I track my order?", a: "Yes. Use the order ID in your account to track status and estimated delivery." },
    ],
  },
  {
    title: "Payments",
    items: [
      { q: "What payment methods do you accept?", a: "We accept cash on delivery (COD), bKash, cards, and other methods as shown at checkout." },
      { q: "Is my payment information secure?", a: "We use secure payment gateways and do not store your card details." },
    ],
  },
  {
    title: "Referrals",
    items: [
      { q: "How does the referral program work?", a: "Share your referral code with friends. When they sign up and place their first order, you earn reward cash." },
    ],
  },
  {
    title: "Arogga Cash",
    items: [
      { q: "What is Arogga Cash?", a: "Arogga Cash is reward balance you can earn and use on future orders." },
      { q: "How can I use Arogga Cash?", a: "You can apply it at checkout to get a discount on your order." },
    ],
  },
  {
    title: "Promotions",
    items: [
      { q: "Where can I see current offers?", a: "Check the Special Offers section in your account and our homepage banners." },
    ],
  },
  {
    title: "Return",
    items: [
      { q: "How do I return or replace an item?", a: "See our Return and Refund Policy in Legal & Support. You may need to provide an unboxing video for claims." },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="container max-w-3xl py-3 xs:py-6 md:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Hi, what can we help you with?
      </h1>

      <div className="space-y-2">
        {FAQ_SECTIONS.map((section, idx) => (
          <Collapsible
            key={section.title}
            defaultOpen={idx === 0}
            className="rounded-xl border border-border bg-card"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-medium text-foreground hover:bg-muted/50 transition-colors rounded-xl [&[data-state=open]>svg]:rotate-90">
              <span>{section.title}</span>
              <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform" aria-hidden />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="border-t border-border px-4 py-3 space-y-4">
                {section.items.map((item) => (
                  <li key={item.q}>
                    <p className="font-medium text-foreground text-sm">{item.q}</p>
                    <p className="text-muted-foreground text-sm mt-1">{item.a}</p>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
