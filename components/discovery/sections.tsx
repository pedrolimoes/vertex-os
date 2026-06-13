"use client";

import type {
  DesignSystemId,
  DiscoveryBrief,
  GoalId,
  IndustryId,
  PageId,
  PersonalityId,
} from "@/lib/types";
import {
  ANIMATION_STYLES,
  BACKGROUND_STYLES,
  BUTTON_STYLES,
  CARD_STYLES,
  DESIGN_SYSTEMS,
  GOALS,
  INDUSTRIES,
  PAGES,
  PERSONALITIES,
  TEAM_SIZES,
  TONES,
  YEARS_OPTIONS,
  type SectionId,
} from "@/lib/discovery";
import {
  ChipGroup,
  ColorField,
  Field,
  ListField,
  OptionCard,
  TextAreaField,
  TextField,
  UploadTile,
  YesNoRow,
} from "./primitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface SectionProps {
  brief: DiscoveryBrief;
  setBrief: React.Dispatch<React.SetStateAction<DiscoveryBrief>>;
}

function usePatch(setBrief: SectionProps["setBrief"]) {
  return {
    business: (p: Partial<DiscoveryBrief["business"]>) =>
      setBrief((b) => ({ ...b, business: { ...b.business, ...p } })),
    brand: (p: Partial<DiscoveryBrief["brand"]>) =>
      setBrief((b) => ({ ...b, brand: { ...b.brand, ...p } })),
    visual: (p: Partial<DiscoveryBrief["visual"]>) =>
      setBrief((b) => ({ ...b, visual: { ...b.visual, ...p } })),
    competitors: (p: Partial<DiscoveryBrief["competitors"]>) =>
      setBrief((b) => ({ ...b, competitors: { ...b.competitors, ...p } })),
    content: (p: Partial<DiscoveryBrief["content"]>) =>
      setBrief((b) => ({ ...b, content: { ...b.content, ...p } })),
    seo: (p: Partial<DiscoveryBrief["seo"]>) =>
      setBrief((b) => ({ ...b, seo: { ...b.seo, ...p } })),
    advanced: (p: Partial<DiscoveryBrief["advanced"]>) =>
      setBrief((b) => ({ ...b, advanced: { ...b.advanced, ...p } })),
    root: (p: Partial<DiscoveryBrief>) => setBrief((b) => ({ ...b, ...p })),
  };
}

/* ---------- 01 Business ---------- */

