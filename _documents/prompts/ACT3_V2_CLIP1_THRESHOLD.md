# ACT III — V2 CLIP 1: THE THRESHOLD
## Google Flow / Veo 3 — 8 Second Video (Text-to-Video)

### Concept
The opening beat of the new corridor. We are not floating in a void — we are **entering a hall**. A vast obsidian temple-corridor slowly resolves out of pitch blackness. The floor is wet mirror stone. The air is charged with suspended gold dust. Somewhere ahead, a warm point of light waits.

---

### Settings
- **Model**: Veo 3 (Quality)
- **Duration**: 8 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 3840 × 2160 (4K UHD) *— confirm this exists in Flow's export options for your account; native generation is commonly 1080p/24fps, with 4K only available as a post-generation upscale. Fall back to the highest generation resolution offered and upscale afterward if needed.*
- **Frame Rate**: 60 fps *— same caveat as above; Veo 3 generation is typically 24fps.*
- **Style**: Cinematic
- **Audio**: OFF / Silent (audio is layered in-app) *— Veo 3 generates audio natively by default, so this toggle may not fully suppress it. Mute the audio track in post regardless.*
- **Mode**: Text-to-Video

---

### PROMPT (Copy-Paste Below)

```
An ultra-slow, perfectly steady cinematic dolly forward through absolute pitch-black darkness. The camera is at human-eye height, moving at the pace of a contemplative walk. There is no visible ceiling, no visible sky — only a vast, cathedral-scale hall gradually resolving out of black atmospheric fog.

Beneath the camera, an obsidian mirror-black stone floor slowly reveals itself. The stone is wet, polished to an infinite depth, and reflects everything above it with perfect fidelity. As the camera glides forward, fine suspended golden dust particles drift weightlessly through the frame, each catching a soft point of warm amber light and casting its own tiny reflection on the wet floor below. The particles move in slow, dreamlike zero-gravity paths — not falling, only suspended.

Far ahead in the distance, deep in the fog at the vanishing point of the corridor, a single warm golden point of light waits — soft, unfocused, glowing like a distant temple candle. It is the visitor's destination, but the camera never reaches it in this shot.

Along the very edges of the frame, the first suggestions of monolithic architecture begin to emerge from the mist — the faint vertical silhouettes of massive black stone columns, still mostly hidden in atmospheric haze. They do not yet dominate the frame; they are only hinted at.

The color palette is exclusively pitch black (#000000) and warm gold / amber (#C9A55A). No blue tones, no green tones, no white highlights. Every gold accent is soft, warm, and diffused — like candlelight through silk.

Shot on ARRI Alexa 65, anamorphic lens with subtle horizontal lens flare, T2.8 shallow depth of field with soft golden bokeh, natural 35mm film grain, exponential atmospheric fog, no camera shake, no handheld motion — perfectly locked dolly rails. Ultra-luxury, meditative, sacred, silent. Ends on a frame where the distant golden light is centered and the first columns are just becoming visible on either side of the frame.
```

---

### KEY VISUAL NOTES
- **Background**: Pure black (#000000) — critical for seamless WebGL blending
- **Palette**: Only black + warm gold/amber (#C9A55A). No cool tones.
- **Camera**: Locked cinematic dolly forward, no shake, no rotation
- **Mood**: Sacred, contemplative, entering-a-temple
- **Elements**: Obsidian mirror floor · suspended gold dust · distant amber light · first hint of black stone columns

### END-FRAME (Handoff to Clip 2)
Distant gold light centered at vanishing point, wet obsidian floor perfectly reflective, faint vertical silhouettes of stone columns just visible on left and right edges, gold dust suspended.

### SAVE AS
`corridor_v2_part1.mp4` → Place in `public/videos/`
