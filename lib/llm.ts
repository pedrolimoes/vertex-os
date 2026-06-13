import type { ProviderSettings } from "./types";
import { getProvider } from "./providers";
import { extractJson } from "./prompt";

/* ==========================================================================
   Shared BYOK model transport. Used by both the generation route and the
   live AI-edit route. Keys are forwarded per-request, never stored.
   Every caller gets back already-parsed JSON (via extractJson).
   ========================================================================== */

export function llmErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown provider error";
}

export async function callModel(
  settings: ProviderSettings,
  system: string,
  user: string,
  temperature = 0.7,
): Promise<unknown> {
  return settings.provider === "gemini"
    ? callGemini(settings, system, user, temperature)
    : callOpenAICompatible(settings, system, user, temperature);
}

async function callOpenAICompatible(
  settings: ProviderSettings,
  system: string,
  user: string,
  temperature: number,
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
      temperature,
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
  temperature: number,
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
        generationConfig: { temperature, responseMimeType: "application/json" },
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
