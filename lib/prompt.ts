import type { DesignBrief, DiscoveryBrief, SiteBlueprint } from "./types";
import { DESIGN_SYSTEMS, GOALS, PAGES, getIndustryName } from "./discovery";
import { getIndustryProfile } from "./industry-engine";
import { getDesignDNA } from "./design-dna";
import { buildDesignBrief } from "./design-brief";
import { generateBlueprint } from "./blueprint-generator";

/* ==========================================================================
   Two-phase prompting.

   Phase 1 — DESIGN DIRECTOR: the model receives the discovery brief plus
   the Design DNA profile and produces a DESIGN BRIEF (strategy + rules).
   No website content is generated in this phase.

   Phase 2 — SITE BUILDER: the model receives the approved design brief
   and the industry skeleton, and produces the site blueprint. It MUST
   follow the design brief.
   ========================================================================== */

export const DESIGN_DIRECTOR_PROMPT = `You are an award-winning design director at a top-tier agency. You do NOT generate websites. You produce DESIGN BRIEFS that a separate build team must follow.

You receive a client discovery brief and a Design DNA profile (the structural genome of the chosen design system). Produce the final DESIGN BRIEF as STRICT JSON (no markdown fences, no commentary) matching exactly this TypeScript shape:

{
  "style": string,                       // e.g. "Luxury Black × Auto Detailing"
  "designDNA": string,                   // keep the provided DNA id
  "brandStrategy": { "positioning": string, "audience": string, "voice": string, "pillars": string[] },
  "designLanguage": string,              // prose visual language, 2-3 sentences
  "visualIdentity": { "imagery": string, "iconography": string, "texture": string },
  "layoutRules": string[],               // 4-6 hard rules
  "componentRules": { "navigation": string, "hero": string, "cards": string, "buttons": string, "forms": string },
  "motionRules": { "character": string, "speed": string, "rules": string[] },
  "typographyRules": { "display": string, "body": string, "scale": string, "rules": string[] },
  "colorSystem": { "primary": string, "secondary": string, "accent": string, "background": string, "surface": string, "rules": string[] },  // hex where applicable
  "sectionRequirements": [{ "section": string, "requirement": string }],
  "conversionStrategy": { "primaryCta": string, "strategy": string, "trustPlacement": string }
}

Rules:
- Stay true to the Design DNA — sharpen it for THIS client, don't replace it.
- A Luxury Black brief must read nothing like a Contractor Pro brief. Different layout rules, different motion, different typography, different copy direction.
- Respect every client preference and exclusion from the discovery brief.
- Keep the section list from the industry skeleton (the architecture is industry-specific on purpose).
- Be specific and opinionated. "Clean and modern" is banned. Name sizes, weights, behaviors.
- Output ONLY the JSON object.`;

