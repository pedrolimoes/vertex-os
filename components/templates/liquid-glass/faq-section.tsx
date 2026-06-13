import { Plus } from "lucide-react";
import type { DemoSite } from "@/lib/demo-sites";
import { SectionHeader } from "./glass-card";

/** Accordion FAQ on frosted rows — native details/summary, no JS. */
export function FAQSection({ site }: { site: DemoSite }) {
  return (
    <section
      id="faq"
      className="border-y lgx-hairline"
      style={{ background: "var(--lgx-bg-alt)" }}
    >
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeader eyebrow="FAQ" heading={site.faq.heading} align="center" />
        <div className="mt-10 space-y-3">
          {site.faq.items.map((f) => (
            <details key={f.q} className="lgx-card group rounded-2xl px-6 py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  className="lgx-soft h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="lgx-muted -mt-1 pb-5 text-[14px] leading-relaxed">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
