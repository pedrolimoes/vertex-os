"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, DoorOpen, FileCode2, KeyRound, Plus, Wrench } from "lucide-react";
import { PremiumButton } from "@/components/ds/premium-button";
import { SiteCanvas } from "@/components/generator/site-canvas";
import { generateBlueprint } from "@/lib/blueprint-generator";
import { DEFAULT_BRIEF, DESIGN_SYSTEMS, INDUSTRIES, SECTIONS } from "@/lib/discovery";
import { cn } from "@/lib/utils";
import type { DesignSystemId, DiscoveryBrief } from "@/lib/types";

/* ==========================================================================
   Landing — entering the studio.
   Not a SaaS homepage: a dark stage with floating glass surfaces, a live
   generated site suspended in the middle of it, and one path inward.
   ========================================================================== */

const ease = [0.22, 1, 0.36, 1] as const;

const OWNERSHIP_CARDS = [
  {
    icon: FileCode2,
    title: "Full Source Code",
    body: "Export your complete project at any time.",
  },
  {
    icon: DoorOpen,
    title: "No Vendor Lock-In",
    body: "Host anywhere. Leave anytime.",
  },
  {
    icon: KeyRound,
    title: "Bring Your Own AI",
    body: "Use your preferred AI provider and your own API key.",
  },
  {
    icon: Wrench,
    title: "Your Project, Your Rules",
    body: "Customize anything. Modify the code. Build on top of it.",
  },
];

const FAQ = [
  {
    q: "Who owns the generated website?",
    a: "You do. VertexOS does not claim ownership of your generated website, content, or exported source code.",
  },
  {
    q: "Can I export my code?",
    a: "Yes. Export the full project and host it wherever you want.",
  },
  {
    q: "Do I need to host with VertexOS?",
    a: "No. You can self-host or deploy using services like Vercel, Netlify, GitHub Pages, or your own server.",
  },
  {
    q: "Do I need coding skills?",
    a: "No. VertexOS is designed for both technical and non-technical users.",
  },
  {
    q: "Does VertexOS keep my website?",
    a: "No. Your exported project is yours to keep and modify.",
  },
  {
    q: "Do I need to pay VertexOS?",
    a: "No. VertexOS is free. If you choose to use AI models, you provide your own API key and pay your chosen provider directly.",
  },
  {
    q: "Can I stop using VertexOS later?",
    a: "Yes. Export your project and continue using it however you want.",
  },
  {
    q: "Is VertexOS open source?",
    a: "Yes. The project is open source and community driven.",
  },
];

const DEMO_BRIEF: DiscoveryBrief = {
  ...DEFAULT_BRIEF,
  business: {
    ...DEFAULT_BRIEF.business,
    businessName: "Meridian Coatings",
    industry: "epoxy-flooring",
    city: "Denver",
    state: "CO",
    serviceArea: "Denver metro",
    yearsInBusiness: "6–10 years",
    primaryService: "Garage Floor Coatings",
    secondaryServices: ["Commercial Epoxy", "Metallic Finishes"],
  },
  brand: {
    ...DEFAULT_BRIEF.brand,
    personalities: ["premium", "trustworthy"],
    threeWords: "Meticulous, honest, fast",
    differentiator: "The only crew in town that moisture-tests every slab.",
  },
  designSystems: ["modern-industrial", "liquid-glass", "luxury-black"],
  goals: ["get-leads", "build-trust"],
  seo: { ...DEFAULT_BRIEF.seo, targetCity: "Denver" },
};

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-hairline-strong bg-white/[0.06] font-display text-[11px] font-bold text-white shadow-glass">
        V
      </span>
      <span className="font-display text-[13px] font-semibold tracking-tight text-white">
        VertexOS <span className="text-white/40">Studio</span>
      </span>
    </Link>
  );
}

