# Loader 01 — The Karma Wheel

## Concept

A sacred geometric wheel that slowly assembles itself from golden line segments. Each segment draws in sequence, forming an intricate mandala-like pattern that represents the cyclical nature of karma.

## Visual Description

- **Background**: Pure deep black (`#020617`), no gradients — absolute void
- **Center Element**: A golden wheel composed of 12 radial spokes emerging from a central dot
- **Assembly Animation**: Each spoke draws outward from the center like a compass needle, one by one in clockwise order
- **Outer Ring**: After all spokes complete, a thin golden circle traces around the perimeter connecting all endpoints
- **Inner Geometry**: Sacred triangles form between spokes, creating a Sri Yantra-inspired pattern
- **Pulsing Core**: The center dot breathes — expanding and contracting with a soft amber glow

## Typography

- Below the wheel: `OWN KARMA` in spaced uppercase tracking (`letter-spacing: 0.3em`)
- Beneath that: `ENTER YOUR KARMA` fades in after the wheel completes its first assembly
- Font: Minimal sans-serif (e.g., Inter or Outfit), weight 300

## Animation Timeline

1. **0–0.5s**: Black void, single gold dot appears at center
2. **0.5–2.5s**: 12 spokes draw outward sequentially (each ~160ms)
3. **2.5–3.5s**: Outer circle traces around the perimeter
4. **3.5–4.5s**: Inner sacred geometry fills in with faint gold lines (opacity 0.2)
5. **4.5s+**: Continuous slow rotation (8s per revolution), center dot pulses
6. **On Load Complete**: Wheel scales up smoothly and fades into the main experience

## Motion Principle

Stillness → Precise Construction → Meditative Rotation. The assembly feels deliberate and intentional — each line has purpose, mirroring the brand philosophy that "every symbol carries meaning."

## Progress Indicator

A thin arc traces the outer ring proportional to loading progress (0–100%), so the circle completion IS the progress bar.
