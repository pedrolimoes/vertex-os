# Contributing to VertexOS

Thanks for considering a contribution — this project gets better with every new design system, industry profile, template, provider, and bug report. You don't need to be an expert: docs fixes and small improvements are genuinely valued.

## Ground rules

- Be kind and constructive.
- Keep the product **local-first, login-free, and bring-your-own-key**. PRs that add required accounts, tracking, or paid gates will be declined (see [non-goals](ROADMAP.md#non-goals)).
- Match the existing visual language — the Liquid Glass studio UI is part of the product. Reuse `GlassPanel`, `PremiumButton`, `StatusBadge`, and the tokens in `tailwind.config.ts` rather than inventing new styles.

## Getting set up

```bash
git clone https://github.com/pedrolimoes/vertex-os.git
cd vertex-os
npm install
npm run dev          # studio at http://localhost:3000
npx tsc --noEmit     # typecheck
npm run build        # full production build (also runs lint)
```

No environment variables are needed. To test AI generation, add a key in **Studio → Provider & Keys** (OpenRouter free models work well); without one, the deterministic engine runs everything.

## Project map

| Area | Where | Notes |
|------|-------|-------|
| Discovery flow | `app/studio/generator/page.tsx`, `components/discovery/` | 10-section brief, progress rail, autosave |
| Generation pipeline | `app/api/generate/route.ts`, `lib/prompt.ts` | Two-phase: design brief → blueprint |
| Design DNA | `lib/design-dna.ts` | 15 design-system genomes |
| Design brief engine | `lib/design-brief.ts` | Phase 1, deterministic |
| Industry engine | `lib/industry-engine.ts` | Per-industry architecture + copy seeds |
| Blueprint engine | `lib/blueprint-generator.ts` | Phase 2, deterministic |
| Website renderer | `components/generator/site-canvas.tsx` | Themes + hero/nav variants + section renderers |
| Studio Mode | `components/studio-mode/` | Strategy · canvas · system switcher |
| Visual editor | `app/studio/editor/page.tsx` | Tree · clickable canvas · element panel |
| Providers | `lib/providers.ts` | Provider presets (base URL, default model, key hints) |
| Export | `lib/export-zip.ts` | Generates the standalone Next.js project |
| Storage | `lib/storage.ts`, `lib/idb-images.ts` | localStorage projects, IndexedDB images |
| Design system (studio UI) | `components/ds/`, `app/globals.css`, `tailwind.config.ts` | Glass surfaces, buttons, tokens |
| Types | `lib/types.ts` | Single source of truth for all shapes |

## High-impact contributions

**Add a provider** — add a `ProviderMeta` entry in `lib/providers.ts` (id, name, default base URL, default model, key hint). As long as it's OpenAI-compatible, that's usually all it takes.

**Add a design system** — add the DNA profile in `lib/design-dna.ts`, the option in `lib/discovery.ts`, and the theme in `components/generator/site-canvas.tsx`. The render hints (`heroLayout`, `navStyle`, `density`) are what make it feel structurally different — don't just change colors.

**Add an industry** — add a profile in `lib/industry-engine.ts` (buyer psychology, section order, hero seeds, industry-true FAQs) and the option in `lib/discovery.ts`. The test: would someone in that trade read the FAQ and nod?

**Add a template** — pre-fill the brief for a new industry or use case so users can start in one click.

**Add a section type** — extend `SectionType` in `lib/types.ts`, add a renderer in `site-canvas.tsx`, a case in the export template (`lib/export-zip.ts`), and wire it into industry section orders.

## Pull request workflow

1. Fork, then branch from `main`: `git checkout -b feat/luxury-serif-dna`.
2. Make the change. Keep PRs focused — one design system, one fix, one feature.
3. Verify before pushing — every PR that touches the UI must pass the **Definition of Done** (see [`CLAUDE.md`](../CLAUDE.md)). All five are required, not optional:
   - **Mobile responsiveness** — works at 375px / 768px / 1280px+; nothing overflows or clips.
   - **Navigation** — sidebar + mobile bar render; every link resolves; active states correct; `⌘K` works.
   - **Images** — all render, have meaningful `alt` text, and never break their container.
   - **Layout** — no overflow/overlap at any breakpoint; design-system components reused; aesthetic consistent.
   - **Build success** — `npm run build` is clean: types, lint, and all 19 pages, **zero errors and zero new warnings** (a dev `200` is not enough).
   - Also: `npx tsc --noEmit` is clean, and generate at least two industries and click through Studio Mode → Editor → Export.
4. Open the PR with a short description of *what* and *why*, plus screenshots for anything visual.

We review for: correctness, visual quality, the five gates above, and whether new generation output passes the "would a real designer ship this?" bar.

## Reporting bugs & requesting features

- **Bugs** — include the industry, design system, and provider you used; generation issues are often specific to a combination.
- **Features** — check the [roadmap](ROADMAP.md) first.

## License

By contributing you agree your contributions are licensed under the [MIT License](../LICENSE).
