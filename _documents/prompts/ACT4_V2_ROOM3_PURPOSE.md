# ACT IV — ROOM 3: PURPOSE  ·  Sequence Clip 3 of 4
## Google Flow / Veo Omni — 10-Second Continuous Cinematic Clip

> **Sequence context.** Clip 3 of a continuous 40-second Act IV chain. **This clip must start on the exact last frame of Room 2.** Render muted.

---

### Flow Settings
| Field | Value |
| --- | --- |
| Model | Google Flow / Veo Omni (Quality tier) |
| Duration | 10 s |
| Aspect ratio | 16:9 (Landscape) |
| Frame rate | 24 fps |
| Style | Cinematic, anamorphic, slow-motion, hyper-detailed macro |
| Mode | **Image-to-Video** (first-frame seed = Room 2's last frame) |
| Audio | **Disable / mute on export** |

### Flow Inputs
- **First-frame seed (primary input)**: **the exact last frame of `public/videos/room2_time.mp4`**. Extract with `ffmpeg -sseof -0.05 -i public/videos/room2_time.mp4 -frames:v 1 room2_last.png` and upload `room2_last.png` as the first-frame image.
- **Style reference (secondary, strongly recommended)**: `_documents/images/own_karma_cotton_storyboard.jpeg` — this image encodes the full cotton → fiber → thread → weave → fabric metamorphosis. Feed it as a style/composition reference.

---

### PROMPT (paste into Flow, exactly as-is)

```
Cinematic wide slow-motion shot, 16:9 anamorphic. The opening frame is identical to the seed image: ornate brass hourglass on mirror-black water at lower-third-center with gold sand trickling inside, roughly twenty small four-pointed gold stars scattered upward filling most of the frame, warm-gold horizon behind, deeper black cosmic void just beginning to open at the top of the frame. From 0 to 2 seconds the camera continues a slow upward push: the hourglass and seascape recede below the bottom edge of the frame, the rising gold stars now fill the frame and drift further apart, and the environment behind them fully opens into a deep pitch-black cosmic void with sparse warm-gold nebula dust and distant gold star fields. From 2 to 4 seconds the brightest gold star at exact frame center softens, blooms, and resolves into a single raw white organic cotton boll hanging weightless in the cosmic void, rim-lit by warm gold light, with hyper-detailed macro fiber texture. From 4 to 6 seconds the cotton boll begins to unravel from its right side: luminous gold-white fibers pull outward and trail across the void in graceful curved arcs, aligning into parallel filaments; the filaments coalesce onto a small wooden thread spool that materializes at frame center, radiating gold thread streams outward. From 6 to 8 seconds the thread streams sweep leftward across the void and lay themselves as vertical parallel warp threads of a floating loom, and a horizontal weft passes through them, weaving a dark handwoven cashmere-like cloth that emerges from the loom. From 8 to 10 seconds the newly woven cloth flows outward, unfurling and draping softly across the void as a long dark ribbon of fabric with subtle gold embroidery threads. At the exact center of the cloth a small subtle circular gold cotton-fiber emblem gently blooms into visibility. Palette: pure black, deep amber, warm gold, no cool tones, no cyan, no blue tint. ARRI Alexa 65, anamorphic lens, shallow depth of field, hyper-detailed macro texture on cotton fibers and fabric weave, subtle film grain, no wordmarks, no letters, no readable text in the frame — only the abstract cotton-fiber emblem. The final frame shows a dark handwoven cashmere cloth drape filling most of the frame in soft folds, gold embroidery glowing faintly across its surface, a small subtle circular gold cotton-fiber emblem gently blooming at the exact center of the cloth, and deep pitch-black cosmic void behind with sparse warm-gold dust particles floating around it.
```

---

### START FRAME (t = 0.0 s) — must match Room 2's END frame
Ornate brass hourglass on mirror-black water at lower-third-center, gold sand trickling inside. Roughly twenty tiny four-pointed gold stars scattered upward filling most of the frame. Warm-gold horizon still visible behind. Top of the frame beginning to open into deeper black cosmic void.

### END FRAME (t = 10.0 s) → hand-off to **Room 4 · LEGACY**
Dark handwoven cashmere cloth drape filling most of the frame in soft folds. Subtle gold embroidery threads glowing faintly across its surface. **A small subtle circular gold cotton-fiber emblem gently pulsing at the exact center of the cloth.** Deep pitch-black cosmic void behind with sparse warm-gold dust particles floating around the drape.

### BEAT SHEET
| Time | Beat |
| --- | --- |
| 0.0 – 2.0 s | Camera lifts. Seascape drops away. Full cosmic void reveals with rising gold stars. |
| 2.0 – 4.0 s | Center star softens and blooms into a raw white cotton boll weightless in the void. |
| 4.0 – 6.0 s | Cotton unravels; gold-white fibers align and coalesce onto a wooden thread spool. |
| 6.0 – 8.0 s | Thread streams lay out as a warp on a floating loom; weft weaves dark cashmere. |
| 8.0 – 10.0 s | Woven cloth unfurls and drapes; central gold cotton emblem blooms. |

### AUDIO STRATEGY
Render **muted**. Composite this clip's audio in post:
- Sub-bass drone continues seamlessly from Room 2.
- Add a slow warm cello swell rising from ~t = 4 s (cotton boll bloom) to t = 8 s (fabric unfurl).
- Add a very subtle silk-friction whisper synced to the fabric drape from ~t = 8 s.
- No hourglass audio should carry into this clip — the ticking tail ends inside Room 2.

### CONTINUITY CHECKLIST
- [ ] First frame is pixel-identical to `room2_last.png`.
- [ ] Cotton boll appears at the exact pixel-center position where the brightest star was in the seed frame.
- [ ] Palette locked: black + warm gold spectrum only. Cotton is white but rim-lit warm gold; no cold-white glare.
- [ ] Loom/spool have zero mechanical detail — they read as abstract weightless objects in void.
- [ ] **No wordmarks, no OWN KARMA text**. The central emblem is a small abstract circular cotton-fiber icon, not the wordmark.
- [ ] End frame is holdable — drape motion settles by t = 9.5 s.
- [ ] Export **muted**.

### KEY VISUAL
Cosmic void reveal → cotton boll → unraveling gold fibers → thread spool → floating loom warp+weft → dark cashmere drape with central gold cotton emblem.

### TEXT OVERLAY (handled by web UI, do **not** bake into the video)
> *We don't make clothing. We preserve intention.*

### SAVE AS
`public/videos/room3_purpose.mp4`
