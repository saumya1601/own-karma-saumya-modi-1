# OWN KARMA — Section Brief & Implementation Plan

Source of truth:
- Visual mock: [Own-Karma Design.jpeg](./Own-Karma%20Design.jpeg)
- Creative direction: [own-karma-creative-brief.md](./own-karma-creative-brief.md)
- Reveal narrative: [OWN_KARMA_Reveal_Story.md](./OWN_KARMA_Reveal_Story.md)
- Design inspirations: [OWN_KARMA_Design_Inspirations.md](./OWN_KARMA_Design_Inspirations.md)

> The mock is a 2‑up thumbnail sheet. The **live site is a single-column stack of full-viewport sections, 01 → 10**.

---

## Global visual system

| Token          | Value (approx.)                | Use                                     |
| -------------- | ------------------------------ | --------------------------------------- |
| `--ink`        | `#0A0908`                      | Base background, ~60% of screen         |
| `--ink-2`      | `#141210`                      | Cards, portal backdrop                  |
| `--ivory`      | `#EDE6D3`                      | Display + body copy, ~30%               |
| `--ivory-dim`  | `rgba(237,230,211,.65)`        | Secondary copy                          |
| `--gold`       | `#C9A24B`                      | Meaningful words, borders, CTAs, ~10%   |
| `--gold-hi`    | `#E7C77A`                      | Particle highlights, hover glow         |

- **Display serif** — old-style humanist (Cormorant Garamond / Cinzel feel), wide tracking on caps.
- **UI / eyebrow sans** — small-caps, tracked +160–220 (labels `01  THE VOID`, button chrome, meta).
- **Section header pattern** — top-left `NN   SECTION NAME`, 12–14px, gold-ivory mix.
- **Buttons**
  - Outlined 1px `--gold` border, `[ ENTER ]` bracket variant on §01.
  - Primary (§10): filled `--gold`, ink text.
- **Motion principle** — stillness → movement → stillness. Reserve particle effects for §01, §02, §04, §07.

---

## Section brief (from the mock)

### 01 — THE VOID
Full-viewport black. Drifting gold particles (denser at left edge). Center stack:

- Eyebrow: `EVERY ACTION LEAVES A TRACE.`
- Single pulsing gold particle
- Eyebrow: `EVERY CHOICE CREATES A PATH.`
- Display: **OWN KARMA** (ivory) → `NOT BOUND. UNBOUND.` → outlined `[ ENTER ]` button
- Bottom micro: `SCROLL ↓`

### 02 — THE PORTAL
Dark ancient-architecture backdrop (ruined columns fading to fog). Large golden particle **ring** center-left. Small silhouette at bottom facing the portal. Right-of-center serif copy:

- `YOU ARE NOT / ENTERING A BRAND.`
- `YOU ARE / ENTERING AN IDEA.` (`AN IDEA` in gold)

### 03 — WHAT IS OWN KARMA?
Two-column editorial.

- Left: monumental stacked serif **OWN / YOUR / KARMA**, small caps `OWN YOUR KARMA.` beneath.
- Right: `OWN KARMA is a philosophy expressed through design.` + three lines with gold keywords **idea**, **meaning**, **story**.

### 04 — THE UNBOUND
- Row 1 small caps: `WE ARE NOT`
- Row 2 (huge): **BOUND.** rendered as dissolving gold particles → reforms right-side as solid gold **UNBOUND.**
- Left column list: `Not bound by culture / mythology / geography / time.`
- Right column: `Inspired by everything. / Defined by nothing.` (gold on **everything** / **nothing**)

### 05 — THE DESIGN UNIVERSE
Full-bleed strip of **8 circular vignettes**, caption below each:
`MYTHOLOGY · COSMOS · SACRED GEOMETRY · GOTHIC · ANCIENT CIVILIZATIONS · PHILOSOPHY · TIME · NATURE`.

- Desktop: hover expands with sub-scene
- Mobile: tap
- Accessible `<ul>` fallback for SEO / SR

