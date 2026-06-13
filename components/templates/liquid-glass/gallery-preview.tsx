import type { DemoSite, DemoGalleryItem } from "@/lib/demo-sites";
import { GlassCard, SectionHeader } from "./glass-card";

/**
 * Photo-slot artwork. Until real project photos are dropped in, each slot is
 * a deliberate placeholder: a material-toned surface with a directional
 * sheen — framed and captioned like a portfolio, not a wireframe.
 */
function PlaceholderSurface({
  angle,
  dim = false,
}: {
  angle: number;
  dim?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: [
          `linear-gradient(${angle}deg, var(--lgx-accent-dim) 0%, transparent 55%)`,
          `linear-gradient(${angle + 140}deg, var(--lgx-hero-tint) 10%, transparent 70%)`,
          `repeating-linear-gradient(${angle - 18}deg, transparent 0px, transparent 14px, var(--lgx-glass-bg) 14px, var(--lgx-glass-bg) 15px)`,
          "var(--lgx-bg-alt)",
        ].join(", "),
        filter: dim ? "brightness(0.62) saturate(0.45)" : undefined,
      }}
    />
  );
}

function FrameLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="lgx-chip absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
      {children}
    </span>
  );
}

function GalleryFrame({ item, index }: { item: DemoGalleryItem; index: number }) {
  const angle = 115 + index * 37;
  return (
    <GlassCard className="overflow-hidden p-2">
      <figure>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          {item.kind === "before-after" ? (
            <div className="absolute inset-0 grid grid-cols-2">
              <div className="relative overflow-hidden">
                <PlaceholderSurface angle={angle} dim />
                <FrameLabel>Before</FrameLabel>
              </div>
              <div
                className="relative overflow-hidden border-l"
                style={{ borderColor: "var(--lgx-accent)" }}
              >
                <PlaceholderSurface angle={angle + 10} />
                <FrameLabel>After</FrameLabel>
              </div>
            </div>
          ) : (
            <>
              <PlaceholderSurface angle={angle} />
              <FrameLabel>Project</FrameLabel>
            </>
          )}
        </div>
        <figcaption className="flex items-baseline justify-between gap-3 px-2.5 pb-1.5 pt-3">
          <span className="text-[13.5px] font-medium leading-snug">{item.title}</span>
          <span className="lgx-soft shrink-0 text-[11.5px]">{item.tag}</span>
        </figcaption>
      </figure>
    </GlassCard>
  );
}

/** Before/after and project gallery, three across on desktop. */
export function GalleryPreview({ site }: { site: DemoSite }) {
  return (
    <section
      id="work"
      className="border-y lgx-hairline"
      style={{ background: "var(--lgx-bg-alt)" }}
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeader
          eyebrow="Recent work"
          heading={site.gallery.heading}
          sub={site.gallery.sub}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.gallery.items.map((item, i) => (
            <GalleryFrame key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
