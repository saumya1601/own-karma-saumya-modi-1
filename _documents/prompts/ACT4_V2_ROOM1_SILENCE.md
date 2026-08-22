# ACT IV — ROOM 1: SILENCE  ·  Sequence Clip 1 of 4

## Google Flow / Veo Omni — 8-Second Cinematic Clip

> **Sequence context.** This is Clip 1 of a continuous Act IV sequence (Silence → Time → Purpose → Legacy). Render the four clips in order. The **last frame of each rendered clip is the input image for the next clip**.
>
> **Duration is 8 s**, which is Veo 3 Quality's native shot length. Do not extend to 10 s — an extension is a fresh generation seeded only by the previous clip's last frame, so drift compounds across the join, which is the opposite of what this shot needs.
>
> **Knock-on:** if Rooms 2–4 also render on Veo 3 Quality they are 8 s too, making Act IV **32 s, not 40 s**. The audio-bed timings in `ACT4_V2_SEQUENCE_README.md` assume 4 × 10 s and will need retiming once the other three clips are locked.
>
> **Audio:** **render muted.** Nothing is heard until the droplet lands — no sea, no waves, no ambience — and the drop plus the settling water are laid in **in post**, because Veo's droplet sound does not converge no matter how it is prompted. See Audio Strategy.

---

## ⚠ DO THIS BEFORE YOU RENDER

**1. Make the seed EXACTLY 16:9.** The reference image is 3:2, Flow renders 16:9, and if the numbers don't match exactly Flow **pads** rather than crops — which is the worse of the two behaviours, because the black bars become part of the picture and no prompt wording will remove them. A 3:2 seed in a 16:9 frame gives you **pillarbox**: bars down the left and right, picture ~1.5:1 in the middle.

> **This is still happening.** Renders as of the latest pass show those side bars, which means the crop below has not been applied to the file being uploaded. The prompt now also says "fills the entire 16:9 frame edge to edge, no letterbox, no pillarbox" and the negative prompt lists both — but that is belt-and-braces. **The seed crop is the actual fix.** Run it, check the `ffprobe` output, and upload the cropped file to both slots.

This centre-crops any input to exactly 16:9 regardless of its dimensions, then confirms it:

```powershell
# centre-crop to exactly 16:9, whatever the source dimensions are
ffmpeg -i _documents/images/silence_seed_seascape_original.jpeg -vf "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)'" -q:v 1 _documents/images/silence_seed_seascape.jpeg

# verify — must print a width:height that divides to exactly 1.7777…
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 _documents/images/silence_seed_seascape.jpeg
```

For a 2528 × 1686 source that yields **2528 × 1422** — 132 px off the top and 132 off the bottom, horizon left at ~42 % frame height, matching every measurement quoted below. If your source is a different size the command still gives you an exact 16:9 centre crop; only the pixel numbers change.

**Then check the render is 16:9 too.** Flow's preview labels itself 16:9, but confirm the exported file rather than trusting the label, and normalise it if it isn't:

```powershell
# check the export
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,sample_aspect_ratio,display_aspect_ratio -of default=nw=1 public/videos/room1_silence.mp4

# force exactly 1920x1080 square-pixel 16:9 if it came back anything else
ffmpeg -i public/videos/room1_silence.mp4 -vf "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale=1920:1080:flags=lanczos,setsar=1" -c:v libx264 -crf 16 -preset slow -c:a copy public/videos/room1_silence_169.mp4
```

`setsar=1` matters — a file can be 1920 × 1080 in pixels and still display wrong if the sample aspect ratio isn't 1:1.

#### Getting to 4K

**Flow does not generate 4K.** Veo 3 outputs 720p or 1080p depending on tier, so any 3840 × 2160 file is an upscale, not native detail. Two things to do:

1. **Take the maximum Flow offers.** Set the highest output quality available before generating, and use the proper **Download** button — not a share link or a screen capture, both of which re-encode and cost you detail you can't get back.
2. **Upscale after.** Cheapest path, no extra tools:

```powershell
# 1080p -> 4K, 16:9 preserved, high-quality H.264
ffmpeg -i public/videos/room1_silence.mp4 -vf "scale=3840:2160:flags=lanczos,setsar=1" `
  -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -an public/videos/room1_silence_4k.mp4
