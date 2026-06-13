"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CloudUpload, RotateCcw, Sparkles } from "lucide-react";
import { PremiumButton } from "@/components/ds/premium-button";
import { GlassPanel } from "@/components/ds/glass-panel";
import { StatusBadge } from "@/components/ds/status-badge";
import { Kbd } from "@/components/ds/kbd";
import { SECTION_COMPONENTS } from "@/components/discovery/sections";
import { StudioMode } from "@/components/studio-mode/studio-mode";
import {
  DEFAULT_BRIEF,
  SECTIONS,
  overallProgress,
  sectionProgress,
  sectionSummary,
} from "@/lib/discovery";
import { getIndustryProfile } from "@/lib/industry-engine";
import {
  clearDraft,
  getProject,
  loadDraft,
  loadSettings,
  saveDraft,
  saveProject,
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import type {
  DiscoveryBrief,
  GenerationResult,
  IndustryId,
  SiteProject,
} from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

type Phase = "discovery" | "generating" | "studio";

/* The staged messages shown while the studio "works" — the real pipeline. */
const GENERATION_STAGES = [
  "Reading your brief",
  "Phase 1 — writing the design brief",
  "Locking the Design DNA",
  "Phase 2 — architecting the site",
  "Composing industry-specific sections",
  "Writing the copy",
  "Building the SEO strategy",
  "Assembling the canvas",
];

function GeneratorInner() {
  const params = useSearchParams();
  const [phase, setPhase] = useState<Phase>("discovery");
  const [brief, setBrief] = useState<DiscoveryBrief>(DEFAULT_BRIEF);
  const [active, setActive] = useState(0);
  const [project, setProject] = useState<SiteProject | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [stage, setStage] = useState(0);
  const loaded = useRef(false);

  /* ---- bootstrap: saved site, template param, or draft ---- */
  useEffect(() => {
    const settings = loadSettings();
    setHasKey(Boolean(settings.apiKey) || settings.provider === "ollama");

    const siteId = params.get("site");
    if (siteId) {
      const saved = getProject(siteId);
      if (saved) {
        setBrief(saved.brief);
        setProject(saved);
        setPhase("studio");
        loaded.current = true;
        return;
      }
    }

    const draft = loadDraft();
    const templateId = params.get("template") as IndustryId | null;
    if (templateId) {
      const profile = getIndustryProfile(templateId);
      setBrief({
        ...draft,
        business: {
          ...draft.business,
          industry: templateId,
          primaryService: draft.business.primaryService || profile.defaultServices[0],
          secondaryServices: draft.business.secondaryServices.length
            ? draft.business.secondaryServices
            : profile.defaultServices.slice(1),
        },
        designSystems: draft.designSystems.length
          ? draft.designSystems
          : profile.suggestedSystems,
        visual: {
          ...draft.visual,
          primaryColor: profile.palette.primary,
          secondaryColor: profile.palette.secondary,
          accentColor: profile.palette.accent,
        },
      });
    } else {
      setBrief(draft);
    }
    loaded.current = true;
  }, [params]);

  /* ---- autosave the draft, debounced ---- */
  useEffect(() => {
    if (!loaded.current || phase !== "discovery") return;
    const t = setTimeout(() => {
      saveDraft(brief);
      setSavedAt(Date.now());
    }, 600);
    return () => clearTimeout(t);
  }, [brief, phase]);

  const progress = useMemo(() => sectionProgress(brief), [brief]);
  const overall = useMemo(() => overallProgress(brief), [brief]);
  const section = SECTIONS[active];
  const isLast = active === SECTIONS.length - 1;
  const canGenerate = brief.business.businessName.trim().length > 0;

  const toProject = useCallback(
    (b: DiscoveryBrief, data: GenerationResult): SiteProject => ({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      name: b.business.businessName || "Untitled",
      brief: b,
      designBrief: data.designBrief,
      blueprint: data.blueprint,
      system: b.designSystems[0] ?? data.designBrief.designDNA,
      contact: { phone: "", email: "", address: "" },
      source: data.source,
      warning: data.warning,
    }),
    [],
  );

  const generate = useCallback(async () => {
    if (!canGenerate) return;
    setPhase("generating");
    setStage(0);
    const stageTimer = setInterval(
      () => setStage((s) => Math.min(s + 1, GENERATION_STAGES.length - 1)),
      650,
    );
    const started = Date.now();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, settings: loadSettings() }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as GenerationResult;
      // Let the staging breathe even when the engine answers instantly.
      const minMs = 2_600;
      const elapsed = Date.now() - started;
      if (elapsed < minMs) await new Promise((r) => setTimeout(r, minMs - elapsed));
      const p = toProject(brief, data);
      saveProject(p);
      setProject(p);
      setPhase("studio");
    } catch {
      const [{ generateBlueprint }, { buildDesignBrief }] = await Promise.all([
        import("@/lib/blueprint-generator"),
        import("@/lib/design-brief"),
      ]);
      const designBrief = buildDesignBrief(brief);
      const fallback: GenerationResult = {
        designBrief,
        blueprint: generateBlueprint(brief, designBrief),
        source: "engine",
        warning: "Request failed — blueprint produced by the built-in engine.",
      };
      const p = toProject(brief, fallback);
      saveProject(p);
      setProject(p);
      setPhase("studio");
    } finally {
      clearInterval(stageTimer);
    }
  }, [brief, canGenerate, toProject]);

  /* ⌘↵ generates from anywhere once the brief is viable. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && phase === "discovery" && canGenerate) {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, canGenerate, generate]);

  const resetBrief = () => {
    clearDraft();
    setBrief(DEFAULT_BRIEF);
    setActive(0);
  };

  /* ================= Studio phase ================= */
  if (phase === "studio" && project) {
    return (
      <StudioMode
        project={project}
        onBackToBrief={() => {
          setPhase("discovery");
          setActive(0);
        }}
      />
    );
  }

  /* ================= Generating phase ================= */
  if (phase === "generating") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease }}
          className="w-full max-w-md"
        >
          <GlassPanel reflect className="light-sweep relative overflow-hidden p-10">
            <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
              <div className="h-full w-1/3 animate-scan bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <p className="font-editorial text-2xl italic text-white/90">
              The studio is working.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/40">
              {brief.business.businessName} · {getIndustryProfile(brief.business.industry, brief.business.customIndustry).name}
            </p>
            <div className="mt-8 space-y-2.5">
              {GENERATION_STAGES.map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-3 text-[12px] transition-all duration-300",
                    i < stage ? "text-white/40" : i === stage ? "text-white" : "text-white/15",
                  )}
                >
                  {i < stage ? (
                    <Check className="h-3.5 w-3.5 text-accent" />
                  ) : i === stage ? (
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                      <span className="h-1.5 w-1.5 animate-breathe rounded-full bg-accent" />
                    </span>
                  ) : (
                    <span className="h-3.5 w-3.5" />
                  )}
                  {label}
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    );
  }

  /* ================= Discovery phase ================= */
  const Active = SECTION_COMPONENTS[section.id];

  return (
    <div className="mx-auto max-w-[1240px]">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/30">
            Discovery
          </div>
          <h1 className="mt-1.5 font-editorial text-2xl italic text-white">
            Brief the studio.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {savedAt && (
              <motion.span
                key={savedAt}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 font-mono text-[10px] text-white/30"
              >
                <CloudUpload className="h-3 w-3" /> draft saved
              </motion.span>
            )}
          </AnimatePresence>
          {!hasKey && (
            <Link href="/studio/settings" className="cursor-pointer">
              <StatusBadge status="warn">engine mode — add a key</StatusBadge>
            </Link>
          )}
          <PremiumButton variant="ghost" size="sm" onClick={resetBrief} aria-label="Start over">
            <RotateCcw className="h-3.5 w-3.5" /> Start over
          </PremiumButton>
        </div>
      </header>

      {/* Overall progress */}
      <div className="mt-4 h-px w-full overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          className="h-full bg-accent/70"
          animate={{ width: `${Math.max(2, Math.round(overall * 100))}%` }}
          transition={{ duration: 0.6, ease }}
        />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[270px_minmax(0,1fr)]">
        {/* ---- Progress rail ---- */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-0.5">
            {SECTIONS.map((s, i) => {
              const p = progress[s.id];
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group flex w-full cursor-pointer items-center gap-3.5 rounded-xl border px-4 py-3 text-left transition-all duration-200",
                    isActive
                      ? "border-hairline-strong bg-white/[0.05] shadow-glass"
                      : "border-transparent hover:bg-white/[0.025]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] transition-colors duration-200",
                      p >= 1
                        ? "border-accent/50 bg-accent-dim text-accent"
                        : isActive
                          ? "border-white/30 text-white"
                          : "border-hairline text-white/30",
                    )}
                  >
                    {p >= 1 ? <Check className="h-3 w-3" /> : String(s.index).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-[13px] font-medium transition-colors",
                        isActive ? "text-white" : "text-white/55 group-hover:text-white/80",
                      )}
                    >
                      {s.short}
                    </span>
                    <span className="block truncate text-[11px] text-white/30">
                      {sectionSummary(brief, s.id)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ---- Active section ---- */}
        <div className="min-w-0">
          {/* Mobile section stepper */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border px-3 py-1 font-mono text-[10px] transition-colors",
                  i === active
                    ? "border-accent/50 bg-accent-dim text-white"
                    : progress[s.id] >= 1
                      ? "border-hairline text-accent/70"
                      : "border-hairline text-white/35",
                )}
              >
                {String(s.index).padStart(2, "0")}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease }}
            >
              {/* Editorial section header */}
              <div className="relative pb-8">
                <span className="section-index pointer-events-none absolute -left-2 -top-6 select-none">
                  {String(section.index).padStart(2, "0")}
                </span>
                <div className="relative">
                  <h2 className="font-editorial text-3xl text-white md:text-4xl">
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/45">
                    {section.lede}
                  </p>
                </div>
              </div>

              <GlassPanel reflect className="p-7 md:p-9">
                <Active brief={brief} setBrief={setBrief} />
              </GlassPanel>

              {/* Nav */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 pb-12">
                <PremiumButton
                  variant="outline"
                  size="lg"
                  disabled={active === 0}
                  onClick={() => setActive((a) => Math.max(0, a - 1))}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </PremiumButton>

                <div className="flex items-center gap-4">
                  {isLast ? (
                    <>
                      <span className="hidden items-center gap-1.5 font-mono text-[11px] text-white/30 sm:flex">
                        <Kbd>⌘↵</Kbd>
                      </span>
                      <PremiumButton size="lg" disabled={!canGenerate} onClick={generate}>
                        <Sparkles className="h-4 w-4" />
                        {canGenerate ? "Generate the site" : "Name the business first"}
                      </PremiumButton>
                    </>
                  ) : (
                    <PremiumButton size="lg" onClick={() => setActive((a) => a + 1)}>
                      Continue <ArrowRight className="h-4 w-4" />
                    </PremiumButton>
                  )}
                </div>
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={null}>
      <GeneratorInner />
    </Suspense>
  );
}
