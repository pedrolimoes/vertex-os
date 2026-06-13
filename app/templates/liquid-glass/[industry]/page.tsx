import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_SITES, demoThemeVars, getDemoSite } from "@/lib/demo-sites";
import {
  FAQSection,
  GalleryPreview,
  HeroSection,
  QuoteCTA,
  ReviewSection,
  ServiceGrid,
  SiteFooter,
  SiteNav,
  TrustBar,
} from "@/components/templates/liquid-glass";

interface Params {
  industry: string;
}

export function generateStaticParams(): Params[] {
  return DEMO_SITES.map((s) => ({ industry: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { industry } = await params;
  const site = getDemoSite(industry);
  if (!site) return {};
  return {
    title: `${site.business.name} — ${site.industry} in ${site.business.city}, ${site.business.state}`,
    description: site.hero.sub,
  };
}

export default async function LiquidGlassDemoPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { industry } = await params;
  const site = getDemoSite(industry);
  if (!site) notFound();

  return (
    <div
      className="lgx min-h-screen"
      style={demoThemeVars(site) as React.CSSProperties}
    >
      <SiteNav site={site} />
      <main>
        <HeroSection site={site} />
        <TrustBar site={site} />
        <ServiceGrid site={site} />
        <GalleryPreview site={site} />
        <ReviewSection site={site} />
        <FAQSection site={site} />
        <QuoteCTA site={site} />
      </main>
      <SiteFooter site={site} />
    </div>
  );
}
