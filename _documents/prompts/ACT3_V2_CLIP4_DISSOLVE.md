# ACT III — V2 CLIP 4: THE DISSOLVE (EXTEND FROM CLIP 3)
## Google Flow / Veo 3 — 8 Second Video (Image-to-Video / Extend)

### Concept
The corridor ends. Sacred geometry disintegrates into a river of gold stardust. An ancient copper plate with suggestive (not legible) engraved etching floats briefly at center-frame. Dark fog rises from the floor and consumes everything, ending deep and uniformly near-black — the app's black overlay handles the final seamless handoff to Act IV.

---

### Instructions for Google Flow
1. Upload the last frame of Clip 3 (camera close to gold sacred geometry, handwritten script fragments floating, dense gold dust).
2. Set mode to **Image-to-Video** / **Extend**.
3. Use settings below.

### Settings
- **Model**: Veo 3 (Quality)
- **Duration**: 8 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 3840 × 2160 (4K UHD) *— confirm this exists in Flow's export options; native generation is commonly 1080p/24fps, with 4K only via post-generation upscale. Fall back accordingly.*
- **Frame Rate**: 60 fps *— same caveat; Veo 3 generation is typically 24fps.*
- **Style**: Cinematic
- **Audio**: OFF / Silent *— Veo 3 generates audio natively by default; mute the audio track in post regardless of this toggle.*
- **Mode**: Image-to-Video (Extend from uploaded frame)

> **Two things to know before generating this clip:**
> 1. **No hard timestamps.** Veo/Flow does not reliably choreograph a generation to precise second-marks ("in the first 2 seconds... at second 4..."). The prompt below describes the dissolve as one continuous progression instead of a shot list — trust the model's own pacing across the 8s rather than expecting cuts at exact times.
> 2. **Don't chase literal #000000.** [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) already renders the video over a `bg-black` container with a dedicated black overlay (`opacity`-animated) used for scene transitions — the app guarantees the seamless cut to black on its own. The generated clip only needs to get *very dark* by the end; it doesn't need to hit a mathematically pure, grain-free black (which also conflicts with asking for film grain throughout the same shot).

---

### PROMPT (Copy-Paste Below)

```
Continuing seamlessly from the uploaded starting frame. The camera continues its perfectly steady cinematic dolly forward at the same slow contemplative pace — no cuts, no rotation, no acceleration.

The rotating gold Metatron's Cube and the pulsing Flower of Life behind it begin to disintegrate — their thin luminous gold lines slowly breaking apart and dissolving into thousands of individual glowing gold particles. The faint calligraphic light fragments dissolve the same way, coming apart and drifting outward. Everything transforms into a slow river of golden stardust flowing gently past the camera.

As the stardust river thickens, a single ancient hand-engraved copper plate slowly rises out of it toward the center of the frame at mid-height. The plate is a heavy rectangular slab with weathered oxidized copper edges and a polished copper face deeply carved with flowing manuscript-style etching — suggestive of ancient handwriting through its texture and light, not legible words. Warm gold directional light rakes across its engraved surface. It rotates almost imperceptibly, floating weightlessly. This is the single meditative anchor of the shot.

Once the plate has settled at center-frame, thick atmospheric dark fog begins rising from the wet obsidian floor, curling upward through the frame. The remaining gold dust dims. The colossal basalt columns at the edges of the frame recede into the thickening fog and vanish. The copper plate is gradually swallowed by the rising darkness, its glowing edges dimming as the fog envelops it.

By the end of the shot, the fog and darkness have consumed the entire frame, leaving it deep, uniform near-black with only the faintest trace of warm ember glow fading out — no bright highlights, no columns, no dust remaining. It should read as the frame has essentially gone to black, ready for a seamless cut to the next act (the app's own black overlay handles the final seam, so this only needs to get convincingly dark rather than hit a literal, artifact-free #000000).

Palette locked: pitch black (#000000) and warm gold / amber (#C9A55A) transitioning to near-black. No cool tones, no white.

Shot on ARRI Alexa 65, anamorphic lens with subtle soft flare on the copper plate, T2.8 shallow depth of field, natural 35mm film grain, exponential atmospheric fog that thickens continuously, locked dolly rails, no shake.
```

---

### KEY VISUAL TRANSITION
- **Starts at**: Camera close to gold sacred geometry (from your uploaded Clip 3 final frame)
- **First half**: Geometry & script disintegrate into a river of gold stardust · ancient copper calligraphy plate rises at center
- **Second half**: Dark fog rises from the floor · swallows copper plate, dust, and columns
- **End**: Deep, uniform near-black with fog and darkness having consumed the frame — the app's black overlay completes the seamless cut to Act IV

### END-FRAME (Handoff to Act IV)
Deep, uniform near-black — no bright highlights or visible objects remaining. Doesn't need to be a mathematically pure #000000; the app's black overlay transition covers the final seam.

### SAVE AS
`corridor_v2_part4.mp4` → Place in `public/videos/`

---

## Full Sequence Overview
| Clip | Title | Focus | Duration |
| ---- | ----- | ----- | -------- |
| 1 | The Threshold | Entering the hall · obsidian floor · gold dust · distant amber light | 8s |
| 2 | The Colonnade | Basalt columns with liquid gold kintsugi veins · silk banners · gold lantern-orbs | 8s |
| 3 | The Inner Chamber | Rotating Metatron's Cube · Flower of Life · handwritten philosophy script | 8s |
| 4 | The Dissolve | Geometry breaks into stardust · copper etched plate · fog swallows all → near-black | 8s |
| **Total** | | | **32s** |

### Post-Assembly
Concatenate `corridor_v2_part1.mp4` → `corridor_v2_part4.mp4` (in that order) and export as `corridor_full.mp4` for Act III's canvas scrubbing engine.
