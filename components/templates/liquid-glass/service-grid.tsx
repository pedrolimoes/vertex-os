import {
  Armchair,
  Box,
  BrickWall,
  Building2,
  Calendar,
  Car,
  CloudLightning,
  Disc3,
  Droplet,
  Droplets,
  Fence,
  FileCheck,
  Flame,
  Flower2,
  Gem,
  Hammer,
  Home,
  KeyRound,
  Layers,
  LayoutGrid,
  Leaf,
  PenLine,
  Repeat,
  Replace,
  Scissors,
  Search,
  Shield,
  Siren,
  Sparkles,
  Square,
  Store,
  Sun,
  Thermometer,
  Umbrella,
  Warehouse,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { DemoSite } from "@/lib/demo-sites";
import { GlassCard, SectionHeader } from "./glass-card";

const ICONS: Record<string, LucideIcon> = {
  armchair: Armchair,
  box: Box,
  bricks: BrickWall,
  building: Building2,
  calendar: Calendar,
  car: Car,
  "cloud-lightning": CloudLightning,
  disc: Disc3,
  droplet: Droplet,
  droplets: Droplets,
  fence: Fence,
  "file-check": FileCheck,
  flame: Flame,
  flower: Flower2,
  gem: Gem,
  grid: LayoutGrid,
  hammer: Hammer,
  home: Home,
  key: KeyRound,
  layers: Layers,
  leaf: Leaf,
  pen: PenLine,
  repeat: Repeat,
  replace: Replace,
  scissors: Scissors,
  search: Search,
  shield: Shield,
  siren: Siren,
  sparkles: Sparkles,
  square: Square,
  store: Store,
  sun: Sun,
  thermometer: Thermometer,
  umbrella: Umbrella,
  warehouse: Warehouse,
  wind: Wind,
  wrench: Wrench,
};

/** Service cards on frosted glass, three across on desktop. */
export function ServiceGrid({ site }: { site: DemoSite }) {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <SectionHeader
        eyebrow="What we do"
        heading={site.services.heading}
        sub={site.services.sub}
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {site.services.items.map((s) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          return (
            <GlassCard
              key={s.name}
              className="group p-6 transition-colors duration-200 hover:[border-color:var(--lgx-glass-border-hover)]"
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-xl"
                style={{
                  background: "var(--lgx-accent-dim)",
                  color: "var(--lgx-accent-text)",
                }}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
              </span>
              <h3 className="lgx-display mt-5 text-[17px] font-semibold tracking-tight">
                {s.name}
              </h3>
              <p className="lgx-muted mt-2 text-[13.5px] leading-relaxed">{s.body}</p>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
