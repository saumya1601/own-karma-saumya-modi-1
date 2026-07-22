"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { SectionShell } from "../_components/section-shell";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { portalCopy } from "@/content/sections";

/**
 * A large golden particle ring — center-left of the section, sitting inside
 * a fog-lit backdrop of ruined ancient columns. Slowly rotates + breathes.
 * SVG-based (deterministic, no canvas), so it renders identically on server
 * and client and stays perfectly crisp at any viewport size.
 *
 * Two particle layers:
 *   1. Base ring — 48 evenly-spaced dim gold particles.
 *   2. Bright cluster — 18 brighter particles concentrated in one quadrant,
 *      giving the ring an intentional "opening" or portal-mouth effect.
 */
const PARTICLE_COUNT = 48;
const CLUSTER_COUNT = 18;

/**
 * SVG attributes serialize floating-point numbers differently between Node
 * (SSR) and the browser at the tail end of the mantissa (e.g. `48.00063...`
 * vs `48.00063536917119`), which triggers hydration warnings. Rounding to
 * two decimals is well below sub-pixel accuracy for our 400×400 viewBox and
 * makes the string form deterministic across environments.
 */
const round2 = (n: number) => Math.round(n * 100) / 100;

function PortalRing() {
  const reduced = useReducedMotion();

  // Deterministic pseudo-random values via seeded sine — same on server + client.
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const radiusJitter = 1 + Math.sin(i * 3.7) * 0.03;
        return {
          x: round2(200 + Math.cos(angle) * 180 * radiusJitter),
          y: round2(200 + Math.sin(angle) * 180 * radiusJitter),
          r: round2(1.2 + Math.abs(Math.sin(i * 7.13)) * 1.2),
        };
      }),
    [],
  );

  const cluster = useMemo(
    () =>
      Array.from({ length: CLUSTER_COUNT }, (_, i) => {
        // Concentrate in the upper-right quadrant (the "portal mouth").
        const angle = -Math.PI * 0.3 + Math.sin(i * 4.11) * 0.35;
        const r = 175 + Math.sin(i * 11.7) * 18;
        return {
          x: round2(200 + Math.cos(angle) * r),
          y: round2(200 + Math.sin(angle) * r),
          r: round2(1.4 + Math.abs(Math.sin(i * 5.29)) * 1.8),
        };
      }),
    [],
  );

  return (
    <div className="relative flex items-center justify-center h-full w-full">
      {/* Warm inner glow behind the ring */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(231,199,122,0.14) 0%, rgba(0,0,0,0) 55%)",
        }}
      />

      {/* Slowly-rotating particle ring */}
      <motion.svg
        viewBox="0 0 400 400"
        className="relative z-10 w-full max-w-[560px] aspect-square"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 90, ease: "linear", repeat: Infinity }}
        aria-hidden
      >
        <defs>
          <radialGradient id="portal-ring-glow" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="rgba(201,162,75,0)" />
            <stop offset="82%" stopColor="rgba(231,199,122,0.28)" />
            <stop offset="100%" stopColor="rgba(201,162,75,0)" />
          </radialGradient>
        </defs>

        {/* Soft glow behind the ring */}
        <circle cx="200" cy="200" r="180" fill="url(#portal-ring-glow)" />

        {/* Two thin gold rims */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="rgba(201,162,75,0.28)"
          strokeWidth="0.5"
        />
        <circle
          cx="200"
          cy="200"
          r="196"
          fill="none"
          stroke="rgba(201,162,75,0.12)"
          strokeWidth="0.4"
        />

        {/* Base particle ring */}
        {particles.map((p, i) => (
          <circle
            key={`p-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="rgba(201,162,75,0.6)"
          />
        ))}

        {/* Brighter cluster (portal mouth) */}
        {cluster.map((p, i) => (
          <circle
            key={`c-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="rgba(231,199,122,0.95)"
          />
        ))}
      </motion.svg>

      {/* Breathing halo overlay */}
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(231,199,122,0.18) 0%, rgba(231,199,122,0) 50%)",
          }}
          animate={{ opacity: [0.35, 0.85, 0.35], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity }}
        />
      )}
    </div>
  );
}

/**
 * Small standing figure facing the portal, rendered at the bottom center.
 * Near-black silhouette with a faint gold rim caught by the portal light.
 */
