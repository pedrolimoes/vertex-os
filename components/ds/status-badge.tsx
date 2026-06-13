import * as React from "react";
import { cn } from "@/lib/utils";

type Status = "ok" | "warn" | "error" | "neutral";

const STYLES: Record<Status, { chip: string; dot: string }> = {
  ok: { chip: "border-accent/25 bg-accent-dim text-accent", dot: "bg-accent" },
  warn: {
    chip: "border-amber-300/25 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-300",
  },
  error: {
    chip: "border-red-400/25 bg-red-500/10 text-red-300",
    dot: "bg-red-400",
  },
  neutral: {
    chip: "border-hairline bg-white/[0.04] text-white/55",
    dot: "bg-white/35",
  },
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: Status;
  /** Hide the status dot for plain tags (e.g. keywords). */
  dot?: boolean;
  /** Animate the dot as a breathing halo — for "live" states. */
  live?: boolean;
}

/** Compact mono-spaced status chip with a state dot. */
export function StatusBadge({
  status = "neutral",
  dot = true,
  live = false,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const s = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] leading-5",
        s.chip,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1 w-1 rounded-full",
            s.dot,
            live && status === "ok" && "animate-pulse-glow",
          )}
        />
      )}
      {children}
    </span>
  );
}
