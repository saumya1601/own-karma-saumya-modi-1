# Act I — "The Void" (canonical spec, updated & locked 2026-07-28)

## Source reconciliation

4 docs describe Act I differently. User picked the pure Landing Page Experience Spec version:
- `_documents/OWN_KARMA_Landing_Page_Experience_Spec.md` (ACT I) — CANONICAL
- Creative Brief 01 THE VOID — REJECTED (no text overlay in Act I)
- Reveal Story Beat 01 — REJECTED (grain of sand, non-interactive)
- Dot-to-Supernova storyboard SHOT 1 — REJECTED (auto pinpoint bloom)

---

## Locked decisions & Technical Director Refinements

- **Gold element**: single glowing particle that breathes and follows cursor.
- **Click behavior**: particle bursts into thousands of stars → fade to black → Act II text appears.
- **Text in Act I**: NONE.
- **Audio**: silent by default; small mute/unmute icon in corner.
- **Palette**: #000000 black, #C9A24B gold, #E8C87A gold highlight (from Reveal Story).
- **Camera Engine**: `PerspectiveCamera` with narrow field-of-view (`fov: 20`, `position: [0, 0, 15]`) for true 3D spatial depth scaling during the supernova burst.
- **Blending**: `THREE.AdditiveBlending` with `depthWrite={false}` so overlapping gold particles mathematically add RGB light values into a white-hot bloom core without post-processing overhead.
- **Pointer Math**: R3F `useFrame` reading `state.pointer` and `THREE.MathUtils.damp` for 100% frame-rate independent drift (60Hz, 120Hz, 240Hz parity).
- **UI Pacing**: Mute icon gently fades in at **1.0s** to reassure the user that the UI is live, followed by the gold particle fade-in at **3.0s**.
- **Event Isolation**: `e.stopPropagation()` on all UI buttons to prevent clicks on controls from triggering the burst prematurely.

---

## Timeline (exact)

- **0.0–1.0s**: pure black.
- **1.0s**: subtle mute button fades in at corner (reassures subconscious load confirmation).
- **3.0s**: gold particle fades in at center, begins breathing (subtle scale/opacity pulse, ~4s period).
- **3.0s+**: cursor movement → particle lerps toward cursor position via frame-rate independent `MathUtils.damp`.
- **On click**: particle explodes into thousands of microscopic golden star points.
- **After burst**: fade to black → hand off to Act II.

---

## What Act I is NOT

- Not the pre-rendered dot-to-spiral video (that's later).
- Not the wordmark reveal (that's Act V).
- Not any text overlay (that starts in Act II).

---

## Assets required for Act I

- No 3D models, no video files.
- No audio files (silent by default).
- No custom fonts.
- Just the mute/unmute SVG icon.

---

## Tech to use

- `@react-three/fiber` + `three` (WebGL canvas).
- Custom shaders for the particle (radial gradient, soft bloom).
- `THREE.AdditiveBlending` for light accumulation.
- GSAP for click burst animation and fade-to-black.
- `usePreferences` hook with SSR hydration safety.

---

## Edge cases locked

- **OS cursor**: stays visible; particle drifts toward it independently.
- **No-click behavior**: wait forever; no auto-progression.
- **Revisit**: show Act I every single visit (ritual).
- **SSR**: server-render pure black background + particle placeholder; Canvas hydrates over it (zero white flash).
- **Mobile (pointer: coarse)**: particle breathes at center, tap-to-burst, no cursor-follow.
- **Reduced motion (prefers-reduced-motion: reduce)**: static particle (no breathing), tap/click to advance.

---

## Implementation Details

### Step 1 — Scaffold fixes
Verify: `npm run dev` shows pure black page, no white flash.

### Step 2 — `src/lib/usePreferences.ts`
SSR-safe hook returning `{ isCoarsePointer: false, prefersReducedMotion: false }` baseline initially, updating safely post-hydration inside `useEffect`.

### Step 3 — `src/lib/useParticleFollow.ts`
R3F `useFrame` hook using `state.pointer` and `THREE.MathUtils.damp` for frame-rate independent lerping. Zero `window` event listeners.

### Step 4 — `src/components/3d/GoldParticle.tsx`
R3F component with `<planeGeometry>` and `<shaderMaterial>` using `THREE.AdditiveBlending` and `depthWrite={false}`.

### Step 5 — `src/components/3d/BurstParticles.tsx`
`<points>` geometry with `BufferGeometry` and `THREE.AdditiveBlending` for true camera-facing billboard points and light-additive bloom.

### Step 6 — `src/components/sections/ActVoid.tsx`
Client component wrapping `<Canvas camera={{ fov: 20, position: [0, 0, 15] }}>`, 1.0s UI fade timer, 3.0s particle reveal, isolated click propagation on buttons, and GSAP burst timeline.
