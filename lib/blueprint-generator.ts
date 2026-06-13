import type {
  BlueprintSection,
  DesignBrief,
  DiscoveryBrief,
  GoalId,
  PagePlan,
  SectionType,
  SiteBlueprint,
} from "./types";
import { DESIGN_SYSTEMS, GOALS, PAGES, PERSONALITIES, getIndustryName } from "./discovery";
import { getIndustryProfile, type IndustryProfile } from "./industry-engine";
import { buildDesignBrief } from "./design-brief";

/* ==========================================================================
   Blueprint engine.
   Deterministic, key-free generation path. Composes the discovery brief
   with the industry profile into a full strategy + wireframe — so the
   product works completely offline, and AI output has a strong skeleton
   to land on.
   ========================================================================== */

function fill(text: string, brief: DiscoveryBrief): string {
  const name = brief.business.businessName.trim() || "Your company";
  const city = brief.seo.targetCity.trim() || brief.business.city.trim() || "your area";
  const service =
    brief.business.primaryService.trim() ||
    getIndustryProfile(brief.business.industry, brief.business.customIndustry)
      .defaultServices[0];
  return text
    .replaceAll("{name}", name)
    .replaceAll("{city}", city)
    .replaceAll("{service}", service.toLowerCase());
}

function services(brief: DiscoveryBrief, profile: IndustryProfile): string[] {
  const all = [
    brief.business.primaryService,
    ...brief.business.secondaryServices,
  ]
    .map((s) => s.trim())
    .filter(Boolean);
  return all.length ? all : profile.defaultServices;
}

/* ---------- Brand strategy ---------- */

function buildBrandStrategy(brief: DiscoveryBrief, profile: IndustryProfile) {
  const name = brief.business.businessName || profile.name;
  const city = brief.business.city || "the local market";
  const personalities = brief.brand.personalities
    .map((id) => PERSONALITIES.find((p) => p.id === id)?.name.toLowerCase())
    .filter(Boolean) as string[];
  if (brief.brand.customPersonality.trim())
    personalities.push(brief.brand.customPersonality.trim().toLowerCase());

  const years = brief.business.yearsInBusiness;
  const experience =
    years && years !== "Just starting"
      ? `${years} of proven work`
      : "a craft-first operation";

  const differentiators = [
    brief.brand.differentiator,
    brief.advanced.uniqueSellingPoints,
    brief.brand.whyChooseUs,
  ]
    .map((s) => s.trim())
    .filter(Boolean);

  const audienceParts: string[] = [];
  if (brief.business.residentialServices) audienceParts.push("homeowners");
  if (brief.business.commercialServices) audienceParts.push("commercial clients");
  const audience = `${audienceParts.join(" and ") || "customers"} in ${
    brief.business.serviceArea || city
  } who ${profile.buyerPsychology.split(".")[0].toLowerCase().replace(/^buyers /, "")}.`;

  const voiceWords = personalities.length
    ? personalities.slice(0, 3).join(", ")
    : "confident, local, proof-driven";

  return {
    positioning: `${name}: ${profile.positioningAngle.toLowerCase()} — ${experience} positioned against generic competitors in ${city}.`,
    valueProposition:
      differentiators[0] ||
      fill(profile.hero.subheadline, brief).replace(/\.$/, "") + ".",
    audience,
    voice: `${voiceWords[0].toUpperCase()}${voiceWords.slice(1)}. ${
      brief.brand.tone ? `Tone: ${brief.brand.tone.toLowerCase()}. ` : ""
    }${profile.voiceNotes}`,
    messagingPillars: [
      profile.positioningAngle,
      brief.brand.threeWords.trim() || profile.trustElements[0],
      brief.brand.emotions.trim()
        ? `Make customers feel: ${brief.brand.emotions.trim()}`
        : profile.trustElements[1] ?? "Proof over promises",
    ],
    differentiators: differentiators.length
      ? differentiators
      : profile.trustElements.slice(0, 3),
  };
}

/* ---------- Design direction ---------- */

