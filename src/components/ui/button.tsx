import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-md hover:bg-primary/90 dark:bg-primary/80 dark:text-white dark:hover:bg-primary/70 dark:shadow-primary/25",
        destructive:
          "bg-destructive text-white shadow-md hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/80 dark:text-white dark:hover:bg-destructive/70",
        outline:
          "border-2 border-white/20 bg-white/5 text-white shadow-sm backdrop-blur-sm hover:bg-white/10 hover:border-white/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/20 transition-colors",
        secondary:
          "bg-white/10 text-white shadow-sm backdrop-blur-sm hover:bg-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 border border-white/10 hover:border-white/20",
        ghost:
          "text-white hover:bg-white/10 dark:text-white dark:hover:bg-white/10",
        link: "text-white underline-offset-4 hover:underline dark:text-white hover:text-white/80",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3 rounded-lg",
        sm: "h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-sm",
        lg: "h-12 rounded-xl px-6 has-[>svg]:px-4 text-base",
        xl: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
