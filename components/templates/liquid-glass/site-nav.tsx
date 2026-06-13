import { Phone } from "lucide-react";
import type { DemoSite } from "@/lib/demo-sites";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

/** Sticky frosted navigation bar for a demo business site. */
export function SiteNav({ site }: { site: DemoSite }) {
  const tel = `tel:${site.business.phone.replace(/\D/g, "")}`;
  return (
    <header className="sticky top-0 z-40 border-b lgx-hairline backdrop-blur-2xl"
      style={{ background: "color-mix(in srgb, var(--lgx-bg) 78%, transparent)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <span
            className="lgx-display grid h-8 w-8 place-items-center rounded-lg text-[13px] font-bold"
            style={{
              background: "var(--lgx-accent)",
              color: "var(--lgx-accent-ink)",
            }}
          >
            {site.business.short.charAt(0)}
          </span>
          <span className="lgx-display text-[15px] font-semibold tracking-tight">
            {site.business.short}
            <span className="lgx-soft ml-1.5 hidden text-[11px] font-medium uppercase tracking-[0.14em] sm:inline">
              {site.industry}
            </span>
          </span>
        </a>

        <nav className="lgx-muted hidden items-center gap-7 text-[13.5px] font-medium md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition-colors hover:text-[color:var(--lgx-text)]"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={tel}
            className="lgx-btn lgx-btn-ghost hidden px-4 py-2 text-[13.5px] lg:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" />
            {site.business.phone}
          </a>
          <a href="#quote" className="lgx-btn lgx-btn-primary px-4 py-2 text-[13.5px]">
            Get a quote
          </a>
        </div>
      </div>
    </header>
  );
}