function buildDesignDirection(brief: DiscoveryBrief, profile: IndustryProfile) {
  const chosen = brief.designSystems.length
    ? brief.designSystems
    : profile.suggestedSystems;
  const systems = chosen
    .map((id) => DESIGN_SYSTEMS.find((d) => d.id === id))
    .filter(Boolean);
  const systemNames = systems.map((s) => s!.name).join(" × ");

  const personalityNote = brief.brand.personalities.length
    ? ` tuned for a ${brief.brand.personalities.slice(0, 2).join(", ")} personality`
    : "";

  return {
    direction: `${systemNames || "Premium Local"} direction${personalityNote} — ${
      systems[0]?.blurb.toLowerCase() ?? "trust-forward and modern"
    }. Layout architecture follows the ${profile.name.toLowerCase()} buying journey: ${profile.positioningAngle.toLowerCase()}.`,
    typography:
      systems[0]?.id === "luxury-black" || systems[0]?.id === "minimal-editorial"
        ? "High-contrast serif display over a quiet grotesque body."
        : systems[0]?.id === "contractor-pro" || systems[0]?.id === "modern-industrial"
          ? "Heavy condensed display, utilitarian body, generous numerals."
          : "Refined grotesque display with tight tracking; readable humanist body.",
    palette: {
      primary: brief.visual.primaryColor || profile.palette.primary,
      secondary: brief.visual.secondaryColor || profile.palette.secondary,
      accent: brief.visual.accentColor || profile.palette.accent,
      background:
        brief.visual.backgroundStyle.toLowerCase().includes("light") ||
        brief.visual.backgroundStyle.toLowerCase().includes("white")
          ? "#faf9f7"
          : "#0b0c0f",
    },
    motion:
      brief.visual.animations ||
      "Calm reveals on scroll, soft parallax in the hero, light sweeps on primary CTAs.",
    imagery: brief.content.hasProjectPhotos
      ? "Built around your real project photography — full-bleed where the work is the proof."
      : "Art-directed placeholders with a shot list, so real photos drop in without redesign.",
  };
}

/* ---------- Homepage sections ---------- */

