# VertexOS Roadmap

The direction of travel: from a local-first website generator to a full open-source studio for building, editing, and shipping websites — without ever requiring an account or a paid plan.

Status legend: ✅ shipped · 🚧 in progress · 🗓 planned

---

## V1 — The Studio *(current)*

The core promise: brief it like an agency, get a website that doesn't look AI-generated, edit it visually, export a real project.

- ✅ **Website generation** — two-phase pipeline: Design Brief (Phase 1) → Website Blueprint (Phase 2). The site is never generated directly from raw user input.
- ✅ **Design DNA** — 15 design systems, each with distinct layout, hero, navigation, spacing, motion, and typography genomes.
- ✅ **Industry engine** — trade-specific homepage architectures with their own buyer psychology and section order.
- ✅ **Visual editor** — section tree, clickable live canvas, and per-element editing (text, CTAs, images, testimonials, FAQs, services, colors, contact info, section visibility). Local-first: localStorage for projects, IndexedDB for images.
- ✅ **Export ZIP** — complete Next.js + Tailwind project with content as editable JSON, bundled images, and a beginner deployment README.

## V1.5 — Polish & reliability

Make the V1 loop excellent before widening it.

- 🗓 **A more powerful editor** — drag-to-reorder sections, undo/redo, richer per-element controls.
- 🗓 **More templates & industries** — broaden the preset library and add new industry profiles.
- 🗓 **More AI providers out of the box** — first-class presets beyond the current set, with sensible default models.
- 🗓 **Better generation quality** — per-DNA few-shot examples, copy linting (banned-phrase detection), multi-variant generation with side-by-side compare.
- 🗓 **Richer project saving** — named projects, version history, duplicate/fork, JSON import/export for moving projects between browsers.

## V2 — Ship & deploy

Shorten the path from "exported" to "live."

- 🗓 **GitHub deployment guide** — an in-app guided flow: create repo, push, import to Vercel/Netlify, verify the live URL.
- 🗓 **One-click export** — skip the modal; download straight from the editor.
- 🗓 **Docker support** — an official image and `docker compose` for self-hosting the studio.
- 🗓 **More page types** — generate About, Services, and Contact pages from the blueprint, not just the homepage.

## V3 — The platform & ecosystem

One-click from brief to live site, and an ecosystem around the studio.

- 🗓 **GitHub integration** — connect an account; the studio creates the repo and pushes exports directly.
- 🗓 **One-click deployment** — provision Vercel/Netlify from inside the studio; domains guided end-to-end.
- 🗓 **Plugin / MCP ecosystem** — browse and install Model Context Protocol connectors (maps, reviews, booking, CRM) that extend both the studio and generated sites.
- 🗓 **Offline / local-model support** — deeper integration for fully local generation beyond today's Ollama path.

---

## Non-goals

Things we have decided **not** to build, so contributors don't burn time on them:

- **Paid hosting** — exports deploy to the user's own hosting; we never sit between you and your website.
- **Required accounts / login** — the studio stays local-first and anonymous.
- **A closed model** — generation stays bring-your-own-key with a fully offline engine fallback.

Have an idea that fits? Open a feature request.