export default function LandingPage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });

  // Parallax layers — each floating panel drifts at its own depth.
  const deep = {
    x: useTransform(sx, [0, 1], [14, -14]),
    y: useTransform(sy, [0, 1], [10, -10]),
  };
  const mid = {
    x: useTransform(sx, [0, 1], [-22, 22]),
    y: useTransform(sy, [0, 1], [-12, 12]),
  };
  const near = {
    x: useTransform(sx, [0, 1], [30, -30]),
    y: useTransform(sy, [0, 1], [18, -18]),
  };
  const lightX = useTransform(sx, [0, 1], ["35%", "65%"]);

  const [demoSystem, setDemoSystem] = useState<DesignSystemId>("modern-industrial");
  const blueprint = useMemo(() => generateBlueprint(DEMO_BRIEF), []);
  const demoSystems = DESIGN_SYSTEMS.filter((d) =>
    (["modern-industrial", "liquid-glass", "luxury-black", "minimal-editorial", "vision-pro"] as string[]).includes(d.id),
  );

  return (
    <main
      ref={stageRef}
      onMouseMove={(e) => {
        const r = stageRef.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      className="grain relative min-h-screen overflow-hidden bg-base"
    >
      {/* ---- Ambient stage lighting ---- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: useTransform(
            lightX,
            (x) =>
              `radial-gradient(ellipse 70% 45% at ${x} -5%, rgba(255,255,255,0.07), transparent 65%), radial-gradient(ellipse 40% 35% at 85% 95%, rgba(110,231,210,0.05), transparent 70%)`,
          ),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "110px 110px",
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 20%, black 20%, transparent)",
        }}
      />

      {/* ---- Nav ---- */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6"
      >
        <Wordmark />
        <div className="hidden items-center gap-7 text-[13px] text-white/45 md:flex">
          <Link href="/studio/templates" className="cursor-pointer transition-colors hover:text-white">
            Industries
          </Link>
          <Link href="/templates" className="cursor-pointer transition-colors hover:text-white">
            Demo sites
          </Link>
          <Link href="/studio/connectors" className="cursor-pointer transition-colors hover:text-white">
            Connectors
          </Link>
        </div>
        <PremiumButton variant="glass" size="sm" asChild>
          <Link href="/studio">Enter the studio</Link>
        </PremiumButton>
      </motion.nav>

      {/* ---- Act 1: the brief ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30"
        >
          A design studio, not a form
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="mt-6 max-w-4xl text-[44px] leading-[1.02] tracking-tight text-white md:text-[76px]"
        >
          <span className="font-display font-semibold">Brief it like an agency.</span>
          <br />
          <span className="font-editorial font-light italic text-white/85">
            Watch it become a website.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
          className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/45"
        >
          A ten-section discovery process — business, brand personality, competitors,
          goals, local SEO — turned into a brand strategy, a design direction, and an
          industry-specific website. Epoxy doesn&apos;t look like roofing. Roofing
          doesn&apos;t look like detailing. Nothing looks like a template.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <PremiumButton size="lg" asChild className="light-sweep">
            <Link href="/studio/generator">
              Start the discovery <ArrowRight className="h-4 w-4" />
            </Link>
          </PremiumButton>
          <Link
            href="/templates"
            className="flex cursor-pointer items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white"
          >
            See generated demo sites <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </section>

      {/* ---- Act 2: the studio stage ---- */}
      <section className="relative z-10 mx-auto mt-20 max-w-7xl px-6 pb-10 md:mt-28">
        <div className="relative">
          {/* Deep layer: strategy panel, floating left */}
          <motion.aside
            style={deep}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
            className="absolute -left-2 top-10 z-20 hidden w-[250px] animate-float-slower lg:block"
          >
            <div className="glass-float reflect p-5">
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                Brand strategy
              </div>
              <p className="mt-2.5 text-[12px] leading-relaxed text-white/70">
                {blueprint.brand.positioning}
              </p>
              <div className="mt-4 border-t border-hairline pt-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                  Buyer psychology
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-white/50">
                  Visual proof of the finish, confidence it won&apos;t peel, and a clean
                  crew in the garage.
                </p>
              </div>
            </div>
          </motion.aside>

          {/* Near layer: design system switcher, floating right */}
          <motion.aside
            style={near}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="absolute -right-2 top-24 z-20 hidden w-[225px] animate-float-slow lg:block"
          >
            <div className="glass-float reflect p-4">
              <div className="px-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                Design system — live
              </div>
              <div className="mt-2.5 space-y-1">
                {demoSystems.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDemoSystem(d.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-left transition-all duration-150",
                      demoSystem === d.id
                        ? "border-accent/40 bg-accent-dim"
                        : "border-transparent hover:bg-white/[0.04]",
                    )}
                  >
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded border border-white/10 text-[7px] font-bold"
                      style={{ backgroundColor: d.swatch.bg, color: d.swatch.fg }}
                    >
                      Aa
                    </span>
                    <span
                      className={cn(
                        "truncate text-[11px] font-medium",
                        demoSystem === d.id ? "text-white" : "text-white/55",
                      )}
                    >
                      {d.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>

          {/* Mid layer: the living website */}
          <motion.div
            style={mid}
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <div
              aria-hidden
              className="absolute -inset-10 rounded-[40px] opacity-60"
              style={{
                background:
                  "radial-gradient(ellipse 65% 55% at 50% 35%, rgba(110,231,210,0.07), transparent 70%)",
              }}
            />
            <div className="glass-float reflect light-sweep relative overflow-hidden rounded-3xl p-2.5">
              <div className="max-h-[560px] overflow-y-auto rounded-2xl border border-hairline-strong">
                <SiteCanvas blueprint={blueprint} brief={DEMO_BRIEF} system={demoSystem} />
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="font-mono text-[10px] text-white/30">
                  meridiancoatings.com · generated from a 10-section brief
                </span>
                <span className="hidden font-mono text-[10px] text-accent/70 sm:block">
                  switch the design system →
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Act 3: the discovery process ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">
            The discovery
          </p>
          <h2 className="mt-5 max-w-2xl font-editorial text-3xl font-light italic text-white md:text-5xl">
            Ten sections. The same questions a senior designer would ask.
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-5">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.04 * i, ease }}
              className="group bg-base p-6 transition-colors duration-300 hover:bg-white/[0.03]"
            >
              <div className="font-editorial text-2xl font-light italic text-white/15 transition-colors duration-300 group-hover:text-accent/60">
                {String(s.index).padStart(2, "0")}
              </div>
              <div className="mt-3 text-[13px] font-semibold text-white/85">{s.label}</div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/35">{s.lede.split(".")[0]}.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- Act 4: the industry engine ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease }}
          className="grid items-end gap-8 lg:grid-cols-[1fr_320px]"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">
              The industry engine
            </p>
            <h2 className="mt-5 max-w-2xl font-editorial text-3xl font-light italic text-white md:text-5xl">
              Every industry gets its own architecture.
            </h2>
          </div>
          <p className="text-[13px] leading-relaxed text-white/40">
            A roofing site leads with storm response and insurance fluency. An epoxy site
            leads with before/after proof and bond strength. The section order, the trust
            logic, the FAQ — all of it changes per industry.
          </p>
        </motion.div>
        <div className="mt-12 flex flex-wrap gap-2.5">
          {INDUSTRIES.filter((i) => i.id !== "custom").map((ind, i) => (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.03 * i, ease }}
            >
              <Link
                href={`/studio/generator?template=${ind.id}`}
                className="group flex cursor-pointer items-center gap-2.5 rounded-full border border-hairline bg-white/[0.02] px-4 py-2.5 transition-all duration-200 hover:border-accent/40 hover:bg-accent-dim"
              >
                <span className="text-[13px] font-medium text-white/70 transition-colors group-hover:text-white">
                  {ind.name}
                </span>
                <span className="font-mono text-[10px] text-white/25 transition-colors group-hover:text-accent/70">
                  {ind.blurb.toLowerCase()}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- Act 5: ownership & freedom — editorial, matte ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease }}
          className="border-t border-hairline-strong pt-12"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">
            Ownership &amp; freedom
          </p>
          <h2 className="mt-5 max-w-3xl text-4xl leading-[1.04] tracking-tight text-white md:text-6xl">
            <span className="font-display font-semibold">You own everything.</span>
          </h2>
          <p className="mt-4 max-w-xl font-editorial text-xl font-light italic text-white/60 md:text-2xl">
            VertexOS helps you build websites. The website belongs to you.
          </p>
        </motion.div>

        {/* Ruled card row — matte, no glass */}
        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {OWNERSHIP_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.06 * i, ease }}
              className="border-t border-hairline pt-6"
            >
              <card.icon className="h-4 w-4 text-accent/70" strokeWidth={1.75} />
              <h3 className="mt-4 text-[15px] font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/45">{card.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Editorial copy block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="mt-20 grid gap-12 border-t border-hairline pt-12 lg:grid-cols-[1.1fr_1fr]"
        >
          <div className="max-w-md space-y-5 text-[15px] leading-relaxed text-white/55">
            <p>
              Unlike many website builders, VertexOS does not lock your project into a
              platform.
            </p>
            <p>
              Generate your website, edit it, export the code, and deploy it wherever
              you want.
            </p>
            <p className="text-white/80">
              VertexOS is a tool, <span className="font-editorial italic">not a platform lock-in.</span>
            </p>
          </div>
          <div className="space-y-0">
            {[
              "Your generated website",
              "Your content",
              "Your exported code",
            ].map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 * i, ease }}
                className="flex items-baseline justify-between gap-4 border-t border-hairline py-5 first:border-t-0"
              >
                <span className="text-lg tracking-tight text-white md:text-2xl">
                  <span className="font-display font-semibold">{line}</span>
                </span>
                <span className="shrink-0 font-editorial text-lg font-light italic text-accent/80 md:text-xl">
                  belongs to you.
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---- Act 6: FAQ — editorial ruled list ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease }}
          className="grid gap-10 lg:grid-cols-[320px_1fr]"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/30">
              Questions
            </p>
            <h2 className="mt-5 font-editorial text-3xl font-light italic text-white md:text-4xl">
              Asked before downloading.
            </h2>
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-white/40">
              Short answers, no fine print. If something&apos;s missing, open an issue —
              the project is built in public.
            </p>
          </div>

          <div>
            {FAQ.map((item, i) => (
              <motion.details
                key={item.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.03 * i, ease }}
                className="group border-t border-hairline last:border-b"
              >
                <summary className="flex cursor-pointer list-none items-baseline gap-5 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-[11px] text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[15px] font-medium text-white/80 transition-colors group-hover:text-white group-open:text-white">
                    {item.q}
                  </span>
                  <Plus
                    className="h-3.5 w-3.5 shrink-0 self-center text-white/30 transition-transform duration-200 group-open:rotate-45 group-open:text-accent"
                    strokeWidth={2}
                  />
                </summary>
                <p className="max-w-xl pb-6 pl-[42px] text-[14px] leading-relaxed text-white/50">
                  {item.a}
                </p>
              </motion.details>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---- Closing ---- */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="glass-float reflect light-sweep relative overflow-hidden rounded-3xl px-8 py-16 text-center md:py-24"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(255,255,255,0.05), transparent 70%)",
            }}
          />
          <h2 className="mx-auto max-w-2xl text-3xl leading-tight tracking-tight text-white md:text-5xl">
            <span className="font-display font-semibold">The studio is open.</span>{" "}
            <span className="font-editorial font-light italic text-white/80">
              Bring a business.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[14px] leading-relaxed text-white/40">
            Local-first, open source, bring-your-own-model. Your brief and your keys never
            leave the browser.
          </p>
          <div className="mt-9">
            <PremiumButton size="lg" asChild>
              <Link href="/studio/generator">
                Start the discovery <ArrowRight className="h-4 w-4" />
              </Link>
            </PremiumButton>
          </div>
        </motion.div>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 px-2 text-[12px] text-white/25">
          <Wordmark />
          <div className="flex items-center gap-6">
            <Link href="/studio" className="cursor-pointer transition-colors hover:text-white/60">
              Studio
            </Link>
            <Link href="/templates" className="cursor-pointer transition-colors hover:text-white/60">
              Demo sites
            </Link>
            <Link href="/studio/settings" className="cursor-pointer transition-colors hover:text-white/60">
              Providers
            </Link>
          </div>
        </footer>
      </section>
    </main>
  );
}
