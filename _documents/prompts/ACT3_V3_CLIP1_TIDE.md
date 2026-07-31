# ACT III — V3 CLIP 1: THE TIDE THRESHOLD
## Google Flow / Veo 3 — 10 Second Video (Text-to-Video)

### Concept
Cloth and water instead of stone. **Fixed from the first draft**, which generated as a washed-out, near-white frame — the cause was describing the sails as "ivory silk," which made their *base material color* pale/near-white (#F4F0E8 is only a few shades off pure white). At sail-scale, that alone overwhelms the frame regardless of lighting instructions. This version keeps the sails **dark charcoal-black** and reserves warm ivory for a thin sheen only where gold light rakes across the folds — so the frame stays dominantly black, matching the spec's actual 85% black / 10% ivory / 5% gold ratio.

### COLOR LOCK (read before generating)
- `#000000` pure black — **~85% of the frame.** Water, shadow, negative space, and the base material color of the silk itself.
- `#F4F0E8` warm ivory — **~10% of the frame, at most.** Only as a thin sheen catching light in fabric creases — never a fabric's *base* color, never an evenly-lit surface.
- `#C9A55A` antique gold — **~5% of the frame.** Sparse light accents only: dust motes, faint rim light, distant glow. Never a wash of light across a whole surface.
- **No other colors.** No blue, no green, no daylight-white, no neutral-grey mist/fog.
- **Exposure**: low-key, underexposed, almost-dark-room lighting. If in doubt, make it darker — nothing in frame should be evenly or brightly lit.

---

### Settings
- **Model**: Veo 3 (Quality)
- **Duration**: 10 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 1080p (Full HD) — check Flow's export panel for a 4K upscale option after generation rather than requesting 4K at generation time.
- **Frame Rate**: 24 fps (cinematic)
- **Style**: Cinematic, low-key, underexposed
- **Audio**: OFF / muted — Veo 3 generates ambient audio natively by default; mute the track in post regardless of the in-app toggle.
- **Mode**: Text-to-Video

---

### PROMPT (Copy-Paste Below)

```
A low-key, underexposed, ultra-slow cinematic dolly forward through a vast, almost-dark hall, lit only by scattered points of warm gold light. The camera is at human-eye height, moving at the pace of a contemplative walk, on perfectly locked dolly rails — no shake, no rotation, no handheld motion. Roughly 85% of the frame should read as deep, pure black shadow at all times.

Beneath the camera, a thin, ankle-shallow sheet of still black water covers the entire floor, stretching to both edges of the frame. The water is glass-calm and nearly black, broken only by slow, wide concentric ripples spreading from somewhere far ahead — each ripple catching only the faintest thread of warm gold reflection, never a bright highlight.

On both sides of the frame, towering sail-like sheets of heavy black silk hang from an unseen height, their base fabric color a deep charcoal-black, drifting slowly in some unfelt current. Only where the fabric folds and catches a sliver of gold light does a faint warm ivory sheen appear along the crease — thin, dim, and localized, never spreading across the whole sail. Most of each sail should remain a dark, almost-black silhouette. The sails are evenly spaced, receding into darkness on both sides, with no ambient fill light brightening them.

Fine suspended golden dust drifts weightlessly between the sails — small, sparse, dim points of warm amber light, each casting a tiny, faint reflection onto the black water below. This is the only source of light density in the frame; keep it sparse, not a glowing haze.

Far ahead, where two of the dark sails part slightly, a narrow gap reveals a handful of small, soft, warm-white points of starlight beyond — sparse and dim, more a suggestion of depth in the darkness than a bright sky. The camera never reaches this gap in this shot.

Do not add any bright, evenly-lit surfaces. Do not render the silk as pale, white, or ivory-toned fabric — its base tone is dark charcoal-black, with only thin gold-lit creases. Do not add daylight-style ambient fill lighting, bright fog, or overexposed highlights. There should be no white or light-grey mist — only clean black atmosphere.

Color palette: pitch black (#000000) for at least 85% of the frame — water, shadow, and the base of the silk. Warm ivory (#F4F0E8) only as a thin sheen in fabric creases, no more than roughly 10% of the frame. Warm antique gold (#C9A55A) only as sparse light accents — dust, faint reflections, distant starlight — no more than roughly 5% of the frame. No blue, no green, no neutral grey, no daylight white.

Shot on ARRI Alexa 65, anamorphic lens with a very subtle horizontal lens flare only on the sparse gold points, T2.8 shallow depth of field, natural 35mm film grain, no atmospheric haze that brightens the frame. Ultra-luxury, meditative, sacred, silent, dark. Ends on a frame centered on the gap in the sails ahead, a few dim points of starlight glowing faintly through it, water rippling below, the rest of the frame in deep black.
```

---

### KEY VISUAL NOTES
- **Fix from the first draft**: "ivory silk" made the sails themselves a near-white material at large scale — since #F4F0E8 is only a few shades off pure white, any large surface in that tone reads as a bright wall regardless of lighting. This version keeps the sail's *base material* black/charcoal; ivory only appears as a thin sheen in the creases.
- **Palette discipline**: 85% black / 10% ivory (as a sheen, not a surface) / 5% gold (as sparse points, not a wash) — matches the spec's actual ratio, not an even three-way split.
- **Camera**: Locked cinematic dolly forward, no shake, no rotation
- **Mood**: Entering a hall of dark cloth and water, not a brightly lit fabric room

### END-FRAME (Handoff to Clip 2)
Gap between two dark silk sails centered ahead, a few dim points of starlight glowing faintly through it, still black water rippling below, sparse gold dust suspended between the sails, remainder of frame in deep black.

### SAVE AS
`corridor_v3_part1.mp4` → Place in `public/videos/`
