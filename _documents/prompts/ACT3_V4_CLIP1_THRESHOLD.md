# ACT III — V4 CLIP 1: THE THRESHOLD (OMNI FLASH)
## Google Flow / Veo — Omni Flash — 10 Second Video (Text-to-Video)

### Concept
The opening beat of the corridor. The camera enters a vast, almost-dark obsidian hall. A wet mirror-black stone floor slowly resolves out of pitch blackness, sparse gold dust drifts upward, and — far ahead at the vanishing point — a single warm amber ember waits. Dark silk sheets are just barely suggested at the frame edges. Ends on the frame that seeds Clip 2.

### Why this prompt is tuned for **Omni Flash** (read once, then generate)
The Flash tier is faster and cheaper than Veo Quality, but it drifts toward brighter, more evenly-lit renders and struggles with long, philosophical prompts. This prompt is deliberately:
- **Front-loaded** with the color/exposure lock in the very first paragraph (Flash weights the opening lines more heavily than the tail).
- **Written in short, concrete sentences** rather than dense paragraphs.
- **Repeats the 85/10/5 palette lock at the top and again at the bottom** as a safety net.
- **Restates "locked dolly, no shake, no rotation, no zoom" at both ends** — Flash tends to over-animate the camera unless told twice.
- **Kept to two or three focal elements** — Flash muddles when a shot is over-loaded.

### COLOR & EXPOSURE LOCK (do not deviate)
- `#000000` pure black — **~85% of every frame.** Floor shadow, ceiling, atmosphere, negative space, and the *base material color* of any silk in frame.
- `#F4F0E8` warm ivory — **~10% at most.** Only as a thin sheen on fabric creases or the faintest tint on the smallest dust motes. Never a fabric's base color, never an evenly-lit surface.
- `#C9A55A` antique gold — **~5%.** Sparse dust, distant ember, faint rim light only. Never a wash of light across a surface.
- **Exposure**: low-key, underexposed, almost-dark-room lighting. If in doubt, make it darker.
- **No other colors.** No blue, no green, no daylight white, no bright grey mist.

---

### Settings
- **Model**: Veo — Omni Flash (Flow's fast tier)
- **Duration**: 10 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 1080p (Full HD) — use Flow's post-generation 4K upscale if needed; do not request 4K at generation time on Flash.
- **Frame Rate**: 24 fps (cinematic)
- **Style**: Cinematic, low-key, underexposed
- **Audio**: OFF / muted — mute the track in post regardless of the in-app toggle.
- **Mode**: Text-to-Video

---

### PROMPT (Copy-Paste Below)

```
Ultra-slow cinematic dolly forward through an almost-dark obsidian hall. Camera at human-eye height, contemplative walking pace, on perfectly locked dolly rails — no shake, no rotation, no zoom, no handheld motion. Low-key, underexposed. Roughly 85% of every frame reads as deep, pure black shadow.

Beneath the camera, a wet mirror-black obsidian stone floor slowly resolves out of pitch blackness. The stone is polished to an infinite depth and mirrors everything above it with perfect fidelity, but reflects almost nothing yet — only faint, sparse points of warm gold light.

Fine gold dust drifts slowly upward through the frame in weightless, zero-gravity paths. The dust is sparse, dim, and pinpoint-sized — small warm amber points, not a glowing haze. Each mote casts a tiny faint reflection on the wet floor below.

Far ahead, at the vanishing point of the corridor, a single small warm gold ember glows softly through dark atmospheric fog — the visitor's distant destination, unfocused, candle-soft. The camera never reaches it.

Along the far left and right edges of the frame, the first hints of tall dark silk sheets appear, hanging from an unseen height. Their base material is deep charcoal-black — nearly black. Only where a fold catches a sliver of gold light does a thin, dim ivory sheen appear along the crease. Most of each silk sheet stays a dark silhouette. Do not render the silk as pale, ivory, or white fabric.

Do not add any bright, evenly-lit surfaces. Do not add daylight-style ambient fill light. Do not add white or grey mist — the fog is dark, deep, and shadow-toned, not luminous. No overexposed highlights anywhere.

Color palette locked: pitch black (#000000) for ~85% of the frame, warm ivory (#F4F0E8) only as a thin sheen in silk creases at ~10% max, warm antique gold (#C9A55A) only as sparse dust and the distant ember at ~5%. No blue, no green, no daylight white, no bright fog.

Shot on ARRI Alexa 65, anamorphic lens with a very subtle horizontal flare only on the distant ember, T2.8 shallow depth of field, natural 35mm film grain, dark atmospheric fog, locked dolly rails, no camera shake, no rotation, no zoom. Ultra-luxury, meditative, sacred, silent, dark.

Ends on a frame with the distant warm gold ember centered at the vanishing point, wet obsidian floor reflecting only the sparse gold dust, thin dark silk silhouettes just visible on both frame edges, rest of the frame deep black.
```

---

### KEY VISUAL NOTES
- **Flash tendency**: it will try to brighten the fog and the silk. The prompt says "dark mist / dark charcoal-black silk" twice for exactly that reason — do not soften either of those lines when tweaking.
- **Camera**: Locked dolly forward, no shake, no rotation, no zoom (stated twice on purpose).
- **Mood**: Entering a hall, not floating in a void. There is a floor. There is a destination.
- **Focal elements**: Wet floor · sparse gold dust · distant ember · dark silk hints at edges. That is all.

### END-FRAME (Handoff to Clip 2)
Wet mirror-black obsidian floor · distant warm gold ember centered at vanishing point · sparse gold dust drifting upward · thin dark silk silhouettes on both frame edges · rest of frame deep black.

### SAVE AS
`corridor_v4_part1.mp4` → Place in `public/videos/`