```

`lanczos` is the right scaler here — it holds edges better than the default bicubic, which matters for the ripple rings. But be clear-eyed: this makes a clean 4K *container*, not 4K detail. If you want real added detail, a model-based upscaler (Topaz Video AI, or Real-ESRGAN if you'd rather not pay) reconstructs texture that plain scaling can't. For this footage — soft gradients, heavy noise-like grain in the dark areas — a model upscaler is a genuine step up, and the dark low-key grade is also where naive upscaling shows banding worst.

**Worth flagging for delivery:** this clip lives in `public/videos/` and plays in a web UI. A 4K 8-second H.264 is heavy for that — likely 15–40 MB, decoded on every visitor's device including phones, for a background element most viewers see at well under 1080p. Recommend shipping **both**: keep the 4K as the master, and serve a 1080p (or an AV1/H.265 encode) to the browser. Grade and master at 4K, deliver at what the page needs.

**2. Use BOTH frame slots.** This is the single strongest fix for the background drifting. Flow's **Frames to Video** mode takes a first frame *and* a last frame — put **the same cropped seed image in both**. Image-to-Video anchors only t = 0, which leaves Veo eight seconds to wander off the plate; anchoring both ends clamps the interpolation so it cannot walk away from a background it is required to arrive back at. This shot suits it perfectly, because the intended end frame is already the seed image plus expanding ripple rings and no droplet.

Trade-off, stated plainly: with both ends pinned, the clouds must return to roughly their starting positions, so their drift eases out and back rather than travelling one way. At the displacement this prompt asks for (≤ 3 % of frame width over 8 s) that reversal is imperceptible — you read it as living air, not as a boomerang. If you ever push cloud speed higher, the ease-back *will* become visible; at that point drop the last-frame slot and go back to first-frame-only.

**3. Set the model to the Quality tier, NOT `Omni Flash`.** Flash trades prompt adherence for speed. On a shot whose entire requirement is "do not deviate from the plate," Flash will drift within a few seconds no matter how the prompt is written — it holds the conditioned first frame, then falls back on its own prior for "ocean sunset," which is a normally-exposed daylight one. Your seed is deliberately three stops under that prior, so the regression is severe and fast. Check the model selector next to the prompt box before every render.

**4. Use the SHORT prompt below, not the long one.** See the section that follows for why.

---

## ⚠ USE THE SHORT PROMPT

When an image is conditioning the render, **the prompt should describe only what MOVES.** The image already carries the look — the exposure, the clouds, the colour, the horizon. Describing all of that again in text does not reinforce it; it *competes* with it. Veo weighs text and image against each other, and a long, vivid scene description gives the model both permission and material to re-render the scene from the words. That is why the background rebuilds itself a few seconds in: t = 0 is conditioned on your frame, and from there the model progressively hands over to the text — and the text was a full description of a sky.

Long prompts make it worse in two more ways. Attention dilutes across ~1,400 words, so no single constraint lands hard. And a constraint list is mostly *negation* ("never brighter", "does not widen"), which diffusion models handle poorly in the positive prompt — the same mechanism that produced the bell.

So: **the long prompt below is the human specification and QA reference. The short prompt is what you paste into Flow.**

### SHORT PROMPT (paste this into Flow)

```
Locked-off tripod shot, 8 seconds, no camera movement at all. The picture fills the entire 16:9 frame edge to edge — no black bars, no letterbox, no pillarbox, no inset border. The clouds drift slowly from right to left in gentle parallax and billow softly within their own shapes. The water keeps its fine wave texture and the ripple rings keep spreading outward. At 1 second a single drop of clear water enters at the top of the frame and falls smoothly straight down the centre at a steady graceful speed, passing in front of the sun and landing at the centre of the surface at 3 seconds with one splash. The drop is ordinary clear transparent water — a real raindrop photographed against a sunset. It is see-through: the sun, the horizon and the clouds are visible straight through its body, distorted and flipped upside down by refraction, with a small bright caustic where the sun shines through and thin specular glints on its shoulders. It emits no light of its own and takes all of its warmth from the light behind it. It is water, not molten gold, not honey, not lava, not resin, not a glowing orb. It stands about one fifth of the frame height tall on entry, growing to about one quarter of the frame height just before impact — big enough to read clearly as the subject, small enough that plenty of sky stays visible around it. For the remaining 5 seconds, one bright gold ripple ring and two fainter rings expand slowly outward and the water settles. Everything else is exactly as in the image and does not change: same dark low-key exposure, same clouds, same cloud gap, same sun position and brightness, same flat horizon, same colours, same vignette. Nothing brightens. No sunrise, no time passing.

