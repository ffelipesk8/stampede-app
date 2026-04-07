import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-display font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:   "bg-red hover:bg-red/90 text-white shadow-lg shadow-red/20",
        secondary: "bg-card1 border border-border text-t2 hover:text-t1 hover:border-t3",
        ghost:     "text-t2 hover:text-t1 hover:bg-card1",
        fire:      "bg-fire-gradient text-white font-bold shadow-lg",
        gold:      "bg-gold hover:bg-gold/90 text-bg font-bold",
      },
      size: {
        sm:  "h-8 px-3 text-xs",
        md:  "h-10 px-4 text-sm",
        lg:  "h-12 px-6 text-base",
        xl:  "h-14 px-8 text-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";
