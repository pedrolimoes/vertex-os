import type { IndustryId } from "./types";
import { readableAccentOn, readableTextOn } from "./utils";

/**
 * Liquid Glass demo-site registry.
 *
 * Each entry is a complete, hand-written website for a fictional-but-believable
 * local business — real services, real city, real objections answered in the
 * FAQ. The goal: a contractor could point at any of these and say "that's my
 * site," not "that's an AI placeholder."
 *
 * Theming is delivered as CSS custom properties (see .lgx classes in
 * globals.css). Accent ink + accent text colors are derived with the contrast
 * utilities so every button and accent passes WCAG on its actual background.
 */

export type DemoSiteSlug =
  | "epoxy"
  | "roofing"
  | "landscaping"
  | "pressure-washing"
  | "cleaning"
  | "hvac"
  | "auto-detailing";

export interface DemoStat {
  value: string;
  label: string;
}

export interface DemoService {
  icon: string;
  name: string;
  body: string;
}

export interface DemoGalleryItem {
  /** "before-after" renders a split frame; "photo" renders a single frame. */
  kind: "before-after" | "photo";
  title: string;
  tag: string;
}

export interface DemoReview {
  name: string;
  location: string;
  quote: string;
}

export interface DemoFaq {
  q: string;
  a: string;
}

export interface DemoSite {
  slug: DemoSiteSlug;
  templateId: IndustryId;
  industry: string;
  business: {
    name: string;
    /** Short name for the nav wordmark, e.g. "Atlas". */
    short: string;
    tagline: string;
    city: string;
    state: string;
    region: string;
    phone: string;
    credential: string;
    hours: string;
    rating: number;
    reviewCount: number;
    yearsInBusiness: number;
  };
  mode: "dark" | "light";
  palette: { bg: string; bgAlt: string; accent: string };
  hero: {
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
    stats: DemoStat[];
  };
  trustBar: string[];
  services: { heading: string; sub: string; items: DemoService[] };
  gallery: { heading: string; sub: string; items: DemoGalleryItem[] };
  reviews: { heading: string; sub: string; items: DemoReview[] };
  faq: { heading: string; items: DemoFaq[] };
  quote: {
    heading: string;
    sub: string;
    bullets: string[];
    serviceOptions: string[];
  };
}

/* ------------------------------------------------------------------ */
/* Theme → CSS custom properties                                       */
/* ------------------------------------------------------------------ */

export function demoThemeVars(site: DemoSite): Record<string, string> {
  const { bg, bgAlt, accent } = site.palette;
  const accentInk = readableTextOn(accent);
  const accentText = readableAccentOn(accent, bg, 4.5);
  const dark = site.mode === "dark";

  return {
    "--lgx-bg": bg,
    "--lgx-bg-alt": bgAlt,
    "--lgx-accent": accent,
    "--lgx-accent-ink": accentInk,
    "--lgx-accent-text": accentText,
    "--lgx-accent-glow": `${accent}59`,
    "--lgx-accent-dim": `${accent}2e`,
    ...(dark
      ? {
          "--lgx-text": "rgba(245,246,248,0.93)",
          "--lgx-muted": "rgba(245,246,248,0.62)",
          "--lgx-soft": "rgba(245,246,248,0.38)",
          "--lgx-glass-bg": "rgba(255,255,255,0.05)",
          "--lgx-glass-bg-strong": "rgba(255,255,255,0.085)",
          "--lgx-glass-border": "rgba(255,255,255,0.1)",
          "--lgx-glass-border-strong": "rgba(255,255,255,0.18)",
          "--lgx-glass-border-hover": "rgba(255,255,255,0.3)",
          "--lgx-edge": "rgba(255,255,255,0.12)",
          "--lgx-shadow": "rgba(0,0,0,0.6)",
          "--lgx-input-bg": "rgba(0,0,0,0.28)",
          "--lgx-hero-glow": "rgba(255,255,255,0.055)",
          "--lgx-hero-tint": `${accent}17`,
        }
      : {
          "--lgx-text": "#191c22",
          "--lgx-muted": "rgba(25,28,34,0.66)",
          "--lgx-soft": "rgba(25,28,34,0.42)",
          "--lgx-glass-bg": "rgba(255,255,255,0.6)",
          "--lgx-glass-bg-strong": "rgba(255,255,255,0.82)",
          "--lgx-glass-border": "rgba(18,24,36,0.09)",
          "--lgx-glass-border-strong": "rgba(18,24,36,0.16)",
          "--lgx-glass-border-hover": "rgba(18,24,36,0.28)",
          "--lgx-edge": "rgba(255,255,255,0.95)",
          "--lgx-shadow": "rgba(35,45,70,0.16)",
          "--lgx-input-bg": "rgba(255,255,255,0.75)",
          "--lgx-hero-glow": "rgba(255,255,255,0.85)",
          "--lgx-hero-tint": `${accent}1c`,
        }),
  };
}

/* ------------------------------------------------------------------ */
/* The seven sites                                                     */
/* ------------------------------------------------------------------ */

