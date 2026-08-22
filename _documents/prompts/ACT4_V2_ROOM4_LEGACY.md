# ACT IV — ROOM 4: LEGACY  ·  Sequence Clip 4 of 4  (Hand-off to Act V "The Single Ember")
## Google Flow / Veo Omni — 10-Second Continuous Cinematic Clip

> **Sequence context.** Final clip of the continuous 40-second Act IV chain. **This clip must start on the exact last frame of Room 3.** Its end frame is the seed for Act V. Render muted.

---

### Flow Settings
| Field | Value |
| --- | --- |
| Model | Google Flow / Veo Omni (Quality tier) |
| Duration | 10 s |
| Aspect ratio | 16:9 (Landscape) |
| Frame rate | 24 fps |
| Style | Cinematic, anamorphic, slow-motion, meditative |
| Mode | **Image-to-Video** (first-frame seed = Room 3's last frame) |
| Audio | **Disable / mute on export** |

### Flow Inputs
- **First-frame seed (primary input)**: **the exact last frame of `public/videos/room3_purpose.mp4`**. Extract with `ffmpeg -sseof -0.05 -i public/videos/room3_purpose.mp4 -frames:v 1 room3_last.png` and upload `room3_last.png` as the first-frame image.
- **Style reference (secondary)**: none required — pure dissolution motion.

---

### PROMPT (paste into Flow, exactly as-is)

```
Cinematic wide slow-motion shot, 16:9 anamorphic. The opening frame is identical to the seed image: dark handwoven cashmere cloth drape filling most of the frame in soft folds, subtle gold embroidery threads glowing faintly across its surface, a small subtle circular gold cotton-fiber emblem gently pulsing at the exact center of the cloth, deep pitch-black cosmic void behind with sparse warm-gold dust particles floating around it. From 0 to 3 seconds the cloth begins to dissolve at its outer edges: its threads unravel and disintegrate into thousands of drifting tiny warm-gold ember particles that rise slowly upward through the void; the central gold emblem holds steady and pulses softly. From 3 to 6 seconds the dissolution moves inward across the entire drape until half of the cloth is a rising cloud of gold embers, and the central emblem itself starts to unweave thread by thread, each thread lifting away as a filament of golden ember light. From 6 to 8 seconds the last of the cloth evaporates, leaving only a swirling cloud of warm-gold ember particles suspended in the void; the particles slowly condense inward toward the exact center of the frame, most fade into darkness, and one single ember at the exact center of the frame strengthens. From 8 to 10 seconds the frame is pure pitch-black void (#000000) with one single small warm-gold ember pulsing softly at exact frame center in a slow steady breathing pulse, absolutely still, no camera motion, no other lights, no other particles remaining. Palette: pure pitch black and warm gold only, no other colors, no cool tones. ARRI Alexa 65, anamorphic lens, shallow depth of field, subtle film grain, no text, no logos, no wordmarks. The final frame is pure pitch-black void with one small warm-gold ember pulsing softly at the exact center of the frame — clean, holdable, silent, and ready to loop.
```

---

### START FRAME (t = 0.0 s) — must match Room 3's END frame
Dark handwoven cashmere cloth drape filling most of the frame in soft folds. Subtle gold embroidery glowing faintly across its surface. Small subtle circular gold cotton-fiber emblem pulsing at the exact center of the cloth. Pitch-black cosmic void behind with sparse warm-gold dust particles floating around it.

### END FRAME (t = 10.0 s) → hand-off to **Act V "The Single Ember"**
**Pure pitch-black void (`#000000`) with one single small warm-gold ember pulsing softly at the exact geometric center of the frame.** No other lights, no other particles, no drift. Clean and holdable.

### BEAT SHEET
| Time | Beat |
| --- | --- |
| 0.0 – 3.0 s | Outer edges of the cloth dissolve into rising gold embers. Emblem holds. |
| 3.0 – 6.0 s | Dissolution moves inward. Emblem itself starts to unweave, thread by thread. |
| 6.0 – 8.0 s | Cloth is gone. Ember cloud condenses toward the exact center; most fade. |
| 8.0 – 10.0 s | Pure black. One ember at center. Slow breathing pulse. HOLD. |

### AUDIO STRATEGY
Render **muted**. Composite this clip's audio in post:
- Sub-bass drone from prior clips fades out over the first 4 s.
- Room tone at −54 dB from ~t = 4 s onward.
- A single soft warm bell ring at ~t = 8 s (when the ember locks in), decay tail into pure silence.
- Final 2 s: **absolute silence** except for room tone. This is the intended handoff dynamic — the next act opens on this silence.

### CONTINUITY CHECKLIST
- [ ] First frame is pixel-identical to `room3_last.png`.
- [ ] Ember at end frame is at the **exact geometric center** (x = 50 %, y = 50 %) — Act V will animate from this pixel.
- [ ] Ember size ≈ 0.6–0.9 % of frame height at end.
- [ ] End frame is **absolute pitch-black everywhere else** — no residual dust, no lingering embers, no gold horizon.
- [ ] Palette: `#000000` background, ember gradient in the warm-gold spectrum (`#3a1e00 → #d99a24 → #fff4c2`).
- [ ] No text, no wordmarks, no logos anywhere.
- [ ] Export **muted**.

### KEY VISUAL
Cashmere cloth dissolves → gold embers rise → condense → one single warm-gold ember pulsing at frame-center in pitch black.

### TEXT OVERLAY (handled by web UI, do **not** bake into the video)
> *Everything fades. Meaning remains.*

### SAVE AS
`public/videos/room4_legacy.mp4`
