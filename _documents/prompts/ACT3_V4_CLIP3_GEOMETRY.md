# ACT III — V4 CLIP 3: THE GEOMETRY & DISSOLVE (OMNI FLASH — EXTEND FROM CLIP 2)
## Google Flow / Veo — Omni Flash — 10 Second Video (Image-to-Video / Extend)

### Concept
The colonnade opens into a wider inner chamber. A slowly rotating gold line-art sacred-geometry glyph (Metatron's Cube) hovers at mid-frame — a quiet visual echo of the golden thread that later draws itself into the OWN KARMA emblem in Act V. It breathes softly, then disintegrates into a slow river of gold stardust. Dark mist rises from the wet floor, swallows the columns, the geometry, and the distant ember. The frame settles into deep, uniform near-black — clean handoff to Act IV.

### Why this prompt is tuned for **Omni Flash**
- **Extends via Image-to-Video** from Clip 2's final frame — continuity carried by the seed image.
- **Describes the disintegration as one continuous progression, not a timestamped shot list.** Flash (like Quality) does not reliably choreograph precise second-marks inside a single generation.
- **Explicitly instructs the frame to grow DARKER, not brighter, over the shot.** Flash's default behavior on a "sacred geometry appears then dissolves" beat is to spike exposure at the reveal. This prompt forbids that.
- **Explicitly forbids white/grey fog for the mist.** Flash defaults to bright fog unless told otherwise, and bright fog is the fastest way to wreck this shot's exposure.
- **Doesn't chase a mathematically pure #000000.** [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) already renders the video over a `bg-black` container with its own animated black overlay used for the seamless cut to Act IV — this clip only has to end deep and uniformly dark.

### COLOR & EXPOSURE LOCK (carried over — grow DARKER, not brighter)
- `#000000` pure black — **~85% of the frame, rising toward near-total by the end of the shot.** Floor shadow, atmosphere, mist, negative space.
- `#F4F0E8` warm ivory — **~10% at most, fading to near-zero by the end.** Faint tint on the smallest highlights, never a surface.
- `#C9A55A` antique gold — **~5%, fading to near-zero by the end.** The rotating glyph, the resulting stardust, sparse dust — small, contained, dimming.
- **The mist is dark charcoal-black / shadow-toned, explicitly NOT white or grey fog.**
- **The frame gets darker, not lighter, as the shot progresses.**

---

### Instructions for Google Flow
1. Upload the last frame of Clip 2 (`corridor_v4_part2.mp4`'s final frame: deep inside the colonnade, columns on both edges, silk banners, gold lantern-orbs, distant ember).
2. Set mode to **Image-to-Video** / **Extend**.
3. Use settings below.

### Settings
- **Model**: Veo — Omni Flash (Flow's fast tier)
- **Duration**: 10 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 1080p (Full HD) — use Flow's post-generation 4K upscale if needed.
- **Frame Rate**: 24 fps (cinematic)
- **Style**: Cinematic, low-key, underexposed
- **Audio**: OFF / muted — mute the track in post regardless of the in-app toggle.
- **Mode**: Image-to-Video (Extend from uploaded frame)

---

### PROMPT (Copy-Paste Below)

```
Continuing seamlessly from the uploaded starting frame. The camera holds its perfectly steady cinematic dolly forward — same pace, same eye-height, same locked axis. No cuts, no acceleration, no rotation, no zoom, no handheld shake. Low-key and underexposed throughout, growing darker rather than brighter as the shot progresses.

The colonnade ahead widens and opens into a taller, sacred inner chamber. The dark basalt columns pull further apart at both frame edges. The dark silk banners drift outward toward the edges of the frame.

Floating and slowly rotating in the exact center of the corridor, at mid-frame height, a single small gold line-art Metatron's Cube appears — thin, luminous, hand-drawn quality gold lines forming interlocking sacred geometry. It rotates slowly on its vertical axis, catching subtle warm light. Its glow is small, contained, and localized — it does not brighten the surrounding darkness. Around it, roughly 85% of the frame stays deep black.

After holding for a moment, the geometry begins to disintegrate. Its thin luminous gold lines slowly break apart into thousands of individual glowing gold particles, dissolving into a slow river of gold stardust flowing gently outward past the camera. The distant warm gold ember at the vanishing point dims and thins as the stardust drifts through the frame.

As the stardust drifts, thick dark mist begins rising from the wet obsidian floor — dark charcoal-black mist, shadow-toned, curling upward through the frame. The mist is NOT white or grey fog. It reads as deepening shadow, thickening continuously and darkening the frame rather than brightening it. The dark basalt columns at the frame edges recede into the thickening mist and vanish. The remaining gold dust dims and thins to nothing.

By the end of the shot, the mist and darkness have consumed the entire frame, leaving it deep, uniform near-black with only the faintest last ember of warm gold glow fading out at center-frame before it, too, disappears. It should read as the frame has essentially gone to black, ready for a seamless cut to Act IV.

Do not brighten the exposure at the moment the geometry reveals itself. Do not render the mist as bright white or grey fog. Do not add ambient fill lighting. Do not add overexposed highlights anywhere.

Color palette locked and moving toward pure black by the end: pitch black (#000000) dominant and increasing to near-total by the final frame, warm antique gold (#C9A55A) only as the geometry's contained glow, the stardust, and a few dimming motes — all fading to nothing. Warm ivory (#F4F0E8) only as the faintest tint on the smallest highlights, fading to nothing. No white, no grey, no blue, no green, no bright fog.

Shot on ARRI Alexa 65, anamorphic lens with a soft, minimal flare only directly on the geometry as it glows, T2.8 shallow depth of field, natural 35mm film grain, dark atmospheric mist that thickens continuously and darkens the frame, locked dolly rails, no camera shake, no rotation, no zoom.
```

---

### KEY VISUAL TRANSITION
- **Starts at**: Deep inside the colonnade (from your uploaded Clip 2 final frame).
- **Middle**: A single slowly rotating gold Metatron's Cube glyph appears at center-frame — a quiet echo of Act V's golden thread — then disintegrates into a slow river of gold stardust.
- **End**: Dark mist (not bright fog) rises from the wet floor, swallows the columns, the stardust, and the distant ember; the frame settles into deep, uniform near-black.

### END-FRAME (Handoff to Act IV)
Deep, uniform near-black with only the faintest last ember of gold fading out at center. Doesn't need to be mathematically pure #000000 — the app's black overlay transition in [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) completes the final seam.

### SAVE AS
`corridor_v4_part3.mp4` → Place in `public/videos/`

---

## Full V4 Sequence Overview
| Clip | Title | Focus | Duration |
| ---- | ----- | ----- | -------- |
| 1 | The Threshold | Wet obsidian floor · sparse gold dust · distant amber ember · dark silk hints at edges | 10s |
| 2 | The Colonnade | Dark basalt columns with fine gold kintsugi veins · dark silk banners · small gold lantern-orbs · wet floor reflections | 10s |
| 3 | The Geometry & Dissolve | Rotating gold Metatron's Cube glyph (echoes Act V's thread) · disintegrates into stardust · dark mist rises → near-black | 10s |
| **Total** | | | **30s** |

### Why this V4 differs from V3 and V2
- **V2** was tuned for Veo 3 Quality with long, dense, philosophical prompts — Flash averages that kind of prose into a bland scene.
- **V3** proved the 85/10/5 palette lock as the fix for the first draft rendering white. V4 keeps that lock and inherits the "dark mist, not bright fog" language.
- **V4** compresses the four V2 beats into three 10s shots specifically for Flash: shorter prompts, front-loaded color/camera locks restated at both ends, no more than three focal elements per shot, and every beat that Flash historically brightens is explicitly told to stay dark.

### If Flash still renders the shot too bright
Check these two moments first before re-prompting:
1. **The moment the geometry appears in Clip 3.** Flash's default is to spike exposure on any glowing object reveal. If it does, add: *"the geometry's glow is small and does not illuminate the surrounding darkness"* directly after the sentence that introduces the glyph.
2. **The mist step in Clip 3.** If the fog renders bright white or luminous grey, replace *"dark charcoal-black mist"* with *"black smoke, not fog — dense, opaque, shadow-toned, absorbing light rather than emitting it"* — Flash sometimes needs the word "smoke" to break out of its fog default.

### Post-Assembly
Concatenate `corridor_v4_part1.mp4` → `corridor_v4_part3.mp4` (in that order) and export as `corridor_v4_full.mp4` for Act III's canvas scrubbing engine. Keep this as an alternate to the existing `corridor_full.mp4` (V2) and `corridor_v3_full.mp4` (V3) rather than overwriting either, so all three versions can be compared before committing to one in [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx).
