"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CloudUpload,
  Download,
  Eye,
  EyeOff,
  FileText,
  Globe,
  ImageIcon,
  Layers,
  LayoutTemplate,
  Loader2,
  Monitor,
  MousePointerClick,
  Plus,
  Rocket,
  SendHorizontal,
  Settings2,
  Smartphone,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { PremiumButton } from "@/components/ds/premium-button";
import { GlassPanel } from "@/components/ds/glass-panel";
import { StatusBadge } from "@/components/ds/status-badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiteCanvas, type EditorBridge } from "@/components/generator/site-canvas";
import { DESIGN_SYSTEMS } from "@/lib/discovery";
import { putImage, resolveImageRefs } from "@/lib/idb-images";
import { getProject, loadProjects, loadSettings, saveProject } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type {
  BlueprintItem,
  BlueprintSection,
  DesignSystemId,
  SiteProject,
} from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

/** Resolve a model-supplied design system (id OR display name) to a real id. */
function resolveSystemId(val: unknown): DesignSystemId | null {
  if (typeof val !== "string") return null;
  const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const want = slug(val);
  const wantLoose = want.replace(/-/g, "");
  for (const d of DESIGN_SYSTEMS) {
    const id = d.id as string;
    if (id === val || slug(d.name) === want || id === want) return d.id as DesignSystemId;
    // loose: "apple vision pro" / "vision pro" → vision-pro
    const idLoose = id.replace(/-/g, "");
    if (wantLoose === idLoose || wantLoose.includes(idLoose) || idLoose.includes(wantLoose))
      return d.id as DesignSystemId;
  }
  return null;
}

/** Common color names → hex so the canvas's contrast math always works. */
const COLOR_NAMES: Record<string, string> = {
  red: "#ef4444", crimson: "#dc2626", orange: "#f97316", amber: "#f59e0b",
  yellow: "#eab308", gold: "#c9a96a", lime: "#84cc16", green: "#16a34a",
  emerald: "#10b981", teal: "#14b8a6", cyan: "#06b6d4", sky: "#0ea5e9",
  blue: "#2563eb", indigo: "#4f46e5", violet: "#7c3aed", purple: "#9333ea",
  pink: "#ec4899", rose: "#f43f5e", black: "#0a0a0c", white: "#f5f5f7",
  gray: "#6b7280", grey: "#6b7280", slate: "#475569", navy: "#1e3a8a",
};
/** Normalize a color value to hex when possible; pass hex through untouched. */
function normalizeColor(val: unknown): string | null {
  if (typeof val !== "string" || !val.trim()) return null;
  const v = val.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v;
  return COLOR_NAMES[v] ?? (/^#?[0-9a-f]{6}$/i.test(v) ? `#${v.replace("#", "")}` : null);
}

/* ==========================================================================
   Studio Editor — Framer-lite editing over structured site data.
   Left: page/section tree. Center: clickable live canvas.
   Right: the selected element's editor (or site-level settings).
   ========================================================================== */

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  "emergency-banner": "Emergency banner",
  "trust-bar": "Trust bar",
  "before-after": "Before & after",
  "service-grid": "Services",
  process: "Process",
  stats: "Stats",
  insurance: "Insurance",
  financing: "Financing",
  packages: "Packages",
  seasonal: "Seasonal",
  "service-area": "Service area",
  testimonials: "Testimonials",
  gallery: "Gallery",
  certifications: "Certifications",
  guarantee: "Guarantee",
  team: "Team",
  faq: "FAQ",
  "final-cta": "Final CTA",
};

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
      {children}
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <PanelLabel>{label}</PanelLabel>
      {rows ? (
        <Textarea
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="text-[13px] leading-relaxed"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 text-[13px]"
        />
      )}
    </div>
  );
}

