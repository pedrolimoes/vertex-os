import type {
  DesignSystemId,
  DiscoveryBrief,
  GoalId,
  IndustryId,
  PageId,
  PersonalityId,
} from "./types";

/* ==========================================================================
   Option catalogs for the discovery flow. Pure data — no React.
   ========================================================================== */

export interface IndustryOption {
  id: IndustryId;
  name: string;
  blurb: string;
}

export const INDUSTRIES: IndustryOption[] = [
  { id: "epoxy-flooring", name: "Epoxy Flooring", blurb: "Garage & commercial coatings" },
  { id: "roofing", name: "Roofing", blurb: "Replacement, repair, storm response" },
  { id: "hvac", name: "HVAC", blurb: "Heating, cooling, air quality" },
  { id: "plumbing", name: "Plumbing", blurb: "Repair, repipe, water heaters" },
  { id: "electrical", name: "Electrical", blurb: "Panels, wiring, EV chargers" },
  { id: "landscaping", name: "Landscaping", blurb: "Design-build & maintenance" },
  { id: "pressure-washing", name: "Pressure Washing", blurb: "Exterior cleaning & soft wash" },
  { id: "cleaning", name: "Cleaning", blurb: "Residential & commercial cleaning" },
  { id: "auto-detailing", name: "Auto Detailing", blurb: "Ceramic, correction, interiors" },
  { id: "painting", name: "Painting", blurb: "Interior & exterior painting" },
  { id: "fencing", name: "Fencing", blurb: "Wood, vinyl, ornamental iron" },
  { id: "remodeling", name: "Remodeling", blurb: "Kitchens, baths, additions" },
  { id: "concrete", name: "Concrete", blurb: "Driveways, patios, foundations" },
  { id: "pest-control", name: "Pest Control", blurb: "Inspection, treatment, prevention" },
  { id: "garage-doors", name: "Garage Doors", blurb: "Install, repair, openers" },
  { id: "custom", name: "Other / Custom", blurb: "Tell us what you do" },
];

export function getIndustryName(brief: DiscoveryBrief): string {
  if (brief.business.industry === "custom" && brief.business.customIndustry.trim()) {
    return brief.business.customIndustry.trim();
  }
  return (
    INDUSTRIES.find((i) => i.id === brief.business.industry)?.name ?? "Local Business"
  );
}

export interface PersonalityOption {
  id: PersonalityId;
  name: string;
  blurb: string;
}

export const PERSONALITIES: PersonalityOption[] = [
  { id: "premium", name: "Premium", blurb: "Refined, confident, worth more" },
  { id: "luxury", name: "Luxury", blurb: "Exclusive, indulgent, rare" },
  { id: "friendly", name: "Friendly", blurb: "Warm, neighborly, approachable" },
  { id: "professional", name: "Professional", blurb: "Polished, precise, dependable" },
  { id: "contractor", name: "Contractor", blurb: "Direct, hard-working, no fluff" },
  { id: "modern", name: "Modern", blurb: "Clean, current, considered" },
  { id: "minimal", name: "Minimal", blurb: "Quiet, restrained, essential" },
  { id: "innovative", name: "Innovative", blurb: "Forward, inventive, sharp" },
  { id: "trustworthy", name: "Trustworthy", blurb: "Honest, steady, proven" },
  { id: "bold", name: "Bold", blurb: "Loud, certain, unmissable" },
  { id: "corporate", name: "Corporate", blurb: "Established, structured, serious" },
  { id: "futuristic", name: "Futuristic", blurb: "Technical, ahead of the curve" },
];

export interface DesignSystemOption {
  id: DesignSystemId;
  name: string;
  blurb: string;
  /** Tiny swatch hint for the picker. */
  swatch: { bg: string; fg: string; accent: string };
}

