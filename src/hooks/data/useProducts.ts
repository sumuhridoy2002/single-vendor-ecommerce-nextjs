import type { Product } from "@/types/product"

const PLACEHOLDER_IMAGE = "https://placehold.co/400x400?text=Product"

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Organic Honey 500gm",
    slug: "organic-honey-500gm",
    image: PLACEHOLDER_IMAGE,
    price: 450,
    originalPrice: 500,
    discountPercent: 10,
    badge: "sale",
    rating: 4.5,
    reviewCount: 128,
    unit: "500gm",
    categoryId: "daily-essentials",
  },
  {
    id: "2",
    name: "Vitamin C Tablets 60s",
    slug: "vitamin-c-tablets-60s",
    image: PLACEHOLDER_IMAGE,
    price: 299,
    originalPrice: 350,
    discountPercent: 15,
    badge: "new",
    rating: 4.8,
    reviewCount: 256,
    unit: "60 tablets",
    categoryId: "daily-essentials",
  },
  {
    id: "3",
    name: "Hand Sanitizer 500ml",
    slug: "hand-sanitizer-500ml",
    image: PLACEHOLDER_IMAGE,
    price: 180,
    rating: 4.2,
    reviewCount: 89,
    unit: "500ml",
    categoryId: "daily-essentials",
  },
  {
    id: "4",
    name: "Blood Pressure Monitor",
    slug: "blood-pressure-monitor",
    image: PLACEHOLDER_IMAGE,
    price: 2499,
    originalPrice: 2999,
    discountPercent: 17,
    badge: "bestseller",
    rating: 4.6,
    reviewCount: 412,
    categoryId: "best-seller",
  },
  {
    id: "5",
    name: "Digital Thermometer",
    slug: "digital-thermometer",
    image: PLACEHOLDER_IMAGE,
    price: 199,
    badge: "sale",
    rating: 4.4,
    reviewCount: 203,
    categoryId: "best-seller",
  },
  {
    id: "6",
    name: "Multivitamin Capsules 30s",
    slug: "multivitamin-capsules-30s",
    image: PLACEHOLDER_IMAGE,
    price: 399,
    originalPrice: 449,
    discountPercent: 11,
    rating: 4.7,
    reviewCount: 567,
    unit: "30 caps",
    categoryId: "best-seller",
  },
  {
    id: "7",
    name: "Wireless BP Monitor",
    slug: "wireless-bp-monitor",
    image: PLACEHOLDER_IMAGE,
    price: 3499,
    badge: "new",
    rating: 4.3,
    reviewCount: 78,
    categoryId: "new-arrivals",
  },
  {
    id: "8",
    name: "Omega-3 Fish Oil 60 softgels",
    slug: "omega-3-fish-oil-60",
    image: PLACEHOLDER_IMAGE,
    price: 599,
    originalPrice: 699,
    discountPercent: 14,
    badge: "new",
    rating: 4.9,
    reviewCount: 312,
    unit: "60 softgels",
    categoryId: "new-arrivals",
  },
  {
    id: "9",
    name: "First Aid Kit Premium",
    slug: "first-aid-kit-premium",
    image: PLACEHOLDER_IMAGE,
    price: 899,
    rating: 4.5,
    reviewCount: 145,
    categoryId: "new-arrivals",
  },
  {
    id: "10",
    name: "Glucose Monitor Strips 50s",
    slug: "glucose-monitor-strips-50s",
    image: PLACEHOLDER_IMAGE,
    price: 549,
    originalPrice: 649,
    discountPercent: 15,
    badge: "sale",
    rating: 4.6,
    reviewCount: 234,
    unit: "50 strips",
    categoryId: "trending",
  },
  {
    id: "11",
    name: "Knee Support Brace",
    slug: "knee-support-brace",
    image: PLACEHOLDER_IMAGE,
    price: 449,
    rating: 4.4,
    reviewCount: 189,
    categoryId: "trending",
  },
  {
    id: "12",
    name: "N95 Face Masks 10pcs",
    slug: "n95-face-masks-10pcs",
    image: PLACEHOLDER_IMAGE,
    price: 299,
    badge: "sale",
    rating: 4.2,
    reviewCount: 445,
    unit: "10 pcs",
    categoryId: "trending",
  },
  {
    id: "13",
    name: "Calcium + D3 Tablets 60s",
    slug: "calcium-d3-tablets-60s",
    image: PLACEHOLDER_IMAGE,
    price: 349,
    rating: 4.7,
    reviewCount: 278,
    unit: "60 tablets",
    categoryId: "popular",
  },
  {
    id: "14",
    name: "Pain Relief Gel 100gm",
    slug: "pain-relief-gel-100gm",
    image: PLACEHOLDER_IMAGE,
    price: 275,
    originalPrice: 320,
    discountPercent: 14,
    rating: 4.3,
    reviewCount: 156,
    unit: "100gm",
    categoryId: "popular",
  },
  {
    id: "15",
    name: "Protein Powder 1kg",
    slug: "protein-powder-1kg",
    image: PLACEHOLDER_IMAGE,
    price: 1899,
    badge: "bestseller",
    rating: 4.8,
    reviewCount: 623,
    unit: "1kg",
    categoryId: "recommended",
  },
  {
    id: "16",
    name: "Iron Supplement 30 tablets",
    slug: "iron-supplement-30",
    image: PLACEHOLDER_IMAGE,
    price: 199,
    rating: 4.1,
    reviewCount: 92,
    unit: "30 tablets",
    categoryId: "recommended",
  },
  // daily-essentials (9 more to reach 12)
  { id: "17", name: "Face Mask 50pcs", slug: "face-mask-50pcs", image: PLACEHOLDER_IMAGE, price: 249, originalPrice: 299, discountPercent: 17, badge: "sale", rating: 4.3, reviewCount: 112, unit: "50 pcs", categoryId: "daily-essentials" },
  { id: "18", name: "Hand Cream 100ml", slug: "hand-cream-100ml", image: PLACEHOLDER_IMAGE, price: 159, rating: 4.5, reviewCount: 87, unit: "100ml", categoryId: "daily-essentials" },
  { id: "19", name: "Lip Balm 3-Pack", slug: "lip-balm-3-pack", image: PLACEHOLDER_IMAGE, price: 99, badge: "new", rating: 4.6, reviewCount: 234, unit: "3 pcs", categoryId: "daily-essentials" },
  { id: "20", name: "Cotton Balls 200pcs", slug: "cotton-balls-200pcs", image: PLACEHOLDER_IMAGE, price: 89, rating: 4.2, reviewCount: 56, unit: "200 pcs", categoryId: "daily-essentials" },
  { id: "21", name: "Tissue Box 6-Pack", slug: "tissue-box-6-pack", image: PLACEHOLDER_IMAGE, price: 199, originalPrice: 249, discountPercent: 20, rating: 4.4, reviewCount: 178, unit: "6 boxes", categoryId: "daily-essentials" },
  { id: "22", name: "Soap Bar 5-Pack", slug: "soap-bar-5-pack", image: PLACEHOLDER_IMAGE, price: 179, rating: 4.1, reviewCount: 94, unit: "5 pcs", categoryId: "daily-essentials" },
  { id: "23", name: "Mouthwash 500ml", slug: "mouthwash-500ml", image: PLACEHOLDER_IMAGE, price: 229, badge: "sale", rating: 4.7, reviewCount: 312, unit: "500ml", categoryId: "daily-essentials" },
  { id: "24", name: "Toothpaste Twin Pack", slug: "toothpaste-twin-pack", image: PLACEHOLDER_IMAGE, price: 149, rating: 4.5, reviewCount: 445, unit: "2 pcs", categoryId: "daily-essentials" },
  { id: "25", name: "Shampoo 400ml", slug: "shampoo-400ml", image: PLACEHOLDER_IMAGE, price: 299, originalPrice: 349, discountPercent: 14, rating: 4.6, reviewCount: 267, unit: "400ml", categoryId: "daily-essentials" },
  // best-seller (9 more to reach 12)
  { id: "26", name: "Pulse Oximeter", slug: "pulse-oximeter", image: PLACEHOLDER_IMAGE, price: 899, originalPrice: 999, discountPercent: 10, badge: "bestseller", rating: 4.5, reviewCount: 389, categoryId: "best-seller" },
  { id: "27", name: "Weighing Scale Digital", slug: "weighing-scale-digital", image: PLACEHOLDER_IMAGE, price: 449, rating: 4.3, reviewCount: 201, categoryId: "best-seller" },
  { id: "28", name: "B Complex Tablets 30s", slug: "b-complex-tablets-30s", image: PLACEHOLDER_IMAGE, price: 279, badge: "sale", rating: 4.6, reviewCount: 156, unit: "30 tablets", categoryId: "best-seller" },
  { id: "29", name: "Zinc Supplements 60s", slug: "zinc-supplements-60s", image: PLACEHOLDER_IMAGE, price: 349, rating: 4.4, reviewCount: 98, unit: "60 caps", categoryId: "best-seller" },
  { id: "30", name: "Magnesium Tablets 90s", slug: "magnesium-tablets-90s", image: PLACEHOLDER_IMAGE, price: 499, originalPrice: 599, discountPercent: 17, rating: 4.7, reviewCount: 223, unit: "90 tablets", categoryId: "best-seller" },
  { id: "31", name: "Vitamin D3 Drops 30ml", slug: "vitamin-d3-drops-30ml", image: PLACEHOLDER_IMAGE, price: 399, rating: 4.8, reviewCount: 412, unit: "30ml", categoryId: "best-seller" },
  { id: "32", name: "Ashwagandha Capsules 60s", slug: "ashwagandha-capsules-60s", image: PLACEHOLDER_IMAGE, price: 549, badge: "new", rating: 4.5, reviewCount: 178, unit: "60 caps", categoryId: "best-seller" },
  { id: "33", name: "Turmeric Curcumin 60s", slug: "turmeric-curcumin-60s", image: PLACEHOLDER_IMAGE, price: 429, rating: 4.6, reviewCount: 289, unit: "60 caps", categoryId: "best-seller" },
  { id: "34", name: "Probiotic Capsules 30s", slug: "probiotic-capsules-30s", image: PLACEHOLDER_IMAGE, price: 599, originalPrice: 699, discountPercent: 14, rating: 4.7, reviewCount: 334, unit: "30 caps", categoryId: "best-seller" },
  // new-arrivals (9 more to reach 12)
  { id: "35", name: "Smart Watch Health", slug: "smart-watch-health", image: PLACEHOLDER_IMAGE, price: 2999, badge: "new", rating: 4.4, reviewCount: 67, categoryId: "new-arrivals" },
  { id: "36", name: "Neck Massager", slug: "neck-massager", image: PLACEHOLDER_IMAGE, price: 1299, originalPrice: 1499, discountPercent: 13, rating: 4.2, reviewCount: 145, categoryId: "new-arrivals" },
  { id: "37", name: "Posture Corrector", slug: "posture-corrector", image: PLACEHOLDER_IMAGE, price: 599, rating: 4.1, reviewCount: 89, categoryId: "new-arrivals" },
  { id: "38", name: "Sleep Aid Spray", slug: "sleep-aid-spray", image: PLACEHOLDER_IMAGE, price: 349, badge: "new", rating: 4.5, reviewCount: 112, unit: "30ml", categoryId: "new-arrivals" },
  { id: "39", name: "Collagen Peptides 300gm", slug: "collagen-peptides-300gm", image: PLACEHOLDER_IMAGE, price: 899, rating: 4.6, reviewCount: 198, unit: "300gm", categoryId: "new-arrivals" },
  { id: "40", name: "Biotin Gummies 60s", slug: "biotin-gummies-60s", image: PLACEHOLDER_IMAGE, price: 449, originalPrice: 499, discountPercent: 10, rating: 4.4, reviewCount: 267, unit: "60 gummies", categoryId: "new-arrivals" },
  { id: "41", name: "Electrolyte Powder 500gm", slug: "electrolyte-powder-500gm", image: PLACEHOLDER_IMAGE, price: 299, rating: 4.3, reviewCount: 76, unit: "500gm", categoryId: "new-arrivals" },
  { id: "42", name: "Hair Growth Serum 60ml", slug: "hair-growth-serum-60ml", image: PLACEHOLDER_IMAGE, price: 699, badge: "new", rating: 4.5, reviewCount: 134, unit: "60ml", categoryId: "new-arrivals" },
  { id: "43", name: "Knee Cap Support Pair", slug: "knee-cap-support-pair", image: PLACEHOLDER_IMAGE, price: 399, rating: 4.2, reviewCount: 98, unit: "1 pair", categoryId: "new-arrivals" },
  // trending (9 more to reach 12)
  { id: "44", name: "Wrist Support Brace", slug: "wrist-support-brace", image: PLACEHOLDER_IMAGE, price: 279, badge: "sale", rating: 4.3, reviewCount: 167, categoryId: "trending" },
  { id: "45", name: "Ankle Support", slug: "ankle-support", image: PLACEHOLDER_IMAGE, price: 349, rating: 4.4, reviewCount: 123, categoryId: "trending" },
  { id: "46", name: "Back Support Belt", slug: "back-support-belt", image: PLACEHOLDER_IMAGE, price: 599, originalPrice: 699, discountPercent: 14, rating: 4.5, reviewCount: 256, categoryId: "trending" },
  { id: "47", name: "Elbow Support", slug: "elbow-support", image: PLACEHOLDER_IMAGE, price: 249, rating: 4.2, reviewCount: 89, categoryId: "trending" },
  { id: "48", name: "Compression Socks Pair", slug: "compression-socks-pair", image: PLACEHOLDER_IMAGE, price: 399, rating: 4.6, reviewCount: 178, unit: "1 pair", categoryId: "trending" },
  { id: "49", name: "Hot Cold Pack", slug: "hot-cold-pack", image: PLACEHOLDER_IMAGE, price: 199, badge: "sale", rating: 4.1, reviewCount: 145, categoryId: "trending" },
  { id: "50", name: "Massage Roller", slug: "massage-roller", image: PLACEHOLDER_IMAGE, price: 449, rating: 4.5, reviewCount: 212, categoryId: "trending" },
  { id: "51", name: "Resistance Bands Set", slug: "resistance-bands-set", image: PLACEHOLDER_IMAGE, price: 549, originalPrice: 649, discountPercent: 15, rating: 4.7, reviewCount: 289, categoryId: "trending" },
  { id: "52", name: "Yoga Mat 6mm", slug: "yoga-mat-6mm", image: PLACEHOLDER_IMAGE, price: 699, rating: 4.4, reviewCount: 334, categoryId: "trending" },
  // popular (10 more to reach 12)
  { id: "53", name: "Antacid Tablets 30s", slug: "antacid-tablets-30s", image: PLACEHOLDER_IMAGE, price: 129, rating: 4.2, reviewCount: 234, unit: "30 tablets", categoryId: "popular" },
  { id: "54", name: "Antiseptic Cream 30gm", slug: "antiseptic-cream-30gm", image: PLACEHOLDER_IMAGE, price: 89, badge: "sale", rating: 4.5, reviewCount: 445, unit: "30gm", categoryId: "popular" },
  { id: "55", name: "Bandage Roll 5m", slug: "bandage-roll-5m", image: PLACEHOLDER_IMAGE, price: 79, rating: 4.1, reviewCount: 112, unit: "5m", categoryId: "popular" },
  { id: "56", name: "Gauze Pads 10pcs", slug: "gauze-pads-10pcs", image: PLACEHOLDER_IMAGE, price: 99, rating: 4.3, reviewCount: 78, unit: "10 pcs", categoryId: "popular" },
  { id: "57", name: "Antifungal Cream 20gm", slug: "antifungal-cream-20gm", image: PLACEHOLDER_IMAGE, price: 149, originalPrice: 179, discountPercent: 17, rating: 4.4, reviewCount: 189, unit: "20gm", categoryId: "popular" },
  { id: "58", name: "Hydrogen Peroxide 100ml", slug: "hydrogen-peroxide-100ml", image: PLACEHOLDER_IMAGE, price: 119, rating: 4.0, reviewCount: 56, unit: "100ml", categoryId: "popular" },
  { id: "59", name: "Burn Gel 50gm", slug: "burn-gel-50gm", image: PLACEHOLDER_IMAGE, price: 199, rating: 4.6, reviewCount: 167, unit: "50gm", categoryId: "popular" },
  { id: "60", name: "Insect Bite Relief", slug: "insect-bite-relief", image: PLACEHOLDER_IMAGE, price: 139, rating: 4.2, reviewCount: 134, unit: "15ml", categoryId: "popular" },
  { id: "61", name: "Muscle Relaxant Spray", slug: "muscle-relaxant-spray", image: PLACEHOLDER_IMAGE, price: 279, badge: "bestseller", rating: 4.5, reviewCount: 298, unit: "100ml", categoryId: "popular" },
  { id: "62", name: "Joint Pain Oil 100ml", slug: "joint-pain-oil-100ml", image: PLACEHOLDER_IMAGE, price: 349, rating: 4.4, reviewCount: 223, unit: "100ml", categoryId: "popular" },
  // recommended (10 more to reach 12)
  { id: "63", name: "Whey Protein 500gm", slug: "whey-protein-500gm", image: PLACEHOLDER_IMAGE, price: 1299, originalPrice: 1499, discountPercent: 13, badge: "bestseller", rating: 4.8, reviewCount: 567, unit: "500gm", categoryId: "recommended" },
  { id: "64", name: "Creatine Monohydrate 300gm", slug: "creatine-monohydrate-300gm", image: PLACEHOLDER_IMAGE, price: 799, rating: 4.6, reviewCount: 234, unit: "300gm", categoryId: "recommended" },
  { id: "65", name: "BCAA Powder 400gm", slug: "bcaa-powder-400gm", image: PLACEHOLDER_IMAGE, price: 999, badge: "sale", rating: 4.5, reviewCount: 178, unit: "400gm", categoryId: "recommended" },
  { id: "66", name: "Pre-Workout 300gm", slug: "pre-workout-300gm", image: PLACEHOLDER_IMAGE, price: 1499, rating: 4.4, reviewCount: 312, unit: "300gm", categoryId: "recommended" },
  { id: "67", name: "Mass Gainer 1kg", slug: "mass-gainer-1kg", image: PLACEHOLDER_IMAGE, price: 1899, originalPrice: 2099, discountPercent: 10, rating: 4.7, reviewCount: 445, unit: "1kg", categoryId: "recommended" },
  { id: "68", name: "Vitamin E Capsules 30s", slug: "vitamin-e-capsules-30s", image: PLACEHOLDER_IMAGE, price: 249, rating: 4.3, reviewCount: 156, unit: "30 caps", categoryId: "recommended" },
  { id: "69", name: "Folic Acid Tablets 90s", slug: "folic-acid-tablets-90s", image: PLACEHOLDER_IMAGE, price: 199, rating: 4.5, reviewCount: 267, unit: "90 tablets", categoryId: "recommended" },
  { id: "70", name: "CoQ10 Capsules 30s", slug: "coq10-capsules-30s", image: PLACEHOLDER_IMAGE, price: 699, badge: "new", rating: 4.6, reviewCount: 134, unit: "30 caps", categoryId: "recommended" },
  { id: "71", name: "Melatonin 3mg 60s", slug: "melatonin-3mg-60s", image: PLACEHOLDER_IMAGE, price: 449, rating: 4.4, reviewCount: 289, unit: "60 tablets", categoryId: "recommended" },
  { id: "72", name: "Green Tea Extract 60s", slug: "green-tea-extract-60s", image: PLACEHOLDER_IMAGE, price: 399, originalPrice: 449, discountPercent: 11, rating: 4.5, reviewCount: 198, unit: "60 caps", categoryId: "recommended" },
  // Tree categories (for /category/main/sub pages)
  { id: "t1", name: "Face Moisturizer SPF 30", slug: "face-moisturizer-spf-30", image: PLACEHOLDER_IMAGE, price: 599, originalPrice: 699, discountPercent: 14, badge: "sale", rating: 4.7, reviewCount: 234, unit: "50ml", categoryId: "skincare" },
  { id: "t2", name: "Vitamin C Serum", slug: "vitamin-c-serum", image: PLACEHOLDER_IMAGE, price: 899, badge: "new", rating: 4.8, reviewCount: 412, unit: "30ml", categoryId: "skincare" },
  { id: "t3", name: "Cleansing Foam", slug: "cleansing-foam", image: PLACEHOLDER_IMAGE, price: 349, rating: 4.5, reviewCount: 189, unit: "150ml", categoryId: "skincare" },
  { id: "t4", name: "Hair Growth Oil", slug: "hair-growth-oil", image: PLACEHOLDER_IMAGE, price: 449, originalPrice: 499, discountPercent: 10, rating: 4.6, reviewCount: 278, unit: "100ml", categoryId: "hair-care" },
  { id: "t5", name: "Anti-Dandruff Shampoo", slug: "anti-dandruff-shampoo", image: PLACEHOLDER_IMAGE, price: 299, badge: "bestseller", rating: 4.4, reviewCount: 567, unit: "400ml", categoryId: "hair-care" },
  { id: "t6", name: "BP Monitor Digital", slug: "bp-monitor-digital", image: PLACEHOLDER_IMAGE, price: 1999, originalPrice: 2299, discountPercent: 13, rating: 4.6, reviewCount: 312, categoryId: "blood-pressure" },
  { id: "t7", name: "First Aid Kit Travel", slug: "first-aid-kit-travel", image: PLACEHOLDER_IMAGE, price: 499, rating: 4.5, reviewCount: 145, categoryId: "first-aid" },
  { id: "t8", name: "Lipstick Set 6 Shades", slug: "lipstick-set-6", image: PLACEHOLDER_IMAGE, price: 799, badge: "new", rating: 4.7, reviewCount: 198, unit: "6 pcs", categoryId: "makeup" },
  // Beauty – Skincare
  { id: "b1", name: "Retinol Night Cream", slug: "retinol-night-cream", image: PLACEHOLDER_IMAGE, price: 1299, originalPrice: 1499, discountPercent: 13, badge: "sale", rating: 4.8, reviewCount: 456, unit: "50ml", categoryId: "skincare" },
  { id: "b2", name: "Hyaluronic Acid Serum", slug: "hyaluronic-acid-serum", image: PLACEHOLDER_IMAGE, price: 749, badge: "new", rating: 4.7, reviewCount: 289, unit: "30ml", categoryId: "skincare" },
  { id: "b3", name: "Sunscreen SPF 50", slug: "sunscreen-spf-50", image: PLACEHOLDER_IMAGE, price: 499, originalPrice: 599, discountPercent: 17, rating: 4.6, reviewCount: 612, unit: "100ml", categoryId: "skincare" },
  { id: "b4", name: "Clay Face Mask", slug: "clay-face-mask", image: PLACEHOLDER_IMAGE, price: 399, rating: 4.5, reviewCount: 178, unit: "100gm", categoryId: "skincare" },
  { id: "b5", name: "Under Eye Cream", slug: "under-eye-cream", image: PLACEHOLDER_IMAGE, price: 649, badge: "bestseller", rating: 4.6, reviewCount: 334, unit: "15ml", categoryId: "skincare" },
  // Beauty – Hair Care
  { id: "b6", name: "Nourishing Conditioner", slug: "nourishing-conditioner", image: PLACEHOLDER_IMAGE, price: 349, rating: 4.5, reviewCount: 267, unit: "400ml", categoryId: "hair-care" },
  { id: "b7", name: "Hair Serum Argan", slug: "hair-serum-argan", image: PLACEHOLDER_IMAGE, price: 549, originalPrice: 649, discountPercent: 15, badge: "sale", rating: 4.7, reviewCount: 198, unit: "100ml", categoryId: "hair-care" },
  { id: "b8", name: "Scalp Tonic", slug: "scalp-tonic", image: PLACEHOLDER_IMAGE, price: 599, badge: "new", rating: 4.4, reviewCount: 89, unit: "150ml", categoryId: "hair-care" },
  { id: "b9", name: "Styling Gel Strong Hold", slug: "styling-gel-strong-hold", image: PLACEHOLDER_IMAGE, price: 249, rating: 4.3, reviewCount: 412, unit: "200ml", categoryId: "hair-care" },
  // Beauty – Makeup
  { id: "b10", name: "Liquid Foundation", slug: "liquid-foundation", image: PLACEHOLDER_IMAGE, price: 899, rating: 4.7, reviewCount: 523, unit: "30ml", categoryId: "makeup" },
  { id: "b11", name: "Volumizing Mascara", slug: "volumizing-mascara", image: PLACEHOLDER_IMAGE, price: 449, badge: "bestseller", rating: 4.6, reviewCount: 678, unit: "10ml", categoryId: "makeup" },
  { id: "b12", name: "Blush Palette 4 Shades", slug: "blush-palette-4-shades", image: PLACEHOLDER_IMAGE, price: 699, originalPrice: 799, discountPercent: 13, rating: 4.5, reviewCount: 234, unit: "4 pcs", categoryId: "makeup" },
  { id: "b13", name: "Concealer Stick", slug: "concealer-stick", image: PLACEHOLDER_IMAGE, price: 399, rating: 4.6, reviewCount: 345, unit: "6gm", categoryId: "makeup" },
  { id: "b14", name: "Setting Powder Translucent", slug: "setting-powder-translucent", image: PLACEHOLDER_IMAGE, price: 549, badge: "new", rating: 4.5, reviewCount: 167, unit: "15gm", categoryId: "makeup" },
  // Beauty – Fragrance
  { id: "b15", name: "Eau de Parfum Floral", slug: "eau-de-parfum-floral", image: PLACEHOLDER_IMAGE, price: 2499, originalPrice: 2999, discountPercent: 17, badge: "sale", rating: 4.8, reviewCount: 189, unit: "50ml", categoryId: "fragrance" },
  { id: "b16", name: "Body Mist Fresh", slug: "body-mist-fresh", image: PLACEHOLDER_IMAGE, price: 499, rating: 4.5, reviewCount: 312, unit: "200ml", categoryId: "fragrance" },
  { id: "b17", name: "Perfume Roll-On", slug: "perfume-roll-on", image: PLACEHOLDER_IMAGE, price: 349, badge: "new", rating: 4.6, reviewCount: 98, unit: "10ml", categoryId: "fragrance" },
  { id: "b18", name: "Men's Cologne", slug: "mens-cologne", image: PLACEHOLDER_IMAGE, price: 1899, rating: 4.7, reviewCount: 256, unit: "100ml", categoryId: "fragrance" },
  // Beauty – Personal Care
  { id: "b19", name: "Body Lotion Shea Butter", slug: "body-lotion-shea-butter", image: PLACEHOLDER_IMAGE, price: 449, rating: 4.6, reviewCount: 445, unit: "400ml", categoryId: "personal-care" },
  { id: "b20", name: "Deodorant Roll-On", slug: "deodorant-roll-on", image: PLACEHOLDER_IMAGE, price: 199, badge: "bestseller", rating: 4.4, reviewCount: 892, unit: "50ml", categoryId: "personal-care" },
  { id: "b21", name: "Shaving Cream Sensitive", slug: "shaving-cream-sensitive", image: PLACEHOLDER_IMAGE, price: 299, rating: 4.5, reviewCount: 234, unit: "200ml", categoryId: "personal-care" },
  { id: "b22", name: "Hand Cream Vitamin E", slug: "hand-cream-vitamin-e", image: PLACEHOLDER_IMAGE, price: 279, originalPrice: 329, discountPercent: 15, rating: 4.6, reviewCount: 378, unit: "75ml", categoryId: "personal-care" },
]