export const SYSTEM_PROMPT = `You are the senior builder at a top-tier web design agency. A design director has already produced a DESIGN BRIEF for this client. Your job is to produce the final SITE BLUEPRINT as STRICT JSON (no markdown fences, no commentary) — and it MUST follow the design brief: its voice, its copy direction, its conversion strategy, its section requirements.

The blueprint must match exactly this TypeScript shape:

{
  "brand": {
    "positioning": string,            // one-sentence market position
    "valueProposition": string,
    "audience": string,
    "voice": string,                  // how the copy should sound, and why
    "messagingPillars": string[],     // exactly 3
    "differentiators": string[]       // 2-4, drawn from the brief
  },
  "design": {
    "direction": string,              // art direction rationale, 1-2 sentences
    "typography": string,
    "palette": { "primary": string, "secondary": string, "accent": string, "background": string },  // hex
    "motion": string,
    "imagery": string
  },
  "structure": { "pages": [{ "id": string, "title": string, "purpose": string, "sections": string[] }] },
  "homepage": [
    {
      "type": string,                 // MUST be one of the section types in the skeleton
      "eyebrow"?: string,
      "title"?: string,
      "body"?: string,
      "items"?: [{ "title": string, "body": string, "meta"?: string }],
      "stats"?: [{ "value": string, "label": string }],
      "cta"?: { "label": string, "secondary"?: string },
      "rationale"?: string            // why this section exists for THIS business
    }
  ],
  "ctaStrategy": { "primary": string, "secondary": string, "strategy": string, "placements": string[] },
  "seo": { "title": string, "description": string, "keywords": string[], "localPages": string[], "strategy": string },
  "trust": string[]
}

Rules:
- KEEP the skeleton's homepage section order and section types — that architecture is industry-specific on purpose. Rewrite the copy inside each section to be sharper, more specific, and true to the brief.
- Copy must read like a senior copywriter wrote it for this exact business. Use the client's own words from the brief (differentiators, three words, emotions, guarantees, offers) wherever they're strong.
- NO generic phrases: never "we are committed to excellence", "look no further", "your one-stop shop", or similar filler.
- Respect "things to avoid" from the brief absolutely.
- Match the requested brand personality and tone in every line.
- Different industries must NOT sound alike. An epoxy company talks about prep and PSI; a roofer talks storms and insurance; a detailer talks paint depth and gloss.
- SEO title under 60 chars, description under 160 chars.
- Section "items" counts: keep within ±1 of the skeleton's counts.
- Output ONLY the JSON object.`;

function line(label: string, value: string | undefined | boolean): string | null {
  if (typeof value === "boolean") return `${label}: ${value ? "Yes" : "No"}`;
  const v = value?.trim();
  return v ? `${label}: ${v}` : null;
}

/** Serialize the discovery brief — shared by both phases. */
function serializeDiscovery(brief: DiscoveryBrief): string {
  const b = brief.business;
  const goals = brief.goals
    .map((g) => GOALS.find((x) => x.id === g)?.name)
    .filter(Boolean)
    .join(", ");
  const pages = brief.pages
    .map((p) => PAGES.find((x) => x.id === p)?.name)
    .filter(Boolean)
    .join(", ");
  const systems = brief.designSystems
    .map((d) => DESIGN_SYSTEMS.find((x) => x.id === d)?.name)
    .filter(Boolean)
    .join(", ");

  const parts = [
    "=== CLIENT DISCOVERY BRIEF ===",
    "",
    "--- Business ---",
    line("Business name", b.businessName),
    line("Industry", getIndustryName(brief)),
    line("Location", [b.city, b.state, b.country].filter(Boolean).join(", ")),
    line("Service area", b.serviceArea),
    line("Years in business", b.yearsInBusiness),
    line("Team size", b.teamSize),
    line("Description", b.description),
    line("Primary service", b.primaryService),
    line("Secondary services", b.secondaryServices.join(", ")),
    line("Emergency services", b.emergencyServices),
    line("Commercial services", b.commercialServices),
    line("Residential services", b.residentialServices),
    "",
    "--- Brand personality ---",
    line("Tone", brief.brand.tone),
    line("Personality", [...brief.brand.personalities, brief.brand.customPersonality].filter(Boolean).join(", ")),
    line("Emotions customers should feel", brief.brand.emotions),
    line("Three words for the business", brief.brand.threeWords),
    line("What makes them different", brief.brand.differentiator),
    line("Why customers should choose them", brief.brand.whyChooseUs),
    "",
    "--- Design ---",
    line("Selected design systems", systems),
    line("Colors", `primary ${brief.visual.primaryColor}, secondary ${brief.visual.secondaryColor}, accent ${brief.visual.accentColor}`),
    line("Background style", brief.visual.backgroundStyle),
    line("Button style", brief.visual.buttonStyle),
    line("Card style", brief.visual.cardStyle),
    line("Animation preference", brief.visual.animations),
    line("Has logo", Boolean(brief.visual.logoDataUrl || brief.visual.logoName)),
    "",
    "--- Competitors ---",
    line("Competitor 1", brief.competitors.competitor1),
    line("Competitor 2", brief.competitors.competitor2),
    line("Competitor 3", brief.competitors.competitor3),
    line("What they like about competitors", brief.competitors.likes),
    line("What they dislike", brief.competitors.dislikes),
    "",
    "--- Goals ---",
    line("Primary goals", goals),
    "",
    "--- Content inventory ---",
    line("Has existing content", brief.content.hasContent),
    line("Needs AI-generated content", brief.content.needsAiContent),
    line("Has testimonials", brief.content.hasTestimonials),
    line("Has reviews", brief.content.hasReviews),
    line("Has project photos", brief.content.hasProjectPhotos),
    line("Has before/after photos", brief.content.hasBeforeAfter),
    line("Has certifications", brief.content.hasCertifications),
    "",
    "--- Local SEO ---",
    line("Target city", brief.seo.targetCity),
    line("Additional cities", brief.seo.additionalCities),
    line("Keywords", brief.seo.keywords),
    line("Services to rank for", brief.seo.servicesToRank),
    "",
    "--- Site structure ---",
    line("Selected pages", pages),
    line("Custom page", brief.customPage),
    "",
    "--- Advanced ---",
    line("Additional instructions", brief.advanced.additionalInstructions),
    line("Things to avoid", brief.advanced.thingsToAvoid),
    line("Unique selling points", brief.advanced.uniqueSellingPoints),
    line("Special offers", brief.advanced.specialOffers),
    line("Guarantees", brief.advanced.guarantees),
    line("Financing options", brief.advanced.financingOptions),
  ];

  return parts.filter((p) => p !== null).join("\n");
}