function ImageReplace({
  label,
  current,
  onUpload,
  onClear,
}: {
  label: string;
  current?: string;
  onUpload: (file: File) => void;
  onClear?: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <PanelLabel>{label}</PanelLabel>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-black/20 px-3 py-2.5 text-[12px] text-white/60 transition-colors hover:border-accent/50 hover:text-white"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          {current ? "Replace image" : "Upload image"}
        </button>
        {current && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Remove image"
            className="cursor-pointer rounded-lg border border-hairline p-2.5 text-white/35 transition-colors hover:text-red-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function EditorInner() {
  const params = useSearchParams();
  const [project, setProject] = useState<SiteProject | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [images, setImages] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  /* ---- load project + resolve stored images ---- */
  useEffect(() => {
    const id = params.get("site") ?? params.get("project");
    const found = id ? getProject(id) : loadProjects()[0];
    if (!found) {
      setNotFound(true);
      return;
    }
    setProject(found);
    const refs: string[] = [];
    for (const s of found.blueprint.homepage) {
      if (s.image) refs.push(s.image);
      for (const item of s.items ?? []) if (item.image) refs.push(item.image);
    }
    resolveImageRefs(refs).then(setImages);
    loaded.current = true;
  }, [params]);

  /* ---- autosave ---- */
  useEffect(() => {
    if (!loaded.current || !project) return;
    const t = setTimeout(() => {
      saveProject(project);
      setSavedAt(Date.now());
    }, 500);
    return () => clearTimeout(t);
  }, [project]);

  const patch = useCallback((fn: (p: SiteProject) => SiteProject) => {
    setProject((p) => (p ? fn(p) : p));
  }, []);

  const patchSection = useCallback(
    (i: number, s: Partial<BlueprintSection>) =>
      patch((p) => ({
        ...p,
        blueprint: {
          ...p.blueprint,
          homepage: p.blueprint.homepage.map((sec, idx) =>
            idx === i ? { ...sec, ...s } : sec,
          ),
        },
      })),
    [patch],
  );

  const patchItem = useCallback(
    (i: number, j: number, item: Partial<BlueprintItem>) =>
      patch((p) => ({
        ...p,
        blueprint: {
          ...p.blueprint,
          homepage: p.blueprint.homepage.map((sec, idx) =>
            idx === i
              ? {
                  ...sec,
                  items: (sec.items ?? []).map((it, jdx) =>
                    jdx === j ? { ...it, ...item } : it,
                  ),
                }
              : sec,
          ),
        },
      })),
    [patch],
  );

  const uploadImage = useCallback(
    async (file: File, apply: (ref: string) => void) => {
      const ref = await putImage(file);
      setImages((m) => ({ ...m, [ref]: URL.createObjectURL(file) }));
      apply(ref);
    },
    [],
  );

  const selectSection = useCallback((i: number) => {
    setSelected(i);
    canvasRef.current
      ?.querySelector(`[data-canvas-section="${i}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const bridge: EditorBridge = useMemo(
    () => ({
      editable: true,
      selectedSection: selected,
      onSelectSection: setSelected,
      images,
    }),
    [selected, images],
  );

  const doExport = async () => {
    if (!project) return;
    setExporting(true);
    try {
      const { exportProjectZip } = await import("@/lib/export-zip");
      await exportProjectZip(project);
    } finally {
      setExporting(false);
    }
  };

  /* ---- live AI editor ---- */
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiLog, setAiLog] = useState<{ role: "you" | "ai" | "err"; text: string }[]>([]);

  /** Merge a model patch into the live project, preserving image refs. */
  const applyAiPatch = useCallback(
    (raw: Record<string, unknown>): { summary: string; changed: boolean } => {
      const changes: string[] = [];
      patch((p) => {
        const next = structuredClone(p);
        const bp = next.blueprint;

        // Sections — re-attach images by index/type so the model can't drop them.
        if (Array.isArray(raw.homepage) && raw.homepage.length > 0) {
          const oldByType = new Map<string, BlueprintSection[]>();
          bp.homepage.forEach((s) => {
            const arr = oldByType.get(s.type) ?? [];
            arr.push(s);
            oldByType.set(s.type, arr);
          });
          const taken: Record<string, number> = {};
          bp.homepage = (raw.homepage as BlueprintSection[]).map((incoming) => {
            const pool = oldByType.get(incoming.type) ?? [];
            const idx = taken[incoming.type] ?? 0;
            taken[incoming.type] = idx + 1;
            const original = pool[idx];
            const merged: BlueprintSection = { ...original, ...incoming };
            if (original?.image && !incoming.image) merged.image = original.image;
            if (original?.items && Array.isArray(incoming.items)) {
              merged.items = incoming.items.map((it, j) => ({
                ...original.items?.[j],
                ...it,
                image: it.image ?? original.items?.[j]?.image,
              }));
            }
            return merged;
          });
          changes.push("content");
        }

        // Palette. The canvas's button/accent brand is `palette.secondary ||
        // palette.primary`, so a single requested color must land on BOTH —
        // otherwise the old secondary keeps winning. We also stamp brief.visual
        // so the binding treats it as a user-picked color (overrides fixedBrand).
        const pal = raw.palette as Record<string, string> | undefined;
        if (pal && typeof pal === "object") {
          const primary = normalizeColor(pal.primary);
          const secondary = normalizeColor(pal.secondary);
          const accent = normalizeColor(pal.accent);
          const brand = primary ?? secondary ?? accent;
          if (brand) {
            bp.design.palette = {
              ...bp.design.palette,
              primary: primary ?? brand,
              secondary: secondary ?? brand, // make the brand actually show
              accent: accent ?? bp.design.palette.accent,
            };
            next.brief.visual.primaryColor = primary ?? brand;
            next.brief.visual.secondaryColor = secondary ?? brand;
            if (accent) next.brief.visual.accentColor = accent;
            changes.push("colors");
          }
        }

        if (typeof raw.ctaPrimary === "string" && raw.ctaPrimary.trim()) {
          bp.ctaStrategy.primary = raw.ctaPrimary;
          changes.push("CTA");
        }
        if (typeof raw.ctaSecondary === "string" && raw.ctaSecondary.trim()) {
          bp.ctaStrategy.secondary = raw.ctaSecondary;
        }

        // Style switch — accept an id OR a display name ("Liquid Glass").
        const sys = resolveSystemId(raw.system);
        if (sys && sys !== next.system) {
          next.system = sys;
          changes.push("design system");
        }
        return next;
      });

      const modelSummary = typeof raw.summary === "string" ? raw.summary.trim() : "";
      if (changes.length === 0) {
        return {
          summary:
            "I understood that, but couldn't map it to an editable property yet. Try rephrasing — e.g. “make the buttons blue”, “switch to Liquid Glass”, or “rewrite the hero”.",
          changed: false,
        };
      }
      return { summary: modelSummary || `Updated ${changes.join(", ")}.`, changed: true };
    },
    [patch],
  );

  const runAiEdit = useCallback(
    async (instruction: string) => {
      if (!project || !instruction.trim() || aiBusy) return;
      setAiBusy(true);
      setAiInput("");
      setAiLog((l) => [...l, { role: "you", text: instruction }]);
      try {
        const res = await fetch("/api/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blueprint: project.blueprint,
            system: project.system,
            instruction,
            settings: loadSettings(),
          }),
        });
        const data = (await res.json()) as {
          patch?: Record<string, unknown>;
          error?: string;
        };
        if (!res.ok || !data.patch) {
          setAiLog((l) => [...l, { role: "err", text: data.error || "Edit failed." }]);
          return;
        }
        const { summary, changed } = applyAiPatch(data.patch);
        setAiLog((l) => [...l, { role: changed ? "ai" : "err", text: summary }]);
      } catch (err) {
        setAiLog((l) => [
          ...l,
          { role: "err", text: err instanceof Error ? err.message : "Network error." },
        ]);
      } finally {
        setAiBusy(false);
      }
    },
    [project, aiBusy, applyAiPatch],
  );

  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-hairline-strong">
          <LayoutTemplate className="h-5 w-5 text-white/25" />
        </span>
        <div>
          <p className="font-editorial text-xl italic text-white/85">Nothing to edit yet.</p>
          <p className="mx-auto mt-2 max-w-[300px] text-[13px] leading-relaxed text-white/40">
            Generate a website first — it lands here as an editable project.
          </p>
        </div>
        <PremiumButton asChild>
          <Link href="/studio/generator">Start the discovery</Link>
        </PremiumButton>
      </div>
    );
  }

  if (!project) return null;

  const sections = project.blueprint.homepage;
  const sec = selected !== null ? sections[selected] : null;

  return (
    <div className="mx-auto max-w-[1720px]">
      {/* ---- Top bar ---- */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <PremiumButton variant="ghost" size="sm" asChild>
            <Link href={`/studio/generator?site=${project.id}`}>
              <ArrowLeft className="h-3.5 w-3.5" /> Studio
            </Link>
          </PremiumButton>
          <div>
            <h1 className="font-display text-base font-semibold tracking-tight text-white">
              {project.name || "Untitled"}
              <span className="ml-2.5 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-accent/70">
                editor
              </span>
            </h1>
            <p className="font-mono text-[10px] text-white/30">
              {project.designBrief.style.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {savedAt && (
              <motion.span
                key={savedAt}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 font-mono text-[10px] text-white/30"
              >
                <CloudUpload className="h-3 w-3" /> saved locally
              </motion.span>
            )}
          </AnimatePresence>
          <div className="flex items-center rounded-md border border-hairline bg-white/[0.03] p-0.5">
            <button
              onClick={() => setViewport("desktop")}
              aria-label="Desktop viewport"
              className={cn(
                "cursor-pointer rounded p-1.5 transition-colors",
                viewport === "desktop" ? "bg-white/[0.1] text-white" : "text-white/30 hover:text-white/60",
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              aria-label="Mobile viewport"
              className={cn(
                "cursor-pointer rounded p-1.5 transition-colors",
                viewport === "mobile" ? "bg-white/[0.1] text-white" : "text-white/30 hover:text-white/60",
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
          <PremiumButton size="sm" variant="accent" onClick={() => setAiOpen((v) => !v)}>
            <Sparkles className="h-3.5 w-3.5" /> AI Edit
          </PremiumButton>
          <PremiumButton size="sm" onClick={() => setExportOpen(true)}>
            <Rocket className="h-3.5 w-3.5" /> Export website
          </PremiumButton>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[250px_minmax(0,1fr)_300px]">
        {/* ================= Left: page / section tree ================= */}
        <GlassPanel reflect className="h-fit overflow-hidden xl:sticky xl:top-6">
          <div className="flex items-center gap-2 px-4 pb-2 pt-4">
            <FileText className="h-3.5 w-3.5 text-accent/80" />
            <PanelLabel>Pages</PanelLabel>
          </div>
          <div className="space-y-0.5 px-2.5 pb-2">
            {project.blueprint.structure.pages.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[12px]",
                  p.id === "home" ? "bg-white/[0.06] text-white" : "text-white/35",
                )}
              >
                {p.title}
                {p.id !== "home" && (
                  <span className="font-mono text-[8px] uppercase tracking-wider text-white/20">
                    planned
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-hairline px-4 pb-2 pt-4">
            <Layers className="h-3.5 w-3.5 text-accent/80" />
            <PanelLabel>Homepage sections</PanelLabel>
          </div>
          <div className="space-y-0.5 px-2.5 pb-3">
            {sections.map((s, i) => (
              <div
                key={`${s.type}-${i}`}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 transition-all",
                  selected === i
                    ? "border-accent/40 bg-accent-dim"
                    : "border-transparent hover:bg-white/[0.03]",
                )}
              >
                <button
                  onClick={() => selectSection(i)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left"
                >
                  <span className="font-mono text-[9px] text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-[12px] font-medium",
                        s.hidden ? "text-white/25 line-through" : selected === i ? "text-white" : "text-white/65",
                      )}
                    >
                      {SECTION_LABELS[s.type] ?? s.type}
                    </span>
                    {s.title && (
                      <span className="block truncate text-[10px] text-white/25">{s.title}</span>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => patchSection(i, { hidden: !s.hidden })}
                  aria-label={s.hidden ? "Show section" : "Hide section"}
                  className="shrink-0 cursor-pointer rounded p-1 text-white/25 opacity-0 transition-all hover:text-white group-hover:opacity-100"
                >
                  {s.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelected(null)}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 border-t border-hairline px-4 py-3.5 text-left text-[12px] transition-colors",
              selected === null ? "bg-white/[0.05] text-white" : "text-white/45 hover:text-white",
            )}
          >
            <Settings2 className="h-3.5 w-3.5 text-accent/80" />
            Site settings
            <span className="ml-auto font-mono text-[8px] uppercase tracking-wider text-white/20">
              colors · logo · contact
            </span>
          </button>
        </GlassPanel>

        {/* ================= Center: live canvas ================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="min-w-0"
        >
          <GlassPanel className="overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between border-b border-hairline bg-black/30 px-4 py-2">
              <span className="flex items-center gap-2 font-mono text-[10px] text-white/35">
                <MousePointerClick className="h-3 w-3" />
                click any section to edit it
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {DESIGN_SYSTEMS.map((d) => (
                  <button
                    key={d.id}
                    title={d.name}
                    onClick={() => patch((p) => ({ ...p, system: d.id as DesignSystemId }))}
                    className={cn(
                      "h-5 w-5 shrink-0 cursor-pointer rounded-full border transition-all",
                      project.system === d.id
                        ? "scale-110 border-accent"
                        : "border-white/15 opacity-60 hover:opacity-100",
                    )}
                    style={{ backgroundColor: d.swatch.bg }}
                  />
                ))}
              </div>
            </div>
            <div className="canvas-grid bg-black/40 p-3 sm:p-4" ref={canvasRef}>
              <div
                className={cn(
                  "mx-auto max-h-[74vh] overflow-y-auto rounded-lg border border-hairline-strong shadow-glass-lg transition-[max-width] duration-300",
                  viewport === "mobile" ? "max-w-[390px]" : "max-w-none",
                )}
              >
                <SiteCanvas
                  blueprint={project.blueprint}
                  brief={project.brief}
                  system={project.system}
                  contact={project.contact}
                  bridge={bridge}
                />
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* ================= Right: element editor ================= */}
        <div className="space-y-4 xl:sticky xl:top-6 xl:h-fit xl:max-h-[88vh] xl:overflow-y-auto">
          <AnimatePresence mode="wait">
            {sec && selected !== null ? (
              <motion.div
                key={`section-${selected}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25, ease }}
              >
                <GlassPanel reflect className="space-y-5 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <PanelLabel>Selected section</PanelLabel>
                      <div className="mt-1 text-[14px] font-semibold text-white">
                        {SECTION_LABELS[sec.type] ?? sec.type}
                      </div>
                    </div>
                    <button
                      onClick={() => patchSection(selected, { hidden: !sec.hidden })}
                      className={cn(
                        "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors",
                        sec.hidden
                          ? "border-hairline text-white/40"
                          : "border-accent/40 bg-accent-dim text-white",
                      )}
                    >
                      {sec.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {sec.hidden ? "Hidden" : "Visible"}
                    </button>
                  </div>

                  {sec.eyebrow !== undefined && (
                    <EditField
                      label="Eyebrow"
                      value={sec.eyebrow}
                      onChange={(v) => patchSection(selected, { eyebrow: v })}
                    />
                  )}
                  {sec.title !== undefined && (
                    <EditField
                      label="Headline"
                      value={sec.title}
                      onChange={(v) => patchSection(selected, { title: v })}
                      rows={2}
                    />
                  )}
                  {sec.body !== undefined && (
                    <EditField
                      label="Paragraph"
                      value={sec.body}
                      onChange={(v) => patchSection(selected, { body: v })}
                      rows={3}
                    />
                  )}

                  {sec.cta && (
                    <div className="space-y-3 rounded-xl border border-hairline bg-black/15 p-3.5">
                      <PanelLabel>Call to action</PanelLabel>
                      <EditField
                        label="Button text"
                        value={sec.cta.label}
                        onChange={(v) =>
                          patchSection(selected, { cta: { ...sec.cta!, label: v } })
                        }
                      />
                      <EditField
                        label="Button link"
                        value={sec.cta.href ?? ""}
                        onChange={(v) =>
                          patchSection(selected, { cta: { ...sec.cta!, href: v } })
                        }
                      />
                      {sec.cta.secondary !== undefined && (
                        <EditField
                          label="Secondary button"
                          value={sec.cta.secondary}
                          onChange={(v) =>
                            patchSection(selected, { cta: { ...sec.cta!, secondary: v } })
                          }
                        />
                      )}
                    </div>
                  )}

                  {(sec.type === "hero" || sec.image !== undefined) && (
                    <ImageReplace
                      label="Section image"
                      current={sec.image}
                      onUpload={(f) =>
                        uploadImage(f, (ref) => patchSection(selected, { image: ref }))
                      }
                      onClear={() => patchSection(selected, { image: undefined })}
                    />
                  )}

                  {sec.stats && sec.stats.length > 0 && (
                    <div className="space-y-2.5">
                      <PanelLabel>Stats</PanelLabel>
                      {sec.stats.map((st, j) => (
                        <div key={j} className="grid grid-cols-2 gap-2">
                          <Input
                            value={st.value}
                            onChange={(e) =>
                              patchSection(selected, {
                                stats: sec.stats!.map((x, k) =>
                                  k === j ? { ...x, value: e.target.value } : x,
                                ),
                              })
                            }
                            className="h-8 text-[12px]"
                          />
                          <Input
                            value={st.label}
                            onChange={(e) =>
                              patchSection(selected, {
                                stats: sec.stats!.map((x, k) =>
                                  k === j ? { ...x, label: e.target.value } : x,
                                ),
                              })
                            }
                            className="h-8 text-[12px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.items && (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <PanelLabel>
                          {sec.type === "testimonials"
                            ? "Testimonials"
                            : sec.type === "faq"
                              ? "Questions"
                              : sec.type === "service-grid"
                                ? "Services"
                                : "Items"}
                        </PanelLabel>
                        <button
                          onClick={() =>
                            patchSection(selected, {
                              items: [...sec.items!, { title: "New item", body: "" }],
                            })
                          }
                          className="flex cursor-pointer items-center gap-1 font-mono text-[10px] text-accent/80 hover:text-accent"
                        >
                          <Plus className="h-3 w-3" /> add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {sec.items.map((item, j) => (
                          <details
                            key={j}
                            className="group rounded-xl border border-hairline bg-black/15"
                          >
                            <summary className="flex cursor-pointer items-center justify-between gap-2 px-3.5 py-2.5 text-[12px] font-medium text-white/70 [&::-webkit-details-marker]:hidden">
                              <span className="truncate">{item.title || `Item ${j + 1}`}</span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  patchSection(selected, {
                                    items: sec.items!.filter((_, k) => k !== j),
                                  });
                                }}
                                aria-label="Remove item"
                                className="shrink-0 cursor-pointer rounded p-1 text-white/25 hover:text-red-300"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </summary>
                            <div className="space-y-3 px-3.5 pb-3.5">
                              <EditField
                                label="Title"
                                value={item.title}
                                onChange={(v) => patchItem(selected, j, { title: v })}
                              />
                              <EditField
                                label="Text"
                                value={item.body}
                                onChange={(v) => patchItem(selected, j, { body: v })}
                                rows={3}
                              />
                              {item.meta !== undefined && (
                                <EditField
                                  label="Meta"
                                  value={item.meta}
                                  onChange={(v) => patchItem(selected, j, { meta: v })}
                                />
                              )}
                              {(sec.type === "gallery" || sec.type === "before-after") && (
                                <ImageReplace
                                  label="Image"
                                  current={item.image}
                                  onUpload={(f) =>
                                    uploadImage(f, (ref) => patchItem(selected, j, { image: ref }))
                                  }
                                  onClear={() => patchItem(selected, j, { image: undefined })}
                                />
                              )}
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassPanel>
              </motion.div>
            ) : (
              <motion.div
                key="site-settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25, ease }}
                className="space-y-4"
              >
                <GlassPanel reflect className="space-y-5 p-5">
                  <div>
                    <PanelLabel>Site settings</PanelLabel>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-white/35">
                      Click a section in the preview to edit its content — or adjust
                      site-wide settings here.
                    </p>
                  </div>
                  <EditField
                    label="Business name"
                    value={project.brief.business.businessName}
                    onChange={(v) =>
                      patch((p) => ({
                        ...p,
                        name: v,
                        brief: { ...p.brief, business: { ...p.brief.business, businessName: v } },
                      }))
                    }
                  />
                  <ImageReplace
                    label="Logo"
                    current={project.brief.visual.logoDataUrl || undefined}
                    onUpload={(f) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          const dataUrl = reader.result;
                          patch((p) => ({
                            ...p,
                            brief: {
                              ...p.brief,
                              visual: { ...p.brief.visual, logoDataUrl: dataUrl, logoName: f.name },
                            },
                          }));
                        }
                      };
                      reader.readAsDataURL(f);
                    }}
                    onClear={() =>
                      patch((p) => ({
                        ...p,
                        brief: {
                          ...p.brief,
                          visual: { ...p.brief.visual, logoDataUrl: "", logoName: "" },
                        },
                      }))
                    }
                  />
                  <div className="space-y-2.5">
                    <PanelLabel>Colors</PanelLabel>
                    {(
                      [
                        ["primary", "Primary"],
                        ["secondary", "Action"],
                        ["accent", "Accent"],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="flex items-center gap-3">
                        <input
                          type="color"
                          aria-label={label}
                          value={project.blueprint.design.palette[key]}
                          onChange={(e) =>
                            patch((p) => ({
                              ...p,
                              blueprint: {
                                ...p.blueprint,
                                design: {
                                  ...p.blueprint.design,
                                  palette: { ...p.blueprint.design.palette, [key]: e.target.value },
                                },
                              },
                            }))
                          }
                          className="h-7 w-9 cursor-pointer rounded border-none bg-transparent"
                        />
                        <span className="text-[12px] text-white/60">{label}</span>
                        <span className="ml-auto font-mono text-[10px] text-white/30">
                          {project.blueprint.design.palette[key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassPanel>

                <GlassPanel reflect className="space-y-4 p-5">
                  <PanelLabel>Contact info</PanelLabel>
                  <EditField
                    label="Phone"
                    value={project.contact.phone}
                    onChange={(v) => patch((p) => ({ ...p, contact: { ...p.contact, phone: v } }))}
                  />
                  <EditField
                    label="Email"
                    value={project.contact.email}
                    onChange={(v) => patch((p) => ({ ...p, contact: { ...p.contact, email: v } }))}
                  />
                  <EditField
                    label="Address"
                    value={project.contact.address}
                    onChange={(v) => patch((p) => ({ ...p, contact: { ...p.contact, address: v } }))}
                  />
                </GlassPanel>

                <GlassPanel reflect className="space-y-4 p-5">
                  <PanelLabel>SEO</PanelLabel>
                  <EditField
                    label="Search title"
                    value={project.blueprint.seo.title}
                    onChange={(v) =>
                      patch((p) => ({
                        ...p,
                        blueprint: { ...p.blueprint, seo: { ...p.blueprint.seo, title: v } },
                      }))
                    }
                  />
                  <EditField
                    label="Search description"
                    value={project.blueprint.seo.description}
                    onChange={(v) =>
                      patch((p) => ({
                        ...p,
                        blueprint: { ...p.blueprint, seo: { ...p.blueprint.seo, description: v } },
                      }))
                    }
                    rows={3}
                  />
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= Live AI editor ================= */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.32, ease }}
            className="fixed bottom-5 right-5 z-50 flex w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl"
          >
            <GlassPanel elevation="float" reflect className="flex max-h-[70vh] flex-col">
              {/* header */}
              <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-dim text-accent shadow-glow-accent">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <div className="text-[13px] font-semibold text-white">AI Editor</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                      describe a change · applies live
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAiOpen(false)}
                  aria-label="Close AI editor"
                  className="cursor-pointer rounded-md p-1 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* transcript */}
              <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
                {aiLog.length === 0 ? (
                  <div className="space-y-2.5">
                    <p className="text-[12px] leading-relaxed text-white/45">
                      Tell me what to change — I edit the live site instantly.
                    </p>
                    <div className="space-y-1.5">
                      {[
                        "Make the palette emerald green",
                        "Rewrite the hero to be bolder and shorter",
                        "Switch the design system to Liquid Glass",
                        "Hide the stats section",
                      ].map((s) => (
                        <button
                          key={s}
                          onClick={() => runAiEdit(s)}
                          disabled={aiBusy}
                          className="block w-full cursor-pointer rounded-lg border border-hairline bg-white/[0.02] px-3 py-2 text-left text-[12px] text-white/65 transition-colors hover:border-accent/40 hover:bg-accent-dim hover:text-white disabled:opacity-40"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  aiLog.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-xl px-3 py-2 text-[12px] leading-relaxed",
                        m.role === "you" && "ml-6 border border-hairline bg-white/[0.05] text-white/85",
                        m.role === "ai" && "mr-6 border border-accent/25 bg-accent-dim text-white/85",
                        m.role === "err" && "mr-6 border border-red-400/25 bg-red-500/10 text-red-200",
                      )}
                    >
                      {m.role === "ai" && (
                        <span className="mr-1.5 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.16em] text-accent/80">
                          <Check className="h-3 w-3" /> applied
                        </span>
                      )}
                      {m.text}
                    </div>
                  ))
                )}
                {aiBusy && (
                  <div className="mr-6 flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-dim px-3 py-2 text-[12px] text-white/70">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" /> Editing the site…
                  </div>
                )}
              </div>

              {/* composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  runAiEdit(aiInput);
                }}
                className="flex items-end gap-2 border-t border-hairline p-2.5"
              >
                <Textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      runAiEdit(aiInput);
                    }
                  }}
                  rows={1}
                  placeholder="e.g. make the buttons green and punchier"
                  className="max-h-28 min-h-[38px] flex-1 resize-none text-[13px]"
                />
                <PremiumButton
                  type="submit"
                  size="icon"
                  variant="accent"
                  disabled={aiBusy || !aiInput.trim()}
                  aria-label="Send instruction"
                >
                  {aiBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
                </PremiumButton>
              </form>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= Export guide modal ================= */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-editorial text-xl italic">
              How to launch your website
            </DialogTitle>
            <DialogDescription>
              The export is a complete Next.js project — your content as editable data,
              your images included, ready for free hosting.
            </DialogDescription>
          </DialogHeader>
          <ol className="space-y-2">
            {[
              "Download the ZIP",
              "Unzip the folder",
              "Open it in VS Code",
              "Run npm install",
              "Run npm run dev — your site is live locally",
              "Create a GitHub repository",
              "Push the code",
              "Import the repo into Vercel",
              "Add your custom domain",
            ].map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-[13px] text-white/70">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-hairline font-mono text-[9px] text-accent">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="flex items-center gap-2 rounded-lg border border-hairline bg-black/20 px-3.5 py-2.5 text-[11px] leading-relaxed text-white/40">
            <Globe className="h-3.5 w-3.5 shrink-0 text-accent/70" />
            The README inside the ZIP walks through every step — including Vercel,
            Netlify, and custom domains — in beginner language.
          </p>
          <div className="flex gap-2.5 pt-1">
            <PremiumButton onClick={doExport} disabled={exporting}>
              {exporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Building ZIP…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" /> Download ZIP
                </>
              )}
            </PremiumButton>
            <PremiumButton variant="outline" onClick={() => setExportOpen(false)}>
              Close
            </PremiumButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={null}>
      <EditorInner />
    </Suspense>
  );
}