function sectionFor(
  type: SectionType,
  brief: DiscoveryBrief,
  profile: IndustryProfile,
): BlueprintSection | null {
  const svc = services(brief, profile);
  const name = brief.business.businessName || profile.name;
  const city = brief.seo.targetCity || brief.business.city || "your area";
  const industryName = getIndustryName(brief).toLowerCase();

  switch (type) {
    case "hero":
      return {
        type,
        eyebrow: [city, brief.business.state].filter(Boolean).join(", ") || profile.name,
        title: fill(profile.hero.headline, brief),
        body: fill(profile.hero.subheadline, brief),
        cta: {
          label: fill(profile.hero.primaryCta, brief),
          secondary: fill(profile.hero.secondaryCta, brief),
        },
        rationale: `Hero leads with ${profile.positioningAngle.toLowerCase()} — the angle this industry's buyers respond to.`,
      };

    case "emergency-banner":
      if (!brief.business.emergencyServices && !profile.sectionOrder.includes("emergency-banner"))
        return null;
      if (!brief.business.emergencyServices) return null;
      return {
        type,
        title: "Emergency? We answer 24/7.",
        body: `Live dispatch across ${city} — nights, weekends, holidays.`,
        cta: { label: "Call now" },
        rationale: "Emergency services flagged in the brief — urgent visitors get a path in the first viewport.",
      };

    case "trust-bar":
      return {
        type,
        items: profile.trustElements.map((t) => ({ title: t, body: "" })),
        rationale: "Immediate credibility strip — answers 'are these people legit' before the first scroll.",
      };

    case "before-after":
      return {
        type,
        eyebrow: "The transformation",
        title:
          profile.id === "auto-detailing"
            ? "Paint, corrected"
            : profile.id === "landscaping"
              ? "From yard to landscape"
              : "Before & after",
        body: brief.content.hasBeforeAfter
          ? "Your real before-and-after pairs, presented with an interactive reveal."
          : "We'll structure this around before/after pairs — your strongest sales asset. Shot list included.",
        items: svc.slice(0, 3).map((s) => ({
          title: s,
          body: `${s} — before & after`,
        })),
        rationale: "Visual proof converts better than copy in this industry; placed high deliberately.",
      };

    case "service-grid":
      return {
        type,
        eyebrow: "What we do",
        title: `${industryName.charAt(0).toUpperCase() + industryName.slice(1)} services in ${city}`,
        items: svc.slice(0, 6).map((s) => ({
          title: s,
          body: `${s} handled end-to-end — quoted clearly, executed by ${name}'s own crew, and covered by our guarantee.`,
        })),
        rationale: "Each service gets its own entry — these become landing pages for local SEO.",
      };

    case "process":
      if (!profile.process) return null;
      return {
        type,
        eyebrow: "How it works",
        title: "A process you can see from the outside",
        items: profile.process.map((p) => ({ title: p.title, body: p.body })),
        rationale: "Transparent process reduces perceived risk — the main objection for considered purchases.",
      };

    case "stats":
      if (!profile.stats) return null;
      return {
        type,
        stats: profile.stats,
        rationale: "Hard numbers signal operational maturity — chosen specifically for this trade.",
      };

    case "insurance":
      return {
        type,
        eyebrow: "Insurance claims",
        title: "We speak insurance, so you don't have to",
        body: `Storm damage claims are a maze. ${name} documents to insurer standards, meets the adjuster on your roof, and walks the claim with you start to finish.`,
        items: [
          { title: "Inspection report", body: "Photo documentation written to insurer standards." },
          { title: "Adjuster meeting", body: "We're on site when your adjuster is." },
          { title: "Claim to completion", body: "Supplements, scheduling, and paperwork handled." },
        ],
        rationale: "Insurance fluency is the #1 differentiator for storm-driven roofing buyers.",
      };

    case "financing": {
      const hasFinancing = brief.advanced.financingOptions.trim();
      return {
        type,
        eyebrow: "Financing",
        title: "Pay for it like a utility bill",
        body:
          hasFinancing ||
          "Flexible monthly options with fast approval — so the right choice doesn't have to wait for the perfect month.",
        cta: { label: "Check my options" },
        rationale: "Financing visibility raises average ticket size on big-ticket projects.",
      };
    }

    case "packages": {
      const tiers = svc.slice(0, 3);
      return {
        type,
        eyebrow: "Packages",
        title: "Pick your level",
        items: tiers.map((s, i) => ({
          title: s,
          body: `A clearly scoped ${s.toLowerCase()} package — you know exactly what's included before you book.`,
          meta: i === 1 ? "Most popular" : undefined,
        })),
        rationale: "Tiered packaging anchors price and simplifies the buying decision.",
      };
    }

    case "seasonal":
      return {
        type,
        eyebrow: "Through the seasons",
        title: "A yard for all four seasons",
        items: [
          { title: "Spring", body: "Cleanups, mulch, planting — the season everything starts." },
          { title: "Summer", body: "Maintenance, irrigation tuning, outdoor living at its peak." },
          { title: "Fall", body: "Leaf programs, aeration, overseeding for next year's lawn." },
          { title: "Winter", body: "Design season — plan now, build first in spring." },
        ],
        rationale: "Seasonal framing creates year-round demand instead of a spring-only spike.",
      };

    case "service-area": {
      const cities = brief.seo.additionalCities
        .split(/[,\n]/)
        .map((c) => c.trim())
        .filter(Boolean);
      const list = [city, ...cities].slice(0, 8);
      return {
        type,
        eyebrow: "Where we work",
        title: `Proudly serving ${city}${cities.length ? " and beyond" : ""}`,
        items: list.map((c) => ({ title: c, body: "" })),
        rationale: "Named service areas reinforce local SEO targets and reassure edge-of-area visitors.",
      };
    }

    case "testimonials":
      return {
        type,
        eyebrow: "Word of mouth",
        title: `What ${city} says`,
        items: [
          {
            title: "Jordan M.",
            body: `“${name} was unbelievable — on time, tidy, and the result looks better than we imagined. Easily the best contractor experience we've had in ${city}.”`,
            meta: "Verified customer",
          },
          {
            title: "Sam K.",
            body: `“Clear quote, zero surprises, and the crew treated our place like their own. We've already referred two neighbors.”`,
            meta: "Verified customer",
          },
        ],
        body: brief.content.hasTestimonials || brief.content.hasReviews
          ? "Structured for your real reviews — these placeholders swap out one-for-one."
          : "Placeholder voice-of-customer copy — we'll help you collect the real thing at handoff.",
        rationale: "Social proof adjacent to the conversion path, not buried at the bottom.",
      };

    case "gallery":
      return {
        type,
        eyebrow: "Recent work",
        title: profile.id === "auto-detailing" ? "The showroom" : "Recent projects",
        items: svc.slice(0, 6).map((s, i) => ({
          title: s,
          body: i % 2 === 0 ? `${s} — completed in ${city}` : `Detail: ${s.toLowerCase()}`,
        })),
        rationale: brief.content.hasProjectPhotos
          ? "Your project photography, art-directed full-bleed."
          : "Gallery scaffold with a shot list — real photos drop in without redesign.",
      };

    case "certifications":
      return {
        type,
        eyebrow: "Credentials",
        title: "Certified, licensed, verifiable",
        items: profile.trustElements.map((t) => ({ title: t, body: "" })),
        rationale: brief.content.hasCertifications
          ? "Your real certifications, displayed with verification links."
          : "Credential strip — populated with your licenses and certifications.",
      };

    case "guarantee": {
      const g = brief.advanced.guarantees.trim();
      return {
        type,
        eyebrow: "Our promise",
        title: g ? "Guaranteed, in writing" : "If it's not right, we make it right",
        body:
          g ||
          `Every ${name} project is covered by a written workmanship guarantee. If something isn't right, we come back and fix it — no fine print, no fight.`,
        rationale: "A concrete guarantee converts fence-sitters; written guarantees outperform star ratings.",
      };
    }

    case "team":
      return {
        type,
        eyebrow: "Who shows up",
        title: "The people behind the work",
        body: `${name} is ${
          brief.business.teamSize === "Owner-operated"
            ? "owner-operated — the person who quotes your project is the person responsible for it"
            : `a team of ${brief.business.teamSize || "dedicated professionals"} — every member background-checked and accountable`
        }.`,
        rationale: "Faces reduce hiring anxiety for in-home services.",
      };

    case "faq":
      return {
        type,
        eyebrow: "Good questions",
        title: "Asked constantly, answered honestly",
        items: profile.faq,
        rationale: "Industry-true objections handled in the customer's own words — also strong SEO surface.",
      };

    case "final-cta": {
      const offer = brief.advanced.specialOffers.trim();
      return {
        type,
        title: offer ? offer : fill("Ready when you are", brief),
        body: `Get a fast, free, no-pressure quote from ${name}. Most estimates delivered within 24 hours.`,
        cta: { label: fill(profile.hero.primaryCta, brief) },
        rationale: "Single, unmissable closing action — restating the primary goal of the page.",
      };
    }
  }
}

