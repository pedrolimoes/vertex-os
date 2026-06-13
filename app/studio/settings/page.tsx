"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, EyeOff, Save, ShieldCheck } from "lucide-react";
import { PremiumButton } from "@/components/ds/premium-button";
import { GlassPanel } from "@/components/ds/glass-panel";
import { StatusBadge } from "@/components/ds/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eyebrow } from "@/components/glass";
import { PROVIDERS, getProvider } from "@/lib/providers";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { ProviderId, ProviderSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<ProviderSettings>(DEFAULT_SETTINGS);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const provider = getProvider(settings.provider);

  const update = <K extends keyof ProviderSettings>(
    key: K,
    value: ProviderSettings[K],
  ) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  const ready =
    settings.provider === "ollama" || settings.apiKey.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <Eyebrow>Settings</Eyebrow>
          <h1 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-white">
            Provider & keys
          </h1>
        </div>
        <StatusBadge status={ready ? "ok" : "warn"}>
          {ready ? "provider ready" : "mock engine"}
        </StatusBadge>
      </motion.header>

      {/* Trust model — stated like an engineering fact, not a promise */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <GlassPanel className="flex items-start gap-4 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hairline bg-black/25">
            <ShieldCheck className="h-4 w-4 text-accent" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Trust model</p>
            <p className="mt-1 text-xs leading-relaxed text-white/40">
              Keys are stored in{" "}
              <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-[11px] text-white/60">
                localStorage["vss:provider-settings"]
              </code>{" "}
              and forwarded per-request to the provider you select. The API
              route is a stateless pass-through; nothing is logged or persisted
              server-side.
            </p>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Provider list — radio rows, not marketing cards */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
          Provider
        </h2>
        <GlassPanel reflect className="row-divide" role="radiogroup" aria-label="Inference provider">
          {PROVIDERS.map((p) => {
            const active = settings.provider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => update("provider", p.id as ProviderId)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-4 px-5 py-3.5 text-left transition-colors duration-150",
                  active ? "bg-white/[0.05]" : "hover:bg-white/[0.03]",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                    active ? "border-accent" : "border-white/20",
                  )}
                >
                  {active && <span className="h-2 w-2 rounded-full bg-accent" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm font-medium",
                      active ? "text-white" : "text-white/70",
                    )}
                  >
                    {p.name}
                  </span>
                  <span className="block truncate text-xs text-white/35">
                    {p.tagline}
                  </span>
                </span>
                <span className="hidden shrink-0 font-mono text-[11px] text-white/25 sm:block">
                  {p.needsKey ? "key required" : "no key"}
                </span>
              </button>
            );
          })}
        </GlassPanel>
      </motion.section>

      {/* Credentials */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
          Credentials · {provider.name}
        </h2>
        <GlassPanel reflect className="space-y-5 p-6">
          {provider.needsKey && (
            <div className="space-y-2">
              <Label htmlFor="apiKey">API key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  placeholder={provider.keyHint}
                  value={settings.apiKey}
                  onChange={(e) => update("apiKey", e.target.value)}
                  className="pr-10 font-mono"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/30 transition-colors duration-150 hover:text-white/70"
                  aria-label={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-white/30">
                Issued at{" "}
                <a
                  href={provider.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer text-white/50 underline-offset-2 hover:underline"
                >
                  {provider.docsUrl.replace("https://", "")}
                </a>
              </p>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">
                Base URL{provider.needsBaseUrl ? "" : " · optional override"}
              </Label>
              <Input
                id="baseUrl"
                placeholder={provider.defaultBaseUrl || "https://your-endpoint/v1"}
                value={settings.baseUrl}
                onChange={(e) => update("baseUrl", e.target.value)}
                className="font-mono"
                spellCheck={false}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model · optional</Label>
              <Input
                id="model"
                placeholder={provider.defaultModel || "model-name"}
                value={settings.model}
                onChange={(e) => update("model", e.target.value)}
                className="font-mono"
                spellCheck={false}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-hairline pt-5">
            <PremiumButton onClick={save}>
              {saved ? (
                <>
                  <Check className="h-4 w-4" /> Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save
                </>
              )}
            </PremiumButton>
            <p className="font-mono text-[11px] text-white/25">
              defaults: {provider.defaultModel || "—"}
            </p>
          </div>
        </GlassPanel>
      </motion.section>
    </div>
  );
}
