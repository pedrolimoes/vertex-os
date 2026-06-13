import * as React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PreviewFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
  /** Toolbar controls rendered on the right side of the chrome bar. */
  actions?: React.ReactNode;
  /** Constrain content width, e.g. for mobile viewport. */
  contentClassName?: string;
}

/**
 * A design-tool artboard: browser chrome on top, content on a dotted
 * canvas below. The generated site renders inside as a real document.
 */
export function PreviewFrame({
  url,
  actions,
  className,
  contentClassName,
  children,
  ...props
}: PreviewFrameProps) {
  return (
    <div
      className={cn(
        "glass-raised reflect overflow-hidden rounded-2xl",
        className,
      )}
      {...props}
    >
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-hairline bg-black/30 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex h-6 flex-1 items-center justify-center gap-1.5 rounded-md border border-hairline bg-white/[0.03] px-3 font-mono text-[11px] text-white/40">
          <Lock className="h-3 w-3 text-white/25" />
          {url}
        </div>
        {actions && <div className="flex items-center gap-1.5">{actions}</div>}
      </div>
      {/* Canvas */}
      <div className="canvas-grid bg-black/40 p-3 sm:p-5">
        <div
          className={cn(
            "mx-auto max-h-[68vh] overflow-y-auto rounded-lg border border-hairline-strong shadow-glass-lg transition-[max-width] duration-300",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
