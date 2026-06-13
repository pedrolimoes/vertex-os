import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn relative inline-flex cursor-pointer items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-md text-[13px] font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:shadow-focus-ring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:transition-transform",
  {
    variants: {
      variant: {
        // White-on-dark primary — the Vercel/Linear move. Text must be the
        // explicit `ink` color: `text-base` is a font-size utility and would
        // leave the inherited white text invisible on the white background.
        // A faint top-down gradient gives the cap a polished, lit read.
        primary:
          "bg-gradient-to-b from-white to-white/90 text-ink font-semibold shadow-btn hover:to-white hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_2px_8px_-1px_rgba(0,0,0,0.55),0_0_24px_-6px_rgba(255,255,255,0.4)]",
        // Aqua accent — for "live" / primary-spatial calls to action.
        accent:
          "bg-accent text-ink font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_8px_24px_-10px_rgba(110,231,210,0.6)] hover:shadow-glow-accent hover:brightness-110",
        glass:
          "border border-hairline-strong bg-white/[0.07] text-white shadow-glass backdrop-blur-xl hover:border-white/25 hover:bg-white/[0.11]",
        ghost: "text-white/55 hover:bg-white/[0.06] hover:text-white",
        outline:
          "border border-hairline bg-transparent text-white/75 hover:border-hairline-strong hover:text-white",
        danger:
          "border border-red-400/20 bg-red-500/10 text-red-300 hover:bg-red-500/20",
      },
      size: {
        default: "h-8 px-3.5",
        sm: "h-7 px-2.5 text-xs",
        lg: "h-9 px-4 text-sm [&_svg]:size-4",
        icon: "h-7 w-7",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
PremiumButton.displayName = "PremiumButton";

export { buttonVariants };
