"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clapperboard,
  CreditCard,
  Database,
  Github,
  Map,
  Plug2,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { PremiumButton } from "@/components/ds/premium-button";
import { GlassPanel } from "@/components/ds/glass-panel";
import { ConnectorCard } from "@/components/ds/connector-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow } from "@/components/glass";
import { MCP_STARTERS, type McpStarter } from "@/lib/mcp-starters";
import { loadMcpServers, saveMcpServers } from "@/lib/storage";
import type { McpServerConfig } from "@/lib/types";

const STARTER_ICONS: Record<string, LucideIcon> = {
  database: Database,
  github: Github,
  clapperboard: Clapperboard,
  map: Map,
  "credit-card": CreditCard,
};

interface FormState {
  id: string | null;
  name: string;
  command: string;
  args: string;
  env: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  id: null,
  name: "",
  command: "npx",
  args: "",
  env: "",
  description: "",
};

function parseEnv(text: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const idx = line.indexOf("=");
    if (idx > 0) env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return env;
}

export default function ConnectorsPage() {
  const [servers, setServers] = useState<McpServerConfig[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    setServers(loadMcpServers());
  }, []);

  const persist = (next: McpServerConfig[]) => {
    setServers(next);
    saveMcpServers(next);
  };

  const openNew = (starter?: McpStarter) => {
    setForm(
      starter
        ? {
            id: null,
            name: starter.name,
            command: starter.command,
            args: starter.args.join(" "),
            env: Object.entries(starter.env)
              .map(([k, v]) => `${k}=${v}`)
              .join("\n"),
            description: starter.description ?? "",
          }
        : EMPTY_FORM,
    );
    setOpen(true);
  };

  const openEdit = (server: McpServerConfig) => {
    setForm({
      id: server.id,
      name: server.name,
      command: server.command,
      args: server.args.join(" "),
      env: Object.entries(server.env)
        .map(([k, v]) => `${k}=${v}`)
        .join("\n"),
      description: server.description ?? "",
    });
    setOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.command.trim()) return;
    const config: McpServerConfig = {
      id: form.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      command: form.command.trim(),
      args: form.args.split(/\s+/).filter(Boolean),
      env: parseEnv(form.env),
      description: form.description.trim() || undefined,
    };
    persist(
      form.id
        ? servers.map((s) => (s.id === form.id ? config : s))
        : [...servers, config],
    );
    setOpen(false);
  };

  const remove = (id: string) => persist(servers.filter((s) => s.id !== id));
  const installedNames = new Set(servers.map((s) => s.name));

  return (
    <div className="mx-auto max-w-4xl">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <Eyebrow>MCP</Eyebrow>
          <h1 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-white">
            Connectors
          </h1>
          <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-white/45">
            Model Context Protocol servers, in the same config shape used by
            Claude Desktop and Cursor. Stored locally, consumed by the agent
            runtime.
          </p>
        </div>
        <PremiumButton onClick={() => openNew()}>
          <Plus className="h-4 w-4" /> Add server
        </PremiumButton>
      </motion.header>

      {/* Configured servers */}
      <section className="mt-8">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
          Configured · {servers.length}
        </h2>
        {servers.length === 0 ? (
          <GlassPanel className="flex flex-col items-center gap-4 px-8 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-hairline-strong">
              <Plug2 className="h-5 w-5 text-white/25" />
            </span>
            <div>
              <p className="text-sm font-medium text-white/70">
                No servers configured
              </p>
              <p className="mt-1 max-w-[300px] text-xs leading-relaxed text-white/35">
                Add one manually or start from the registry below — keys go in
                env vars, never in args.
              </p>
            </div>
          </GlassPanel>
        ) : (
          <div className="space-y-3">
            {servers.map((server) => (
              <motion.div
                key={server.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ConnectorCard
                  server={server}
                  onEdit={() => openEdit(server)}
                  onDelete={() => remove(server.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Registry */}
      <section className="mt-8">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
          Registry
        </h2>
        <GlassPanel reflect className="row-divide">
          {MCP_STARTERS.map((starter) => {
            const Icon = STARTER_ICONS[starter.icon] ?? Database;
            const installed = installedNames.has(starter.name);
            return (
              <div
                key={starter.name}
                className="flex items-center gap-4 px-5 py-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hairline bg-black/25">
                  <Icon className="h-4 w-4 text-white/45" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white">
                    {starter.name}
                  </div>
                  <p className="truncate text-xs text-white/35">
                    {starter.description}
                  </p>
                </div>
                <code className="hidden shrink-0 font-mono text-[11px] text-white/25 lg:block">
                  {starter.command} {starter.args[1] ?? starter.args[0]}
                </code>
                <PremiumButton
                  variant={installed ? "ghost" : "glass"}
                  size="sm"
                  className="shrink-0"
                  disabled={installed}
                  onClick={() => openNew(starter)}
                >
                  {installed ? "Added" : "Configure"}
                </PremiumButton>
              </div>
            );
          })}
        </GlassPanel>
      </section>

      {/* Add / edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit server" : "Add MCP server"}</DialogTitle>
            <DialogDescription>
              Launched over stdio. Secrets belong in env vars.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mcp-name">Name</Label>
                <Input
                  id="mcp-name"
                  placeholder="Supabase MCP"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mcp-command">Command</Label>
                <Input
                  id="mcp-command"
                  placeholder="npx"
                  value={form.command}
                  onChange={(e) => setForm({ ...form, command: e.target.value })}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mcp-args">Arguments · space separated</Label>
              <Input
                id="mcp-args"
                placeholder="-y @supabase/mcp-server-supabase@latest"
                value={form.args}
                onChange={(e) => setForm({ ...form, args: e.target.value })}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mcp-env">Env vars · KEY=value, one per line</Label>
              <Textarea
                id="mcp-env"
                rows={3}
                placeholder={"SUPABASE_ACCESS_TOKEN=sbp_..."}
                value={form.env}
                onChange={(e) => setForm({ ...form, env: e.target.value })}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mcp-desc">Description · optional</Label>
              <Input
                id="mcp-desc"
                placeholder="What this server provides"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2.5 pt-1">
              <PremiumButton
                onClick={save}
                disabled={!form.name.trim() || !form.command.trim()}
              >
                {form.id ? "Save changes" : "Add server"}
              </PremiumButton>
              <PremiumButton variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </PremiumButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
