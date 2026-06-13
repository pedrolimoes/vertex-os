/** Identity of a model provider the user can bring a key for. */
export type ProviderId =
  | "nvidia-nim"
  | "deepinfra"
  | "openrouter"
  | "gemini"
  | "ollama"
  | "custom";

/* ==========================================================================
   Discovery brief — everything the client tells the studio.
   Modeled after a real agency discovery questionnaire, in ten sections.
   ========================================================================== */

export type IndustryId =
  | "epoxy-flooring"
  | "roofing"
  | "hvac"
  | "plumbing"
  | "electrical"
  | "landscaping"
  | "pressure-washing"
  | "cleaning"
  | "auto-detailing"
  | "painting"
  | "fencing"
  | "remodeling"
  | "concrete"
  | "pest-control"
  | "garage-doors"
  | "custom";

export type DesignSystemId =
  | "liquid-glass"
  | "vision-pro"
  | "linear"
  | "raycast"
  | "arc-browser"
  | "vercel"
  | "framer"
  | "notion"
  | "luxury-black"
  | "contractor-pro"
  | "minimal-editorial"
  | "startup-modern"
  | "premium-local"
  | "high-end-agency"
  | "modern-industrial";

export type PersonalityId =
  | "premium"
  | "luxury"
  | "friendly"
  | "professional"
  | "contractor"
  | "modern"
  | "minimal"
  | "innovative"
  | "trustworthy"
  | "bold"
  | "corporate"
  | "futuristic";

export type GoalId =
  | "get-leads"
  | "book-calls"
  | "book-appointments"
  | "generate-quotes"
  | "showcase-work"
  | "sell-products"
  | "build-trust"
  | "local-seo"
  | "recruiting";

export type PageId =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "reviews"
  | "faq"
  | "blog"
  | "contact"
  | "careers"
  | "financing"
  | "commercial"
  | "residential"
  | "custom";

/** Section 1 — Business information. */
export interface BusinessInfo {
  businessName: string;
  industry: IndustryId;
  customIndustry: string;
  city: string;
  state: string;
  country: string;
  serviceArea: string;
  yearsInBusiness: string;
  teamSize: string;
  description: string;
  primaryService: string;
  secondaryServices: string[];
  emergencyServices: boolean;
  commercialServices: boolean;
  residentialServices: boolean;
}

/** Section 2 — Brand personality. */
export interface BrandPersonality {
  tone: string;
  personalities: PersonalityId[];
  customPersonality: string;
  emotions: string;
  threeWords: string;
  differentiator: string;
  whyChooseUs: string;
}

/** Section 4 — Visual direction (+ asset uploads). */
export interface VisualDirection {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundStyle: string;
  buttonStyle: string;
  cardStyle: string;
  animations: string;
  logoName: string;
  /** Small data-URL of the uploaded logo (kept under ~200 KB). */
  logoDataUrl: string;
  inspirationImages: string[];
  brandAssets: string[];
}

/** Section 5 — Competitors. */
export interface CompetitorInfo {
  competitor1: string;
  competitor2: string;
  competitor3: string;
  likes: string;
  dislikes: string;
}

/** Section 7 — Existing content inventory. */
export interface ContentInventory {
  hasContent: boolean;
  needsAiContent: boolean;
  hasTestimonials: boolean;
  hasReviews: boolean;
  hasProjectPhotos: boolean;
  hasBeforeAfter: boolean;
  hasCertifications: boolean;
}

/** Section 8 — Local SEO targets. */
export interface LocalSeoTargets {
  targetCity: string;
  additionalCities: string;
  keywords: string;
  servicesToRank: string;
}

/** Section 10 — Advanced notes. */
export interface AdvancedDetails {
  additionalInstructions: string;
  thingsToAvoid: string;
  uniqueSellingPoints: string;
  specialOffers: string;
  guarantees: string;
  financingOptions: string;
}

/** The full ten-section discovery brief. */
export interface DiscoveryBrief {
  business: BusinessInfo;
  brand: BrandPersonality;
  /** Section 3 — design systems (multi-select). */
  designSystems: DesignSystemId[];
  visual: VisualDirection;
  competitors: CompetitorInfo;
  /** Section 6 — website goals (multi-select). */
  goals: GoalId[];
  content: ContentInventory;
  seo: LocalSeoTargets;
  /** Section 9 — selected pages. */
  pages: PageId[];
  customPage: string;
  advanced: AdvancedDetails;
}

export interface ProviderSettings {
  provider: ProviderId;
  apiKey: string;
  /** Base URL for ollama / custom OpenAI-compatible endpoints. */
  baseUrl: string;
  model: string;
}

/* ==========================================================================
   Design DNA — the structural genome of a design system.
   Render hints are consumed directly by the canvas, so two DNAs produce
   genuinely different layouts — not the same template re-skinned.
   ========================================================================== */

export type HeroLayout =
  | "centered"
  | "split"
  | "editorial-left"
  | "oversized"
  | "showroom";

export type NavStyle = "glass-pill" | "hairline" | "bold-bar" | "minimal-text" | "boxed";

