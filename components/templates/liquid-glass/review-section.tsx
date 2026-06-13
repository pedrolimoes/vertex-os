import { Star } from "lucide-react";
import type { DemoSite } from "@/lib/demo-sites";
import { GlassCard, SectionHeader } from "./glass-card";

function Stars() {
  return (
    <span className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="lgx-accent h-4 w-4 fill-current" aria-hidden />
      ))}
    </span>
  );
}

/** Customer reviews with an aggregate-rating chip. */
export function ReviewSection({ site }: { site: DemoSite }) {
  const { reviews, business } = site;
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          eyebrow="Reviews"
          heading={reviews.heading}
          sub={reviews.sub}
        />
        <span className="lgx-chip flex items-center gap-2.5 rounded-full px-4 py-2">
          <Stars />
          <span className="text-[13px] font-semibold">
            {business.rating} · {business.reviewCount} reviews
          </span>
        </span>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {reviews.items.map((r) => (
          <GlassCard key={r.name} className="flex flex-col p-6">
            <Stars />
            <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <footer className="lgx-soft mt-5 text-[13px]">
              <span className="lgx-muted font-semibold">{r.name}</span> · {r.location}
            </footer>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