Sound: no audio at all. The entire clip is completely silent from start to finish. Silent film. No sound of any kind.
```

That is ~170 words and it names every moving element, the timing, and the audio in one compact pass. Pair it with the full **NEGATIVE PROMPT** block — negations belong there, where they are handled as exclusions rather than as description.

**Note the audio line asks for total silence, not for a droplet sound.** That is deliberate — see Audio Strategy. "Be silent" is a target a generator can actually hit; "produce this one specific 300 ms transient" is not. The drop goes on in post, where you control it exactly.

If the short prompt loses something you need (say the droplet drifts off-centre), add **one** sentence for that one problem and re-render. Grow it a sentence at a time. Do not paste the long prompt back in.

---

### Flow Settings

| Field           | Value                                                                                                                                                                                                                                                                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model           | Google Flow / Veo 3 Omni —**Quality tier. Do NOT use `Omni Flash`.** Flash does not hold the plate; it drifts to a normally-exposed sunset within a few seconds.                                                                                                                                                                           |
| Duration        | **8 s** (Veo 3 Quality's native shot length — one continuous generation, never an extension)                                                                                                                                                                                                                                                 |
| Aspect ratio    | 16:9 (Landscape) — seed pre-cropped to 16:9, see above                                                                                                                                                                                                                                                                                             |
| Frame rate      | 24 fps (**192 frames**)                                                                                                                                                                                                                                                                                                                       |
| Style           | Cinematic, anamorphic, slow-motion,**low-key / underexposed**. Exposure and mood match the seed image exactly: a dark, moody seascape at last light where roughly three-quarters of the frame sits in near-black, and only the cloud break, the amber cloud rims and the reflection column carry light.                                       |
| Mode            | **Frames to Video (preferred)** — the same cropped seed image in **both** the first-frame and last-frame slots. Fall back to **Image-to-Video** (first frame only) if your Flow build has no last-frame slot. The seed contains **no droplet** — the sky is empty — so Veo cannot pin a droplet static as it did before. |
| Framing         | **Locked tripod, 16:9, absolutely no reframing** — no zoom, no pan, no dolly, no push-in, no crop change at any moment                                                                                                                                                                                                                       |
| Audio           | **Render silent and mute on export.** Do not ask Flow for the droplet sound — three rounds of prompt work could not make it accurate. The drop and the settling water go on **in post**, where they are exact. See Audio Strategy.                                                                                                     |
| Negative prompt | Paste the**NEGATIVE PROMPT** block below into Flow's negative-prompt field if your build exposes one. If it does not, the essential clamps are already inlined in the short prompt.                                                                                                                                                           |

### Flow Inputs

- **Seed image**: `_documents/images/silence_seed_seascape.jpeg` (the 16:9 crop produced above). Upload to **both** frame slots.
- **Note**: this replaces the earlier `golden_water_drop_ripple.jpeg` as Room 1's seed. That older image is no longer used for Room 1.

#### The seed, measured — Veo must match this exactly and hold it for all 192 frames

Coordinates are fractions of frame width (from the left edge) and frame height (from the top edge), so they survive any output resolution.

| Element           | Position / description                                                                                                                                                                                                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Horizon line      | Dead flat, unbroken, at**~42 % frame height**. Never moves, never tilts, never bends.                                                                                                                                                                                                                                 |
| Sun core          | The single brightest point in frame, a soft warm-white/gold bloom sitting**on** the horizon at **~53 % frame width** — slightly right of centre, not dead centre.                                                                                                                                              |
| Horizon glow      | A broad warm-gold horizontal band along the horizon, brightest at the sun core and falling off smoothly to near-black by ~15 % and ~88 % frame width.                                                                                                                                                                       |
| Cloud gap         | An arch-shaped break in the cloud base directly above the sun, spanning roughly**44–60 % frame width**, its lower edge at **~35 % frame height**. Amber-rimmed cloud lobes form the arch.                                                                                                                      |
| Haze band         | A thin, clear, slightly warm strip of open sky between the cloud base and the horizon, roughly**36–42 % frame height**, widest at the left and right thirds.                                                                                                                                                         |
| Cloud mass        | Heavy charcoal storm cloud filling**0–35 % frame height**, near-black in the **upper-left corner** and the **top edge**, with a distinctly **warmer amber-lit cloud cluster in the upper-right corner** (~78–100 % frame width, 0–22 % frame height). Undersides near the gap are rim-lit amber. |
| Cloud specks      | Faint warm pinpoint specks scattered in the darkest cloud areas, densest upper-left and upper-right.                                                                                                                                                                                                                        |
| Water             | Near-black ocean filling**42–100 % frame height**. **Not glass.** Fine dark wave texture across the whole mid-ground, small distant chop near the horizon, larger surface detail in the foreground.                                                                                                            |
| Ripple rings      | Broad concentric rings already radiating outward, centred at about**50 % frame width / 66 % frame height**, flattened into ellipses by the low camera angle.                                                                                                                                                          |
| Reflection column | A vertical warm-gold specular path from the sun core straight down the frame centre to the bottom edge, broken into discrete gold glints on the wave crests, with a cluster of bright gold glints near**48–55 % frame width / 86–96 % frame height**.                                                               |
| Vignette          | Heavy. All four corners fall to near-black; the bottom-left and bottom-right corners are effectively pure black.                                                                                                                                                                                                            |

#### The droplet, measured

Save the droplet-scale reference at `_documents/images/silence_droplet_size_reference.jpeg`. **Take size and proportion from it only — not exposure, and not material.**

| Property | Spec |
| --- | --- |
| Height on entry (t = 1 s) | **~20 % of frame height** (~215 px at 1080 lines). |
| Height just before impact | **~25 % of frame height**, growing steadily through the fall. |
| Width | **~7 % of frame width** (~135 px at 1920 wide) at its widest point. |
| Material | **Clear, colourless, transparent water.** A real raindrop photographed against a sunset. |
| Transparency | **See-through.** The sun, horizon and clouds are visible *through* its body, refracted — distorted and flipped upside down. A small bright caustic where the sun shines through; thin specular glints on the shoulders. |
| Light | **Emits none.** It is lit entirely by the sun behind it. Not self-illuminated, not emissive, not glowing from within. |
| Shape | Teardrop — narrow pointed top, swelling to a round heavy bottom. |
| Scale cross-check | Reads clearly as the subject, but **plenty of sky stays visible around it** and it does **not** cover the cloud arch or reach the top of the frame. |
| Horizontal position | Vertical centre line, ~50 % frame width, for the whole fall. |

**Two failures this table exists to prevent, both caused by prompt wording:**

1. **Too small (~7 % of frame height).** The prompt said "large" and "big and prominent" — adjectives, which don't set scale. Fixed by giving fractions of frame height.
2. **Molten gold blob at ~48 % of frame height.** The fix for (1) overcorrected: `ENORMOUS`, "hero object that dominates the sky", "liquid gold", "glowing warmly from within", "warm-gold core running vertically through it". Those words describe a giant self-illuminating lava drop, and that is what came back. **Never describe the droplet as gold, molten, liquid gold, luminous or glowing.** It is clear water; the gold is only what it borrows from the sun behind it.

If size still misses, move the numbers by ~4 points and re-render. Do not add adjectives, and do not add emphasis capitals — both are what produced the blob.

Optional extra lever: crop *just the droplet* out of the reference on a plain background and add it as a subject/ingredient reference if your Flow build allows one alongside the frame slots. Only worth trying if the numbers alone don't land — feeding the whole reference frame would drag its brighter grade into your plate, which is the fight you just won.

#### Palette (locked — matches `ACT4_V2_SEQUENCE_README.md`)

| Role                     | Hex                        |
| ------------------------ | -------------------------- |
| Void / shadow / corners  | `#000000`                |
| Cloud charcoal body      | `#141110` → `#2a201a` |
| Deep amber (cloud rim)   | `#3a1e00`                |
| Warm gold (glow, glints) | `#C9A55A` / `#d99a24`  |
| Sun core highlight       | `#fff4c2`                |
| Water near-black         | `#0a0806`                |

---

### LONG PROMPT — specification and QA reference, **not** the thing you paste

> Use the **SHORT PROMPT** above for the actual render. This long form exists so the intent is written down in full and so the checklist has something to check against. Paste it into Flow only if the short prompt fails in a way that more words could plausibly fix — and expect it to make background drift *worse*, for the reasons given above.