/** Enrich product details by slug (description, gallery, brand, etc.) */
const DETAILS_BY_SLUG: Record<string, Partial<Product>> = {
  "organic-honey-500gm": {
    description:
      "Pure organic honey sourced from natural beehives. Rich in antioxidants and enzymes. Ideal for daily wellness, cooking, and natural sweetness. No added sugar or preservatives.",
    images: [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE],
    brand: "Nature's Gold",
    brandHref: "/brand/natures-gold",
    inStock: true,
    deliveryText: "12-24 HOURS",
    specification: { "Net weight": "500gm", "Origin": "India", "Shelf life": "24 months" },
  },
  "vitamin-c-tablets-60s": {
    description:
      "High-strength Vitamin C tablets with 1000mg per serving. Supports immunity, skin health, and collagen production. Easy-to-swallow tablets, 60 count.",
    images: [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE],
    brand: "HealthFirst",
    brandHref: "/brand/healthfirst",
    inStock: true,
    deliveryText: "12-24 HOURS",
    specification: { "Form": "Tablet", "Count": "60", "Vitamin C per tablet": "1000mg" },
  },
  "blood-pressure-monitor": {
    description:
      "Digital automatic blood pressure monitor with large display and irregular heartbeat detection. Arm cuff included. Clinically validated for home use.",
    images: [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE],
    brand: "CarePlus",
    brandHref: "/brand/careplus",
    inStock: true,
    deliveryText: "5-7 days",
    specification: { "Type": "Upper arm", "Cuff size": "22-42 cm", "Display": "LCD" },
  },
  "digital-thermometer": {
    description:
      "Fast-reading digital thermometer with fever alarm and memory recall. Waterproof tip. Suitable for oral, underarm, and rectal use.",
    brand: "CarePlus",
    brandHref: "/brand/careplus",
    inStock: true,
    deliveryText: "12-24 HOURS",
    specification: { "Reading time": "10 sec", "Memory": "Last reading", "Battery": "1x CR2032" },
  },
  "multivitamin-capsules-30s": {
    description:
      "Complete multivitamin and mineral formula for daily nutrition. Supports energy, immunity, and bone health. One capsule per day with food.",
    images: [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE],
    brand: "HealthFirst",
    brandHref: "/brand/healthfirst",
    inStock: true,
    deliveryText: "12-24 HOURS",
    specification: { "Form": "Capsule", "Count": "30", "Dose": "1 per day" },
  },
}

export function useProducts(): Product[] {
  // TODO: Replace with fetch('/api/products') when API is ready
  return MOCK_PRODUCTS
}

/** Products for a category page: pass single id (sub) or array of ids (main = all children). */
export function useProductsByCategory(categoryIds: string | string[]): Product[] {
  const products = useProducts()
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds]
  return products.filter((p) => ids.includes(p.categoryId))
}

export function useProductBySlug(slug: string): Product | null {
  const products = useProducts()
  const base = products.find((p) => p.slug === slug)
  if (!base) return null
  const details = DETAILS_BY_SLUG[slug]
  return { ...base, ...details }
}

export function getSimilarProducts(
  product: Product,
  allProducts: Product[],
  limit = 8
): Product[] {
  return allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit)
}

export function getFrequentlyBoughtTogether(
  product: Product,
  allProducts: Product[],
  limit = 6
): Product[] {
  const ids = ["3", "5", "6", "23", "24", "25"].filter((id) => id !== product.id)
  return ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is Product => p != null)
    .slice(0, limit)
}

export function getPreviouslyViewed(
  currentSlug: string,
  allProducts: Product[],
  limit = 6
): Product[] {
  return allProducts.filter((p) => p.slug !== currentSlug).slice(0, limit)
}
