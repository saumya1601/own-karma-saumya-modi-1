# ACT III — V8 CLIP 3: THE ALTAR (OMNI FLASH — EXTEND FROM CLIP 2)
## Google Flow / Veo — Omni Flash — 10 Second Video (Image-to-Video / Extend)

### Concept
The camera reaches the altar at the far end of the cathedral-ship's nave. The altar is a single low, weathered basalt plinth in front of the vast arched forward window. Resting on it: a shallow still pool of black water — a scrying basin. Hovering just above the pool: a single small knot of luminous gold thread, drawn by nothing, held by nothing, quietly turning in the zero-G. The window behind frames a real deep-space starfield. The camera approaches, slows to almost a stop at the altar, and holds. The gold thread breathes softly, then unwinds. Its light dims. The starfield behind it darkens, star by star. Dark velvet vacuum haze rises from the reflection pool below and thickens through the frame. The nave columns and hanging silk banners recede into it. The window darkens to match the void until the ship's interior and outer space are one deep black. The frame settles into deep, uniform near-black — the story's serene ending, seamless handoff to Act IV.

### V8 principle: **the story ends with stillness, not spectacle**
V4 ended with mist and fog. V6 ended with a knot unwinding into silence. V7 ended with a full-density collapse spiraling inward. V8 ends with **the camera stopping** — the only clip in the series where the forward drift comes to rest. The altar is the destination the whole story has been walking toward. When the camera reaches it, it stops. The dissolve then happens *around* the still camera, not because the camera moves through it.

This is the smoothness payoff — every clip has held the same forward pace, and the final beat is the pace resolving to zero. Emotionally: reverence, arrival, quiet.

### Handoff notes
- **No hard timestamps.** Flash does not choreograph precise second-marks. The altar approach, the pause, the dissolve, and the darkening are described as one continuous sequential progression.
- **The end frame doesn't need to hit a mathematically pure `#000000`.** [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) already renders the video over a `bg-black` container with its own animated black overlay used for the seamless cut to Act IV. This clip only has to end deep and uniformly dark.

### What Act III canonical elements this clip introduces & completes
- **Water** enters as a still black basalt scrying pool on the altar plinth — real, physical, and functional to the space.
- The **gold thread knot** on the pool is the visual echo of the golden thread that draws itself into the OWN KARMA emblem in Act V.
- By the end of the shot, all seven canonical Act III elements from the spec — Fabric, Water, Stone, Stars, Ancient geometric symbols, Dust, Fragments of handwritten philosophy — have appeared, functioned in the sacred interior, and dissolved into darkness across the 30s V8 sequence.

---