export const DEMO_SITES: DemoSite[] = [
  /* ---------- 1 · Epoxy Flooring ---------- */
  {
    slug: "epoxy",
    templateId: "epoxy-flooring",
    industry: "Epoxy Flooring",
    business: {
      name: "Atlas Concrete Coatings",
      short: "Atlas",
      tagline: "Garage & commercial floor coatings",
      city: "Fort Worth",
      state: "TX",
      region: "Fort Worth & Tarrant County",
      phone: "(817) 555-0143",
      credential: "Certified polyaspartic installer · Insured",
      hours: "Mon–Sat · 7am–6pm",
      rating: 4.9,
      reviewCount: 212,
      yearsInBusiness: 9,
    },
    mode: "dark",
    palette: { bg: "#0c0c0f", bgAlt: "#101014", accent: "#e8a33b" },
    hero: {
      eyebrow: "Fort Worth · Garage & commercial coatings",
      headline: "A showroom floor,",
      headlineAccent: "in your garage by Saturday.",
      sub: "Atlas installs flake, metallic, and solid-color coating systems engineered for hot-tire pickup, oil spills, and decades of daily use. Diamond-ground prep, industrial-grade polyaspartic top coats — most garages done in one day.",
      primaryCta: "Get my floor quoted",
      secondaryCta: "See finished floors",
      stats: [
        { value: "1-day", label: "typical garage install" },
        { value: "15-yr", label: "adhesion warranty" },
        { value: "400+", label: "floors coated in DFW" },
      ],
    },
    trustBar: [
      "15-year adhesion warranty",
      "Hot-tire pickup resistant",
      "Diamond-ground prep on every job",
      "Licensed & insured",
    ],
    services: {
      heading: "Coating systems for every slab.",
      sub: "Every floor starts with diamond grinding and moisture testing — the prep work cheap installers skip is the reason their floors peel.",
      items: [
        {
          icon: "layers",
          name: "Garage floor coatings",
          body: "Full-broadcast flake with a polyaspartic top coat. Walk on it next morning, park on it in 48 hours.",
        },
        {
          icon: "warehouse",
          name: "Commercial & warehouse",
          body: "High-build epoxy systems rated for forklifts, pallet jacks, and chemical exposure. Weekend installs to keep you open.",
        },
        {
          icon: "sparkles",
          name: "Metallic epoxy",
          body: "Hand-poured pearl and copper pigments for showrooms, offices, and the garage nobody believes is a garage.",
        },
        {
          icon: "grid",
          name: "Decorative flake systems",
          body: "Forty flake blends from quiet granite tones to bold custom colors, matched to your trim and cabinets.",
        },
        {
          icon: "hammer",
          name: "Concrete repair & prep",
          body: "Crack stitching, spall repair, and moisture mitigation so the coating bonds to sound concrete — guaranteed.",
        },
        {
          icon: "sun",
          name: "Patios & pool decks",
          body: "UV-stable, slip-rated outdoor coatings that stay cool underfoot and shrug off Texas summers.",
        },
      ],
    },
    gallery: {
      heading: "Floors we've finished.",
      sub: "Real installs across Tarrant County — swipe through the befores if you want to feel better about your garage.",
      items: [
        { kind: "before-after", title: "3-car garage, full-broadcast flake", tag: "Keller" },
        { kind: "photo", title: "Metallic copper showroom floor", tag: "Fort Worth" },
        { kind: "photo", title: "Warehouse line-striped epoxy", tag: "Haltom City" },
        { kind: "before-after", title: "Oil-stained slab to granite flake", tag: "Benbrook" },
        { kind: "photo", title: "Pool deck, cool-touch coating", tag: "Aledo" },
        { kind: "photo", title: "Two-tone shop floor with containment", tag: "Saginaw" },
      ],
    },
    reviews: {
      heading: "Tarrant County trusts Atlas.",
      sub: "4.9 stars across 212 Google reviews — and we answer every single one.",
      items: [
        {
          name: "Marcus T.",
          location: "Keller",
          quote:
            "Crew showed at 7am, ground the slab, fixed two cracks I didn't know I had, and I parked on a brand-new floor two days later. It looks like a dealership.",
        },
        {
          name: "Dana W.",
          location: "Fort Worth",
          quote:
            "We got three quotes. Atlas wasn't the cheapest, but they were the only ones who talked about moisture testing and prep. Two years in — zero peeling, zero hot-tire marks.",
        },
        {
          name: "Ray & Sofia G.",
          location: "Benbrook",
          quote:
            "The metallic floor in our studio gets asked about by every client who walks in. Scheduling was easy and the price matched the quote to the dollar.",
        },
      ],
    },
    faq: {
      heading: "Straight answers about epoxy.",
      items: [
        {
          q: "Will hot tires peel the coating?",
          a: "Not ours. Hot-tire pickup happens when coatings are applied over poorly prepped concrete. We diamond-grind every slab and top with polyaspartic, which is rated far beyond tire temperatures — and it's covered by the 15-year adhesion warranty.",
        },
        {
          q: "How long before I can use the garage?",
          a: "Walk on it the next morning, move boxes in at 24 hours, park on it at 48. Full chemical cure is about a week.",
        },
        {
          q: "What about cracks and oil stains in my slab?",
          a: "Almost every slab we coat has them. Cracks get routed and filled, spalls get patched, oil gets degreased and ground out. Repairs are itemized in your quote — no surprises on install day.",
        },
        {
          q: "Epoxy or polyaspartic — which do I need?",
          a: "Usually both: epoxy builds the base coat and color, polyaspartic tops it with UV and abrasion resistance. All-epoxy floors yellow in sunlight; all-polyaspartic floors cost more for no real gain. The hybrid is the sweet spot.",
        },
        {
          q: "How much does a garage floor cost?",
          a: "Most 2-car garages in Tarrant County run $1,800–$2,600 depending on repairs and flake choice. Send photos and dimensions and we'll quote it flat-rate, usually same day.",
        },
      ],
    },
    quote: {
      heading: "Get a flat-rate quote from a photo.",
      sub: "Text us a picture of your floor and rough dimensions — we'll send a firm number, usually within the hour. No site visit needed for most garages.",
      bullets: [
        "Flat-rate pricing — the quote is the price",
        "Most quotes back within one business hour",
        "Weekend installs available",
      ],
      serviceOptions: [
        "Garage floor coating",
        "Commercial / warehouse",
        "Metallic epoxy",
        "Patio or pool deck",
        "Concrete repair only",
      ],
    },
  },

  /* ---------- 2 · Roofing ---------- */
  {
    slug: "roofing",
    templateId: "roofing",
    industry: "Roofing",
    business: {
      name: "Caldwell Roofing & Exteriors",
      short: "Caldwell",
      tagline: "Storm-rated roofing since 2008",
      city: "Tulsa",
      state: "OK",
      region: "Tulsa & Green Country",
      phone: "(918) 555-0167",
      credential: "OK CIB #80412 · GAF Master Elite",
      hours: "Mon–Sat · 7am–7pm · 24/7 storm line",
      rating: 4.9,
      reviewCount: 486,
      yearsInBusiness: 18,
    },
    mode: "dark",
    palette: { bg: "#0d0c0b", bgAlt: "#121009", accent: "#e88050" },
    hero: {
      eyebrow: "Tulsa · Residential & commercial roofing",
      headline: "The roof over everything you own.",
      headlineAccent: "Built to outlast the storm.",
      sub: "Caldwell has replaced more than 3,100 roofs across Green Country — architectural shingle, metal, and TPO — with a 25-year workmanship warranty and an insurance-claim team that handles the paperwork so you don't have to.",
      primaryCta: "Book a free inspection",
      secondaryCta: "Storm damage? Call now",
      stats: [
        { value: "24/7", label: "storm response line" },
        { value: "25-yr", label: "workmanship warranty" },
        { value: "3,100+", label: "roofs completed" },
      ],
    },
    trustBar: [
      "GAF Master Elite contractor",
      "25-year workmanship warranty",
      "Insurance claims handled in-house",
      "Licensed · Bonded · Insured",
    ],
    services: {
      heading: "Done once. Done right. Documented.",
      sub: "Every job gets a dedicated project manager, daily photo updates, and a magnetic nail sweep of your yard before we leave.",
      items: [
        {
          icon: "home",
          name: "Roof replacement",
          body: "Full tear-off and re-deck inspection, architectural shingle or standing-seam metal, most homes finished in one day.",
        },
        {
          icon: "cloud-lightning",
          name: "Storm & hail damage",
          body: "Green Country sits in the hail belt. We document damage to insurance standards and meet your adjuster on the roof.",
        },
        {
          icon: "search",
          name: "Free 21-point inspections",
          body: "Drone imaging plus an attic check, with a written report you keep — whether or not you hire us.",
        },
        {
          icon: "wrench",
          name: "Repairs & leak tracing",
          body: "Flashing, pipe boots, missing shingles, mystery stains. Most repairs scheduled within 48 hours.",
        },
        {
          icon: "droplets",
          name: "Gutters & exteriors",
          body: "Seamless gutters, gutter guards, fascia and soffit — installed by our crews, not subcontractors.",
        },
        {
          icon: "file-check",
          name: "Insurance claim support",
          body: "We've walked thousands of claims. Our team builds the scope, meets the adjuster, and fights for what the policy actually owes.",
        },
      ],
    },
    gallery: {
      heading: "Recent roofs across Green Country.",
      sub: "From hail-totaled shingle roofs to standing-seam upgrades — documented start to finish.",
      items: [
        { kind: "before-after", title: "Hail-damage full replacement", tag: "Broken Arrow" },
        { kind: "photo", title: "Standing-seam metal, farmhouse", tag: "Owasso" },
        { kind: "photo", title: "Architectural shingle re-roof", tag: "Midtown Tulsa" },
        { kind: "before-after", title: "Wind-lifted ridge, same-week fix", tag: "Jenks" },
        { kind: "photo", title: "Commercial TPO, retail strip", tag: "Sand Springs" },
        { kind: "photo", title: "Cedar-to-shingle conversion", tag: "Bixby" },
      ],
    },
    reviews: {
      heading: "486 reviews. One theme: they show up.",
      sub: "Read them all on Google — including the three-star ones and how we made them right.",
      items: [
        {
          name: "Patricia H.",
          location: "Broken Arrow",
          quote:
            "Hail totaled our roof in April. Caldwell met the adjuster, got the full replacement approved, and the crew finished in a day. The yard was cleaner when they left than when they came.",
        },
        {
          name: "James K.",
          location: "Owasso",
          quote:
            "Two other companies quoted me a replacement. Caldwell's inspector showed me photos proving I only needed flashing work — $700 instead of $14,000. That's why they get my referrals.",
        },
        {
          name: "Renee D.",
          location: "Jenks",
          quote:
            "Tarped at 11pm during the storm, repaired that same week. The 24/7 line is real — a human answered on the second ring.",
        },
      ],
    },
    faq: {
      heading: "What homeowners ask us.",
      items: [
        {
          q: "Will my insurance cover the roof?",
          a: "If the damage is from a covered event — hail, wind, fallen limbs — usually yes. We document to adjuster standards and meet them on-site. You typically pay only your deductible; Oklahoma law prohibits us from waiving it, and you should hang up on any roofer who offers to.",
        },
        {
          q: "How long does a replacement take?",
          a: "Most homes: one day. Tear-off starts at 7am, the deck is inspected and repaired, and final cleanup with a magnetic sweep is done before dinner. Larger or steep roofs can take two.",
        },
        {
          q: "Should I get an inspection after every hailstorm?",
          a: "If hail was quarter-sized or larger, yes — damage often isn't visible from the ground, and most policies give you only a year to file. Our inspection is free and you keep the report either way.",
        },
        {
          q: "Do you offer financing?",
          a: "Yes — fixed-rate plans from 12 to 120 months with same-day approval, for retail jobs and deductibles alike.",
        },
        {
          q: "What does the 25-year warranty actually cover?",
          a: "Our workmanship — flashing, sealing, installation — for 25 years, on top of the manufacturer's material warranty. If it leaks because of something we did, we fix it free. It's in writing and transfers if you sell the house.",
        },
      ],
    },
    quote: {
      heading: "Free inspection. Honest verdict.",
      sub: "If the roof has years left, we'll tell you. If it doesn't, you'll get a written scope, drone photos, and a fixed price — usually within 48 hours.",
      bullets: [
        "21-point inspection with drone imaging",
        "Written report you keep, no obligation",
        "24/7 emergency tarping: (918) 555-0167",
      ],
      serviceOptions: [
        "Free roof inspection",
        "Storm / hail damage",
        "Roof replacement",
        "Repair or leak",
        "Gutters & exteriors",
      ],
    },
  },

  /* ---------- 3 · Landscaping ---------- */
  {
    slug: "landscaping",
    templateId: "landscaping",
    industry: "Landscaping",
    business: {
      name: "Stonebrook Landscape Co.",
      short: "Stonebrook",
      tagline: "Design-build landscaping & care",
      city: "Madison",
      state: "WI",
      region: "Madison & Dane County",
      phone: "(608) 555-0129",
      credential: "WI landscape contractor · ICPI certified",
      hours: "Mon–Fri · 7am–5pm",
      rating: 4.8,
      reviewCount: 342,
      yearsInBusiness: 14,
    },
    mode: "light",
    palette: { bg: "#f4f4ee", bgAlt: "#ecede4", accent: "#2e6b3f" },
    hero: {
      eyebrow: "Madison · Design-build landscaping",
      headline: "The yard the whole street",
      headlineAccent: "slows down to look at.",
      sub: "Stonebrook designs, builds, and maintains outdoor spaces across Dane County — from full landscape renovations and bluestone patios to weekly care that keeps it all looking like install day.",
      primaryCta: "Start a design consult",
      secondaryCta: "Browse our projects",
      stats: [
        { value: "14", label: "seasons in Madison" },
        { value: "600+", label: "yards transformed" },
        { value: "92%", label: "clients on recurring care" },
      ],
    },
    trustBar: [
      "ICPI-certified hardscape crews",
      "3D design before you commit",
      "2-year plant guarantee",
      "Fully licensed & insured",
    ],
    services: {
      heading: "From first sketch to every spring after.",
      sub: "One team for design, installation, and care — so the plan survives contact with reality and the plants survive the winter.",
      items: [
        {
          icon: "pen",
          name: "Landscape design",
          body: "Site survey, 3D renderings, and a planting plan suited to Wisconsin winters — you approve the design before a shovel hits dirt.",
        },
        {
          icon: "bricks",
          name: "Patios & hardscapes",
          body: "Bluestone, paver, and natural-stone patios, walkways, and fire features built on properly excavated bases that won't heave.",
        },
        {
          icon: "flower",
          name: "Planting & garden beds",
          body: "Native-forward plant palettes with structure in all four seasons, backed by our 2-year plant guarantee.",
        },
        {
          icon: "scissors",
          name: "Lawn & property care",
          body: "Weekly mowing, edging, pruning, and bed care from the same crew each visit — they learn your property.",
        },
        {
          icon: "droplet",
          name: "Irrigation & lighting",
          body: "Smart irrigation that waters by weather, and low-voltage lighting that makes the place glow after dark.",
        },
        {
          icon: "leaf",
          name: "Seasonal cleanups",
          body: "Spring openings, fall leaf removal, and snow-ready prep — scheduled automatically if you're on a care plan.",
        },
      ],
    },
    gallery: {
      heading: "Projects around Dane County.",
      sub: "Every project photographed at install — and again a year later, because that's when a landscape proves itself.",
      items: [
        { kind: "before-after", title: "Full front-yard renovation", tag: "Shorewood Hills" },
        { kind: "photo", title: "Bluestone patio & fire pit", tag: "Middleton" },
        { kind: "photo", title: "Native pollinator garden", tag: "Monona" },
        { kind: "before-after", title: "Slope tamed with terraced walls", tag: "Verona" },
        { kind: "photo", title: "Lakeside planting, year two", tag: "Maple Bluff" },
        { kind: "photo", title: "Lighted walkway & entry beds", tag: "Fitchburg" },
      ],
    },
    reviews: {
      heading: "Neighbors keep our signs up.",
      sub: "4.8 across 342 reviews — most of our new work comes from three streets in either direction of an old project.",
      items: [
        {
          name: "Ellen & Mark S.",
          location: "Middleton",
          quote:
            "The 3D design sold us, but the build crew is what earned the review. On time every morning, tidy every night, and the patio is dead level two winters later.",
        },
        {
          name: "Priya R.",
          location: "Monona",
          quote:
            "They replaced our dying foundation shrubs with a native bed that looks intentional in every season. Two plants didn't make it through winter — replaced without us even asking.",
        },
        {
          name: "Tom B.",
          location: "Verona",
          quote:
            "Weekly care crew is the same two guys all season. They notice things — a sprinkler head leaning, grubs starting — before they become problems.",
        },
      ],
    },
    faq: {
      heading: "Planning questions, answered.",
      items: [
        {
          q: "What does a design consultation cost?",
          a: "The initial site visit and consult is free. Full 3D design packages run $450–$1,200 depending on scope, and 100% of the design fee is credited toward your installation.",
        },
        {
          q: "When should I book for a summer install?",
          a: "Design in winter, build in spring. Our installation calendar for June–August typically fills by April, so the consult is worth booking early.",
        },
        {
          q: "Will the plants survive a Wisconsin winter?",
          a: "We design with zone-4-hardy, mostly native species and guarantee every plant we install for two full years — if it dies, we replace it free.",
        },
        {
          q: "Do you do small jobs, or only full renovations?",
          a: "Both. Plenty of clients start with a single bed refresh or a walkway and grow from there. No project minimum for design-build work.",
        },
        {
          q: "What's included in weekly care?",
          a: "Mowing, edging, blowing, bed weeding, and pruning on a schedule tuned to your property, with seasonal cleanups built in. Plans are month-to-month — no annual contract.",
        },
      ],
    },
    quote: {
      heading: "Tell us about your yard.",
      sub: "Share what you're dreaming about — or what's driving you crazy — and we'll schedule a free walk-through with a designer.",
      bullets: [
        "Free on-site design consultation",
        "3D renderings before you commit",
        "Design fee credited to your install",
      ],
      serviceOptions: [
        "Landscape design & install",
        "Patio / hardscape",
        "Planting & garden beds",
        "Weekly lawn & property care",
        "Seasonal cleanup",
      ],
    },
  },

  /* ---------- 4 · Pressure Washing ---------- */
  {
    slug: "pressure-washing",
    templateId: "pressure-washing",
    industry: "Pressure Washing",
    business: {
      name: "TideLine Exterior Cleaning",
      short: "TideLine",
      tagline: "Soft wash & pressure washing",
      city: "Wilmington",
      state: "NC",
      region: "Wilmington & New Hanover County",
      phone: "(910) 555-0184",
      credential: "SoftWash certified · Fully insured",
      hours: "Mon–Sat · 8am–6pm",
      rating: 5.0,
      reviewCount: 178,
      yearsInBusiness: 6,
    },
    mode: "dark",
    palette: { bg: "#081016", bgAlt: "#0b141c", accent: "#54c7ec" },
    hero: {
      eyebrow: "Wilmington · House washing & exterior cleaning",
      headline: "Five years of coastal grime.",
      headlineAccent: "Gone by lunchtime.",
      sub: "Salt air, humidity, and shade turn every Wilmington exterior green. TideLine soft-washes siding and roofs, restores driveways, and brightens decks — with photos before and after, and a 12-month clean guarantee.",
      primaryCta: "Get an instant quote",
      secondaryCta: "See before & afters",
      stats: [
        { value: "12-mo", label: "clean guarantee" },
        { value: "5.0★", label: "across 178 reviews" },
        { value: "Same wk", label: "scheduling, most jobs" },
      ],
    },
    trustBar: [
      "12-month clean guarantee",
      "Soft wash safe for all siding",
      "Plant & pet-safe detergents",
      "Fully insured crews",
    ],
    services: {
      heading: "The right pressure for every surface.",
      sub: "High pressure strips paint and etches concrete in the wrong hands. We match method to material — soft wash for siding and roofs, surface cleaners for flatwork.",
      items: [
        {
          icon: "home",
          name: "House soft washing",
          body: "Low-pressure detergent wash that kills the algae at the root instead of blasting it — siding stays clean four times longer.",
        },
        {
          icon: "square",
          name: "Driveways & concrete",
          body: "Rotary surface cleaning that lifts years of traffic film, rust, and irrigation stains into one even, bright finish.",
        },
        {
          icon: "umbrella",
          name: "Roof cleaning",
          body: "Those black streaks are algae eating your shingles. Manufacturer-approved soft wash removes them without a single PSI of damage.",
        },
        {
          icon: "fence",
          name: "Decks, fences & patios",
          body: "Wood-safe washing and brightening that takes gray, weathered boards back to their original tone.",
        },
        {
          icon: "store",
          name: "Commercial exteriors",
          body: "Storefronts, sidewalks, dumpster pads, and drive-throughs — scheduled overnight or off-hours so you never close.",
        },
        {
          icon: "droplets",
          name: "Gutter brightening",
          body: "Exterior gutter scrub that erases tiger striping and oxidation, the detail most washers skip.",
        },
      ],
    },
    gallery: {
      heading: "Proof, in pairs.",
      sub: "Every job photographed from the same angle, before and after. This is why we don't need stock photos.",
      items: [
        { kind: "before-after", title: "Green-to-white vinyl two-story", tag: "Ogden" },
        { kind: "before-after", title: "Driveway, 12 years of traffic film", tag: "Pine Valley" },
        { kind: "before-after", title: "Black-streaked roof, soft washed", tag: "Porters Neck" },
        { kind: "photo", title: "Restaurant patio, overnight clean", tag: "Downtown" },
        { kind: "before-after", title: "Gray deck brought back to cedar", tag: "Carolina Beach" },
        { kind: "photo", title: "HOA sidewalk contract, 1.2 miles", tag: "Mayfaire" },
      ],
    },
    reviews: {
      heading: "A perfect five. We work to keep it.",
      sub: "178 reviews, zero below five stars. The secret isn't magic — it's photos, punctuality, and redoing anything that isn't right.",
      items: [
        {
          name: "Kelly A.",
          location: "Porters Neck",
          quote:
            "They texted a quote from Google Street View in ten minutes, showed up Saturday, and my house looks brand new. The before/after photos they sent are wild.",
        },
        {
          name: "Hector M.",
          location: "Pine Valley",
          quote:
            "Driveway hadn't been cleaned since we bought the place. No streaks, no missed strips, and they rinsed every plant when they finished. Worth every penny.",
        },
        {
          name: "Sandra L.",
          location: "Carolina Beach",
          quote:
            "Our deck was gray and slick. It's honestly cedar-colored again — I didn't think that was possible without sanding.",
        },
      ],
    },
    faq: {
      heading: "Before you book.",
      items: [
        {
          q: "Will pressure washing damage my siding?",
          a: "High pressure can — that's why we don't use it on siding. Soft washing cleans with detergent at garden-hose pressure, which is the method siding and roofing manufacturers actually recommend.",
        },
        {
          q: "How do you quote without visiting?",
          a: "Address plus a couple of phone photos is all we need for 90% of homes. You'll get a firm number by text, usually within the hour — and the price doesn't change on arrival.",
        },
        {
          q: "Are the chemicals safe for my plants and pets?",
          a: "We pre-soak and rinse all landscaping, use biodegradable detergents, and keep pets inside during the wash. Six years, zero plant casualties we know of.",
        },
        {
          q: "What's the 12-month clean guarantee?",
          a: "If algae or streaking returns on a surface we washed within 12 months, we re-clean it free. Coastal growth is predictable; our detergents are dosed to beat it.",
        },
        {
          q: "Do I need to be home?",
          a: "Nope. As long as exterior water is on and gates are unlocked, we'll do the job and send before/after photos when we're done.",
        },
      ],
    },
    quote: {
      heading: "Instant quote, zero pressure.",
      sub: "Send your address and what needs cleaning. Most quotes go out by text within the hour, and most jobs are on the schedule within the week.",
      bullets: [
        "Quotes by text within ~1 hour",
        "Before & after photos with every job",
        "12-month clean guarantee in writing",
      ],
      serviceOptions: [
        "House soft wash",
        "Driveway / concrete",
        "Roof cleaning",
        "Deck, fence or patio",
        "Commercial property",
      ],
    },
  },

  /* ---------- 5 · Cleaning ---------- */
  {
    slug: "cleaning",
    templateId: "cleaning",
    industry: "Cleaning",
    business: {
      name: "Fern & Fir Home Cleaning",
      short: "Fern & Fir",
      tagline: "Residential & commercial cleaning",
      city: "Portland",
      state: "OR",
      region: "Portland Metro",
      phone: "(503) 555-0117",
      credential: "Bonded & insured · Background-checked team",
      hours: "Mon–Fri · 8am–6pm · Sat by request",
      rating: 4.9,
      reviewCount: 524,
      yearsInBusiness: 11,
    },
    mode: "light",
    palette: { bg: "#f5f6f7", bgAlt: "#edf0f1", accent: "#1f7a6d" },
    hero: {
      eyebrow: "Portland · Recurring home & office cleaning",
      headline: "Come home",
      headlineAccent: "to done.",
      sub: "Fern & Fir sends the same trusted, background-checked team to your home on a schedule that holds. Eleven years in Portland, 524 five-star reviews, and a 24-hour re-clean guarantee on every visit.",
      primaryCta: "Get my price in 60 seconds",
      secondaryCta: "How recurring service works",
      stats: [
        { value: "Same team", label: "every single visit" },
        { value: "24-hr", label: "re-clean guarantee" },
        { value: "11 yrs", label: "serving Portland" },
      ],
    },
    trustBar: [
      "Bonded & insured",
      "Background-checked employees — never subs",
      "Eco-certified products standard",
      "No contracts, pause anytime",
    ],
    services: {
      heading: "A clean for every situation.",
      sub: "From every-other-week upkeep to the deep clean before your in-laws land — same checklist rigor, same team, same guarantee.",
      items: [
        {
          icon: "repeat",
          name: "Recurring house cleaning",
          body: "Weekly, biweekly, or monthly visits from your dedicated two-person team, working a 50-point room-by-room checklist.",
        },
        {
          icon: "sparkles",
          name: "Deep cleaning",
          body: "Baseboards, vents, blinds, inside appliances, grout lines — the reset that makes recurring service effortless to maintain.",
        },
        {
          icon: "box",
          name: "Move-in / move-out",
          body: "Empty-home cleans built around landlord checklists, with photo documentation for your deposit.",
        },
        {
          icon: "building",
          name: "Office & commercial",
          body: "Evening and early-morning service for offices, studios, and clinics — consistent crew, supply restocking included.",
        },
        {
          icon: "hammer",
          name: "Post-construction",
          body: "Fine-dust removal in the right order: ceilings to floors, twice over. Contractors keep us on speed dial.",
        },
        {
          icon: "key",
          name: "Airbnb turnovers",
          body: "Same-day turnovers with staging photos, restock tracking, and damage flagging to keep your rating spotless.",
        },
      ],
    },
    gallery: {
      heading: "What 'done' looks like.",
      sub: "Real homes on our recurring routes — photographed with our clients' permission, because the work holds up.",
      items: [
        { kind: "before-after", title: "Move-out kitchen, deposit secured", tag: "Sellwood" },
        { kind: "photo", title: "Biweekly route home, week 40", tag: "Alberta Arts" },
        { kind: "before-after", title: "Post-renovation fine-dust clean", tag: "Beaverton" },
        { kind: "photo", title: "Boutique office, nightly service", tag: "Pearl District" },
        { kind: "photo", title: "Airbnb turnover, photo-ready", tag: "Hawthorne" },
        { kind: "before-after", title: "First deep clean, new client", tag: "Lake Oswego" },
      ],
    },
    reviews: {
      heading: "524 reviews from homes like yours.",
      sub: "The pattern you'll notice: people mention their cleaners by name. That's what same-team service does.",
      items: [
        {
          name: "Naomi C.",
          location: "Alberta Arts",
          quote:
            "Rosa and Mai have cleaned our house every other Thursday for three years. They know which door sticks and that the cat hides in the closet. It's not a service anymore, it's part of the household.",
        },
        {
          name: "Derek F.",
          location: "Beaverton",
          quote:
            "Used the 24-hour guarantee once in two years — a missed window sill. Someone was back the next morning, no questions, with an apology and a fix. That's how you keep customers.",
        },
        {
          name: "Lauren & Sam P.",
          location: "Sellwood",
          quote:
            "The move-out clean got our full deposit back on a 1920s rental with original everything. The photo checklist they sent the landlord did the arguing for us.",
        },
      ],
    },
    faq: {
      heading: "Good questions to ask any cleaner.",
      items: [
        {
          q: "Is it really the same team every time?",
          a: "Yes — that's the core of how we operate. Your home is assigned a dedicated two-person team; you'll know them by name. If one is sick, the other leads with a trained floater, and we tell you in advance.",
        },
        {
          q: "Are your cleaners employees or contractors?",
          a: "W-2 employees, every one — background-checked, trained for three weeks, bonded, insured, and paid above Portland living wage. We never send anonymous gig workers into your home.",
        },
        {
          q: "What if I'm not happy with a clean?",
          a: "Tell us within 24 hours and we return to re-clean the area free. No deflection, no debate — it's the guarantee that keeps our checklist honest.",
        },
        {
          q: "Do I need to sign a contract?",
          a: "No contracts, ever. Recurring service is just a standing appointment you can pause, reschedule, or cancel with 48 hours' notice.",
        },
        {
          q: "What do you charge?",
          a: "Recurring cleans for most Portland homes run $130–$220 per visit depending on size and frequency. Answer five questions on our quote form and you'll have an exact price in about a minute.",
        },
      ],
    },
    quote: {
      heading: "Your price in 60 seconds.",
      sub: "Five quick questions — size, frequency, pets, parking, priorities — and we'll send an exact per-visit price. First clean is guaranteed or it's free.",
      bullets: [
        "Exact pricing, not estimates",
        "First clean backed by our guarantee",
        "Pause or cancel anytime, no fees",
      ],
      serviceOptions: [
        "Recurring cleaning",
        "One-time deep clean",
        "Move-in / move-out",
        "Office / commercial",
        "Airbnb turnover",
      ],
    },
  },

  /* ---------- 6 · HVAC ---------- */
  {
    slug: "hvac",
    templateId: "hvac",
    industry: "HVAC",
    business: {
      name: "Beacon Air & Heat",
      short: "Beacon",
      tagline: "Cooling, heating & air quality",
      city: "Mesa",
      state: "AZ",
      region: "Mesa & the East Valley",
      phone: "(480) 555-0152",
      credential: "AZ ROC #338190 · NATE certified",
      hours: "24/7 · Real humans answer",
      rating: 4.9,
      reviewCount: 763,
      yearsInBusiness: 16,
    },
    mode: "dark",
    palette: { bg: "#0a0e13", bgAlt: "#0d1219", accent: "#5fb0f5" },
    hero: {
      eyebrow: "Mesa · 24/7 cooling & heating",
      headline: "115° outside.",
      headlineAccent: "72° in here.",
      sub: "When your AC quits in an Arizona summer, every hour matters. Beacon's NATE-certified techs run 24/7 with same-day repair on most calls, flat-rate pricing quoted before work starts, and maintenance plans that keep the breakdown from happening at all.",
      primaryCta: "Book same-day service",
      secondaryCta: "Join the Comfort Club",
      stats: [
        { value: "Same-day", label: "repair, most calls" },
        { value: "24/7", label: "live dispatch" },
        { value: "763", label: "five-star reviews" },
      ],
    },
    trustBar: [
      "AZ ROC licensed & NATE certified",
      "Flat-rate pricing before work starts",
      "Same-day service in the East Valley",
      "10-year parts & labor on new installs",
    ],
    services: {
      heading: "Everything between you and the heat.",
      sub: "Repair what can be repaired, replace what can't, and tell you the honest difference — with the math to back it up.",
      items: [
        {
          icon: "thermometer",
          name: "AC repair",
          body: "Diagnostics on every brand, flat-rate quote before we touch a tool, and the fix done same-day for most East Valley calls.",
        },
        {
          icon: "replace",
          name: "AC installation & replacement",
          body: "Right-sized systems with a load calculation — not a guess — backed by 10-year parts and labor coverage.",
        },
        {
          icon: "flame",
          name: "Heating & furnace",
          body: "Heat pumps and furnaces tuned for desert winters, including safety inspections and CO testing.",
        },
        {
          icon: "calendar",
          name: "Comfort Club maintenance",
          body: "Two precision tune-ups a year, priority scheduling, 15% off repairs, and no overtime rates. Members skip the summer line.",
        },
        {
          icon: "wind",
          name: "Ductwork & air quality",
          body: "Duct sealing, insulation, filtration, and purification — fixes for hot rooms, dusty shelves, and allergy seasons.",
        },
        {
          icon: "siren",
          name: "24/7 emergency service",
          body: "Real dispatchers around the clock. If it's 2am in July and the house is climbing, we're already rolling.",
        },
      ],
    },
    gallery: {
      heading: "Recent installs & rescues.",
      sub: "From 20-year-old units retired with honors to full system upgrades that cut summer bills by a third.",
      items: [
        { kind: "before-after", title: "2003 unit to 17-SEER heat pump", tag: "Mesa" },
        { kind: "photo", title: "Attic duct sealing & insulation", tag: "Gilbert" },
        { kind: "photo", title: "New install, 10-yr coverage", tag: "Chandler" },
        { kind: "before-after", title: "Crushed flex duct, airflow restored", tag: "Tempe" },
        { kind: "photo", title: "Comfort Club tune-up visit", tag: "Queen Creek" },
        { kind: "photo", title: "Mini-split for a garage gym", tag: "Apache Junction" },
      ],
    },
    reviews: {
      heading: "763 reviews. Mostly written in July.",
      sub: "Nothing builds loyalty like a 9pm rescue in monsoon season.",
      items: [
        {
          name: "Carlos V.",
          location: "Mesa",
          quote:
            "AC died at 6pm on a Friday, 111° out. Beacon had a tech here by 8:30, capacitor swapped, house cooling by 9. Price matched the quote exactly.",
        },
        {
          name: "Janet R.",
          location: "Gilbert",
          quote:
            "Two companies told me I needed a new $12k system. Beacon's tech found a failing blower motor — $640 fix, and the honesty earned them the replacement job whenever it actually dies.",
        },
        {
          name: "The Okafors",
          location: "Chandler",
          quote:
            "Comfort Club is the best subscription we have. They catch the small stuff in spring, and our last three summers had zero breakdowns.",
        },
      ],
    },
    faq: {
      heading: "Asked in every Arizona summer.",
      items: [
        {
          q: "How fast can you actually get here?",
          a: "Most East Valley calls get same-day service, and Comfort Club members jump the queue. Our 24/7 line is staffed by dispatchers in Mesa — not an answering service — so you'll have a real arrival window, not a 'sometime tomorrow.'",
        },
        {
          q: "Repair or replace — how do I decide?",
          a: "Our rule of thumb: multiply the repair cost by the system's age. Over $5,000? Replacement usually wins. Our techs show you that math on the spot and quote both paths — the choice stays yours.",
        },
        {
          q: "What does flat-rate pricing mean?",
          a: "You approve a fixed price from our rate book before any work starts. If the job takes longer than expected, that's our problem, not your bill.",
        },
        {
          q: "Is the Comfort Club worth it?",
          a: "At $19/month you get two tune-ups (a $340 value), 15% off repairs, no overtime rates, and priority scheduling in peak season. If your system is older than five years, it pays for itself with one avoided breakdown.",
        },
        {
          q: "Do you offer financing on new systems?",
          a: "Yes — 0% plans up to 18 months and longer fixed-rate terms, with approval in minutes. Most replacements also qualify for utility rebates we file for you.",
        },
      ],
    },
    quote: {
      heading: "Book service or get a system quote.",
      sub: "Tell us what's happening — strange noise, warm air, sky-high bill — and dispatch will call back within 15 minutes during business hours.",
      bullets: [
        "Same-day service on most calls",
        "Flat-rate quote before work begins",
        "24/7 emergency: (480) 555-0152",
      ],
      serviceOptions: [
        "AC repair",
        "System replacement quote",
        "Heating / furnace",
        "Maintenance plan",
        "Air quality / ductwork",
      ],
    },
  },

  /* ---------- 7 · Auto Detailing ---------- */
  {
    slug: "auto-detailing",
    templateId: "auto-detailing",
    industry: "Auto Detailing",
    business: {
      name: "Obsidian Auto Studio",
      short: "Obsidian",
      tagline: "Ceramic coatings & paint correction",
      city: "Scottsdale",
      state: "AZ",
      region: "Scottsdale & North Phoenix",
      phone: "(480) 555-0196",
      credential: "Certified ceramic installer · Climate-controlled studio",
      hours: "Tue–Sat · 9am–6pm · By appointment",
      rating: 5.0,
      reviewCount: 143,
      yearsInBusiness: 7,
    },
    mode: "dark",
    palette: { bg: "#070708", bgAlt: "#0b0b0d", accent: "#d8bd8a" },
    hero: {
      eyebrow: "Scottsdale · Detailing studio, by appointment",
      headline: "Deeper than showroom.",
      headlineAccent: "Sealed for the desert.",
      sub: "Obsidian is a climate-controlled studio for paint correction, ceramic coating, and interior restoration — one vehicle at a time, photographed under inspection lighting, finished when it's right rather than when the clock says so.",
      primaryCta: "Reserve a studio slot",
      secondaryCta: "Explore coating packages",
      stats: [
        { value: "1", label: "vehicle in studio at a time" },
        { value: "5-yr", label: "coating warranty, written" },
        { value: "143", label: "five-star reviews" },
      ],
    },
    trustBar: [
      "Certified ceramic installer",
      "5-year written coating warranty",
      "Inspection-light photo documentation",
      "Insured, climate-controlled studio",
    ],
    services: {
      heading: "The full correction-to-coating chain.",
      sub: "Coatings amplify whatever is underneath them — which is why every Obsidian coating starts with paint measured, corrected, and documented panel by panel.",
      items: [
        {
          icon: "gem",
          name: "Ceramic coating",
          body: "Professional-grade coatings installed over corrected paint, cured under infrared light, warrantied in writing for five years.",
        },
        {
          icon: "disc",
          name: "Paint correction",
          body: "Machine polishing measured with a gauge, not eyeballed — swirls, etching, and haze removed in one to three stages.",
        },
        {
          icon: "armchair",
          name: "Interior restoration",
          body: "Steam extraction, leather cleaning and conditioning, odor neutralization — down to the seat rails and vent vanes.",
        },
        {
          icon: "shield",
          name: "Paint protection film",
          body: "Self-healing PPF on high-impact zones or full panels, edges wrapped, patterns cut for your exact model.",
        },
        {
          icon: "car",
          name: "Signature full detail",
          body: "The complete inside-and-out treatment that resets a daily driver to delivery-day condition in a single visit.",
        },
        {
          icon: "calendar",
          name: "Maintenance program",
          body: "Coating-safe hand washes on a schedule that protects your investment — and keeps the warranty active.",
        },
      ],
    },
    gallery: {
      heading: "Work under the inspection lights.",
      sub: "Every vehicle is photographed before, during, and after — the same lighting that finds defects is the lighting we use to prove they're gone.",
      items: [
        { kind: "before-after", title: "Black GT, two-stage correction", tag: "Paint correction" },
        { kind: "photo", title: "Ceramic coat, infrared cure", tag: "Coating bay" },
        { kind: "before-after", title: "Desert-sun hood, restored", tag: "Correction + PPF" },
        { kind: "photo", title: "Cognac leather, conditioned", tag: "Interior studio" },
        { kind: "photo", title: "Track-day PPF package", tag: "Film install" },
        { kind: "before-after", title: "10-year daily, full reset", tag: "Signature detail" },
      ],
    },
    reviews: {
      heading: "Trusted with the cars people love.",
      sub: "Collectors, leases, daily drivers — the standard is the same because the lights don't lie.",
      items: [
        {
          name: "Anthony D.",
          location: "Scottsdale",
          quote:
            "I've used 'high-end' detailers in three states. Obsidian is the first that measured my paint, showed me the readings, and explained exactly what one stage versus two would do. The result is beyond what the dealership delivered.",
        },
        {
          name: "Mira K.",
          location: "Paradise Valley",
          quote:
            "Ceramic coating on a white SUV that lives outside in Arizona. A year later water still beads off and dust rinses away with a garden hose. Worth every cent.",
        },
        {
          name: "Steve B.",
          location: "North Phoenix",
          quote:
            "Brought in a 10-year-old daily with kids' history in every seat. Got back a car I genuinely considered keeping instead of trading. They found things the dealer's 'full detail' never touched.",
        },
      ],
    },
    faq: {
      heading: "Coating questions, honest answers.",
      items: [
        {
          q: "Is ceramic coating worth it in Arizona?",
          a: "Here more than almost anywhere. UV and 115° summers oxidize unprotected paint fast; a professional coating blocks UV, sheds dust with a rinse, and keeps resale photos honest for years. The catch: it must go over corrected paint, or you're sealing the swirls in.",
        },
        {
          q: "How long does a correction + coating take?",
          a: "Two to four days depending on paint condition. Your car holds the studio alone the entire time — we don't stack vehicles, and we don't release until inspection lighting says it's done.",
        },
        {
          q: "What does the 5-year warranty cover?",
          a: "Hydrophobics, gloss, and UV protection of the coating itself, in writing, with annual check-ins. Keep up coating-safe washes (ours or your own) and the warranty stays active.",
        },
        {
          q: "Can you remove scratches completely?",
          a: "Swirls, haze, and most light scratches — yes, permanently. A scratch that catches a fingernail is into the clear coat and can be improved by 70–90% but not erased. We'll tell you which is which before you spend a dollar.",
        },
        {
          q: "Do you work on daily drivers, or just exotics?",
          a: "Both, with the same process. Plenty of our coating clients drive CR-Vs and F-150s — protecting a car you keep for ten years is the best value case there is.",
        },
      ],
    },
    quote: {
      heading: "Reserve your studio slot.",
      sub: "Tell us the vehicle, its condition, and what you want it to look like. We'll recommend a package with exact pricing — and book you in, one car at a time.",
      bullets: [
        "Exact package pricing, no upsells on arrival",
        "Paint inspection & gauge readings included",
        "Loaner wash plan while you wait",
      ],
      serviceOptions: [
        "Ceramic coating package",
        "Paint correction",
        "Interior restoration",
        "Signature full detail",
        "Paint protection film",
      ],
    },
  },
];

export function getDemoSite(slug: string): DemoSite | undefined {
  return DEMO_SITES.find((s) => s.slug === slug);
}

export function demoPathFor(templateId: IndustryId): string | undefined {
  const site = DEMO_SITES.find((s) => s.templateId === templateId);
  return site ? `/templates/liquid-glass/${site.slug}` : undefined;
}
