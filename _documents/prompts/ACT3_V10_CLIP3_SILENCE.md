# ACT III — V10 CLIP 3: THE SILENCE (OMNI FLASH — EXTEND FROM CLIP 2)
## Google Flow / Veo — Omni Flash — 10 Second Video (Image-to-Video / Extend)

### Concept
The camera stops at the pass shrine. The last of the western horizon light dies. From above the shrine's mandala, a single thin ribbon of warm antique gold rises — a thread of horizon-lit incense smoke drifting upward from a stone niche where a stick has just burned to embers. It rises steadily through the frame, catching the last of the dying horizon light on its western side. It reaches the deepening sky above and dissolves into small dim gold motes. The prayer flags along the pass dim as blue-hour deepens toward full night. The dying western band fades to nothing. The still rainwater basin darkens to match the sky. Blue-hour mist rises up the pass from the valley below and swallows everything. Frame settles into deep near-black — seamless handoff to Act IV.

### V10 principle: **the story ends when the horizon light dies**
V4 ended with rising mist. V6 ended with a knot. V8 ended with the camera stopping at an altar. V10 ends with the sun finishing setting. That's the emotional beat: the traveler has reached the shrine, the day has ended, night has fallen, the mountain returns to silence. The Act V thread echo is a single vertical thread of incense smoke rising from the shrine — a physical thread rising to meet the sky, then dissolving.

### Handoff notes
- **No hard timestamps.** Sequential progression only.
- **End frame doesn't need pure #000000** — [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) has its own black overlay.

