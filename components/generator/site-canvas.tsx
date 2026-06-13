"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import type {
  BlueprintSection,
  ContactInfo,
  DesignSystemId,
  DiscoveryBrief,
  SiteBlueprint,
} from "@/lib/types";
import { getIndustryName } from "@/lib/discovery";
import { getDesignDNA } from "@/lib/design-dna";
import { cn, readableAccentOn, readableTextOn } from "@/lib/utils";

/* ==========================================================================
   Site canvas — renders a SiteBlueprint in any of the 15 design systems.

   Design DNA drives STRUCTURE here, not just color: hero layout, nav
   style, and spacing density come from the DNA profile, so switching
   systems genuinely re-architects the page. In editor mode every section
   becomes selectable and the canvas reports clicks back to the editor.
   ========================================================================== */

/* ---------- Editor bridge ---------- */

export interface EditorBridge {
  editable: boolean;
  selectedSection: number | null;
  onSelectSection: (index: number) => void;
  /** "idb:<id>" → object URL map for uploaded images. */
  images: Record<string, string>;
}

const EditorCtx = createContext<EditorBridge | null>(null);

function resolveImage(ref: string | undefined, bridge: EditorBridge | null): string | null {
  if (!ref) return null;
  if (ref.startsWith("idb:")) return bridge?.images[ref] ?? null;
  return ref; // data URLs / absolute URLs pass through
}

/* ---------- Theme ---------- */

interface CanvasTheme {
  /** Hex of the page background — used for contrast-safe brand text. */
  pageBg: string;
  page: string;
  heading: string;
  body: string;
  panel: string;
  /** Shape-only button classes; bg + text color are computed per-render. */
  button: string;
  buttonGhost: string;
  chip: string;
  muted: string;
  eyebrow: string;
  /** false → CTA uses the theme's fixed brand instead of user color. */
  usesBrandBg: boolean;
  fixedBrand?: string;
  /** Hero ambience style. */
  heroGlow: "ambient" | "spotlight" | "none" | "gradient";
}

