import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { DEMO_SITES } from "@/lib/demo-sites";
import { SITE_STYLES } from "@/lib/templates";
import { DemoWebsiteFrame } from "@/components/templates/liquid-glass";
import { StudioBackdrop, Eyebrow } from "@/components/glass";

export const metadata: Metadata = {
  title: "Demo websites — VertexSite Studio",
  description:
    "Live demo websites for seven local-business industries, rendered in the Liquid Glass design system.",
};

function domainFor(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 28) + ".com";
}

export default function TemplatesGalleryPage() {
  const liquidGlass = SITE_STYLES.find((s) => s.id === "liquid-glass");
  const upcoming = SITE_STYLES.filter((s) => s.id !== "liquid-glass");

  return (
    <main className="relative min-h-screen">
      <StudioBackdrop />

      <div className="mx-auto max-w-5xl px-6 pb-20 pt-10">
        <Link
          href="/studio/templates"
          className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] text-white/35 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-3 w-3" /> studio / templates
        </Link>

        <header className="mt-6">
          <Eyebrow>Demo websites</Eyebrow>
          <h1 className="mt-2 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl">
            Seven industries, rendered live in {liquidGlass?.name ?? "Liquid Glass"}.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/50">
            These aren&apos;t screenshots — each frame embeds the actual demo
            website: hand-written local-business copy, frosted-glass design
            system, full mobile responsiveness. Open any of them in a new tab.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent-dim px-3 py-1 font-mono text-[11px] text-accent">
              {liquidGlass?.name} · live
            </span>
            {upcoming.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center rounded-full border border-hairline bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/30"
              >
                {s.name} · in design
              </span>
            ))}
          </div>
        </header>

        <div className="mt-10 space-y-10">
          {DEMO_SITES.map((site) => (
            <section key={site.slug}>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-sm font-semibold tracking-tight text-white">
                    {site.business.name}
                  </h2>
                  <p className="font-mono text-[11px] text-white/35">
                    {site.industry.toLowerCase()} · {site.business.city.toLowerCase()},{" "}
                    {site.business.state.toLowerCase()} ·{" "}
                    {site.mode === "dark" ? "dark glass" : "soft-light glass"}
                  </p>
                </div>
                <Link
                  href={`/templates/liquid-glass/${site.slug}`}
                  target="_blank"
                  className="flex shrink-0 cursor-pointer items-center gap-1 font-mono text-[11px] text-white/35 transition-colors hover:text-accent"
                >
                  full site <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <DemoWebsiteFrame
                href={`/templates/liquid-glass/${site.slug}`}
                url={domainFor(site.business.name)}
                title={`${site.business.name} demo website`}
                height={520}
              />
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
