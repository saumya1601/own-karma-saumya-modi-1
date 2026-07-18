"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";

interface LoadingVoidParticleProps {
  onComplete?: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

// Logical "world" space where particle math lives. On render, world coords
// are mapped onto CSS pixels with a uniform scale so the wordmark is always
// centered and legible on any viewport size.
const WORLD_W = 900;
const WORLD_H = 220;
const WORLD_CX = WORLD_W / 2;
const WORLD_CY = WORLD_H / 2;

// Offscreen sampling canvas that rasterizes "OWN KARMA" for target extraction
const TEXT_CANVAS_W = 900;
const TEXT_CANVAS_H = 160;
const TEXT_Y_OFFSET = (WORLD_H - TEXT_CANVAS_H) / 2;

// High particle count → dense, unambiguously readable letter shapes.
const PARTICLE_COUNT = 900;

// Animation phase boundaries during load (progress %)
const PHASE = {
  originStart: 3,
  originEnd: 15,
  emergeEnd: 42,
  driftEnd: 72,
  convergeEnd: 96,
} as const;

// Total exit choreography length in seconds — used to schedule onComplete.
// Long enough for the shatter to feel deliberate and weighty rather than snappy.
const EXIT_DURATION = 3.4;

/* -------------------------------------------------------------------------- */
/*  Types & helpers                                                           */
/* -------------------------------------------------------------------------- */

interface ParticleSeed {
  driftAngle: number;
  driftRadius: number;
  driftSpeed: number;
  emergenceOffset: number;
  wobbleFreqX: number;
  wobbleFreqY: number;
  wobbleAmpX: number;
  wobbleAmpY: number;
  size: number;
  isGold: boolean;
  scatterJitter: number; // −0.5 → +0.5 lateral drift during exit scatter
  scatterBoost: number;  // 0.85 → 1.4 per-particle speed multiplier
}

const hashRand = (n: number) => {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function LoadingVoidParticle({ onComplete }: LoadingVoidParticleProps) {
  const [progressDisplay, setProgressDisplay] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Imperative refs — canvas draws off React state to hold a solid 60fps
  const progressRef = useRef(0);
  const letterTargetsRef = useRef<{ x: number; y: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const isExitingRef = useRef(false);
  const exitProgressRef = useRef({ value: 0 });

  // DOM refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const uiRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* --------------------------- Particle seeds ---------------------------- */
  const seeds = useMemo<ParticleSeed[]>(() => {
    const arr: ParticleSeed[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r1 = hashRand(i * 12.9898 + 1);
      const r2 = hashRand(i * 78.233 + 2);
      const r3 = hashRand(i * 39.874 + 3);
      const r4 = hashRand(i * 17.541 + 4);
      const r5 = hashRand(i * 55.113 + 5);
      const r6 = hashRand(i * 91.7 + 13);
      const r7 = hashRand(i * 23.19 + 7);

      arr.push({
        driftAngle: r1 * Math.PI * 2,
        driftRadius: 60 + r2 * 280,
        driftSpeed: 0.35 + r3 * 0.85,
        emergenceOffset: r1,
        wobbleFreqX: 0.5 + r4 * 1.6,
        wobbleFreqY: 0.6 + r5 * 1.8,
        wobbleAmpX: 10 + r2 * 22,
        wobbleAmpY: 6 + r3 * 18,
        size: r5 > 0.78 ? 1.9 : r5 > 0.4 ? 1.35 : 0.95,
        isGold: r4 > 0.6,
        scatterJitter: (r6 - 0.5) * 0.4,
        scatterBoost: 0.85 + r7 * 0.55,
      });
    }
    return arr;
  }, []);

  /* -------------------- Sample "OWN KARMA" pixel targets ----------------- */
  useEffect(() => {
    let cancelled = false;

    const sample = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = TEXT_CANVAS_W;
      canvas.height = TEXT_CANVAS_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.font =
        "600 96px 'Geist', 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      const text = "OWN KARMA";
      const chars = text.split("");
      const fontSize = 96;
      const tracking = fontSize * 0.28;

      const widths = chars.map((c) => ctx.measureText(c).width);
      const totalW =
        widths.reduce((sum, w) => sum + w, 0) + tracking * (chars.length - 1);

      let cursorX = (TEXT_CANVAS_W - totalW) / 2;
      chars.forEach((char, i) => {
        ctx.fillText(char, cursorX, TEXT_CANVAS_H / 2);
        cursorX += widths[i] + tracking;
      });

      const image = ctx.getImageData(0, 0, TEXT_CANVAS_W, TEXT_CANVAS_H);
      const positions: { x: number; y: number }[] = [];
      const STEP = 3;
      for (let y = 0; y < TEXT_CANVAS_H; y += STEP) {
        for (let x = 0; x < TEXT_CANVAS_W; x += STEP) {
          const alpha = image.data[(y * TEXT_CANVAS_W + x) * 4 + 3];
          if (alpha > 90) positions.push({ x, y: y + TEXT_Y_OFFSET });
        }
      }

      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      const targets: { x: number; y: number }[] = [];
      if (positions.length >= PARTICLE_COUNT) {
        const stride = positions.length / PARTICLE_COUNT;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          targets.push(positions[Math.floor(i * stride)]);
        }
      } else if (positions.length > 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          targets.push(positions[i % positions.length]);
        }
      }

      if (!cancelled) letterTargetsRef.current = targets;
    };

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(sample).catch(sample);
    } else {
      sample();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  /* ------------------------ Progress simulator --------------------------- */
  useEffect(() => {
    const val = { value: 0 };
    const tween = gsap.to(val, {
      value: 100,
      duration: 8.5,
      ease: "power2.out",
      onUpdate: () => {
        progressRef.current = val.value;
        setProgressDisplay(Math.round(val.value));
      },
      onComplete: () => setIsLoaded(true),
    });

    return () => {
      tween.kill();
    };
  }, []);

  /* -------------- Per-particle position during LOAD phase ---------------- */
  const computeLoadPosition = (
    i: number,
    seed: ParticleSeed,
    target: { x: number; y: number } | undefined,
    p: number
  ) => {
    const isOrigin = i === 0;

    let emergeStart: number;
    let emergeEnd: number;
    if (isOrigin) {
      emergeStart = PHASE.originStart;
      emergeEnd = PHASE.originEnd;
    } else {
      const span = PHASE.emergeEnd - PHASE.originEnd;
      emergeStart = PHASE.originEnd + seed.emergenceOffset * span * 0.85;
      emergeEnd = emergeStart + span * 0.28;
    }

    if (p < emergeStart) {
      return { x: WORLD_CX, y: WORLD_CY, opacity: 0 };
    }

    const opacity = Math.min(1, (p - emergeStart) / (emergeEnd - emergeStart));

    const driftGrowth = Math.min(
      1,
      Math.max(0, (p - emergeStart) / (PHASE.driftEnd - emergeStart))
    );
    const orbitAngle = seed.driftAngle + p * 0.028 * seed.driftSpeed;
    const orbitR = seed.driftRadius * driftGrowth;
    const wobbleFactor =
      p < PHASE.driftEnd
        ? 1
        : Math.max(
          0,
          1 - (p - PHASE.driftEnd) / (PHASE.convergeEnd - PHASE.driftEnd)
        );

    const driftX =
      WORLD_CX +
      Math.cos(orbitAngle) * orbitR +
      Math.sin(p * 0.048 * seed.wobbleFreqX) * seed.wobbleAmpX * wobbleFactor;
    const driftY =
      WORLD_CY +
      Math.sin(orbitAngle * 1.3) * orbitR * 0.45 +
      Math.cos(p * 0.048 * seed.wobbleFreqY) * seed.wobbleAmpY * wobbleFactor;

    if (!target) return { x: driftX, y: driftY, opacity };
    if (p < PHASE.driftEnd) return { x: driftX, y: driftY, opacity };

    const convT = Math.min(
      1,
      (p - PHASE.driftEnd) / (PHASE.convergeEnd - PHASE.driftEnd)
    );
    const ease = 1 - Math.pow(1 - convT, 3);

    return {
      x: driftX + (target.x - driftX) * ease,
      y: driftY + (target.y - driftY) * ease,
      opacity,
    };
  };

  /* -------------- Per-particle position during EXIT scatter -------------- */
  // At exit trigger every particle is at (or near) its letter target. Fly it
  // outward along the radial from center, add slight perpendicular jitter and
  // per-particle speed variance for an organic dispersal, then fade to zero.
  const computeExitPosition = (
    i: number,
    seed: ParticleSeed,
    target: { x: number; y: number } | undefined,
    t: number // 0-1 exit progress
  ) => {
    const restX = target ? target.x : WORLD_CX;
    const restY = target ? target.y : WORLD_CY;

    const dx = restX - WORLD_CX;
    const dy = restY - WORLD_CY;
    const len = Math.sqrt(dx * dx + dy * dy);
    // Fallback direction for particles too close to center
    const dirX = len > 2 ? dx / len : Math.cos(seed.driftAngle);
    const dirY = len > 2 ? dy / len : Math.sin(seed.driftAngle);

    // Perpendicular jitter for organic scatter (not a perfect starburst)
    const perpX = -dirY;
    const perpY = dirX;

    // Speed varies per particle so the crowd doesn't move as a wall
    const baseSpeed = 720 + seed.driftRadius * 1.6;
    const speed = baseSpeed * seed.scatterBoost;
    const easeT = 1 - Math.pow(1 - t, 2.6);
    const displacement = speed * easeT;

    const x =
      restX +
      (dirX + perpX * seed.scatterJitter) * displacement;
    const y =
      restY +
      (dirY + perpY * seed.scatterJitter) * displacement * 0.92;

    // Fade — hold briefly then rapidly diminish
    const fadeStart = 0.18;
    const opacity =
      t < fadeStart
        ? 1
        : Math.max(0, 1 - Math.pow((t - fadeStart) / (1 - fadeStart), 1.5));

    return { x, y, opacity };
  };

  /* ------------------------- Canvas render loop -------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    resize();
    window.addEventListener("resize", resize);

    const drawParticle = (
      sx: number,
      sy: number,
      sr: number,
      opacity: number,
      isGold: boolean
    ) => {
      const baseColor = isGold ? "245, 158, 11" : "241, 245, 249";
      const glowR = sr * 3.2;
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
      glow.addColorStop(0, `rgba(${baseColor}, ${0.9 * opacity})`);
      glow.addColorStop(0.35, `rgba(${baseColor}, ${0.35 * opacity})`);
      glow.addColorStop(1, `rgba(${baseColor}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isGold
        ? `rgba(245, 158, 11, ${opacity})`
        : `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const paddingCssPx = 60;
      const cssW = w / dpr;
      const cssH = h / dpr;
      const scale =
        Math.min(
          (cssW - paddingCssPx * 2) / WORLD_W,
          (cssH - paddingCssPx * 2) / WORLD_H,
          1.2
        ) * dpr;
      const offsetX = w / 2 - WORLD_CX * scale;
      const offsetY = h / 2 - WORLD_CY * scale;

      const targets = letterTargetsRef.current;
      const isExit = isExitingRef.current;
      const exitT = exitProgressRef.current.value;
      const p = progressRef.current;

      if (isExit) {
        /* --------------------- Exit: scatter + burst --------------------- */
        // Central burst flash — a brief golden flare when the click lands
        const burstAlpha = Math.max(0, 1 - exitT / 0.24);
        if (burstAlpha > 0) {
          const cx = offsetX + WORLD_CX * scale;
          const cy = offsetY + WORLD_CY * scale;
          const burstR = 260 * scale * (1 + exitT * 3.2);
          const burstGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, burstR);
          burstGrad.addColorStop(0, `rgba(255, 230, 140, ${0.7 * burstAlpha})`);
          burstGrad.addColorStop(0.35, `rgba(245, 158, 11, ${0.25 * burstAlpha})`);
          burstGrad.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.fillStyle = burstGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, burstR, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalCompositeOperation = "lighter";
        // Slight size pulse while scattering — bloom then trim
        const sizePulse = 1 + Math.sin(exitT * Math.PI) * 0.45;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const seed = seeds[i];
          const target = targets[i];
          const state = computeExitPosition(i, seed, target, exitT);
          if (state.opacity <= 0.004) continue;

          const sx = offsetX + state.x * scale;
          const sy = offsetY + state.y * scale;
          const sr = seed.size * scale * 1.15 * sizePulse;
          drawParticle(sx, sy, sr, state.opacity, seed.isGold);
        }
        ctx.globalCompositeOperation = "source-over";
      } else {
        /* -------------------------- Load phases -------------------------- */
        // Origin halo (birth)
        const originHaloOpacity =
          p < PHASE.originStart
            ? 0
            : p > PHASE.emergeEnd
              ? 0
              : p <= PHASE.originEnd
                ? Math.min(1, (p - PHASE.originStart) / (PHASE.originEnd - PHASE.originStart))
                : Math.max(0, 1 - (p - PHASE.originEnd) / (PHASE.emergeEnd - PHASE.originEnd));

        if (originHaloOpacity > 0) {
          const cx = offsetX + WORLD_CX * scale;
          const cy = offsetY + WORLD_CY * scale;
          const r = 32 * scale;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          grad.addColorStop(0, `rgba(245, 158, 11, ${0.55 * originHaloOpacity})`);
          grad.addColorStop(0.6, `rgba(245, 158, 11, ${0.08 * originHaloOpacity})`);
          grad.addColorStop(1, "rgba(245, 158, 11, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Settle pulse (wordmark coalesced)
        const settlePulse =
          p < PHASE.convergeEnd
            ? 0
            : Math.sin(((p - PHASE.convergeEnd) / (100 - PHASE.convergeEnd)) * Math.PI) * 0.5;

        if (settlePulse > 0) {
          const cx = offsetX + WORLD_CX * scale;
          const cy = offsetY + WORLD_CY * scale;
          const rx = WORLD_W * 0.32 * scale;
          const ry = WORLD_H * 0.4 * scale;
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
          grad.addColorStop(0, `rgba(245, 158, 11, ${0.35 * settlePulse})`);
          grad.addColorStop(0.7, "rgba(245, 158, 11, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const seed = seeds[i];
          const target = targets[i];
          const state = computeLoadPosition(i, seed, target, p);
          if (state.opacity <= 0) continue;

          const sx = offsetX + state.x * scale;
          const sy = offsetY + state.y * scale;
          const sr = seed.size * scale * 1.15;
          drawParticle(sx, sy, sr, state.opacity, seed.isGold);
        }
        ctx.globalCompositeOperation = "source-over";
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [seeds]);

  /* ---------------------- Exit transition trigger ------------------------ */
  const handleEnterClick = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    setIsExiting(true);

    // Drive particle scatter progress via a plain object tweened by GSAP.
    // Softer ease (power2.inOut) removes the initial jolt so it reads as
    // a slow shatter, not a starburst.
    gsap.to(exitProgressRef.current, {
      value: 1,
      duration: EXIT_DURATION,
      ease: "power2.inOut",
    });

    // UI (text/button) fades out promptly so it doesn't linger behind the burst
    gsap.to(uiRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    });

    // Black backdrop retreats gradually — starts after the initial flare so
    // the burst reads first, then eases the void away.
    gsap.to([bgRef.current, gradientRef.current], {
      opacity: 0,
      duration: 2.4,
      delay: 0.7,
      ease: "power2.inOut",
    });

    // Whole loader dismounts once particles have flown off and bg is gone
    gsap.delayedCall(EXIT_DURATION + 0.1, () => {
      onComplete?.();
    });
  };

  useEffect(() => {
    if (isLoaded) {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [isLoaded]);

  /* -------------------------------- Render ------------------------------- */
  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[9999] overflow-hidden ${isExiting ? "pointer-events-none" : "pointer-events-auto"
        }`}
    >
      {/* Black backdrop — fades to reveal the page beneath on exit */}
      <div ref={bgRef} className="absolute inset-0 bg-slate-950" />

      {/* Radial gold gradient tint — fades with backdrop */}
      <div
        ref={gradientRef}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-60 pointer-events-none"
      />

      {/* Full-viewport canvas — particles animate through load + scatter exit */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-screen h-screen block"
        aria-hidden
      />

      {/* Loading text / Enter button — fades on exit */}
      <div
        ref={uiRef}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 text-center select-none flex flex-col items-center"
      >
        <div className="h-12 flex items-center justify-center">
          {!isLoaded ? (
            <div className="text-[9px] font-mono tracking-[0.3em] text-slate-400/90 uppercase flex flex-col items-center gap-2">
              <span>Coalescing Void Particles</span>
              <span className="text-amber-400 font-bold">{progressDisplay}%</span>
            </div>
          ) : (
            <button
              ref={buttonRef}
              onClick={handleEnterClick}
              disabled={isExiting}
              className="px-6 py-2 bg-transparent border border-amber-400 text-amber-300 text-[10px] font-mono uppercase tracking-[0.25em] rounded-full hover:bg-amber-400 hover:text-slate-950 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
            >
              Enter The Universe
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