const THEMES: Record<DesignSystemId, CanvasTheme> = {
  "liquid-glass": {
    pageBg: "#0b0e17",
    page: "bg-[#0b0e17] text-white",
    heading: "font-display font-semibold tracking-tight",
    body: "",
    panel: "rounded-2xl border border-white/12 bg-white/[0.06] backdrop-blur-xl",
    button: "rounded-full font-semibold",
    buttonGhost: "rounded-full border border-white/25 bg-white/[0.07] text-white",
    chip: "rounded-full border border-white/15 bg-white/[0.06] text-white/80",
    muted: "text-white/55",
    eyebrow: "text-[10px] uppercase tracking-[0.2em]",
    usesBrandBg: true,
    heroGlow: "ambient",
  },
  "vision-pro": {
    pageBg: "#101014",
    page: "bg-[#101014] text-[#f5f5f7]",
    heading: "font-display font-semibold tracking-tight",
    body: "",
    panel:
      "rounded-[28px] border border-white/[0.14] bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl",
    button: "rounded-full font-semibold",
    buttonGhost:
      "rounded-full border border-white/20 bg-white/[0.1] text-white backdrop-blur-xl",
    chip: "rounded-full border border-white/12 bg-white/[0.08] text-white/75",
    muted: "text-white/50",
    eyebrow: "text-[10px] uppercase tracking-[0.24em]",
    usesBrandBg: false,
    fixedBrand: "#e8e8ed",
    heroGlow: "spotlight",
  },
  linear: {
    pageBg: "#08090a",
    page: "bg-[#08090a] text-[#f7f8f8]",
    heading: "font-display font-medium tracking-[-0.02em]",
    body: "",
    panel: "rounded-xl border border-white/[0.08] bg-white/[0.025]",
    button: "rounded-lg font-medium",
    buttonGhost: "rounded-lg border border-white/15 text-white/85",
    chip: "rounded-md border border-white/[0.08] bg-white/[0.03] text-white/65",
    muted: "text-[#8a8f98]",
    eyebrow: "text-[10px] uppercase tracking-[0.16em]",
    usesBrandBg: false,
    fixedBrand: "#5e6ad2",
    heroGlow: "ambient",
  },
  raycast: {
    pageBg: "#0a0a0a",
    page: "bg-[#0a0a0a] text-white",
    heading: "font-display font-bold tracking-tight",
    body: "",
    panel:
      "rounded-xl border border-white/[0.09] bg-[#141414] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_16px_40px_-16px_rgba(0,0,0,0.9)]",
    button: "rounded-lg font-bold",
    buttonGhost: "rounded-lg border border-white/15 bg-white/[0.05] text-white",
    chip: "rounded-md bg-white/[0.07] font-mono text-white/70",
    muted: "text-white/45",
    eyebrow: "font-mono text-[10px] uppercase tracking-[0.18em]",
    usesBrandBg: true,
    heroGlow: "gradient",
  },
  "arc-browser": {
    pageBg: "#1c1730",
    page: "bg-[#1c1730] text-white",
    heading: "font-display font-bold tracking-tight",
    body: "",
    panel: "rounded-3xl border border-white/[0.1] bg-white/[0.07] backdrop-blur-lg",
    button: "rounded-2xl font-bold",
    buttonGhost: "rounded-2xl border border-white/25 bg-white/[0.08] text-white",
    chip: "rounded-full bg-white/[0.1] text-white/85",
    muted: "text-white/55",
    eyebrow: "text-[10px] font-bold uppercase tracking-[0.18em]",
    usesBrandBg: true,
    heroGlow: "gradient",
  },
  vercel: {
    pageBg: "#000000",
    page: "bg-black text-white",
    heading: "font-display font-bold tracking-[-0.03em]",
    body: "",
    panel: "rounded-lg border border-white/[0.12] bg-black",
    button: "rounded-md font-semibold",
    buttonGhost: "rounded-md border border-white/25 text-white",
    chip: "rounded-full border border-white/15 text-white/70",
    muted: "text-white/50",
    eyebrow: "font-mono text-[10px] uppercase tracking-[0.14em]",
    usesBrandBg: false,
    fixedBrand: "#ffffff",
    heroGlow: "none",
  },
  framer: {
    pageBg: "#05050a",
    page: "bg-[#05050a] text-white",
    heading: "font-display font-bold tracking-[-0.03em]",
    body: "",
    panel: "rounded-2xl border border-white/[0.07] bg-[#0d0d14]",
    button: "rounded-xl font-bold",
    buttonGhost: "rounded-xl border border-white/20 text-white",
    chip: "rounded-full bg-white/[0.07] text-white/75",
    muted: "text-white/50",
    eyebrow: "text-[10px] uppercase tracking-[0.2em]",
    usesBrandBg: true,
    heroGlow: "gradient",
  },
  notion: {
    pageBg: "#ffffff",
    page: "bg-white text-[#191919]",
    heading: "font-display font-bold tracking-tight",
    body: "",
    panel: "rounded-lg border border-black/[0.09] bg-[#f7f6f3]",
    button: "rounded-md font-semibold",
    buttonGhost: "rounded-md border border-black/15 text-[#191919]",
    chip: "rounded-md bg-black/[0.05] text-black/60",
    muted: "text-black/55",
    eyebrow: "text-[10px] uppercase tracking-[0.14em]",
    usesBrandBg: true,
    heroGlow: "none",
  },
  "luxury-black": {
    pageBg: "#0d0c0a",
    page: "bg-[#0d0c0a] text-[#f2ede4]",
    heading: "font-editorial font-light tracking-wide",
    body: "",
    panel: "rounded-none border border-[#c9a96a]/25 bg-[#15130f]",
    button: "rounded-none font-semibold uppercase tracking-[0.18em]",
    buttonGhost:
      "rounded-none border border-[#c9a96a]/50 uppercase tracking-[0.18em] text-[#d9bd85]",
    chip: "rounded-none border border-[#c9a96a]/30 text-[#d9bd85]",
    muted: "text-[#f2ede4]/50",
    eyebrow: "text-[10px] uppercase tracking-[0.3em] text-[#c9a96a]",
    usesBrandBg: false,
    fixedBrand: "#c9a96a",
    heroGlow: "spotlight",
  },
  "contractor-pro": {
    pageBg: "#101418",
    page: "bg-[#101418] text-white",
    heading: "font-display font-extrabold uppercase tracking-tight",
    body: "",
    panel: "rounded-lg border-2 border-white/10 bg-[#181f26]",
    button: "rounded-lg font-extrabold uppercase",
    buttonGhost: "rounded-lg border-2 border-white/30 font-bold uppercase text-white",
    chip: "rounded-md bg-white/[0.08] font-bold uppercase text-white/85",
    muted: "text-white/60",
    eyebrow: "text-[10px] font-extrabold uppercase tracking-[0.18em]",
    usesBrandBg: true,
    heroGlow: "gradient",
  },
  "minimal-editorial": {
    pageBg: "#faf9f6",
    page: "bg-[#faf9f6] text-[#1a1a1a]",
    heading: "font-editorial font-light tracking-tight",
    body: "",
    panel: "rounded-none border-t border-black/15 bg-transparent",
    button: "rounded-none font-medium tracking-wide",
    buttonGhost: "rounded-none border-b border-black/60 text-[#1a1a1a]",
    chip: "rounded-none border border-black/15 text-black/60",
    muted: "text-black/55",
    eyebrow: "text-[10px] uppercase tracking-[0.3em] text-black/40",
    usesBrandBg: false,
    fixedBrand: "#1a1a1a",
    heroGlow: "none",
  },
  "startup-modern": {
    pageBg: "#fcfcfd",
    page: "bg-[#fcfcfd] text-[#111827]",
    heading: "font-display font-bold tracking-tight",
    body: "",
    panel:
      "rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]",
    button: "rounded-xl font-semibold",
    buttonGhost: "rounded-xl border border-black/15 text-[#111827]",
    chip: "rounded-full bg-black/[0.04] text-black/60",
    muted: "text-black/55",
    eyebrow: "text-[10px] font-bold uppercase tracking-[0.14em]",
    usesBrandBg: true,
    heroGlow: "none",
  },
  "premium-local": {
    pageBg: "#f8f6f2",
    page: "bg-[#f8f6f2] text-[#23201a]",
    heading: "font-display font-bold tracking-tight",
    body: "",
    panel: "rounded-xl border border-[#23201a]/[0.1] bg-white",
    button: "rounded-lg font-bold",
    buttonGhost: "rounded-lg border border-[#23201a]/25 text-[#23201a]",
    chip: "rounded-full border border-[#23201a]/15 bg-[#23201a]/[0.04] text-[#23201a]/70",
    muted: "text-[#23201a]/55",
    eyebrow: "text-[10px] font-bold uppercase tracking-[0.16em]",
    usesBrandBg: true,
    heroGlow: "none",
  },
  "high-end-agency": {
    pageBg: "#111111",
    page: "bg-[#111111] text-[#eeeeea]",
    heading: "font-display font-bold uppercase tracking-[-0.02em]",
    body: "",
    panel: "rounded-none border-t border-white/15 bg-transparent",
    button: "rounded-full font-semibold",
    buttonGhost: "rounded-full border border-white/30 text-white",
    chip: "rounded-none border-b border-white/20 text-white/60",
    eyebrow: "font-mono text-[10px] uppercase tracking-[0.24em] text-white/35",
    muted: "text-white/45",
    usesBrandBg: false,
    fixedBrand: "#eeeeea",
    heroGlow: "none",
  },
  "modern-industrial": {
    pageBg: "#141517",
    page: "bg-[#141517] text-[#e8e9eb]",
    heading: "font-display font-extrabold tracking-tight",
    body: "",
    panel: "rounded-sm border border-white/[0.1] bg-[#1a1c1f]",
    button: "rounded-sm font-extrabold uppercase tracking-wide",
    buttonGhost: "rounded-sm border border-white/25 uppercase tracking-wide text-white",
    chip: "rounded-sm border border-white/12 font-mono text-white/65",
    muted: "text-white/50",
    eyebrow: "font-mono text-[10px] uppercase tracking-[0.2em]",
    usesBrandBg: true,
    heroGlow: "gradient",
  },
};