function buildHomepage(brief: DiscoveryBrief, profile: IndustryProfile): BlueprintSection[] {
  const order = [...profile.sectionOrder];

  // The brief reshapes the architecture — not just the copy.
  if (brief.business.emergencyServices && !order.includes("emergency-banner")) {
    order.splice(1, 0, "emergency-banner");
  }
  if (brief.advanced.financingOptions.trim() && !order.includes("financing")) {
    order.splice(order.length - 2, 0, "financing");
  }
  if (brief.advanced.guarantees.trim() && !order.includes("guarantee")) {
    order.splice(order.length - 2, 0, "guarantee");
  }
  if (brief.content.hasCertifications && !order.includes("certifications")) {
    order.splice(order.length - 3, 0, "certifications");
  }
  if (brief.content.hasBeforeAfter && !order.includes("before-after")) {
    order.splice(2, 0, "before-after");
  }

  return order
    .map((t) => sectionFor(t, brief, profile))
    .filter((s): s is BlueprintSection => s !== null);
}

/* ---------- Site structure ---------- */

function buildStructure(brief: DiscoveryBrief, profile: IndustryProfile): PagePlan[] {
  const svc = services(brief, profile);
  const city = brief.seo.targetCity || brief.business.city || "your area";

  const purposes: Record<string, { purpose: string; sections: string[] }> = {
    home: {
      purpose: "Convert — the full industry-specific architecture above.",
      sections: ["Everything in the homepage wireframe"],
    },
    about: {
      purpose: "Build trust through story, team, and credentials.",
      sections: ["Origin story", "Team & credentials", "Values", "Service area", "CTA"],
    },
    services: {
      purpose: `Hub page linking to individual ${profile.name.toLowerCase()} service pages.`,
      sections: ["Service index", ...svc.slice(0, 4).map((s) => `${s} (own page)`), "Cross-sell CTA"],
    },
    gallery: {
      purpose: "Visual proof, filterable by service.",
      sections: ["Filterable grid", "Before/after pairs", "Project stories", "CTA"],
    },
    reviews: {
      purpose: "Aggregate social proof with schema markup for stars in search.",
      sections: ["Rating summary", "Review wall", "Video testimonials", "Review CTA"],
    },
    faq: {
      purpose: "Handle objections and capture long-tail search.",
      sections: ["Categorized questions", "Schema markup", "Still-have-questions CTA"],
    },
    blog: {
      purpose: `Local SEO engine — guides and project stories targeting ${city}.`,
      sections: ["Article index", "Category hubs", "Newsletter capture"],
    },
    contact: {
      purpose: "Zero-friction conversion: form, phone, map, hours.",
      sections: ["Quote form", "Click-to-call", "Map & service area", "Hours & response time"],
    },
    careers: {
      purpose: "Recruit crew with culture and pay transparency.",
      sections: ["Why work here", "Open roles", "Benefits", "Application form"],
    },
    financing: {
      purpose: "Remove price objections with payment options.",
      sections: ["Plan comparison", "Approval process", "FAQ", "Apply CTA"],
    },
    commercial: {
      purpose: "B2B-specific page: capabilities, compliance, account management.",
      sections: ["Commercial capabilities", "Case studies", "Compliance & insurance", "RFP CTA"],
    },
    residential: {
      purpose: "Homeowner-focused page with residential proof and offers.",
      sections: ["Residential services", "Neighborhood proof", "Offers", "Quote CTA"],
    },
  };

  const plans: PagePlan[] = brief.pages
    .filter((p) => p !== "custom")
    .map((p) => {
      const meta = PAGES.find((x) => x.id === p);
      const d = purposes[p] ?? { purpose: "Supporting page.", sections: ["Content", "CTA"] };
      return { id: p, title: meta?.name ?? p, purpose: d.purpose, sections: d.sections };
    });

  if (brief.pages.includes("custom") && brief.customPage.trim()) {
    plans.push({
      id: "custom",
      title: brief.customPage.trim(),
      purpose: "Custom page from your brief.",
      sections: ["Hero", "Content blocks", "CTA"],
    });
  }
  return plans;
}

