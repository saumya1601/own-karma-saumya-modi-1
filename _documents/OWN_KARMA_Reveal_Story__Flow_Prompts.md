# OWN KARMA — 24 s Reveal · Google Flow Generation Pack

Split of *The Circle* into three 8-second clips designed for Google Flow (Veo 3.1 Quality — which caps individual clips at 8 seconds). Each clip is self-contained, has a locked-in first frame and last frame so the three can be stitched seam-invisibly. Total finished runtime: **24.000 s**.

**Global spec (locked across all three clips):**
- **Generation model: Veo 3.1 — Quality mode ONLY.** Do not use Veo 3.1 Fast, do not use Veo 2, do not use any other model. Every one of the three clips must be generated at Veo 3.1 Quality. Anything less will not hold the obsidian blacks, gold halation, film grain, or slow-motion fidelity this film needs.
- **Duration per clip: 8.000 s** (Veo 3.1's hard max). Total film: 24 s.
- Frame rate: 24 fps
- Aspect ratio: 16:9 (safe-crop 9:16 for social)
- Palette: obsidian black `#050505` + warm gold `#C9A24B` highlight / `#E8C87A` tint. No other colour.
- Camera: locked or ultra-slow push-in (≤ 2 mm per frame). No handheld. No shake.
- Composition: dead-centre, symmetrical, huge negative space.
- Motion: 40 – 60 % of natural speed.
- Grain: 35 mm Kodak 5219 emulation, halation on golds only.
- No people, no faces, no products, no on-screen text until Clip 3.
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
| Clip 1 → 2 | Extreme close-up of an open lotus seed at the centre of a black-sand mandala, a single gold tendril rising vertically out of frame | Same lotus seed and mandala from a slightly wider angle, gold tendril already rising into the sky | Straight cut, or 4-frame dissolve |
| Clip 2 → 3 | Wide shot of a black eclipsed sun surrounded by a swirling vortex of gold embers, beginning to streak into a single ribbon | Same eclipsed sun in the same position, gold ribbon now fully formed and curling into the head of a serpent | Straight cut, or 4-frame dissolve |

Generation tip in Flow: after generating Clip 1, extract its last frame → use it as an image-conditioning start frame for Clip 2. Do the same from Clip 2 → Clip 3. This guarantees perfect stitching.

Recommended final edit: butt-cut the three clips at exactly 8.000 s and 16.000 s. If a hair of dissolve is needed, use a 4-frame (167 ms) cross-dissolve. No longer.

---

## CLIP 1 — "The Awakening" (0.000 – 8.000 s)

Covers original beats 01 Void, 02 Ripple, and the first half of 03 Seed — compressed into 8 seconds.

**Story:** Void → single gold grain falls → lands on black sand → ripples form a seven-ring mandala → camera dives to centre → a lotus seed cracks open → a gold tendril starts to rise.

**First frame:** Pure black `#050505`. Nothing visible.
**Last frame:** Extreme close-up, top-down, of an open lotus seed at the exact centre of a seven-ring gold-filigree mandala on black sand. A single luminous gold tendril rises vertically out of the top of the frame, motion-blurred.

### Google Flow prompt (paste directly)

> Cinematic 8-second silent film, Veo 3.1 quality, 24 fps, ultra-slow motion, monochrome obsidian black with warm gold accents only, 35 mm film grain, halation on gold, matte deep blacks, centred symmetrical composition, huge negative space, dead-still locked camera except one slow top-down dive-in.
>
> Sequence: (0 – 2.5 s) absolute black void, a single spherical grain of gold sand falls slowly through a single narrow shaft of side light, catching one glint as it drifts along a gentle S-curve and exits bottom of frame; (2.5 – 5.5 s) hard cut to a 90-degree top-down macro of the grain landing on a bed of black sand, ripples spread outward from the point of impact and self-organise into seven perfect concentric rings, faint gold filigree traces itself along each ring edge, a full mandala forming; (5.5 – 8 s) camera dives smoothly toward the exact centre of the mandala, arriving on a small black lotus seed that develops a hairline crack along the golden ratio, warm gold light leaks from inside, the shell splits into two halves that fall away in slow motion, and a single luminous gold tendril begins to rise vertically.
>
> No people, no faces, no products, no text on screen. Silent film, no audio, no music, no sound effects. Style: timeless, philosophical, mysterious, luxurious, sacred, engraved-on-the-void. Reference: Terrence Malick meets Denis Villeneuve meets Zen calligraphy.

**Duration to request in Flow:** 8 seconds.
**Audio:** silent. Discard any audio Flow attaches.

---

## CLIP 2 — "The Tree and the Eclipse" (8.000 – 16.000 s)

Covers original beats 04 Tree, 05 Eclipse, and the first moment of 06 Serpent — compressed into 8 seconds.

**Story:** Tendril grows into Yggdrasil against a rising sun → black moon eclipses the sun → tree disintegrates into gold embers → embers begin swirling into a vortex around the black sun.

**First frame:** Extreme close-up of the open lotus seed on the mandala with the gold tendril rising out of frame — matches the last frame of Clip 1 exactly (use Clip 1's final frame as an image-conditioning input in Flow).
**Last frame:** Wide, dead-centre shot of a totally eclipsed black sun ringed by a burning gold corona, surrounded by a slow clockwise vortex of luminous gold embers that are beginning to streak into a single continuous ribbon.

### Google Flow prompt (paste directly)

> Cinematic 8-second silent film, Veo 3.1 quality, 24 fps, ultra-slow motion, monochrome obsidian black with warm gold accents only, 35 mm film grain, halation on gold, matte deep blacks, centred symmetrical composition, huge negative space.
>
> Sequence: (0 – 3 s) camera cranes upward following a single luminous gold tendril that erupts from an open lotus seed on a black-sand mandala, the tendril accelerates into a full silhouetted Tree of Life, roots plunging downward as a mirrored silhouette below the horizon, branches unfurling fractally along Fibonacci angles, tiny gold-speck leaves shimmering into being, a warm sun disc rising directly behind the trunk to form a perfectly symmetrical composition; (3 – 6.5 s) a perfectly circular black moon slides across the sun from screen-right, corona burning brighter along the shrinking crescent, the frame darkens by four stops, at totality the sun becomes a black disc ringed with a burning gold corona and the tree begins to disintegrate into a thousand drifting gold embers; (6.5 – 8 s) the embers rise, then begin to swirl clockwise, forming a slow vortex around the black eclipsed sun, tightening into the beginning of a single ribbon of gold light.
>
> Slow crane-up in the first half, locked frame with a subtle 3 % push-in on the eclipse in the second half. Rack focus once from foreground tree to background eclipse at the moment of totality.
>
> No people, no faces, no products, no text on screen. Silent film, no audio, no music, no sound effects. Style: timeless, philosophical, mysterious, luxurious, sacred. Reference: Terrence Malick meets Denis Villeneuve.

**Duration to request in Flow:** 8 seconds.
**Start-frame image:** the last frame of Clip 1.
**Audio:** silent. Discard any audio Flow attaches.

---

## CLIP 3 — "The Serpent and the Mark" (16.000 – 24.000 s)

Covers original beats 06 Serpent, 07 Mark, and 08 Reveal — compressed into 8 seconds.

**Story:** Gold ribbon forms into a serpent → serpent circles the black sun and bites its own tail (Ouroboros) → ring purifies and morphs into the letter O of the wordmark → OWN KARMA fades in → tagline *unbound.* fades in.

**First frame:** Wide, dead-centre shot of a totally eclipsed black sun with a slow clockwise vortex of gold embers streaking into a single ribbon of light — matches the last frame of Clip 2 exactly.
**Last frame:** Pure black `#050505` with the wordmark **OWN KARMA** in thin engraved warm-gold serif (`#E8C87A`, weight ~200, letter-spacing 0.35 em, sized at 6 % of frame height) perfectly centred on the horizontal midline, and the tagline *unbound.* in the same face at 40 % size, 60 % opacity, positioned 1.5× cap-height below.

### Google Flow prompt (paste directly)

> Cinematic 8-second silent film, Veo 3.1 quality, 24 fps, ultra-slow motion, monochrome obsidian black with warm gold accents only, 35 mm film grain, halation on gold, matte deep blacks, centred symmetrical composition, huge negative space, dead-locked camera with an almost imperceptible 2 % push-in.
>
> Composition lock: every element sits on the exact vertical centre line of the frame. Nothing drifts sideways at any point.
>
> Sequence: (0 – 2.5 s) a swirling vortex of gold embers around a black eclipsed sun tightens into a single ribbon of gold light, the ribbon thickens and grows engraved gold scales, a serpent's head resolves at the 12 o'clock top of the frame facing downward, the serpent's tail hangs at the 6 o'clock bottom, body perfectly mirrored down both sides, the head glides clockwise down the right side, around the bottom, back up the left side, and closes its jaws upon its own tail exactly at the 12 o'clock top, forming a perfectly symmetrical Ouroboros ring around the black sun; (2.5 – 4 s) the serpent's scales dissolve away smoothly into pure gold, the ring simplifies into a flawless thin geometric circle of warm champagne gold line on pure black, the eclipse corona dims completely to black leaving only the ring; (4 – 5.5 s) the gold circle gently shrinks to typographic letter height and slides smoothly to the left-of-centre position of the first letter of a word, becoming the letter O of the wordmark, then the remaining letters fade in one by one to the right of it in warm champagne gold thin engraved serif capitals, spelling out the exact text: "OWN KARMA" — the circle IS the first O, do not draw a separate O, letter order left to right is the circle-turned-O, then W, then N, then a wider space, then K, A, R, M, A, seven letters plus the O made from the ring; (5.5 – 8 s) the complete wordmark "OWN KARMA" holds perfectly still and sharp at the exact centre of the frame in warm champagne gold thin serif capitals on pure black, wide letter-spacing, luxury fashion brand aesthetic; beneath the wordmark at half its size and lower opacity, a small serif tagline fades in reading exactly "unbound." with a lowercase u, lowercase word, ending with a period; wordmark and tagline hold perfectly stationary until the final frame.
>
> Text rules, strict: the ONLY text anywhere in the entire clip is the wordmark "OWN KARMA" and the tagline "unbound." — nothing else, no subtitles, no watermarks, no logos, no other letters, no numbers, no punctuation beyond the single period on unbound. Text does not move, does not glow, does not distort, does not animate beyond a slow opacity fade-in.
>
> Composition rules, strict: the serpent's head is always at 12 o'clock, the tail always at 6 o'clock, the body perfectly mirrored left and right. The ring is always dead-centre. Nothing tilts, nothing pans, nothing drifts left or right at any moment.
>
> No people, no faces, no products, no other graphics. Silent film, no audio, no music, no sound effects. Style: timeless, philosophical, mysterious, luxurious, sacred, engraved-on-the-void, high-end luxury fashion film title card.

**Duration to request in Flow:** 8 seconds.
**Start-frame image:** the last frame of Clip 2.
**Audio:** silent. Discard any audio Flow attaches.

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
| L1 | Sub-bass drone, sine wave at 55 Hz | 00.000 – 21.600, fade in 0.2 – 0.8 s, fade out 21.600 – 21.867 | The spine of the whole film. Never stops until the fall-to-black. Automate +2 dB swells at 05.3 s, 12.0 s, 15.2 s, 18.4 s. |
| L2 | Singing bowl, fundamental 196 Hz (G3) with 5th and octave harmonics | 00.800 – 20.480 | Layered strikes at 00.800, 02.880, 04.000, 06.560, 19.040. Long natural decay each time. |
| L3 | Heartbeat, soft muffled kick | 05.440 – 12.000, 60 bpm ramping to 72 bpm across 08.800 – 09.760 | Sidechain-duck −3 dB whenever a bell strikes. |
| L4 | Deep bell strikes (3 total) | 04.000, 14.080, 17.600 | Long convolution reverb, 4 s tail. Each hit is the loudest transient in the film. |
| L5 | Choir sustain, single held "aaah" syllable, female alto | 10.560 – 12.480 | −12 dB, warm plate reverb. |
| L6 | Wind under-layer, low pink noise filtered | 08.160 – 12.160, hard stop at 12.160 | Cuts abruptly at the moment the moon touches the sun. |
| L7 | Taiko drum, 60 bpm | 15.200 – 17.600 | Four hits total. Duck the drone under each. |
| L8 | Serpentine hiss, filtered noise | 15.680 – 17.920 | Very low, stereo-panned slow left-to-right. |
| L9 | Whispered breaths (2) | 22.400 ("O"), 23.520 (soft exhale) | Close-mic, mono, centre. Do NOT add words — just breath. |
| L10 | Ignition air, filtered white noise sweep | 19.840 – 20.480 | High-pass at 4 kHz. Very short. |
| L11 | Two "total silence" holes | 12.160 – 13.920 and 21.600 – 22.240 | Automate all layers to −∞ dB inside these windows. Leave only a whisper of L1 sub-bass so the room doesn't feel dead. |

### Mix rules
- Bus everything through a single master reverb (large hall, 4 s tail) at low send so the whole film shares one acoustic space.
- Compress the master lightly: 2:1 ratio, slow attack, slow release, only 1 – 2 dB of gain reduction on peaks.
- Loudness target: **−16 LUFS integrated**, true peak **≤ −1 dB**.
- Export as one file: `OWN_KARMA_Reveal_24s_AUDIO.wav` (48 kHz, 24-bit, stereo).

### How to lay it in the NLE
1. Import all three Flow-rendered videos, strip any audio Flow generated.
2. Butt-cut them at 8.000 s and 16.000 s on the video track.
3. Import `OWN_KARMA_Reveal_24s_AUDIO.wav`.
4. Snap its head to 00.000 s of the video sequence.
5. Never trim or split the audio file. It plays through both picture cuts untouched — this is what guarantees musical continuity.

### If you'd rather not compose from scratch
Commission or license a single 24-second cinematic cue that includes:
- a deep sub-bass drone that runs the whole 24 s,
- a bell strike near 14.1 s,
- a moment of near-silence around 21.6 s,
- a soft return of tone under the final logo hold.

Then add only the two whispered breaths (L9) and, if you like, the taiko hits (L7) on top of the licensed cue. Everything else in the spec above is optional polish.
