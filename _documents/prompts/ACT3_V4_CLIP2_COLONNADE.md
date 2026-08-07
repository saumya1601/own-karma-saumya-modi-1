# ACT III — V4 CLIP 2: THE COLONNADE (OMNI FLASH — EXTEND FROM CLIP 1)
## Google Flow / Veo — Omni Flash — 10 Second Video (Image-to-Video / Extend)

### Concept
The corridor reveals itself. Rows of colossal black basalt columns rise on both sides, fractured with fine glowing kintsugi-style veins of liquid gold. Dark silk banners drift between them. Small warm gold lantern-orbs hover at mid-height. The wet obsidian floor mirrors it all. The distant gold ember from Clip 1 stays centered at the vanishing point ahead. Ends on a frame that seeds Clip 3.

### Why this prompt is tuned for **Omni Flash**
- **Extends via Image-to-Video** from Clip 1's final frame so continuity is guaranteed by the seed image, not by the model's memory of the previous prompt.
- **Restates the palette lock and camera lock** at both ends because Flash "forgets" the earlier setup mid-way through a 10s generation more often than the Quality tier does.
- **Only three new elements introduced** (columns, banners, lantern-orbs) — anything more and Flash starts averaging details.
- **Explicitly forbids the model from re-lighting the scene brighter** just because there are now more objects in it.

### COLOR & EXPOSURE LOCK (carried over — do not drift brighter)
- `#000000` pure black — **~85% of every frame.** Floor shadow, ceiling, atmosphere, base of columns and silk.
- `#F4F0E8` warm ivory — **~10% at most.** Thin sheen on silk creases and the faintest tint on the smallest highlights. Never a fabric's base color.
- `#C9A55A` antique gold — **~5%.** Kintsugi veins in the stone, small lantern-orbs, sparse dust, distant ember. Sparse points and thin lines only — never a wash of light across a surface.
- **Exposure stays low-key and underexposed throughout.** The scene has more objects than Clip 1, but the same amount of light. Do not brighten.

---

### Instructions for Google Flow
1. Upload the last frame of Clip 1 (`corridor_v4_part1.mp4`'s final frame: distant amber ember centered, faint dark silk on both edges, wet obsidian floor).
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
Continuing seamlessly from the uploaded starting frame. The camera maintains its perfectly steady cinematic dolly forward — same slow contemplative pace, same eye-height, same locked axis. No cuts, no acceleration, no rotation, no zoom, no handheld shake. Low-key and underexposed throughout. Roughly 85% of every frame stays deep, pure black shadow.

The corridor now reveals itself in full. On both the left and right sides of the frame, a receding row of colossal monolithic black basalt columns rises from the wet obsidian floor and disappears into the dark fog above. The columns are cathedral-scale, ancient, weathered, and dark charcoal-black in their base tone. Every column is fractured with fine luminous veins of liquid gold — thin kintsugi-style cracks glowing softly from within the stone. The gold veins are sparse and delicate, not thick or bright. They pulse almost imperceptibly.

Between each pair of columns, tall dark silk banners hang from an unseen height, drifting slowly in an unfelt current. Their base fabric is deep charcoal-black. Only where a fold catches a sliver of gold light does a thin ivory sheen appear along the crease — dim, thin, and localized. Most of each banner remains a dark silhouette. Do not render the silk as pale, ivory, or white fabric.

Floating at mid-height between the columns, a few small warm gold lantern-orbs hover weightlessly — glowing spheres of soft amber light, contained and small, each with a delicate gold bokeh halo. They cast long soft reflections down onto the mirror-black wet floor. Keep the orbs few and sparse; do not fill the frame with light.

The wet obsidian floor beneath the camera reflects everything above with perfect fidelity — columns, banners, lantern-orbs, sparse gold dust, and the distant warm gold ember still centered at the vanishing point far ahead. The reflections are dim and warm, never bright.

Fine gold dust drifts continuously through the frame in slow, weightless paths. Dark atmospheric fog softens the deep background. Do not brighten the fog. Do not add daylight-style ambient fill lighting. Do not add white or grey mist.

Color palette remains locked: pitch black (#000000) for ~85% of the frame, warm ivory (#F4F0E8) only as a thin sheen on silk creases at ~10% max, warm antique gold (#C9A55A) only as thin kintsugi veins, small lantern-orbs, sparse dust, and the distant ember at ~5%. No blue, no green, no daylight white, no bright fog.

Shot on ARRI Alexa 65, anamorphic lens with subtle horizontal flare only on the lantern-orbs and the distant ember, T2.8 shallow depth of field, natural 35mm film grain, dark atmospheric fog, locked dolly rails, no camera shake, no rotation, no zoom.

Ends with the camera deeper inside the colonnade — columns dominating both frame edges, silk banners rippling in mid-ground, a few gold lantern-orbs floating at mid-height, wet floor mirroring it all, distant warm gold ember still centered at the vanishing point, rest of the frame deep black.
```

---

### KEY VISUAL TRANSITION
- **Starts at**: Threshold of the corridor (from your uploaded Clip 1 final frame).
- **Middle**: Rows of dark basalt columns with fine gold kintsugi veins reveal themselves; dark silk banners drift between them; small gold lantern-orbs appear at mid-height.
- **End**: Camera deeper inside the colonnade, distant gold ember still visible ahead, frame still dominantly black.

### END-FRAME (Handoff to Clip 3)
Camera deep inside colonnade · dark basalt columns with thin gold kintsugi veins on both frame edges · dark silk banners rippling in mid-ground · a few small gold lantern-orbs at mid-height · wet obsidian floor mirroring everything dimly · distant warm gold ember still centered at vanishing point · rest of the frame deep black.

### SAVE AS
`corridor_v4_part2.mp4` → Place in `public/videos/`
