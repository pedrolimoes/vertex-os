import type {
  BlueprintSection,
  DesignSystemId,
  IndustryId,
  SectionType,
} from "./types";

/* ==========================================================================
   Industry engine.
   Every industry gets its own homepage architecture, hero angle, trust
   logic, and signature sections. No shared template — a roofing site and
   an epoxy site come out structurally different, not re-skinned.
   ========================================================================== */

export interface IndustryProfile {
  id: IndustryId;
  name: string;
  /** What this industry's buyers actually care about. */
  buyerPsychology: string;
  /** Strategic angle the homepage is built around. */
  positioningAngle: string;
  /** Ordered homepage architecture — the structural fingerprint. */
  sectionOrder: SectionType[];
  /** Hero copy seeds: {name} {city} {service} are interpolated. */
  hero: { headline: string; subheadline: string; primaryCta: string; secondaryCta: string };
  /** Signature stats band (if the architecture includes one). */
  stats?: { value: string; label: string }[];
  /** Signature process steps. */
  process?: { title: string; body: string }[];
  /** Industry-true FAQ seeds. */
  faq: { title: string; body: string }[];
  trustElements: string[];
  defaultServices: string[];
  suggestedSystems: DesignSystemId[];
  palette: { primary: string; secondary: string; accent: string };
  /** Voice notes passed to the copy engine / model. */
  voiceNotes: string;
}

