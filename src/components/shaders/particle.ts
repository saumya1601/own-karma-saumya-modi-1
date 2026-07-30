/**
 * Shaders for Act I — "The Void"
 *
 * Implements:
 * 1. Central Gold Star: Multi-frequency breathing, 6.5 rad/s blinking, and radiant golden aura.
 * 2. Burst Shatter Particles: Razor-sharp, pin-point crisp golden sparks & star shards.
 */

export const particleVertex = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uReducedMotion;

  void main() {
    vUv = uv;
    // Rhythmic breathing scale expansion (pulsing star)
    float pulse = sin(uTime * 4.5) * 0.15 + sin(uTime * 2.0) * 0.08;
    float scale = 1.0 + (1.0 - uReducedMotion) * pulse;
    vec3 pos = position * scale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const particleFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uReducedMotion;

  // OWN KARMA Luxury Palette
  const vec3 WHITE_CORE = vec3(1.000, 0.980, 0.900); // White-hot radiant core
  const vec3 GOLD_WARM  = vec3(0.950, 0.820, 0.450); // Luminous gold
  const vec3 GOLD_EDGE  = vec3(0.788, 0.635, 0.294); // Antique gold
  const vec3 AURA_GLOW  = vec3(0.600, 0.450, 0.150); // Deep golden corona aura

  void main() {
    vec2 center = vec2(0.5);
    float d = distance(vUv, center);
    if (d > 0.5) discard;

    // Distinct, rhythmic star blinking / twinkling pulse (frequency 6.5 rad/s)
    float blink = 0.55 + 0.45 * (1.0 - uReducedMotion) * (sin(uTime * 6.5) * 0.6 + cos(uTime * 3.2) * 0.4);

    // Multi-stage radial falloff: intense white core -> warm gold -> corona halo
    float coreMask = smoothstep(0.14, 0.0, d);
    float innerGlow = smoothstep(0.35, 0.08, d);
    float outerAura = smoothstep(0.5, 0.2, d);

    vec3 color = mix(AURA_GLOW, GOLD_EDGE, smoothstep(0.5, 0.3, d));
    color = mix(color, GOLD_WARM, innerGlow);
    color = mix(color, WHITE_CORE, coreMask);

    // Shimmering micro-rays (subtle angular light flare)
    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
    float rays = sin(angle * 6.0 + uTime * 4.0) * 0.1 * (1.0 - uReducedMotion);

    float alpha = (outerAura + coreMask * 0.7 + rays * outerAura) * uOpacity * blink;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

export const burstVertex = /* glsl */ `
  attribute vec3 aDirection;
  uniform float uProgress;
  varying float vProgress;

  void main() {
    vProgress = uProgress;
    vec3 pos = position + aDirection * uProgress * 28.0;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    // Sharp star size (starts at 18.0px, tapers down to 5.0px as it bursts)
    gl_PointSize = mix(18.0, 5.0, uProgress);
    gl_Position = projectionMatrix * mv;
  }
`;

export const burstFragment = /* glsl */ `
  varying float vProgress;

  const vec3 CORE = vec3(1.000, 0.980, 0.900); // White-hot sharp spark core
  const vec3 GOLD = vec3(0.950, 0.820, 0.450); // Crisp gold spark

  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float absX = abs(p.x);
    float absY = abs(p.y);

    // Sharp 4-point star astroid curve equation: |x|^0.5 + |y|^0.5 < r^0.5
    float starDist = sqrt(absX) + sqrt(absY);
    float threshold = sqrt(0.48);

    if (starDist > threshold) discard;

    // Crisp star edge + core brightness
    float edge = smoothstep(threshold, threshold - 0.15, starDist);
    float core = smoothstep(0.18, 0.0, length(p));
    vec3 color = mix(GOLD, CORE, core);
    float life = 1.0 - smoothstep(0.5, 1.0, vProgress);
    float alpha = edge * life;

    gl_FragColor = vec4(color * alpha, alpha);
  }
`;
