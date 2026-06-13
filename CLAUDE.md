# VertexOS — Project Rules

Instructions for anyone (human or AI) building on VertexOS. These are **rules, not suggestions**. Follow them exactly.

---

## Definition of Done

No UI change is "done" until **all five** of these pass. Check every one before claiming a task is complete — do not skip any, even for a "one-line" change.

### 1. Mobile responsiveness
- The change must work at **mobile (375px)**, **tablet (768px)**, and **desktop (1280px+)**. Verify all three, not just desktop.
- Nothing may overflow horizontally or clip at small widths. No fixed pixel widths that break the viewport.
- Touch targets stay tappable; text stays readable; `md:`/`lg:` breakpoints are used deliberately, not by accident.

### 2. Navigation
- Both the desktop sidebar (`SidebarNav`) and the mobile bar (`SidebarNavMobile`) must render and work.
- Every link must resolve to a real route — no dead links. Active/`aria-current` states must be correct on the page they point to.
- The command menu (`⌘K`) and keyboard shortcuts must still open and route correctly.

### 3. Images
- Every image must actually render — no broken `src`, no missing IndexedDB/`public` refs.
- Every image needs meaningful `alt` text (decorative images use `alt=""` + `aria-hidden`).
- Images must be sized/contained so they never overflow their card or break layout. Respect aspect ratios.

### 4. Layout
- No overflow, no overlapping elements, no broken grids at any breakpoint.
- Maintain spacing, hierarchy, and visual rhythm. Reuse the design system — `GlassPanel`, `PremiumButton`, `StatusBadge`, and the tokens in `tailwind.config.ts` — rather than inventing one-off styles.
- Keep the Liquid Glass / spatial aesthetic consistent. Don't introduce colored fills outside the accent/spatial tokens.

### 5. Build success
- `npm run build` must pass cleanly: **TypeScript types**, **ESLint**, and **all 19 static pages** generating, with **zero errors and zero new warnings**.
- A dev-mode `200` is **not** sufficient — the production build is the gate. Run it before declaring done.

---

## Core product guardrails

- **Local-first, login-free, bring-your-own-key.** Never add required accounts, server-side key storage, tracking, or paid gates. Keys and projects live in the browser only.
- **Never commit secrets.** No real API keys in code, config, or committed env files. `.env*` is gitignored except `.env.example`.
- **Two-phase generation stays intact.** Sites are produced via Design Brief → Blueprint, never directly from raw input. The deterministic engine must keep working with no API key.
- **Don't remove features** when redesigning. Preserve functionality; improve the surface.

---

## Verify before pushing

```bash
npx tsc --noEmit     # types clean
npm run build        # 19/19 pages, no errors/warnings  (Definition of Done #5)
node scripts/shots.mjs   # regenerate docs/screenshots if the UI changed
```

Then sanity-check the change against the **Definition of Done** above at mobile, tablet, and desktop widths.
