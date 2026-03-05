import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary/90 text-white hover:bg-primary/80 shadow-md shadow-primary/15",
        destructive: "bg-red-500/90 text-white hover:bg-red-600/90 shadow-md shadow-red-500/15",
        outline: "border border-primary/70 bg-white text-primary/90 hover:bg-primary/5",
        secondary: "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80",
        ghost: "hover:bg-slate-100/80 text-slate-600",
        link: "text-primary/90 underline-offset-4 hover:underline",
        amber: "bg-amber-50/80 text-amber-600 border border-amber-200/70 hover:bg-amber-100/80",
        success: "bg-emerald-500/90 text-white hover:bg-emerald-600/90",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
