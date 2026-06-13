import { Lock, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Browser-chrome frame that embeds a live demo website via iframe.
 * Used in the studio (templates index, landing) to show the real rendered
 * site — not a screenshot, not a mockup.
 */
export function DemoWebsiteFrame({
  href,
  url,
  title,
  height = 480,
  className,
}: {
  /** Route of the live demo, e.g. /templates/liquid-glass/roofing */
  href: string;
  /** Display URL for the chrome bar, e.g. caldwellroofing.com */
  url: string;
  title: string;
  height?: number;
  className?: string;
}) {
  return (
    <div className={cn("glass-raised reflect overflow-hidden rounded-2xl", className)}>
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
        <Link
          href={href}
          target="_blank"
          className="flex shrink-0 cursor-pointer items-center gap-1 font-mono text-[11px] text-white/35 transition-colors hover:text-white/80"
        >
          open <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
      <iframe
        src={href}
        title={title}
        loading="lazy"
        style={{ height }}
        className="block w-full border-0 bg-black/40"
      />
    </div>
  );
}
