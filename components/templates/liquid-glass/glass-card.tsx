import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Frosted panel for demo websites. All colors come from the .lgx theme
 * variables on the page root, so the same card reads correctly on dark and
 * soft-light sites.
 */
export function GlassCard({
  strong = false,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return (
    <div
      className={cn(
        strong ? "lgx-card-strong" : "lgx-card",
        "rounded-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Small uppercase section label, accent-colored. */
export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="lgx-accent text-xs font-semibold uppercase tracking-[0.22em]">
      {children}
    </p>
  );
}

/** Consistent section header: eyebrow + display heading + optional sub. */
export function SectionHeader({
  eyebrow,
  heading,
  sub,
  align = "left",
}: {
  eyebrow: string;
  heading: string;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h2 className="lgx-display mt-3 text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl">
        {heading}
      </h2>
      {sub && <p className="lgx-muted mt-4 text-[15px] leading-relaxed">{sub}</p>}
    </div>
  );
}
