import { NextResponse } from "next/server"
import type { Offer } from "@/types/offer"

const MOCK_OFFERS: Offer[] = [
  {
    id: "whatsapp",
    title: "Order",
    subtitle: "Via WhatsApp",
    extra: "01810117100",
    buttonText: "Call Now",
    icon: "whatsapp",
    theme: "green",
    phone: "01810117100",
    href: "tel:01810117100",
  },
  {
    id: "prescription",
    title: "UPTO",
    subtitle: "10% OFF",
    extra: "+ Cashback",
    buttonText: "Upload Prescription",
    icon: "prescription",
    theme: "blue",
    href: "#upload-prescription",
  },
  {
    id: "pharmacy",
    title: "UPTO",
    subtitle: "14% OFF",
    extra: "+ Cashback",
    buttonText: "Register Pharmacy",
    icon: "pharmacy",
    theme: "teal",
    href: "#register-pharmacy",
  },
  {
    id: "healthcare",
    title: "UPTO",
    subtitle: "60% OFF",
    extra: "+ Cashback",
    buttonText: "HealthCare",
    icon: "healthcare",
    theme: "purple",
    href: "#healthcare",
  },
  {
    id: "headset",
    title: "UPTO",
    subtitle: "10% OFF",
    extra: "16778",
    buttonText: "Call To Order",
    icon: "headset",
    theme: "orange",
    phone: "16778",
    href: "tel:16778",
  },
  {
    id: "labtest",
    title: "UPTO",
    subtitle: "25% OFF",
    buttonText: "Lab Test",
    icon: "labtest",
    theme: "red",
    href: "#lab-test",
  },
]

export async function GET() {
  return NextResponse.json({ offers: MOCK_OFFERS })
}
