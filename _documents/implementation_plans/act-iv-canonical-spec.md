# Act IV — "The Discovery" (canonical spec, updated & locked 2026-07-28)

## Source reconciliation

From `_documents/OWN_KARMA_Landing_Page_Experience_Spec.md` (ACT IV — THE DISCOVERY):

> Instead of an "About" section...  
> The corridor opens into four enormous rooms:  
> **ROOM ONE — Silence**: Still black water. One gold ripple. *"Every creation begins in silence."*  
> **ROOM TWO — Time**: An hourglass. Sand turns into stars. *"Time never creates character. Choices do."*  
> **ROOM THREE — Purpose**: Cotton fiber. Thread. Fabric. Garment. One continuous transformation. *"We don't make clothing. We preserve intention."*  
> **ROOM FOUR — Legacy**: The garment slowly dissolves. Only light remains. *"Everything fades. Meaning remains."*

---

## Locked decisions & Technical Director Refinements

- **UX Architecture ("The Spatial Theater")**: In-place metamorphosis. The camera does NOT slide horizontally. It stays in the center of the void with gentle orbital breathing sway (`camera.position.x/y` sinusoidal drift). Scroll progress (`0.0 → 1.0`) acts as a "Timeline Master" that morphs, shatters, and reconstructs the 4 room environments in-place within the exact same physical space.
- **Performance Architecture (Strict Render-Loop Culling)**: Only the currently active room scene evaluates shaders and mounts to the WebGL scene graph. As scroll offset crosses room thresholds (`0.25`, `0.50`, `0.75`), previous room assets unmount to free VRAM for the next room.
- **The 4 Room Shaders & Mechanics**:
  1. **Room 1 — Silence (Obsidian Water Optics)**:
     - Floor plane using Drei `<MeshReflectorMaterial>` (`mixBlur={0.8}`, `mirror={0.5}`, `color="#050505"`) with interactive concentric gold ripple wave displacements on cursor move / scroll input.
     - Glowing SDF 3D typography (*"Every creation begins in silence."*) hovering over the water, distorting in reflections.
  2. **Room 2 — Time (Refractive Crystal Hourglass & Star Sand)**:
     - Hourglass: Heavy crystal refraction using Drei `<MeshTransmissionMaterial>` (`transmission={1.0}`, `thickness={0.8}`, `ior={1.5}`, `roughness={0.05}`), bending background darkness and text through crystal glass.
     - Sand: 10,000 particle sand grains flowing through the glass neck and bursting upward as a swirling galaxy of gold star points (`AdditiveBlending`).
  3. **Room 3 — Purpose (Vector Flow Field Silk Weaver)**:
     - Vector particle swarm (20,000 points). Begins in chaotic Curl Noise (raw nature), then magnetically swarms and snaps onto an invisible 3D garment mesh, forming a glowing silhouette out of pure light as scroll advances.
  4. **Room 4 — Legacy (Emissive Ash Disintegration)**:
     - 3D garment silhouette with edge-burn dissolve threshold (`#E8C87A` white-hot emission). Vertices detach at the burn line, convert to glowing ash embers (`gl_Point`), and drift upward into space.
- **The Transition ("The Single Ember" Unbroken Shot)**:
  - As Room 4 burns into glowing ash, all particles drift away and fade into darkness **except for one single golden point of light** dead center in the void.
  - Holds in absolute silence for 1.5 seconds, then fires `onComplete()` to hand off to Act V. That single ember seamlessly becomes the starting point of the golden thread in Act V!

---

## Room Timeline & Progress Map (Scroll Offset 0.0 → 1.0)

| Room Phase | Scroll Offset | Active Metamorphosis Beat | Typography Fragment |
| ---------- | ------------- | ------------------------- | ------------------- |
| **Room 1: Silence** | `0.00 – 0.25` | Heavy obsidian reflective water floor with expanding gold ripple wave. | *"Every creation begins in silence."* |
| **Room 2: Time** | `0.25 – 0.50` | Refractive crystal hourglass bending dark space. Flowing star sand galaxy. | *"Time never creates character. Choices do."* |
| **Room 3: Purpose** | `0.50 – 0.75` | Vector flow field swarm snapping from chaotic raw fiber into glowing garment silhouette. | *"We don't make clothing. We preserve intention."* |
| **Room 4: Legacy** | `0.75 – 0.95` | White-hot edge burn disintegrates garment into floating gold ash. | *"Everything fades. Meaning remains."* |
| **The Single Ember** | `0.95 – 1.00` | All embers fade except ONE single golden ember dead center in black void. Holds 1.5s → fires `onComplete()`. | *(Silence)* |

---

## What Act IV is NOT

- Not a horizontal camera carousel slider.
- Not a low-quality wireframe hourglass or flat 2D screensaver ripple.
- Not hard HTML screen fade-outs — seamless transition via "The Single Ember" unbroken shot.

---

## Tech to use

- `@react-three/fiber` + `three` (WebGL canvas).
- `@react-three/drei` (`ScrollControls`, `useScroll`, `MeshReflectorMaterial`, `MeshTransmissionMaterial`, `Text`).
- `@react-three/postprocessing` (`EffectComposer`, `Noise`).

---

## Edge cases locked

- **Reduced Motion**: Replaces particle flow fields with a simplified step-wise transition through static luxury room scenes.
- **Mobile VRAM Protection**: Strict room unmounting ensures low memory consumption on older mobile GPUs.