/* ---------- CTA + SEO strategy ---------- */

function buildCtaStrategy(brief: DiscoveryBrief, profile: IndustryProfile) {
  const goals: GoalId[] = brief.goals.length ? brief.goals : ["get-leads"];
  const goalNames = goals
    .map((g) => GOALS.find((x) => x.id === g)?.name.toLowerCase())
    .filter(Boolean);

  const primary = goals.includes("book-appointments")
    ? "Book an appointment"
    : goals.includes("book-calls")
      ? "Book a call"
      : goals.includes("generate-quotes")
        ? fill(profile.hero.primaryCta, brief)
        : fill(profile.hero.primaryCta, brief);

  return {
    primary,
    secondary: fill(profile.hero.secondaryCta, brief),
    strategy: `Primary action optimized for ${goalNames.join(" + ") || "lead capture"}. One dominant CTA per viewport; secondary actions are visually quiet so the main path never competes with itself.${
      brief.business.emergencyServices
        ? " Emergency phone path is persistent (sticky header + banner) for urgent traffic."
        : ""
    }`,
    placements: [
      "Hero — primary + secondary",
      ...(brief.business.emergencyServices ? ["Sticky emergency call bar"] : []),
      "After proof sections (mid-scroll)",
      "Final CTA block",
      "Sticky mobile action bar",
    ],
  };
}

