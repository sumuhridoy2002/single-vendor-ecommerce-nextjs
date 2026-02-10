import type { LucideIcon } from "lucide-react"
import {
  Baby,
  Dog,
  Droplets,
  FlaskConical,
  Heart,
  HeartPulse,
  Home,
  Leaf,
  Package,
  Pill,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
} from "lucide-react"

export type Subcategory = {
  label: string
  href: string
  icon: LucideIcon
}

export type Category = {
  label: string
  href: string
  icon: LucideIcon
  active?: boolean
  subcategories?: Subcategory[]
}

export const categories: Category[] = [
  {
    label: "Medicine",
    href: "/medicine",
    icon: Pill,
    subcategories: [
      { label: "Anesthetics & Neurology", href: "/medicine/anesthetics-neurology", icon: Pill },
      { label: "Muscle Relaxants", href: "/medicine/muscle-relaxants", icon: Pill },
      { label: "Post-Operative Pain", href: "/medicine/post-operative-pain", icon: Pill },
      { label: "Local & Regional Anesthesia", href: "/medicine/local-regional-anesthesia", icon: Pill },
      { label: "General Anesthesia", href: "/medicine/general-anesthesia", icon: Pill },
      { label: "Anesthesia Recovery", href: "/medicine/anesthesia-recovery", icon: Pill },
      { label: "Antimicrobial", href: "/medicine/antimicrobial", icon: Package },
      { label: "Cardiovascular System", href: "/medicine/cardiovascular", icon: Package },
      { label: "Musculoskeletal System", href: "/medicine/musculoskeletal", icon: Package },
      { label: "Chemotherapy & Immunotherapy", href: "/medicine/chemotherapy", icon: Package },
      { label: "E.N.T Preparations", href: "/medicine/ent-preparations", icon: Package },
      { label: "Allergy & Immune System", href: "/medicine/allergy-immune", icon: Package },
    ],
  },
  {
    label: "Healthcare",
    href: "/healthcare",
    icon: HeartPulse,
    subcategories: [
      { label: "Blood Pressure Monitors", href: "/healthcare/blood-pressure", icon: HeartPulse },
      { label: "Thermometers", href: "/healthcare/thermometers", icon: HeartPulse },
      { label: "First Aid", href: "/healthcare/first-aid", icon: HeartPulse },
      { label: "Diabetes Care", href: "/healthcare/diabetes-care", icon: HeartPulse },
    ],
  },
  {
    label: "Lab Test",
    href: "/lab-test",
    icon: FlaskConical,
    subcategories: [
      { label: "Blood Tests", href: "/lab-test/blood-tests", icon: FlaskConical },
      { label: "Urine Tests", href: "/lab-test/urine-tests", icon: FlaskConical },
      { label: "Lipid Profile", href: "/lab-test/lipid-profile", icon: HeartPulse },
      { label: "Thyroid Panel", href: "/lab-test/thyroid", icon: FlaskConical },
      { label: "Diabetes Screening", href: "/lab-test/diabetes", icon: HeartPulse },
    ],
  },
  {
    label: "Beauty",
    href: "/beauty",
    icon: Sparkles,
    subcategories: [
      { label: "Skincare", href: "/beauty/skincare", icon: Sparkles },
      { label: "Hair Care", href: "/beauty/hair-care", icon: Sparkles },
      { label: "Makeup", href: "/beauty/makeup", icon: Sparkles },
      { label: "Fragrance", href: "/beauty/fragrance", icon: Sparkles },
      { label: "Personal Care", href: "/beauty/personal-care", icon: Package },
    ],
  },
  {
    label: "Sexual Wellness",
    href: "/sexual-wellness",
    icon: Heart,
    subcategories: [
      { label: "Contraceptives", href: "/sexual-wellness/contraceptives", icon: Heart },
      { label: "Lubricants", href: "/sexual-wellness/lubricants", icon: Package },
      { label: "Intimate Care", href: "/sexual-wellness/intimate-care", icon: Heart },
      { label: "Pregnancy Tests", href: "/sexual-wellness/pregnancy-tests", icon: HeartPulse },
    ],
  },
  {
    label: "Baby & Mom Care",
    href: "/baby-mom-care",
    icon: Baby,
    subcategories: [
      { label: "Baby Food", href: "/baby-mom-care/baby-food", icon: Baby },
      { label: "Diapers & Wipes", href: "/baby-mom-care/diapers-wipes", icon: Baby },
      { label: "Maternity Care", href: "/baby-mom-care/maternity", icon: Heart },
      { label: "Feeding", href: "/baby-mom-care/feeding", icon: UtensilsCrossed },
      { label: "Baby Skincare", href: "/baby-mom-care/skincare", icon: Sparkles },
    ],
  },
  {
    label: "Herbal",
    href: "/herbal",
    icon: Leaf,
    subcategories: [
      { label: "Herbal Teas", href: "/herbal/teas", icon: Leaf },
      { label: "Herbal Extracts", href: "/herbal/extracts", icon: Droplets },
      { label: "Ayurvedic", href: "/herbal/ayurvedic", icon: Leaf },
      { label: "Traditional Remedies", href: "/herbal/traditional", icon: Pill },
    ],
  },
  {
    label: "Home Care",
    href: "/home-care",
    icon: Home,
    subcategories: [
      { label: "Cleaning Supplies", href: "/home-care/cleaning", icon: Home },
      { label: "Laundry", href: "/home-care/laundry", icon: Home },
      { label: "Disinfectants", href: "/home-care/disinfectants", icon: Package },
      { label: "Air Fresheners", href: "/home-care/air-fresheners", icon: Sparkles },
    ],
  },
  {
    label: "Supplement",
    href: "/supplement",
    icon: Pill,
    subcategories: [
      { label: "Vitamins", href: "/supplement/vitamins", icon: Pill },
      { label: "Minerals", href: "/supplement/minerals", icon: Pill },
      { label: "Protein", href: "/supplement/protein", icon: Package },
      { label: "Omega & Fish Oil", href: "/supplement/omega", icon: Droplets },
      { label: "Multivitamins", href: "/supplement/multivitamins", icon: Pill },
    ],
  },
  {
    label: "Food and Nutrition",
    href: "/food-nutrition",
    icon: UtensilsCrossed,
    subcategories: [
      { label: "Snacks", href: "/food-nutrition/snacks", icon: UtensilsCrossed },
      { label: "Beverages", href: "/food-nutrition/beverages", icon: Droplets },
      { label: "Organic Food", href: "/food-nutrition/organic", icon: Leaf },
      { label: "Diet & Weight", href: "/food-nutrition/diet-weight", icon: Package },
    ],
  },
  {
    label: "Pet Care",
    href: "/pet-care",
    icon: Dog,
    subcategories: [
      { label: "Dog Food", href: "/pet-care/dog-food", icon: Dog },
      { label: "Cat Food", href: "/pet-care/cat-food", icon: Dog },
      { label: "Pet Grooming", href: "/pet-care/grooming", icon: Sparkles },
      { label: "Flea & Tick", href: "/pet-care/flea-tick", icon: Pill },
      { label: "Pet Supplements", href: "/pet-care/supplements", icon: Package },
    ],
  },
  {
    label: "Veterinary",
    href: "/veterinary",
    icon: Stethoscope,
    subcategories: [
      { label: "Pet Medicine", href: "/veterinary/pet-medicine", icon: Pill },
      { label: "Wormers", href: "/veterinary/wormers", icon: Pill },
      { label: "Ear & Eye Care", href: "/veterinary/ear-eye", icon: Stethoscope },
      { label: "Surgical Supplies", href: "/veterinary/surgical", icon: Package },
    ],
  },
  {
    label: "Homeopathy",
    href: "/homeopathy",
    icon: Pill,
    subcategories: [
      { label: "Arnica", href: "/homeopathy/arnica", icon: Droplets },
      { label: "Cold & Flu", href: "/homeopathy/cold-flu", icon: Pill },
      { label: "Digestive", href: "/homeopathy/digestive", icon: Leaf },
      { label: "Stress & Sleep", href: "/homeopathy/stress-sleep", icon: Droplets },
      { label: "First Aid", href: "/homeopathy/first-aid", icon: HeartPulse },
    ],
  },
]
