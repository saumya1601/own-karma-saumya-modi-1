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
    // Slow layered breath — ~0.16 Hz (about 10 breaths/min, meditative rest).
    // Spec: "It breathes slowly."
    float pulse = sin(uTime * 1.0) * 0.08 + sin(uTime * 0.45) * 0.04;
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

  // OWN KARMA Luxury Palette — refined for crystalline clarity
  const vec3 WHITE_CORE = vec3(1.000, 0.985, 0.920); // White-hot pinprick core
  const vec3 GOLD_WARM  = vec3(0.980, 0.850, 0.480); // Luminous gold body
  const vec3 GOLD_EDGE  = vec3(0.850, 0.700, 0.320); // Antique gold rim

  void main() {
    vec2 p = vUv - vec2(0.5);
    float d = length(p);
    if (d > 0.5) discard;

    // Needle-thin 4-corner diamond rays
    float absX = abs(p.x);
    float absY = abs(p.y);
    float diamondRays = max(
      smoothstep(0.42, 0.0, absX) * smoothstep(0.025, 0.0, absY),
      smoothstep(0.42, 0.0, absY) * smoothstep(0.025, 0.0, absX)
    ) * (1.0 - uReducedMotion);

    // Tight jewel-like structure:
    //   coreMask  — hot white pinprick   (0     .. 0.06)
    //   innerGlow — punchy gold body     (0     .. 0.16, pow-shaped for sharp falloff)
    //   ringHalo  — thin luminous ring   (0.14  .. 0.28) that dies fast
    float coreMask  = smoothstep(0.06, 0.0, d);
    float innerGlow = pow(smoothstep(0.16, 0.0, d), 1.8);
    float ringHalo  = smoothstep(0.28, 0.14, d) * 0.35;

    vec3 color = mix(GOLD_EDGE, GOLD_WARM, innerGlow);
    color = mix(color, WHITE_CORE, coreMask);

    // Steady luminance — the slow breath (vertex shader scale) is the only
    // motion. Spec: "Not glowing aggressively. Almost alive."
    float alpha = (innerGlow + ringHalo + coreMask * 0.9 + diamondRays * 0.5) * uOpacity;
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

    // Travel distance chosen so an average-speed spark reaches the edge of
    // the view frustum around progress=0.85 — fast sparks fly off screen,
    // slow ones stay in view to be seen dimming during the fade.
    vec3 pos = position + aDirection * uProgress * 16.0;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Microscopic stars — spec: "thousands of microscopic golden stars."
    // Small at launch, tapering to sub-pixel sparks as they fly outward.
    gl_PointSize = mix(11.0 * aScale, 2.5 * aScale, uProgress);
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

    // Smooth lifespan dissipation — stars hold brightness for most of the
    // arc, then fade in the last third so the explosion is fully readable.
    float life = 1.0 - smoothstep(0.6, 1.0, vProgress);
    float alpha = starShape * life;

    gl_FragColor = vec4(color * alpha, alpha);
  }
`;
