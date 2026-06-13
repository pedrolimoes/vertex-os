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
import {
  DESIGN_DIRECTOR_PROMPT,
  SYSTEM_PROMPT,
  buildDesignDirectorPrompt,
  buildUserPrompt,
  extractJson,
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

function message(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown provider error";
}

async function callModel(
  settings: ProviderSettings,
  system: string,
  user: string,
): Promise<unknown> {
  return settings.provider === "gemini"
    ? callGemini(settings, system, user)
    : callOpenAICompatible(settings, system, user);
}

async function callOpenAICompatible(
  settings: ProviderSettings,
  system: string,
  user: string,
): Promise<unknown> {
  const provider = getProvider(settings.provider);
  const baseUrl = (settings.baseUrl.trim() || provider.defaultBaseUrl).replace(/\/$/, "");
  const model = settings.model.trim() || provider.defaultModel;
  if (!baseUrl) throw new Error("Missing base URL");
  if (!model) throw new Error("Missing model name");

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (settings.apiKey.trim()) headers.Authorization = `Bearer ${settings.apiKey.trim()}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}${text ? `: ${text.slice(0, 160)}` : ""}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty model response");
  return extractJson(content);
}

async function callGemini(
  settings: ProviderSettings,
  system: string,
  user: string,
): Promise<unknown> {
  const provider = getProvider("gemini");
  const baseUrl = (settings.baseUrl.trim() || provider.defaultBaseUrl).replace(/\/$/, "");
  const model = settings.model.trim() || provider.defaultModel;

  const res = await fetch(
    `${baseUrl}/models/${model}:generateContent?key=${encodeURIComponent(settings.apiKey.trim())}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
      }),
      signal: AbortSignal.timeout(120_000),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}${text ? `: ${text.slice(0, 160)}` : ""}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) throw new Error("Empty model response");
  return extractJson(content);
}