```
THE UPLOADED SEED IMAGE IS A LOCKED BACKGROUND PLATE. Treat it as a finished plate that must not be re-imagined, re-invented, re-rendered, re-lit, re-graded, re-composed or replaced at any point in the clip. Do not generate a new sky. Do not draw new clouds. Do not redraw the horizon. Do not reshape the cloud break. Do not move the sun. Do not change the water. All 192 frames are that same plate, with only four things happening inside it: the existing cloud masses translate very slightly and billow slowly within their own silhouette; the existing water surface keeps rippling; one droplet falls between t = 1 s and t = 3 s; ripple rings expand outward from its impact point. Nothing else changes at all. If any single frame of this clip were freeze-framed and laid side by side with the seed image, the two would be indistinguishable apart from cloud position and ripple pattern — identical crop, identical horizon height, identical cloud silhouette, identical gap shape, identical sun position, identical brightness, identical colours, identical vignette. The background at t = 8 s is the same background as at t = 0 s.

Cinematic wide locked-off tripod shot, 16:9, 8 seconds, framing absolutely fixed for the entire clip — no zoom, no pan, no dolly, no push-in, no tilt, no crop change, no reframing at any moment. The plate, matching the seed image exactly: a low camera close to the water; a dead flat unbroken horizon line at forty-two percent frame height that never moves, never tilts and never bends; the single brightest point in frame is a soft warm-white gold sun bloom sitting directly on the horizon at fifty-three percent frame width, slightly right of centre; a broad warm-gold horizontal glow band runs along the horizon, brightest at that core and falling off to near-black toward both edges; above the sun an arch-shaped break in the cloud base spans roughly forty-four to sixty percent frame width with its lower edge at thirty-five percent frame height, framed by amber-rimmed cloud lobes; a thin clear slightly warm strip of open sky sits between the cloud base and the horizon; heavy charcoal storm cloud fills the top thirty-five percent of the frame, near-black in the upper-left corner and along the top edge, with a distinctly warmer amber-lit cloud cluster in the upper-right corner, undersides near the gap rim-lit in amber; faint warm pinpoint specks are scattered through the darkest cloud areas; below the horizon a near-black ocean fills the lower fifty-eight percent, carrying fine dark wave texture across the whole mid-ground and small distant chop near the horizon; broad concentric ripple rings already radiate slowly outward from a point at fifty percent frame width and sixty-six percent frame height, flattened into ellipses by the low camera angle; a vertical warm-gold specular reflection path runs from the sun core straight down the frame centre to the bottom edge, broken into discrete gold glints on the wave crests; heavy vignette drops all four corners to near-black. Colours locked to the plate: pure black shadows, charcoal cloud bodies, deep amber cloud rims, warm gold glow and glints, a warm-white sun core. No cool tones, no cyan, no blue tint, no green, anywhere, at any moment.

EXPOSURE IS LOCKED. This is a low-key, deliberately underexposed, dark and moody frame and it stays exactly this dark for all 192 frames. Roughly three quarters of the frame sits in near-black shadow at every moment; only the cloud break, the amber cloud rims, the horizon band and the reflection column ever rise above mid-grey; the sun core is the single brightest thing in frame and its brightness value never changes. Treat the camera as a cinema camera on fully manual settings: fixed aperture, fixed shutter, fixed ISO, fixed white balance, no auto-exposure, no exposure ramp, no gain ramp, no auto white balance, no adaptive tone mapping, no dynamic range remap, no LUT change, no grade change mid-shot. Overall brightness, contrast, gamma, saturation, warmth and black level at t = 1 s, 2 s, 4 s, 6 s and 8 s are all identical to t = 0 s. The frame never gets brighter and never gets darker. Block the four specific ways this shot goes wrong: (1) the cloud break must NOT widen, open, part, thin, dissipate or clear — the arch is the same width and the same shape at t = 8 s as at t = 0 s, and the sun NEVER emerges further out from behind the clouds; (2) the sun core and its glow must NOT bloom, flare, expand, swell, pulse, breathe, brighten or throw new god rays or light shafts — same position, same size, same shape, same colour, same intensity, frozen for the whole clip; (3) this is NOT a time-lapse and time of day does NOT pass — never simulate a sunrise, never simulate a sunset progression, never let dawn break, never move toward daylight, never let the sky lighten toward blue or grey; (4) the gold reflection path must NOT lengthen, widen or intensify beyond one brief flicker at the droplet impact.

The clouds are the only thing alive in the sky, and they move like real heavy cloud rather than a sliding flat card. Three depth layers drift smoothly and continuously from screen right to screen left in true parallax, at an extremely slow, barely perceptible pace: a high thin veil along the very top of the frame travels furthest, about three percent of the frame width across the whole eight seconds; the main charcoal cumulus mass travels about two percent; the low cloud shoulders on either side of the arch travel under one percent and read as almost static. On top of that translation the cloud masses billow and evolve slowly and volumetrically from within — soft internal churn, slow edge curl in the amber rim-lit undersides near the arch — the way real storm cloud rolls. Crucially, the cloud SILHOUETTE stays recognisably the same shape for the entire clip: the same arch of amber-rimmed lobes over the sun, the same near-black corner mass at upper-left, the same warmer amber cluster at upper-right, the same cloud-base height. Clouds evolve inside their own outline; they never reorganise into a new sky. Cloud colour, tone, hue, saturation, brightness, exposure, temperature, density and opacity stay locked identical to the seed image throughout: the clouds only TRANSLATE and gently BILLOW, they never re-colour, re-shade, re-light, re-tone, thin out, dissolve, brighten, or let more sunlight through. Every cloud pixel across all eight seconds carries the same colour and the same darkness as its counterpart in the seed image; only its position and its soft internal texture change, and only slightly. The faint warm pinpoint specks drift and shimmer gently. Nothing else in the sky moves. Nothing in the sky gets brighter.

The water keeps the exact surface character of the seed image for the whole clip. It is dark, calm, glossy water with fine wave texture — it is NOT glass, NOT a mirror, NOT a flat sheet, and it must never become smooth, glassy, mirror-flat or perfectly still at any point. The fine dark wave texture across the mid-ground and the small distant chop near the horizon persist unchanged from t = 0 to t = 8. The broad concentric rings from the seed keep radiating slowly outward, and the gold glints along the reflection path shift gently with the wave crests. No whitecaps, no foam, no breaking waves, no surf, no spray, no swell rising, no storm sea — and equally no flattening, no smoothing out, no glassing over.

The subject of this shot is a single drop of clear water falling smoothly through this sky into the ocean. From t = 0 to t = 1 second the sky is completely empty exactly as in the seed image and the water ripples on gently. At t = 1 second one drop of ordinary clear water enters at the very top edge of the frame, coming down through the cloud arch. Its material: plain, clear, colourless, transparent water, exactly like a real raindrop photographed in front of a sunset. It is see-through — the sun, the horizon line and the clouds behind it are visible straight through its body, refracted, distorted and flipped upside down, with a small bright caustic where the sun's light concentrates through it and thin specular glints on its shoulders and rim. It emits no light of its own whatsoever; every bit of warmth on it is borrowed from the sun behind it, and it casts no glow onto the sky, the clouds or the water. It is water. It is not gold, not liquid gold, not molten metal, not honey, not syrup, not resin, not lava, not a glowing orb, not a lamp, not a lantern, not a flame, not translucent jelly, and it is not opaque. Its size: it stands about one fifth of the frame height tall as it enters, growing to about one quarter of the frame height just before impact, and about one fourteenth of the frame width across at its widest. It reads clearly as the subject of the shot, but plenty of open sky stays visible around it — it does not cover the cloud arch, it does not touch the top edge of the frame, and it never fills the sky. Its shape is a teardrop: a narrow pointed top, swelling into a round heavy bottom. From t = 1 to t = 3 seconds it falls smoothly straight down along the vertical centre line at a steady graceful cinematic speed — no wobble, no stopping, no hovering, no rotation in place, no acceleration jump, no jitter — passing in front of the sun core, bending that light through its body, and growing steadily in apparent scale as it descends. At t = 3 seconds it lands on the exact centre of the water surface and makes one small splash. Nothing in the frame gets brighter because of it.

There is only one droplet in the entire clip. No droplet rain. No stream of droplets. No repeating drops. None before t = 1 second or after t = 3 seconds. From t = 3 seconds onward, for the remaining 5 seconds, the sky is completely empty of droplets and the shot HOLDS on the water responding to that single impact: one dominant bright warm-gold concentric ring expands slowly outward from the exact centre, clearly larger and brighter than the ambient rings already present; two fainter secondary rings follow behind it in slow motion; the reflection path flickers brighter for under a second then softly returns to its seed-image intensity; the impact rings gradually fade back down into the water's existing ripple texture — the surface returns to the seed image's calm, NOT to glass. Through all 5 seconds the three cloud layers continue their slow right-to-left parallax and slow internal billow with silhouette, colour, darkness and density locked to the seed; the arch stays the same width in the same place; the sun core stays frozen in position, size, colour and intensity; the specks keep shimmering; the horizon stays flat at forty-two percent frame height; the exposure stays locked and the frame does not get brighter.

The camera never moves. The framing never zooms. Aspect ratio stays exactly 16:9 throughout. ARRI Alexa 65 anamorphic on a locked tripod, low-key cinematography matching the seed image's exposure, warmth and mood exactly, shallow depth of field with soft bokeh on the foreground water, heavy corner vignette, subtle film grain, no text, no logos, no wordmarks, no other objects in frame.

AUDIO: The droplet is the source of every sound in this clip. Nothing at all is heard before it lands. From t = 0 to t = 3 seconds the clip is in complete, absolute, digital silence — no sea, no ocean, no water sound, no waves, no lapping, no swell, no surf, no ambience, no atmosphere, no room tone, no hum, no air, no wind, no music, no tone, nothing whatsoever. The ocean is visibly moving and it is entirely silent. Hold that dead silence unbroken for the first three seconds. Then, at t ≈ 3 seconds, the very first sound of the clip arrives with the droplet landing: one ordinary water-drop impact. Acoustically this droplet is plain, ordinary, cold fresh water. Treat it as physically identical to a single rain drop falling off a leaf into a puddle, or a drip from a tap landing in a sink full of water. It does not matter that the droplet looks golden and luminous on screen — it does not sound precious, magical, valuable, molten, glassy or metallic. The sound is exactly what a close mono microphone a foot above still water records when one drop lands: a small, dull, dark, wet, damped, hollow, LOW-pitched bloop — a soft click of contact followed by a brief hollow low tone that dies out completely within a fraction of a second. It is low-pitched, not high-pitched. It is dull and muffled, not bright. It is damped and dead, not resonant. It has no sustain, no ring-out, no sparkle, no shimmer, no reverb, no echo, no harmonic overtones and no musical pitch of any kind. From t = 3 to t = 8 seconds the only sound is the quiet, close, natural sound of that impact's own ripple rings moving on the water — soft subtle water movement born from the splash, very low in level, gradually settling down toward silence as the water calms. That is all. Still no sea ambience, no waves, no surf, no lapping shore, no swell, no wind, no rain, no gulls, no boats, no voices, no music, no score, no drone, no sound design. Naturalistic diegetic sound only, raw and unprocessed, as recorded in real life. Every sound in this clip is caused by the droplet, and silence is the default before it.

The final frame at t = 8 seconds is the seed image again: identical crop, identical horizon at forty-two percent frame height, identical cloud silhouette with the same near-black upper-left mass and the same warmer amber upper-right cluster, the arch the same width in the same place, the sun core on the horizon at fifty-three percent frame width at exactly the SAME intensity as t = 0 — never brighter, never dimmer, never further emerged — warm specks still shimmering, near-black ocean below still carrying its fine wave texture, three concentric warm-gold ripple rings still gently expanding outward from the centre, the vertical gold reflection path glinting down the frame centre, heavy corner vignette intact, exposure and colour identical to t = 0, and no droplet anywhere.
```