export function BusinessSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  const b = brief.business;
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Business name"
          value={b.businessName}
          onChange={(v) => patch.business({ businessName: v })}
          placeholder="Meridian Coatings"
        />
        <Field
          label="Industry"
          help="The industry drives the entire site architecture — an epoxy site and a roofing site get structurally different layouts."
        >
          <Select
            value={b.industry}
            onValueChange={(v) => patch.business({ industry: v as IndustryId })}
          >
            <SelectTrigger className="h-11 text-[14px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i.id} value={i.id}>
                  {i.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {b.industry === "custom" && (
        <TextField
          label="Your industry"
          value={b.customIndustry}
          onChange={(v) => patch.business({ customIndustry: v })}
          placeholder="Mobile welding, chimney sweeping…"
        />
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        <TextField label="City" value={b.city} onChange={(v) => patch.business({ city: v })} placeholder="Denver" />
        <TextField label="State" value={b.state} onChange={(v) => patch.business({ state: v })} placeholder="CO" />
        <TextField label="Country" value={b.country} onChange={(v) => patch.business({ country: v })} placeholder="United States" />
      </div>

      <TextField
        label="Service area"
        help="The radius or list of areas you actually serve — this shapes the service-area section and local SEO targets."
        value={b.serviceArea}
        onChange={(v) => patch.business({ serviceArea: v })}
        placeholder="Denver metro + 30 miles"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Years in business">
          <ChipGroup
            options={YEARS_OPTIONS}
            value={b.yearsInBusiness as (typeof YEARS_OPTIONS)[number]}
            onChange={(v) => patch.business({ yearsInBusiness: v as string })}
          />
        </Field>
        <Field label="Team size">
          <ChipGroup
            options={TEAM_SIZES}
            value={b.teamSize as (typeof TEAM_SIZES)[number]}
            onChange={(v) => patch.business({ teamSize: v as string })}
          />
        </Field>
      </div>

      <TextAreaField
        label="Business description"
        help="Describe the company like you would to a new neighbor. We mine this for voice and positioning."
        value={b.description}
        onChange={(v) => patch.business({ description: v })}
        placeholder="We're a family-run epoxy company. Started in my garage in 2016 — now we do 200 floors a year and turn down work we can't do perfectly."
        rows={4}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Primary service"
          help="The single service that pays the bills — it leads the hero and the SEO strategy."
          value={b.primaryService}
          onChange={(v) => patch.business({ primaryService: v })}
          placeholder="Garage floor coatings"
        />
        <ListField
          label="Secondary services"
          optional
          value={b.secondaryServices}
          onChange={(v) => patch.business({ secondaryServices: v })}
          placeholder={"Commercial epoxy\nMetallic finishes\nConcrete polishing"}
        />
      </div>

      <div className="divide-y divide-hairline rounded-xl border border-hairline bg-black/15 px-5">
        <YesNoRow
          question="Do you offer emergency services?"
          help="Adds a persistent emergency call path and a 24/7 banner near the top of the site."
          value={b.emergencyServices}
          onChange={(v) => patch.business({ emergencyServices: v })}
        />
        <YesNoRow
          question="Do you serve commercial clients?"
          value={b.commercialServices}
          onChange={(v) => patch.business({ commercialServices: v })}
        />
        <YesNoRow
          question="Do you serve residential clients?"
          value={b.residentialServices}
          onChange={(v) => patch.business({ residentialServices: v })}
        />
      </div>
    </div>
  );
}

/* ---------- 02 Brand personality ---------- */

export function PersonalitySection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  const p = brief.brand;
  return (
    <div className="space-y-8">
      <Field
        label="Brand personality"
        help="Pick up to three. These steer typography, color, layout density, and every line of copy."
      >
        <div className="grid gap-2.5 sm:grid-cols-3">
          {PERSONALITIES.map((opt) => (
            <OptionCard
              key={opt.id}
              name={opt.name}
              blurb={opt.blurb}
              active={p.personalities.includes(opt.id)}
              onClick={() =>
                patch.brand({
                  personalities: p.personalities.includes(opt.id)
                    ? p.personalities.filter((x) => x !== opt.id)
                    : [...p.personalities, opt.id].slice(-3),
                })
              }
            />
          ))}
        </div>
      </Field>

      <TextField
        label="Custom personality"
        optional
        help="Anything the presets miss — 'old-world craftsman', 'tech-forward but warm'…"
        value={p.customPersonality}
        onChange={(v) => patch.brand({ customPersonality: v })}
        placeholder="Describe it in your own words"
      />

      <Field label="Brand tone" help="How the copy should sound when read aloud.">
        <ChipGroup
          options={TONES}
          value={p.tone as (typeof TONES)[number]}
          onChange={(v) => patch.brand({ tone: v as string })}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="What emotions should customers feel?"
          value={p.emotions}
          onChange={(v) => patch.brand({ emotions: v })}
          placeholder="Relief, confidence, a little envy from the neighbors"
        />
        <TextField
          label="Three words that describe your business"
          value={p.threeWords}
          onChange={(v) => patch.brand({ threeWords: v })}
          placeholder="Meticulous, honest, fast"
        />
      </div>

      <TextAreaField
        label="What makes your company different?"
        help="The honest answer, not the brochure answer. This becomes your positioning."
        value={p.differentiator}
        onChange={(v) => patch.brand({ differentiator: v })}
        placeholder="We're the only crew in town that moisture-tests every slab — everyone else just rolls coating over problems."
      />
      <TextAreaField
        label="Why should customers choose you?"
        value={p.whyChooseUs}
        onChange={(v) => patch.brand({ whyChooseUs: v })}
        placeholder="Because the owner is on every job and we put the warranty in writing."
      />
    </div>
  );
}

