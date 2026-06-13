import type { DemoSite } from "@/lib/demo-sites";

/** Business-site footer with credentials and service area. */
export function SiteFooter({ site }: { site: DemoSite }) {
  const { business } = site;
  return (
    <footer className="border-t lgx-hairline" style={{ background: "var(--lgx-bg-alt)" }}>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <p className="lgx-display text-[15px] font-semibold tracking-tight">
              {business.name}
            </p>
            <p className="lgx-soft mt-1 max-w-xs text-[13px] leading-relaxed">
              {business.tagline} · Serving {business.region}
            </p>
          </div>
          <div className="lgx-soft space-y-1 text-[13px] sm:text-right">
            <p>{business.credential}</p>
            <p>{business.hours}</p>
            <p className="lgx-muted font-semibold">{business.phone}</p>
          </div>
        </div>
        <div className="lgx-soft mt-8 flex flex-col justify-between gap-2 border-t lgx-hairline pt-5 text-[12px] sm:flex-row">
          <span>
            © {new Date().getFullYear()} {business.name} · {business.city},{" "}
            {business.state}
          </span>
          <span>Demo website crafted in VertexSite Studio</span>
        </div>
      </div>
    </footer>
  );
}
