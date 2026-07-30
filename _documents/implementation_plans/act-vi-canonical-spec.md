# Act VI — "The Philosophy" (canonical spec, decisions locked 2026-07-28)

## Source reconciliation

From `_documents/OWN_KARMA_Landing_Page_Experience_Spec.md` (ACT VI — THE PHILOSOPHY):

> Now the visitor understands.  
> Statements. No paragraphs.  
> `Luxury is temporary.` → `Meaning is timeless.`  
> `Status belongs to others.` → `Character belongs to you.`  
> `Fashion changes.` → `Purpose remains.`

---

## Locked decisions

- **Visual Pacing**: 3 statement pairs presented sequentially with rhythmic cadence using `useAutoSequence` hook (or smooth virtual scroll).
- **Typography & Styling**:
  - Display Font: `Cormorant Garamond` weight 300 italic.
  - Sizing: Cinematic clamp `clamp(2rem, 5vw, 4.5rem)`.
  - Color Palette:
    - Statement 1 (the contrast): Warm Ivory (`#F4F0E8`).
    - Statement 2 (the truth): Highlighted in Antique Gold (`#C9A55A`) with subtle glow.
- **Transitions**: `AnimatePresence` cross-fade (`mode="wait"`, `duration: 1.2s`, `ease: "easeInOut"`).
- **Hand-off**: Upon completing the 3rd pair, screen fades smoothly to black and triggers `onComplete()` to proceed to Act VII ("The Community").

---

## Timeline & Statement Map

| Pair | Range (s) | Line 1 (Ivory) | Line 2 (Gold) |
| ---- | --------- | -------------- | ------------- |
| **Pair 1** | `0.0s – 6.0s` | "Luxury is temporary." | "Meaning is timeless." |
| **Pause** | `6.0s – 7.0s` | *(Black pause)* | *(Black pause)* |
| **Pair 2** | `7.0s – 13.0s` | "Status belongs to others." | "Character belongs to you." |
| **Pause** | `13.0s – 14.0s` | *(Black pause)* | *(Black pause)* |
| **Pair 3** | `14.0s – 20.0s` | "Fashion changes." | "Purpose remains." |
| **Hand-off** | `20.0s – 21.0s` | *(Fade to black)* | *Fires `onComplete()`* |

---

## What Act VI is NOT

- Not a wall of paragraph text — minimalist, rhythmic statements.
- Not full-color marketing banners — restrained ivory and gold typography on pure black background.

---

## Tech to use

- `useAutoSequence` hook for auto-timing management.
- `motion/react` (`AnimatePresence`, `motion.div`) for smooth cross-fades.
- `Cormorant Garamond` font for display typography.

---

## Edge cases locked

- **Reduced Motion**: Snaps between statement pairs without cross-fade animations; reduces hold time to 3.0s per pair.
- **Mobile Responsiveness**: `clamp()` typography sizing ensures no wrapping awkwardness on small screens.
