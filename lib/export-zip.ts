"use client";

import JSZip from "jszip";
import type { SiteProject } from "./types";
import { getCanvasTheme } from "@/components/generator/site-canvas";
import { getDesignDNA } from "./design-dna";
import { getImageBlob, IDB_PREFIX } from "./idb-images";

/* ==========================================================================
   Export — turns a SiteProject into a downloadable, deployable Next.js
   project. The site ships as structured data (data/site.json) plus a
   self-contained renderer, so the exported code stays editable.
   ========================================================================== */

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "my-website"
  );
}

function extFor(blob: Blob): string {
  if (blob.type.includes("png")) return "png";
  if (blob.type.includes("webp")) return "webp";
  if (blob.type.includes("svg")) return "svg";
  if (blob.type.includes("gif")) return "gif";
  return "jpg";
}

/** Collect every image ref in the project. */
function collectRefs(project: SiteProject): string[] {
  const refs: string[] = [];
  for (const s of project.blueprint.homepage) {
    if (s.image) refs.push(s.image);
    for (const item of s.items ?? []) if (item.image) refs.push(item.image);
  }
  return refs;
}

/**
 * Build every text file of the exported project. Pure — no browser APIs —
 * so the export template is directly testable.
 */
export function buildProjectFiles(
  project: SiteProject,
  refToPath: Record<string, string> = {},
  logoPath = "",
): Record<string, string> {
  const slug = slugify(project.name);
  const theme = getCanvasTheme(project.system);
  const dna = getDesignDNA(project.system);

  /* ---- site data with refs rewritten to public paths ---- */
  const blueprint = structuredClone(project.blueprint);
  for (const s of blueprint.homepage) {
    if (s.image && refToPath[s.image]) s.image = refToPath[s.image];
    for (const item of s.items ?? []) {
      if (item.image && refToPath[item.image]) item.image = refToPath[item.image];
    }
  }

  const siteData = {
    name: project.brief.business.businessName || project.name,
    city: project.brief.business.city,
    industry: project.brief.business.industry,
    logo: logoPath,
    contact: project.contact,
    seo: blueprint.seo,
    cta: blueprint.ctaStrategy,
    pages: blueprint.structure.pages.map((p) => ({ id: p.id, title: p.title })),
    sections: blueprint.homepage.filter((s) => !s.hidden),
    palette: blueprint.design.palette,
    designBrief: project.designBrief,
  };

  return {
    "package.json": packageJson(slug),
    "next.config.mjs": `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;\n`,
    "postcss.config.mjs": `export default { plugins: { tailwindcss: {} } };\n`,
    "tailwind.config.ts": tailwindConfig(),
    "tsconfig.json": tsconfigJson(),
    ".gitignore": `node_modules\n.next\nout\n.env*\n.DS_Store\n`,
    "data/site.json": JSON.stringify(siteData, null, 2),
    "app/globals.css": globalsCss(),
    "app/layout.tsx": layoutTsx(siteData.seo.title, siteData.seo.description),
    "app/page.tsx": pageTsx(),
    "components/site.tsx": siteComponent(theme, dna),
    "README.md": readme(project),
  };
}

