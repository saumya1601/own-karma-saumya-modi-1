# OWN KARMA — Copilot Working Notes

## Read the parent guides first

1. Repo root: [AGENTS.md](../AGENTS.md) — **Next.js 16 has breaking changes.** Always check `node_modules/next/dist/docs/` before writing pages/components. Heed deprecation notices.
2. Repo root: [CLAUDE.md](../CLAUDE.md) — extends AGENTS.md.

## UI/UX skill (auto-invoke for design/UI work)

For any task that touches **UI structure, visual design decisions, interaction patterns, or user experience quality control**, use the workspace-installed **ui-ux-pro-max** skill:

- Prompt file: [.github/prompts/ui-ux-pro-max/PROMPT.md](./prompts/ui-ux-pro-max/PROMPT.md)
- Persisted design system: [design-system/own-karma/MASTER.md](../design-system/own-karma/MASTER.md)
- Full UX rules: [.github/prompts/ui-ux-pro-max/references/quick-reference.md](./prompts/ui-ux-pro-max/references/quick-reference.md)
- Pre-delivery checklist: [.github/prompts/ui-ux-pro-max/references/pro-rules.md](./prompts/ui-ux-pro-max/references/pro-rules.md)

**Trigger words:** design, style, color, palette, typography, font, layout, spacing, hover, focus, animation, motion, accessibility, a11y, contrast, responsive, mobile, dark mode, icon, chart, dashboard, landing page, component, review UI, improve UX, fix layout.

**Run tools (PowerShell):**

```powershell
python .github\prompts\ui-ux-pro-max\scripts\search.py "<query>" --domain <domain>
python .github\prompts\ui-ux-pro-max\scripts\search.py "<query>" --design-system -p "OWN KARMA" --variance 3 --motion 6 --density 3
python .github\prompts\ui-ux-pro-max\scripts\search.py "<query>" --stack nextjs
```

Domain auto-detects when `--domain` is omitted, but pass it explicitly if the query has ambiguous terms (e.g. "font" hits both `typography` and `google-fonts`).

## Project-specific conventions

- **Design tokens** live in [src/app/globals.css](../src/app/globals.css) under `@theme inline`. Use CSS variables (`--color-ink`, `--color-ivory`, `--color-gold`, `--font-serif`, etc.), not raw hex.
- **Copy** lives in [src/content/](../src/content/) so it stays SEO-indexable (creative brief, priority 3). Do NOT hardcode headline text inside components.
- **Sections** are client components in [src/app/(marketing)/_sections/](../src/app/(marketing)/_sections/), each exported from `index.ts`.
- **Shared primitives** in [src/app/(marketing)/_components/](../src/app/(marketing)/_components/): `SectionShell`, `EyebrowLabel`, `DisplayHeading`, `BodyProse`, `GoldWord`, `OutlinedButton`, `PrimaryButton`, `Reveal`, `ScrollHint`.
- **Motion**: framer-motion for React motion, GSAP for scroll pin/scrub. Every animated component MUST respect `prefers-reduced-motion` (use `useReducedMotion` from `@/lib/hooks/use-reduced-motion` or from `framer-motion`).
- **Aesthetic**: ~60% ink (`#0a0908`) · ~30% ivory (`#ede6d3`) · ~10% gold (`#c9a24b`). Stillness → movement → stillness. Reserve particle effects for §01, §02, §04, §07, §10.

## Rules that must not be broken

- Never use emojis as structural icons — use SVG (Lucide / react-icons / hand-rolled inline SVG).
- Never set `focus:outline-none` without providing a replacement `focus-visible:` ring — keyboard users must see focus.
- Never animate `width`/`height`/`top`/`left`; use `transform` and `opacity`.
- Never hardcode colors inside components — use the CSS variable tokens.
- Every clickable element gets `cursor-pointer` and a visible pressed/hover state within 150–300ms.
- Touch targets ≥44×44px on mobile.