const PROFILES: Record<Exclude<IndustryId, "custom">, IndustryProfile> = {
  "epoxy-flooring": {
    id: "epoxy-flooring",
    name: "Epoxy Flooring",
    buyerPsychology:
      "Buyers are upgrading a space they're proud of. They want visual proof of the finish, confidence it won't peel, and a clean crew in their garage.",
    positioningAngle: "Industrial-grade craft with a showroom finish",
    sectionOrder: [
      "hero",
      "trust-bar",
      "before-after",
      "stats",
      "service-grid",
      "process",
      "gallery",
      "testimonials",
      "guarantee",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Floors built to outlast the building",
      subheadline:
        "{name} installs industrial-grade epoxy and polyaspartic coatings across {city} — moisture-tested, ground with diamonds, and finished like a showroom.",
      primaryCta: "Get my floor quote",
      secondaryCta: "See before & after",
    },
    stats: [
      { value: "2,500+ PSI", label: "bond strength" },
      { value: "15 yr", label: "wear warranty" },
      { value: "1 day", label: "typical install" },
      { value: "0", label: "hot-tire peel claims" },
    ],
    process: [
      { title: "Diamond grind", body: "We mechanically profile the slab — never acid etch — so the coating bonds to concrete, not dust." },
      { title: "Moisture test & repair", body: "Cracks, pits, and vapor issues are fixed before a drop of epoxy goes down." },
      { title: "Coat & broadcast", body: "Commercial-grade base coat with full flake broadcast to rejection." },
      { title: "Polyaspartic top coat", body: "UV-stable, chemical-resistant, and ready to drive on fast." },
    ],
    faq: [
      { title: "Will it peel like DIY kits?", body: "No — box-store kits fail because of surface prep. We diamond-grind and moisture-test every slab, which is why we can warranty the bond." },
      { title: "How long until I can park on it?", body: "Walk on it in hours; park on it in 24–48 depending on the system. We'll give you exact times in your quote." },
      { title: "What about cracks and pitting?", body: "Repair is built into our process. Most slabs need it, and we'd rather fix it than coat over it." },
      { title: "Flake, metallic, or solid?", body: "We bring physical samples to every estimate so you choose from real finishes, not photos." },
    ],
    trustElements: [
      "Moisture testing on every slab",
      "Industrial-grade materials only",
      "Written bond warranty",
      "Photo-documented prep",
    ],
    defaultServices: [
      "Garage Floor Coatings",
      "Commercial Epoxy",
      "Metallic Epoxy Finishes",
      "Concrete Polishing",
      "Patio & Basement Coatings",
    ],
    suggestedSystems: ["modern-industrial", "liquid-glass"],
    palette: { primary: "#141517", secondary: "#e05d2b", accent: "#8ecbdd" },
    voiceNotes:
      "Technical confidence. Talk PSI, mil thickness, prep standards. The reader should feel the difference between a pro install and a weekend kit.",
  },

  roofing: {
    id: "roofing",
    name: "Roofing",
    buyerPsychology:
      "Buyers are often stressed — storm damage, leaks, insurance paperwork. They need fast trust, proof of legitimacy, and someone to handle the claim maze.",
    positioningAngle: "Storm-ready protection and a guided insurance process",
    sectionOrder: [
      "hero",
      "emergency-banner",
      "trust-bar",
      "service-grid",
      "insurance",
      "process",
      "testimonials",
      "service-area",
      "financing",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "The roof over everything you own",
      subheadline:
        "{name} protects {city} homes with certified installations, honest inspections, and an insurance claims process we handle for you.",
      primaryCta: "Book a free inspection",
      secondaryCta: "Storm damage? Start here",
    },
    process: [
      { title: "Free inspection", body: "Drone and on-roof assessment with a photo report you keep — no obligation." },
      { title: "Claim support", body: "We document damage to insurer standards and meet the adjuster on site." },
      { title: "Certified install", body: "Manufacturer-certified crews, full tear-off, and same-day cleanup with magnetic nail sweep." },
      { title: "Final walkthrough", body: "Warranty registration and a workmanship guarantee in writing." },
    ],
    faq: [
      { title: "Will my insurance cover this?", body: "If the damage is storm-related, often yes. Our inspection report is written to insurer standards, and we walk the claim with you start to finish." },
      { title: "How fast can you tarp a leak?", body: "Emergency tarping is typically same-day. Call us before the next rain — temporary protection prevents the expensive damage." },
      { title: "Tear-off or overlay?", body: "We almost always recommend full tear-off so we can inspect decking. Overlays hide problems you'll pay for later." },
      { title: "What warranty do I get?", body: "Manufacturer material warranty plus our own workmanship warranty, both registered and in writing." },
    ],
    trustElements: [
      "Manufacturer-certified installers",
      "Insurance claims guidance",
      "Photo-documented inspections",
      "Workmanship warranty in writing",
    ],
    defaultServices: [
      "Roof Replacement",
      "Storm Damage Repair",
      "Free Inspections",
      "Emergency Tarping",
      "Gutter Installation",
    ],
    suggestedSystems: ["contractor-pro", "premium-local"],
    palette: { primary: "#16222e", secondary: "#f5a623", accent: "#9bc5e8" },
    voiceNotes:
      "Calm authority under pressure. Acknowledge stress, then remove it. Insurance fluency is the differentiator — speak it plainly.",
  },

  hvac: {
    id: "hvac",
    name: "HVAC",
    buyerPsychology:
      "Half the traffic is an emergency: the AC died in July. The other half is planned replacement shoppers comparing quotes. Serve the emergency first, then earn the considered purchase.",
    positioningAngle: "Always-on reliability with engineered comfort",
    sectionOrder: [
      "hero",
      "emergency-banner",
      "service-grid",
      "stats",
      "packages",
      "process",
      "testimonials",
      "financing",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Comfort, restored — usually today",
      subheadline:
        "{name} keeps {city} comfortable year-round with 24/7 emergency response, tuned installations, and maintenance plans that prevent the 2 a.m. failure.",
      primaryCta: "Request service now",
      secondaryCta: "Get a replacement quote",
    },
    stats: [
      { value: "24/7", label: "emergency dispatch" },
      { value: "<2 hr", label: "average response" },
      { value: "NATE", label: "certified techs" },
      { value: "10 yr", label: "parts & labor options" },
    ],
    process: [
      { title: "Diagnose honestly", body: "Flat diagnostic fee, applied to the repair. You approve every line before we touch a part." },
      { title: "Repair or replace — your call", body: "We quote both paths with real numbers so you can decide on economics, not pressure." },
      { title: "Install to manual J", body: "Systems sized by load calculation, not rules of thumb — that's where efficiency lives." },
      { title: "Maintain it", body: "Seasonal tune-ups catch the $40 problem before it becomes the $4,000 one." },
    ],
    faq: [
      { title: "Do you really answer at 2 a.m.?", body: "Yes — a person, not a voicemail. Emergency dispatch runs around the clock, every day of the year." },
      { title: "Repair or replace?", body: "Our rule of thumb: if the repair costs more than a third of replacement and the unit is past 10 years, we'll show you both quotes and the math." },
      { title: "Why is sizing such a big deal?", body: "Oversized systems short-cycle and die early; undersized never keep up. We run a load calculation on every install." },
      { title: "What does a maintenance plan include?", body: "Two seasonal tune-ups, priority scheduling, and discounted repairs — most members recover the cost in energy savings alone." },
    ],
    trustElements: [
      "24/7 live answer",
      "NATE-certified technicians",
      "Upfront flat-rate pricing",
      "Load-calculated installs",
    ],
    defaultServices: [
      "AC Repair",
      "Furnace Repair",
      "System Replacement",
      "Duct Cleaning & Sealing",
      "Maintenance Plans",
    ],
    suggestedSystems: ["startup-modern", "contractor-pro"],
    palette: { primary: "#0e2433", secondary: "#2563eb", accent: "#f97316" },
    voiceNotes:
      "Urgent but never panicked. Lead with availability and response time. For shoppers, shift to engineering credibility: sizing, efficiency, honest math.",
  },

  plumbing: {
    id: "plumbing",
    name: "Plumbing",
    buyerPsychology:
      "Water is actively damaging their home, or they're dreading a big repipe quote. Speed, honesty, and tidiness are the brand.",
    positioningAngle: "Fast response, clean work, straight answers",
    sectionOrder: [
      "hero",
      "emergency-banner",
      "service-grid",
      "trust-bar",
      "process",
      "testimonials",
      "guarantee",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Plumbing problems end here",
      subheadline:
        "{name} answers fast across {city} — licensed plumbers, upfront pricing, and shoe covers at the door.",
      primaryCta: "Call a plumber now",
      secondaryCta: "Book online",
    },
    process: [
      { title: "Tell us what's happening", body: "Photos help. We'll tell you immediately if it's an emergency or can safely wait." },
      { title: "Upfront quote", body: "Flat-rate pricing before work begins — the number doesn't change mid-job." },
      { title: "Fix it right", body: "Licensed plumbers, quality parts, code-compliant work." },
      { title: "Leave it cleaner", body: "Drop cloths, shoe covers, and a spotless handoff." },
    ],
    faq: [
      { title: "Do you charge to come out?", body: "Our dispatch fee is credited toward the repair, so looking costs you nothing if we do the work." },
      { title: "Tank or tankless?", body: "Depends on your usage and gas line. We quote both honestly — tankless isn't always the right answer." },
      { title: "Can you find hidden leaks?", body: "Yes — acoustic and thermal detection finds leaks without opening walls blindly." },
      { title: "Are you licensed and insured?", body: "Fully licensed, bonded, and insured. Documentation comes with every estimate." },
    ],
    trustElements: ["Licensed & bonded", "Flat-rate upfront pricing", "Clean-home guarantee", "Real 24/7 dispatch"],
    defaultServices: ["Emergency Plumbing", "Drain Cleaning", "Water Heaters", "Leak Detection", "Repipes"],
    suggestedSystems: ["startup-modern", "premium-local"],
    palette: { primary: "#0f2b46", secondary: "#0ea5e9", accent: "#f59e0b" },
    voiceNotes: "Reassuring and immediate. Short sentences. Price transparency is the trust lever.",
  },

  electrical: {
    id: "electrical",
    name: "Electrical",
    buyerPsychology:
      "Safety-driven buyers. They're not price shopping a panel upgrade — they're making sure their house doesn't burn down and the work passes inspection.",
    positioningAngle: "Code-perfect safety with modern upgrades",
    sectionOrder: [
      "hero",
      "trust-bar",
      "service-grid",
      "stats",
      "certifications",
      "process",
      "testimonials",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Wired right. Inspected. Guaranteed.",
      subheadline:
        "{name} delivers code-perfect electrical work across {city} — from panel upgrades to EV chargers — by licensed master electricians.",
      primaryCta: "Get an electrical quote",
      secondaryCta: "Emergency? Call now",
    },
    stats: [
      { value: "100%", label: "inspection pass rate" },
      { value: "Master", label: "licensed electricians" },
      { value: "Same-wk", label: "EV charger installs" },
      { value: "Lifetime", label: "workmanship warranty" },
    ],
    faq: [
      { title: "Do I need a panel upgrade?", body: "If you have a 100A panel and you're adding EV charging or HVAC, probably. We'll do a load calculation and give you a straight answer." },
      { title: "Can you install my EV charger?", body: "Yes — we're certified installers for all major brands and handle the permit and inspection." },
      { title: "Are permits really necessary?", body: "For most panel and circuit work, yes — and unpermitted work bites you at home sale. We pull every required permit." },
      { title: "What's a warning sign I shouldn't ignore?", body: "Warm outlets, flickering on appliance start, breakers that won't reset. Any of these deserve a same-week look." },
    ],
    trustElements: ["Licensed master electricians", "Permits pulled, every time", "Lifetime workmanship warranty", "Background-checked techs"],
    defaultServices: ["Panel Upgrades", "EV Charger Installation", "Rewiring", "Lighting Design", "Troubleshooting"],
    suggestedSystems: ["vercel", "modern-industrial"],
    palette: { primary: "#101014", secondary: "#facc15", accent: "#60a5fa" },
    voiceNotes: "Precision and safety. Inspection-pass language. Zero hype — competence is the aesthetic.",
  },

  landscaping: {
    id: "landscaping",
    name: "Landscaping",
    buyerPsychology:
      "Buyers are imagining a transformed outdoor life — hosting, evenings outside, curb appeal. They buy the vision first, the maintenance second.",
    positioningAngle: "Outdoor transformation, designed then built",
    sectionOrder: [
      "hero",
      "before-after",
      "service-grid",
      "seasonal",
      "process",
      "gallery",
      "testimonials",
      "service-area",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Your yard, reimagined",
      subheadline:
        "{name} designs and builds outdoor spaces across {city} — landscapes you'll live in, not just look at.",
      primaryCta: "Start my design",
      secondaryCta: "Browse transformations",
    },
    process: [
      { title: "Walk the property", body: "We listen to how you want to use the space — then measure, photograph, and study sun and drainage." },
      { title: "Design", body: "A scaled plan with plantings, hardscape, and lighting you can react to before anything is dug." },
      { title: "Build", body: "One dedicated crew start to finish, with a foreman who calls you every day." },
      { title: "Care", body: "Seasonal maintenance keeps year one looking like day one." },
    ],
    faq: [
      { title: "Do you charge for design?", body: "Design fees are credited toward the build — so the plan effectively becomes free when we do the work." },
      { title: "When should I book?", body: "Design in winter, build in spring. Peak-season build slots fill 6–8 weeks out." },
      { title: "Can you work in phases?", body: "Absolutely — the master plan is built to be phased so the budget breathes." },
      { title: "What about irrigation?", body: "Designed in from the start, not retrofitted. Smart controllers come standard." },
    ],
    trustElements: ["Design-first process", "Dedicated single crew", "Plant warranty", "Licensed & insured"],
    defaultServices: ["Landscape Design", "Hardscaping & Patios", "Planting & Sod", "Outdoor Lighting", "Irrigation"],
    suggestedSystems: ["minimal-editorial", "premium-local"],
    palette: { primary: "#1a2e1f", secondary: "#4d7c5f", accent: "#d9a441" },
    voiceNotes:
      "Sensory and aspirational, grounded by a credible process. Write about evenings outside, not mulch.",
  },

  "pressure-washing": {
    id: "pressure-washing",
    name: "Pressure Washing",
    buyerPsychology:
      "An impulse-adjacent purchase triggered by visible grime. The before/after IS the product. Make quoting instant and the transformation undeniable.",
    positioningAngle: "Instant visual transformation, quoted in minutes",
    sectionOrder: [
      "hero",
      "before-after",
      "service-grid",
      "stats",
      "process",
      "testimonials",
      "service-area",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Like new. By this afternoon.",
      subheadline:
        "{name} restores driveways, siding, and roofs across {city} with pro-grade equipment and soft-wash systems that clean without damage.",
      primaryCta: "Get an instant quote",
      secondaryCta: "See the transformations",
    },
    stats: [
      { value: "10 min", label: "quote turnaround" },
      { value: "4,000 PSI", label: "commercial equipment" },
      { value: "Soft", label: "wash certified" },
      { value: "100%", label: "rain-date guarantee" },
    ],
    process: [
      { title: "Text us a photo", body: "Most quotes go out within minutes — no site visit needed for standard jobs." },
      { title: "We prep & protect", body: "Plants covered, outlets sealed, windows checked before any water flows." },
      { title: "The right pressure", body: "High pressure for concrete, soft wash for siding and roofs. The wrong choice causes damage — we never make it." },
      { title: "Walkthrough", body: "You inspect before we leave. Not thrilled? We re-treat on the spot." },
    ],
    faq: [
      { title: "Will pressure washing damage my siding?", body: "High pressure can — that's why siding and roofs get soft wash: low pressure plus detergents that do the work safely." },
      { title: "How do you quote so fast?", body: "Surface area plus surface type. A couple of photos and an address are usually all we need." },
      { title: "How long does it last?", body: "Driveways typically 12–18 months; house washes 1–2 years. Ask about our annual plan." },
      { title: "Do I need to be home?", body: "Nope — exterior access and a working spigot are all we need. You'll get before/after photos either way." },
    ],
    trustElements: ["Photo quotes in minutes", "Soft-wash certified", "Plant & property protection", "Re-treat guarantee"],
    defaultServices: ["House Washing", "Driveway & Concrete", "Roof Soft Washing", "Deck & Fence", "Commercial Exteriors"],
    suggestedSystems: ["framer", "startup-modern"],
    palette: { primary: "#06283d", secondary: "#1363df", accent: "#47b5ff" },
    voiceNotes: "High energy, visual, fast. Everything points at the before/after and the instant quote.",
  },

  cleaning: {
    id: "cleaning",
    name: "Cleaning",
    buyerPsychology:
      "Buyers are letting strangers into their home — trust and consistency outrank price. Recurring revenue means the site sells a relationship, not a one-off.",
    positioningAngle: "A spotless home on a schedule you never think about",
    sectionOrder: [
      "hero",
      "trust-bar",
      "packages",
      "service-grid",
      "process",
      "testimonials",
      "guarantee",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Come home to done",
      subheadline:
        "{name} delivers consistent, background-checked, supply-included cleaning across {city} — weekly, biweekly, or whenever you need a reset.",
      primaryCta: "Get my price",
      secondaryCta: "How it works",
    },
    process: [
      { title: "Price in 60 seconds", body: "Beds, baths, frequency — instant estimate, no walkthrough required." },
      { title: "Meet your team", body: "The same vetted team every visit, so they learn how you like things." },
      { title: "The checklist clean", body: "A published room-by-room checklist — you always know exactly what's included." },
      { title: "Rate every visit", body: "Anything below five stars gets a free re-clean. That's the deal." },
    ],
    faq: [
      { title: "Same cleaners every time?", body: "Yes — consistency is the whole point. Your team learns your home and your preferences." },
      { title: "Are you insured and background-checked?", body: "Every cleaner is background-checked, and we're fully bonded and insured." },
      { title: "Do I provide supplies?", body: "No — we bring professional, pet-safe products. Prefer your own? Just tell us." },
      { title: "What if I'm not happy?", body: "Tell us within 24 hours and we'll re-clean the area free. No interrogation." },
    ],
    trustElements: ["Background-checked teams", "Bonded & insured", "Published checklist", "Free re-clean guarantee"],
    defaultServices: ["Recurring House Cleaning", "Deep Cleaning", "Move-In / Move-Out", "Office Cleaning"],
    suggestedSystems: ["notion", "startup-modern"],
    palette: { primary: "#faf9f6", secondary: "#2f6f6a", accent: "#e9b44c" },
    voiceNotes: "Calm, warm, systematized. Checklists and guarantees do the persuading.",
  },

  "auto-detailing": {
    id: "auto-detailing",
    name: "Auto Detailing",
    buyerPsychology:
      "Enthusiasts and pride-of-ownership buyers. They respond to gloss, paint depth, and craft — a dark showroom aesthetic with macro shots, not minivan-with-vacuum.",
    positioningAngle: "Showroom obsession for people who love their cars",
    sectionOrder: [
      "hero",
      "gallery",
      "packages",
      "before-after",
      "process",
      "stats",
      "testimonials",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Deeper than showroom",
      subheadline:
        "{name} brings paint correction, ceramic coating, and obsessive interior work to {city}'s most-loved cars.",
      primaryCta: "Book my detail",
      secondaryCta: "View the work",
    },
    stats: [
      { value: "9H", label: "ceramic hardness" },
      { value: "5 yr", label: "coating warranty" },
      { value: "2-stage", label: "machine correction" },
      { value: "400+", label: "vehicles transformed" },
    ],
    process: [
      { title: "Decontaminate", body: "Foam, hand wash, iron remover, clay — the paint must be surgically clean before correction." },
      { title: "Correct", body: "Machine polishing measured with a paint-depth gauge. Swirls leave; clarity stays." },
      { title: "Protect", body: "Professional ceramic coating cured under infrared — hydrophobic for years, not weeks." },
      { title: "Maintain", body: "Wash protocol included, plus annual inspections to keep the warranty alive." },
    ],
    faq: [
      { title: "Is ceramic coating worth it?", body: "If you keep the car 3+ years, yes — it outlasts dozens of wax applications and makes every wash faster and safer." },
      { title: "How long does a full correction take?", body: "One to two days. Real correction is measured in passes per panel, not hours. We don't rush paint." },
      { title: "Can you fix swirl marks?", body: "Almost always — most swirls live in the clear coat and machine-polish out completely." },
      { title: "Do you do interiors?", body: "Full extraction, steam, leather conditioning — the inside gets the same obsession as the paint." },
    ],
    trustElements: ["Certified coating installer", "Paint-depth measured", "Insured studio", "Warranty-backed coatings"],
    defaultServices: ["Ceramic Coating", "Paint Correction", "Full Interior Detail", "Maintenance Washes", "PPF Consultation"],
    suggestedSystems: ["luxury-black", "vision-pro"],
    palette: { primary: "#0d0c0a", secondary: "#c9a96a", accent: "#8b9dc3" },
    voiceNotes:
      "Low, confident, obsessed with craft. Macro-photography energy. Never discount-y.",
  },

  painting: {
    id: "painting",
    name: "Painting",
    buyerPsychology:
      "Buyers fear mess, drips, and crews that vanish mid-job. Sell the prep, the protection, and the crisp line.",
    positioningAngle: "Flawless finishes from a crew you'd invite back",
    sectionOrder: [
      "hero",
      "before-after",
      "service-grid",
      "process",
      "trust-bar",
      "testimonials",
      "guarantee",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "The crisp line says everything",
      subheadline:
        "{name} delivers flawless interior and exterior painting across {city} — obsessive prep, premium paint, and a crew that respects your home.",
      primaryCta: "Get a painting quote",
      secondaryCta: "See our finishes",
    },
    process: [
      { title: "Color & sheen consult", body: "Large swatches on your actual walls — colors read differently in your light." },
      { title: "Protect everything", body: "Floors, furniture, fixtures — masked and covered before a can opens." },
      { title: "Prep like it matters", body: "Patch, sand, caulk, prime. Prep is 70% of a finish that lasts." },
      { title: "Final walkthrough", body: "Punch list together, touch-ups on the spot, labeled paint left for the future." },
    ],
    faq: [
      { title: "How do you protect my furniture?", body: "Everything is moved or covered with clean drop cloths and plastic — and we re-place it all when done." },
      { title: "What paint do you use?", body: "Premium lines from Sherwin-Williams and Benjamin Moore — and we list the exact product on your quote." },
      { title: "Interior in winter?", body: "Yes — interior is year-round. Exterior needs the right temps, so those book seasonally." },
      { title: "Touch-ups later?", body: "We leave labeled paint and our warranty covers peeling or flaking from application." },
    ],
    trustElements: ["Premium paint, named on the quote", "Full-home protection", "2-year finish warranty", "Background-checked crew"],
    defaultServices: ["Interior Painting", "Exterior Painting", "Cabinet Refinishing", "Drywall Repair", "Color Consultation"],
    suggestedSystems: ["minimal-editorial", "notion"],
    palette: { primary: "#f7f5f1", secondary: "#36454f", accent: "#c96f4a" },
    voiceNotes: "Meticulous and house-proud. The crisp line and the drop cloth are the heroes.",
  },

  fencing: {
    id: "fencing",
    name: "Fencing",
    buyerPsychology:
      "Privacy, pets, property lines. Buyers compare material options and worry about posts heaving in two winters. Show material expertise and set-in-concrete permanence.",
    positioningAngle: "Built straight, set deep, guaranteed for years",
    sectionOrder: [
      "hero",
      "service-grid",
      "stats",
      "gallery",
      "process",
      "testimonials",
      "financing",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Good fences, actually built well",
      subheadline:
        "{name} builds wood, vinyl, and ornamental fencing across {city} — posts set below frost line, rails true, gates that still swing right in year ten.",
      primaryCta: "Get a fence quote",
      secondaryCta: "Compare materials",
    },
    stats: [
      { value: "36\"+", label: "post depth" },
      { value: "10 yr", label: "workmanship warranty" },
      { value: "3–5 day", label: "typical install" },
      { value: "0°", label: "tolerance on gates" },
    ],
    faq: [
      { title: "Wood, vinyl, or metal?", body: "Wood wins on warmth and cost, vinyl on zero maintenance, ornamental on longevity. We quote your line in all three if you want." },
      { title: "How deep do posts go?", body: "Below frost line, in concrete — minimum 36 inches here. Shallow posts are why cheap fences lean by year three." },
      { title: "Do you handle property lines and permits?", body: "We work from your survey, handle HOA paperwork, and pull permits where required." },
      { title: "What about my dog during install?", body: "We can phase the work so your yard is never fully open overnight." },
    ],
    trustElements: ["Below-frost-line posts", "Surveyed lines, no disputes", "10-year workmanship warranty", "HOA & permit handling"],
    defaultServices: ["Privacy Fencing", "Vinyl Fencing", "Ornamental Iron", "Gates & Operators", "Fence Repair"],
    suggestedSystems: ["contractor-pro", "premium-local"],
    palette: { primary: "#252118", secondary: "#8b5a2b", accent: "#5a7d5a" },
    voiceNotes: "Craftsman-direct. Depth, plumb, square — construction details as proof.",
  },

  remodeling: {
    id: "remodeling",
    name: "Remodeling",
    buyerPsychology:
      "The highest-stakes purchase on this list. Buyers fear budget blowouts and ghost contractors. The site must feel like a firm: process, portfolio, communication.",
    positioningAngle: "Design-build certainty for the biggest rooms in your life",
    sectionOrder: [
      "hero",
      "gallery",
      "process",
      "service-grid",
      "testimonials",
      "team",
      "financing",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Remodeling without the horror story",
      subheadline:
        "{name} runs design-build remodels across {city} with fixed proposals, weekly communication, and one accountable team from sketch to final reveal.",
      primaryCta: "Book a consultation",
      secondaryCta: "Tour the portfolio",
    },
    process: [
      { title: "Discovery", body: "Goals, budget range, and feasibility — honestly assessed before anyone falls in love with a rendering." },
      { title: "Design & fixed proposal", body: "Drawings, selections, and a real number. Allowances are spelled out, not hidden." },
      { title: "Build", body: "Dedicated project manager, weekly updates, and a live schedule you can check anytime." },
      { title: "Reveal & warranty", body: "Walkthrough, punch list, and a workmanship warranty that actually gets honored." },
    ],
    faq: [
      { title: "How do you prevent budget overruns?", body: "Fixed proposals with named allowances and a contingency we agree on up front. Changes only happen through signed change orders." },
      { title: "How long does a kitchen take?", body: "Typically 6–10 weeks of construction after design and ordering. We give you the full calendar before demo day." },
      { title: "Can we live in the house?", body: "Usually yes — we contain dust, maintain a working space where possible, and clean daily." },
      { title: "Who's actually on site?", body: "Our crew and our long-term trade partners, run by a PM whose name and cell you'll have." },
    ],
    trustElements: ["Fixed-price proposals", "Weekly written updates", "Licensed & insured", "Portfolio of completed work"],
    defaultServices: ["Kitchen Remodels", "Bathroom Remodels", "Basement Finishing", "Additions", "Whole-Home Renovation"],
    suggestedSystems: ["high-end-agency", "minimal-editorial"],
    palette: { primary: "#1c1a17", secondary: "#a08c6b", accent: "#3f5e5a" },
    voiceNotes: "Architectural calm. Process as the product. Photography-forward, zero clip art energy.",
  },

  concrete: {
    id: "concrete",
    name: "Concrete",
    buyerPsychology:
      "Permanence buyers — a driveway is a 30-year decision. They want crews that show up with the right mix, proper base prep, and clean saw cuts.",
    positioningAngle: "Poured right the first time, because there's no second time",
    sectionOrder: [
      "hero",
      "service-grid",
      "stats",
      "process",
      "gallery",
      "testimonials",
      "guarantee",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Concrete is permanent. So are mistakes.",
      subheadline:
        "{name} pours driveways, patios, and foundations across {city} with engineered base prep, the right PSI mix, and joints cut on time, every time.",
      primaryCta: "Get a concrete quote",
      secondaryCta: "See recent pours",
    },
    stats: [
      { value: "4,000+", label: "PSI mixes" },
      { value: "6\"", label: "compacted base" },
      { value: "Same-day", label: "joint cutting" },
      { value: "25 yr", label: "expected life" },
    ],
    faq: [
      { title: "Why do driveways crack?", body: "Bad base prep and late joint cutting, mostly. We compact six inches of base and cut control joints the same day — that's where longevity comes from." },
      { title: "Stamped or broom finish?", body: "Stamped looks incredible and costs more; broom is the durability workhorse. We'll show you both on real jobs nearby." },
      { title: "When can I drive on it?", body: "Foot traffic in 24–48 hours, vehicles at 7 days. Concrete reaches design strength at 28." },
      { title: "Winter pours?", body: "Possible with additives and blankets, but if it can wait for better weather, we'll tell you straight." },
    ],
    trustElements: ["Engineered base prep", "Specified PSI on the quote", "Same-day control joints", "Crack warranty"],
    defaultServices: ["Driveways", "Patios & Walkways", "Stamped Concrete", "Foundations & Slabs", "Concrete Removal"],
    suggestedSystems: ["modern-industrial", "contractor-pro"],
    palette: { primary: "#1b1d20", secondary: "#7d8590", accent: "#d97706" },
    voiceNotes: "Blunt expertise. The mix design and base prep are the marketing.",
  },

  "pest-control": {
    id: "pest-control",
    name: "Pest Control",
    buyerPsychology:
      "Disgust plus urgency, then a desire for it to never happen again. Resolve fast, then convert to prevention plans.",
    positioningAngle: "Gone today, guaranteed gone tomorrow",
    sectionOrder: [
      "hero",
      "emergency-banner",
      "service-grid",
      "process",
      "packages",
      "testimonials",
      "guarantee",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Whatever it is — it's leaving today",
      subheadline:
        "{name} protects {city} homes with same-day treatment, pet-safe products, and quarterly plans that keep pests from coming back.",
      primaryCta: "Book same-day service",
      secondaryCta: "See protection plans",
    },
    process: [
      { title: "Inspect", body: "We find the source and entry points, not just the visible problem." },
      { title: "Treat", body: "Targeted, pet- and kid-safe treatments — interior and perimeter." },
      { title: "Seal", body: "Entry points closed so the next generation can't move in." },
      { title: "Protect", body: "Quarterly barrier treatments with free re-service between visits." },
    ],
    faq: [
      { title: "Is it safe for pets and kids?", body: "Yes — we use targeted, EPA-registered products and tell you exactly what's applied and any re-entry times." },
      { title: "One-time or recurring?", body: "One-time fixes the outbreak; quarterly keeps it fixed. Plans include free re-service if anything returns between visits." },
      { title: "How fast can you come?", body: "Same-day in most of our service area for active infestations." },
      { title: "Do you handle termites?", body: "Yes — inspections, baiting systems, and treatment, with documentation for real estate transactions." },
    ],
    trustElements: ["Same-day service", "Pet & kid-safe products", "Free re-service guarantee", "Licensed applicators"],
    defaultServices: ["General Pest Control", "Quarterly Protection Plans", "Termite Treatment", "Rodent Exclusion", "Mosquito Reduction"],
    suggestedSystems: ["startup-modern", "premium-local"],
    palette: { primary: "#11261b", secondary: "#2e7d4f", accent: "#f4a259" },
    voiceNotes: "Decisive and reassuring. Speed first, science second, prevention close.",
  },

  "garage-doors": {
    id: "garage-doors",
    name: "Garage Doors",
    buyerPsychology:
      "Half emergencies (car trapped, spring snapped), half curb-appeal upgrades. Serve both: speed for repairs, visualization for replacements.",
    positioningAngle: "Fixed today, or upgraded for the next twenty years",
    sectionOrder: [
      "hero",
      "emergency-banner",
      "service-grid",
      "before-after",
      "stats",
      "testimonials",
      "financing",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "Stuck door? We're already on the way.",
      subheadline:
        "{name} repairs springs, openers, and tracks across {city} — usually same-day — and installs doors that transform the front of your home.",
      primaryCta: "Get same-day repair",
      secondaryCta: "Browse new doors",
    },
    stats: [
      { value: "Same-day", label: "spring replacement" },
      { value: "Lifetime", label: "spring options" },
      { value: "1 day", label: "full installs" },
      { value: "4.9★", label: "average rating" },
    ],
    faq: [
      { title: "My spring snapped — is it dangerous?", body: "Yes, leave it alone. Torsion springs hold serious tension. We replace them same-day with high-cycle springs." },
      { title: "Repair the opener or replace it?", body: "If it's 12+ years old, replacement usually wins — modern units are quieter and have battery backup." },
      { title: "Does a new door really change curb appeal?", body: "It's consistently a top-ROI exterior upgrade. We'll mock up door styles on a photo of your home." },
      { title: "Do you stock parts on the truck?", body: "Springs, rollers, openers, and most common parts — the goal is one visit, fixed." },
    ],
    trustElements: ["Same-day repairs", "High-cycle springs", "Stocked trucks", "Free door mockups"],
    defaultServices: ["Spring Replacement", "Opener Repair & Install", "New Door Installation", "Track & Roller Repair"],
    suggestedSystems: ["contractor-pro", "startup-modern"],
    palette: { primary: "#15191e", secondary: "#c0392b", accent: "#95a5a6" },
    voiceNotes: "Fast and capable. Trucks-are-stocked confidence.",
  },
};

