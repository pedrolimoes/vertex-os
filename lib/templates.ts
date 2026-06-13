import type { DesignSystemId, IndustryId } from "./types";
import { DESIGN_SYSTEMS } from "./discovery";
import { INDUSTRY_PROFILES } from "./industry-engine";

/* ==========================================================================
   Industry presets for the template gallery. Thin views over the industry
   engine — the engine owns the actual strategy.
   ========================================================================== */

export interface TemplateMeta {
  id: IndustryId;
  name: string;
  /** Lucide icon id — resolved in components/ds/template-card.tsx. */
  icon: string;
  blurb: string;
  defaultServices: string[];
  suggestedStyle: DesignSystemId;
  palette: { primary: string; accent: string };
}

const ICONS: Partial<Record<IndustryId, string>> = {
  "epoxy-flooring": "layers",
  roofing: "home",
  landscaping: "tree-pine",
  "pressure-washing": "droplets",
  cleaning: "sparkles",
  hvac: "wind",
  "auto-detailing": "car",
};

const GALLERY_ORDER: IndustryId[] = [
  "epoxy-flooring",
  "roofing",
  "hvac",
  "landscaping",
  "pressure-washing",
  "cleaning",
  "auto-detailing",
];

export const TEMPLATES: TemplateMeta[] = GALLERY_ORDER.map((id) => {
  const p = INDUSTRY_PROFILES[id as Exclude<IndustryId, "custom">];
  return {
    id,
    name: p.name,
    icon: ICONS[id] ?? "layers",
    blurb: p.positioningAngle,
    defaultServices: p.defaultServices,
    suggestedStyle: p.suggestedSystems[0],
    palette: { primary: p.palette.secondary, accent: p.palette.accent },
  };
});

export function getTemplate(id: IndustryId): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

/** Design systems, exposed under the legacy name for the gallery pages. */
export const SITE_STYLES = DESIGN_SYSTEMS.map((d) => ({
  id: d.id,
  name: d.name,
  blurb: d.blurb,
}));