export async function exportProjectZip(project: SiteProject): Promise<void> {
  const zip = new JSZip();
  const slug = slugify(project.name);

  /* ---- images: IndexedDB blobs + logo → public/images ---- */
  const refToPath: Record<string, string> = {};
  for (const ref of collectRefs(project)) {
    if (!ref.startsWith(IDB_PREFIX) || refToPath[ref]) continue;
    const blob = await getImageBlob(ref);
    if (!blob) continue;
    const file = `images/${ref.slice(IDB_PREFIX.length)}.${extFor(blob)}`;
    zip.file(`public/${file}`, blob);
    refToPath[ref] = `/${file}`;
  }

  let logoPath = "";
  if (project.brief.visual.logoDataUrl.startsWith("data:")) {
    const match = project.brief.visual.logoDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const ext = match[1].includes("svg") ? "svg" : match[1].includes("png") ? "png" : "jpg";
      logoPath = `/images/logo.${ext}`;
      zip.file(`public/images/logo.${ext}`, match[2], { base64: true });
    }
  }

  for (const [path, contents] of Object.entries(buildProjectFiles(project, refToPath, logoPath))) {
    zip.file(path, contents);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ========================================================================== */

function packageJson(slug: string): string {
  return JSON.stringify(
    {
      name: slug,
      version: "1.0.0",
      private: true,
      scripts: { dev: "next dev", build: "next build", start: "next start" },
      dependencies: {
        next: "^15.1.7",
        react: "^19.0.0",
        "react-dom": "^19.0.0",
      },
      devDependencies: {
        "@types/node": "^22.10.0",
        "@types/react": "^19.0.0",
        "@types/react-dom": "^19.0.0",
        tailwindcss: "^3.4.17",
        typescript: "^5.7.0",
      },
    },
    null,
    2,
  );
}

function tailwindConfig(): string {
  return `import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-sans)", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        mono: ["ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
`;
}

function tsconfigJson(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  );
}

function globalsCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}
`;
}

function layoutTsx(title: string, description: string): string {
  return `import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const editorial = Fraunces({ subsets: ["latin"], variable: "--font-editorial", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={sans.variable + " " + editorial.variable + " font-display antialiased"}>
        {children}
      </body>
    </html>
  );
}
`;
}

function pageTsx(): string {
  return `import { Site } from "@/components/site";
import siteData from "@/data/site.json";

export default function Home() {
  return <Site data={siteData as never} />;
}
`;
}

/**
 * The exported renderer. Self-contained: theme classes and DNA render
 * hints are inlined as literals so Tailwind can scan them, and the only
 * dependencies are react + next.
 */
function siteComponent(
  theme: ReturnType<typeof getCanvasTheme>,
  dna: ReturnType<typeof getDesignDNA>,
): string {
  const pad =
    dna.density === "airy" ? "px-7 py-16" : dna.density === "dense" ? "px-7 py-9" : "px-7 py-12";

  return `/* Generated by VertexOS — edit data/site.json to change content. */
/* Design system: ${dna.name}. Theme + layout hints are inlined below. */

interface Theme {
  pageBg: string; page: string; heading: string; body: string; panel: string;
  button: string; buttonGhost: string; chip: string; muted: string; eyebrow: string;
  usesBrandBg: boolean; fixedBrand?: string; heroGlow: string;
}
const THEME: Theme = ${JSON.stringify(theme, null, 2)};
const HERO_LAYOUT: string = ${JSON.stringify(dna.heroLayout)};
const NAV_STYLE: string = ${JSON.stringify(dna.navStyle)};
const PAD: string = ${JSON.stringify(pad)};

interface Item { title: string; body: string; meta?: string; image?: string }
interface Section {
  type: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  items?: Item[];
  stats?: { value: string; label: string }[];
  cta?: { label: string; secondary?: string; href?: string };
  image?: string;
}
export interface SiteData {
  name: string;
  city: string;
  logo: string;
  contact: { phone: string; email: string; address: string };
  cta: { primary: string };
  pages: { id: string; title: string }[];
  sections: Section[];
  palette: { primary: string; secondary: string; accent: string; background: string };
}

function readableInk(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return "#000";
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#0a0a0c" : "#ffffff";
}

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

function Btn({ brand, children, big }: { brand: string; children: React.ReactNode; big?: boolean }) {
  return (
    <a
      href="#contact"
      className={cx("inline-block", big ? "px-7 py-3.5 text-sm" : "px-6 py-3 text-sm", THEME.button)}
      style={{ backgroundColor: brand, color: readableInk(brand) }}
    >
      {children}
    </a>
  );
}

