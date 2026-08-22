# ACT IV — V2 Continuous 4-Clip Sequence  ·  Master Guide
## Google Flow / Veo 3 Quality  ·  4 × 8 s = 32 s total

Version **V2** of Act IV rewrites the four Discovery-room videos as a **single continuous 32-second cinematic arc** (Silence → Time → Purpose → Legacy), grounded in the reference art in `_documents/images/`. Each clip picks up on the previous clip's last frame so a viewer scrolling through Act IV sees one uninterrupted metamorphosis, not four unrelated shots.

**Four clips, 8 s each.** 8 s is Veo 3 Quality's native shot length; extending a clip to reach 10 s reintroduces drift at the join, which is the failure Room 1 spent five passes eliminating. The act is therefore **32 s, not 40 s**, and clip boundaries fall at **8 / 16 / 24 s**. Every cue in the audio bed below has been rescaled to match.

The four V1 files (`ACT4_ROOM{1..4}_*.md`) are left in place unchanged as a fallback.

---

## The Continuity Chain

```
   ┌──────────────┐   last frame   ┌──────────────┐   last frame   ┌──────────────┐   last frame   ┌──────────────┐
   │  ROOM 1      │ ─────────────► │  ROOM 2      │ ─────────────► │  ROOM 3      │ ─────────────► │  ROOM 4      │
   │  SILENCE     │                │  TIME        │                │  PURPOSE     │                │  LEGACY      │
   │  (8 s)       │                │  (8 s)       │                │  (8 s)       │                │  (8 s)       │
   └──────────────┘                └──────────────┘                └──────────────┘                └──────────────┘
   seed: silence_seed              seed: room1_last.png            seed: room2_last.png            seed: room3_last.png
   _seascape.jpeg                  ref:  water_drop_to             ref:  own_karma_cotton
   (droplet-free                         _hourglass_sequence             _storyboard.jpeg
    reference sky)                        .jpeg
```

## The Metamorphic Arc

| Clip | Concept beat | Visual anchor from `_documents/images/` |
| --- | --- | --- |
| **1 · Silence** | Dark seascape · suspended amber droplet falls · one gold ripple radiates on mirror-black water | `golden_water_drop_ripple.jpeg` |
| **2 · Time** | Ripple center rises → liquid-gold hourglass silhouette → ornate brass hourglass on the sea · sand grains become four-point gold stars ascending | `water_drop_to_hourglass_sequence.jpeg` |
| **3 · Purpose** | Camera lifts into cosmic void · brightest star blooms into a cotton boll · fibers → thread spool → floating loom warp/weft → dark cashmere drape with a central gold cotton emblem | `own_karma_cotton_storyboard.jpeg` |
| **4 · Legacy** | Cloth dissolves edge-inward into rising gold embers · emblem unweaves · embers condense · one single ember pulses in pitch black (hand-off to Act V) | — |

## Palette (locked for all four clips)

| Role | Hex |
| --- | --- |
| Void / background | `#000000` |
| Deep amber | `#3a1e00` |
| Warm gold body | `#C9A55A` / `#d99a24` |
| Highlight core | `#fff4c2` |
| Fabric neutral | `#F4F0E8` (cotton) / `#D9C496` (aged linen) |

No cool tones. No cyan. No blue tint. No green. If a shot drifts cool, re-generate.

---

## Render Workflow

Follow this order every time. Do not skip step 3 — Flow's per-clip audio breaks continuity.

1. **Clip 1 · Silence** — the reference seascape is 3:2, so **crop it to 16:9 first** (`crop=2528:1422:0:132`) and save as `_documents/images/silence_seed_seascape.jpeg`; otherwise Flow picks the crop for you and the horizon moves. Then use **Frames to Video** with that same cropped image in **both** the first-frame and last-frame slots — anchoring both ends is what stops the background drifting. Because the seed contains no droplet, Veo cannot render one stationary. Render **8 s** (Veo 3 Quality's native length, one pass — never an extension) at 16:9 on a locked tripod frame, on the **Quality** tier, not `Omni Flash`. Confirm the export is **exactly 16:9 with SAR 1:1** via `ffprobe` rather than trusting Flow's label. Export as `room1_silence.mp4`, **muted** — the drop and settling water go on in post. Full detail in [ACT4_V2_ROOM1_SILENCE.md](ACT4_V2_ROOM1_SILENCE.md).
2. **Extract Clip 1's last frame**:
   ```powershell
   ffmpeg -sseof -0.05 -i public/videos/room1_silence.mp4 -frames:v 1 room1_last.png
   ```
3. **Clip 2 · Time** — Image-to-Video seeded with Room 1's **cleaned** last frame (Room 1's saved frame has pillarbox bars and a `Veo` watermark in them; strip both first). Four-stage morph from `_documents/images/water_drop_to_hourglass_sequence.jpeg` — rebound spike → pinched-waist X of flung water → hourglass of clear water → solid ornate bronze hourglass — then sand streams, each landing grain lifts off as a four-pointed gold star, ~20 stars fill the upper frame, and the slowest possible tilt opens black void along the top edge. Render **8 s** on the **Quality** tier → `room2_time.mp4`. Mute. Panel-by-panel breakdown, measured hourglass spec and beat timings in [ACT4_V2_ROOM2_TIME.md](ACT4_V2_ROOM2_TIME.md).
4. Extract Clip 2's last frame → `room2_last.png`.
5. **Clip 3 · Purpose** — Image-to-Video seeded with `room2_last.png`; optional style reference `_documents/images/own_karma_cotton_storyboard.jpeg`. Render → `room3_purpose.mp4`. Mute.
6. Extract Clip 3's last frame → `room3_last.png`.
7. **Clip 4 · Legacy** — Image-to-Video seeded with `room3_last.png`. Render → `room4_legacy.mp4`. Mute.

