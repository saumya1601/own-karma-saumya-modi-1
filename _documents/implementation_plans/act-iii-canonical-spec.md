# Act III — "The Corridor" (canonical spec, updated & locked 2026-07-28)

## Source reconciliation

From `_documents/OWN_KARMA_Landing_Page_Experience_Spec.md` (ACT III — THE CORRIDOR):

> Now the visitor begins moving.  
> Not scrolling through a webpage — **walking**.  
> The page moves like a camera dolly in a slow cinematic hallway.  
> Walls are made from floating memories: Fabric, Water, Stone, Stars, Ancient geometric symbols, Dust, Fragments of handwritten philosophy.  
> Everything moves slowly, almost dreamlike. No products. Only atmosphere.

---

## Locked decisions & Technical Director Refinements

- **UX Architecture**: Uses `@react-three/drei`'s `<ScrollControls pages={5} damping={0.25}>`. Eliminates custom JS wheel/touch listeners, enabling native browser trackpad momentum, mobile rubber-banding, and silky smooth camera `damping={0.25}` physics out-of-the-box.
- **Camera Physics ("Steadicam Sway")**:
  - Z-axis camera track moves from `Z = 0` to `Z = -95` driven by `scroll.offset`.
  - Procedural human breath sway applied continuously in `useFrame`:
    `camera.position.y = Math.sin(t * 0.5) * 0.1; camera.position.x = Math.cos(t * 0.3) * 0.05;`
- **Lighting Alchemy**: Ambient light set to ultra-low (`0.02`), zero camera headlamps. Stationary localized `PointLight` sources placed near memory objects (fabric, stone, geometry) cast dynamic, stretching shadows as the camera glides past.
- **Material Craft**:
  - **Water (`Z = -50`)**: Drei's `<MeshReflectorMaterial>` with `mixBlur={0.8}`, `resolution={512}`, `mirror={0.5}`, reflecting glowing gold particles, text light, and stone pillars on the wet dark floor.
  - **Silk Fabric (`Z = -18`)**: `MeshPhysicalMaterial` with `transmission={0.35}`, `roughness={0.3}`, `thickness={0.5}`, and `sheen={1.0}` (`sheenColor="#C9A55A"`), scattering light *through* translucent silk.
- **SDF 3D Typography**: Rendered inside WebGL context using Drei `<Text>` (Signed Distance Field fonts) with `blending={THREE.AdditiveBlending}` and `color="#F4F0E8"`. Typography is razor-sharp at any camera distance and casts real light reflections on the water plane.
- **Anti-Color Banding**: Exponential fog (`THREE.FogExp2` density `0.025`) paired with `@react-three/postprocessing` `<EffectComposer>` + `<Noise opacity={0.035} />` to add subtle film grain that eliminates gradient banding over pure black.
- **"The Fog Swallow" 3D Transition**: At `scroll.offset >= 0.94`, scroll is locked and the 3D exponential fog's `density` animates smoothly from `0.025` to `0.25`. Deep 3D blackness physically engulfs stars, text, and camera before firing `onComplete()`.

---

## Progress Map (Scroll Offset 0.0 → 1.0)

| Progress Range | Camera Z | Scene Feature / Visual Beat | Material & Lighting Physics |
| -------------- | -------- | --------------------------- | --------------------------- |
| `0.00 – 0.10`  | `0 → -10` | Entrance from black void. Fog clears slightly. First gold star particles drift past camera. | Ultra-low ambient light `0.02`, film grain noise active. |
| `0.10 – 0.30`  | `-10 → -30` | Translucent silk mesh on left. First philosophy fragment (*"Every creation begins in silence..."*). | Silk sheen light scattering (`transmission: 0.35`), SDF 3D text. |
| `0.30 – 0.50`  | `-30 → -50` | Reflective water floor plane below. Monolithic stone pillars frame walls. | `MeshReflectorMaterial` active reflections on wet floor. |
| `0.50 – 0.70`  | `-50 → -70` | Second philosophy fragment (*"What remains when status disappears?"*). Golden sacred geometry wireframe rotating on right. | Dual counter-rotating wireframe with localized gold point light. |
| `0.70 – 0.90`  | `-70 → -90` | High-density gold dust field. Final philosophy fragment (*"Everything fades. Meaning remains."*). | Additive particle accumulation & 3D text reflection. |
| `0.90 – 1.00`  | `-90 → -95` | "The Fog Swallow" transition. Fog density thickens to `0.25`, engulfing camera in 3D blackness. | `onComplete()` callback fires to hand off to Act IV. |

---

## What Act III is NOT

- Not a flat document-scroll HTML page.
- Not robotic single-axis camera motion — procedural Steadicam sway adds human breath drift.
- Not HTML text overlays — Signed Distance Field (SDF) 3D text rendered directly inside WebGL context.

---

## Tech to use

- `@react-three/fiber` + `three` (WebGL canvas).
- `@react-three/drei` (`ScrollControls`, `useScroll`, `MeshReflectorMaterial`, `Text`).
- `@react-three/postprocessing` (`EffectComposer`, `Noise`).

---

## Edge cases locked

- **Reduced Motion (`prefers-reduced-motion: reduce`)**: Disables camera sway and film grain; simplifies Z-dolly.
- **Mobile Touch**: Drei `<ScrollControls>` provides responsive touch drag rubber-banding out-of-the-box.
- **Tab Blur**: R3F render loop pauses cleanly when tab is hidden, resuming on return.
