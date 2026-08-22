# ACT IV — ROOM 2: TIME  ·  Sequence Clip 2 of 4

## Google Flow / Veo 3 Quality — 8-Second Cinematic Clip

> **Sequence context.** Clip 2 of a continuous 4-clip Act IV chain (Silence → Time → Purpose → Legacy), **8 s per clip, 4 clips, 32 s total**. This clip starts on the exact last frame of Room 1 and ends on the frame `ACT4_V2_ROOM3_PURPOSE.md` expects as its start. Render muted.
>
> **This clip carries a lot:** the four-stage water-to-hourglass morph from `_documents/images/water_drop_to_hourglass_sequence.jpeg` and the sand-fall beat. In 8 s the four water stages read as **one continuous morph rather than four held beats** — which suits a transformation — but the solid hourglass only gets ~1.2 s before the sand takes over, so it has to resolve crisply. Timings in the beat sheet are tuned for that; don't slow the early stages down or the ending gets clipped.
>
> **The stars are gone.** Earlier drafts had sand grains lifting off as tiny four-pointed gold sparkles. Veo drew cartoon 5-point stars every render regardless of prompt wording, because naming a thing (positive *or* negative) weights the model toward it. The beat is now just sand falling into a cone. **Delete every star / sparkle / sparkle-burst / firework / glitter / five-pointed / six-pointed / cartoon-star word from your Flow negative prompt** — leaving them in is what summons them. If you still want rising sparkles later, they go in post as small lens-glint compositing, never in the base plate.

---

## ⚠ EVERYTHING LEARNED ON ROOM 1 APPLIES HERE

Room 1 took five passes. Do not rediscover any of this:

1. **Model = Veo 3 Quality. NOT `Omni Flash`.** Flash holds the conditioned first frame for a few seconds, then falls back on its own prior — for this footage, a normally-exposed daylight sunset. Check the model selector before every render.
2. **8 s, one generation.** Never extend a clip to lengthen it; an extension is a fresh generation seeded only by the previous last frame, so drift compounds at the join.
3. **Seed must be EXACTLY 16:9 before upload.** Flow *pads* rather than crops, and the bars become part of the picture. Room 1's saved frame has pillarbox bars and must be cleaned first — see § Seeding.
4. **Paste the SHORT prompt.** When an image conditions the render, the prompt should describe only what MOVES. Describing the scene in text makes the text compete with the image and invites Veo to re-render the background from words. The long form in this file is the specification and QA reference, not the thing you paste.
5. **Negations go in the negative-prompt field**, never in the prompt. Naming a thing in the prompt summons it — that is what produced the bell in Room 1.
6. **Sizes are fractions of frame height, never adjectives.** "Large" got a droplet at 7 % of frame height; `ENORMOUS` got one at 48 %. Give numbers, and if a render misses, move the numbers rather than adding adjectives or capitals.
7. **Material discipline.** Say what a thing *is made of* and what lights it. Room 1's droplet became a molten glowing blob because the prompt called it "liquid gold… glowing warmly from within". Here: **the rising water is clear water lit gold by the sunset behind it, not molten metal.** Only the sand is actually gold-coloured; only the frame is actually metal.
8. **Render muted.** Veo's audio does not converge on specific transients. All sound is laid in post.
9. **Master at 4K by upscaling.** Veo does not generate 4K natively.

---

## Seeding

Room 1's saved frame is at `_documents/prompts/Saved_Frame_from_Water_droplet_202608122310.jpeg`. **It is not usable as-is.** It is 1280 × 720 with the picture pillarboxed to ~1090 × 720 (3:2) — black bars down both sides, from the uncropped Room 1 seed — and the `Veo` watermark sits in the right-hand bar.

Best path: **re-render Room 1 with a properly cropped 16:9 seed**, then take its last frame, which needs no cleanup. To move forward with the frame you already have, strip the bars and force exact 16:9 in one pass:

```powershell
# find the exact bar geometry first — limit=4, not the default 24, or it eats the vignette
ffmpeg -i "_documents/prompts/Saved_Frame_from_Water_droplet_202608122310.jpeg" -vf "cropdetect=limit=4:round=2" -frames:v 1 -f null -

# strip bars, force exact 16:9, upscale to 1080p — adjust 1090:720:95:0 to what cropdetect reported
ffmpeg -i "_documents/prompts/Saved_Frame_from_Water_droplet_202608122310.jpeg" `
  -vf "crop=1090:720:95:0,crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale=1920:1080:flags=lanczos,setsar=1" `
  -q:v 1 _documents/images/room2_seed.jpeg

# verify — must be 1920,1080
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 _documents/images/room2_seed.jpeg
```

Cropping a 3:2 picture to 16:9 evenly costs ~107 px top and bottom. Because the crop is even the horizon barely moves — ~40 % frame height against Room 1's ~42 %. Acceptable. Confirm the `Veo` watermark is gone; if it survived, extend the right-side crop until it does.

