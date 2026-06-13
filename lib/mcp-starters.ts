import type { McpServerConfig } from "./types";

export type McpStarter = Omit<McpServerConfig, "id"> & {
  /** Lucide icon id, resolved on the connectors page. */
  icon: string;
};

/** One-click starter configs for popular MCP servers. */
export const MCP_STARTERS: McpStarter[] = [
  {
    name: "Supabase MCP",
    description: "Query your Supabase project: database, auth, storage.",
    command: "npx",
    args: ["-y", "@supabase/mcp-server-supabase@latest"],
    env: { SUPABASE_ACCESS_TOKEN: "" },
    icon: "database",
  },
  {
    name: "GitHub MCP",
    description: "Repos, issues, and PRs for shipping generated sites.",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: "" },
    icon: "github",
  },
  {
    name: "Higgsfield MCP",
    description: "AI image & video generation for hero media and galleries.",
    command: "npx",
    args: ["-y", "higgsfield-mcp"],
    env: { HIGGSFIELD_API_KEY: "" },
    icon: "clapperboard",
  },
  {
    name: "Google Maps MCP",
    description: "Local SEO: places, reviews, and service-area data.",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-google-maps"],
    env: { GOOGLE_MAPS_API_KEY: "" },
    icon: "map",
  },
  {
    name: "Stripe / Square MCP",
    description: "Payments, invoices, and deposits for booked jobs.",
    command: "npx",
    args: ["-y", "@stripe/mcp", "--tools=all"],
    env: { STRIPE_SECRET_KEY: "" },
    icon: "credit-card",
  },
];
