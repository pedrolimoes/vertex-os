import * as React from "react";
import { cn } from "@/lib/utils";

type Elevation = "base" | "raised" | "float" | "inset";

const ELEVATION: Record<Elevation, string> = {
  base: "glass",
  raised: "glass-raised",
  float: "glass-float",
  inset: "glass-inset",
};

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  /** Adds a faint diagonal specular reflection across the surface. */
  reflect?: boolean;
  /** Premium hover lift + accent rim — for clickable cards. */
  interactive?: boolean;
}

/**
 * The core surface of the studio. Four elevations:
 * `base` for page sections, `raised` for focal panels and popovers,
 * `float` for suspended hero surfaces, `inset` for code/terminal wells.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ elevation = "base", reflect = false, interactive = false, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        ELEVATION[elevation],
        reflect && "reflect",
        interactive && "glass-interactive",
        className,
      )}
      {...props}
    />
  ),
);
GlassPanel.displayName = "GlassPanel";
