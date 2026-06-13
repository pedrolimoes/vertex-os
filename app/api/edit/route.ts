import { NextResponse } from "next/server";
import type { ProviderSettings, SiteBlueprint } from "@/lib/types";
import { getProvider } from "@/lib/providers";
import { callModel, llmErrorMessage } from "@/lib/llm";

export const runtime = "nodejs";

/* ==========================================================================
   Live AI edit — the natural-language editor. Takes the current site
   blueprint + a plain-English instruction and returns a patched blueprint
   plus a one-line summary. BYOK: keys are forwarded per-request, never
   stored. Requires a connected provider (the deterministic engine can't
   interpret free-form edit instructions).
   ========================================================================== */

interface EditRequest {
  blueprint: SiteBlueprint;
  system: string;
  instruction: string;
  settings: ProviderSettings;
}

const EDIT_SYSTEM_PROMPT = `You are the senior designer inside VertexOS, editing a client's website live.
You receive the current SITE BLUEPRINT (as JSON) and a plain-English instruction from the user.
Apply the instruction faithfully and return STRICT JSON only — no markdown fences, no commentary.

RULES:
- Return ONLY the fields you changed, plus "summary". Do NOT echo the whole blueprint if only one section changed.
- Keep the same shape: homepage is an array of sections; each section keeps its "type".
- NEVER invent or alter "image" fields — omit them; the app preserves images.
- Preserve every section the user did not ask to change. If you return "homepage", return the FULL ordered array so order/visibility is explicit.
- To hide a section set "hidden": true; to show it set "hidden": false. To reorder, return homepage in the new order.
- Copy must stay believable and specific to the business — never lorem ipsum, never generic AI filler.
- If the instruction is about COLOR, return a "palette" object with hex values. The user's chosen colors are binding.
- If the instruction is about STYLE/design system, return "system" with one of the allowed ids.
- If the instruction changes the main calls to action, return "ctaPrimary" / "ctaSecondary".

RESPONSE SHAPE (include only what changed):
{
  "summary": "one short sentence describing what you changed",
  "homepage": [ { "type": "...", "eyebrow": "...", "title": "...", "body": "...", "items": [{"title":"","body":"","meta":""}], "stats": [{"value":"","label":""}], "cta": {"label":"","secondary":""}, "hidden": false } ],
  "palette": { "primary": "#hex", "secondary": "#hex", "accent": "#hex" },
  "ctaPrimary": "Get a Free Quote",
  "ctaSecondary": "View Our Work",
  "system": "liquid-glass"
}

Allowed system ids: liquid-glass, vision-pro, linear, raycast, arc-browser, vercel, framer, notion, luxury-black, minimal-editorial, startup-modern, premium-local, high-end-agency, contractor-pro, modern-industrial.`;

function buildEditUserPrompt(blueprint: SiteBlueprint, system: string, instruction: string): string {
  // Send only the parts an editor touches — keeps the payload tight and the
  // model focused on content, palette, CTAs and section order.
  const compact = {
    system,
    palette: blueprint.design.palette,
    ctaStrategy: { primary: blueprint.ctaStrategy.primary, secondary: blueprint.ctaStrategy.secondary },
    homepage: blueprint.homepage.map((s) => ({
      type: s.type,
      eyebrow: s.eyebrow,
      title: s.title,
      body: s.body,
      items: s.items?.map((it) => ({ title: it.title, body: it.body, meta: it.meta })),
      stats: s.stats,
      cta: s.cta ? { label: s.cta.label, secondary: s.cta.secondary } : undefined,
      hidden: s.hidden ?? false,
    })),
  };
  return `CURRENT BLUEPRINT:\n${JSON.stringify(compact)}\n\nINSTRUCTION:\n${instruction}\n\nReturn the JSON patch now.`;
}

export async function POST(req: Request) {
  let body: EditRequest;
  try {
    body = (await req.json()) as EditRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { blueprint, system, instruction, settings } = body;
  if (!blueprint?.homepage || !instruction?.trim()) {
    return NextResponse.json({ error: "Missing blueprint or instruction" }, { status: 400 });
  }

  const provider = getProvider(settings?.provider ?? "openrouter");
  const hasKey = Boolean(settings?.apiKey?.trim());
  const isOllama = provider.id === "ollama";
  if (!hasKey && !isOllama) {
    return NextResponse.json(
      {
        error:
          "Live AI editing needs a connected provider. Add a key under Provider & Keys, then try again. (You can still edit everything by hand.)",
      },
      { status: 400 },
    );
  }

  try {
    const raw = (await callModel(
      settings,
      EDIT_SYSTEM_PROMPT,
      buildEditUserPrompt(blueprint, system, instruction),
      0.4,
    )) as Record<string, unknown>;

    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: "The model returned an unreadable response." }, { status: 502 });
    }
    return NextResponse.json({ patch: raw, source: provider.id });
  } catch (err) {
    return NextResponse.json(
      { error: `${provider.name} edit failed: ${llmErrorMessage(err)}` },
      { status: 502 },
    );
  }
}
