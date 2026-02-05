"use client"

import {
  Baby,
  ChevronDown,
  ChevronRight,
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
  Zap,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const flashSaleItem = {
  label: "FLASH SALE",
  href: "/flash-sale",
  icon: Zap,
  badge: "1000+",
}

type Subcategory = {
  label: string
  href: string
  icon: LucideIcon
}

type Category = {
  label: string
  href: string
  icon: LucideIcon
  active?: boolean
  subcategories?: Subcategory[]
}

const categories: Category[] = [
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

function CategoryIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted overflow-hidden">
      <Icon className="size-4 text-muted-foreground" />
    </span>
  )
}

const categoryRowClass = cn(
  "h-auto border-b border-sidebar-border rounded-none py-3 px-3",
  "data-[active=true]:bg-muted data-[active=true]:text-primary-dark dark:data-[active=true]:bg-primary-dark/50 dark:data-[active=true]:text-primary-light"
)

export function AppSidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set())
  const [closedSections, setClosedSections] = useState<Set<string>>(() => new Set())

  const toggleSection = useCallback((href: string, open: boolean) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (open) next.add(href)
      else next.delete(href)
      return next
    })
    setClosedSections((prev) => {
      const next = new Set(prev)
      if (open) next.delete(href)
      else next.add(href)
      return next
    })
  }, [])

  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border sticky top-[70px] overflow-y-auto">
      <SidebarHeader className="border-b border-sidebar-border p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-auto py-3 px-3">
              <Link
                href={flashSaleItem.href}
                className="flex w-full items-center gap-2"
              >
                <flashSaleItem.icon className="size-5 shrink-0 text-warning" />
                <span className="font-semibold text-destructive">
                  {flashSaleItem.label}
                </span>
                <SidebarMenuBadge className="relative right-0 ml-auto border border-destructive bg-transparent px-2 py-0.5 text-xs font-medium text-foreground">
                  {flashSaleItem.badge}
                </SidebarMenuBadge>
                <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-0">
          <SidebarGroupContent className="p-0">
            <SidebarMenu>
              {categories.map((item) => {
                const categoryPath = `/category${item.href}`
                const isMainActive = pathname === categoryPath
                const isExpandedByPath =
                  (item.subcategories?.length ?? 0) > 0 &&
                  pathname.startsWith(categoryPath)
                const isOpen =
                  (isExpandedByPath && !closedSections.has(item.href)) ||
                  (!isExpandedByPath && openSections.has(item.href))

                return item.subcategories?.length ? (
                  <SidebarMenuItem key={item.label}>
                    <Collapsible
                      open={isOpen}
                      onOpenChange={(open) => toggleSection(item.href, open)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <div
                          role="button"
                          tabIndex={0}
                          data-active={isMainActive}
                          aria-label={isOpen ? "Collapse" : "Expand"}
                          className={cn(
                            "flex w-full cursor-pointer items-center gap-0 text-left text-sm outline-hidden",
                            categoryRowClass,
                            isMainActive && "text-primary-dark",
                            "transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          )}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              toggleSection(item.href, !isOpen)
                            }
                          }}
                        >
                          <span className="flex flex-1 min-w-0 items-center gap-2">
                            <CategoryIcon icon={item.icon} />
                            <Link
                              href={categoryPath}
                              className="flex flex-1 min-w-0 items-center gap-2 transition-colors 
                          hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                              <span className="truncate font-medium">{item.label}</span>
                            </Link>
                          </span>
                          <span className="flex shrink-0 items-center justify-center">
                            <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180 text-muted-foreground" />
                          </span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l-0 mx-0 px-0 py-0 gap-0">
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isMainActive}
                              className={cn(
                                "h-auto border-b border-sidebar-border rounded-none py-2.5 pl-12 pr-3",
                                isMainActive && "bg-muted"
                              )}
                            >
                              <Link
                                href={categoryPath}
                                className="flex items-center gap-2"
                              >
                                <CategoryIcon icon={item.icon} />
                                <span className="truncate">All {item.label}</span>
                                <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {item.subcategories.map((sub) => {
                            const subPath = `/category${sub.href}`
                            const isSubActive = pathname === subPath
                            return (
                              <SidebarMenuSubItem key={sub.label}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubActive}
                                  className={cn(
                                    "h-auto border-b border-sidebar-border rounded-none py-2.5 pl-12 pr-3",
                                    isMainActive && "bg-muted"
                                  )}
                                >
                                  <Link
                                    href={subPath}
                                    className="flex items-center gap-2"
                                  >
                                    <CategoryIcon icon={sub.icon} />
                                    <span className="truncate">{sub.label}</span>
                                    <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isMainActive}
                      className={categoryRowClass}
                    >
                      <Link href={categoryPath} className="flex items-center gap-2">
                        <CategoryIcon icon={item.icon} />
                        <span className="flex-1 truncate">{item.label}</span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
