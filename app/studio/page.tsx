"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileCode2,
  LayoutTemplate,
  PenLine,
  Plug2,
  Trash2,
} from "lucide-react";
import { PremiumButton } from "@/components/ds/premium-button";
import { GlassPanel } from "@/components/ds/glass-panel";
import { StatusBadge } from "@/components/ds/status-badge";
import { TemplateIcon } from "@/components/ds/template-card";
import { Eyebrow } from "@/components/glass";
import {
  deleteProject,
  loadMcpServers,
  loadProjects,
  loadSettings,
} from "@/lib/storage";
import { getProvider } from "@/lib/providers";
import { getTemplate, TEMPLATES } from "@/lib/templates";
import type { SiteProject } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

export default function StudioDashboard() {
  const [sites, setSites] = useState<SiteProject[]>([]);
  const [connectorCount, setConnectorCount] = useState(0);
  const [providerName, setProviderName] = useState("—");
  const [hasKey, setHasKey] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const settings = loadSettings();
    setSites(loadProjects());
    setConnectorCount(loadMcpServers().length);
    setProviderName(getProvider(settings.provider).name);
    setHasKey(Boolean(settings.apiKey) || settings.provider === "ollama");
    setLoaded(true);
  }, []);

  const removeSite = (id: string) => {
    deleteProject(id);
    setSites(loadProjects());
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <Eyebrow>Dashboard</Eyebrow>
          <h1 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-white">
            Studio
          </h1>
        </div>
        {loaded && (
          <div className="flex items-center gap-2">
            <StatusBadge status={hasKey ? "ok" : "warn"} live={hasKey}>
              {hasKey ? providerName : "engine mode"}
            </StatusBadge>
            <StatusBadge>local</StatusBadge>
          </div>
        )}
      </motion.header>

      {/* Metrics strip — the studio's vital signs, suspended above the stage. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06, ease }}
        className="mt-8"
      >
        <GlassPanel
          elevation="float"
          reflect
          className="grid grid-cols-3 divide-x divide-hairline"
        >
          {[
            { value: sites.length, label: "generated sites" },
            { value: TEMPLATES.length, label: "templates" },
            { value: connectorCount, label: "mcp connectors" },
          ].map((m) => (
            <div
              key={m.label}
              className="group/metric relative px-6 py-5 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              <div className="font-display text-2xl font-semibold tabular-nums text-white transition-all duration-300 group-hover/metric:text-accent group-hover/metric:drop-shadow-[0_0_12px_rgba(110,231,210,0.35)]">
                {loaded ? m.value : "–"}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                {m.label}
              </div>
            </div>
          ))}
        </GlassPanel>
      </motion.div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        {/* Start column */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease }}
        >
          <GlassPanel reflect className="h-full">
            <div className="border-b border-hairline px-5 py-4">
              <h2 className="font-display text-sm font-semibold text-white">Start</h2>
            </div>
            <div className="row-divide">
              {[
                {
                  href: "/studio/generator",
                  icon: PenLine,
                  title: "New website",
                  desc: "Agency-style discovery → blueprint → Studio Mode",
                },
                {
                  href: "/studio/templates",
                  icon: LayoutTemplate,
                  title: "Start from a template",
                  desc: "Industry presets that pre-fill the brief",
                },
                {
                  href: "/studio/connectors",
                  icon: Plug2,
                  title: "Add an MCP connector",
                  desc: "Supabase, GitHub, Maps, Stripe…",
                },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group flex cursor-pointer items-center gap-3.5 px-5 py-4 transition-colors duration-200 hover:bg-white/[0.04]"
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hairline bg-black/25 transition-all duration-300 group-hover:border-accent/40 group-hover:bg-accent-dim group-hover:shadow-glow-accent">
                    <a.icon className="h-4 w-4 text-white/40 transition-colors group-hover:text-accent" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white">
                      {a.title}
                    </span>
                    <span className="block truncate text-xs text-white/35">
                      {a.desc}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-white/20 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-white/60" />
                </Link>
              ))}
            </div>
            {!hasKey && loaded && (
              <div className="border-t border-hairline px-5 py-4">
                <p className="text-xs leading-relaxed text-white/40">
                  Running on the built-in strategy engine.{" "}
                  <Link
                    href="/studio/settings"
                    className="cursor-pointer text-accent underline-offset-2 hover:underline"
                  >
                    Connect a provider
                  </Link>{" "}
                  for model-written copy.
                </p>
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* Recent generations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
        >
          <GlassPanel reflect className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <h2 className="font-display text-sm font-semibold text-white">
                Recent generations
              </h2>
              {sites.length > 0 && (
                <span className="font-mono text-[11px] text-white/25">
                  {sites.length} saved
                </span>
              )}
            </div>

            {sites.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-hairline-strong">
                  <FileCode2 className="h-5 w-5 text-white/25" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white/70">
                    No sites yet
                  </p>
                  <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-white/35">
                    Generated sites are saved to this browser and listed here.
                  </p>
                </div>
                <PremiumButton size="sm" variant="glass" asChild>
                  <Link href="/studio/generator">Generate your first site</Link>
                </PremiumButton>
              </div>
            ) : (
              <div className="row-divide">
                {sites.slice(0, 8).map((site) => {
                  const template = getTemplate(site.brief.business.industry);
                  return (
                    <div
                      key={site.id}
                      className="group flex items-center gap-3.5 px-5 py-3.5"
                    >
                      <TemplateIcon
                        id={template.icon}
                        className="h-4 w-4 shrink-0 text-white/30"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/studio/generator?site=${site.id}`}
                            className="cursor-pointer truncate text-sm font-medium text-white hover:underline"
                          >
                            {site.brief.business.businessName || "Untitled"}
                          </Link>
                          <StatusBadge
                            status={site.source === "engine" ? "warn" : "ok"}
                            dot={false}
                          >
                            {site.source}
                          </StatusBadge>
                        </div>
                        <p className="truncate font-mono text-[11px] text-white/30">
                          {template.name.toLowerCase()} ·{" "}
                          {site.brief.business.city.toLowerCase() || "no city"} ·{" "}
                          {new Date(site.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <PremiumButton size="sm" variant="glass" asChild>
                          <Link href={`/studio/editor?site=${site.id}`}>
                            Edit
                          </Link>
                        </PremiumButton>
                        <PremiumButton size="sm" variant="ghost" asChild>
                          <Link href={`/studio/generator?site=${site.id}`}>
                            Studio
                          </Link>
                        </PremiumButton>
                        <PremiumButton
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSite(site.id)}
                          aria-label={`Delete ${site.brief.business.businessName || "site"}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </PremiumButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
