import type { CategoryTreeNode } from "@/types/product"

const CATEGORY_TREE: CategoryTreeNode[] = [
  {
    id: "medicine",
    title: "Medicine",
    slug: "medicine",
    children: [
      { id: "anesthetics-neurology", title: "Anesthetics & Neurology", slug: "anesthetics-neurology" },
      { id: "muscle-relaxants", title: "Muscle Relaxants", slug: "muscle-relaxants" },
      { id: "post-operative-pain", title: "Post-Operative Pain", slug: "post-operative-pain" },
      { id: "local-regional-anesthesia", title: "Local & Regional Anesthesia", slug: "local-regional-anesthesia" },
      { id: "general-anesthesia", title: "General Anesthesia", slug: "general-anesthesia" },
      { id: "anesthesia-recovery", title: "Anesthesia Recovery", slug: "anesthesia-recovery" },
      { id: "antimicrobial", title: "Antimicrobial", slug: "antimicrobial" },
      { id: "cardiovascular", title: "Cardiovascular System", slug: "cardiovascular" },
      { id: "musculoskeletal", title: "Musculoskeletal System", slug: "musculoskeletal" },
      { id: "chemotherapy", title: "Chemotherapy & Immunotherapy", slug: "chemotherapy" },
      { id: "ent-preparations", title: "E.N.T Preparations", slug: "ent-preparations" },
      { id: "allergy-immune", title: "Allergy & Immune System", slug: "allergy-immune" },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    slug: "healthcare",
    children: [
      { id: "blood-pressure", title: "Blood Pressure Monitors", slug: "blood-pressure" },
      { id: "thermometers", title: "Thermometers", slug: "thermometers" },
      { id: "first-aid", title: "First Aid", slug: "first-aid" },
      { id: "diabetes-care", title: "Diabetes Care", slug: "diabetes-care" },
    ],
  },
  {
    id: "lab-test",
    title: "Lab Test",
    slug: "lab-test",
    children: [
      { id: "blood-tests", title: "Blood Tests", slug: "blood-tests" },
      { id: "urine-tests", title: "Urine Tests", slug: "urine-tests" },
      { id: "lipid-profile", title: "Lipid Profile", slug: "lipid-profile" },
      { id: "thyroid", title: "Thyroid Panel", slug: "thyroid" },
      { id: "diabetes", title: "Diabetes Screening", slug: "diabetes" },
    ],
  },
  {
    id: "beauty",
    title: "Beauty",
    slug: "beauty",
    children: [
      { id: "skincare", title: "Skincare", slug: "skincare" },
      { id: "hair-care", title: "Hair Care", slug: "hair-care" },
      { id: "makeup", title: "Makeup", slug: "makeup" },
      { id: "fragrance", title: "Fragrance", slug: "fragrance" },
      { id: "personal-care", title: "Personal Care", slug: "personal-care" },
    ],
  },
  {
    id: "sexual-wellness",
    title: "Sexual Wellness",
    slug: "sexual-wellness",
    children: [
      { id: "contraceptives", title: "Contraceptives", slug: "contraceptives" },
      { id: "lubricants", title: "Lubricants", slug: "lubricants" },
      { id: "intimate-care", title: "Intimate Care", slug: "intimate-care" },
      { id: "pregnancy-tests", title: "Pregnancy Tests", slug: "pregnancy-tests" },
    ],
  },
  {
    id: "baby-mom-care",
    title: "Baby & Mom Care",
    slug: "baby-mom-care",
    children: [
      { id: "baby-food", title: "Baby Food", slug: "baby-food" },
      { id: "diapers-wipes", title: "Diapers & Wipes", slug: "diapers-wipes" },
      { id: "maternity", title: "Maternity Care", slug: "maternity" },
      { id: "feeding", title: "Feeding", slug: "feeding" },
      { id: "baby-skincare", title: "Baby Skincare", slug: "skincare" },
    ],
  },
  {
    id: "herbal",
    title: "Herbal",
    slug: "herbal",
    children: [
      { id: "teas", title: "Herbal Teas", slug: "teas" },
      { id: "extracts", title: "Herbal Extracts", slug: "extracts" },
      { id: "ayurvedic", title: "Ayurvedic", slug: "ayurvedic" },
      { id: "traditional", title: "Traditional Remedies", slug: "traditional" },
    ],
  },
  {
    id: "home-care",
    title: "Home Care",
    slug: "home-care",
    children: [
      { id: "cleaning", title: "Cleaning Supplies", slug: "cleaning" },
      { id: "laundry", title: "Laundry", slug: "laundry" },
      { id: "disinfectants", title: "Disinfectants", slug: "disinfectants" },
      { id: "air-fresheners", title: "Air Fresheners", slug: "air-fresheners" },
    ],
  },
  {
    id: "supplement",
    title: "Supplement",
    slug: "supplement",
    children: [
      { id: "vitamins", title: "Vitamins", slug: "vitamins" },
      { id: "minerals", title: "Minerals", slug: "minerals" },
      { id: "protein", title: "Protein", slug: "protein" },
      { id: "omega", title: "Omega & Fish Oil", slug: "omega" },
      { id: "multivitamins", title: "Multivitamins", slug: "multivitamins" },
    ],
  },
  {
    id: "food-nutrition",
    title: "Food and Nutrition",
    slug: "food-nutrition",
    children: [
      { id: "snacks", title: "Snacks", slug: "snacks" },
      { id: "beverages", title: "Beverages", slug: "beverages" },
      { id: "organic", title: "Organic Food", slug: "organic" },
      { id: "diet-weight", title: "Diet & Weight", slug: "diet-weight" },
    ],
  },
  {
    id: "pet-care",
    title: "Pet Care",
    slug: "pet-care",
    children: [
      { id: "dog-food", title: "Dog Food", slug: "dog-food" },
      { id: "cat-food", title: "Cat Food", slug: "cat-food" },
      { id: "grooming", title: "Pet Grooming", slug: "grooming" },
      { id: "flea-tick", title: "Flea & Tick", slug: "flea-tick" },
      { id: "pet-supplements", title: "Pet Supplements", slug: "supplements" },
    ],
  },
  {
    id: "veterinary",
    title: "Veterinary",
    slug: "veterinary",
    children: [
      { id: "pet-medicine", title: "Pet Medicine", slug: "pet-medicine" },
      { id: "wormers", title: "Wormers", slug: "wormers" },
      { id: "ear-eye", title: "Ear & Eye Care", slug: "ear-eye" },
      { id: "surgical", title: "Surgical Supplies", slug: "surgical" },
    ],
  },
  {
    id: "homeopathy",
    title: "Homeopathy",
    slug: "homeopathy",
    children: [
      { id: "arnica", title: "Arnica", slug: "arnica" },
      { id: "cold-flu", title: "Cold & Flu", slug: "cold-flu" },
      { id: "digestive", title: "Digestive", slug: "digestive" },
      { id: "stress-sleep", title: "Stress & Sleep", slug: "stress-sleep" },
      { id: "homeopathy-first-aid", title: "First Aid", slug: "first-aid" },
    ],
  },
]

export interface ResolvedCategory {
  type: "main" | "sub"
  main: CategoryTreeNode
  sub?: CategoryTreeNode
  breadcrumb: { title: string; href: string }[]
}

export function useCategoryTree(): CategoryTreeNode[] {
  return CATEGORY_TREE
}

/** Resolve category from slug path. slug = [] | [main] | [main, sub]. */
export function getCategoryBySlugPath(slug: string[] | undefined): ResolvedCategory | null {
  if (!slug || slug.length === 0) return null
  const mainSlug = slug[0]
  const main = CATEGORY_TREE.find((c) => c.slug === mainSlug)
  if (!main) return null
  const breadcrumb: { title: string; href: string }[] = [
    { title: "Home", href: "/" },
    { title: main.title, href: `/category/${main.slug}` },
  ]
  if (slug.length === 1) {
    return { type: "main", main, breadcrumb }
  }
  const subSlug = slug[1]
  const sub = main.children?.find((s) => s.slug === subSlug)
  if (!sub) return null
  breadcrumb.push({ title: sub.title, href: `/category/${main.slug}/${sub.slug}` })
  return { type: "sub", main, sub, breadcrumb }
}

/** Sibling sub-categories for "Shop By Category" grid. On main page = children; on sub page = same children (siblings). */
export function getSiblingSubcategories(resolved: ResolvedCategory): CategoryTreeNode[] {
  return resolved.main.children ?? []
}

/** All category ids under a main (main id + all child ids) for product filtering. */
export function getCategoryIdsForMain(main: CategoryTreeNode): string[] {
  const ids = [main.id]
  main.children?.forEach((c) => ids.push(c.id))
  return ids
}
