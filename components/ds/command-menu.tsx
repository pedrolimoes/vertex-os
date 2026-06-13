"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CornerDownLeft,
  Globe,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  PenLine,
  Plug2,
  Search,
  type LucideIcon,
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { DEMO_SITES } from "@/lib/demo-sites";
import { TEMPLATE_ICONS } from "@/components/ds/template-card";
import { Kbd } from "@/components/ds/kbd";
import { cn } from "@/lib/utils";

export const OPEN_COMMAND_MENU_EVENT = "vss:open-command-menu";

interface Command {
  id: string;
  group: "Navigate" | "Create" | "Preview";
  label: string;
  hint?: string;
  icon: LucideIcon;
  shortcut?: string;
  href: string;
}

const NAV_COMMANDS: Command[] = [
  { id: "nav-dashboard", group: "Navigate", label: "Dashboard", icon: LayoutDashboard, shortcut: "⌘1", href: "/studio" },
  { id: "nav-generator", group: "Navigate", label: "Generator", icon: PenLine, shortcut: "⌘2", href: "/studio/generator" },
  { id: "nav-templates", group: "Navigate", label: "Templates", icon: LayoutTemplate, shortcut: "⌘3", href: "/studio/templates" },
  { id: "nav-connectors", group: "Navigate", label: "Connectors", icon: Plug2, shortcut: "⌘4", href: "/studio/connectors" },
  { id: "nav-settings", group: "Navigate", label: "Provider & Keys", icon: KeyRound, shortcut: "⌘5", href: "/studio/settings" },
];

const CREATE_COMMANDS: Command[] = [
  {
    id: "new-site",
    group: "Create",
    label: "New website",
    hint: "blank brief",
    icon: PenLine,
    href: "/studio/generator",
  },
  ...TEMPLATES.map((t) => ({
    id: `tpl-${t.id}`,
    group: "Create" as const,
    label: `New ${t.name} site`,
    hint: "template",
    icon: TEMPLATE_ICONS[t.icon] ?? PenLine,
    href: `/studio/generator?template=${t.id}`,
  })),
];

const PREVIEW_COMMANDS: Command[] = [
  {
    id: "demo-gallery",
    group: "Preview",
    label: "Demo website gallery",
    hint: "all industries",
    icon: Globe,
    href: "/templates",
  },
  ...DEMO_SITES.map((s) => ({
    id: `demo-${s.slug}`,
    group: "Preview" as const,
    label: `${s.business.name} — ${s.industry}`,
    hint: "live demo",
    icon: Globe,
    href: `/templates/liquid-glass/${s.slug}`,
  })),
];

const ALL_COMMANDS = [...NAV_COMMANDS, ...CREATE_COMMANDS, ...PREVIEW_COMMANDS];

/**
 * Global command palette. ⌘K (or ctrl+K) to open, ⌘1–5 jump straight
 * to a section. Other components can open it by dispatching
 * OPEN_COMMAND_MENU_EVENT on window.
 */
export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COMMANDS;
    return ALL_COMMANDS.filter((c) =>
      `${c.label} ${c.group} ${c.hint ?? ""}`.toLowerCase().includes(q),
    );
  }, [query]);

  const run = useCallback(
    (cmd: Command) => {
      setOpen(false);
      router.push(cmd.href);
    },
    [router],
  );

  // Global shortcuts.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        const idx = ["1", "2", "3", "4", "5"].indexOf(e.key);
        if (idx !== -1) {
          e.preventDefault();
          router.push(NAV_COMMANDS[idx].href);
        }
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, onOpenEvent);
    };
  }, [router]);

  // Reset state on open, focus the input.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the active row in view.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  let lastGroup: string | null = null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/55 px-4 pt-[16vh] backdrop-blur-[2px]"
      onMouseDown={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
    >
      <div
        className="glass-raised reflect w-full max-w-[560px] overflow-hidden rounded-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <Search className="h-4 w-4 shrink-0 text-white/30" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                run(results[active]);
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="Search pages, templates, actions…"
            className="h-12 w-full bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
            spellCheck={false}
          />
          <Kbd>esc</Kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto p-1.5">
          {results.length === 0 && (
            <p className="px-3 py-8 text-center text-[13px] text-white/30">
              No results for “{query}”
            </p>
          )}
          {results.map((cmd, i) => {
            const header =
              cmd.group !== lastGroup ? (
                <div className="px-2.5 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                  {cmd.group}
                </div>
              ) : null;
            lastGroup = cmd.group;
            return (
              <div key={cmd.id}>
                {header}
                <button
                  type="button"
                  data-index={i}
                  onClick={() => run(cmd)}
                  onMouseMove={() => setActive(i)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors duration-75",
                    i === active ? "bg-white/[0.07]" : "bg-transparent",
                  )}
                >
                  <cmd.icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      i === active ? "text-accent" : "text-white/35",
                    )}
                  />
                  <span className="flex-1 text-[13px] text-white/85">
                    {cmd.label}
                  </span>
                  {cmd.hint && (
                    <span className="font-mono text-[10px] text-white/25">
                      {cmd.hint}
                    </span>
                  )}
                  {cmd.shortcut && <Kbd>{cmd.shortcut}</Kbd>}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-hairline bg-black/25 px-4 py-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/30">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/30">
            <Kbd>
              <CornerDownLeft className="h-2.5 w-2.5" />
            </Kbd>{" "}
            open
          </span>
          <span className="ml-auto font-mono text-[10px] text-white/20">
            vertexsite studio
          </span>
        </div>
      </div>
    </div>
  );
}