/** Sensible generic profile for custom industries — still strategic, never lorem. */
function customProfile(name: string): IndustryProfile {
  return {
    id: "custom",
    name: name || "Local Business",
    buyerPsychology:
      "Buyers want fast confidence: who you are, proof you're good, and an easy next step.",
    positioningAngle: "The clear local choice, proven and easy to hire",
    sectionOrder: [
      "hero",
      "trust-bar",
      "service-grid",
      "process",
      "testimonials",
      "gallery",
      "guarantee",
      "faq",
      "final-cta",
    ],
    hero: {
      headline: "The {service} team {city} recommends",
      subheadline:
        "{name} delivers {service} across {city} with transparent pricing, careful work, and a guarantee we put in writing.",
      primaryCta: "Get a free quote",
      secondaryCta: "See our work",
    },
    process: [
      { title: "Tell us what you need", body: "A quick call or form — we'll ask the right questions and give you a clear price." },
      { title: "We do the work", body: "On time, tidy, and exactly as quoted." },
      { title: "Walkthrough", body: "You approve everything before we call it done." },
      { title: "Guaranteed", body: "If something's not right, we come back and make it right." },
    ],
    faq: [
      { title: "Do you offer free estimates?", body: "Always — with itemized pricing and zero pressure." },
      { title: "Are you licensed and insured?", body: "Fully — documentation comes with every estimate." },
      { title: "How soon can you start?", body: "Most projects are scheduled within one to two weeks. Ask about priority slots." },
      { title: "What does your guarantee cover?", body: "Our workmanship, in writing. If it's not right, we return and fix it." },
    ],
    trustElements: ["Licensed & insured", "Written guarantee", "Transparent pricing", "Local & accountable"],
    defaultServices: ["Core Service", "Maintenance", "Repairs", "Consultations"],
    suggestedSystems: ["premium-local", "startup-modern"],
    palette: { primary: "#16202a", secondary: "#2563eb", accent: "#f59e0b" },
    voiceNotes: "Clear, local, proof-driven.",
  };
}

export function getIndustryProfile(
  industry: IndustryId,
  customName = "",
): IndustryProfile {
  if (industry === "custom") return customProfile(customName);
  return PROFILES[industry];
}

export const INDUSTRY_PROFILES = PROFILES;
