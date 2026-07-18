# Loader 02 — The Void Particle

## Concept

Inspired by Section 01 "THE VOID" from the creative brief. A single golden particle emerges from absolute darkness, drifts through the void leaving a faint trail, then multiplies into a constellation that forms the OWN KARMA wordmark.

## Visual Description

- **Background**: Absolute black — no gradients, no noise, pure emptiness
- **Birth**: A single 2px gold dot fades in at dead center with a soft radial glow
- **Drift Phase**: The particle begins a slow, organic drift path (Perlin noise movement)
- **Trail**: Leaves behind a fading golden line trail (opacity decays over 1.5s)
- **Multiplication**: At the halfway mark, the particle splits into 2, then 4, then 8, then 16
- **Convergence**: All particles accelerate toward their final positions — forming the letters **O W N K A R M A**
- **Resolution**: Letters solidify from particle clusters into clean typography

## Typography

- The particles themselves ARE the text — they converge to form letter shapes
- Final resolution: crisp `OWN KARMA` in weight 200, size 2rem, tracking 0.4em
- Below: `LOADING YOUR UNIVERSE` in 8px mono, slate-500

## Animation Timeline

1. **0–1s**: Pure black. Single dot fades in at center (opacity 0 → 1)
2. **1–3s**: Particle drifts with Perlin noise, leaving golden trail
3. **3–4s**: Particle splits recursively (1 → 2 → 4 → 8 → 16 → 32)
4. **4–6s**: All particles scatter briefly, then begin converging to letter positions
5. **6–7s**: Particles settle into letter forms, blur resolves to crisp text
6. **On Load Complete**: Text glows once (golden pulse), then the screen lifts upward

## Motion Principle

Emptiness → Single Origin → Multiplication → Order from Chaos. Mirrors the brand philosophy: "Every piece begins with an idea."

## Progress Indicator

The number of active particles scales with loading progress. At 10% load = 3 particles, at 50% = 16, at 100% = all 32+ converging into the wordmark.
