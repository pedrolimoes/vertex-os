"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Compass,
  Crosshair,
  Download,
  Dna,
  FileText,
  Layers,
  Monitor,
  PencilRuler,
  Search,
  Smartphone,
  Target,
} from "lucide-react";
import { PremiumButton } from "@/components/ds/premium-button";
import { GlassPanel } from "@/components/ds/glass-panel";
import { StatusBadge } from "@/components/ds/status-badge";
import { PreviewFrame } from "@/components/ds/preview-frame";
import { SiteCanvas } from "@/components/generator/site-canvas";
import { DESIGN_SYSTEMS, GOALS, getIndustryName } from "@/lib/discovery";
import { getDesignDNA } from "@/lib/design-dna";
import { cn } from "@/lib/utils";
import type { DesignSystemId, SiteProject } from "@/lib/types";

/* ==========================================================================
   Studio Mode — the post-generation environment.
   Left: business strategy. Center: live website canvas. Right: design
   system switcher that re-themes the canvas instantly.
   ========================================================================== */

const ease = [0.22, 1, 0.36, 1] as const;

function PanelHeading({ icon: Icon, children }: { icon: typeof Compass; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-5 pb-3 pt-5">
      <Icon className="h-3.5 w-3.5 text-accent/80" />
      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{children}</h3>
    </div>
  );
}

function StrategyBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline px-5 py-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">{label}</div>
      <div className="mt-1.5 text-[12px] leading-relaxed text-white/65">{children}</div>
    </div>
  );
}