export const DESIGN_SYSTEMS: DesignSystemOption[] = [
  {
    id: "liquid-glass",
    name: "Liquid Glass",
    blurb: "Translucent layers, depth, real blur",
    swatch: { bg: "#0b0e17", fg: "#ffffff", accent: "#7dd3fc" },
  },
  {
    id: "vision-pro",
    name: "Apple Vision Pro",
    blurb: "Spatial glass, soft light, floating UI",
    swatch: { bg: "#101014", fg: "#f5f5f7", accent: "#e8e8ed" },
  },
  {
    id: "linear",
    name: "Linear",
    blurb: "Precise, dark, engineered calm",
    swatch: { bg: "#08090a", fg: "#f7f8f8", accent: "#5e6ad2" },
  },
  {
    id: "raycast",
    name: "Raycast",
    blurb: "Compact, keyboard-fast, glowing edges",
    swatch: { bg: "#0a0a0a", fg: "#ffffff", accent: "#ff6363" },
  },
  {
    id: "arc-browser",
    name: "Arc Browser",
    blurb: "Playful gradients, soft shapes",
    swatch: { bg: "#1c1730", fg: "#ffffff", accent: "#ff536a" },
  },
  {
    id: "vercel",
    name: "Vercel",
    blurb: "Black and white, typographic, exact",
    swatch: { bg: "#000000", fg: "#ffffff", accent: "#ffffff" },
  },
  {
    id: "framer",
    name: "Framer",
    blurb: "Motion-first, dramatic type",
    swatch: { bg: "#05050a", fg: "#ffffff", accent: "#66e3ff" },
  },
  {
    id: "notion",
    name: "Notion",
    blurb: "Warm paper, calm reading rhythm",
    swatch: { bg: "#ffffff", fg: "#191919", accent: "#d97757" },
  },
  {
    id: "luxury-black",
    name: "Luxury Black",
    blurb: "Serif headlines, gold on black",
    swatch: { bg: "#0d0c0a", fg: "#f2ede4", accent: "#c9a96a" },
  },
  {
    id: "contractor-pro",
    name: "Contractor Pro",
    blurb: "Heavy type, big CTAs, job-site direct",
    swatch: { bg: "#101418", fg: "#ffffff", accent: "#f5a623" },
  },
  {
    id: "minimal-editorial",
    name: "Minimal Editorial",
    blurb: "Light, literary, generous whitespace",
    swatch: { bg: "#faf9f6", fg: "#1a1a1a", accent: "#1a1a1a" },
  },
  {
    id: "startup-modern",
    name: "Startup Modern",
    blurb: "Crisp light UI, confident color",
    swatch: { bg: "#fcfcfd", fg: "#111827", accent: "#2563eb" },
  },
  {
    id: "premium-local",
    name: "Premium Local Business",
    blurb: "Trust-forward, warm, established",
    swatch: { bg: "#f8f6f2", fg: "#23201a", accent: "#1f6f54" },
  },
  {
    id: "high-end-agency",
    name: "High-End Agency",
    blurb: "Oversized type, art-directed restraint",
    swatch: { bg: "#111111", fg: "#eeeeea", accent: "#eeeeea" },
  },
  {
    id: "modern-industrial",
    name: "Modern Industrial",
    blurb: "Steel, grids, utilitarian confidence",
    swatch: { bg: "#141517", fg: "#e8e9eb", accent: "#e05d2b" },
  },
];

export interface GoalOption {
  id: GoalId;
  name: string;
  blurb: string;
}

export const GOALS: GoalOption[] = [
  { id: "get-leads", name: "Get Leads", blurb: "Forms and calls from the site" },
  { id: "book-calls", name: "Book Calls", blurb: "Scheduled phone consultations" },
  { id: "book-appointments", name: "Book Appointments", blurb: "On-site visits on the calendar" },
  { id: "generate-quotes", name: "Generate Quotes", blurb: "Fast, structured estimates" },
  { id: "showcase-work", name: "Showcase Work", blurb: "Portfolio that sells itself" },
  { id: "sell-products", name: "Sell Products", blurb: "Direct product sales" },
  { id: "build-trust", name: "Build Trust", blurb: "Proof, reviews, credentials" },
  { id: "local-seo", name: "Local SEO", blurb: "Rank in your service area" },
  { id: "recruiting", name: "Recruiting", blurb: "Attract crew and staff" },
];