### NEGATIVE PROMPT (paste into Flow's negative-prompt field if available)

```
changing background, new background, different background, background swap, re-rendered sky, new clouds, redrawn horizon, moving horizon, tilting horizon, curved horizon, shifting composition, reframing, crop change, aspect ratio change, letterbox, pillarbox, zoom, pan, dolly, push-in, tilt, handheld shake, camera movement, brightening, exposure ramp, auto exposure, gain ramp, auto white balance, tone mapping shift, colour grade shift, LUT change, lifted blacks, washed out, overexposed, HDR look, flat low-contrast image, daylight, daytime, dawn, sunrise, sunset progression, time-lapse, time of day changing, sky lightening, blue sky, grey sky, cool tones, cyan, blue tint, teal, green, desaturated, clouds parting, clouds clearing, clouds thinning, clouds dissipating, cloud break widening, sun emerging from clouds, sun moving, sun rising, sun setting, frozen static clouds, sliding flat cloud card, lens flare, bloom, glow expanding, god rays, light shafts, pulsing light, flickering light, breathing light, glassy water, mirror-smooth water, flat water, still water, water flattening, water smoothing out, crashing waves, breaking surf, whitecaps, foam, spray, storm sea, choppy sea, ocean ambience, sea ambience, wave sounds, water lapping, surf sounds, distant swell, background ambience, room tone, air tone, atmosphere track, rain, thunder, lightning, wind, wind noise, seagulls, birds, boats, people, voices, music, score, soundtrack, sound design, sound effect sweetener, synth pad, drone, riser, whoosh, bell, chime, chime hit, tubular bell, glass bell, gold bell, singing bowl, triangle, glockenspiel, kalimba, harp gliss, plink, ping, twinkle, sparkle sound, magical sound, fantasy sound, high-pitched tone, resonant tone, harmonic tone, musical pitch, tonal transient, sustained ring, ring-out, metallic ring, reverb, reverb tail, echo, delay, multiple droplets, droplet rain, stream of drops, static hovering droplet, molten gold, molten metal, liquid gold, gold blob, honey, syrup, resin, amber resin, lava, magma, glowing orb, glowing droplet, luminous droplet, self-illuminated, emissive, light-emitting, lamp, lantern, flame, candle, neon, egg yolk, jelly, gummy, opaque droplet, solid droplet, oversized droplet, droplet filling the frame, droplet touching top of frame, cartoon, 3D render look, CGI look, illustration, text, letters, captions, subtitles, watermark, logo, wordmark
```

