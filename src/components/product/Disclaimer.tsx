"use client"

import {
  Collapsible,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"

const DEFAULT_TEXT =
  "Product information, pricing, and availability are subject to change. Images are for illustration purposes; actual product may vary. Please read the product label before use."

export interface DisclaimerProps {
  title?: string
  text?: string
  className?: string
}

export function Disclaimer({
  title = "Disclaimer",
  text = DEFAULT_TEXT,
  className,
}: DisclaimerProps) {
  const [open, setOpen] = useState(false)
  const isLong = text.length > 120
  const shortText = isLong ? `${text.slice(0, 120).trim()}...` : text

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn("rounded-xl border bg-card p-4", className)}
    >
      <div className="flex gap-3">
        <AlertTriangle
          className="size-5 shrink-0 text-destructive"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <div className="mt-1 text-sm text-muted-foreground">
            {isLong ? (
              <>
                {open ? text : shortText}
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="ml-1 font-medium text-primary hover:underline"
                  >
                    {open ? "Show less" : "Show more"}
                  </button>
                </CollapsibleTrigger>
              </>
            ) : (
              text
            )}
          </div>
        </div>
      </div>
    </Collapsible>
  )
}