export function getCanvasTheme(id: DesignSystemId): CanvasTheme {
  return THEMES[id] ?? THEMES["liquid-glass"];
}

/* ---------- shared building blocks ---------- */

interface Ctx {
  theme: CanvasTheme;
  brand: string;
  brandInk: string;
  brandText: string;
  brief: DiscoveryBrief;
  /** DNA-driven section padding. */
  pad: string;
  bridge: EditorBridge | null;
}

function Eyebrow({ ctx, children }: { ctx: Ctx; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className={cn("mb-3", ctx.theme.eyebrow)} style={{ color: ctx.brandText }}>
      {children}
    </div>
  );
}

function PrimaryBtn({ ctx, children, big }: { ctx: Ctx; children: React.ReactNode; big?: boolean }) {
  return (
    <span
      className={cn(
        "inline-block",
        big ? "px-6 py-3 text-xs" : "px-5 py-2.5 text-xs",
        ctx.theme.button,
      )}
      style={{ backgroundColor: ctx.brand, color: ctx.brandInk }}
    >
      {children}
    </span>
  );
}

function SectionImage({
  refId,
  ctx,
  className,
  fallback,
  label,
}: {
  refId?: string;
  ctx: Ctx;
  className?: string;
  fallback?: React.CSSProperties;
  label?: string;
}) {
  const url = resolveImage(refId, ctx.bridge);
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={label ?? ""} className={cn("h-full w-full object-cover", className)} />;
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center text-[9px] uppercase tracking-widest opacity-50",
        className,
      )}
      style={fallback}
    >
      {label ?? "photo"}
    </div>
  );
}

/* ---------- hero variants (DNA: heroLayout) ---------- */

function heroGlowStyle(ctx: Ctx): React.CSSProperties | undefined {
  const { theme, brand } = ctx;
  const glow =
    theme.heroGlow === "ambient"
      ? `radial-gradient(ellipse 75% 60% at 50% -10%, ${brand}26, transparent)`
      : theme.heroGlow === "spotlight"
        ? `radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,255,255,0.09), transparent 70%)`
        : theme.heroGlow === "gradient"
          ? `linear-gradient(165deg, ${brand}21, transparent 55%)`
          : undefined;
  return glow ? { background: glow } : undefined;
}

