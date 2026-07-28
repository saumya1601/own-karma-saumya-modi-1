# OWN KARMA — Color System

A **Black & Gold Void** palette: a dark, cosmic, editorial theme built for a museum-like luxury feel. Dark-mode only. All tokens live in [app/globals.css](app/globals.css) as CSS custom properties and are exposed to Tailwind via `@theme inline`.

---

## Palette

### Voids — backgrounds

Near-black with a subtle warm drift, layered so the page always sits inside a "cosmic vignette."

| Token         | Hex       | Preview                                                                             | Usage                                    |
| ------------- | --------- | ----------------------------------------------------------------------------------- | ---------------------------------------- |
| `--void`      | `#000000` | ![#000000](https://readme-swatches.vercel.app/000000?style=round&width=80&height=24) | Base background, scrollbar track         |
| `--void-2`    | `#030303` | ![#030303](https://readme-swatches.vercel.app/030303?style=round&width=80&height=24) | Elevated void surface                    |
| `--void-3`    | `#070604` | ![#070604](https://readme-swatches.vercel.app/070604?style=round&width=80&height=24) | Panels, glass surfaces                   |
| `--charcoal`  | `#0b0a07` | ![#0b0a07](https://readme-swatches.vercel.app/0b0a07?style=round&width=80&height=24) | Section wells, contrast blocks           |
| `--marble`    | `#100d08` | ![#100d08](https://readme-swatches.vercel.app/100d08?style=round&width=80&height=24) | Warm marble tone for chambers / plinths  |

### Gold spectrum — accents & light

A single-hue spectrum from deep antique bronze to molten highlight. Used for text fills, borders, glows, hairlines, and the scrollbar.

| Token           | Hex       | Preview                                                                             | Usage                                          |
| --------------- | --------- | ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| `--gold-3`      | `#b8872d` | ![#b8872d](https://readme-swatches.vercel.app/b8872d?style=round&width=80&height=24) | Deep antique gold — molten gradient bookends   |
| `--gold-2`      | `#d6a84a` | ![#d6a84a](https://readme-swatches.vercel.app/d6a84a?style=round&width=80&height=24) | Mid gold — borders, hairlines                  |
| `--gold-amber`  | `#f7b733` | ![#f7b733](https://readme-swatches.vercel.app/f7b733?style=round&width=80&height=24) | Warm amber accent                              |
| `--gold`        | `#ffd36a` | ![#ffd36a](https://readme-swatches.vercel.app/ffd36a?style=round&width=80&height=24) | Primary gold — buttons, glyphs, molten mid     |
| `--gold-bright` | `#ffcc4d` | ![#ffcc4d](https://readme-swatches.vercel.app/ffcc4d?style=round&width=80&height=24) | Molten highlight, glow center                  |

### Text

| Token       | Hex       | Preview                                                                             | Usage                                            |
| ----------- | --------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| `--ivory`   | `#f3e9d0` | ![#f3e9d0](https://readme-swatches.vercel.app/f3e9d0?style=round&width=80&height=24) | Foreground / body copy — a warm off-white        |
| `--muted`   | `#afa38b` | ![#afa38b](https://readme-swatches.vercel.app/afa38b?style=round&width=80&height=24) | Secondary text, captions, labels                 |

### Lines & glow

Semi-transparent tokens for hairlines, borders, and soft light.

| Token                 | Value                            | Usage                            |
| --------------------- | -------------------------------- | -------------------------------- |
| `--border-gold`       | `rgba(214, 168, 74, 0.25)`       | Primary gold hairline / border   |
| `--border-gold-soft`  | `rgba(214, 168, 74, 0.12)`       | Soft frame, panel edge           |
| `--glow-gold`         | `rgba(255, 204, 77, 0.35)`       | Primary text / halo glow         |
| `--glow-gold-soft`    | `rgba(255, 204, 77, 0.14)`       | Ambient glow, distant light      |

### Semantic aliases

| Token           | Resolves to |
| --------------- | ----------- |
| `--background`  | `--void`    |
| `--foreground`  | `--ivory`   |

---

## Typography pairing

The palette is designed to breathe under two typefaces (loaded in [app/layout.tsx](app/layout.tsx)):

- **Serif** — Cormorant Garamond (`--font-cormorant`) → `.font-serif`, `.display`
- **Sans**  — Inter (`--font-inter`) → `.font-sans`, `.label`

---

## Signature effects

Utility classes in [app/globals.css](app/globals.css) that give the palette its "molten" feel.

- **`.text-molten`** — Gold gradient text fill sweeping `--gold-3 → --gold → --gold-bright → --gold → --gold-3`. Add **`.text-molten-anim`** to animate the flow (`molten-flow`, 8s linear infinite).
- **`.gold-glow`** — Warm gold text shadow, two layers (`--glow-gold` + soft antique gold).
- **`.gold-glow-soft`** — Subtler single-layer gold shadow.
- **`.hairline`** — 1px horizontal divider fading through `--border-gold → --gold-2 → --border-gold`.
- **`.frame-gold`** — 1px `--border-gold` border for framed elements.
- **`.panel`** — Museum glass panel: dark `--void-3` fill with a top gold sheen and a `--border-gold-soft` edge, backdrop-blurred.
- **Body vignette** — Two radial gradients of `rgba(184, 135, 45, …)` anchor the top and bottom of the page in warm gold light against the void.
- **Selection** — `::selection` uses `rgba(255, 204, 77, 0.24)` on `--ivory`.
- **Scrollbar** — Thumb is a `--gold-3 → --gold-2` gradient inside a `--void` track.

---

## Using the tokens

### In Tailwind classes

Every token is exposed as a Tailwind color, so any color utility works:

```tsx
<div className="bg-void text-ivory border border-gold-2/25">
  <span className="text-gold">Own Karma</span>
</div>
```

Available color utilities:

- `bg-void`, `bg-void-2`, `bg-void-3`, `bg-charcoal`, `bg-marble`
- `text-gold`, `text-gold-2`, `text-gold-3`, `text-gold-bright`, `text-gold-amber`
- `text-ivory`, `text-muted`
- `border-gold`, `border-gold-2`, … (plus `/opacity` modifiers)

### In raw CSS

```css
.some-element {
  background: var(--void-3);
  color: var(--ivory);
  border: 1px solid var(--border-gold);
  box-shadow: 0 0 40px var(--glow-gold-soft);
}
```

---

## Design intent

> A black-and-gold universe where every garment is a rare artifact.

- **Void first** — Backgrounds are almost fully black; light is precious and reserved for gold accents and ivory text.
- **Gold as light, not decoration** — Gold is used to imply glow, molten metal, halos, and hairline architecture, not as a fill.
- **Warmth in the shadows** — The voids drift slightly warm (`#070604`, `#0b0a07`, `#100d08`) so the palette never feels sterile or blue-black.
- **One hue, many temperatures** — The five golds move from deep antique bronze to bright molten highlight, letting a single accent color carry depth, motion, and mood.