function buildSeoStrategy(brief: DiscoveryBrief, profile: IndustryProfile) {
  const name = brief.business.businessName || profile.name;
  const city = brief.seo.targetCity || brief.business.city || "Your City";
  const industryName = getIndustryName(brief);
  const svc = services(brief, profile);

  const extraCities = brief.seo.additionalCities
    .split(/[,\n]/)
    .map((c) => c.trim())
    .filter(Boolean);

  const userKeywords = brief.seo.keywords
    .split(/[,\n]/)
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const rankServices = brief.seo.servicesToRank
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const keywords = [
    `${industryName.toLowerCase()} ${city.toLowerCase()}`,
    ...userKeywords,
    ...(rankServices.length ? rankServices : svc.slice(0, 3)).map(
      (s) => `${s.toLowerCase()} ${city.toLowerCase()}`,
    ),
    `best ${industryName.toLowerCase()} near me`,
  ].slice(0, 10);

  return {
    title: `${name} | ${industryName} in ${city}`.slice(0, 60),
    description: `${name} provides ${svc.slice(0, 3).join(", ").toLowerCase()} in ${city}. ${
      profile.trustElements[0]
    }. Free quotes — call today.`.slice(0, 160),
    keywords: Array.from(new Set(keywords)),
    localPages: [
      `${industryName} in ${city}`,
      ...extraCities.map((c) => `${industryName} in ${c}`),
      ...(rankServices.length ? rankServices : svc.slice(0, 3)).map(
        (s) => `${s} — ${city}`,
      ),
    ].slice(0, 8),
    strategy: `Hub-and-spoke local SEO: the homepage targets "${industryName.toLowerCase()} ${city.toLowerCase()}", each service gets a dedicated page, and each additional city gets a location page. Review schema on the reviews page puts stars in search results.${
      brief.pages.includes("blog") ? " The blog targets long-tail questions from the FAQ research." : ""
    }`,
  };
}

/* ---------- Entry point ---------- */

/**
 * Phase 2 of the pipeline. A design brief (Phase 1) is required input —
 * when none is passed, the engine produces one first, so the website is
 * always built FROM a design brief, never directly from user input.
 */
export function generateBlueprint(
  brief: DiscoveryBrief,
  designBrief?: DesignBrief,
): SiteBlueprint {
  const profile = getIndustryProfile(
    brief.business.industry,
    brief.business.customIndustry,
  );
  const db = designBrief ?? buildDesignBrief(brief);

  const brand = buildBrandStrategy(brief, profile);
  const design = buildDesignDirection(brief, profile);

  return {
    // The design brief is the source of truth for strategy + direction.
    brand: {
      ...brand,
      positioning: db.brandStrategy.positioning,
      audience: db.brandStrategy.audience,
      voice: db.brandStrategy.voice,
      messagingPillars: db.brandStrategy.pillars,
    },
    design: {
      ...design,
      direction: db.designLanguage,
      typography: `${db.typographyRules.display} / ${db.typographyRules.body}`,
      palette: {
        primary: db.colorSystem.primary,
        secondary: db.colorSystem.secondary,
        accent: db.colorSystem.accent,
        background: db.colorSystem.background,
      },
      motion: db.motionRules.character,
      imagery: db.visualIdentity.imagery,
    },
    structure: { pages: buildStructure(brief, profile) },
    homepage: buildHomepage(brief, profile),
    ctaStrategy: {
      ...buildCtaStrategy(brief, profile),
      strategy: db.conversionStrategy.strategy,
    },
    seo: buildSeoStrategy(brief, profile),
    trust: profile.trustElements,
  };
}
