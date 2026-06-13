# Changelog

All notable changes to VertexOS are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-06-12

The first public release: the full brief → design brief → website → edit → export loop.

### Added

- **Two-phase generation architecture.** Websites are never generated directly from user input: Phase 1 produces a Design Brief (brand strategy, design language, visual identity, layout/component/motion/typography rules, color system, section requirements, conversion strategy); Phase 2 builds the site blueprint and must follow it.
- **Design DNA system.** 15 design systems, each with a structural genome — hero layout, navigation style, spacing density, component rules, motion character, typography rules — consumed directly by the renderer, so systems differ in architecture, not just color.
- **Industry engine.** 15 trade industries with their own buyer psychology, homepage section order, trust logic, stats, process, and industry-true FAQs.
- **Agency-style discovery.** Ten-section brief with progress rail, per-section summaries, contextual help, and auto-saved drafts.
- **Studio Mode.** Three-panel post-generation review: business strategy and design brief on the left, live canvas in the center, instant design-system switching on the right.
- **Studio Editor.** Visual editing over structured site data: section tree with visibility toggles, click-to-select live canvas, and a per-element panel for headlines, paragraphs, CTAs, links, images, testimonials, FAQs, services, stats, colors, logo, contact info, and SEO metadata.
- **Local-first storage.** Projects in localStorage, uploaded images in IndexedDB. No accounts, no cloud.
- **Export workflow.** One-click ZIP containing a standalone Next.js + Tailwind project — content as editable `data/site.json`, bundled images, inlined design system, and a beginner-friendly README covering local dev, GitHub, Vercel, Netlify, and custom domains. Includes an in-app "How to launch your website" guide.
- **BYOK providers.** OpenRouter, NVIDIA NIM, DeepInfra, Gemini, Ollama, and custom OpenAI-compatible endpoints, with a deterministic offline engine as the default.
- **Open-source scaffolding.** README, ROADMAP, CONTRIBUTING, MIT LICENSE, issue templates, and screenshot placeholders.

[1.0.0]: https://github.com/your-org/vertexos/releases/tag/v1.0.0