### 06 — THE FOUR PILLARS
- Left ⅔: four monumental arched **doors** — `PILLAR I / II / III / IV`, each with a gold sigil and `ENTER` caption.
- Right ⅓ (opened door): `PILLAR I / PURPOSE` + body copy + silhouette inside a glowing sacred-geometry chamber.
- Selecting a door swaps the right panel; keyboard-navigable.

### 07 — FROM PHILOSOPHY TO GARMENT
Horizontal 5-step timeline with numbers 01–05:
`THOUGHT → PHILOSOPHY → SYMBOL → DESIGN → GARMENT` (particle head → gold bust → sigil → phoenix artwork → dark hoodie).

Caption below: `WE DON'T DECORATE CLOTHING. / WE TRANSFORM IDEAS INTO SOMETHING YOU CAN WEAR.` (`TRANSFORM IDEAS` in gold).

### 08 — THE FIRST PRODUCT
- Left ⅔: single black hoodie in dark studio with gold chest embroidery. Vertical gold-caps facet list to its left: `360° VIEW · FABRIC · EMBROIDERY · STITCHING · ARTWORK · LABELS`.
- Right card: close-up of the artwork + `DISCOVER / THE MEANING` + arrow button (opens dialog).

### 09 — THE KARMA ARCHIVE
- Left column: display `OK / 001`, sub `THE INFINITE PATH`, outlined `EXPLORE` button.
- Right: horizontal row of **5 tiles** `THE IDEA · THE SYMBOL · THE STORY · THE ARTWORK · THE GARMENT`.
- Pagination dots below for future entries.

### 10 — THE FINAL QUESTION + FOOTER
Three columns on near-black:

- Left serif: `WHAT WILL / YOU LEAVE BEHIND?`
- Center caps: `YOUR ACTIONS. / YOUR CHOICES. / YOUR STORY.` → gold serif `YOUR KARMA.`
- Right: OWN KARMA logo + `NOT BOUND. UNBOUND.` + primary filled-gold `ENTER THE COLLECTION` + outlined `EXPLORE THE UNIVERSE`, faint crescent behind.

Footer bar centered: `✦   © OWN KARMA. ALL RIGHTS RESERVED.`

---

## Implementation plan

### Phase 0 — Foundations (do first)
1. Per [AGENTS.md](../AGENTS.md): skim `node_modules/next/dist/docs/` for Next.js 16 App Router changes (metadata, `Image`, `next/font`, dynamic imports, any deprecations) **before writing pages/components**.
2. Wire `next/font` — one serif (Cormorant Garamond / Cinzel) + one sans (Inter) exposed as CSS variables.
3. Extend Tailwind v4 tokens in `@theme` inside [src/app/globals.css](../src/app/globals.css): `--color-ink`, `--color-ink-2`, `--color-ivory`, `--color-ivory-dim`, `--color-gold`, `--color-gold-hi`, `--font-serif`, `--font-sans`. Add reduced-motion helpers.
4. Add a client `<SmoothScrollProvider>` (Lenis) mounted in [src/app/layout.tsx](../src/app/layout.tsx); disable when `prefers-reduced-motion: reduce`.
5. Add `cn()` util (clsx + tailwind-merge) in `src/lib/utils/cn.ts`.

### Phase 1 — Shared primitives (`src/app/(marketing)/_components/`)
- `SectionShell` — full-viewport `<section>` with top-left `NN  LABEL`, id anchor, motion-safe wrapper.
- Typography atoms: `EyebrowLabel`, `DisplayHeading`, `BodyProse`, `GoldWord`.
- Buttons: `OutlinedButton` (bracket + plain variants), `PrimaryButton` (filled gold).
- `ScrollHint` — bottom `SCROLL ↓` with subtle bob.
- `Reveal` — framer-motion in-view wrapper (opacity/translate, staggered children).

### Phase 2 — Section builds
Each section is a client component in `src/app/(marketing)/_sections/`, exported from an `index.ts` barrel. **Copy lives in `src/content/sections.ts` so it stays SEO-indexable** (creative brief, priority 3).