/* ---------- 03 Design systems ---------- */

export function DesignSystemsSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  return (
    <div className="space-y-6">
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {DESIGN_SYSTEMS.map((d) => (
          <OptionCard
            key={d.id}
            name={d.name}
            blurb={d.blurb}
            swatch={d.swatch}
            active={brief.designSystems.includes(d.id)}
            onClick={() =>
              patch.root({
                designSystems: brief.designSystems.includes(d.id)
                  ? brief.designSystems.filter((x) => x !== d.id)
                  : [...brief.designSystems, d.id as DesignSystemId],
              })
            }
          />
        ))}
      </div>
      <p className="text-[12px] leading-relaxed text-white/35">
        Select as many as you like — the first becomes your default, and you can switch
        between all of them live once the site is generated.
      </p>
    </div>
  );
}

/* ---------- 04 Visual direction ---------- */

async function fileToDataUrl(file: File, maxBytes = 300_000): Promise<string | null> {
  if (file.size > maxBytes) return null;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export function VisualSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  const v = brief.visual;
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-3">
        <ColorField label="Primary color" value={v.primaryColor} onChange={(c) => patch.visual({ primaryColor: c })} />
        <ColorField
          label="Secondary color"
          help="Usually your action color — buttons and key highlights."
          value={v.secondaryColor}
          onChange={(c) => patch.visual({ secondaryColor: c })}
        />
        <ColorField label="Accent color" value={v.accentColor} onChange={(c) => patch.visual({ accentColor: c })} />
      </div>

      <Field label="Preferred background style">
        <ChipGroup
          options={BACKGROUND_STYLES}
          value={v.backgroundStyle as (typeof BACKGROUND_STYLES)[number]}
          onChange={(s) => patch.visual({ backgroundStyle: s as string })}
        />
      </Field>
      <Field label="Preferred button style">
        <ChipGroup
          options={BUTTON_STYLES}
          value={v.buttonStyle as (typeof BUTTON_STYLES)[number]}
          onChange={(s) => patch.visual({ buttonStyle: s as string })}
        />
      </Field>
      <Field label="Preferred card style">
        <ChipGroup
          options={CARD_STYLES}
          value={v.cardStyle as (typeof CARD_STYLES)[number]}
          onChange={(s) => patch.visual({ cardStyle: s as string })}
        />
      </Field>
      <Field label="Preferred animations">
        <ChipGroup
          options={ANIMATION_STYLES}
          value={v.animations as (typeof ANIMATION_STYLES)[number]}
          onChange={(s) => patch.visual({ animations: s as string })}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-3">
        <UploadTile
          label="Logo"
          help="SVG or PNG under 300 KB — it appears live in the website preview."
          fileNames={v.logoName ? [v.logoName] : []}
          preview={v.logoDataUrl || undefined}
          onFiles={async (files) => {
            const file = files[0];
            const dataUrl = await fileToDataUrl(file);
            patch.visual({ logoName: file.name, logoDataUrl: dataUrl ?? "" });
          }}
          onClear={() => patch.visual({ logoName: "", logoDataUrl: "" })}
        />
        <UploadTile
          label="Inspiration images"
          multiple
          fileNames={v.inspirationImages}
          onFiles={(files) =>
            patch.visual({
              inspirationImages: [...v.inspirationImages, ...files.map((f) => f.name)].slice(0, 12),
            })
          }
          onClear={() => patch.visual({ inspirationImages: [] })}
        />
        <UploadTile
          label="Existing brand assets"
          multiple
          accept="*"
          fileNames={v.brandAssets}
          onFiles={(files) =>
            patch.visual({
              brandAssets: [...v.brandAssets, ...files.map((f) => f.name)].slice(0, 12),
            })
          }
          onClear={() => patch.visual({ brandAssets: [] })}
        />
      </div>
    </div>
  );
}