### Instructions for Google Flow
1. Upload the last frame of Clip 2 (`corridor_v8_part2.mp4`'s final frame: camera about a third of the way down the nave, foreground columns on both sides, silk banners hanging between the colonnade, drifting manuscripts, distant altar light framed by the arched window and its starfield).
2. Set mode to **Image-to-Video** / **Extend**.
3. Use settings below.

### Settings
- **Model**: Veo — Omni Flash (Flow's fast tier)
- **Duration**: 10 seconds
- **Aspect Ratio**: 16:9 (Landscape)
- **Resolution**: 1080p (Full HD) — use Flow's post-generation 4K upscale if needed.
- **Frame Rate**: 24 fps (cinematic)
- **Style**: Cinematic, realistic, deep-space, architectural, weathered, sacred, quiet
- **Audio**: OFF / muted — mute the track in post regardless of the in-app toggle.
- **Mode**: Image-to-Video (Extend from uploaded frame)

---

### PROMPT (Copy-Paste Below)

```
Continuing seamlessly from the uploaded starting frame. The camera holds the same perfectly steady cinematic forward drift at exactly the same slow contemplative pace as the previous shot — no acceleration, no cuts, no rotation, no orbit, no zoom, no handheld shake. Cathedral-scale, weightless, physical, real.

The camera glides forward through the last third of the cathedral-ship's nave. The receding obsidian columns and hanging bone-ivory silk banners on both sides pass slowly out of frame. The drifting illuminated vellum manuscripts drift past the camera and out of frame behind it. The frame is now dominated by the altar at the far end of the nave — a single low, weathered basalt plinth carved from the same dark stone as the nave floor, standing directly in front of the vast arched forward window in the ship's forward wall.

On the plinth's flat upper surface rests a shallow still pool of black water — a scrying basin cut into the stone, its surface glass-calm and mirror-perfect, reflecting the ceiling above with faint gold light. Hovering just above the pool, at exactly the plinth's mid-height, a single small knot of luminous gold thread turns slowly in the zero-G air — drawn by nothing, held by nothing, densely woven, self-contained. It is the destination the camera has been walking toward. It pulses faintly, breathing with a slow contained warm glow.

Behind the altar, the vast arched window in the ship's forward wall opens onto the real starfield beyond — a sparse scattering of small warm-toned pinpoint stars widely spaced across the deep black void of interstellar space, framed on all sides by the ancient carved-stone architecture of the window. The window's iron muntins run in a hand-forged lattice, dark against the void.

As the camera approaches the altar, it gradually slows and comes to rest a short distance in front of the plinth, holding at the altar for the remainder of the shot. The forward drift resolves gently into stillness — no jolt, no snap, simply the slow decay of momentum coming to zero. The gold thread knot is now centered in the frame, hovering above the scrying pool, framed by the arched window and its starfield behind.

The knot holds for a beat. Then it gradually loosens and comes apart — its threads unwinding and dissolving into a few small dim motes of warm gold light that drift slowly outward and fade. The scrying pool below catches the last of that light as a faint reflection, then stills.

As the knot dissolves, the arched window's starfield begins to darken — the pinpoint stars fading out one by one, receding into deeper blackness as some slow cosmic haze thickens the void beyond the ship. Inside the nave, dark velvet vacuum haze begins to rise from the still water in the scrying pool below — deep charcoal-black, dense, opaque, shadow-toned, reading as thickening depth rather than as bright fog. The haze rises slowly through the frame in silent zero-gravity curls, filling the altar space and gradually swallowing the remaining architecture around it.

The colossal obsidian columns of the nave, still visible in the near foreground on both sides, recede into the thickening haze and vanish. The hanging aged silk banners between them dim and disappear. The remaining illuminated manuscripts drift out of visibility. The arched window darkens completely until the ship's interior and the outer space beyond it are one continuous deep black. The scrying pool below darkens to match.

By the end of the shot, the haze and darkness have consumed the entire frame, leaving it deep, uniform near-black — calm, empty, silent, with only the faintest last trace of warm gold from the dissolved knot fading out at center-frame before it, too, disappears. The story ends in stillness. The frame is ready for a seamless cut to Act IV.

The color palette stays locked and moves toward pure black by the end: deep pitch black (#000000) dominant and increasing to near-total by the final frame, warm antique gold (#C9A55A) only as the knot's small contained glow, its unwinding threads, and the final dimming motes — all fading to nothing. Warm ivory (#F4F0E8) only as the faintest possible tint on the smallest highlights, fading to nothing.

Shot on ARRI Alexa 65, 35mm anamorphic lens with a soft minimal flare only directly on the gold thread knot as it turns and glows, T2.8 shallow depth of field with the altar in sharp focus and the starfield gently softened behind, natural 35mm film grain, dark velvet vacuum haze that thickens as darkening depth rather than as bright fog, locked forward axis with a slow decay of forward drift to stillness at the altar, no camera shake.
```

---

### KEY VISUAL TRANSITION
- **Starts at**: A third of the way down the nave (from your uploaded Clip 2 final frame).
- **First half**: Camera glides through the last of the nave, columns and banners passing out of frame. The altar plinth reveals itself in full — a scrying pool of still black water with a single gold thread knot hovering above it, framed by the arched window and real starfield behind. Camera slows to rest at the altar.
- **Second half**: Knot unwinds and dissolves. Starfield darkens star by star. Dark vacuum haze rises from the scrying pool. Columns, banners, manuscripts, window, pool — all recede into darkness. Frame settles into deep uniform near-black.
- **End**: Deep, uniform near-black. The story ends in stillness.

### END-FRAME (Handoff to Act IV)
Deep, uniform near-black with only the faintest last trace of warm gold ember from the dissolved knot fading out at center. Doesn't need to be mathematically pure #000000 — the app's black overlay transition in [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx) completes the final seam.

### SAVE AS
`corridor_v8_part3.mp4` → Place in `public/videos/`

---

## Full V8 Sequence Overview
| Clip | Title | Story beat | Canonical elements introduced | Duration |
| ---- | ----- | ---------- | ----------------------------- | -------- |
| 1 | Arrival | Camera approaches the exterior of an ancient cathedral-ship drifting derelict through deep space · crosses the threshold of its open airlock · first glimpse of the interior nave | Stars, Dust, Stone | 10s |
| 2 | The Nave | Camera glides down the length of the ship's main nave · colossal obsidian columns with kintsugi gold veins · aged silk banners hanging weightless in zero-G · drifting illuminated vellum manuscripts · distant altar light waiting at the far end | Fabric, Ancient geometric symbols, Fragments of handwritten philosophy | 10s |
| 3 | The Altar | Camera reaches the altar · a scrying pool of still black water on a basalt plinth · a single gold thread knot hovering above it (Act V echo) · vast arched window opens onto the real starfield · camera comes to rest · knot dissolves · dark vacuum haze rises · frame settles into deep near-black | Water, and the completion & dissolution of all seven | 10s |
| **Total** | | | | **30s** |

### The story V8 tells
A traveler approaches an ancient cathedral-ship drifting derelict in the black between stars.
They cross its threshold.
They walk its silent nave, past pillars and banners and floating manuscripts left by the ones who came before.
They reach the altar.
On the altar: a still pool of black water. Above the water: a single thread of gold, quietly turning.
They stop.
The thread unwinds. The stars behind it darken. The haze rises. The ship recedes into black.
Everything fades. Meaning remains.

### Why V8 is different from V4, V6, and V7
- **V4** = obsidian temple corridor with archetypal elements (columns, banners, orbs). Symbolic, not situated. Ground-based.
- **V6** = Kubrick-minimal void. One subject at a time. Almost no material context. Cosmic, spare, empty.
- **V7** = maximalist cosmic archive. Layered density, exhaustive material detail, but the setting is dreamlike and symbolic — a place that couldn't physically exist.
- **V8** = a **real place**. A physical spacecraft with a history, walked by a real camera, in real zero-G physics, with real materials weathered by real time. The three clips form a **three-act story arc** — arrival, exploration, resolution — with the camera pace held identical across all three so the concatenated 30s feels continuous. The dissolve happens because the camera *stops* at its destination, not because objects spiral inward. This is the "smoothness like a story" register: reverent, grounded, quiet.

### V8's realism rules
1. **Every material is named specifically and grounded in the real world** — obsidian plating, basalt ribs, verdigris brass, aged bone-ivory silk, weathered vellum, iron muntins. Not "sacred stone" or "cosmic silk."
2. **Every architectural element uses real architectural nouns** — hull, airlock, arch, nave, colonnade, plinth, altar, muntins. Not "temple pillars" or "corridor walls."
3. **The physics behave like real zero-G** — silk drifts, manuscripts float, water sits still in a pool because surface tension holds it, dust drifts weightlessly. Not "floating magical objects."
4. **The lighting is motivated by real sources** — starlight through a window, kintsugi glow from within cracked stone, gold rim light catching seams and creases. No "ambient sacred glow."
5. **The camera pace is unbroken across all 30 seconds and only resolves to stillness at the altar in Clip 3.** That's the smoothness signature.

### If Flash still misbehaves
- **If Clip 1's hull renders as pale or metallic rather than deep obsidian**: replace "polished dark obsidian" with "deep matte black obsidian plating, absorbing light rather than reflecting it, with only thin gold seams glowing along the rivet lines."
- **If Clip 2's silk banners render pale or white**: replace "aged bone-ivory silk banners" with "banners of deeply-shadowed aged silk, the fabric's ivory tone visible only where creases catch thin lines of gold rim light, most of each banner reading as dark silhouette against the deeper shadow of the nave."
- **If Clip 3's camera never comes to rest**: reinforce with "the forward drift slows continuously and comes to a complete stop at the altar, holding for the remainder of the shot with the camera completely still, no residual movement of any kind."
- **If the vacuum haze in Clip 3 renders bright**: swap "dark velvet vacuum haze" for "black cosmic smoke — dense, opaque, shadow-toned, absorbing light rather than emitting it." Flash sometimes needs the word "smoke" to break out of its fog default.

### Post-Assembly
Concatenate `corridor_v8_part1.mp4` → `corridor_v8_part3.mp4` (in that order) and export as `corridor_v8_full.mp4` for Act III's canvas scrubbing engine. Keep this as an alternate to the existing V2 / V3 / V4 / V6 / V7 sets rather than overwriting any of them, so all versions can be compared before committing to one in [Act03Corridor.tsx](../../src/components/sections/Act03Corridor.tsx).
