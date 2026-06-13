import Link from "next/link";
import {
  ArrowUpRight,
  Car,
  Droplets,
  Home,
  Layers,
  Sparkles,
  TreePine,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { TemplateMeta } from "@/lib/templates";
import { demoPathFor } from "@/lib/demo-sites";
import { cn } from "@/lib/utils";

export const TEMPLATE_ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  home: Home,
  "tree-pine": TreePine,
  droplets: Droplets,
  sparkles: Sparkles,
  wind: Wind,
  car: Car,
};

export function TemplateIcon({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const Icon = TEMPLATE_ICONS[id] ?? Layers;
  return <Icon className={className} aria-hidden />;
}

/**
 * Abstract wireframe thumbnail — a miniature of the template's page
 * structure (nav / hero / cards / footer), tinted with its palette.
 */
function WireframeThumb({ template }: { template: TemplateMeta }) {
  const { primary, accent } = template.palette;
  return (
    <div
      aria-hidden
      className="relative flex aspect-[16/9] flex-col gap-1.5 overflow-hidden rounded-lg border border-hairline bg-black/40 p-3"
    >
      {/* nav */}
      <div className="flex items-center justify-between">
        <div className="h-1.5 w-8 rounded-full bg-white/20" />
        <div className="h-2 w-10 rounded-sm" style={{ backgroundColor: primary }} />
      </div>
      {/* hero */}
      <div className="mt-1.5 space-y-1">
        <div className="h-2.5 w-3/5 rounded-sm bg-white/25" />
        <div className="h-1.5 w-2/5 rounded-sm bg-white/10" />
      </div>
      {/* service cards */}
      <div className="mt-auto grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-7 rounded-sm border border-white/[0.06] bg-white/[0.04]"
            style={i === 0 ? { borderColor: `${accent}55` } : undefined}
          />
        ))}
      </div>
      {/* tint wash */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 80% at 85% -10%, ${primary}1f, transparent 60%)`,
        }}
      />
    </div>
  );
}

export function TemplateCard({
  template,
  href,
  className,
}: {
  template: TemplateMeta;
  href: string;
  className?: string;
}) {
  const demoHref = demoPathFor(template.id);
  return (
    <div
      className={cn(
        "glass reflect group p-3 transition-colors duration-200 hover:border-hairline-strong hover:bg-white/[0.05]",
        className,
      )}
    >
      <Link href={href} className="block cursor-pointer">
        <WireframeThumb template={template} />
      </Link>
      <div className="flex items-center justify-between px-1.5 pb-1 pt-3">
        <Link href={href} className="flex cursor-pointer items-center gap-2.5">
          <TemplateIcon id={template.icon} className="h-4 w-4 text-white/40" />
          <div>
            <div className="font-display text-sm font-semibold text-white">
              {template.name}
            </div>
            <div className="text-xs text-white/40">{template.blurb}</div>
          </div>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Link
            href={href}
            className="cursor-pointer font-mono text-[10px] uppercase tracking-wider text-white/25 transition-colors hover:text-accent"
          >
            use →
          </Link>
          {demoHref && (
            <Link
              href={demoHref}
              target="_blank"
              className="flex cursor-pointer items-center gap-0.5 font-mono text-[10px] uppercase tracking-wider text-white/25 transition-colors hover:text-accent"
            >
              demo <ArrowUpRight className="h-2.5 w-2.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