---

### START FRAME (t = 0.0 s)

**Pixel-identical to the cropped seed image `_documents/images/silence_seed_seascape.jpeg`.** See *The seed, measured* above for every element and its position. From t = 0 the **sky is alive but restrained** — three cloud depth layers drift smoothly right-to-left in true parallax with silhouette, colours and darkness locked to the seed, billowing slowly from within; the sun core and its glow are completely frozen in position, size, colour and intensity; the arch never widens; only specks shimmer. The water carries its **fine wave texture from frame one** and never flattens. **The frame is low-key and stays exactly this dark: exposure, brightness, contrast, warmth and black level are locked to the seed for all 192 frames.** **No droplet anywhere in the sky at t = 0.** **Audio: dead silence.**

### END FRAME (t = 8.0 s) → hand-off to **Room 2 · TIME**

**The seed image again** — same crop, same horizon at ~42 %, same cloud silhouette, same arch width and position, same sun core at ~53 % frame width and the same intensity, same vignette, same exposure and colour. The only differences: **three concentric gold ripple rings still expanding outward from ~50 % / 66 %**, and the reflection path glinting down the centre. Water calm but still textured and not fully settled — tension held. No droplet in the sky.

### BEAT SHEET  (8 s · living sky throughout · 1 s hold → 2 s smooth fall → 5 s hold on water)

| Time                      | Picture                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Sound                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 0.0 – 8.0 s (throughout) | **The seed image is a locked plate.** Every frame is that plate; only clouds, water, the droplet and the ripple rings move. Exposure, brightness, contrast, gamma, warmth, saturation and black level identical to the seed at every frame — **never brighter, never darker, never desaturated, never cooled**. Manual camera, no auto-exposure, no grade shift, no time-lapse. Horizon flat at 42 % and fixed. **Arch never widens; the sun never emerges further.** Sun core **completely frozen** in position, size, colour and intensity — no bloom, flare, pulse, breathing or god rays. **Three cloud depth layers drift right-to-left in true parallax** — high veil ≈ 3 % of frame width over 8 s, cumulus mass ≈ 2 %, low shoulders < 1 % — plus slow volumetric billow and edge curl, **all inside an unchanging silhouette**. Cloud colour, darkness, density and opacity locked to the seed. Warm specks shimmer. **Water keeps its fine wave texture at all times — it never becomes glass.** | —                                                                                                       |
| 0.0 – 1.0 s              | Sky already alive and drifting. Completely empty of any droplet. Ripple rings continue radiating gently.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | **Absolute silence.**                                                                              |
| 1.0 – 3.0 s              | One drop of **clear transparent water** enters at the very top of the frame at the cloud arch — **~20 % of frame height on entry, growing to ~25 % before impact, ~7 % of frame width**. See-through: sun, horizon and clouds visible through it, refracted and flipped, with a small bright caustic and thin specular glints. **Emits no light of its own — not gold, not molten, not glowing.** Teardrop shape: pointed top, round heavy bottom. Plenty of open sky stays visible around it. Falls **smoothly** straight down the vertical centre at a steady graceful speed — no wobble, no stopping, no rotation in place, no acceleration jump. Sky drifts on behind it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | **Absolute silence** — the fall is silent.                                                        |
| ~3.0 s                    | Droplet lands at the exact centre of the water. Small warm-gold splash. Sky empty of droplets again but still living.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | **First sound of the clip:** one dull, low, muffled, damped wet plop, gone in under half a second. |
| 3.0 – 5.5 s              | Dominant bright warm-gold ring expands slowly outward from the centre, clearly larger and brighter than the ambient rings. Reflection path flickers brighter for under a second, then returns to seed intensity. Sky drifts on.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Quiet close natural sound of the ripple rings moving on the water. Low level.                            |
| 5.5 – 8.0 s              | Two fainter secondary rings follow behind. Impact rings fade back down into the water's existing ripple texture —**calm, not glass**. Sky continues its living drift. HOLD.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Rippling water settles gradually back down toward silence.                                               |

### AUDIO STRATEGY

**Stop asking Flow for the droplet sound. Render silent and do it in post.**

Three rounds of prompt work — clamping the timbre, describing the physical acoustics, removing the words that summoned the bell — did not produce an accurate drop. That is not a prompt problem any more. Veo's audio branch is jointly generated with the picture and is not steerable at the resolution of one specific 300 ms transient; it will keep reaching for whatever it thinks a glowing golden droplet should sound like. Meanwhile "output complete silence" is a target it can actually hit, and post gives you the exact sound, the exact level, and the exact frame it lands on.

So: **mute the render, and build these three beats in post.**

| Window       | Content                                                                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.0 – 3.0 s | **Absolute digital silence.** No sea, no ocean, no waves, no lapping, no swell, no ambience, no atmosphere, no room tone, no hum, no air. The ocean is visibly moving and completely silent. |
| ~3.0 s       | **One water-drop impact** — the first sound in the clip.                                                                                                                                    |
| 3.0 – 8.0 s | **Only the quiet natural sound of that impact's own ripple rings** on the water, low in level, settling gradually back toward silence. Nothing else.                                         |