/** Phase 1 user prompt — design director input. */
export function buildDesignDirectorPrompt(brief: DiscoveryBrief): string {
  const profile = getIndustryProfile(brief.business.industry, brief.business.customIndustry);
  const dna = getDesignDNA(brief.designSystems[0] ?? profile.suggestedSystems[0]);
  const skeleton = buildDesignBrief(brief);

  return [
    serializeDiscovery(brief),
    "",
    "=== DESIGN DNA PROFILE (the genome — sharpen, don't replace) ===",
    JSON.stringify(dna, null, 1),
    "",
    "=== INDUSTRY ENGINE NOTES ===",
    `Buyer psychology: ${profile.buyerPsychology}`,
    `Positioning angle: ${profile.positioningAngle}`,
    `Homepage architecture: ${profile.sectionOrder.join(" → ")}`,
    "",
    "=== ENGINE DESIGN BRIEF (your starting point — elevate it) ===",
    JSON.stringify(skeleton, null, 1),
  ].join("\n");
}

/** Phase 2 user prompt — builder input. MUST follow the design brief. */
export function buildUserPrompt(brief: DiscoveryBrief, designBrief?: DesignBrief): string {
  const profile = getIndustryProfile(brief.business.industry, brief.business.customIndustry);
  const finalDesignBrief = designBrief ?? buildDesignBrief(brief);
  const skeleton = generateBlueprint(brief, finalDesignBrief);

  return [
    serializeDiscovery(brief),
    "",
    "=== APPROVED DESIGN BRIEF (you MUST follow this) ===",
    JSON.stringify(finalDesignBrief, null, 1),
    "",
    "=== INDUSTRY ENGINE NOTES ===",
    `Buyer psychology: ${profile.buyerPsychology}`,
    `Positioning angle: ${profile.positioningAngle}`,
    `Voice notes: ${profile.voiceNotes}`,
    "",
    "=== STRUCTURAL SKELETON (keep architecture, elevate copy) ===",
    JSON.stringify(skeleton, null, 1),
  ].join("\n");
}

/** Pull a JSON object out of a model response that may include fences/preamble. */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("No JSON object found in model response");
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

