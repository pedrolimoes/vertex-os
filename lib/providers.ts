import type { ProviderId } from "./types";

export interface ProviderMeta {
  id: ProviderId;
  name: string;
  tagline: string;
  /** OpenAI-compatible chat completions base URL ("" = user supplied). */
  defaultBaseUrl: string;
  defaultModel: string;
  needsKey: boolean;
  needsBaseUrl: boolean;
  keyHint: string;
  docsUrl: string;
}

export const PROVIDERS: ProviderMeta[] = [
  {
    id: "nvidia-nim",
    name: "NVIDIA NIM",
    tagline: "GPU-accelerated inference from build.nvidia.com",
    defaultBaseUrl: "https://integrate.api.nvidia.com/v1",
    defaultModel: "meta/llama-3.3-70b-instruct",
    needsKey: true,
    needsBaseUrl: false,
    keyHint: "nvapi-...",
    docsUrl: "https://build.nvidia.com",
  },
  {
    id: "deepinfra",
    name: "DeepInfra",
    tagline: "Low-cost open model hosting",
    defaultBaseUrl: "https://api.deepinfra.com/v1/openai",
    defaultModel: "meta-llama/Meta-Llama-3.1-70B-Instruct",
    needsKey: true,
    needsBaseUrl: false,
    keyHint: "your DeepInfra token",
    docsUrl: "https://deepinfra.com",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    tagline: "One key, every model",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "anthropic/claude-3.5-sonnet",
    needsKey: true,
    needsBaseUrl: false,
    keyHint: "sk-or-...",
    docsUrl: "https://openrouter.ai",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    tagline: "Gemini API with a free tier",
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    defaultModel: "gemini-2.0-flash",
    needsKey: true,
    needsBaseUrl: false,
    keyHint: "AIza...",
    docsUrl: "https://ai.google.dev",
  },
  {
    id: "ollama",
    name: "Ollama",
    tagline: "Fully local, fully private",
    defaultBaseUrl: "http://localhost:11434/v1",
    defaultModel: "llama3.1",
    needsKey: false,
    needsBaseUrl: true,
    keyHint: "no key needed",
    docsUrl: "https://ollama.com",
  },
  {
    id: "custom",
    name: "Custom endpoint",
    tagline: "Any OpenAI-compatible API",
    defaultBaseUrl: "",
    defaultModel: "",
    needsKey: true,
    needsBaseUrl: true,
    keyHint: "sk-...",
    docsUrl: "https://platform.openai.com/docs/api-reference",
  },
];

export function getProvider(id: ProviderId): ProviderMeta {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];
}