export interface PageOption {
  id: PageId;
  name: string;
  blurb: string;
  /** Pre-checked for new briefs. */
  recommended?: boolean;
}

export const PAGES: PageOption[] = [
  { id: "home", name: "Home", blurb: "The front door", recommended: true },
  { id: "about", name: "About", blurb: "Story, team, credentials", recommended: true },
  { id: "services", name: "Services", blurb: "Everything you offer", recommended: true },
  { id: "gallery", name: "Gallery", blurb: "Project photos & proof" },
  { id: "reviews", name: "Reviews", blurb: "Social proof, ratings" },
  { id: "faq", name: "FAQ", blurb: "Objections, answered" },
  { id: "blog", name: "Blog", blurb: "SEO articles & updates" },
  { id: "contact", name: "Contact", blurb: "Quote & contact forms", recommended: true },
  { id: "careers", name: "Careers", blurb: "Hiring & culture" },
  { id: "financing", name: "Financing", blurb: "Payment plans & offers" },
  { id: "commercial", name: "Commercial Services", blurb: "B2B-focused page" },
  { id: "residential", name: "Residential Services", blurb: "Homeowner-focused page" },
  { id: "custom", name: "Custom Page", blurb: "Name your own" },
];

/* ---------- Visual direction option sets ---------- */

export const BACKGROUND_STYLES = [
  "Deep dark with ambient light",
  "Soft light, warm neutrals",
  "Pure white, maximum contrast",
  "Subtle gradients",
  "Textured / industrial",
  "Photography-led",
] as const;

export const BUTTON_STYLES = [
  "Pill (fully rounded)",
  "Rounded rectangle",
  "Sharp / squared",
  "Glass / translucent",
  "Outlined",
] as const;

export const CARD_STYLES = [
  "Frosted glass",
  "Flat with hairline borders",
  "Elevated with soft shadows",
  "Sharp editorial blocks",
  "Borderless / open layout",
] as const;

export const ANIMATION_STYLES = [
  "Calm — subtle fades and lifts",
  "Expressive — parallax and reveals",
  "Minimal — almost none",
  "Cinematic — big entrances, light sweeps",
] as const;

export const TONES = [
  "Confident",
  "Warm",
  "Direct",
  "Refined",
  "Energetic",
  "Reassuring",
  "Authoritative",
  "Playful",
] as const;

export const YEARS_OPTIONS = [
  "Just starting",
  "1–2 years",
  "3–5 years",
  "6–10 years",
  "11–20 years",
  "20+ years",
] as const;

export const TEAM_SIZES = [
  "Owner-operated",
  "2–5",
  "6–15",
  "16–50",
  "50+",
] as const;

/* ==========================================================================
   Discovery flow metadata — section names, agency copy, field help.
   ========================================================================== */

export type SectionId =
  | "business"
  | "personality"
  | "design-systems"
  | "visual"
  | "competitors"
  | "goals"
  | "content"
  | "seo"
  | "structure"
  | "advanced";

