# OWN KARMA — 24 s Scroll-Stopper · Google Flow Generation Pack (Story 2)

Split of *The Unmasking* into three 8-second clips designed for Google Flow (Veo 3.1 Quality — which caps individual clips at 8 seconds). Each clip is self-contained, has a locked-in first frame and last frame so the three can be stitched seam-invisibly. Total finished runtime: **24.000 s**.

**Global spec (locked across all three clips):**
- **Generation model: Veo 3.1 — Quality mode ONLY.** Do not use Veo 3.1 Fast, do not use Veo 2, do not use any other model. Every one of the three clips must be generated at Veo 3.1 Quality. Anything less will not hold the obsidian blacks, gold halation, film grain, or slow-motion fidelity this film needs.
- **Duration per clip: 8.000 s** (Veo 3.1's hard max). Total film: 24 s.
- Frame rate: 24 fps
- Aspect ratio: 16:9 (safe-crop 9:16 for social)
- Palette: obsidian black `#050505` + molten gold `#C9A24B` highlight / `#E8C87A` tint. No other colour.
- Camera: mostly locked; a single deliberate push through the debris in Clip 2. No handheld. No shake.
- Composition: dead-centre, symmetrical, huge negative space.
- Motion: everything at 40 – 60 % of natural speed; explosion elements shot at effective 120 fps slow-motion.
- Grain: 35 mm Kodak 5219 emulation, halation on golds only.
- No people, no faces (except the carved obsidian mask), no products, no on-screen text until Clip 3.
- **Audio: generate SILENT.** Do NOT let Flow invent audio for the individual clips — a single continuous 24-second track will be laid over the finished cut in post. See the AUDIO PRODUCTION section below.

---

## AUDIO STRATEGY — READ FIRST

Google Flow / Veo generates fresh audio for every clip it renders. Three separate 8-second generations will produce three unrelated soundscapes — the drone pitch, the bell tone, the reverb tail, and the room ambience will all shift audibly at the 8 s and 16 s cut points. That is unacceptable for this film.

**Rule:** treat the three Flow renders as picture-only. Mute or strip their audio. Then lay one continuous, purpose-built 24-second audio track across the whole cut in your NLE.

How to make Flow cooperate:
1. Every prompt below ends with the phrase **"silent film, no audio, no music, no sound effects"**. Keep it there.
2. If your Flow build still forces an audio track, discard it on import: right-click the clip in your NLE → **Unlink Audio** → delete the audio track.
3. Build ONE 24-second stereo bed (see the AUDIO PRODUCTION section at the bottom of this doc) and drop it under the three stitched clips. Since it is a single file, continuity is guaranteed by construction.

---

## STITCHING PLAN

| Handoff | Last frame of previous clip | First frame of next clip | Transition |
|---------|-----------------------------|--------------------------|------------|
| Clip 1 → 2 | Extreme close-up of the obsidian mask, dead centre, now covered in a fractal web of glowing gold cracks in sacred-geometry patterns, warm gold light pouring from every fissure, mask still intact but internally lit like a lantern | Same obsidian mask, same framing, cracks and internal light at maximum intensity, on the verge of shattering | Straight cut, or 4-frame dissolve |
| Clip 2 → 3 | Camera has pushed through the debris cloud, obsidian shards and gold dust still visible drifting past on the edges of frame, ahead is the very first hint of a vast cosmic field of glowing gold sacred symbols emerging in the distance | Same cosmic field, closer now, sacred symbols clearly visible drifting like celestial bodies in a black nebula | Straight cut, or 4-frame dissolve |

Generation tip in Flow: after generating Clip 1, extract its last frame → use it as an image-conditioning start frame for Clip 2. Do the same from Clip 2 → Clip 3. This guarantees perfect stitching.

Recommended final edit: butt-cut the three clips at exactly 8.000 s and 16.000 s. If a hair of dissolve is needed, use a 4-frame (167 ms) cross-dissolve. No longer.

---

## CLIP 1 — "The Stillness and the First Crack" (0.000 – 8.000 s)

Covers original beats 01 Stillness, 02 First Crack, and the first half of 03 Sacred Fracture — compressed into 8 seconds.

**Story:** Obsidian ceremonial mask in absolute stillness → gold veins pulse once → single sharp gold crack strikes across the forehead → cracks spread along Fibonacci angles → sacred geometry begins to emerge → gold light bleeds from every fissure.

**First frame:** Extreme close-up of the obsidian mask, dead centre, filling the frame. Eyes closed. Absolute stillness. Deep shadow with a razor-thin gold highlight on brow, cheekbone, lip.
**Last frame:** Same mask, same framing, now covered in a network of glowing gold cracks in early sacred-geometry patterns, warm gold light bleeding from every fissure, mask still fully intact.

### Google Flow prompt (paste directly)

> Cinematic 8-second silent film, Veo 3.1 quality, 24 fps, ultra-slow motion, monochrome obsidian black with warm molten gold accents only, deep matte 35 mm film grain, halation on gold, crushed blacks, extremely high dynamic range between dark shadows and warm highlights, centred symmetrical composition, dead-locked camera with zero movement — no pan, no zoom, no push-in, no shake — the camera does not move a single pixel during the entire clip.
>
> Subject: an extreme close-up of an ancient hand-carved obsidian ceremonial mask, filling the frame, dead centre, facing directly into the camera. The mask is androgynous, faceless in expression, timeless — a fusion of Mesoamerican, Cycladic, Noh, and Ife bronze aesthetics. Eyes are closed and carved shut. The stone is deep black obsidian with faint natural gold veining running through it like marbling. Lighting is single-source low-key from the upper-left at 45 degrees, illuminating only the ridge of the brow, the cheekbone, and the lower lip with a razor-thin warm highlight; ninety percent of the mask is in deep shadow.
>
> Sequence: (0 – 2.5 s) cold open, no fade-in, the mask is instantly present in absolute stillness, nothing moves, not a dust particle, the gold veins in the stone pulse once extremely faintly around the 1-second mark like a slow heartbeat inside, the frame is holding its breath; (2.5 – 3 s) continued stillness, complete silence and stasis, tension builds; (3 s exact) a single luminous sharp gold crack appears in one frame across the mask's forehead, diagonal from upper-left to lower-right, jagged like a lightning strike, 1 to 2 pixels wide at first, glowing with warm molten gold light, an instant snap not a fade as if the mask has been struck; (3 – 5 s) the crack holds and glows, a single grain of stone dust falls from the fissure, warm gold light bleeds faintly from inside the crack, a second smaller crack branches off from the first growing organically downward toward the eye; (5 – 8 s) cracks continue to spread slowly and organically across the entire face of the mask along fractal and Fibonacci angles forming an intricate web, each crack glows with warm molten gold, by 8 seconds the mask is heavily fractured with recognisable sacred geometry patterns beginning to emerge in the fissure network (hints of Flower of Life, spiral, radial symmetry), warm gold light now bleeds from every crack giving the whole mask an internally lit quality as if a lantern is burning inside it, the mask is still intact but visibly strained.
>
> Composition and camera rules, strict: the mask stays perfectly centred in the frame at the same scale for the entire 8 seconds. The camera does not move. The mask does not rotate, tilt, or shift position at any moment. Only the cracks and the gold light change over time.
>
> No people, no faces beyond the carved stone mask, no products, no text, no letters, no writing, no logos, no watermarks, no subtitles, no numbers. Silent film, no audio, no music, no sound effects.
>
> Style: timeless, philosophical, sacred, luxurious, mysterious, high-end luxury fashion film, museum artefact, cinematic like Denis Villeneuve meets Alejandro Iñárritu meets Kubrick, obsidian and gold only, engraved-on-the-void aesthetic.

**Duration to request in Flow:** 8 seconds.
**Start-frame image:** none (this is the cold open).
**Audio:** silent. Discard any audio Flow attaches.

---

## CLIP 2 — "The Shatter and the Push Through" (8.000 – 16.000 s)

Covers original beats 03 Sacred Fracture (final buildup), 04 Shatter, and the first half of 05 Cosmos Behind the Face — compressed into 8 seconds.

**Story:** Sacred fractures reach maximum intensity → mask explodes toward camera in slow motion → thousands of obsidian shards and gold dust suspended in air → camera pushes through the debris cloud → emerges into the first hint of a vast cosmic field.

**First frame:** Same obsidian mask from Clip 1's last frame — covered in a network of glowing gold sacred-geometry cracks, gold light pouring from every fissure, mask on the verge of shattering.
**Last frame:** Camera has fully pushed through the debris cloud; obsidian shards and gold dust drift past on the edges of frame; ahead in the distance, the first hint of a vast cosmic field of glowing gold sacred symbols is emerging.

### Google Flow prompt (paste directly)

> Cinematic 8-second silent film, Veo 3.1 quality, 24 fps, monochrome obsidian black with warm molten gold accents only, deep matte 35 mm film grain, halation on gold, crushed blacks, extremely high dynamic range, centred symmetrical composition.
>
> Subject continues from the previous shot: an obsidian ceremonial mask covered in a fractal web of glowing gold sacred-geometry cracks, gold light bleeding from every fissure, internally lit like a lantern under enormous internal pressure.
>
> Sequence: (0 – 1 s) the mask holds at maximum tension, cracks glowing brighter, tiny obsidian flakes falling from the surface, gold light casting real illumination on the surrounding black void; (1 s exact) the mask explodes outward toward the camera in one frame, silent visual impact, thousands of obsidian shards and clouds of warm gold dust freeze in mid-air suspended in slow motion, each shard has a razor-thin gold edge catching light; (1 – 4.5 s) full slow-motion expansion of the fragments, each shard rotates slowly, gold dust curls between them in Perlin-noise turbulence, camera begins a slow deliberate push forward into the centre of the debris field, shards drift past on both sides of the frame, some spin slowly directly at camera; (4.5 – 7 s) camera continues its push through the debris cloud, shards fall away behind us on the edges of frame, the debris thins as we move through it; (7 – 8 s) camera clears the debris field, ahead in the distance the very first hint of a vast cosmic field emerges — faint glowing gold sacred symbols drifting like distant stars in a black nebula, still small and far away, obsidian shards still visible on the edges of frame bridging the two worlds.
>
> Motion: everything is slow-motion, effective 120 fps look. The camera push is smooth and deliberate, not fast. Explosion elements suspended in mid-air, rotating gently.
>
> No people, no faces beyond the shattering carved stone mask, no products, no text, no letters, no writing, no logos, no watermarks, no subtitles, no numbers. Silent film, no audio, no music, no sound effects.
>
> Style: timeless, philosophical, sacred, luxurious, mysterious, high-end luxury fashion film, cinematic slow-motion destruction, Zack Snyder meets Denis Villeneuve slow-mo, obsidian and gold only.

**Duration to request in Flow:** 8 seconds.
**Start-frame image:** the last frame of Clip 1.
**Audio:** silent. Discard any audio Flow attaches.

---

## CLIP 3 — "The Cosmos, the Collapse, the Naming" (16.000 – 24.000 s)

Covers original beats 05 Cosmos Behind the Face (finish), 06 Collapse, and 07 Naming — compressed into 8 seconds.

**Story:** Camera arrives in the full cosmic field of humanity's sacred symbols → all symbols gravitate inward and collapse into a single point of gold light → the point blooms into the OWN KARMA wordmark → tagline *you are the mask. own it.* fades in.

**First frame:** Camera has emerged from the debris, cosmic field of glowing gold sacred symbols now visible in the middle distance, drifting like celestial bodies in a black nebula — matches the last frame of Clip 2 exactly.
**Last frame:** Pure black `#050505` with the wordmark **OWN KARMA** in thin engraved warm-gold serif (`#E8C87A`, weight ~200, letter-spacing 0.35 em, sized at 6 % of frame height) perfectly centred on the horizontal midline, and the tagline *you are the mask. own it.* in the same face at 40 % size, 60 % opacity, positioned 1.5× cap-height below.

### Google Flow prompt (paste directly)

> Cinematic 8-second silent film, Veo 3.1 quality, 24 fps, ultra-slow motion, monochrome obsidian black with warm molten gold accents only, deep matte 35 mm film grain, halation on gold, crushed blacks, extremely high dynamic range, centred symmetrical composition, dead-locked camera with zero movement for the entire clip.
>
> Composition lock: every element sits on the exact vertical centre line of the frame. Nothing drifts sideways at any point.
>
> Sequence: (0 – 2 s) camera opens on a vast cosmic field of slow-drifting glowing gold sacred symbols suspended in a black nebula — ankh, chakra, vegvisir, ouroboros, yggdrasil tree of life, lotus flower, eye of horus, flower of life, fibonacci spiral — each glowing warm gold, each with its own slow rotation, some planet-sized, drifting like celestial bodies against faint gold-tinted nebulae, the scale is infinite and awe-inspiring; (2 – 3.5 s) every drifting sacred symbol slowly gravitates toward the exact centre of the frame on curved gravitational paths, acceleration builds, symbols streak into the centre as long gold light-trails, a gentle lens-effect appears at the centre from the compression of light; (3.5 – 4.5 s) final compression, all symbols collapse into a single luminous point of warm gold light at the exact centre of a pure black frame, one moment of soft lens-flare bloom, then absolute stillness with only that single gold point held at centre; (4.5 – 5.5 s) the point of gold light gently expands outward drawing the OWN KARMA emblem in one continuous line of gold, holds briefly, then softly dissolves as the emblem fades to nothing leaving pure black; (5.5 – 8 s) held pure black frame, then in warm champagne gold thin engraved serif capital letters the exact text "OWN KARMA" fades in letter by letter perfectly centred on the horizontal midline of the frame, wide letter-spacing, luxury fashion brand aesthetic, sharp and stationary; the text reads exactly O-W-N space K-A-R-M-A, seven capital letters total, no other characters, no other words; beneath it at half its size and lower opacity a small serif tagline fades in reading exactly "you are the mask. own it." with lowercase words and periods as shown; wordmark and tagline hold perfectly stationary until the final frame.
>
> Text rules, strict: the ONLY text anywhere in the entire clip is the wordmark "OWN KARMA" and the tagline "you are the mask. own it." — nothing else, no subtitles, no watermarks, no logos, no other letters, no numbers, no punctuation beyond the periods on the tagline. Text does not move, does not glow, does not distort, does not animate beyond a slow opacity fade-in.
>
> Composition rules, strict: everything on the vertical centre line, nothing tilts, nothing pans, nothing drifts sideways at any moment.
>
> No people, no faces, no products, no other graphics beyond the sacred symbols and the wordmark. Silent film, no audio, no music, no sound effects.
>
> Style: timeless, philosophical, sacred, luxurious, mysterious, high-end luxury fashion film title card, engraved-on-the-void aesthetic, obsidian and gold only.

**Duration to request in Flow:** 8 seconds.
**Start-frame image:** the last frame of Clip 2.
**Audio:** silent. Discard any audio Flow attaches.

---

## ⚠️ NOTE ON THE FINAL TEXT REVEAL

Veo 3.1 is notoriously unreliable at rendering readable multi-word typography. There is a real chance the final "OWN KARMA" and "you are the mask. own it." will come out garbled on the first generation.

If the render is close but text is wrong: regenerate the same prompt (often the second attempt lands).

If it stays garbled: pivot to the guaranteed-perfect workflow:
1. Regenerate Clip 3 with the text section deleted from the prompt, ending on pure black at 5.5 s and holding pure black to 8 s.
2. In your NLE, composite the actual **OWN KARMA** wordmark and tagline on top of the pure-black tail using your real brand font. Pixel-perfect typography every time.

---

## POST-PRODUCTION CHECKLIST

1. Generate Clip 1 in Flow at Veo 3.1 Quality, 8 seconds. Verify the last frame matches the description above; regenerate if not.
2. Extract Clip 1's last frame → use it as the start-frame image for Clip 2. Generate at 8 seconds.
3. Extract Clip 2's last frame → use it as the start-frame image for Clip 3. Generate at 8 seconds.
4. Import all three into your NLE (Premiere, Resolve, CapCut, Final Cut).
5. Butt-cut on the frame boundaries at 8.000 s and 16.000 s. If any handoff shows a visible seam, apply a 4-frame (167 ms) cross-dissolve — never longer.
6. Apply a single unified colour grade across all three clips: crush blacks to `#050505`, warm midtones/highlights toward `#C9A24B`, add matched 35 mm grain, matched halation on golds.
7. Layer the single continuous 24-second audio bed over the finished cut (see AUDIO PRODUCTION below). Master at −16 LUFS integrated, true peak ≤ −1 dB.
8. Export a 16:9 hero master and a 9:16 vertical safe-crop.

---

## AUDIO PRODUCTION — the single 24 s bed

Build ONE continuous stereo file, 48 kHz / 24-bit, exactly 24.000 s long. Every element below runs on a single unbroken timeline — no cuts, no crossfades between sections. Continuity across the 8 s and 16 s picture cuts happens for free because the audio never breaks. (All timings scaled proportionally from the original 30 s master by a factor of 0.8×.)

### Track layout (all inside one project, exported as one file)

| Layer | Element | Timeline (s) | Notes |
|-------|---------|--------------|-------|
| L1 | Sub-bass drone, sine wave at 45 – 55 Hz | 00.080 – 21.600, fade in 0.2 – 0.6 s, fade out 21.600 – 21.867 | Tension bed. Never stops until the fall-to-black. Automate +3 dB swells at 05.5 s, 12.8 s, 17.6 s. |
| L2 | Heartbeat, soft muffled kick | 00.960 – 9.600, 60 bpm ramping to 84 bpm across 04.800 – 09.600 | Rising urgency. Sidechain-duck −3 dB whenever a bell strikes. |
| L3 | Stone-crack transient (single hard hit) | 03.000 exact | The moment. Very sharp attack, 4 s reverb tail. −3 dB peak. |
| L4 | Temple bell strikes (3 total) | 03.000 (paired with L3), 10.400, 21.200 | Long convolution reverb. Sacred markers. |
| L5 | Cello duet (D2 + A2) sustains | 04.400 – 9.600 | Warm, held, no vibrato. −8 dB. |
| L6 | Choir sustain, single held "aaah" syllable | 06.800 – 17.600 | Female alto, −12 dB, warm plate reverb, opens up during the cosmos beat. |
| L7 | Reversed cymbal swell (pre-shatter tension) | 08.400 – 9.600 | Long rise to peak at 9.600. |
| L8 | Massive low-end impact + boom | 09.600 exact | The shatter. Sub to −6 dB peak. Layered stone-crash foley pitched down. |
| L9 | Taiko drum accelerando | 19.600 – 20.640 | Four hits total, accelerating into the collapse peak. |
| L10 | Whispered breath | 22.240 | One soft close-mic exhale on the "O" reveal. Mono, centre. |
| L11 | Two "total silence" holes | 02.720 – 03.000 (pre-crack) and 20.640 – 21.200 (pre-reveal) | Automate all layers to −∞ dB inside these windows. |

### Mix rules
- Bus everything through a single master reverb (large hall, 4 s tail) at low send so the whole film shares one acoustic space.
- Compress the master lightly: 2:1 ratio, slow attack, slow release, only 1 – 2 dB of gain reduction on peaks.
- Loudness target: **−16 LUFS integrated**, true peak **≤ −1 dB**.
- Export as one file: `OWN_KARMA_Unmasking_24s_AUDIO.wav` (48 kHz, 24-bit, stereo).

### How to lay it in the NLE
1. Import all three Flow-rendered videos, strip any audio Flow generated.
2. Butt-cut them at 8.000 s and 16.000 s on the video track.
3. Import `OWN_KARMA_Unmasking_24s_AUDIO.wav`.
4. Snap its head to 00.000 s of the video sequence.
5. Never trim or split the audio file. It plays through both picture cuts untouched — this is what guarantees musical continuity.

### If you'd rather not compose from scratch
Commission or license a single 24-second cinematic cue that includes:
- a deep sub-bass drone that runs the whole 24 s,
- a sharp stone-crack / bell strike near 03.0 s,
- a massive low-end impact near 09.6 s,
- a moment of near-silence around 20.8 s,
- a soft return of tone under the final logo hold.

Then add only the whispered breath (L10) and, if you like, the taiko hits (L9) on top of the licensed cue. Everything else in the spec above is optional polish.
