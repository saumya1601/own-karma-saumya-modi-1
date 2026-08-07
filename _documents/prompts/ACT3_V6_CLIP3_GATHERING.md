# ACT III — V6 CLIP 3: THE GATHERING & THE FALL TO BLACK (OMNI FLASH — EXTEND FROM CLIP 2)
## Google Flow / Veo — Omni Flash — 10 Second Video (Image-to-Video / Extend)

### Concept
The rotating gold symbol at the center of the void begins to dissolve. Its thin gold lines break apart into a slow inward spiral of gold particles. From offscreen, thin gold calligraphic light drifts in and joins the spiral. The particles wind themselves into a single small, contained knot of glowing gold thread — a quiet echo of Act V's golden emblem-thread. It breathes softly, holds, then loosens and comes apart. A still black cosmic reflection surface reveals itself beneath the camera in the final beat, mirroring the last dissolving light. Dark mist rises from it. Stars fade one by one. Frame settles into deep uniform near-black — seamless handoff to Act IV.

### V6 principles carried into this clip
- **Elements transform sequentially**, not simultaneously. The symbol dissolves first. Then calligraphy joins. Then the knot forms. Then it dissolves. Then the sea reveals. Then the mist rises. Then the stars fade. That's the shot's rhythm.
- **The knot is a specific visual echo**, not a random glowing object. It quietly foreshadows the golden thread that draws itself into the OWN KARMA emblem in Act V of the spec.
- **The frame gets darker, not brighter**, throughout the shot. Every element that enters or brightens is immediately followed by an element that fades.
- **Water arrives late.** It shows up only in the final beat as a mirror surface for the last dying light — a clean, minimal use of the canonical Water element.
- **No `do not` lists.** Instead, the shot affirmatively describes darkening, thinning, and fading.

### What Act III canonical elements this clip introduces & completes
- **Water** enters as a still black cosmic reflection surface beneath the camera in the final beat.
- **Fragments of handwritten philosophy** enter as faint gold calligraphic light drifting into the forming knot.
- The knot itself is the visual **echo of Act V's golden emblem-thread**.
- By the end of the shot, all seven canonical Act III elements from [_documents/OWN_KARMA_Landing_Page_Experience_Spec.md](../OWN_KARMA_Landing_Page_Experience_Spec.md) — Fabric, Water, Stone, Stars, Ancient geometric symbols, Dust, Fragments of handwritten philosophy — have appeared and dissolved across the 30s V6 sequence.

### Handoff notes
- **The end frame doesn't need to hit a mathematically pure `#000000`.** [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) already renders the video over a `bg-black` container with its own animated black overlay used for the seamless cut to Act IV. This clip only has to end deep and uniformly dark.
- **No hard timestamps in the prompt.** Flash doesn't reliably choreograph precise second-marks. The dissolve is described as a continuous sequential progression.

---

### Instructions for Google Flow
1. Upload the last frame of Clip 2 (`corridor_v6_part2.mp4`'s final frame: rotating gold Metatron's Cube ahead in the middle distance, sparse warm stars in the background, distant ember at vanishing point, sparse gold dust).
2. Set mode to **Image-to-Video** / **Extend**.
3. Use settings below.

