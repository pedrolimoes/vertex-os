"use client";

import { useState } from "react";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { McpServerConfig } from "@/lib/types";
import { GlassPanel } from "./glass-panel";
import { StatusBadge } from "./status-badge";
import { PremiumButton } from "./premium-button";
import { cn } from "@/lib/utils";

/**
 * A configured MCP server, presented like infrastructure: name, transport,
 * launch command, and an expandable JSON view of the exact config.
 */
export function ConnectorCard({
  server,
  onEdit,
  onDelete,
}: {
  server: McpServerConfig;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showJson, setShowJson] = useState(false);

  const json = {
    [server.name.toLowerCase().replace(/\s+/g, "-")]: {
      command: server.command,
      args: server.args,
      env: server.env,
    },
  };

  return (
    <GlassPanel interactive className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
            <span className="absolute h-2 w-2 animate-pulse-glow rounded-full bg-accent" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="truncate font-display text-sm font-semibold text-white">
                {server.name}
              </span>
              <StatusBadge status="neutral" dot={false}>
                stdio
              </StatusBadge>
            </div>
            {server.description && (
              <p className="mt-0.5 truncate text-xs text-white/40">
                {server.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <PremiumButton
            size="icon"
            variant="ghost"
            onClick={onEdit}
            aria-label={`Edit ${server.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </PremiumButton>
          <PremiumButton
            size="icon"
            variant="ghost"
            onClick={onDelete}
            aria-label={`Delete ${server.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </PremiumButton>
        </div>
      </div>

      <div className="border-t border-hairline bg-black/25 px-5 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <code className="truncate font-mono text-xs text-white/55">
            <span className="text-white/25">$ </span>
            {server.command} {server.args.join(" ")}
          </code>
          <button
            type="button"
            onClick={() => setShowJson((v) => !v)}
            className="flex shrink-0 cursor-pointer items-center gap-1 font-mono text-[11px] text-white/35 transition-colors hover:text-white/70"
          >
            json
            <ChevronDown
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                showJson && "rotate-180",
              )}
            />
          </button>
        </div>
        {showJson && (
          <pre className="mt-2.5 overflow-x-auto rounded-lg border border-hairline bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-white/50">
            {JSON.stringify(json, null, 2)}
          </pre>
        )}
        {Object.keys(server.env).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.keys(server.env).map((k) => (
              <StatusBadge key={k} dot={false}>
                {k}
              </StatusBadge>
            ))}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
