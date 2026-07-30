# Act V — "The Realization" (canonical spec, decisions locked 2026-07-28)

## Source reconciliation

From `_documents/OWN_KARMA_Landing_Page_Experience_Spec.md` (ACT V — THE REALIZATION):

> Everything disappears. Darkness.  
> One golden thread appears.  
> It begins drawing itself.  
> The thread slowly becomes the **OWN KARMA emblem**.  
> No sound. No dramatic reveal. Only stillness.  
> Below it: `OWN KARMA`. Nothing else.

---

## Locked decisions

- **Visual Concept**: Pure darkness out of which a single golden thread draws the signature OWN KARMA emblem line-by-line, followed by the appearance of the brand wordmark.
- **Pacing**: Auto-timed ritual beat (duration ~8.0s).
- **Emblem Construction**:
  - Rendered via SVG path `stroke-dashoffset` or R3F procedural `MeshLine` / line shader.
  - Line drawing driven by GSAP timeline (`duration: 3.5s`, `ease: "power2.inOut"`).
  - Material: Antique Gold (`#C9A55A`) with subtle glowing emission.
- **Wordmark Reveal**:
  - `OWN KARMA` typography in `Cormorant Garamond` tracking `[0.35em]` uppercase.
  - Fades in smoothly (`opacity: 0 → 1` over 1.5s) below the constructed emblem.
- **Stillness Phase**: 3.0 seconds of absolute stillness after full emblem reveal before hand-off.
- **Hand-off**: Triggers `onComplete()` callback to proceed to Act VI ("The Philosophy").

---

## Timeline (exact)

| Beat | Time Range | Visual & Animation Action |
| ---- | ---------- | ------------------------- |
| **Pure Darkness** | `0.0s – 1.0s` | Absolute blackness, total silence. |
| **Thread Drawing** | `1.0s – 4.5s` | Single gold line draws the OWN KARMA emblem vector path (`stroke-dashoffset`). |
| **Wordmark Fade** | `4.5s – 6.0s` | `OWN KARMA` text fades in below the emblem in warm ivory/gold. |
| **Stillness Beat** | `6.0s – 9.0s` | Pure still display. Emblem glows softly. |
| **Hand-off** | `9.0s` | Smooth fade out → fires `onComplete()` to proceed to Act VI. |

---

## What Act V is NOT

- Not an aggressive commercial logo splash screen — it is a quiet, sacred brand birth ritual.
- Not interactive — auto-advancing cinematic sequence.

---

## Tech to use

- `GSAP` timeline for stroke drawing (`strokeDashoffset`) and opacity fades.
- SVG vector graphics / R3F line rendering for razor-sharp vector line drawing.
- `Cormorant Garamond` for display wordmark typography.

---

## Edge cases locked

- **Reduced Motion**: Skips line-drawing animation; emblem and wordmark fade in together (`duration: 1.0s`).
- **Tab Blur**: Pauses sequence timing when tab is hidden, resumes seamlessly on visible.