export function StudioMode({
  project,
  onBackToBrief,
}: {
  project: SiteProject;
  onBackToBrief: () => void;
}) {
  const { brief, blueprint, designBrief } = project;
  const result = { blueprint, source: project.source, warning: project.warning };
  const [system, setSystem] = useState<DesignSystemId>(project.system);
  const dna = getDesignDNA(system);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [tab, setTab] = useState<"canvas" | "strategy" | "seo" | "blueprint">("canvas");

  const previewUrl = useMemo(() => {
    const slug = (brief.business.businessName || "yourbusiness")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 24);
    return `${slug || "yourbusiness"}.com`;
  }, [brief.business.businessName]);

  const download = () => {
    const blob = new Blob([JSON.stringify({ brief, designBrief, blueprint }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${previewUrl.replace(".com", "")}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goals = brief.goals
    .map((g) => GOALS.find((x) => x.id === g)?.name)
    .filter(Boolean) as string[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
      className="mx-auto max-w-[1680px]"
    >
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5">
        <div className="flex items-center gap-3">
          <PremiumButton variant="ghost" size="sm" onClick={onBackToBrief}>
            <ArrowLeft className="h-3.5 w-3.5" /> Brief
          </PremiumButton>
          <div>
            <h1 className="font-display text-base font-semibold tracking-tight text-white">
              {brief.business.businessName || "Untitled"}
            </h1>
            <p className="font-mono text-[10px] text-white/30">
              {designBrief.style.toLowerCase()} · {brief.business.city.toLowerCase() || "no city"} ·{" "}
              {blueprint.homepage.length} sections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result.warning && (
            <span className="flex items-center gap-1.5 text-[11px] text-amber-200/80">
              <AlertTriangle className="h-3 w-3" />
              <span className="hidden md:inline">{result.warning}</span>
              <span className="md:hidden">engine mode</span>
            </span>
          )}
          <StatusBadge status={result.source === "engine" ? "warn" : "ok"}>
            {result.source}
          </StatusBadge>
          <PremiumButton variant="glass" size="sm" onClick={download}>
            <Download className="h-3.5 w-3.5" /> Blueprint
          </PremiumButton>
          <PremiumButton size="sm" asChild>
            <Link href={`/studio/editor?site=${project.id}`}>
              <PencilRuler className="h-3.5 w-3.5" /> Edit website
            </Link>
          </PremiumButton>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="mb-4 flex gap-1 rounded-lg border border-hairline bg-black/25 p-1 xl:hidden">
        {(
          [
            ["canvas", "Canvas"],
            ["strategy", "Strategy"],
            ["seo", "SEO"],
            ["blueprint", "Blueprint"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors",
              tab === id ? "bg-white/[0.1] text-white" : "text-white/40",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)_250px]">
        {/* ---- Left: Business strategy ---- */}
        <motion.aside
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className={cn("space-y-4", tab !== "strategy" && "hidden xl:block")}
        >
          <GlassPanel reflect className="overflow-hidden">
            <PanelHeading icon={Dna}>Design brief — Phase 1</PanelHeading>
            <StrategyBlock label="Style">{designBrief.style}</StrategyBlock>
            <StrategyBlock label="Design language">{designBrief.designLanguage}</StrategyBlock>
            <StrategyBlock label="DNA traits">
              <span className="flex flex-wrap gap-1.5 pt-0.5">
                {dna.traits.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-hairline bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </span>
            </StrategyBlock>
            <StrategyBlock label="Layout rules">
              <ul className="space-y-1 pt-0.5">
                {designBrief.layoutRules.slice(0, 4).map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                    {r}
                  </li>
                ))}
              </ul>
            </StrategyBlock>
          </GlassPanel>

          <GlassPanel reflect className="overflow-hidden">
            <PanelHeading icon={Compass}>Business strategy</PanelHeading>
            <StrategyBlock label="Industry">
              {getIndustryName(brief)}
              {brief.business.yearsInBusiness ? ` · ${brief.business.yearsInBusiness}` : ""}
            </StrategyBlock>
            <StrategyBlock label="Market">{blueprint.brand.audience}</StrategyBlock>
            <StrategyBlock label="Positioning">{blueprint.brand.positioning}</StrategyBlock>
            <StrategyBlock label="Voice">{blueprint.brand.voice}</StrategyBlock>
            {goals.length > 0 && (
              <StrategyBlock label="Goals">
                <span className="flex flex-wrap gap-1.5 pt-0.5">
                  {goals.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border border-hairline bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-white/60"
                    >
                      {g}
                    </span>
                  ))}
                </span>
              </StrategyBlock>
            )}
          </GlassPanel>

          <GlassPanel reflect className="overflow-hidden">
            <PanelHeading icon={Target}>Messaging pillars</PanelHeading>
            <div className="space-y-0">
              {blueprint.brand.messagingPillars.map((p, i) => (
                <StrategyBlock key={i} label={`Pillar ${String(i + 1).padStart(2, "0")}`}>
                  {p}
                </StrategyBlock>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel reflect className="overflow-hidden">
            <PanelHeading icon={Crosshair}>CTA strategy</PanelHeading>
            <StrategyBlock label="Primary action">{blueprint.ctaStrategy.primary}</StrategyBlock>
            <StrategyBlock label="Approach">{blueprint.ctaStrategy.strategy}</StrategyBlock>
            <StrategyBlock label="Placements">
              <ul className="space-y-1 pt-0.5">
                {blueprint.ctaStrategy.placements.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                    {p}
                  </li>
                ))}
              </ul>
            </StrategyBlock>
          </GlassPanel>

          <GlassPanel reflect className="overflow-hidden">
            <PanelHeading icon={FileText}>Site structure</PanelHeading>
            <div>
              {blueprint.structure.pages.map((p) => (
                <StrategyBlock key={p.id} label={p.title}>
                  {p.purpose}
                </StrategyBlock>
              ))}
            </div>
          </GlassPanel>
        </motion.aside>

        {/* ---- Center: live canvas ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.05, ease }}
          className={cn(
            "min-w-0",
            tab !== "canvas" && tab !== "seo" && tab !== "blueprint" && "hidden xl:block",
          )}
        >
          {/* Compact design-system switcher for small screens */}
          {tab === "canvas" && (
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 xl:hidden">
              {DESIGN_SYSTEMS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSystem(d.id)}
                  className={cn(
                    "flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                    system === d.id
                      ? "border-accent/50 bg-accent-dim text-white"
                      : "border-hairline text-white/45",
                  )}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-white/15"
                    style={{ backgroundColor: d.swatch.bg }}
                  />
                  {d.name}
                </button>
              ))}
            </div>
          )}

          {(tab === "canvas" || tab === "strategy") && (
            <PreviewFrame
              url={previewUrl}
              className="light-sweep"
              actions={
                <div className="flex items-center rounded-md border border-hairline bg-white/[0.03] p-0.5">
                  <button
                    onClick={() => setViewport("desktop")}
                    aria-label="Desktop viewport"
                    className={cn(
                      "cursor-pointer rounded p-1 transition-colors duration-150",
                      viewport === "desktop" ? "bg-white/[0.1] text-white" : "text-white/30 hover:text-white/60",
                    )}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setViewport("mobile")}
                    aria-label="Mobile viewport"
                    className={cn(
                      "cursor-pointer rounded p-1 transition-colors duration-150",
                      viewport === "mobile" ? "bg-white/[0.1] text-white" : "text-white/30 hover:text-white/60",
                    )}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                  </button>
                </div>
              }
              contentClassName={viewport === "mobile" ? "max-w-[390px]" : "max-w-none"}
            >
              <SiteCanvas blueprint={blueprint} brief={brief} system={system} contact={project.contact} />
            </PreviewFrame>
          )}

          {tab === "seo" && (
            <GlassPanel className="space-y-6 p-6 xl:hidden">
              <SeoPanel result={result} previewUrl={previewUrl} />
            </GlassPanel>
          )}
          {tab === "blueprint" && (
            <GlassPanel className="max-h-[70vh] overflow-auto p-6 xl:hidden">
              <pre className="font-mono text-xs leading-relaxed text-white/55">
                {JSON.stringify(blueprint, null, 2)}
              </pre>
            </GlassPanel>
          )}

          {/* SEO strategy under the canvas on desktop */}
          <div className="mt-4 hidden xl:block">
            <GlassPanel reflect className="overflow-hidden">
              <PanelHeading icon={Search}>SEO strategy</PanelHeading>
              <div className="grid lg:grid-cols-2">
                <div className="px-5 pb-5">
                  <div className="glass-inset p-4">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-white/35">
                      <Search className="h-3 w-3" />
                      {previewUrl}
                    </div>
                    <div className="mt-1.5 text-[15px] text-[#9bc0f0]">{blueprint.seo.title}</div>
                    <p className="mt-1 text-[12px] leading-relaxed text-white/50">
                      {blueprint.seo.description}
                    </p>
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-white/40">
                    {blueprint.seo.strategy}
                  </p>
                </div>
                <div className="border-t border-hairline px-5 pb-5 pt-4 lg:border-l lg:border-t-0">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Local pages
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {blueprint.seo.localPages.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[12px] text-white/60">
                        <span className="h-1 w-1 rounded-full bg-accent/60" /> {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {blueprint.seo.keywords.map((k) => (
                      <StatusBadge key={k} dot={false}>
                        {k}
                      </StatusBadge>
                    ))}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </motion.div>

        {/* ---- Right: design system switcher ---- */}
        <motion.aside
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className={cn("space-y-4", "hidden xl:block")}
        >
          <GlassPanel reflect className="overflow-hidden">
            <PanelHeading icon={Layers}>Design system</PanelHeading>
            <div className="space-y-1 px-3 pb-3">
              {DESIGN_SYSTEMS.map((d) => {
                const active = system === d.id;
                const chosen = brief.designSystems.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => setSystem(d.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all duration-150",
                      active
                        ? "border-accent/40 bg-accent-dim"
                        : "border-transparent hover:border-hairline hover:bg-white/[0.03]",
                    )}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 text-[8px] font-bold"
                      style={{ backgroundColor: d.swatch.bg, color: d.swatch.fg }}
                    >
                      Aa
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-[12px] font-medium", active ? "text-white" : "text-white/65")}>
                        {d.name}
                      </span>
                      <span className="block truncate text-[10px] text-white/30">{d.blurb}</span>
                    </span>
                    {chosen && !active && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" title="In your brief" />
                    )}
                  </button>
                );
              })}
            </div>
          </GlassPanel>

          <GlassPanel reflect className="overflow-hidden">
            <PanelHeading icon={Layers}>Design direction</PanelHeading>
            <StrategyBlock label="Direction">{blueprint.design.direction}</StrategyBlock>
            <StrategyBlock label="Typography">{blueprint.design.typography}</StrategyBlock>
            <StrategyBlock label="Palette">
              <span className="flex items-center gap-2 pt-1">
                {(
                  [
                    blueprint.design.palette.primary,
                    blueprint.design.palette.secondary,
                    blueprint.design.palette.accent,
                    blueprint.design.palette.background,
                  ] as string[]
                ).map((c, i) => (
                  <span key={i} className="flex flex-col items-center gap-1">
                    <span
                      className="h-7 w-7 rounded-full border border-white/15"
                      style={{ backgroundColor: c }}
                    />
                    <span className="font-mono text-[8px] text-white/30">{c}</span>
                  </span>
                ))}
              </span>
            </StrategyBlock>
            <StrategyBlock label="Motion">{blueprint.design.motion}</StrategyBlock>
            <StrategyBlock label="Imagery">{blueprint.design.imagery}</StrategyBlock>
          </GlassPanel>

          <GlassPanel reflect className="overflow-hidden">
            <PanelHeading icon={Target}>Trust elements</PanelHeading>
            <div className="px-5 pb-5">
              <ul className="space-y-2">
                {blueprint.trust.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[12px] text-white/60">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </GlassPanel>
        </motion.aside>
      </div>
    </motion.div>
  );
}

function SeoPanel({
  result,
  previewUrl,
}: {
  result: { blueprint: SiteProject["blueprint"] };
  previewUrl: string;
}) {
  const seo = result.blueprint.seo;
  return (
    <>
      <div className="glass-inset p-4">
        <div className="flex items-center gap-2 font-mono text-[10px] text-white/35">
          <Search className="h-3 w-3" />
          {previewUrl}
        </div>
        <div className="mt-1.5 text-[15px] text-[#9bc0f0]">{seo.title}</div>
        <p className="mt-1 text-[12px] leading-relaxed text-white/50">{seo.description}</p>
      </div>
      <p className="text-[12px] leading-relaxed text-white/45">{seo.strategy}</p>
      <div className="flex flex-wrap gap-1.5">
        {seo.keywords.map((k) => (
          <StatusBadge key={k} dot={false}>
            {k}
          </StatusBadge>
        ))}
      </div>
    </>
  );
}
