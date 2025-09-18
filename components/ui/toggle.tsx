"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2 data-[state=on]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent text-foreground/90 data-[state=off]:hover:bg-white/10 data-[state=off]:hover:text-white",
        outline:
          "border bg-transparent border-white/20 text-neutral-300 data-[state=off]:hover:bg-white/10 data-[state=off]:hover:text-white data-[state=on]:bg-green-500 data-[state=on]:text-black data-[state=on]:border-green-500 data-[state=on]:hover:bg-green-500 data-[state=on]:hover:text-black data-[state=on]:hover:border-green-500",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export {  toggleVariants }