## Per-Clip Prompt Files
- [ACT4_V2_ROOM1_SILENCE.md](ACT4_V2_ROOM1_SILENCE.md)
- [ACT4_V2_ROOM2_TIME.md](ACT4_V2_ROOM2_TIME.md)
- [ACT4_V2_ROOM3_PURPOSE.md](ACT4_V2_ROOM3_PURPOSE.md)
- [ACT4_V2_ROOM4_LEGACY.md](ACT4_V2_ROOM4_LEGACY.md)

---

## Audio Bed (composited in post, single continuous 32 s track)

Because Google Flow generates fresh audio per clip, a 4-clip render will produce four unrelated soundscapes with an audible cut at every clip boundary. **Render all four clips muted** — including Clip 1. Veo's droplet impact never converged on an accurate sound across three rounds of prompt work, so Room 1's drop and settling water are laid in post like everything else; see [ACT4_V2_ROOM1_SILENCE.md](ACT4_V2_ROOM1_SILENCE.md) § Audio Strategy for how to get a drop that sounds right.

**The act now opens on true silence.** Nothing is heard until the droplet lands at ~3 s — no sea ambience, no room tone, no drone. That three-second void is what makes the drop land and is the point of a room called *Silence*, so the sub-bass and room tone start **after** the impact rather than at 0 s.

**Cues rescaled for 32 s.** Clip boundaries are now **8 / 16 / 24 s**: Room 1 = 0–8, Room 2 = 8–16, Room 3 = 16–24, Room 4 = 24–32. Let each layer run *across* the picture cuts rather than ending on them — audio crossing a cut is what makes four clips read as one shot.

| Time | Layer |
| --- | --- |
| 0 – 3 s | **Absolute silence.** No ambience, no room tone, no drone, no sea. |
| 3.0 s | Water-drop impact SFX — Room 1 splash, the first sound of the act. **Deep and heavy, not a thin high plink** (the droplet is large and falling far); decays to nothing inside ~300 ms; no bell, no chime, no metallic ring. |
| 3 – 8 s | Quiet close ripple/settling-water sound at ~−34 dB, decaying toward silence. **No sea ambience, no waves, no lapping.** |
| 3 – 32 s | Deep sub-bass drone, ~40 Hz, −24 dB, fading up from the impact. |
| 3 – 32 s | Room tone at −60 dB (rising to −54 dB in the last 4 s). |
| 8 – 12 s | Room 2 water: low inverted whoosh on the rise, then slow-motion splash, then a glass-shimmer swell as the form resolves. |
| 12 – 13.2 s | Soft low woody settle as the hourglass becomes solid. No impact hit, no boom. |
| 13.2 – 17 s | Fine dry sand hiss plus **sparse** metallic ticks on grain impacts — one every 0.4–0.8 s, not a rhythm. Carries across the 16 s cut into Room 3. |
| 18 – 24 s | Slow warm-cello swell rising into the fabric unfurl — Room 3 weave. |
| 24 – 28 s | Sub-bass fades out. |
| 30 s | Single soft warm bell ring on the ember lock-in — Room 4. |
| 30 – 32 s | Absolute silence except room tone. |

---

## Cross-Clip Continuity Checklist
- [ ] Every clip's **first frame** is pixel-identical to the previous clip's exported last frame.
- [ ] Every clip's **last frame** is holdable (no motion blur, no drift) at t = 10.0 s.
- [ ] Palette locked across all four clips — black + warm gold spectrum only.
- [ ] Clips 2–4 exported **muted**; Clip 1 either carries a clean gentle sea bed + droplet plop or is muted too.
- [ ] End frame of Clip 4 is a pure pitch-black void with a single warm-gold ember at exact frame center — this is the hand-off seed for Act V.
- [ ] No baked text, wordmarks, or logos in any clip. All Act IV copy is rendered by `Act04Discovery.tsx` as HTML overlay.

## Wire-Up
Once the four `.mp4` files are in `public/videos/`, [src/components/sections/Act04Discovery.tsx](../../src/components/sections/Act04Discovery.tsx) already references them by name (`/videos/room{1..4}_{silence|time|purpose|legacy}.mp4`) — no code change needed. Snap-scroll autoplay and letter-by-letter GSAP typography handle the rest.