/* ---------- 05 Competitors ---------- */

export function CompetitorsSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  const c = brief.competitors;
  return (
    <div className="space-y-8">
      <Field
        label="Competitor websites"
        optional
        help="We position you against these — different where it matters, better where they're weak."
      >
        <div className="space-y-3">
          {([1, 2, 3] as const).map((n) => (
            <Input
              key={n}
              value={c[`competitor${n}`]}
              onChange={(e) => patch.competitors({ [`competitor${n}`]: e.target.value })}
              placeholder={`https://competitor-${n}.com`}
              className="h-11 font-mono text-[13px]"
            />
          ))}
        </div>
      </Field>
      <TextAreaField
        label="What do you like about their sites?"
        optional
        value={c.likes}
        onChange={(v) => patch.competitors({ likes: v })}
        placeholder="Competitor 1 has great before/after photos. Competitor 2's instant quote form is slick."
      />
      <TextAreaField
        label="What do you dislike?"
        optional
        value={c.dislikes}
        onChange={(v) => patch.competitors({ dislikes: v })}
        placeholder="They all look the same — stock photos, fake reviews, walls of text."
      />
    </div>
  );
}

/* ---------- 06 Goals ---------- */

export function GoalsSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  return (
    <div className="space-y-6">
      <div className="grid gap-2.5 sm:grid-cols-3">
        {GOALS.map((g) => (
          <OptionCard
            key={g.id}
            name={g.name}
            blurb={g.blurb}
            active={brief.goals.includes(g.id)}
            onClick={() =>
              patch.root({
                goals: brief.goals.includes(g.id)
                  ? brief.goals.filter((x) => x !== g.id)
                  : [...brief.goals, g.id as GoalId],
              })
            }
          />
        ))}
      </div>
      <p className="text-[12px] leading-relaxed text-white/35">
        Your selections decide the CTA strategy — what the buttons say, where they live,
        and what the homepage funnels toward.
      </p>
    </div>
  );
}

/* ---------- 07 Content inventory ---------- */

export function ContentSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  const c = brief.content;
  return (
    <div className="divide-y divide-hairline rounded-xl border border-hairline bg-black/15 px-6">
      <YesNoRow
        question="Do you already have website content?"
        help="Existing copy, service descriptions, an old site we can pull from."
        value={c.hasContent}
        onChange={(v) => patch.content({ hasContent: v })}
      />
      <YesNoRow
        question="Do you need AI-generated content?"
        value={c.needsAiContent}
        onChange={(v) => patch.content({ needsAiContent: v })}
      />
      <YesNoRow
        question="Do you have testimonials?"
        value={c.hasTestimonials}
        onChange={(v) => patch.content({ hasTestimonials: v })}
      />
      <YesNoRow
        question="Do you have reviews (Google, Yelp…)?"
        help="If yes, the site gets review schema so your stars can show in search results."
        value={c.hasReviews}
        onChange={(v) => patch.content({ hasReviews: v })}
      />
      <YesNoRow
        question="Do you have project photos?"
        value={c.hasProjectPhotos}
        onChange={(v) => patch.content({ hasProjectPhotos: v })}
      />
      <YesNoRow
        question="Do you have before-and-after photos?"
        help="If yes, we move a before/after showcase high on the page — it's the strongest proof there is."
        value={c.hasBeforeAfter}
        onChange={(v) => patch.content({ hasBeforeAfter: v })}
      />
      <YesNoRow
        question="Do you have certifications or licenses to show?"
        value={c.hasCertifications}
        onChange={(v) => patch.content({ hasCertifications: v })}
      />
    </div>
  );
}

/* ---------- 08 Local SEO ---------- */