export interface SectionMeta {
  id: SectionId;
  index: number;
  label: string;
  title: string;
  /** Agency-voice intro under the section title. */
  lede: string;
  /** Short label shown in the progress rail. */
  short: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: "business",
    index: 1,
    label: "Business",
    short: "Business",
    title: "Tell us about the business.",
    lede: "Every great site starts with the facts — who you are, where you work, and what you actually do. We design around this.",
  },
  {
    id: "personality",
    index: 2,
    label: "Brand personality",
    short: "Personality",
    title: "How should it feel?",
    lede: "Two companies can offer the same service and deserve completely different websites. This is where yours stops being generic.",
  },
  {
    id: "design-systems",
    index: 3,
    label: "Design system",
    short: "Design system",
    title: "Pick the design languages you love.",
    lede: "Choose one or blend several. We use these as the structural DNA of your site — not as templates.",
  },
  {
    id: "visual",
    index: 4,
    label: "Visual direction",
    short: "Visual",
    title: "Set the visual direction.",
    lede: "Color, surfaces, motion. If you have a logo or inspiration, drop it in — we build around what already exists.",
  },
  {
    id: "competitors",
    index: 5,
    label: "Competitors",
    short: "Competitors",
    title: "Who are we up against?",
    lede: "We study what your competitors do well and where they're weak — then position you to win the comparison.",
  },
  {
    id: "goals",
    index: 6,
    label: "Website goals",
    short: "Goals",
    title: "What should the website do?",
    lede: "A website built to get calls looks different from one built to showcase work. Pick everything that matters.",
  },
  {
    id: "content",
    index: 7,
    label: "Content",
    short: "Content",
    title: "What do you already have?",
    lede: "Real photos and reviews beat anything we could write. Tell us what exists so we know what to feature and what to create.",
  },
  {
    id: "seo",
    index: 8,
    label: "Local SEO",
    short: "Local SEO",
    title: "Where should you rank?",
    lede: "Local search is where service businesses win or lose. We bake the targets into the structure from day one.",
  },
  {
    id: "structure",
    index: 9,
    label: "Site structure",
    short: "Structure",
    title: "Choose your pages.",
    lede: "We've pre-selected what works for your industry. Add or remove pages — each one gets its own purpose and plan.",
  },
  {
    id: "advanced",
    index: 10,
    label: "Final details",
    short: "Details",
    title: "Anything else we should know?",
    lede: "Offers, guarantees, things you never want to see on your site. The small details are what make it feel custom.",
  },
];

/* ---------- Defaults ---------- */

export const DEFAULT_BRIEF: DiscoveryBrief = {
  business: {
    businessName: "",
    industry: "epoxy-flooring",
    customIndustry: "",
    city: "",
    state: "",
    country: "United States",
    serviceArea: "",
    yearsInBusiness: "",
    teamSize: "",
    description: "",
    primaryService: "",
    secondaryServices: [],
    emergencyServices: false,
    commercialServices: true,
    residentialServices: true,
  },
  brand: {
    tone: "",
    personalities: [],
    customPersonality: "",
    emotions: "",
    threeWords: "",
    differentiator: "",
    whyChooseUs: "",
  },
  designSystems: [],
  visual: {
    primaryColor: "#101014",
    secondaryColor: "#6ee7d2",
    accentColor: "#a5b4fc",
    backgroundStyle: "",
    buttonStyle: "",
    cardStyle: "",
    animations: "",
    logoName: "",
    logoDataUrl: "",
    inspirationImages: [],
    brandAssets: [],
  },
  competitors: {
    competitor1: "",
    competitor2: "",
    competitor3: "",
    likes: "",
    dislikes: "",
  },
  goals: [],
  content: {
    hasContent: false,
    needsAiContent: true,
    hasTestimonials: false,
    hasReviews: false,
    hasProjectPhotos: false,
    hasBeforeAfter: false,
    hasCertifications: false,
  },
  seo: {
    targetCity: "",
    additionalCities: "",
    keywords: "",
    servicesToRank: "",
  },
  pages: ["home", "about", "services", "contact"],
  customPage: "",
  advanced: {
    additionalInstructions: "",
    thingsToAvoid: "",
    uniqueSellingPoints: "",
    specialOffers: "",
    guarantees: "",
    financingOptions: "",
  },
};

/* ---------- Completion scoring for the progress rail ---------- */