**Extracting from the video instead:**

```powershell
ffmpeg -sseof -0.05 -i public/videos/room1_silence.mp4 -frames:v 1 -q:v 1 _documents/images/room2_seed.jpeg
```

**Frame slots: first-frame only.** Room 1 used both slots because its end frame *was* its start frame; here the shot must genuinely transform, so a last-frame anchor would fight the morph. Losing that two-ended anchor means the exposure lock is weaker than in Room 1, which is why the prompt now opens with the full **locked background plate** paragraph carried over from Room 1. Check t = 5, 6, 7, 8 s for brightening — that back half is where drift shows.

### ⚠ REMOVE the panel-4 reference image

**Take panel 4 out of Flow's reference/ingredient slot.** Loading it caused all three failures in the last render, and none of them are fixable in the prompt while it is attached.

**1. It is what made the hourglass enormous.** Panel 4 is a letterboxed strip roughly **2.66:1**, and the hourglass fills about **86 % of that panel's height**. A reference image transfers the subject's scale *relative to frame height*. Veo read "hourglass = 86 % of frame height" and delivered exactly that in a 16:9 frame — hence an hourglass filling the picture top to bottom. No amount of "three fifths of the frame height" in the prompt outvotes the image; the picture is the stronger signal.

**2. It is what skipped the build.** A reference of the **finished** object biases every frame toward the finished object. That is why the render had a complete glass hourglass at t = 1.2 s instead of two arcs of water above a bowl. You cannot show a generator the destination and then ask it to take its time getting there.

**3. It is what brightened the background.** A reference contributes its whole look, not just the object. Panel 4 is significantly brighter than our plate, so its exposure and sky bled into the render.

**Instead: first-frame slot only, and let the prompt carry the object.** The prompt below pins the hourglass by three absolute positions rather than a size, which is far more reliable than a size adjective *or* a reference image:

> base on the water at **80 %** frame height · neck at **50 %** frame height · top of finial at **25 %** frame height · cap plates spanning **41 %–59 %** frame width

Those four numbers fully determine its scale and placement, and they are trivial to verify on a paused frame.

*If you want a visual anchor anyway*, don't feed panel 4 raw — rebuild it as a proper 16:9 reference with the hourglass at the size you actually want, so the scale it transfers is the correct one:

```powershell
# crop panel 4, then scale + pad it into a 1920x1080 canvas with the hourglass at ~55% of frame height
ffmpeg -i _documents/images/water_drop_to_hourglass_sequence.jpeg `
  -vf "crop=iw:ih/4:0:ih*3/4,scale=1920:-1,crop=1920:753,pad=1920:1080:0:188:black,eq=brightness=-0.12:contrast=1.15" `
  -q:v 1 _documents/images/hourglass_reference_16x9.jpeg
```

The `eq` darkens it toward the plate so it stops pulling exposure upward. Even then, expect it to front-load the finished object — so add it only if the build works *without* it and you still need the bronze detail nailed.

---

## The reference sequence, read panel by panel

`_documents/images/water_drop_to_hourglass_sequence.jpeg`, top to bottom. **Take shape and staging from it. Do not take its exposure** — the panels are brighter than our plate.

