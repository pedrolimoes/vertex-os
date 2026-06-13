import type { DesignBrief, DiscoveryBrief } from "./types";
import { getDesignDNA } from "./design-dna";
import { getIndustryProfile } from "./industry-engine";
import { PERSONALITIES, getIndustryName } from "./discovery";

/* ==========================================================================
   Phase 1 — the design director.
   Before a single section is generated, the studio composes a full design
   brief: brand strategy, design language, visual identity, layout /
   component / motion / typography rules, color system, section
   requirements, and conversion strategy. Phase 2 must follow it.
   ========================================================================== */

export function buildDesignBrief(brief: DiscoveryBrief): DesignBrief {
  const profile = getIndustryProfile(brief.business.industry, brief.business.customIndustry);
  const systemId = brief.designSystems[0] ?? profile.suggestedSystems[0];
  const dna = getDesignDNA(systemId);
  const industryName = getIndustryName(brief);
  const name = brief.business.businessName || profile.name;
  const city = brief.seo.targetCity || brief.business.city || "the local market";

  const personalities = brief.brand.personalities
    .map((id) => PERSONALITIES.find((p) => p.id === id)?.name.toLowerCase())
    .filter(Boolean) as string[];
  if (brief.brand.customPersonality.trim())
    personalities.push(brief.brand.customPersonality.trim().toLowerCase());

  const differentiator =
    brief.brand.differentiator.trim() ||
    brief.advanced.uniqueSellingPoints.trim() ||
    profile.trustElements[0];

  const audienceParts: string[] = [];
  if (brief.business.residentialServices) audienceParts.push("homeowners");
  if (brief.business.commercialServices) audienceParts.push("commercial clients");

  // The brief can veto motion regardless of DNA.
  const wantsMinimalMotion = brief.visual.animations.toLowerCase().includes("minimal");
  const motionRules = wantsMinimalMotion
    ? { character: "Client requested minimal motion — fades only.", speed: "snappy", rules: ["Opacity fades under 300ms", "No transforms, no parallax"] }
    : { character: dna.motionRules.character, speed: dna.motionRules.speed, rules: dna.motionRules.rules };

  const background =
    brief.visual.backgroundStyle.toLowerCase().includes("light") ||
    brief.visual.backgroundStyle.toLowerCase().includes("white")
      ? "#faf9f7"
      : "#0b0c0f";

  return {
    style: `${dna.name} × ${industryName}`,
    designDNA: dna.id,
    brandStrategy: {
      positioning: `${name}: ${profile.positioningAngle.toLowerCase()} — positioned against generic competitors in ${city}.`,
      audience: `${audienceParts.join(" and ") || "customers"} in ${
        brief.business.serviceArea || city
      }. ${profile.buyerPsychology}`,
      voice: `${(personalities.slice(0, 3).join(", ") || "confident, local, proof-driven")}${
        brief.brand.tone ? ` — ${brief.brand.tone.toLowerCase()} tone` : ""
      }. ${profile.voiceNotes}`,
      pillars: [
        profile.positioningAngle,
        differentiator,
        brief.brand.emotions.trim()
          ? `Make customers feel: ${brief.brand.emotions.trim()}`
          : profile.trustElements[1] ?? "Proof over promises",
      ],
    },
    designLanguage: `${dna.essence} ${dna.traits.join(", ")}. Applied to ${industryName.toLowerCase()}: ${profile.positioningAngle.toLowerCase()}. ${dna.copyDirection}`,
    visualIdentity: {
      imagery: brief.content.hasProjectPhotos
        ? `${dna.imagery} — built from the client's real project photography.`
        : `${dna.imagery} — art-directed placeholders with a shot list until real photos exist.`,
      iconography: dna.density === "dense" ? "Functional, geometric, labeled" : "Sparse — typography and numerals over icons",
      texture: dna.id === "modern-industrial" ? "Hatching, grids, measurement marks" : dna.id === "luxury-black" ? "Grain, vignette, deep shadow" : "Clean surfaces, light as texture",
    },
    layoutRules: [
      ...dna.layoutRules,
      `Homepage architecture follows the ${profile.name} buying journey: ${profile.sectionOrder.join(" → ")}`,
    ],
    componentRules: dna.componentRules,
    motionRules,
    typographyRules: dna.typographyRules,
    colorSystem: {
      primary: brief.visual.primaryColor || profile.palette.primary,
      secondary: brief.visual.secondaryColor || profile.palette.secondary,
      accent: brief.visual.accentColor || profile.palette.accent,
      background,
      surface: background === "#0b0c0f" ? "rgba(255,255,255,0.05)" : "#ffffff",
      rules: [
        "One action color, used only for actions",
        "Never decorate with gradients the DNA doesn't call for",
        brief.advanced.thingsToAvoid.trim()
          ? `Client exclusions: ${brief.advanced.thingsToAvoid.trim()}`
          : "No purple-SaaS defaults",
      ],
    },
    sectionRequirements: profile.sectionOrder.map((s) => ({
      section: s,
      requirement: sectionRequirement(s, profile.name, dna.name),
    })),
    conversionStrategy: {
      primaryCta: profile.hero.primaryCta.replace("{name}", name).replace("{city}", city),
      strategy: `Optimized for ${brief.goals.join(", ") || "lead capture"}. ${
        brief.business.emergencyServices
          ? "Emergency path persistent in every viewport. "
          : ""
      }One dominant action per viewport; secondary actions visually quiet.`,
      trustPlacement:
        dna.id === "contractor-pro" || dna.id === "premium-local"
          ? "Trust signals structurally repeated: nav, hero, mid-page, footer."
          : "Trust woven into proof sections; never badge-spam.",
    },
  };
}

function sectionRequirement(section: string, industry: string, dnaName: string): string {
  const map: Record<string, string> = {
    hero: `Lead with the ${industry.toLowerCase()} buying trigger, composed per ${dnaName} hero rules`,
    "emergency-banner": "Urgent path visible without scroll; live-dispatch language",
    "trust-bar": "Immediate legitimacy — license, rating, guarantee in one strip",
    "before-after": "Visual proof with real pairs; interactive reveal",
    "service-grid": "Each service scannable in under 3 seconds; each links to its own page",
    process: "Reduce perceived risk: number the steps, name the standards",
    stats: "Hard numbers only — no vanity metrics",
    insurance: "Explain the claims process in homeowner language",
    financing: "Monthly framing, fast approval, zero pressure",
    packages: "Three tiers, middle anchored as most popular",
    seasonal: "Frame demand year-round, not spring-only",
    "service-area": "Name every target city for local SEO",
    testimonials: "Specific outcomes over star-count praise",
    gallery: "Work as proof — captioned, dated, local",
    certifications: "Verifiable credentials with issuing bodies",
    guarantee: "A concrete promise in writing — no fine print",
    team: "Real people reduce in-home service anxiety",
    faq: "Industry-true objections in the customer's words",
    "final-cta": "Restate the primary goal; single unmissable action",
  };
  return map[section] ?? "Serve the page goal with zero filler";
}
