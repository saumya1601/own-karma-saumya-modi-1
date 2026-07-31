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
    vec2 p = vUv - vec2(0.5);
    float d = length(p);
    if (d > 0.5) discard;

    // 4-corner diamond flare rays
    float absX = abs(p.x);
    float absY = abs(p.y);
    float diamondRays = max(
      smoothstep(0.48, 0.0, absX) * smoothstep(0.06, 0.0, absY),
      smoothstep(0.48, 0.0, absY) * smoothstep(0.06, 0.0, absX)
    ) * (1.0 - uReducedMotion);

    // Distinct, rhythmic star blinking / twinkling pulse (frequency 6.5 rad/s)
    float blink = 0.55 + 0.45 * (1.0 - uReducedMotion) * (sin(uTime * 6.5) * 0.6 + cos(uTime * 3.2) * 0.4);

    // Multi-stage radial falloff: intense white core -> warm gold -> corona halo
    float coreMask = smoothstep(0.14, 0.0, d);
    float innerGlow = smoothstep(0.35, 0.08, d);
    float outerAura = smoothstep(0.5, 0.2, d);

    vec3 color = mix(AURA_GLOW, GOLD_EDGE, smoothstep(0.5, 0.3, d));
    color = mix(color, GOLD_WARM, innerGlow);
    color = mix(color, WHITE_CORE, coreMask);

    float alpha = (outerAura + coreMask * 0.7 + diamondRays * 0.6) * uOpacity * blink;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

export const burstVertex = /* glsl */ `
  attribute vec3 aDirection;
  attribute float aScale;
  attribute float aRotation;

  uniform float uProgress;

  varying float vProgress;
  varying float vRotation;

  void main() {
    vProgress = uProgress;
    // Dynamic spin rotation as particles explode
    vRotation = aRotation + uProgress * 1.5;

    vec3 pos = position + aDirection * uProgress * 28.0;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Prominent 4-corner diamond star sizes (tapering gracefully from 36px -> 14px)
    gl_PointSize = mix(36.0 * aScale, 14.0 * aScale, uProgress);
    gl_Position = projectionMatrix * mv;
  }
`;

export const burstFragment = /* glsl */ `
  varying float vProgress;
  varying float vRotation;

  const vec3 CORE = vec3(1.000, 0.985, 0.920); // Hot radiant white-gold core
  const vec3 GOLD = vec3(0.960, 0.820, 0.420); // Bright 4-corner gold star
  const vec3 EDGE = vec3(0.780, 0.600, 0.220); // Rich golden star tips

  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);

    // Rotate coordinates for dynamic 4-corner star orientation
    float cosA = cos(vRotation);
    float sinA = sin(vRotation);
    vec2 rP = vec2(p.x * cosA - p.y * sinA, p.x * sinA + p.y * cosA);

    float absX = abs(rP.x);
    float absY = abs(rP.y);

    // 1. Sharp 4-corner diamond rhombus shape (|x| + |y| <= 0.44)
    float diamondDist = absX + absY;
    if (diamondDist > 0.48) discard;

    float diamondBody = smoothstep(0.46, 0.18, diamondDist);

    // 2. Sharp 4-corner cardinal star flares (extending along horizontal & vertical axes)
    float rayX = smoothstep(0.48, 0.0, absX) * smoothstep(0.08, 0.0, absY);
    float rayY = smoothstep(0.48, 0.0, absY) * smoothstep(0.08, 0.0, absX);
    float starSpikes = max(rayX, rayY);

    // 3. Combine 4-corner diamond silhouette with radiant spikes
    float starShape = max(diamondBody * 0.85, starSpikes);
    if (starShape < 0.01) discard;

    // 4. White-hot diamond center core
    float coreDist = length(rP);
    float core = smoothstep(0.12, 0.0, coreDist);

    vec3 color = mix(EDGE, GOLD, diamondBody);
    color = mix(color, CORE, core);

    // Smooth lifespan dissipation
    float life = 1.0 - smoothstep(0.45, 1.0, vProgress);
    float alpha = starShape * life;

    gl_FragColor = vec4(color * alpha, alpha);
  }
`;
