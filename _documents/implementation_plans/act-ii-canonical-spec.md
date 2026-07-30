# Act II — "The Questions" (canonical spec, updated & locked 2026-07-28)

## Source reconciliation

From `_documents/OWN_KARMA_Landing_Page_Experience_Spec.md` (ACT II — THE QUESTIONS):

- Canonical source for the 6 philosophical questions.
- Creative Brief section 02 "THE PORTAL" — REJECTED (different beat entirely; belongs to a later act).
- Reveal Story Beat 02 "THE RIPPLE" — N/A (different medium — pre-rendered film, not interactive site).

---

## Locked decisions & "Liquid Light" Motion Recipe

- **Pacing & Animation Engine**: Single, deterministic, frame-perfect `gsap.timeline()` managing the entire sequence. (Framer Motion and `setTimeout` timers dropped).
- **Word-by-Word "Liquid Light" Motion Recipe**:
  - **Phase A (Staggered Reveal & Y-Lift)**: Sentences are split into individual `.word` spans. Words cascade in with a 0.15s stagger (`stagger: 0.15`), rising from `y: 20px` to `0px`, while pulling focus from `filter: blur(12px)` to `blur(0px)`.
  - **Phase B (Cinematic Push / Microscopic Zoom)**: While visible, the whole sentence imperceptibly grows (`scale: 1.0 → 1.04` over 4.5s) continuing the "breathing" motif from Act I.
  - **Phase C (Dissolve & Upward Drift Out)**: Words dissolve out upward (`y: 0px → -15px`), blurring away (`blur(0px) → blur(10px)`), with a fast 0.05s stagger.
- **Hardware Acceleration**: Uses `willChange: "transform, opacity, filter"` on `.word` spans to route matrix calculations directly to the GPU for a guaranteed 60/120 FPS glide.
- **Typography & FOUT Prevention**:
  - Font: `Cormorant Garamond` weight 300 italic loaded with `display: "block"` in `layout.tsx` to prevent unstyled system font flashes.
  - Subpixel Antialiasing: `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` applied to prevent anti-aliasing bloom on thin text over deep black.
  - Color: Warm Ivory (`#F4F0E8`) on pure black (`#000000`). Text is NOT gold (gold is reserved for "discovery").
- **Invisible Fast-Forward Acceleration**: Holding pointer down (`onPointerDown`) gracefully accelerates the timeline speed to `timeScale(4.0)`. Releasing (`onPointerUp`) returns speed to `timeScale(1.0)`.
- **Rigid Absolute Stacking**: All 6 question text nodes are rendered simultaneously in the DOM, stacked on top of each other with `position: absolute`. Prevents layout thrashing, text line wrapping jumps, or container height collapse during pair breaks.
- **Accessibility (A11y)**: Visual animated container hidden from screen readers via `aria-hidden="true"`. Provided an invisible `sr-only` element containing the full text paragraph and a keyboard skip button.
- **Tab-Blur Pause/Resume**: Handled natively and out-of-the-box by GSAP's core ticker without custom code or manual event math.

---

## The 6 Questions (verbatim from spec)

1. *"Who are you..."*
2. *"When nobody is watching?"*
3. *"What do you wear..."*
4. *"When nobody needs to notice?"*
5. *"What remains..."*
6. *"When status disappears?"*

Structured as 3 symmetric pairs with 1.0s pair breaks.

---

## Timeline (exact seconds from start of Act II)

| Beat | Range (s) | Content | Animation / Shader Effect |
| ---- | --------- | ------- | ------------------------ |
| **Q1 Liquid Motion** | `0.0 – 5.0` | "Who are you..." | Staggered reveal → y-lift → scale push → upward dissolve |
| **Q2 Liquid Motion** | `5.0 – 10.0` | "When nobody is watching?" | Staggered reveal → y-lift → scale push → upward dissolve |
| **Black pause** | `10.0 – 11.0` | *(Pair break)* | Pure blackness hold |
| **Q3 Liquid Motion** | `11.0 – 16.0` | "What do you wear..." | Staggered reveal → y-lift → scale push → upward dissolve |
| **Q4 Liquid Motion** | `16.0 – 21.0` | "When nobody needs to notice?" | Staggered reveal → y-lift → scale push → upward dissolve |
| **Black pause** | `21.0 – 22.0` | *(Pair break)* | Pure blackness hold |
| **Q5 Liquid Motion** | `22.0 – 27.0` | "What remains..." | Staggered reveal → y-lift → scale push → upward dissolve |
| **Q6 Liquid Motion** | `27.0 – 32.0` | "When status disappears?" | Staggered reveal → y-lift → scale push → upward dissolve |
| **Silence** | `32.0 – 37.0` | "Nothing. Five seconds. Silence." | Pure blackness hold |
| **Heartbeat pulse** | `37.0 – 37.6` | Radial warm glow | 300ms GSAP opacity + scale (1.0 → 1.02 → 1.0) |
| **Hold & Handoff** | `37.6 – 38.6` | Screen opens → Act III | `onComplete()` callback fires |

**Total duration: ~38.6 seconds** (accelerates to ~9.6s when holding press).

---

## What Act II is NOT

- Not interactive UI buttons — pure cinematic auto-timeline with invisible press-and-hold acceleration.
- Not gold typography — ivory on black.
- Not layout-shifting HTML — rigid absolute stacked text nodes.

---

## Tech to use

- `GSAP` core timeline (`gsap.timeline()`).
- `next/font/google` (`Cormorant_Garamond` with `display: "block"`).
- CSS GPU hardware acceleration (`willChange: "transform, opacity, filter"`).

---

## Edge cases locked

- **Reduced Motion**: Snaps opacity instantly without blur or stagger transitions; holds each line 2.5s; skips heartbeat step (~22s total).
- **Press Acceleration**: Pointer down sets `timeScale(4.0)`, pointer up resets `timeScale(1.0)`.
- **Accessibility**: Screen readers read full paragraph from `sr-only` container with keyboard skip option.