function PortalSilhouette() {
  return (
    <svg
      viewBox="0 0 40 100"
      className="w-9 h-24 sm:w-11 sm:h-28 md:w-14 md:h-32"
      aria-hidden
    >
      <defs>
        <radialGradient id="portal-silhouette-glow" cx="50%" cy="15%" r="45%">
          <stop offset="0%" stopColor="rgba(231,199,122,0.35)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      {/* Halo around the head from portal light */}
      <ellipse cx="20" cy="22" rx="19" ry="16" fill="url(#portal-silhouette-glow)" />
      {/* Figure body */}
      <g fill="rgba(2,2,2,0.98)" stroke="rgba(201,162,75,0.22)" strokeWidth="0.4">
        {/* Head */}
        <circle cx="20" cy="20" r="6.2" />
        {/* Torso */}
        <path d="M 8,34 Q 20,28 32,34 L 30,62 Q 20,66 10,62 Z" />
        {/* Legs */}
        <rect x="14" y="60" width="4" height="40" rx="1.5" />
        <rect x="22" y="60" width="4" height="40" rx="1.5" />
      </g>
    </svg>
  );
}

/**
 * The Portal — chapter 02.
 *
 * Layout:
 *  ─────────────────────────────────────────────
 *  │  [ Gold Particle Ring ]  │  YOU ARE NOT   │
 *  │  center-left, breathing  │  ENTERING…     │
 *  │                          │  AN IDEA. (gold)│
 *  │           [silhouette bottom-center]      │
 *  ─────────────────────────────────────────────
 */
export default function SectionPortal() {
  return (
    <SectionShell
      id="the-portal"
      index="02"
      label="THE PORTAL"
      className="relative bg-ink-cool-soft overflow-hidden"
      maxWidthClassName="max-w-8xl"
    >
      {/* Vertical fog gradient — soft warm center, deeper edges */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 55%, rgba(30,22,14,0.35) 0%, rgba(4,4,7,0.85) 75%)",
        }}
      />

      {/* Ancient ruined columns receding into fog — decorative backdrop */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-1/3 pointer-events-none opacity-30"
      >
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-full"
          preserveAspectRatio="xMidYMax slice"
        >
          <defs>
            <linearGradient id="portal-fog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(5,5,8,0.95)" />
              <stop offset="60%" stopColor="rgba(5,5,8,0.55)" />
              <stop offset="100%" stopColor="rgba(5,5,8,1)" />
            </linearGradient>
            <linearGradient id="portal-column" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(30,24,18,0.85)" />
              <stop offset="50%" stopColor="rgba(45,36,26,0.7)" />
              <stop offset="100%" stopColor="rgba(20,16,12,0.9)" />
            </linearGradient>
          </defs>

          {/* Six ruined columns at varying heights + opacities */}
          {[
            { x: 60, h: 280, o: 0.55 },
            { x: 220, h: 320, o: 0.7 },
            { x: 380, h: 260, o: 0.55 },
            { x: 720, h: 300, o: 0.65 },
            { x: 900, h: 250, o: 0.5 },
            { x: 1060, h: 290, o: 0.6 },
          ].map((col, i) => (
            <g key={i} opacity={col.o}>
              {/* Capital */}
              <rect
                x={col.x - 6}
                y={400 - col.h - 8}
                width="30"
                height="6"
                fill="url(#portal-column)"
              />
              <rect
                x={col.x - 4}
                y={400 - col.h - 2}
                width="26"
                height="4"
                fill="rgba(20,16,12,0.85)"
              />
              {/* Shaft */}
              <rect
                x={col.x}
                y={400 - col.h}
                width="18"
                height={col.h}
                fill="url(#portal-column)"
              />
              {/* Base */}
              <rect
                x={col.x - 4}
                y={400 - 6}
                width="26"
                height="6"
                fill="url(#portal-column)"
              />
            </g>
          ))}

          {/* Fog overlay obscures the bases + tops */}
          <rect x="0" y="0" width="1200" height="400" fill="url(#portal-fog)" />
        </svg>
      </div>

      {/* Main content — ring on the left, editorial copy on the right */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center py-28 sm:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-8 items-center px-6 md:px-14">
          {/* Portal ring */}
          <div className="relative flex items-center justify-center h-[46vh] md:h-[68vh]">
            <PortalRing />
          </div>

          {/* Editorial copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-8 md:gap-10 text-left"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.15] tracking-wide text-ivory">
              {portalCopy.lines[0].text}
              <br />
              {portalCopy.lines[1].text}
            </h2>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.15] tracking-wide text-ivory">
              {portalCopy.lines[2].text}
              <br />
              {portalCopy.lines[3].text}
              <br />
              <span className="text-gold">{portalCopy.lines[4].text}</span>
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Silhouette anchored at the bottom center — facing the portal */}
      <div className="absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <PortalSilhouette />
      </div>
    </SectionShell>
  );
}