### Settings
- **Model**: Veo — Omni Flash (Flow's fast tier)
- **Duration**: 10 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 1080p (Full HD) — use Flow's post-generation 4K upscale if needed.
- **Frame Rate**: 24 fps (cinematic)
- **Style**: Cinematic, low-key, deep-space
- **Audio**: OFF / muted — mute the track in post regardless of the in-app toggle.
- **Mode**: Image-to-Video (Extend from uploaded frame)

---

### PROMPT (Copy-Paste Below)

```
Continuing seamlessly from the uploaded starting frame. The camera keeps its slow, silent forward drift through deep interstellar space — same pace, same eye-height, same locked forward axis. No cuts, no acceleration, no rotation, no orbit, no zoom. The frame stays low-key throughout, growing progressively darker rather than brighter.

First, the slowly rotating gold Metatron's Cube symbol hovering ahead begins to dissolve. Its thin luminous gold lines break apart into a slow inward spiral of small gold particles, each catching a dim thread of warm amber light as it drifts toward the center of the frame.

A beat later, faint gold calligraphic light drifts in from the edges of the frame — loose, flowing brushstroke-like gold marks with only the impression of ancient handwritten script, never legible words. These calligraphic fragments join the inward spiral, spinning slowly around the center as they dissolve into more small gold particles.

At the center of the void, the gathering gold particles begin to wind themselves into a single small, dense knot of luminous gold thread, hovering weightlessly at mid-frame height. The knot is simple and self-contained — no symbol, no text, just woven thread — and it pulses faintly, breathing with a slow contained warm glow. The glow stays small and localized. The surrounding void remains deep black.

The knot holds for a moment. Then it gradually loosens and comes apart, its threads unwinding and dissolving into a few scattered, dim motes of gold light that drift slowly outward and fade.

As the knot dissolves, a still, glassy black cosmic reflection surface reveals itself beneath the camera — a mirror-perfect obsidian plane suspended in the void, catching only the faintest dim reflections of the last dissolving gold light above. Slow, wide concentric ripples spread across it once, then still.

Then, dark cosmic mist begins rising from the surface below — deep charcoal-black, shadow-toned, reading as velvet depth thickening rather than as bright fog. The mist rises through the frame. The sparse warm stars in the background fade one by one as the mist swallows them. The distant warm gold ember at the vanishing point dims and disappears. The scattered dim motes of gold light thin to nothing. The reflection surface below darkens to match the void above until horizon and sky are indistinguishable.

By the end of the shot, the frame has settled into a deep, uniform near-black — calm, empty, silent, with only the faintest last trace of warm gold ember fading out at center-frame before it, too, disappears. The frame is ready for a seamless cut to Act IV.

The color palette stays locked and moves toward pure black by the end: deep pitch black (#000000) dominant and increasing to near-total by the final frame, warm antique gold (#C9A55A) only as the knot's small contained glow, the spiraling particles, and the final dimming motes — all fading to nothing. Warm ivory (#F4F0E8) only as the faintest possible tint on the smallest highlights, fading to nothing.

Shot on ARRI Alexa 65, anamorphic lens with a soft minimal flare only directly on the gold thread knot as it forms and glows, T2.8 shallow depth of field, natural 35mm film grain, dark cosmic mist that thickens as darkening depth rather than as bright fog, locked forward axis, no camera shake.
```

---

### KEY VISUAL TRANSITION
- **Starts at**: Rotating gold symbol ahead in the middle distance (from your uploaded Clip 2 final frame).
- **Sequence**: Symbol dissolves into inward spiral → calligraphic gold light joins from the edges → all particles wind into a single small gold thread knot → knot breathes, holds, loosens → still black cosmic reflection surface reveals below → dark mist rises from it → stars fade one by one → ember dims → frame settles into deep uniform near-black.
- **End**: Deep, uniform near-black with only the faintest last trace of gold at center, fading to nothing.

### END-FRAME (Handoff to Act IV)
Deep, uniform near-black with only the faintest last trace of warm gold ember fading out at center. Doesn't need to be mathematically pure #000000 — the app's black overlay transition in [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) completes the final seam.

### SAVE AS
`corridor_v6_part3.mp4` → Place in `public/videos/`

---

## Full V6 Sequence Overview
| Clip | Title | Subject | Canonical elements introduced | Duration |
| ---- | ----- | ------- | ----------------------------- | -------- |
| 1 | Into the Depth | Pure void · sparse gold dust · single tiny distant ember | Dust | 10s |
| 2 | Memories Arrive | Silk sail drifts past on the left · stone tablet drifts past on the right · rotating gold symbol reveals itself ahead · sparse warm stars appear in the background | Fabric, Stone, Ancient geometric symbols, Stars | 10s |
| 3 | The Gathering & The Fall to Black | Symbol dissolves into inward spiral · calligraphic gold joins · single gold thread knot forms & unwinds · black cosmic reflection surface reveals below · dark mist rises · stars fade · ember dims → deep near-black | Fragments of handwritten philosophy, Water — all seven now present and dissolved | 10s |
| **Total** | | | | **30s** |

### Why V6 is a reset, not another version bump
- **V2** = obsidian temple corridor (Veo 3 Quality, 4×8s, dense philosophical prose). Foundation, not Flash-tuned.
- **V3** = cloth-and-water version that fixed the "ivory silk read as white" bug by locking the 85/10/5 palette explicitly. Still Quality-tuned.
- **V4** = obsidian temple corridor, restructured for Flash (3×10s, palette lock at top and bottom, short sentences, no more than three focal elements per shot).
- **V6** = cosmic setting for Flash, with every shot having **one subject at a time**, elements **arriving sequentially** across the sequence, and the prompts written as **cinematic direction** rather than technical inventory. Palette lock is stated once per prompt, briefly, in the middle — not repeated top and bottom. No `do not X, do not Y, do not Z` lists that Flash was inverting.

### If Flash still misbehaves
- **If the void looks too foggy or grey** in Clip 1: replace "dark cosmic haze that reads as depth" with "the darkness feels like black velvet — depth, not fog. There is no visible atmosphere between the camera and the deep background."
- **If a memory in Clip 2 arrives too small or too far away**: add "the [silk sail / stone tablet] is cathedral-scale and passes close enough to the camera to fill nearly half the frame as it drifts by."
- **If the knot in Clip 3 spikes exposure**: add "the knot's glow is the size of a candle flame at arm's length — small, contained, and it does not illuminate the surrounding void."
- **If the mist in Clip 3 renders bright**: swap "dark cosmic mist" for "black cosmic smoke — dense, opaque, shadow-toned, absorbing light rather than emitting it." Flash sometimes needs the word "smoke" to break out of its fog default.

### Post-Assembly
Concatenate `corridor_v6_part1.mp4` → `corridor_v6_part3.mp4` (in that order) and export as `corridor_v6_full.mp4` for Act III's canvas scrubbing engine. Keep this as an alternate to the existing V2 / V3 / V4 sets rather than overwriting any of them, so all versions can be compared before committing to one in [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx).
