---
name: ui-ux-pro-max
description: "UI/UX design intelligence for web and mobile. Searchable local database with 84 styles, 192 color palettes, 74 font pairings, 192 product types, 98 UX guidelines, 104 icon entries, 16 GSAP motion presets, and 25 chart types across 22 stacks. Use when designing, building, or reviewing UI: pages, components, color schemes, typography, layout, accessibility, animation, or data visualization."
---

# UI/UX Pro Max — Design Intelligence (Workspace Copy)

Searchable database of UI/UX design rules with priority-based recommendations. This is the workspace-scoped copy of the [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) skill, wired to run inside this Next.js project via GitHub Copilot.

## When to Apply

Use this skill when the task involves **UI structure, visual design decisions, interaction patterns, or user experience quality control**: designing new pages, creating/refactoring UI components, choosing color/typography/spacing/layout systems, reviewing UI for UX/accessibility/consistency, implementing navigation/animation/responsive behavior, or improving perceived quality and usability.

Skip it for pure backend logic, API/database design, non-visual performance work, infrastructure/DevOps, or non-visual scripts — unless the task changes how something **looks, feels, moves, or is interacted with**.

## Priority Rules (glance this first)

| Priority | Category | Impact | Domain | Key Checks |
|----------|----------|--------|--------|------------|
| 1 | Accessibility | CRITICAL | `ux` | Contrast 4.5:1, Alt text, Keyboard nav, Aria-labels, `prefers-reduced-motion` |
| 2 | Touch & Interaction | CRITICAL | `ux` | Min size 44×44px, cursor-pointer, 8px+ spacing, Loading feedback |
| 3 | Performance | HIGH | `ux` | WebP/AVIF, Lazy loading, Reserve space (CLS < 0.1) |
| 4 | Style Selection | HIGH | `style`, `product` | Match product type, Consistency, SVG icons (no emoji) |
| 5 | Layout & Responsive | HIGH | `ux` | Mobile-first breakpoints, No horizontal scroll |
| 6 | Typography & Color | MEDIUM | `typography`, `color` | Base 16px, Line-height 1.5, Semantic tokens |
| 7 | Animation | MEDIUM | `ux`, `gsap` | Duration 150–300ms, transform/opacity only |
| 8 | Forms & Feedback | MEDIUM | `ux` | Visible labels, Error near field, Helper text |
| 9 | Navigation Patterns | HIGH | `ux` | Predictable back, Deep linking |
| 10 | Charts & Data | LOW | `chart` | Legends, Tooltips, Accessible colors |

Full rule text lives in [references/quick-reference.md](./references/quick-reference.md); app-specific polish + pre-delivery checklist in [references/pro-rules.md](./references/pro-rules.md).

## Running the search tool

Windows PowerShell (this workspace):

```powershell
python .github\prompts\ui-ux-pro-max\scripts\search.py "<query>" --domain <domain>
```

Requires Python 3.x, standard library only (no network access).

**Available domains:** `product`, `style`, `typography`, `color`, `landing`, `chart`, `ux`, `icons`, `react`, `web`, `google-fonts`, `gsap`

**Available stacks:** `nextjs` (this project), `react`, `vue`, `svelte`, `astro`, `nuxtjs`, `nuxt-ui`, `angular`, `laravel`, `swiftui`, `react-native`, `flutter`, `jetpack-compose`, `html-tailwind`, `shadcn`, `threejs`, `javafx`, `wpf`, `winui`, `avalonia`, `uno`, `uwp`

## Workflow

### Step 1 — Analyze User Requirements

Extract:
- **Product type** (SaaS, luxury brand, portfolio, etc.)
- **Style keywords** (cinematic, minimal, dark, editorial, etc.)
- **Stack** — this project is **Next.js 16 + React 19 + Tailwind v4** (see [AGENTS.md](../../../AGENTS.md) — the Next.js version has breaking changes; check `node_modules/next/dist/docs/` before writing).

### Step 2 — Generate Design System (REQUIRED for new pages)

```powershell
python .github\prompts\ui-ux-pro-max\scripts\search.py "<keywords>" --design-system -p "OWN KARMA" --variance 3 --motion 6 --density 3
```

**Persist it once per project** so future sessions can retrieve it:

```powershell
python .github\prompts\ui-ux-pro-max\scripts\search.py "<keywords>" --design-system --persist -p "OWN KARMA" --output-dir .
```

Writes `design-system/own-karma/MASTER.md` (already generated for this repo).

### Step 3 — Domain Deep-Dives

```powershell
python .github\prompts\ui-ux-pro-max\scripts\search.py "<keyword>" --domain <domain> [-n <max_results>]
```

### Step 4 — Stack Guidelines

```powershell
python .github\prompts\ui-ux-pro-max\scripts\search.py "<keyword>" --stack nextjs
```

## Retrieval when building a page

1. Read `design-system/own-karma/MASTER.md` (project-scoped source of truth)
2. Check if `design-system/own-karma/pages/<page-name>.md` exists — if so, its rules override MASTER
3. Otherwise use MASTER exclusively
4. Cross-reference against `references/quick-reference.md` for the relevant priority category
5. Before delivering, walk through the pre-delivery checklist in `references/pro-rules.md`

## Anti-patterns to always avoid

- Emojis used as structural icons (use SVG: Lucide, Heroicons, react-icons)
- `focus:outline-none` without a replacement `focus-visible:` ring
- Missing `cursor-pointer` on click-handling divs
- Transition durations >500ms for hover/press feedback (feels sluggish)
- Animating `width`/`height`/`top`/`left` (use `transform`/`opacity` for 60fps)
- Ignoring `prefers-reduced-motion`
- Removing focus rings without providing an alternative

## Output Formats

`--design-system` supports `-f ascii` (default), `-f markdown` (docs), and `--json` (machine-readable).

## If a search returns 0 results

1. Retry with broader keywords (product + style separately rather than combined)
2. Fall back to the priority table above and say so explicitly to the user
3. Never present a 0-result search as if it returned data