function Img({ src, label, fallback }: { src?: string; label?: string; fallback?: React.CSSProperties }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={label ?? ""} className="h-full w-full object-cover" />;
  }
  return (
    <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest opacity-50" style={fallback}>
      {label ?? "photo"}
    </div>
  );
}

function Hero({ s, brand, brandText }: { s: Section; brand: string; brandText: string }) {
  const glow =
    THEME.heroGlow === "ambient" ? "radial-gradient(ellipse 75% 60% at 50% -10%, " + brand + "26, transparent)"
    : THEME.heroGlow === "spotlight" ? "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,255,255,0.09), transparent 70%)"
    : THEME.heroGlow === "gradient" ? "linear-gradient(165deg, " + brand + "21, transparent 55%)"
    : undefined;

  if (HERO_LAYOUT === "split") {
    return (
      <section className="relative grid items-center gap-10 px-7 py-20 lg:grid-cols-[1.1fr_1fr]" style={glow ? { background: glow } : undefined}>
        <div>
          {s.eyebrow && <div className={cx("mb-4 inline-block px-4 py-1.5 text-xs", THEME.chip)}>{s.eyebrow}</div>}
          <h1 className={cx("max-w-xl text-4xl leading-[1.06] sm:text-5xl", THEME.heading)}>{s.title}</h1>
          <p className={cx("mt-5 max-w-md text-base leading-relaxed", THEME.muted)}>{s.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {s.cta && <Btn brand={brand}>{s.cta.label}</Btn>}
            {s.cta?.secondary && <a href="#services" className={cx("px-6 py-3 text-sm", THEME.buttonGhost)}>{s.cta.secondary}</a>}
          </div>
        </div>
        <div className={cx("overflow-hidden", THEME.panel)}>
          <div className="aspect-[4/3]">
            <Img src={s.image} label="hero" fallback={{ background: "linear-gradient(135deg, " + brand + "40, " + brand + "10 60%, transparent)" }} />
          </div>
        </div>
      </section>
    );
  }

  if (HERO_LAYOUT === "editorial-left") {
    return (
      <section className="relative px-7 pb-16 pt-24">
        {s.eyebrow && <div className={cx("mb-6", THEME.eyebrow)}>{s.eyebrow}</div>}
        <h1 className={cx("max-w-4xl text-5xl leading-[1.05] sm:text-6xl", THEME.heading)}>{s.title}</h1>
        <div className="mt-10 grid gap-8 border-t border-current/15 pt-8 lg:grid-cols-[2fr_1fr]">
          <p className={cx("max-w-xl text-lg leading-relaxed", THEME.muted)}>{s.body}</p>
          <div className="flex flex-col items-start gap-4">
            {s.cta && <Btn brand={brand}>{s.cta.label}</Btn>}
            {s.cta?.secondary && <a href="#services" className={cx("text-sm underline underline-offset-4", THEME.muted)}>{s.cta.secondary}</a>}
          </div>
        </div>
      </section>
    );
  }

  if (HERO_LAYOUT === "oversized") {
    return (
      <section className="relative px-7 pb-20 pt-28" style={glow ? { background: glow } : undefined}>
        {s.eyebrow && <div className={cx("mb-10", THEME.eyebrow)}>{s.eyebrow}</div>}
        <h1 className={cx("max-w-6xl text-6xl leading-[0.98] sm:text-7xl lg:text-8xl", THEME.heading)}>{s.title}</h1>
        <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
          <p className={cx("max-w-sm text-base leading-relaxed", THEME.muted)}>{s.body}</p>
          <div className="flex items-center gap-4">
            {s.cta && <Btn brand={brand} big>{s.cta.label}</Btn>}
            {s.cta?.secondary && <a href="#services" className={cx("px-6 py-3.5 text-sm", THEME.buttonGhost)}>{s.cta.secondary}</a>}
          </div>
        </div>
      </section>
    );
  }

  if (HERO_LAYOUT === "showroom") {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Img src={s.image} label="" fallback={{ background: "radial-gradient(ellipse 80% 70% at 70% 20%, " + brand + "33, transparent 65%), linear-gradient(180deg, transparent, rgba(0,0,0,0.55))" }} />
        </div>
        <div className="relative flex min-h-[70vh] flex-col justify-end px-7 pb-16 pt-32">
          {s.eyebrow && <div className={cx("mb-5", THEME.eyebrow)}>{s.eyebrow}</div>}
          <h1 className={cx("max-w-3xl text-5xl leading-[1.02] sm:text-6xl", THEME.heading)}>{s.title}</h1>
          <p className={cx("mt-5 max-w-md text-base leading-relaxed", THEME.muted)}>{s.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {s.cta && <Btn brand={brand}>{s.cta.label}</Btn>}
            {s.cta?.secondary && <a href="#services" className={cx("px-6 py-3 text-sm", THEME.buttonGhost)}>{s.cta.secondary}</a>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-7 py-24 text-center" style={glow ? { background: glow } : undefined}>
      {s.eyebrow && <div className={cx("mx-auto mb-6 inline-block px-4 py-1.5 text-xs", THEME.chip)}>{s.eyebrow}</div>}
      <h1 className={cx("mx-auto max-w-3xl text-4xl leading-[1.08] sm:text-6xl", THEME.heading)}>{s.title}</h1>
      <p className={cx("mx-auto mt-6 max-w-xl text-base leading-relaxed", THEME.muted)}>{s.body}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {s.cta && <Btn brand={brand}>{s.cta.label}</Btn>}
        {s.cta?.secondary && <a href="#services" className={cx("px-6 py-3 text-sm", THEME.buttonGhost)}>{s.cta.secondary}</a>}
      </div>
    </section>
  );
}

function SectionBlock({ s, brand, brandText }: { s: Section; brand: string; brandText: string }) {
  const ink = readableInk(brand);

  switch (s.type) {
    case "emergency-banner":
      return (
        <section className="px-7 py-3">
          <div className={cx("flex flex-wrap items-center justify-between gap-3 px-6 py-4", THEME.panel)} style={{ borderColor: brand + "55", background: brand + "14" }}>
            <div>
              <span className="text-sm font-bold">{s.title}</span>
              <span className={cx("ml-3 hidden text-sm sm:inline", THEME.muted)}>{s.body}</span>
            </div>
            {s.cta && <Btn brand={brand}>{s.cta.label}</Btn>}
          </div>
        </section>
      );

    case "trust-bar":
      return (
        <section className="border-y border-current/10 px-7 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {s.items?.map((i) => (
              <span key={i.title} className={cx("flex items-center gap-2 text-xs", THEME.muted)}>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: brandText }} />
                {i.title}
              </span>
            ))}
          </div>
        </section>
      );

    case "stats":
      return (
        <section className="px-7 py-12">
          <div className={cx("grid grid-cols-2 gap-px overflow-hidden sm:grid-cols-4", THEME.panel)} style={{ background: brand + "0d" }}>
            {s.stats?.map((st) => (
              <div key={st.label} className="px-5 py-8 text-center">
                <div className={cx("text-2xl font-bold tabular-nums", THEME.heading)} style={{ color: brandText }}>{st.value}</div>
                <div className={cx("mt-1 text-[11px] uppercase tracking-[0.14em]", THEME.muted)}>{st.label}</div>
              </div>
            ))}
          </div>
        </section>
      );

    case "process":
      return (
        <section className={PAD}>
          {s.eyebrow && <div className={cx("mb-3", THEME.eyebrow)} style={{ color: brandText }}>{s.eyebrow}</div>}
          <h2 className={cx("max-w-lg text-3xl", THEME.heading)}>{s.title}</h2>
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {s.items?.map((item, i) => (
              <div key={i}>
                <div className="font-editorial text-5xl font-light italic opacity-30" style={{ color: brandText }}>{i + 1}</div>
                <div className={cx("mt-3 text-base font-semibold", THEME.heading)}>{item.title}</div>
                <p className={cx("mt-2 text-sm leading-relaxed", THEME.muted)}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case "before-after":
    case "gallery":
      return (
        <section className={PAD} id="gallery">
          <div className="text-center">
            {s.eyebrow && <div className={cx("mb-3", THEME.eyebrow)} style={{ color: brandText }}>{s.eyebrow}</div>}
            <h2 className={cx("text-3xl", THEME.heading)}>{s.title}</h2>
            {s.body && <p className={cx("mx-auto mt-3 max-w-md text-sm leading-relaxed", THEME.muted)}>{s.body}</p>}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {s.items?.slice(0, 6).map((item, i) => (
              <figure key={i} className={cx("overflow-hidden", THEME.panel)}>
                <div className="aspect-[4/3]">
                  <Img src={item.image} label="photo" fallback={{ background: "linear-gradient(" + (135 + i * 40) + "deg, " + brand + "38, transparent 70%)" }} />
                </div>
                <figcaption className={cx("px-4 py-3 text-xs", THEME.muted)}>{item.body || item.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      );

    case "packages":
      return (
        <section className={PAD}>
          <div className="text-center">
            {s.eyebrow && <div className={cx("mb-3", THEME.eyebrow)} style={{ color: brandText }}>{s.eyebrow}</div>}
            <h2 className={cx("text-3xl", THEME.heading)}>{s.title}</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {s.items?.slice(0, 3).map((item, i) => (
              <div key={i} className={cx("relative p-7", THEME.panel)} style={item.meta ? { borderColor: brand + "88" } : undefined}>
                {item.meta && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: brand, color: ink }}>
                    {item.meta}
                  </span>
                )}
                <div className={cx("text-base font-semibold", THEME.heading)}>{item.title}</div>
                <p className={cx("mt-3 text-sm leading-relaxed", THEME.muted)}>{item.body}</p>
                <div className="mt-6">
                  <a href="#contact" className={cx("inline-block px-5 py-2.5 text-xs", THEME.buttonGhost)}>Get pricing</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case "testimonials":
      return (
        <section className={PAD}>
          <div className="text-center">
            {s.eyebrow && <div className={cx("mb-3", THEME.eyebrow)} style={{ color: brandText }}>{s.eyebrow}</div>}
            <h2 className={cx("text-3xl", THEME.heading)}>{s.title}</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {s.items?.slice(0, 4).map((item, i) => (
              <blockquote key={i} className={cx("p-8", THEME.panel)}>
                <div className="text-sm" style={{ color: brandText }}>★★★★★</div>
                <p className="mt-4 text-base italic leading-relaxed">{item.body}</p>
                <footer className="mt-5 text-sm font-semibold" style={{ color: brandText }}>
                  {item.title}
                  {item.meta && <span className={cx("ml-2 font-normal", THEME.muted)}>{item.meta}</span>}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      );

    case "faq":
      return (
        <section className={PAD} id="faq">
          <div className="text-center">
            {s.eyebrow && <div className={cx("mb-3", THEME.eyebrow)} style={{ color: brandText }}>{s.eyebrow}</div>}
            <h2 className={cx("text-3xl", THEME.heading)}>{s.title}</h2>
          </div>
          <div className="mx-auto mt-10 max-w-2xl space-y-3">
            {s.items?.map((item, i) => (
              <details key={i} className={cx("px-6 py-4", THEME.panel)} open={i === 0}>
                <summary className="cursor-pointer list-none text-base font-semibold">{item.title}</summary>
                <p className={cx("mt-3 text-sm leading-relaxed", THEME.muted)}>{item.body}</p>
              </details>
            ))}
          </div>
        </section>
      );

    case "final-cta":
      return (
        <section className="px-7 py-20" id="contact">
          <div className={cx("p-12 text-center", THEME.panel)} style={{ background: "linear-gradient(135deg, " + brand + "2b, transparent 65%)" }}>
            <h2 className={cx("mx-auto max-w-xl text-3xl sm:text-4xl", THEME.heading)}>{s.title}</h2>
            <p className={cx("mx-auto mt-4 max-w-md text-base leading-relaxed", THEME.muted)}>{s.body}</p>
            {s.cta && <div className="mt-8"><Btn brand={brand} big>{s.cta.label}</Btn></div>}
          </div>
        </section>
      );

    // service-grid, seasonal, service-area, certifications, insurance,
    // financing, guarantee, team — all render through the flexible default.
    default:
      return (
        <section className={PAD} id={s.type === "service-grid" ? "services" : undefined}>
          <div className="text-center">
            {s.eyebrow && <div className={cx("mb-3", THEME.eyebrow)} style={{ color: brandText }}>{s.eyebrow}</div>}
            <h2 className={cx("mx-auto max-w-2xl text-3xl", THEME.heading)}>{s.title}</h2>
            {s.body && <p className={cx("mx-auto mt-4 max-w-xl text-sm leading-relaxed", THEME.muted)}>{s.body}</p>}
          </div>
          {s.items && s.items.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.items.map((item, i) => (
                <div key={i} className={cx("p-6", THEME.panel)}>
                  <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: brand + "22", color: brandText }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={cx("text-base font-semibold", THEME.heading)}>{item.title}</div>
                  {item.body && <p className={cx("mt-2 text-sm leading-relaxed", THEME.muted)}>{item.body}</p>}
                </div>
              ))}
            </div>
          )}
          {s.cta && <div className="mt-8 text-center"><Btn brand={brand}>{s.cta.label}</Btn></div>}
        </section>
      );
  }
}

export function Site({ data }: { data: SiteData }) {
  const brand = data.palette.secondary || data.palette.primary;
  const brandText = brand;
  const ink = readableInk(brand);
  const hero = data.sections.find((s) => s.type === "hero");
  const rest = data.sections.filter((s) => s.type !== "hero");
  const navPages = data.pages.filter((p) => p.id !== "home").slice(0, 4);

  return (
    <div className={cx("min-h-screen", THEME.page)}>
      {/* Navigation */}
      {NAV_STYLE === "glass-pill" ? (
        <div className="sticky top-0 z-20 px-5 pt-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between rounded-full border border-white/12 bg-white/[0.06] px-6 py-3 backdrop-blur-xl">
            <span className={cx("flex items-center gap-2.5 text-base font-bold", THEME.heading)}>
              {data.logo && <img src={data.logo} alt="" className="h-6 w-auto" />}
              {data.name}
            </span>
            <div className={cx("hidden gap-6 text-sm sm:flex", THEME.muted)}>
              {navPages.map((p) => <a key={p.id} href={"#" + p.id}>{p.title}</a>)}
            </div>
            <Btn brand={brand}>{data.cta.primary}</Btn>
          </div>
        </div>
      ) : (
        <div className={cx("flex items-center justify-between px-7 py-4", NAV_STYLE === "bold-bar" ? "border-b-2 border-current/15" : NAV_STYLE === "minimal-text" ? "" : "border-b border-current/10")}>
          <span className={cx("flex items-center gap-2.5 text-base font-bold", THEME.heading)}>
            {data.logo && <img src={data.logo} alt="" className="h-6 w-auto" />}
            {data.name}
          </span>
          <div className={cx("hidden gap-6 text-sm sm:flex", THEME.muted)}>
            {navPages.map((p) => <a key={p.id} href={"#" + p.id}>{p.title}</a>)}
            {NAV_STYLE === "bold-bar" && data.contact.phone && (
              <span className="font-extrabold tabular-nums" style={{ color: brandText }}>{data.contact.phone}</span>
            )}
          </div>
          <Btn brand={brand}>{data.cta.primary}</Btn>
        </div>
      )}

      <main className="mx-auto max-w-6xl">
        {hero && <Hero s={hero} brand={brand} brandText={brandText} />}
        {rest.map((s, i) => (
          <SectionBlock key={s.type + "-" + i} s={s} brand={brand} brandText={brandText} />
        ))}
      </main>

      {/* Footer */}
      <footer className={cx("border-t border-current/10 px-7 py-10 text-center text-sm", THEME.muted)}>
        {(data.contact.phone || data.contact.email || data.contact.address) && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {data.contact.phone && <a href={"tel:" + data.contact.phone} style={{ color: brandText }}>{data.contact.phone}</a>}
            {data.contact.email && <a href={"mailto:" + data.contact.email}>{data.contact.email}</a>}
            {data.contact.address && <span>{data.contact.address}</span>}
          </div>
        )}
        © {new Date().getFullYear()} {data.name}{data.city ? " · " + data.city : ""}
      </footer>
    </div>
  );
}
`;
}

function readme(project: SiteProject): string {
  const name = project.brief.business.businessName || project.name;
  return `# ${name} — website

Generated with [VertexOS](https://github.com/vertexos/vertexos), edited in the Studio Editor, and exported as a real Next.js project. Everything below assumes zero prior experience — follow it top to bottom.

## What's in this folder

| Path | What it is |
|------|------------|
| \`data/site.json\` | All of your website's content. Edit text here — no code needed. |
| \`components/site.tsx\` | The design system that renders your content. |
| \`public/images/\` | Your uploaded images. Replace files here to swap photos. |
| \`app/\` | The Next.js application shell. |

## 1. Run it on your computer

1. Install [Node.js](https://nodejs.org) (LTS version) if you don't have it.
2. Open this folder in [VS Code](https://code.visualstudio.com) (File → Open Folder).
3. Open the built-in terminal (Terminal → New Terminal) and run:

\`\`\`bash
npm install
npm run dev
\`\`\`

4. Open http://localhost:3000 — that's your website running locally.

## 2. Put it on GitHub

1. Create a free account at [github.com](https://github.com).
2. Click **New repository**, name it (e.g. \`my-website\`), keep it Public or Private, and create it **without** a README.
3. Back in the VS Code terminal:

\`\`\`bash
git init
git add .
git commit -m "My website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/my-website.git
git push -u origin main
\`\`\`

## 3. Deploy to Vercel (recommended, free)

1. Go to [vercel.com](https://vercel.com) and sign up **with your GitHub account**.
2. Click **Add New → Project**.
3. Pick your \`my-website\` repository and click **Import**.
4. Don't change any settings — click **Deploy**.
5. In about a minute you'll get a live URL like \`my-website.vercel.app\`.

Every time you push to GitHub, Vercel redeploys automatically.

## 4. Deploy to Netlify (alternative, also free)

1. Go to [netlify.com](https://netlify.com) and sign up with GitHub.
2. Click **Add new site → Import an existing project**.
3. Pick your repository.
4. Build command: \`npm run build\` · Publish directory: \`.next\` (Netlify detects Next.js automatically).
5. Click **Deploy site**.

## 5. Connect your own domain

On **Vercel**: Project → Settings → Domains → Add → type your domain → follow the DNS instructions shown (you'll add an A record or CNAME at your domain registrar — GoDaddy, Namecheap, etc.).

On **Netlify**: Site → Domain settings → Add custom domain → follow the DNS instructions.

DNS changes can take up to an hour. Both platforms give you free HTTPS automatically.

## Editing your site later

- **Text:** edit \`data/site.json\` — every headline, paragraph, and button label lives there.
- **Images:** drop new files into \`public/images/\` and update the paths in \`data/site.json\`.
- **Colors:** edit the \`palette\` block at the bottom of \`data/site.json\`.

Then commit and push — your host redeploys automatically:

\`\`\`bash
git add .
git commit -m "Updated content"
git push
\`\`\`
`;
}