function filled(...values: (string | boolean | unknown[])[]): number {
  return values.filter((v) =>
    Array.isArray(v) ? v.length > 0 : typeof v === "boolean" ? v : v.trim().length > 0,
  ).length;
}

/** 0–1 completion per section; only counts the fields that actually move the output. */
export function sectionProgress(brief: DiscoveryBrief): Record<SectionId, number> {
  const b = brief.business;
  return {
    business:
      filled(b.businessName, b.city, b.description, b.primaryService, b.serviceArea) / 5,
    personality:
      filled(
        brief.brand.personalities,
        brief.brand.threeWords,
        brief.brand.differentiator,
        brief.brand.whyChooseUs,
      ) / 4,
    "design-systems": brief.designSystems.length > 0 ? 1 : 0,
    visual:
      filled(
        brief.visual.backgroundStyle,
        brief.visual.buttonStyle,
        brief.visual.cardStyle,
        brief.visual.animations,
      ) / 4,
    competitors:
      filled(brief.competitors.competitor1, brief.competitors.likes, brief.competitors.dislikes) /
      3,
    goals: brief.goals.length > 0 ? 1 : 0,
    content: 1, // always answerable — toggles default sensibly
    seo: filled(brief.seo.targetCity, brief.seo.keywords, brief.seo.servicesToRank) / 3,
    structure: brief.pages.length > 0 ? 1 : 0,
    advanced:
      Math.min(
        1,
        filled(
          brief.advanced.uniqueSellingPoints,
          brief.advanced.guarantees,
          brief.advanced.specialOffers,
        ) / 2,
      ),
  };
}

export function overallProgress(brief: DiscoveryBrief): number {
  const p = sectionProgress(brief);
  const values = Object.values(p);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** One-line summary per section for the rail — what the studio "heard". */
export function sectionSummary(brief: DiscoveryBrief, id: SectionId): string {
  switch (id) {
    case "business": {
      const b = brief.business;
      if (!b.businessName) return "Awaiting introductions";
      const place = [b.city, b.state].filter(Boolean).join(", ");
      return [b.businessName, place].filter(Boolean).join(" — ");
    }
    case "personality": {
      const p = brief.brand.personalities
        .map((id) => PERSONALITIES.find((x) => x.id === id)?.name)
        .filter(Boolean)
        .slice(0, 3)
        .join(" · ");
      return p || brief.brand.customPersonality || "No direction yet";
    }
    case "design-systems": {
      const names = brief.designSystems
        .map((id) => DESIGN_SYSTEMS.find((d) => d.id === id)?.name)
        .filter(Boolean);
      return names.length ? names.slice(0, 2).join(" + ") + (names.length > 2 ? "…" : "") : "Not chosen";
    }
    case "visual":
      return brief.visual.backgroundStyle || "Default palette";
    case "competitors":
      return brief.competitors.competitor1 ? "Competitors noted" : "None listed";
    case "goals": {
      const names = brief.goals
        .map((id) => GOALS.find((g) => g.id === id)?.name)
        .filter(Boolean);
      return names.length ? names.slice(0, 2).join(" · ") + (names.length > 2 ? "…" : "") : "Not set";
    }
    case "content": {
      const c = brief.content;
      const have = [
        c.hasTestimonials && "testimonials",
        c.hasProjectPhotos && "photos",
        c.hasBeforeAfter && "before/after",
        c.hasCertifications && "certs",
      ].filter(Boolean) as string[];
      return have.length ? `Has ${have.join(", ")}` : "Starting fresh";
    }
    case "seo":
      return brief.seo.targetCity ? `Targeting ${brief.seo.targetCity}` : "No targets yet";
    case "structure":
      return `${brief.pages.length} pages`;
    case "advanced":
      return brief.advanced.guarantees || brief.advanced.specialOffers
        ? "Offers & guarantees noted"
        : "Nothing extra";
  }
}
