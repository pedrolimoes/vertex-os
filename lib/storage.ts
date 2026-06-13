"use client";

import type {
  DiscoveryBrief,
  McpServerConfig,
  ProviderSettings,
  SiteProject,
} from "./types";
import { DEFAULT_BRIEF } from "./discovery";

/**
 * Local-first persistence. Everything (including API keys) stays in the
 * browser's localStorage — nothing is ever sent to a server we own,
 * because there isn't one. Uploaded images live in IndexedDB
 * (see idb-images.ts) and are referenced from project JSON.
 */

const KEYS = {
  settings: "vss:provider-settings",
  // v1 projects: editable design-brief-era shape.
  projects: "vss:projects-v1",
  draft: "vss:discovery-draft-v2",
  mcp: "vss:mcp-servers",
} as const;

export const DEFAULT_SETTINGS: ProviderSettings = {
  provider: "openrouter",
  apiKey: "",
  baseUrl: "",
  model: "",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadSettings(): ProviderSettings {
  return { ...DEFAULT_SETTINGS, ...read<Partial<ProviderSettings>>(KEYS.settings, {}) };
}

export function saveSettings(settings: ProviderSettings) {
  write(KEYS.settings, settings);
}

/* ---------- Projects ---------- */

export function loadProjects(): SiteProject[] {
  return read<SiteProject[]>(KEYS.projects, []);
}

export function getProject(id: string): SiteProject | undefined {
  return loadProjects().find((p) => p.id === id);
}

/** Insert or update — newest first, capped to keep localStorage sane. */
export function saveProject(project: SiteProject) {
  const rest = loadProjects().filter((p) => p.id !== project.id);
  write(KEYS.projects, [{ ...project, updatedAt: Date.now() }, ...rest].slice(0, 24));
}

export function deleteProject(id: string) {
  write(
    KEYS.projects,
    loadProjects().filter((p) => p.id !== id),
  );
}

/* ---------- Discovery draft (auto-saved while briefing) ---------- */

/** Deep-merge stored partials onto defaults so shape changes never crash the flow. */
export function loadDraft(): DiscoveryBrief {
  const stored = read<Partial<DiscoveryBrief>>(KEYS.draft, {});
  return {
    ...DEFAULT_BRIEF,
    ...stored,
    business: { ...DEFAULT_BRIEF.business, ...stored.business },
    brand: { ...DEFAULT_BRIEF.brand, ...stored.brand },
    visual: { ...DEFAULT_BRIEF.visual, ...stored.visual },
    competitors: { ...DEFAULT_BRIEF.competitors, ...stored.competitors },
    content: { ...DEFAULT_BRIEF.content, ...stored.content },
    seo: { ...DEFAULT_BRIEF.seo, ...stored.seo },
    advanced: { ...DEFAULT_BRIEF.advanced, ...stored.advanced },
    designSystems: stored.designSystems ?? DEFAULT_BRIEF.designSystems,
    goals: stored.goals ?? DEFAULT_BRIEF.goals,
    pages: stored.pages ?? DEFAULT_BRIEF.pages,
  };
}

export function saveDraft(brief: DiscoveryBrief) {
  write(KEYS.draft, brief);
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEYS.draft);
}

export function loadMcpServers(): McpServerConfig[] {
  return read<McpServerConfig[]>(KEYS.mcp, []);
}

export function saveMcpServers(servers: McpServerConfig[]) {
  write(KEYS.mcp, servers);
}