export interface DesignDNA {
  id: DesignSystemId;
  name: string;
  /** One line: what this DNA feels like. */
  essence: string;
  traits: string[];
  /* --- render hints the canvas obeys --- */
  heroLayout: HeroLayout;
  navStyle: NavStyle;
  density: "airy" | "balanced" | "dense";
  /* --- rules the generators obey --- */
  layoutRules: string[];
  componentRules: {
    navigation: string;
    hero: string;
    cards: string;
    buttons: string;
    forms: string;
  };
  motionRules: {
    character: string;
    speed: "slow" | "calm" | "snappy";
    rules: string[];
  };
  typographyRules: {
    display: string;
    body: string;
    scale: string;
    rules: string[];
  };
  imagery: string;
  copyDirection: string;
}

/* ==========================================================================
   Design brief — Phase 1 output. The AI (or engine) acts as a design
   director and produces this BEFORE any website is generated. Phase 2
   must follow it.
   ========================================================================== */

export interface DesignBrief {
  /** Human-readable style line, e.g. "Luxury Black × Auto Detailing". */
  style: string;
  designDNA: DesignSystemId;
  brandStrategy: {
    positioning: string;
    audience: string;
    voice: string;
    pillars: string[];
  };
  /** Prose description of the visual language. */
  designLanguage: string;
  visualIdentity: {
    imagery: string;
    iconography: string;
    texture: string;
  };
  layoutRules: string[];
  componentRules: {
    navigation: string;
    hero: string;
    cards: string;
    buttons: string;
    forms: string;
  };
  motionRules: {
    character: string;
    speed: string;
    rules: string[];
  };
  typographyRules: {
    display: string;
    body: string;
    scale: string;
    rules: string[];
  };
  colorSystem: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    rules: string[];
  };
  sectionRequirements: { section: string; requirement: string }[];
  conversionStrategy: {
    primaryCta: string;
    strategy: string;
    trustPlacement: string;
  };
}

/* ==========================================================================
   Site blueprint — what the studio produces.
   Not a page of copy: a brand strategy, a design direction, a site
   structure, and an industry-specific homepage wireframe.
   ========================================================================== */

export type SectionType =
  | "hero"
  | "emergency-banner"
  | "trust-bar"
  | "before-after"
  | "service-grid"
  | "process"
  | "stats"
  | "insurance"
  | "financing"
  | "packages"
  | "seasonal"
  | "service-area"
  | "testimonials"
  | "gallery"
  | "certifications"
  | "guarantee"
  | "team"
  | "faq"
  | "final-cta";

export interface BlueprintItem {
  title: string;
  body: string;
  meta?: string;
  /** Image reference — "idb:<id>" for locally stored uploads. */
  image?: string;
}

/** One flexible block — every renderer consumes this same shape. */
export interface BlueprintSection {
  type: SectionType;
  /** Small label above the title, e.g. "The process". */
  eyebrow?: string;
  title?: string;
  body?: string;
  items?: BlueprintItem[];
  stats?: { value: string; label: string }[];
  cta?: { label: string; secondary?: string; href?: string; secondaryHref?: string };
  /** Section-level image reference. */
  image?: string;
  /** Toggled from the editor — hidden sections stay in the data. */
  hidden?: boolean;
  /** Why this section exists for this business — shown in the strategy panel. */
  rationale?: string;
}

export interface BrandStrategy {
  positioning: string;
  valueProposition: string;
  audience: string;
  voice: string;
  messagingPillars: string[];
  differentiators: string[];
}

export interface DesignDirection {
  /** Prose rationale for the chosen art direction. */
  direction: string;
  typography: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  motion: string;
  imagery: string;
}

export interface PagePlan {
  id: PageId | string;
  title: string;
  purpose: string;
  sections: string[];
}

export interface CtaStrategy {
  primary: string;
  secondary: string;
  strategy: string;
  placements: string[];
}

export interface SeoStrategy {
  title: string;
  description: string;
  keywords: string[];
  localPages: string[];
  strategy: string;
}

export interface SiteBlueprint {
  brand: BrandStrategy;
  design: DesignDirection;
  structure: { pages: PagePlan[] };
  /** Ordered, industry-specific homepage wireframe. */
  homepage: BlueprintSection[];
  ctaStrategy: CtaStrategy;
  seo: SeoStrategy;
  /** Trust elements woven through the site. */
  trust: string[];
}

export interface GenerationResult {
  /** Phase 1 — produced first; Phase 2 must follow it. */
  designBrief: DesignBrief;
  blueprint: SiteBlueprint;
  /** "engine" when produced by the built-in engine, otherwise provider id. */
  source: ProviderId | "engine";
  warning?: string;
}

/* ==========================================================================
   Site project — the editable unit. Everything the editor touches and
   the exporter ships lives here, as structured data.
   ========================================================================== */

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface SiteProject {
  id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  brief: DiscoveryBrief;
  designBrief: DesignBrief;
  blueprint: SiteBlueprint;
  /** Active design system for rendering + export. */
  system: DesignSystemId;
  contact: ContactInfo;
  source: ProviderId | "engine";
  warning?: string;
}

/* ---------- MCP connectors ---------- */

export interface McpServerConfig {
  id: string;
  name: string;
  command: string;
  args: string[];
  env: Record<string, string>;
  description?: string;
}