The three seconds of dead silence up front are doing real work — they are what makes the drop land, and they are the whole point of a room called *Silence*.

#### Getting a drop that actually sounds right

**Correction to the reference I gave earlier:** "a drip from a tap into a sink" is the wrong scale. The entrained air bubble sets the pitch, and bubble frequency falls as bubble size rises — so a *small* drip is a thin high "plink", while the droplet on your screen is large and falling a long way into open ocean. The accurate sound is **deeper, heavier and rounder** than a tap drip: more low-frequency body, a soft thump under the bloop, no thin top end. That mismatch is probably part of why every version has sounded wrong even when it wasn't literally a bell.

Two ways to get one:

- **Record it yourself in five minutes.** Fill a bathtub or a deep plastic storage tub — *not* a metal sink, ceramic bowl or glass, all of which add container resonance and give you the ring you've been trying to avoid. Phone mic 30 cm above the surface, room quiet. Flick a large drop off your fingertips from ~1 m. Do twenty takes, keep the deepest one. This beats most library SFX because you can control the drop size, and you own it outright.
- **Library.** freesound.org, search `water drop` / `single drip` / `waterdrop deep`. Filter to CC0 to avoid attribution obligations. Judge by waveform, not by name: it must decay to nothing inside ~300 ms with no periodic tail. Anything that looks like a decaying sine is a bell.

If the best take is still too thin, pitch it down — that is physically the right transform, since it is exactly what a bigger bubble does:

```powershell
# drop the pitch ~4 semitones and keep the length (deeper, heavier, same transient)
ffmpeg -i drop_raw.wav -af "asetrate=44100*0.79,aresample=44100,atempo=1.27" drop.wav
```

For the ripple bed, a low-level `pond ripple` / `calm water surface` recording works, or reuse the tub recording with the transient trimmed off.

#### Laying it in

```powershell
# 8 s muted clip + real water-drop SFX at t = 3.0 s + settling ripple fading out by 8 s
ffmpeg -i public/videos/room1_silence.mp4 -i drop.wav -i ripple.wav -filter_complex `
  "[1:a]adelay=3000|3000,volume=1.0[d];[2:a]adelay=3050|3050,volume=0.35,afade=t=out:st=6.5:d=1.5[r];[d][r]amix=inputs=2:normalize=0[a]" `
  -map 0:v -map "[a]" -an -c:v copy -c:a aac -b:a 192k -shortest public/videos/room1_silence_final.mp4
```

Nudge `adelay=3000` to match the frame the splash actually lands on — step through the render to find it, since Veo will not hit 3.000 s exactly. At 24 fps, one frame is ~42 ms; the impact reads as late if the sound is more than about two frames behind the picture, and slightly early sounds better than slightly late.

**Composite note:** the master guide's audio bed runs a continuous ~40 Hz sub-bass drone from 0 s. That contradicts this clip's silent opening. Start the drone at t ≈ 3 s and fade it up under the ripple, so the droplet still breaks true silence.

#### For the record — why Flow kept returning a bell

Kept here so it doesn't get reintroduced if anyone edits the prompt later. Two causes: (1) the original prompt *named* the bell (`NO bells. NO chimes. NO metallic timbre.`) right beside the impact description, and Veo's audio branch treats those tokens as priors rather than exclusions; (2) "liquid gold", "luminous", "glowing" bias jointly-generated audio toward a precious/fantasy chime. Both are now moot because the prompt asks for silence — but if anyone ever puts audio instructions back in, don't name the thing you're trying to avoid, and keep timbre negatives in the negative-prompt field only.

### CONTINUITY CHECKLIST

**Setup — check these five before blaming the prompt**

- [ ] **Model tier is Quality, not `Omni Flash`.** Confirm in the model selector beside the prompt box on *this* render, not a previous one.
- [ ] **Duration is 8 s, generated in one pass.** Not an 8 s clip extended to 10 s — an extension is a fresh generation seeded only by the previous last frame, so drift compounds across the join.
- [ ] **The SHORT prompt is in the box**, not the long specification.
- [ ] **Mode is Frames to Video**, with the cropped seed in **both** the first-frame and last-frame slots — not Ingredients/reference mode, which treats the image as a style suggestion and does not pin frame 1 at all. If the panel is labelled "ingredients" or "reference", that is the wrong mode.
- [ ] Seed cropped from 3:2 to **16:9** with the `crop=2528:1422:0:132` command, saved at `_documents/images/silence_seed_seascape.jpeg`.
- [ ] Negative prompt pasted into Flow's negative-prompt field.

**Background lock — the thing that keeps failing**

- [ ] **Freeze-frame test.** Export stills at t = 0, 2, 4, 6, 8 s and flick between them and the seed. Apart from cloud position and ripple pattern they must be indistinguishable — same crop, same cloud silhouette, same arch shape, same sun position, same brightness, same colours, same vignette. Any *new* sky, *new* cloud shapes or *reorganised* composition is a fail.
- [ ] Horizon dead flat at **~42 % frame height** for all 192 frames — never rises, falls, tilts or bends.
- [ ] Sun core stays **on** the horizon at **~53 % frame width** — slightly right of centre, never drifts to dead centre, never climbs, never sinks.
- [ ] Cloud silhouette preserved: same amber-rimmed arch over the sun, same near-black upper-left mass, same warmer amber upper-right cluster, same cloud-base height.
- [ ] Corner vignette intact at every frame — bottom corners still effectively black.

**Exposure**