### Instructions for Google Flow
1. Upload the last frame of Clip 2 (`corridor_v10_part2.mp4`'s final frame: pass shrine, mandala, prayer scrolls, rainwater basin, receding flag row, dying horizon, sparse stars).
2. Set mode to **Image-to-Video** / **Extend**.
3. Use settings below.

### Settings
- **Model**: Veo — Omni Flash
- **Duration**: 10 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 1080p
- **Frame Rate**: 24 fps
- **Style**: Cinematic, low-key, earthbound, meditative, Himalayan nightfall
- **Audio**: OFF / muted
- **Mode**: Image-to-Video (Extend from uploaded frame)

---

### PROMPT (Copy-Paste Below)

```
Continuing seamlessly from the uploaded starting frame. The camera's forward walking motion decays continuously and slows to a complete rest a short distance in front of the pass shrine, holding absolutely stationary for the remainder of the shot. First-person point of view, no rotation, no cuts, no zoom, no shake.

From behind the shrine's mandala face, out of a small stone niche at its top edge, a single thin ribbon of warm antique gold begins rising vertically through the frame — a thread of horizon-lit incense smoke drifting steadily upward from a stick that has just burned to embers. The smoke ribbon is thin, delicate, and rim-lit only on its western side by the last dying horizon light on the left of the frame. It rises through the upper third of the frame at meditation pace, curling gently in the pass wind, and continues upward toward the deepening sky above. It is not self-luminous; it is a physical thread of smoke catching physical horizon light.

As the smoke ribbon rises, the last of the dying western horizon band along the frame's left edge fades to nothing — the sun has fully set. The upper third of the sky darkens through deeper blue-black, and more sparse warm-toned pinpoint stars slowly appear in the deepening dark, still pinpoint-sized, still widely spaced, still few.

The smoke ribbon reaches the upper third of the frame and gradually disperses into a few small dim gold motes that drift outward and fade against the darkening sky. Its western rim highlight thins as the horizon light dies. By the time the last motes disperse, the western band has vanished entirely and the sky is deep blue-black studded only with sparse warm stars.

The rows of dark silk prayer flags along the pass ahead dim as their hem-stitched gold loses its horizon light — one by one their western creases fade until every flag reads as full dark silhouette against the mist behind. The shallow black rainwater basin at the shrine's base darkens to match the sky, its reflection of the horizon band vanishing along with the horizon itself.

Then, blue-hour mist begins rising up the pass from the deep valley below on the right side of the frame — dense, dark, shadow-toned, patient. The mist advances slowly up the trail at the pace of a slow tide, silent and inevitable. As it advances, it consumes the receding prayer flags one by one, then reaches the shrine and gently swallows it: the mandala's kintsugi glow dims as the mist passes over it, the parchment prayer scrolls dim as their gold script fades, the water basin fades. The last sparse stars in the sky above dim star by star as the mist thickens through the atmosphere. The pass returns to silence.

By the end of the shot, the mist and darkness have consumed the entire frame, leaving it deep, uniform near-black — calm, empty, silent, with only the faintest last trace of warm gold from the shrine's kintsugi mandala fading out at center-left before it, too, disappears. The frame is ready for a seamless cut to Act IV.

The color palette stays locked and moves toward pure black: deep pitch black (#000000) dominant and increasing to near-total by the final frame, warm antique gold (#C9A55A) only as the rising smoke ribbon, the last horizon-lit dust, and the shrine's dimming kintsugi mandala — all fading to nothing. Warm ivory (#F4F0E8) only as the faintest tint on the smallest highlights, fading to nothing.

Shot on ARRI Alexa 65, 35mm anamorphic lens with a soft minimal flare only along the smoke ribbon's rim-lit length, T2.8 shallow depth of field, natural 35mm film grain, thickening blue-hour mist advancing up the pass, locked forward axis with a slow decay of walking motion to stillness before the smoke begins rising, then completely stationary for the remainder of the shot, no camera shake.
```

---

## Full V10 Sequence Overview
| Clip | Title | Beat | Elements | Duration |
| ---- | ----- | ---- | -------- | -------- |
| 1 | The Climb | Dusk. Camera walks up a stone-paved mountain pass on an ancient Himalayan silk-road trail · single prayer flag · dying horizon · first stars | Stars, Dust, Stone, Fabric | 10s |
| 2 | The Pass Shrine | Blue-hour. Camera reaches a weathered stone way-shrine at the top of the pass · mandala carved into its face with kintsugi gold · aged parchment prayer scrolls in stone niches · still rainwater basin at its base · rows of prayer flags along the pass ahead | Ancient geometric symbols, Fragments of handwritten philosophy, Water | 10s |
| 3 | The Silence | Nightfall. Camera stops at the shrine · single thread of gold incense smoke rises from a niche (Act V echo) · dying horizon fades · smoke disperses into gold motes · mist rises up the pass from the valley · frame settles into deep near-black | All seven elements dissolve; Act V thread echo as rising incense | 10s |
| **Total** | | | | **30s** |

### The story V10 tells
A traveler climbs an ancient Himalayan mountain pass as the sun is setting.
They reach a stone way-shrine at the top — carved with sacred geometry, tucked with old prayer scrolls, a still basin of rainwater at its base, prayer flags stretching down the pass ahead.
They stop.
From the shrine's altar, a single thread of incense smoke rises to meet the sky.
The sun finishes setting.
Blue-hour mist rises up the pass and swallows everything.
The mountain returns to silence.

### If Flash still misbehaves
- **If the horizon light reads as a bright sun instead of a thin dying band**: replace "a thin dying band of warm antique gold along the western horizon" with "a low horizontal thread of dying dusk warmth stretched along the western horizon silhouette — a line, not a disc, no visible sun in the frame."
- **If the incense smoke in Clip 3 reads as a bright glowing knot**: replace with "a thin vertical ribbon of smoke moves upward continuously through the upper third of the frame from a stone niche in the shrine — it is a rising line, not a hovering point, its warm color visible only along its western rim from the last horizon light."
- **If the rising mist in Clip 3 reads as bright fog**: swap "blue-hour mist begins rising up the pass" for "cold dark mountain mist crawls up the pass from the deep valley — dense, opaque, shadow-toned, absorbing light rather than emitting it."

### Post-Assembly
Concatenate `corridor_v10_part1.mp4` → `corridor_v10_part3.mp4` and export as `corridor_v10_full.mp4` for Act III. Keep as an alternate to V2 / V3 / V4 / V6 / V7 / V8 / V9 rather than overwriting them.

### SAVE AS
`corridor_v10_part3.mp4` → Place in `public/videos/`
