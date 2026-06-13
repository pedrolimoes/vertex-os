import { NextResponse } from "next/server";
import type {
  DesignBrief,
  DiscoveryBrief,
  GenerationResult,
  ProviderSettings,
  SiteBlueprint,
} from "@/lib/types";
import { getProvider } from "@/lib/providers";
import { generateBlueprint } from "@/lib/blueprint-generator";
import { buildDesignBrief } from "@/lib/design-brief";
import { callModel, llmErrorMessage as message } from "@/lib/llm";
import {
  DESIGN_DIRECTOR_PROMPT,
  SYSTEM_PROMPT,
  buildDesignDirectorPrompt,
  buildUserPrompt,
  mergeDesignBrief,
  mergeWithSkeleton,
} from "@/lib/prompt";

export const runtime = "nodejs";

interface GenerateRequest {
  brief: DiscoveryBrief;
  settings: ProviderSettings;
}

/**
 * Two-phase BYOK generation proxy.
 *
 *   User input → DESIGN BRIEF (Phase 1, design director)
 *              → SITE BLUEPRINT (Phase 2, must follow the design brief)
 *
 * The website is never generated directly from user input. With no key,
 * both phases run on the deterministic engine (Design DNA + industry
 * engine), so output is still strategic and style-true offline. Keys are
 * forwarded per-request and never stored server-side.
 */
export async function POST(req: Request) {
  let body: GenerateRequest;
  try {
    body = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { brief, settings } = body;
  if (!brief?.business) {
    return NextResponse.json({ error: "Missing brief" }, { status: 400 });
  }

  const provider = getProvider(settings?.provider ?? "openrouter");
  const hasKey = Boolean(settings?.apiKey?.trim());
  const isOllama = provider.id === "ollama";

  if (!hasKey && !isOllama) {
    const designBrief = buildDesignBrief(brief);
    const result: GenerationResult = {
      designBrief,
      blueprint: generateBlueprint(brief, designBrief),
      source: "engine",
      warning:
        "No API key configured — design brief and blueprint produced by the built-in Design DNA engine. Connect a provider for model-elevated output.",
    };
    return NextResponse.json(result);
  }

  // Phase 1 — design director. A failure here falls back to the engine
  // brief but still proceeds to Phase 2.
  let designBrief: DesignBrief;
  let phase1Warning: string | undefined;
  try {
    const raw = await callModel(
      settings,
      DESIGN_DIRECTOR_PROMPT,
      buildDesignDirectorPrompt(brief),
    );
    designBrief = mergeDesignBrief(raw as Partial<DesignBrief>, brief);
  } catch (err) {
    designBrief = buildDesignBrief(brief);
    phase1Warning = `Design-director call failed (${message(err)}) — used the engine design brief.`;
  }

  // Phase 2 — builder, constrained by the design brief.
  try {
    const raw = await callModel(settings, SYSTEM_PROMPT, buildUserPrompt(brief, designBrief));
    const blueprint = mergeWithSkeleton(raw as Partial<SiteBlueprint>, brief, designBrief);
    const result: GenerationResult = {
      designBrief,
      blueprint,
      source: provider.id,
      warning: phase1Warning,
    };
    return NextResponse.json(result);
  } catch (err) {
    const result: GenerationResult = {
      designBrief,
      blueprint: generateBlueprint(brief, designBrief),
      source: "engine",
      warning: `${provider.name} call failed (${message(err)}). Showing the engine blueprint instead.`,
    };
    return NextResponse.json(result);
  }
}