- [ ] **Low-key and exactly as dark as the seed for all 192 frames.** ~¾ of frame in near-black at every moment. Never brighter, never darker, never desaturated, never cooled. No exposure ramp, no gain ramp, no auto white balance, no tone-mapping shift, no contrast change, no grade shift, no re-lighting.
- [ ] **The cloud arch never widens, parts, thins or clears, and the sun never emerges further from behind the clouds.** Same width and shape at t = 8 s as t = 0 s. *(#1 cause of the frame brightening.)*
- [ ] **Sun core and glow COMPLETELY FROZEN** — same position, size, shape, colour and **intensity** for 8 s. No bloom, flare growth, god rays, light shafts, pulsing, breathing, brightening or dimming. *(#2 cause.)*
- [ ] **Not a time-lapse.** No sunrise, no sunset progression, no dawn, no drift toward daylight, no sky lightening. Atmosphere at t = 8 s identical to t = 0 s.

**Motion**

- [ ] **Clouds drift right-to-left in three parallax depth layers** — high veil ≈ 3 % of frame width, cumulus mass ≈ 2 %, low shoulders < 1 % — with slow volumetric billow and edge curl. Continuous and barely perceptible: real cloud with depth, **not** one flat sliding card and **not** a frozen still.
- [ ] **Cloud colour, tone, hue, saturation, brightness, exposure, temperature, density and opacity LOCKED identical to the seed** for the full 8 s. Clouds only translate and gently billow — never re-colour, re-shade, re-light, thin out, dissolve or let more light through.
- [ ] **Water keeps the seed's fine wave texture from t = 0 to t = 8 and never becomes glassy, mirror-flat, smooth or perfectly still.** No whitecaps, no foam, no breaking waves, no surf, no spray — and no flattening either.
- [ ] Camera does not move — locked tripod, 16:9, no reframing, no zoom, no pan, no dolly, no push-in, no crop change at any moment.

**Droplet**

- [ ] **Droplet is CLEAR TRANSPARENT WATER — you can see the sun, horizon and clouds through it.** Not molten gold, not liquid gold, not honey, not lava, not resin, not a glowing orb, not opaque, not self-illuminated. It emits no light; the warmth on it is borrowed from the sun behind it.
- [ ] **Droplet is ~20 % of frame height on entry, ~25 % before impact.** Pause a frame and compare its height to the full frame height. Both failure modes have happened: **~7 %** when the prompt used adjectives instead of numbers, and **~48 %** when the fix overcorrected with "ENORMOUS" and "dominates the sky".
- [ ] **Plenty of open sky remains visible around the droplet.** It must not cover the cloud arch, must not touch the top edge of the frame, must not fill the sky.
- [ ] Droplet shape is a **teardrop** — pointed top, round heavy bottom. Not a sphere, not a bead, not a pearl, not a blob.
- [ ] Droplet is **single** and falls **smoothly** — no wobble, no stopping, no rotation in place, no acceleration jump, no jitter.
- [ ] Sky empty of droplets before t = 1 s and after t = 3 s. **Exactly one droplet in the entire clip.**
- [ ] Impact by t ≈ 3 s, then a 5 s HOLD on the water response while the sky drifts on.
- [ ] Dominant central ripple ring is clearly **larger and brighter** than the ambient rings in the seed.
- [ ] Droplet stays exactly on the vertical centre line during its fall.

**Audio — built in post, not by Flow**

- [ ] Flow render exported **muted**. Do not try to fix Veo's droplet sound; it does not converge.
- [ ] Drop SFX is **deep and heavy**, not a thin high plink — the on-screen droplet is large and falling far, so the pitch should sit low with real low-frequency body. Pitch it down if the take is thin.
- [ ] Drop SFX waveform decays to nothing inside **~300 ms** with no periodic tail. Anything resembling a decaying sine is a bell.
- [ ] Recorded in a bathtub or deep plastic tub, **not** a metal sink, ceramic bowl or glass — container resonance is the ring you have been fighting.
- [ ] `adelay` nudged so the sound sits on the frame the splash actually lands on. Slightly early beats slightly late; more than ~2 frames behind reads as out of sync.
- [ ] **t = 0 to the impact is absolute silence** — no sea, no ambience, no room tone, no drone, no hum. Scrub with the meters up; any signal before the drop is a fail.
- [ ] **After the impact, only the quiet ripple/settling water**, fading toward silence by t = 8 s. No sea ambience, no waves, no wind, no music.

**Output — exactly 16:9, mastered at 4K**

- [ ] Flow set to its **highest available output quality** before generating, and the file taken via the proper **Download** button (not a share link, not a screen capture).
- [ ] Upscaled to **3840 × 2160** with `scale=…:flags=lanczos,setsar=1`, or through a model-based upscaler for real added detail. Veo does not generate 4K natively — this is a 4K master, not native 4K.
- [ ] Dark gradients checked for **banding** after the upscale — this grade is mostly near-black, which is exactly where naive scaling bands worst.
- [ ] A **1080p delivery encode** also produced for the web UI. A 4K H.264 background clip is heavy on phones; master at 4K, serve what the page needs.
- [ ] `ffprobe` on the export reports a **16:9** frame with **SAR 1:1**. Do not trust Flow's "16:9" label; check the file. Normalise with `setsar=1` if it isn't.
- [ ] No letterbox or pillarbox bars baked into the picture, at any frame.
- [ ] Seed image was exactly 16:9 before upload (`ffprobe` verified) so Flow never had to crop or pad it.
- [ ] Palette locked to the seed: black + charcoal + amber + warm gold only. No blue, no cyan, no green.
- [ ] Clip is **8.0 s** long.
- [ ] End frame **holdable** at t = 8.0 s — no motion blur on the ripple rings, no droplet anywhere.
- [ ] No baked text, wordmarks or letters in frame.

### KEY VISUAL

The seed image as a **locked background plate** for all 192 frames (16:9 pre-crop; both frame slots seeded; Quality tier; low-key exposure locked; horizon flat at 42 %; sun frozen on the horizon at 53 % width; arch never widens; **three cloud layers drifting right-to-left in slow parallax with slow internal billow inside an unchanging silhouette, colours locked**; water keeps its fine wave texture and never glasses over; only specks shimmer) → **one drop of clear transparent water — ~20 % of frame height, see-through with the sun refracting through it, emitting no light of its own — falls smoothly straight down** from the cloud arch for 2 s **in total silence** → lands on the near-black water at frame centre, **the first sound in the clip** → **5 s hold on the dominant central gold ripple expanding and fading back into the water's existing texture**, carrying only the quiet sound of that settling water, while the sky continues its restrained motion.

### TEXT OVERLAY (handled by web UI, do **not** bake into the video)

> *Every creation begins in silence.*

### SAVE AS

`public/videos/room1_silence.mp4`