| #  | Section                     | Primary tech                                                 | Key interaction                                                                 |
| -- | --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| 01 | `SectionVoid`               | tsParticles slim + framer-motion                             | Cursor influences nearby particles; timed reveal of headline stack              |
| 02 | `SectionPortal`             | R3F: instanced particle torus + drei postprocessing bloom    | Slow camera dolly toward ring on scroll (Lenis progress)                        |
| 03 | `SectionWhatIs`             | GSAP ScrollTrigger                                           | OWN → YOUR → KARMA stacks in on scroll; gold-word fade                          |
| 04 | `SectionUnbound`            | R3F points + shader dissolve **or** anime.js text-to-particles | BOUND fractures → travels → reforms as UNBOUND (signature moment)             |
| 05 | `SectionDesignUniverse`     | CSS + framer-motion; lazy R3F insets on hover                | 8 vignettes, hover expands with sub-scene; tap on mobile; `<ul>` fallback       |
| 06 | `SectionFourPillars`        | framer-motion layout + `AnimatePresence`                     | Click door → right pane cross-fades pillar content; keyboard/tab support        |
| 07 | `SectionPhilosophyToGarment`| GSAP ScrollTrigger horizontal pin                            | Scroll-scrubbed 5-stage transformation, preserves static readable snapshots     |
| 08 | `SectionFirstProduct`       | `next/image` + framer-motion; optional R3F 360 later         | Facet list drives hotspot highlight; `DISCOVER THE MEANING` opens dialog        |
| 09 | `SectionKarmaArchive`       | CSS grid + framer-motion                                     | Snap-scroll tile row, pagination dots, `OK / 001` featured card                 |
| 10 | `SectionFinalQuestion`      | framer-motion + tsParticles ember                            | Reflective reveal, primary + secondary CTA, footer strip                        |

### Phase 3 — Page composition & polish
1. Compose in [src/app/page.tsx](../src/app/page.tsx) as a stacked list of sections; proper `<h1>` / `<h2>` hierarchy.
2. Add `generateMetadata`, OG image, favicon, `theme-color` in [src/app/layout.tsx](../src/app/layout.tsx).
3. Lazy-load §02, §04, §07 (R3F/heavy) with `next/dynamic({ ssr: false })` + skeleton.
4. `prefers-reduced-motion` alternates for §01, §02, §04, §07 (static gold glyph replaces animation).
5. A11y pass: focus rings on all buttons/doors/tiles, `aria-label` on numeric section markers, list fallback for §05.
6. Performance pass: `next/image` for vignettes, code-split R3F, verify LCP text on §01 renders server-side.

### Phase 4 — Verify
- `npm run lint`
- `npm run build`
- Manual pass at 1440 / 1024 / 390 widths + reduced-motion + keyboard-only.

---

## Planned file map

```
src/
  app/
    layout.tsx                       # fonts, providers, metadata
    page.tsx                         # composes all sections
    globals.css                      # @theme tokens
    (marketing)/
      _components/                   # SectionShell, buttons, typography, Reveal
      _sections/
        01-void.tsx
        02-portal.tsx
        03-what-is.tsx
        04-unbound.tsx
        05-design-universe.tsx
        06-four-pillars.tsx
        07-philosophy-to-garment.tsx
        08-first-product.tsx
        09-karma-archive.tsx
        10-final-question.tsx
        index.ts
      _providers/
        smooth-scroll-provider.tsx   # Lenis + reduced-motion
  content/
    sections.ts                      # all copy (SEO-safe)
    pillars.ts
    archive.ts
    universe.ts
  lib/
    utils/cn.ts
    motion/variants.ts               # shared framer variants
    r3f/                             # portal + unbound scenes
```

---

## Open questions before build

1. **Fonts** — confirm Cormorant Garamond (serif) + Inter (sans) via `next/font`, or specify alternates.
2. **Assets** — vignette images (§05), pillar sigils (§06), hoodie photography (§08), archive tiles (§09): source files provided, or generate placeholder SVG / particle art in-code for now?
3. **CTAs** — should `ENTER THE COLLECTION` and `EXPLORE THE UNIVERSE` link to `#` placeholders, or defined routes?
4. **Scope** — build all 10 sections in one pass, or ship §01 → §04 first as the quality benchmark per creative brief priority 7 and iterate?
