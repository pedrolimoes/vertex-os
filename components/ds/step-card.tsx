import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepCardProps extends React.HTMLAttributes<HTMLElement> {
  step: number;
  title: string;
  hint?: string;
}

/**
 * A numbered section inside a flow — used to break the generator brief
 * into clear stages without turning it into a wizard.
 */
export function StepCard({
  step,
  title,
  hint,
  className,
  children,
  ...props
}: StepCardProps) {
  return (
    <section className={cn("relative pl-10", className)} {...props}>
      <div className="absolute left-0 top-0.5 flex h-6 w-6 items-center justify-center rounded-md border border-hairline bg-white/[0.04] font-mono text-[11px] text-white/50">
        {step}
      </div>
      {/* connector line to the next step */}
      <div className="absolute bottom-[-20px] left-3 top-8 w-px bg-hairline" />
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
        {hint && <span className="text-xs text-white/35">{hint}</span>}
      </header>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}