export function SeoSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  const s = brief.seo;
  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          label="Target city"
          help="The city you most want to rank in — it anchors titles, headings, and the homepage keyword."
          value={s.targetCity}
          onChange={(v) => patch.seo({ targetCity: v })}
          placeholder="Denver"
        />
        <TextField
          label="Additional cities"
          optional
          help="Each one gets its own location page in the site structure."
          value={s.additionalCities}
          onChange={(v) => patch.seo({ additionalCities: v })}
          placeholder="Aurora, Lakewood, Littleton"
        />
      </div>
      <TextAreaField
        label="Keywords"
        optional
        help="Phrases customers actually type. Comma-separated."
        value={s.keywords}
        onChange={(v) => patch.seo({ keywords: v })}
        placeholder="epoxy garage floor denver, garage floor coating near me"
      />
      <TextAreaField
        label="Services to rank for"
        optional
        help="Each becomes a dedicated, optimized service page."
        value={s.servicesToRank}
        onChange={(v) => patch.seo({ servicesToRank: v })}
        placeholder="Garage floor epoxy, commercial floor coatings"
      />
    </div>
  );
}

/* ---------- 09 Site structure ---------- */

export function StructureSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  return (
    <div className="space-y-6">
      <div className="grid gap-2.5 sm:grid-cols-3">
        {PAGES.map((p) => (
          <OptionCard
            key={p.id}
            name={p.name}
            blurb={p.blurb}
            badge={p.recommended ? "core" : undefined}
            active={brief.pages.includes(p.id)}
            onClick={() =>
              patch.root({
                pages: brief.pages.includes(p.id)
                  ? brief.pages.filter((x) => x !== p.id)
                  : [...brief.pages, p.id as PageId],
              })
            }
          />
        ))}
      </div>
      {brief.pages.includes("custom") && (
        <TextField
          label="Custom page name"
          value={brief.customPage}
          onChange={(v) => patch.root({ customPage: v })}
          placeholder="Service Plans, Warranty Center…"
        />
      )}
    </div>
  );
}

/* ---------- 10 Advanced ---------- */

export function AdvancedSection({ brief, setBrief }: SectionProps) {
  const patch = usePatch(setBrief);
  const a = brief.advanced;
  return (
    <div className="space-y-8">
      <TextAreaField
        label="Additional instructions"
        optional
        value={a.additionalInstructions}
        onChange={(v) => patch.advanced({ additionalInstructions: v })}
        placeholder="Anything else the design team should know."
      />
      <TextAreaField
        label="Things to avoid"
        optional
        help="Phrases, colors, clichés, competitor look-alikes — hard rules we will not break."
        value={a.thingsToAvoid}
        onChange={(v) => patch.advanced({ thingsToAvoid: v })}
        placeholder="No stock photos of handshakes. Never say 'one-stop shop'."
      />
      <TextAreaField
        label="Unique selling points"
        optional
        value={a.uniqueSellingPoints}
        onChange={(v) => patch.advanced({ uniqueSellingPoints: v })}
        placeholder="Only certified installer in the county. Owner on every job."
      />
      <div className="grid gap-6 sm:grid-cols-3">
        <TextAreaField
          label="Special offers"
          optional
          value={a.specialOffers}
          onChange={(v) => patch.advanced({ specialOffers: v })}
          placeholder="$200 off in March"
          rows={3}
        />
        <TextAreaField
          label="Guarantees"
          optional
          value={a.guarantees}
          onChange={(v) => patch.advanced({ guarantees: v })}
          placeholder="15-year wear warranty"
          rows={3}
        />
        <TextAreaField
          label="Financing options"
          optional
          value={a.financingOptions}
          onChange={(v) => patch.advanced({ financingOptions: v })}
          placeholder="0% for 12 months"
          rows={3}
        />
      </div>
    </div>
  );
}

export const SECTION_COMPONENTS: Record<SectionId, (p: SectionProps) => React.ReactNode> = {
  business: BusinessSection,
  personality: PersonalitySection,
  "design-systems": DesignSystemsSection,
  visual: VisualSection,
  competitors: CompetitorsSection,
  goals: GoalsSection,
  content: ContentSection,
  seo: SeoSection,
  structure: StructureSection,
  advanced: AdvancedSection,
};
