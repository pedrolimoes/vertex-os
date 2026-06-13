"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpLeft,
  LayoutDashboard,
  LayoutTemplate,
  PenLine,
  PencilRuler,
  Plug2,
  KeyRound,
  Search,
} from "lucide-react";
import { Kbd } from "@/components/ds/kbd";
import { OPEN_COMMAND_MENU_EVENT } from "@/components/ds/command-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/studio", label: "Dashboard", icon: LayoutDashboard, kbd: "⌘1", exact: true },
  { href: "/studio/generator", label: "Generator", icon: PenLine, kbd: "⌘2" },
  { href: "/studio/editor", label: "Editor", icon: PencilRuler, kbd: "⌘3" },
  { href: "/studio/templates", label: "Templates", icon: LayoutTemplate, kbd: "⌘4" },
  { href: "/studio/connectors", label: "Connectors", icon: Plug2, kbd: "⌘5" },
  { href: "/studio/settings", label: "Provider & Keys", icon: KeyRound, kbd: "⌘6" },
];

function Wordmark() {
  return (
    <Link href="/" className="group flex items-center gap-2 px-2">
      <span className="relative flex h-6 w-6 items-center justify-center rounded-md border border-hairline-strong bg-gradient-to-b from-white/[0.12] to-white/[0.03] font-display text-[11px] font-bold text-white shadow-glass transition-all duration-300 group-hover:shadow-glow-accent">
        <span className="absolute inset-0 rounded-md bg-accent/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        <span className="relative">V</span>
      </span>
      <span className="font-display text-[13px] font-semibold tracking-tight text-white">
        VertexOS
        <span className="ml-1.5 font-mono text-[9px] font-normal uppercase tracking-[0.18em] text-white/35">
          studio
        </span>
      </span>
    </Link>
  );
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] p-3 md:block">
      <div className="glass-raised reflect flex h-full flex-col rounded-2xl py-4">
        <Wordmark />

        {/* Search / command trigger */}
        <div className="mt-4 px-2.5">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT))
            }
            className="flex w-full cursor-pointer items-center gap-2 rounded-md border border-hairline bg-black/25 px-2.5 py-1.5 text-left transition-colors duration-150 hover:border-hairline-strong"
          >
            <Search className="h-3.5 w-3.5 text-white/30" />
            <span className="flex-1 text-xs text-white/35">Search…</span>
            <Kbd>⌘K</Kbd>
          </button>
        </div>

        <nav className="mt-5 flex flex-col gap-px px-2.5">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-[7px] text-[13px] transition-all duration-200 ease-out",
                  active
                    ? "bg-gradient-to-r from-white/[0.1] to-white/[0.03] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                    : "text-white/45 hover:bg-white/[0.045] hover:text-white/85",
                )}
              >
                {/* Active indicator rail — glowing aqua. */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-full bg-accent transition-all duration-300",
                    active
                      ? "opacity-100 shadow-[0_0_8px_0_rgba(110,231,210,0.7)]"
                      : "opacity-0",
                  )}
                />
                <item.icon
                  className={cn(
                    "h-[15px] w-[15px] transition-colors",
                    active
                      ? "text-accent drop-shadow-[0_0_5px_rgba(110,231,210,0.5)]"
                      : "text-white/30 group-hover:text-white/60",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                <Kbd
                  className={cn(
                    "opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                    active && "opacity-100",
                  )}
                >
                  {item.kbd}
                </Kbd>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 px-2.5">
          <div className="rounded-xl border border-hairline bg-black/25 p-2.5">
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent" />
              local session
            </div>
            <p className="mt-1 text-[11px] leading-snug text-white/40">
              Keys and projects stay in this browser.
            </p>
          </div>
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1.5 px-2 text-[11px] text-white/30 transition-colors hover:text-white/70"
          >
            <ArrowUpLeft className="h-3 w-3" /> vertexsite.dev
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function SidebarNavMobile() {
  const pathname = usePathname();
  return (
    <div className="glass sticky top-3 z-40 mx-4 flex items-center gap-0.5 overflow-x-auto p-1.5 md:hidden">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors",
              active ? "bg-white/[0.08] text-white" : "text-white/45",
            )}
          >
            <item.icon className={cn("h-3.5 w-3.5", active && "text-accent")} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
