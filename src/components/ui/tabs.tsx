"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "inline-flex w-fit items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "bg-muted text-muted-foreground h-9 rounded-lg p-[3px]",
        pill: "gap-2 rounded-full",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "h-[calc(100%-1px)] flex-1 text-foreground dark:text-muted-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        pill:
          "rounded-full px-4 py-2 bg-muted/50 text-muted-foreground hover:bg-muted data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:hover:bg-teal-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function TabsTrigger({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }

