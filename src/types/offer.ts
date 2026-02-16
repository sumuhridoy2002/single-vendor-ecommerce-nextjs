/** Icon key used to resolve react-icons component in the UI */
export type OfferIconType =
  | "whatsapp"
  | "prescription"
  | "pharmacy"
  | "healthcare"
  | "headset"
  | "labtest"

/** Theme for card gradient and button (maps to Tailwind classes) */
export type OfferTheme =
  | "green"
  | "blue"
  | "teal"
  | "purple"
  | "orange"
  | "red"

export interface Offer {
  id: string
  /** e.g. "Order" or "UPTO" */
  title: string
  /** e.g. "Via WhatsApp" or "10% OFF" */
  subtitle: string
  /** Optional: phone number, "+ Cashback", etc. */
  extra?: string
  buttonText: string
  icon: OfferIconType
  theme: OfferTheme
  /** Link for the button (e.g. tel:, external URL) */
  href?: string
  /** Phone number for tel: links */
  phone?: string
}