| Panel | Stage | What it shows |
| --- | --- | --- |
| **1** | Impact | The droplet just above the surface, meeting a slender **rebound spike** of water pulling straight up to touch it. Broad concentric rings across dark water. Sunset behind. *(This is Room 1's ending — Room 2 starts here.)* |
| **2** | Eruption | The splash throws up into a clear **X / pinched-waist silhouette**: a rounded bowl of water on the surface below, a tight narrow waist at frame-middle, and **broad rounded splash walls flaring outward above the waist** — same wide bulging shape the finished upper bulb will have. Spray droplets suspended in the air. The hourglass silhouette — full-width bulge above pinched waist above full-width bowl — is legible in water for the first time. |
| **3** | Water hourglass | A complete **hourglass built of water and suspended gold-lit droplets** — transparent upper bulb holding gold-lit liquid, fine waist, lower bulb with a pile of light gathering in it, glittering particles all around. Ripples radiating from its base. Still liquid, not yet an object. |
| **4** | Solid object | A **real ornate hourglass**: solid aged bronze frame with slim knopped bronze uprights (cast bronze all the way through, no wood), circular bronze cap plate top and bottom, a small bronze finial on top, clear glass bulbs, fine gold sand in the upper bulb and a cone building in the lower. Standing on the dark ocean surface — warm-gold sunset highlights scattered across the water's ripple crests all around it — with radiating ripples at its base. Sun and horizon still visible just past its right edge. |

### The hourglass, measured (fractions of frame dimensions)

| Property | Spec |
| --- | --- |
| Base plate | Sits on the water at **~80 % frame height** |
| Top finial | Reaches **~20 % frame height** |
| Total height | **~60 % of frame height** |
| Width | **~20 % of frame width** at the cap plates |
| Waist / neck | **~50 % frame height**, on the vertical centre line |
| Horizontal position | Centred at **~50 % frame width**, directly over the ripple origin — no horizontal drift at any point |
| Sun | Stays visible **just past the hourglass's right edge at ~53 % frame width**, glowing past it and through the glass. Never fully hidden behind it. |
| Frame material | **Solid dark aged bronze — cast metal all the way through, no wood, no wood grain, no wooden posts.** Four slim bronze columns with the gentle knopped profile of an antique bronze upright, plain circular bronze cap plates, one small bronze finial. No engraving, no numerals, no text. |
| Bulbs | **Clear glass**, transparent — the sunset and horizon read through them. |
| Sand | Fine **gold-coloured sand**. This is the one element that genuinely is gold. |

---

### Flow Settings

| Field | Value |
| --- | --- |
| Model | **Veo 3 Quality. NOT `Omni Flash`.** |
| Duration | **8 s**, one continuous generation, never an extension |
| Aspect ratio | 16:9 — seed verified exactly 16:9 via `ffprobe` before upload |
| Frame rate | 24 fps (192 frames) |
| Style | Cinematic, anamorphic, extreme slow motion, **low-key / underexposed** — matches Room 1's plate exactly |
| Mode | **Image-to-Video**, first-frame slot = `_documents/images/room2_seed.jpeg`, last-frame slot empty |
| Reference image | `_documents/images/hourglass_reference_panel4.jpeg` — panel 4 cropped out of the sequence strip, loaded as reference/ingredient. **Shape and material only**; see § Second input for the grade-leak defence. |
| Framing | Locked tripod, **zero camera movement at any point**. No pan, no tilt, no zoom in, no zoom out, no dolly, no reframing. **Frame size, aspect ratio and canvas fill are locked** — the visible picture at t = 0 has the exact same width and height as t = 8. No letterbox reveal, no dolly-back, no field-of-view expansion, no aspect drift. |
| Audio | **Render muted.** All sound in post. |
| Output | Highest quality Flow offers, via the Download button; upscale to 4K after |

---

### How the build actually works — read this before the prompt

The earlier prompt said the water *"settles into the shape of a complete hourglass."* That describes a **result**, so Veo delivered a result: a shape that appeared rather than a thing that was built. The reference panels show a construction, and it runs **bottom to top**:

- **Panel 2** is not just "a splash". Look at what it already contains: a **rounded bowl of water sitting on the surface** — the lower bulb, formed *first* — with a **narrow pinched waist above it** and **broad flaring splash walls rising above the waist** with the same wide bulging shape the finished upper bulb has. The bottom half is closed; the top half is not yet.
- **Panel 3** is that same form completed upward: the bowl has become a full lower bulb, the pinch has drawn into a fine neck, and the flaring splash walls have **curved inward over the top, met, and closed** with a thin rim of water around the opening.

So the hourglass rises out of the ocean the way a vessel is thrown upward on a potter's wheel: base, then waist, then the upper bulb growing up and outward, then the rim closing over. The bronze then replaces the water in the same direction — base plate, columns climbing, glass clarifying, cap plate, finial last.

**On prompt length.** Room 1 established that long prompts hurt because *describing the background in text* makes the text compete with the conditioning image. That does not apply to the moving subject: detail about **what the water does** is exactly what Veo needs, and there is no image telling it that. So the prompt below is long about the water and a single clause about the sky.

### DETAILED PROMPT (paste this into Flow)

```
Locked-off tripod shot, 8 seconds, one continuous unbroken take, extreme slow motion. The camera never moves at all — no pan, no tilt, no zoom in, no zoom out, no dolly forward, no dolly back, no push-in, no pull-out, no reframing at any moment.

FRAME SIZE IS ABSOLUTELY LOCKED FOR THE ENTIRE 8 SECONDS. The visible picture area on the output canvas is exactly the same width and exactly the same height at every single frame from t = 0 s through t = 8 s. The picture does NOT start small and grow bigger. It does NOT start narrow and grow wider. It does NOT start letterboxed with black bars top and bottom that shrink or disappear over time. It does NOT reveal more of the scene as the clip progresses. It does NOT have any black bars, pillarbox bars, or letterbox bars at any moment. From frame 1 the picture fills the entire 16:9 canvas edge to edge with no bars anywhere, and it stays exactly that way through the last frame. The horizon line sits at exactly the same pixel row at t = 0, t = 4, and t = 8. The sun sits at exactly the same pixel position throughout. The camera's field of view does not change. There is no dolly-back reveal, no letterbox open-up, no field-of-view expansion, no aspect drift, no crop change. **The seed image's exact framing, size, and canvas fill IS the framing, size, and canvas fill of every single frame in the clip.**

THE FIRST FRAME IS A LOCKED BACKGROUND PLATE. Treat the uploaded first frame as a finished plate that must not be re-imagined, re-rendered, re-lit, re-graded or replaced at any point. Everything above the horizon line is completely FROZEN and does not move for the entire 8 seconds: the clouds are motionless, the cloud shapes never change, the cloud gap never widens, the sun stays exactly where it is at exactly the same brightness, the horizon line stays dead flat at exactly the same height, and the corner vignette stays as it is. Do not generate a new sky. Do not draw new clouds. Do not redraw the horizon. Do not move the sun. The only things in this entire clip that move are the ocean surface below the horizon and the hourglass building out of it. If any frame were freeze-framed and laid beside the first frame, the sky halves would be indistinguishable.

THE WATER SURFACE. The ocean is dark water with a gentle wave texture. It is NOT a flat mirror-black surface — every small ripple crest across the entire lower half of the frame picks up the warm-gold sunset light, so the water reads as dark ocean scattered with countless tiny warm-gold reflection highlights across the whole frame, matching the sunset's palette. The central vertical warm-gold reflection column runs from the horizon straight down toward the camera and is brighter than the scattered highlights. The water surface keeps this same warm-gold-flecked look throughout the clip — dark base with warm-gold ripple-crest highlights across the whole frame, matching Room 1's plate; not a black void with a single reflection column.

THE HOURGLASS IS SMALL IN THE FRAME. When it finally exists, its base rests on the water at four fifths of the frame height, its narrow neck sits at exactly half the frame height, the top of its small finial reaches only one quarter of the frame height, and its widest points reach only from forty-one percent to fifty-nine percent of the frame width. It occupies less than one fifth of the frame width. On the left and on the right of it there is open ocean and sky at least twice as wide as the hourglass itself. Above its finial there is a large empty area of dark sky, about a quarter of the frame height deep, and that space stays empty until the stars rise into it near the end. The hourglass never fills the frame, never touches the top edge, never touches the side edges, and never dominates the picture.

THE BUILD IS SLOW AND STRICTLY SEQUENTIAL. This is the most important instruction in this prompt. For the first 2.8 seconds there is NO hourglass anywhere in the frame — no glass, no bronze, no metal, no sand, no vessel, no complete shape of any kind. There is only moving water. At 1 second there is only a rising column of water. At 1.5 seconds there is only a bowl of water with two arcs above it and nothing joining them. At 2.5 seconds the shape is still only water and its top is still open. The complete hourglass silhouette does not exist until 2.8 seconds, and no glass or bronze exists until 3.8 seconds. Do not show the finished object early. Do not preview it. Do not fade it in underneath the water. Each stage must be clearly visible on screen for its full time before the next one begins.

The whole clip is ONE continuous physical build: an hourglass constructing itself out of the ocean, growing upward from the water surface. It is never cut, never dissolved, never cross-faded, never snapped or popped into place. Every shape flows smoothly out of the shape before it, the water stays physically connected to the ocean surface the entire time, and nothing ever teleports, replaces itself, or changes in a single frame.

STAGE 1 — THE RISE, 0 to 0.7 seconds. The centre of the concentric ripple rings draws inward and the surface dips into a shallow dimple. Out of that dimple a slender vertical column of dark glossy water pulls straight upward, smooth and unbroken, with a rounded head, like a rebound jet filmed in extreme slow motion. It climbs to about one fifth of the frame height above the surface, staying exactly on the vertical centre line.

STAGE 2 — THE BOWL AND THE WAIST, 0.7 to 1.6 seconds. The head of the column softly breaks. Water gathers at the bottom and swells into a small rounded bowl sitting directly on the ocean surface: this is the lower bulb, and it forms FIRST, before anything above it. From the top rim of that bowl the water pinches sharply into a tight narrow waist at exactly half the frame height. Above that waist the water flares back outward and upward as broad rounded splash walls, wide and full, bulging outward like the sides of a wine glass — the same wide rounded shape the finished upper bulb will have. The splash walls match the width the finished upper bulb occupies. The top of the splash is open — the upper bulb has not yet closed at the top. A few spray droplets fly off the top edges of the flaring walls and hang suspended in the air. The whole silhouette reads as: closed rounded bowl below, tight narrow waist in the middle, broad rounded flaring walls above — a pinched hourglass form made of water.

STAGE 3 — BUILDING UPWARD, 1.6 to 2.8 seconds. The build continues from bottom to top, like a vessel being thrown upward on a potter's wheel. The lower bowl smooths and firms into a continuous transparent sheet of water. The waist stays fine and narrow at the middle of the frame height. Above the waist, the flaring splash walls of the upper bulb continue to grow — they curve inward over the top, meet at the vertical centre line, and close over, and a thin ring of water runs around the top opening to form the flat rim of the upper bulb. The suspended spray droplets are drawn back in and stitch themselves into the surface as it closes. The complete hourglass silhouette now exists, made entirely of clear water, with the same wide bulging bulb shape the finished bronze hourglass will have.

STAGE 4 — LIGHT GATHERS, 2.8 to 3.8 seconds. The water hourglass stays fully transparent and fills with the sunset's light: gold-lit liquid gathers and settles into the upper bulb, a small pile of light collects at the bottom of the lower bulb, and fine glittering water particles drift slowly around the whole form. Ripples keep spreading outward across the ocean from its base.

STAGE 5 — IT BECOMES REAL, 3.8 to 5.0 seconds. The water hardens into a solid object, and this also travels from bottom to top. First a round dark bronze base plate forms where the bowl meets the water. Then four slim bronze columns rise up the outside — cast solid dark aged bronze, plain and smooth, with the gentle knopped profile of an antique bronze upright. The bronze climbs upward as if the water is being replaced from below. The columns are entirely metal from base to cap — no wood, no wood grain, no brown wooden posts anywhere on them, and no wood accent at any point. Then the two bulbs clarify and harden into real clear glass. Then a round bronze cap plate closes across the top. A small bronze finial forms last, at the very top. The gold-lit liquid in the upper bulb becomes fine dry gold sand, already beginning to trickle. The finished object is a small, elegant, antique **bronze** hourglass lit only by this scene's own dark sunset.

STAGE 6 — THE SAND, 5.0 to 7.0 seconds. Gold sand streams steadily down through the narrow neck of the hourglass. A soft cone of gold sand slowly builds up in the lower bulb, growing higher over time. The stream is a fine continuous fall of dry gold-coloured grains inside the glass. The sky above the hourglass stays completely empty for the entire clip — nothing rises out of the sand, nothing floats up, no specks in the air, no glow, no light emission of any kind above the hourglass. Just sand falling inside the glass.

STAGE 7 — THE HOLD, 7.0 to 8.0 seconds. Sand continues to fall through the neck at the same steady rate. Ripples on the water settle out. The sky above the hourglass stays empty. Nothing else moves. Everything holds completely steady by 7.5 seconds. The camera still does not move.

To restate the scale, because it matters more than anything else here: base at four fifths of the frame height, neck at half the frame height, finial top at one quarter of the frame height, widest points between forty-one and fifty-nine percent of the frame width. Open ocean and sky on both sides, at least twice the hourglass's own width. A large empty area of dark sky above it. Once formed it does not drift, rotate, tilt, sink or change size. The sun stays visible just past its right edge, glowing through the glass. The rising water is clear ordinary water lit gold by the sunset behind it, not molten metal.

For the entire 8 seconds the sky stays frozen and the exposure stays locked to the first frame: same darkness, same contrast, same colours, same cloud shapes in the same places, same sun at the same brightness, same flat horizon, same vignette. Nothing brightens. No sunrise. No time passing.

Sound: no audio at all. Completely silent from start to finish.
```

If a stage comes out wrong, rewrite **that one stage** and leave the rest alone. Do not add emphasis capitals to the size numbers — that is what produced the molten blob in Room 1.

---

### BEAT SHEET  (8 s · one continuous bottom-to-top build)

| Time | Stage | What is happening |
| --- | --- | --- |
| 0.0 – 0.7 s | **1 · The rise** | Ripple centre draws inward, surface dips into a shallow dimple, and a slender column of dark glossy water pulls straight up out of it with a rounded head — a rebound jet in extreme slow motion. Climbs to ~20 % of frame height above the surface, exactly on the centre line. **Reference panel 1.** |
| 0.7 – 1.6 s | **2 · Bowl and waist** | The column's head softly breaks and throws outward. At the bottom, water swells into a **wide rounded bowl sitting on the surface — the lower bulb, formed first**. Two ribbons curve up and outward from its rim, spray droplets suspended off their tips. The middle pinches into a narrow waist. Silhouette = closed bowl below, two open arcs above. **Reference panel 2.** |
| 1.6 – 2.8 s | **3 · Building upward** | Bottom to top, like a vessel thrown upward on a wheel. Bowl wall thickens into a continuous transparent sheet. Waist draws to a fine neck at ~50 % frame height. The ribbons lean inward, more water climbs their outer faces, and **the upper bulb grows up out of the waist** — narrow at the neck, swelling wider as it rises — until the ribbons meet, close over, and a thin ring of water forms the flat rim. Suspended spray is drawn back in and stitches into the surface. **Reference panel 3's silhouette completes.** |
| 2.8 – 3.8 s | **4 · Light gathers** | Still fully transparent water. Gold-lit liquid settles into the upper bulb, a small pile of light collects at the base of the lower bulb, glittering particles drift around the form. Ripples still spreading from its base. |
| 3.8 – 5.0 s | **5 · It becomes real** | Solidification, **also bottom to top**: round bronze base plate forms first where the bowl meets the water → turned baluster columns rise up the outside → bulbs clarify and harden into real clear glass → bronze cap plate closes across the top → small finial forms last. Gold-lit liquid becomes fine dry gold sand, already trickling. **Reference panel 4.** |
| 5.0 – 7.0 s | **6 · The sand** | Gold sand streams steadily through the neck; a soft cone of gold sand builds in the lower bulb. Just the falling grains — no glow, no rising specks, no light in the sky. **The sky above the hourglass stays completely empty.** |
| 7.0 – 8.0 s | **7 · The hold** | Sand continues falling at the same steady rate. Ripples settle out. Sky above stays empty. Nothing else moves. **Camera still does not move.** All positions stable by 7.5 s so the end frame is clean for Room 3. |

**The camera tilt is gone.** Earlier drafts ended on the slowest possible upward tilt to "open the cosmic void" at the top of frame. That contradicts a frozen background, and it isn't needed: the top of Room 1's plate is **already near-black**, which reads as void on its own for the hand-off to Room 3. Removing the tilt means Act IV now has **zero camera movement in any clip**, which is more consistent than one lone tilt — and it removes the reframing that risks revealing sky Veo has to invent.

**The build direction is the whole point.** Bowl before waist, waist before upper bulb, upper bulb before rim; then bronze from the base upward with the finial last. If any render shows the hourglass fading in whole, appearing top-first, or cross-dissolving from water to bronze, it has missed the brief regardless of how good the final frame looks.

---

### START FRAME (t = 0.0 s) — must match Room 1's END frame

Wide 16:9 low-angle seascape, Room 1's plate exactly: **dark ocean with fine wave texture and warm-gold sunset highlights scattered across the ripple crests everywhere in the lower half of the frame** (not mirror-black), flat horizon at ~40–42 % frame height, warm-gold sun core on the horizon at ~53 % frame width with the amber cloud arch above it, heavy dark storm cloud across the top, three concentric gold ripple rings expanding outward from ~50 % / 66 %, vertical gold reflection path down the frame centre brighter than the scattered highlights, heavy corner vignette. No droplet anywhere.

### END FRAME (t = 8.0 s) → hand-off to **Room 3 · PURPOSE**

Ornate bronze hourglass matching the panel-4 reference, standing on the near-black water at frame centre, gold sand still trickling inside. Roughly twenty tiny four-pointed gold stars scattered upward through the upper half of the frame. Warm-gold horizon and sun still visible behind, at Room 1's exposure. Sky identical to the first frame. Heavy corner vignette intact.

**On Room 3's expected start frame.** `ACT4_V2_ROOM3_PURPOSE.md` describes this as *"top of the frame beginning to open into deeper black cosmic void."* That is satisfied here **without a camera tilt** — the top of Room 1's plate is already near-black, and ~20 gold stars drifting up into it reads as void. Room 3 needs no rewrite; just don't expect a widened frame or newly revealed sky at the top.

---

### NEGATIVE PROMPT (paste into Flow's negative-prompt field)

```
changing background, new background, different background, background swap, re-rendered sky, new clouds, redrawn horizon, moving horizon, tilting horizon, shifting composition, reframing, crop change, aspect ratio change, letterbox, pillarbox, zoom, pan, dolly, push-in, handheld shake, cut, jump cut, dissolve, cross-fade, fade in, fade out, morph jump, snapping into place, popping into existence, appearing instantly, materialising out of thin air, teleporting, hourglass fading in, hourglass forming top-first, water detaching from the surface, floating water, hovering water, brightening, exposure ramp, auto exposure, gain ramp, auto white balance, tone mapping shift, colour grade shift, lifted blacks, washed out, overexposed, HDR look, flat low-contrast image, daylight, daytime, dawn, sunrise, sunset progression, time-lapse, time of day changing, sky lightening, blue sky, grey sky, cool tones, cyan, blue tint, teal, green, desaturated, clouds parting, clouds clearing, clouds drifting, clouds moving, moving sky, animated sky, changing clouds, sun emerging from clouds, sun moving, camera tilt, tilt up, revealing more sky, lens flare, bloom, glow expanding, god rays, light shafts, pulsing light, molten gold, molten metal, liquid gold, gold blob, honey, syrup, lava, magma, glowing orb, luminous water, self-illuminated, emissive, light-emitting, neon, jelly, opaque water, milky water, crashing waves, breaking surf, whitecaps, foam, spray sheets, storm sea, glassy water, mirror-smooth water, water flattening, hourglass drifting, hourglass rotating, hourglass tilting, hourglass sinking, hourglass floating in air, hourglass changing size, giant hourglass, oversized hourglass, hourglass filling the frame, hourglass touching top of frame, hourglass touching sides of frame, close-up of hourglass, macro hourglass, hourglass in foreground, hourglass appearing early, finished hourglass at the start, glass at the start, bronze at the start, twisted columns, spiral columns, barley twist, rope columns, corkscrew posts, long water arms, water tentacles, water draping outside the shape, trailing water strands, multiple hourglasses, broken glass, cracked glass, shattering, numerals, numbers, roman numerals, engraved text, clock face, dial, hands, gears, clockwork, five-pointed star, six-pointed star, cartoon star, solid yellow star, flat star shape, star sticker, star emoji, big stars, bright stars, spiral, sparkle burst, firework, glitter overlay, cartoon, 3D render look, CGI look, illustration, plastic, text, letters, captions, subtitles, watermark, logo, wordmark
```

---

### AUDIO STRATEGY

**Render muted.** Veo's audio branch does not converge on specific transients — Room 1 proved that across three attempts. Everything is laid in post.

Room 1 establishes that the act opens in true silence and the droplet impact is the first sound. Room 2 is where the bed builds from that. Clip-relative times:

| Window | Content |
| --- | --- |
| 0 – 0.8 s | Water rising — a low inverted whoosh, soft and wet. No cymbal, no riser. |
| 0.8 – 2.2 s | The splash eruption: real slow-motion water, close and airy. |
| 2.2 – 3.8 s | A slow glass-shimmer swell rising as the water form resolves. |
| 3.8 – 5.2 s | A soft, low, woody settle as it becomes a solid object. No impact hit, no boom. |
| 5.2 – 8.0 s | Fine, dry, continuous sand hiss, low in level, plus **sparse** metallic ticks synced to visible grain impacts — one every 0.4–0.8 s, not a rhythm. |
| throughout | Sub-bass drone (~40 Hz) continues from Room 1 with no fade. |

Let the sand hiss run straight through the cut into Room 3 rather than ending it on the boundary — audio crossing a picture cut is what makes four clips read as one shot.

---

### CONTINUITY CHECKLIST

**Setup — check before blaming the prompt**
- [ ] **Model is Veo 3 Quality, not `Omni Flash`**, on *this* render.
- [ ] **8 s, one generation.** Not extended.
- [ ] **SHORT prompt in the box**, not the long specification.
- [ ] Seed verified **exactly 16:9** via `ffprobe` before upload.
- [ ] **`Veo` watermark cropped out** of the seed frame.
- [ ] Negative prompt pasted into Flow's negative-prompt field.
- [ ] First-frame slot only; last-frame slot empty.

**Background must stay completely still**
- [ ] First frame is the cleaned Room 1 last frame; panel-4 reference cropped and loaded as the reference/ingredient image.
- [ ] **Everything above the horizon is FROZEN for all 192 frames.** Clouds motionless — no drift, no billow, no reshaping. Cloud gap never widens. Sun fixed in place at fixed brightness. Horizon dead flat at the same height. Vignette unchanged. *(This is stricter than Room 1, where clouds drifted slowly. A busy foreground transformation plus a moving sky is where drift creeps in, so the sky is held still here.)*
- [ ] **Freeze-frame test.** Export stills at t = 0, 2, 4, 6, 8 s. Mask off everything below the horizon and flick between them — the sky halves must be indistinguishable. Any new cloud shape, any shifted gap, any brightness change is a fail.
- [ ] **Only two things move:** the ocean surface below the horizon, and the hourglass building out of it. Plus the stars, once they exist.
- [ ] **Exposure locked to Room 1's plate throughout.** With no last-frame anchor this is the weak point — check t = 5, 6, 7, 8 s specifically.
- [ ] **The camera does not move at any point.** No tilt at the end — that beat was removed. Zero camera movement anywhere in Act IV.

**Scale — measure it, don't eyeball it**
- [ ] **Panel-4 reference removed from Flow's reference/ingredient slot.** It transfers its own 2.66:1 framing, in which the hourglass is ~86 % of panel height — that is why the last render filled the picture. First-frame slot only.
- [ ] Pause a frame at 7 s and check all four anchors: **base at 80 % frame height, neck at 50 %, finial top at 25 %, widest points between 41 % and 59 % frame width.**
- [ ] **Open ocean and sky on both sides**, at least twice the hourglass's own width. If it reaches the side edges it is far too big.
- [ ] **A large empty area of dark sky above the finial** — roughly a quarter of the frame height. That gap is where the sparkles rise; if there is no gap, the sparkles have nowhere to go.
- [ ] Hourglass never touches the top edge or the side edges at any frame.

**Sequencing — nothing arrives early**
- [ ] **t = 0 to 2.8 s: no glass, no bronze, no metal, no sand, no complete hourglass anywhere in frame.** Water only. Scrub it and confirm.
- [ ] At **t = 1 s** there is only a rising column of water.
- [ ] At **t = 1.5 s** there is a bowl with two short arcs above it and nothing joining them.
- [ ] At **t = 2.5 s** the form is still water and its top is still open.
- [ ] First glass/bronze appears no earlier than **t = 3.8 s**.
- [ ] The finished object is **not previewed, ghosted or faded in underneath** the water at any earlier point.

**Detail accuracy**
- [ ] Columns are **plain straight turned balusters** — not spiralled, twisted, barley-twist, rope or corkscrew.
- [ ] Water ribbons stay **tight to the form**, inside the finished hourglass's width. No long trailing arms, no tentacles, no water draping down outside the shape.
- [ ] Sparkles are **tiny** — each ≤ 1/50 of frame height, soft-edged, faint, warm gold, like small lens glints. Not cartoon stars, not solid yellow star shapes, not stickers or emoji, not big, not bright.
- [ ] Render is **as dark as the plate.** Compare sky and water directly against Room 1's last frame.

**The build — this is what keeps failing**
- [ ] **It BUILDS, bottom to top. It does not appear.** The lower bowl forms before the waist; the waist before the upper bulb; the upper bulb grows *upward out of the neck* and closes with a rim last. Then bronze from the base plate upward, finial last.
- [ ] **One continuous unbroken motion.** No cut, no dissolve, no cross-fade, no snap, no pop, no frame where the object changes instantly. Scrub it frame by frame through each stage boundary — the joins are where a generator cheats.
- [ ] **The water never detaches from the ocean.** It stays physically connected to the surface for the whole build; it must not float free or hover.
- [ ] **Fails the brief regardless of how good the last frame looks** if: the hourglass fades in whole, appears top-first, or cross-dissolves from water to bronze.
- [ ] Panel 2's silhouette is genuinely a **closed bowl below with two open arcs above** — not a symmetrical splash crown, not an already-complete hourglass.
- [ ] Suspended spray droplets are **drawn back in** as the upper bulb closes, not left hanging or simply deleted.
- [ ] All four reference stages are legible. At 8 s they flow into each other rather than holding; that is expected. A stage being **skipped** is not.
- [ ] **The solid hourglass resolves crisply by ~5.0 s.** If it arrives late the sand-and-stars beat gets clipped and Room 3's start frame breaks.
- [ ] **The rising water is clear water lit gold by the sunset** — not molten gold, not honey, not lava, not self-illuminated. Only the sand is genuinely gold-coloured; only the frame is metal.
- [ ] Hourglass sits **directly over the ripple origin** — no horizontal drift, no rotation, no tilt, no sinking, no floating off the water.
- [ ] Hourglass is **~60 % of frame height, ~20 % of frame width**, base on the water at ~80 % frame height. Measure against the frame; don't eyeball it.
- [ ] Sun stays visible just past the hourglass's right edge — never fully occluded.
- [ ] Glass bulbs are **transparent** — the sunset reads through them. Not frosted, not opaque, not mirrored.
- [ ] Exactly **one** hourglass. No duplicates, no reflection that reads as a second object.
- [ ] **No numerals, no clock face, no dial, no hands, no gears, no engraving** anywhere on it.
- [ ] Stars are strictly **four-pointed**, small, warm gold. Not five-pointed, not six-pointed, not spirals, not sparkle bursts.
- [ ] **~20 stars** present by 7.5 s — Room 3's start frame depends on this count.
- [ ] The upward tilt is **barely perceptible** — the only camera move in Act IV. If it reads as a move, it is too fast.

**Output**
- [ ] `ffprobe` confirms **16:9 with SAR 1:1**; no bars baked into the picture at any frame.
- [ ] Upscaled to **3840 × 2160** (`scale=3840:2160:flags=lanczos,setsar=1`, or a model-based upscaler for real detail). Veo does not generate 4K natively.
- [ ] Near-black gradients checked for **banding** after the upscale.
- [ ] **1080p delivery encode** also produced for the web UI.
- [ ] Exported **muted**.
- [ ] End frame **holdable** — everything settled by 7.5 s, no motion blur on sand or stars.
- [ ] No baked text, wordmarks or letters in frame.

---

### KEY VISUAL

An hourglass **builds itself upward out of the ocean** in one unbroken slow-motion take: dimple → slender rebound column → water swells into a rounded bowl on the surface (lower bulb first) with two open arcs above and a pinched waist between → the bowl firms, the waist draws to a fine neck, and the upper bulb grows up out of that neck, widens, closes over and takes a rim of water → light gathers inside the still-transparent water form → bronze replaces water from the base plate upward, columns climbing, glass hardening, cap plate closing, finial last → gold sand streams and each landing grain lifts off as a four-pointed gold star through the glass → ~20 stars fill the upper frame as the slowest possible tilt opens black void along the top edge. Locked frame, Room 1's plate exposure held throughout.

### TEXT OVERLAY (handled by web UI, do **not** bake into the video)

> *Time never creates character. Choices do.*

### SAVE AS

`public/videos/room2_time.mp4`
