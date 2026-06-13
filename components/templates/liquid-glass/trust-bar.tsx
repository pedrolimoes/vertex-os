import { BadgeCheck } from "lucide-react";
import type { DemoSite } from "@/lib/demo-sites";

/** Slim credibility strip between hero and services. */
export function TrustBar({ site }: { site: DemoSite }) {
  return (
    <section
      aria-label="Credentials"
      className="border-y lgx-hairline"
      style={{ background: "var(--lgx-bg-alt)" }}
    >
      <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-9 gap-y-3 px-5 py-5 sm:px-8">
        {site.trustBar.map((item) => (
          <li
            key={item}
            className="lgx-muted flex items-center gap-2 text-[13px] font-medium"
          >
            <BadgeCheck className="lgx-accent h-4 w-4 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