/**
 * Land an AI response safely on the engine skeleton: any missing or
 * malformed top-level field falls back to the deterministic blueprint,
 * so a half-good model response never breaks the canvas.
 */
export function mergeWithSkeleton(
  ai: Partial<SiteBlueprint> | null | undefined,
  brief: DiscoveryBrief,
  designBrief?: DesignBrief,
): SiteBlueprint {
  const skeleton = generateBlueprint(brief, designBrief);
  if (!ai || typeof ai !== "object") return skeleton;
  return {
    brand:
      ai.brand && typeof ai.brand.positioning === "string" ? { ...skeleton.brand, ...ai.brand } : skeleton.brand,
    design:
      ai.design && ai.design.palette ? { ...skeleton.design, ...ai.design } : skeleton.design,
    structure:
      ai.structure && Array.isArray(ai.structure.pages) && ai.structure.pages.length
        ? ai.structure
        : skeleton.structure,
    homepage:
      Array.isArray(ai.homepage) && ai.homepage.length >= 3 ? ai.homepage : skeleton.homepage,
    ctaStrategy:
      ai.ctaStrategy && typeof ai.ctaStrategy.primary === "string"
        ? { ...skeleton.ctaStrategy, ...ai.ctaStrategy }
        : skeleton.ctaStrategy,
    seo: ai.seo && typeof ai.seo.title === "string" ? { ...skeleton.seo, ...ai.seo } : skeleton.seo,
    trust: Array.isArray(ai.trust) && ai.trust.length ? ai.trust : skeleton.trust,
  };
}

/**
 * Land a Phase 1 model response on the engine's design brief: any missing
 * or malformed field falls back to the deterministic version, so the
 * builder phase always receives a complete, valid brief.
 */
export function mergeDesignBrief(
  ai: Partial<DesignBrief> | null | undefined,
  brief: DiscoveryBrief,
): DesignBrief {
  const skeleton = buildDesignBrief(brief);
  if (!ai || typeof ai !== "object") return skeleton;
  return {
    style: typeof ai.style === "string" && ai.style ? ai.style : skeleton.style,
    designDNA: skeleton.designDNA, // the DNA id is not the model's to change
    brandStrategy:
      ai.brandStrategy && typeof ai.brandStrategy.positioning === "string"
        ? { ...skeleton.brandStrategy, ...ai.brandStrategy }
        : skeleton.brandStrategy,
    designLanguage:
      typeof ai.designLanguage === "string" && ai.designLanguage
        ? ai.designLanguage
        : skeleton.designLanguage,
    visualIdentity: ai.visualIdentity?.imagery
      ? { ...skeleton.visualIdentity, ...ai.visualIdentity }
      : skeleton.visualIdentity,
    layoutRules:
      Array.isArray(ai.layoutRules) && ai.layoutRules.length
        ? ai.layoutRules
        : skeleton.layoutRules,
    componentRules: ai.componentRules?.hero
      ? { ...skeleton.componentRules, ...ai.componentRules }
      : skeleton.componentRules,
    motionRules: ai.motionRules?.character
      ? { ...skeleton.motionRules, ...ai.motionRules }
      : skeleton.motionRules,
    typographyRules: ai.typographyRules?.display
      ? { ...skeleton.typographyRules, ...ai.typographyRules }
      : skeleton.typographyRules,
    colorSystem: ai.colorSystem?.primary
      ? { ...skeleton.colorSystem, ...ai.colorSystem }
      : skeleton.colorSystem,
    sectionRequirements:
      Array.isArray(ai.sectionRequirements) && ai.sectionRequirements.length
        ? ai.sectionRequirements
        : skeleton.sectionRequirements,
    conversionStrategy: ai.conversionStrategy?.primaryCta
      ? { ...skeleton.conversionStrategy, ...ai.conversionStrategy }
      : skeleton.conversionStrategy,
  };
}
