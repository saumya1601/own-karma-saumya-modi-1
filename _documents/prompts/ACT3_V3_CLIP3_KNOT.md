# ACT III — V3 CLIP 3: THE KNOT & DISSOLVE (EXTEND FROM CLIP 2)
## Google Flow / Veo 3 — 10 Second Video (Image-to-Video / Extend)

### Concept
The drifting gold threads gather at center-frame and slowly wind themselves into a single small, dense knot of luminous gold thread — a quiet visual echo of the golden thread that later draws itself into the OWN KARMA emblem in Act V. It hovers, breathing softly, then loosens and comes apart again. Dark mist (not bright fog) rises from the water, the sparse starfield fades behind it, and the frame settles into a deep, uniform near-black for the handoff to Act IV.

### COLOR LOCK (carried over — do not drift toward brighter)
- `#000000` pure black — **~85%+ of the frame, rising toward 100% by the end of the shot.** Water, shadow, mist, negative space.
- `#F4F0E8` warm ivory — **~10% at most, fading to near-zero by the end.** Only as a faint tint on the knot's glow, never a bright surface.
- `#C9A55A` antique gold — **~5%, fading to near-zero by the end.** The knot itself and sparse dust only — a small, contained glow, not a wash of light.
- **Mist must be dark**: describe it as dark charcoal/black mist or smoke, explicitly *not* white or grey fog — video models default to bright fog unless told otherwise, and bright fog is the fastest way to wreck this shot's exposure.
- **The frame should get darker, not lighter, as the shot progresses.**

---

### Instructions for Google Flow
1. Upload the last frame of Clip 2 (sails mostly unraveled into gold threads at the edges, sparse dim starfield in the middle distance, water faintly mirroring it below).
2. Set mode to **Image-to-Video** / **Extend**.
3. Use settings below.

### Settings
- **Model**: Veo 3 (Quality)
- **Duration**: 10 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 1080p (Full HD) — check Flow's export panel for a 4K upscale option after generation rather than requesting 4K at generation time.
- **Frame Rate**: 24 fps (cinematic)
- **Style**: Cinematic, low-key, underexposed
- **Audio**: OFF / muted — mute the track in post regardless of the in-app toggle.
- **Mode**: Image-to-Video (Extend from uploaded frame)

> **Carried over from the earlier review:**
> 1. **No hard timestamps.** The prompt describes the knot forming, breathing, and dissolving as one continuous progression, not a shot list with exact second-marks — Flow doesn't reliably choreograph precise timing within a single generation.
> 2. **Don't chase literal #000000.** [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) already renders the video over a `bg-black` container with its own animated black overlay used for scene transitions — the app completes the seamless cut to Act IV on its own. This clip only needs to end deep and uniformly dark, not a mathematically pure, grain-free black.

---

### PROMPT (Copy-Paste Below)

```
Continuing seamlessly from the uploaded starting frame. The camera continues its perfectly steady cinematic dolly forward at the same slow contemplative pace — no cuts, no rotation, no acceleration. The frame stays low-key and underexposed throughout, growing darker rather than brighter as the shot progresses.

The sparse drifting gold threads scattered through the frame slowly gather and converge toward the center, winding around one another into a single small, dense knot of luminous gold thread, hovering at mid-frame height against the sparse, dim starfield behind it. The knot is simple and self-contained — no symbol, no text, just woven thread — and it pulses faintly, breathing with a slow, contained warm glow. This glow stays small and localized; it must not brighten the surrounding darkness.

After holding for a moment, the knot gradually loosens and comes apart again, its threads unwinding and dissolving into a few scattered, dim motes of gold light that drift outward and fade. As this happens, a thin, dark charcoal-black mist — not white or grey fog, but a mist that reads as deepening shadow — begins rising off the still black water below, thickening gradually as it climbs and gently swallowing the sparse starfield behind it until the stars disappear into the darkness.

The remaining gold dust dims and thins to nothing throughout the frame. Any trace of the dark silk sails at the edges recedes into the thickening dark mist and fades from view. By the end of the shot, the frame has settled into a deep, uniform near-black — calm and empty, with only the faintest last ember of gold glow fading out at center-frame before it, too, disappears into full darkness.

Color palette locked throughout, and moving toward pure black by the end: pitch black (#000000) dominant and increasing to near-total by the final frame, warm antique gold (#C9A55A) only as the knot's small contained glow and a few dimming motes, fading to nothing. No white, no grey, no blue, no bright fog — the mist itself must be dark, not luminous.

Shot on ARRI Alexa 65, anamorphic lens with a soft, minimal flare only directly on the knot as it glows, T2.8 shallow depth of field, natural 35mm film grain, dark atmospheric mist that thickens continuously and darkens the frame rather than brightening it, locked dolly rails, no camera shake.
```

---

### KEY VISUAL TRANSITION
- **Starts at**: Sparse threads and dim starfield (from your uploaded Clip 2 final frame)
- **Middle**: Threads converge into a single small, contained glowing knot — a quiet echo of Act V's golden thread — then loosen and dissolve
- **End**: Dark mist (not bright fog) rises from the water, swallows the starfield and remaining light, frame settles into deep, uniform near-black

### END-FRAME (Handoff to Act IV)
Deep, uniform near-black with only the faintest last ember of gold fading out. Doesn't need to be a mathematically pure #000000 — the app's black overlay transition completes the final seam.

### SAVE AS
`corridor_v3_part3.mp4` → Place in `public/videos/`

---

## Full Sequence Overview
| Clip | Title | Focus | Duration |
| ---- | ----- | ----- | -------- |
| 1 | The Tide Threshold | Still black water floor · dark silk sails (ivory only as crease sheen) · sparse gold dust · dim starlight glimpse through a gap | 10s |
| 2 | The Unraveling Weave | Dark sails fray into gold thread · thread dissolves into a sparse, dim starfield · water faintly mirrors it | 10s |
| 3 | The Knot & Dissolve | Threads converge into one contained glowing knot (echoes Act V's golden thread) · unwinds · dark mist rises → near-black | 10s |
| **Total** | | | **30s** |

### Why the first draft came out white, and how this fixes it
- **Root cause**: describing the sails as "ivory silk" made #F4F0E8 — a hex value only a few shades off pure white — the *base material color* of large surfaces covering both sides of the frame. At that scale, no amount of "moody lighting" language can offset it; the material itself is nearly white.
- **Fix**: the silk's base tone is now dark charcoal-black. Ivory only survives as a thin sheen in the folds — a highlight, not a surface. Gold stays a sparse accent, not a wash. Every prompt now states the 85/10/5 ratio explicitly and calls out fog/mist as dark rather than the bright white/grey most video models default to.
- **If it still renders bright**: the most likely remaining culprits are (a) the starfield being too dense/large, or (b) the fog/mist step defaulting to a bright preset despite the "dark mist" instruction — worth checking the generated result at those two moments first before re-prompting.

### Post-Assembly
Concatenate `corridor_v3_part1.mp4` → `corridor_v3_part3.mp4` (in that order) and export as `corridor_v3_full.mp4` for Act III's canvas scrubbing engine. Keep this as an alternate to `corridor_full.mp4` (V2) rather than overwriting it, so both versions can be compared before committing to one in [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx).