function HeroSection({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const layout = getDesignDNA(ctxSystem(ctx)).heroLayout;
  const { theme } = ctx;

  if (layout === "split") {
    return (
      <section className={cn("relative grid items-center gap-8 px-7 py-14 @[560px]:grid-cols-[1.1fr_1fr]")} style={heroGlowStyle(ctx)}>
        <div>
          {s.eyebrow && (
            <div className={cn("mb-4 inline-block px-3.5 py-1.5 text-[10px]", theme.chip)}>{s.eyebrow}</div>
          )}
          <h1 className={cn("max-w-xl text-3xl leading-[1.06] @[440px]:text-[38px]", theme.heading)}>{s.title}</h1>
          <p className={cn("mt-4 max-w-md text-sm leading-relaxed", theme.muted)}>{s.body}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {s.cta && <PrimaryBtn ctx={ctx}>{s.cta.label}</PrimaryBtn>}
            {s.cta?.secondary && (
              <span className={cn("px-5 py-2.5 text-xs", theme.buttonGhost)}>{s.cta.secondary}</span>
            )}
          </div>
        </div>
        <div className={cn("overflow-hidden", theme.panel)}>
          <div className="aspect-[4/3]">
            <SectionImage
              refId={s.image}
              ctx={ctx}
              label="hero photo"
              fallback={{
                background: `linear-gradient(135deg, ${ctx.brand}40, ${ctx.brand}10 60%, transparent)`,
              }}
            />
          </div>
        </div>
      </section>
    );
  }

  if (layout === "editorial-left") {
    return (
      <section className="relative px-7 pb-12 pt-16">
        {s.eyebrow && <div className={cn("mb-6", theme.eyebrow)}>{s.eyebrow}</div>}
        <h1 className={cn("max-w-3xl text-4xl leading-[1.05] @[440px]:text-5xl", theme.heading)}>{s.title}</h1>
        <div className="mt-8 grid gap-6 border-t border-current/15 pt-6 @[560px]:grid-cols-[2fr_1fr]">
          <p className={cn("max-w-xl text-[15px] leading-relaxed", theme.muted)}>{s.body}</p>
          <div className="flex flex-col items-start gap-3">
            {s.cta && <PrimaryBtn ctx={ctx}>{s.cta.label}</PrimaryBtn>}
            {s.cta?.secondary && (
              <span className={cn("px-0 py-1 text-xs underline underline-offset-4", theme.muted)}>
                {s.cta.secondary}
              </span>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "oversized") {
    return (
      <section className="relative px-7 pb-14 pt-20" style={heroGlowStyle(ctx)}>
        {s.eyebrow && <div className={cn("mb-8", theme.eyebrow)}>{s.eyebrow}</div>}
        <h1 className={cn("max-w-5xl text-[44px] leading-[0.98] @[440px]:text-[64px]", theme.heading)}>
          {s.title}
        </h1>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <p className={cn("max-w-sm text-sm leading-relaxed", theme.muted)}>{s.body}</p>
          <div className="flex items-center gap-3">
            {s.cta && (
              <PrimaryBtn ctx={ctx} big>
                {s.cta.label}
              </PrimaryBtn>
            )}
            {s.cta?.secondary && (
              <span className={cn("px-5 py-3 text-xs", theme.buttonGhost)}>{s.cta.secondary}</span>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (layout === "showroom") {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <SectionImage
            refId={s.image}
            ctx={ctx}
            label=""
            fallback={{
              background: `radial-gradient(ellipse 80% 70% at 70% 20%, ${ctx.brand}33, transparent 65%), linear-gradient(180deg, transparent, rgba(0,0,0,0.55))`,
            }}
          />
        </div>
        <div className="relative flex min-h-[420px] flex-col justify-end px-7 pb-12 pt-24">
          {s.eyebrow && <div className={cn("mb-4", theme.eyebrow)}>{s.eyebrow}</div>}
          <h1 className={cn("max-w-2xl text-4xl leading-[1.02] @[440px]:text-5xl", theme.heading)}>{s.title}</h1>
          <p className={cn("mt-4 max-w-md text-sm leading-relaxed", theme.muted)}>{s.body}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {s.cta && <PrimaryBtn ctx={ctx}>{s.cta.label}</PrimaryBtn>}
            {s.cta?.secondary && (
              <span className={cn("px-5 py-2.5 text-xs", theme.buttonGhost)}>{s.cta.secondary}</span>
            )}
          </div>
        </div>
      </section>
    );
  }

  // centered (default)
  return (
    <section className="relative px-7 py-16 text-center" style={heroGlowStyle(ctx)}>
      {s.eyebrow && (
        <div className={cn("mx-auto mb-5 inline-block px-3.5 py-1.5 text-[10px]", theme.chip)}>
          {s.eyebrow}
        </div>
      )}
      <h1 className={cn("mx-auto max-w-2xl text-3xl leading-[1.08] @[440px]:text-[40px]", theme.heading)}>
        {s.title}
      </h1>
      <p className={cn("mx-auto mt-5 max-w-lg text-sm leading-relaxed", theme.muted)}>{s.body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {s.cta && <PrimaryBtn ctx={ctx}>{s.cta.label}</PrimaryBtn>}
        {s.cta?.secondary && (
          <span className={cn("px-5 py-2.5 text-xs", theme.buttonGhost)}>{s.cta.secondary}</span>
        )}
      </div>
    </section>
  );
}

/* ---------- other section renderers ---------- */

function EmergencyBanner({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  return (
    <section className="px-7 pb-2 pt-2">
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 px-5 py-3.5",
          ctx.theme.panel,
        )}
        style={{ borderColor: `${ctx.brand}55`, background: `${ctx.brand}14` }}
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ backgroundColor: ctx.brandText }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: ctx.brandText }}
            />
          </span>
          <div>
            <span className="text-xs font-bold">{s.title}</span>
            <span className={cn("ml-2 hidden text-[11px] @[440px]:inline", ctx.theme.muted)}>{s.body}</span>
          </div>
        </div>
        {s.cta && <PrimaryBtn ctx={ctx}>{s.cta.label}</PrimaryBtn>}
      </div>
    </section>
  );
}

function TrustBar({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  return (
    <section className="border-y border-current/10 px-7 py-4">
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
        {s.items?.map((i) => (
          <span key={i.title} className={cn("flex items-center gap-2 text-[11px]", ctx.theme.muted)}>
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ctx.brandText }} />
            {i.title}
          </span>
        ))}
      </div>
    </section>
  );
}

function BeforeAfter({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme, brand } = ctx;
  return (
    <section className={ctx.pad}>
      <div className="text-center">
        <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
        <h2 className={cn("text-2xl", theme.heading)}>{s.title}</h2>
        <p className={cn("mx-auto mt-2.5 max-w-md text-xs leading-relaxed", theme.muted)}>{s.body}</p>
      </div>
      <div className="mt-7 grid gap-4 @[440px]:grid-cols-3">
        {s.items?.slice(0, 3).map((item, i) => (
          <figure key={i} className={cn("overflow-hidden", theme.panel)}>
            <div className="relative flex aspect-[4/3]">
              {item.image ? (
                <SectionImage refId={item.image} ctx={ctx} label={item.title} />
              ) : (
                <>
                  <div
                    className="flex w-1/2 items-end justify-start p-2.5"
                    style={{ background: `linear-gradient(135deg, #3a3a3a40, #1a1a1a26)` }}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-50">Before</span>
                  </div>
                  <div
                    className="flex w-1/2 items-end justify-end p-2.5"
                    style={{ background: `linear-gradient(225deg, ${brand}45, ${brand}14)` }}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: ctx.brandText }}>
                      After
                    </span>
                  </div>
                  <div
                    className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                    style={{ backgroundColor: ctx.brandText, opacity: 0.7 }}
                  />
                  <span
                    className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[9px] font-bold"
                    style={{ backgroundColor: brand, color: ctx.brandInk }}
                  >
                    ⇆
                  </span>
                </>
              )}
            </div>
            <figcaption className={cn("px-3.5 py-2.5 text-[11px]", theme.muted)}>{item.body}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ServiceGrid({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={ctx.pad}>
      <div className="text-center">
        <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
        <h2 className={cn("mx-auto max-w-xl text-2xl", theme.heading)}>{s.title}</h2>
      </div>
      <div className="mt-7 grid gap-3.5 @[440px]:grid-cols-2 @[560px]:grid-cols-3">
        {s.items?.map((item, i) => (
          <div key={i} className={cn("p-5", theme.panel)}>
            <span
              className="mb-3.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
              style={{ backgroundColor: `${ctx.brand}22`, color: ctx.brandText }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className={cn("text-sm font-semibold", theme.heading)}>{item.title}</div>
            <p className={cn("mt-2 text-xs leading-relaxed", theme.muted)}>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={ctx.pad}>
      <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
      <h2 className={cn("max-w-md text-2xl", theme.heading)}>{s.title}</h2>
      <div className="mt-7 grid gap-5 @[440px]:grid-cols-2 @[560px]:grid-cols-4">
        {s.items?.map((item, i) => (
          <div key={i} className="relative">
            <div className="font-editorial text-4xl font-light italic opacity-30" style={{ color: ctx.brandText }}>
              {i + 1}
            </div>
            <div className={cn("mt-2 text-sm font-semibold", theme.heading)}>{item.title}</div>
            <p className={cn("mt-1.5 text-xs leading-relaxed", theme.muted)}>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsBand({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  return (
    <section className="px-7 py-10">
      <div
        className={cn("grid grid-cols-2 gap-px overflow-hidden @[440px]:grid-cols-4", ctx.theme.panel)}
        style={{ background: `${ctx.brand}0d` }}
      >
        {s.stats?.map((st) => (
          <div key={st.label} className="px-5 py-6 text-center">
            <div className={cn("text-xl font-bold tabular-nums", ctx.theme.heading)} style={{ color: ctx.brandText }}>
              {st.value}
            </div>
            <div className={cn("mt-1 text-[10px] uppercase tracking-[0.14em]", ctx.theme.muted)}>{st.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SplitSection({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={ctx.pad}>
      <div className="grid items-start gap-7 @[560px]:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
          <h2 className={cn("text-2xl", theme.heading)}>{s.title}</h2>
          <p className={cn("mt-3 text-sm leading-relaxed", theme.muted)}>{s.body}</p>
          {s.cta && (
            <div className="mt-5">
              <PrimaryBtn ctx={ctx}>{s.cta.label}</PrimaryBtn>
            </div>
          )}
        </div>
        <div className="grid gap-3">
          {s.items?.map((item, i) => (
            <div key={i} className={cn("flex items-start gap-3.5 p-4", theme.panel)}>
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ backgroundColor: `${ctx.brand}22`, color: ctx.brandText }}
              >
                ✓
              </span>
              <div>
                <div className="text-xs font-semibold">{item.title}</div>
                {item.body && <p className={cn("mt-0.5 text-[11px] leading-relaxed", theme.muted)}>{item.body}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Packages({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={ctx.pad}>
      <div className="text-center">
        <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
        <h2 className={cn("text-2xl", theme.heading)}>{s.title}</h2>
      </div>
      <div className="mt-7 grid gap-4 @[440px]:grid-cols-3">
        {s.items?.slice(0, 3).map((item, i) => {
          const featured = Boolean(item.meta);
          return (
            <div
              key={i}
              className={cn("relative p-5", theme.panel)}
              style={featured ? { borderColor: `${ctx.brand}88` } : undefined}
            >
              {featured && (
                <span
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: ctx.brand, color: ctx.brandInk }}
                >
                  {item.meta}
                </span>
              )}
              <div className={cn("text-sm font-semibold", theme.heading)}>{item.title}</div>
              <p className={cn("mt-2 text-xs leading-relaxed", theme.muted)}>{item.body}</p>
              <div className="mt-4">
                <span className={cn("inline-block px-4 py-2 text-[11px]", theme.buttonGhost)}>Get pricing</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Seasonal({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={ctx.pad}>
      <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
      <h2 className={cn("text-2xl", theme.heading)}>{s.title}</h2>
      <div className="mt-6 grid gap-3 @[440px]:grid-cols-4">
        {s.items?.map((item, i) => (
          <div key={i} className={cn("p-4", theme.panel)}>
            <div className={cn("text-[10px] uppercase tracking-[0.18em]", theme.eyebrow)} style={{ color: ctx.brandText }}>
              {item.title}
            </div>
            <p className={cn("mt-2 text-xs leading-relaxed", theme.muted)}>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServiceArea({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={cn(ctx.pad, "text-center")}>
      <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
      <h2 className={cn("text-2xl", theme.heading)}>{s.title}</h2>
      <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2">
        {s.items?.map((item, i) => (
          <span key={i} className={cn("px-3.5 py-1.5 text-[11px]", theme.chip)}>
            {item.title}
          </span>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={ctx.pad}>
      <div className="text-center">
        <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
        <h2 className={cn("text-2xl", theme.heading)}>{s.title}</h2>
      </div>
      <div className="mt-7 grid gap-4 @[440px]:grid-cols-2">
        {s.items?.slice(0, 4).map((item, i) => (
          <blockquote key={i} className={cn("p-6", theme.panel)}>
            <div className="flex gap-0.5 text-[11px]" style={{ color: ctx.brandText }}>
              {"★★★★★"}
            </div>
            <p className="mt-3 text-sm italic leading-relaxed">{item.body}</p>
            <footer className="mt-4 text-[11px] font-semibold" style={{ color: ctx.brandText }}>
              {item.title}
              {item.meta && <span className={cn("ml-2 font-normal", theme.muted)}>{item.meta}</span>}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Gallery({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme, brand } = ctx;
  return (
    <section className={ctx.pad}>
      <div className="text-center">
        <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
        <h2 className={cn("text-2xl", theme.heading)}>{s.title}</h2>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3.5 @[440px]:grid-cols-3">
        {s.items?.slice(0, 6).map((item, i) => (
          <figure key={i} className={cn("overflow-hidden", theme.panel)}>
            <div className="aspect-[4/3]">
              <SectionImage
                refId={item.image}
                ctx={ctx}
                label="photo"
                fallback={{ background: `linear-gradient(${135 + i * 40}deg, ${brand}38, transparent 70%)` }}
              />
            </div>
            <figcaption className={cn("px-3 py-2 text-[10px]", theme.muted)}>{item.body || item.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function GuaranteeSection({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={ctx.pad}>
      <div className={cn("mx-auto max-w-2xl p-8 text-center", theme.panel)} style={{ borderColor: `${ctx.brand}55` }}>
        <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
        <h2 className={cn("text-xl", theme.heading)}>{s.title}</h2>
        <p className={cn("mx-auto mt-3 max-w-md text-sm leading-relaxed", theme.muted)}>{s.body}</p>
        {s.cta && (
          <div className="mt-5">
            <PrimaryBtn ctx={ctx}>{s.cta.label}</PrimaryBtn>
          </div>
        )}
      </div>
    </section>
  );
}

function FaqSection({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme } = ctx;
  return (
    <section className={ctx.pad}>
      <div className="text-center">
        <Eyebrow ctx={ctx}>{s.eyebrow}</Eyebrow>
        <h2 className={cn("text-2xl", theme.heading)}>{s.title}</h2>
      </div>
      <div className="mx-auto mt-7 max-w-2xl space-y-2.5">
        {s.items?.map((item, i) => (
          <details key={i} className={cn("group px-5 py-3.5", theme.panel)} open={i === 0}>
            <summary className="cursor-pointer list-none text-sm font-semibold">{item.title}</summary>
            <p className={cn("mt-2 text-xs leading-relaxed", theme.muted)}>{item.body}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ s, ctx }: { s: BlueprintSection; ctx: Ctx }) {
  const { theme, brand } = ctx;
  return (
    <section className="px-7 py-14">
      <div
        className={cn("p-10 text-center", theme.panel)}
        style={{ background: `linear-gradient(135deg, ${brand}2b, transparent 65%)` }}
      >
        <h2 className={cn("mx-auto max-w-lg text-2xl @[440px]:text-3xl", theme.heading)}>{s.title}</h2>
        <p className={cn("mx-auto mt-3 max-w-md text-sm leading-relaxed", theme.muted)}>{s.body}</p>
        {s.cta && (
          <div className="mt-7">
            <PrimaryBtn ctx={ctx} big>
              {s.cta.label}
            </PrimaryBtn>
          </div>
        )}
      </div>
    </section>
  );
}

const RENDERERS: Record<string, (p: { s: BlueprintSection; ctx: Ctx }) => React.ReactNode> = {
  hero: HeroSection,
  "emergency-banner": EmergencyBanner,
  "trust-bar": TrustBar,
  "before-after": BeforeAfter,
  "service-grid": ServiceGrid,
  process: ProcessSection,
  stats: StatsBand,
  insurance: SplitSection,
  financing: GuaranteeSection,
  packages: Packages,
  seasonal: Seasonal,
  "service-area": ServiceArea,
  testimonials: Testimonials,
  gallery: Gallery,
  certifications: ServiceArea,
  guarantee: GuaranteeSection,
  team: GuaranteeSection,
  faq: FaqSection,
  "final-cta": FinalCta,
};

/* ---------- nav variants (DNA: navStyle) ---------- */

/**
 * Mobile-only hamburger. Shown below the container's 440px breakpoint
 * (i.e. in the phone preview), where the inline links are hidden. Reveals
 * the page links and the primary CTA in a tap-friendly dropdown.
 */
function NavMobileToggle({
  ctx,
  navPages,
  cta,
}: {
  ctx: Ctx;
  navPages: string[];
  cta: string;
}) {
  const [open, setOpen] = useState(false);
  const { theme } = ctx;
  return (
    <div className="relative @[440px]:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border border-current/15",
          theme.heading,
        )}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>
      {open && (
        <div
          className={cn(
            "absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-current/12 p-1.5 backdrop-blur-xl",
            theme.panel,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {navPages.map((p) => (
            <a
              key={p}
              href={`#${p.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-[12px] transition-colors hover:bg-current/5",
                theme.heading,
              )}
            >
              {p}
            </a>
          ))}
          <span
            className={cn("mt-1 block rounded-lg px-3 py-2 text-center text-[12px] font-semibold", theme.button)}
            style={{ backgroundColor: ctx.brand, color: ctx.brandInk }}
          >
            {cta}
          </span>
        </div>
      )}
    </div>
  );
}

function SiteNav({
  ctx,
  name,
  navPages,
  cta,
  phone,
}: {
  ctx: Ctx;
  name: string;
  navPages: string[];
  cta: string;
  phone?: string;
}) {
  const { theme } = ctx;
  const style = getDesignDNA(ctxSystem(ctx)).navStyle;
  const logoUrl = ctx.brief.visual.logoDataUrl;

  const Logo = (
    <span className={cn("flex items-center gap-2.5 text-sm font-bold", theme.heading)}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={`${name} logo`} className="h-5 w-auto" />
      ) : null}
      {name}
    </span>
  );

  if (style === "glass-pill") {
    return (
      <div className="sticky top-0 z-20 px-5 pt-4">
        <div
          className={cn(
            "mx-auto flex max-w-3xl items-center justify-between rounded-full border px-5 py-2.5 backdrop-blur-xl",
            theme.pageBg === "#ffffff" || theme.page.includes("bg-[#f")
              ? "border-black/10 bg-white/70"
              : "border-white/12 bg-white/[0.06]",
          )}
        >
          {Logo}
          <div className={cn("hidden gap-5 text-[11px] @[440px]:flex", theme.muted)}>
            {navPages.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn("hidden px-3.5 py-1.5 text-[11px] @[440px]:inline", theme.button)}
              style={{ backgroundColor: ctx.brand, color: ctx.brandInk }}
            >
              {cta}
            </span>
            <NavMobileToggle ctx={ctx} navPages={navPages} cta={cta} />
          </div>
        </div>
      </div>
    );
  }

  if (style === "bold-bar") {
    return (
      <div className="flex items-center justify-between border-b-2 border-current/15 px-7 py-3.5">
        {Logo}
        <div className={cn("hidden gap-5 text-[11px] font-bold uppercase @[440px]:flex", theme.muted)}>
          {navPages.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {phone && (
            <span className="hidden text-[12px] font-extrabold tabular-nums @[440px]:inline" style={{ color: ctx.brandText }}>
              {phone}
            </span>
          )}
          <span
            className={cn("hidden px-4 py-2 text-[11px] @[440px]:inline", theme.button)}
            style={{ backgroundColor: ctx.brand, color: ctx.brandInk }}
          >
            {cta}
          </span>
          <NavMobileToggle ctx={ctx} navPages={navPages} cta={cta} />
        </div>
      </div>
    );
  }

  if (style === "minimal-text") {
    return (
      <div className="flex items-center justify-between px-7 py-5">
        {Logo}
        <div className={cn("hidden gap-6 text-[10px] uppercase tracking-[0.18em] @[440px]:flex", theme.muted)}>
          {navPages.map((p) => (
            <span key={p}>{p}</span>
          ))}
          <span style={{ color: ctx.brandText }}>{cta}</span>
        </div>
        <NavMobileToggle ctx={ctx} navPages={navPages} cta={cta} />
      </div>
    );
  }

  if (style === "boxed") {
    return (
      <div className="px-5 pt-4">
        <div className={cn("flex items-center justify-between px-5 py-3", theme.panel)}>
          {Logo}
          <div className={cn("hidden gap-5 text-[11px] @[440px]:flex", theme.muted)}>
            {navPages.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn("hidden px-3.5 py-1.5 text-[11px] @[440px]:inline", theme.button)}
              style={{ backgroundColor: ctx.brand, color: ctx.brandInk }}
            >
              {cta}
            </span>
            <NavMobileToggle ctx={ctx} navPages={navPages} cta={cta} />
          </div>
        </div>
      </div>
    );
  }

  // hairline (default)
  return (
    <div className="flex items-center justify-between border-b border-current/10 px-7 py-4 opacity-95">
      {Logo}
      <div className={cn("hidden gap-5 text-[11px] @[440px]:flex", theme.muted)}>
        {navPages.map((p) => (
          <span key={p}>{p}</span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn("hidden px-3.5 py-1.5 text-[11px] @[440px]:inline", theme.button)}
          style={{ backgroundColor: ctx.brand, color: ctx.brandInk }}
        >
          {cta}
        </span>
        <NavMobileToggle ctx={ctx} navPages={navPages} cta={cta} />
      </div>
    </div>
  );
}

/* ---------- the canvas ---------- */

// The active system is threaded through ctx via a symbol-free trick:
// we stash it on the ctx object at render time.
interface CtxWithSystem extends Ctx {
  system: DesignSystemId;
}
function ctxSystem(ctx: Ctx): DesignSystemId {
  return (ctx as CtxWithSystem).system;
}

const PAD: Record<"airy" | "balanced" | "dense", string> = {
  airy: "px-7 py-16",
  balanced: "px-7 py-12",
  dense: "px-7 py-9",
};

export function SiteCanvas({
  blueprint,
  brief,
  system,
  contact,
  bridge = null,
}: {
  blueprint: SiteBlueprint;
  brief: DiscoveryBrief;
  /** Active design system — overridable live in Studio Mode / Editor. */
  system: DesignSystemId;
  contact?: ContactInfo;
  /** Editor bridge — when provided, sections become selectable. */
  bridge?: EditorBridge | null;
}) {
  const theme = getCanvasTheme(system);
  const dna = getDesignDNA(system);
  // A color the user explicitly picked in the brief is BINDING — it must
  // appear as the accent (buttons, badges, glows, links, borders) in every
  // design system, never silently replaced by the system's fixed brand.
  // We only fall back to a system's fixed brand (e.g. Vercel white, Vision
  // Pro silver) when the user left the palette at its industry default.
  const pickedColor = (
    blueprint.design.palette.accent ||
    blueprint.design.palette.secondary ||
    blueprint.design.palette.primary ||
    ""
  ).trim();
  const userPicked = Boolean(
    (brief.visual.primaryColor || brief.visual.secondaryColor || brief.visual.accentColor || "").trim(),
  );
  const userBrand =
    blueprint.design.palette.secondary || blueprint.design.palette.primary || pickedColor;
  const brand = userPicked
    ? userBrand
    : theme.usesBrandBg
      ? userBrand
      : (theme.fixedBrand ?? userBrand);
  const brandInk = readableTextOn(brand);
  const brandText = readableAccentOn(brand, theme.pageBg);
  const ctx: CtxWithSystem = {
    theme,
    brand,
    brandInk,
    brandText,
    brief,
    pad: PAD[dna.density],
    bridge,
    system,
  };

  const name = brief.business.businessName || "Your Business";
  const navPages = useMemo(
    () =>
      blueprint.structure.pages
        .filter((p) => p.id !== "home")
        .slice(0, 4)
        .map((p) => p.title),
    [blueprint.structure.pages],
  );

  const editable = bridge?.editable ?? false;

  return (
    <EditorCtx.Provider value={bridge}>
      <div className={cn("@container min-h-full text-[13px] leading-relaxed", theme.page)}>
        <SiteNav
          ctx={ctx}
          name={name}
          navPages={navPages}
          cta={blueprint.ctaStrategy.primary}
          phone={contact?.phone}
        />

        {blueprint.homepage.map((section, i) => {
          if (section.hidden && !editable) return null;
          const Renderer = RENDERERS[section.type];
          if (!Renderer) return null;
          const selected = bridge?.selectedSection === i;
          return (
            <div
              key={`${section.type}-${i}`}
              data-canvas-section={i}
              onClick={
                editable
                  ? (e) => {
                      e.stopPropagation();
                      bridge?.onSelectSection(i);
                    }
                  : undefined
              }
              className={cn(
                editable &&
                  "relative cursor-pointer transition-shadow duration-150 hover:shadow-[inset_0_0_0_1px_rgba(110,231,210,0.45)]",
                editable && selected && "shadow-[inset_0_0_0_2px_rgba(110,231,210,0.9)]",
                editable && section.hidden && "opacity-30",
              )}
            >
              {editable && (selected || section.hidden) && (
                <span className="absolute right-2 top-2 z-10 rounded-full bg-[#0c0c0f]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#6ee7d2]">
                  {section.hidden ? "hidden" : section.type}
                </span>
              )}
              <Renderer s={section} ctx={ctx} />
            </div>
          );
        })}

        {/* Footer */}
        <footer className={cn("border-t border-current/10 px-7 py-7 text-center text-[11px]", theme.muted)}>
          {(contact?.phone || contact?.email || contact?.address) && (
            <div className="mb-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
              {contact.phone && <span style={{ color: brandText }}>{contact.phone}</span>}
              {contact.email && <span>{contact.email}</span>}
              {contact.address && <span>{contact.address}</span>}
            </div>
          )}
          © {new Date().getFullYear()} {name}
          {brief.business.city ? ` · ${brief.business.city}` : ""} · {getIndustryName(brief)}
        </footer>
      </div>
    </EditorCtx.Provider>
  );
}

export function useEditorBridge() {
  return useContext(EditorCtx);
}
