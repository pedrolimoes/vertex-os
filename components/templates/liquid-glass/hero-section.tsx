import { MapPin, Star } from "lucide-react";
import type { DemoSite } from "@/lib/demo-sites";

/**
 * Spacious hero: eyebrow location pill, display headline with an accent
 * second line, supporting copy, primary + glass CTAs, and a stat row.
 * Background is a single quiet overhead light — no gradient blobs.
 */
export function HeroSection({ site }: { site: DemoSite }) {
  const { hero, business } = site;
  return (
    <section id="top" className="lgx-hero-light relative">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <span className="lgx-chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium">
          <MapPin className="lgx-accent h-3.5 w-3.5" />
          {hero.eyebrow}
        </span>

        <h1 className="lgx-display mt-7 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
          {hero.headline}
          <br />
          <span className="lgx-accent">{hero.headlineAccent}</span>
        </h1>

        <p className="lgx-muted mt-6 max-w-xl text-[16px] leading-relaxed sm:text-[17px]">
          {hero.sub}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a href="#quote" className="lgx-btn lgx-btn-primary px-7 py-3.5">
            {hero.primaryCta}
          </a>
          <a href="#work" className="lgx-btn lgx-btn-ghost px-7 py-3.5">
            {hero.secondaryCta}
          </a>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[13px]">
          <span className="flex gap-0.5" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="lgx-accent h-3.5 w-3.5 fill-current" />
            ))}
          </span>
          <span className="lgx-muted">
            {business.rating} · {business.reviewCount} reviews ·{" "}
            {business.yearsInBusiness} years in {business.city}
          </span>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-3 divide-x [&>div]:px-5 first:[&>div]:pl-0"
          style={{ borderColor: "var(--lgx-glass-border)" }}
        >
          {hero.stats.map((s) => (
            <div key={s.label} style={{ borderColor: "var(--lgx-glass-border)" }}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="lgx-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {s.value}
              </dd>
              <dd className="lgx-soft mt-1 text-[12px] leading-snug">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
