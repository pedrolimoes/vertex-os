import { Check, Clock, MapPin, Phone } from "lucide-react";
import type { DemoSite } from "@/lib/demo-sites";
import { GlassCard, SectionEyebrow } from "./glass-card";

/**
 * Closing quote/contact section: pitch + proof on the left, a request form
 * on the right. The form is presentational — demo sites don't submit.
 */
export function QuoteCTA({ site }: { site: DemoSite }) {
  const { quote, business } = site;
  const tel = `tel:${business.phone.replace(/\D/g, "")}`;
  return (
    <section id="quote" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <GlassCard strong className="overflow-hidden rounded-3xl">
        <div className="grid lg:grid-cols-[1fr_1.05fr]">
          {/* Pitch */}
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <SectionEyebrow>Free quote</SectionEyebrow>
            <h2 className="lgx-display mt-3 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
              {quote.heading}
            </h2>
            <p className="lgx-muted mt-4 text-[15px] leading-relaxed">{quote.sub}</p>

            <ul className="mt-7 space-y-3">
              {quote.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px]">
                  <Check className="lgx-accent mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>

            <div className="lgx-muted mt-9 space-y-2.5 border-t lgx-hairline pt-6 text-[13.5px]">
              <a href={tel} className="flex items-center gap-3 font-semibold transition-colors hover:text-[color:var(--lgx-text)]">
                <Phone className="lgx-accent h-4 w-4" /> {business.phone}
              </a>
              <p className="flex items-center gap-3">
                <MapPin className="lgx-accent h-4 w-4" /> Serving {business.region}
              </p>
              <p className="flex items-center gap-3">
                <Clock className="lgx-accent h-4 w-4" /> {business.hours}
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            className="space-y-4 border-t lgx-hairline p-8 sm:p-10 lg:border-l lg:border-t-0"
            style={{ background: "var(--lgx-glass-bg)" }}
            aria-label="Request a quote"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="lgx-muted mb-1.5 block text-[12.5px] font-medium">
                  Name
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="lgx-input w-full rounded-xl px-3.5 py-2.5 text-[14px]"
                />
              </label>
              <label className="block">
                <span className="lgx-muted mb-1.5 block text-[12.5px] font-medium">
                  Phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(555) 555-0123"
                  className="lgx-input w-full rounded-xl px-3.5 py-2.5 text-[14px]"
                />
              </label>
            </div>
            <label className="block">
              <span className="lgx-muted mb-1.5 block text-[12.5px] font-medium">
                What do you need?
              </span>
              <select
                name="service"
                defaultValue=""
                className="lgx-input w-full appearance-none rounded-xl px-3.5 py-2.5 text-[14px]"
              >
                <option value="" disabled>
                  Choose a service
                </option>
                {quote.serviceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="lgx-muted mb-1.5 block text-[12.5px] font-medium">
                Details
              </span>
              <textarea
                name="details"
                rows={4}
                placeholder="Tell us about the project — size, timing, anything we should know."
                className="lgx-input w-full resize-none rounded-xl px-3.5 py-2.5 text-[14px]"
              />
            </label>
            <button type="button" className="lgx-btn lgx-btn-primary w-full px-6 py-3.5">
              {site.hero.primaryCta}
            </button>
            <p className="lgx-soft text-center text-[11.5px]">
              No spam, no pressure — we reply once and leave the decision to you.
            </p>
          </form>
        </div>
      </GlassCard>
    </section>
  );
}
