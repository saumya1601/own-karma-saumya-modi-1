"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { SectionShell } from "../_components/section-shell";
import { unboundCopy } from "@/content/sections";
import { fadeUp } from "@/lib/motion/variants";

/**
 * Renders the word "BOUND." as a field of gold particles that gently drift.
 * Always renders — reduced-motion just freezes the jitter, particles still show.
 */
function BoundParticleText({ text = "BOUND." }: { text?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isReduced = useReducedMotion();
  const isReducedRef = useRef(isReduced);
  // Sync outside render — React 19 forbids writing to refs during render.
  useEffect(() => {
    isReducedRef.current = isReduced;
  }, [isReduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface Particle {
      hx: number; // home coord (target text pixel)
      hy: number;
      sx: number; // one-shot spawn position (random offset from home)
      sy: number;
      x: number;
      y: number;
      size: number;
      color: string;
      /** Delay (ms) before this particle starts flying in — staggered per-particle. */
      delay: number;
      /** Journey duration (ms). */
      duration: number;
      /** Rightward drift distance for the dissolve phase (px). */
      driftDX: number;
      /** Vertical jitter distance for the dissolve phase (px). */
      driftDY: number;
      /** Delay (ms) after DISSOLVE_START before this particle begins to drift. */
      dissolveDelay: number;
      /** Length of the drift (ms). */
      dissolveDuration: number;
    }

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    /** Time (performance.now) at which the assembly animation started. `null` = not yet triggered. */
    let startedAt: number | null = null;

    // Resolve the actual serif family from a live DOM node so next/font's
    // hashed name (e.g. `__cormorantGaramond_a1b2c3`) is used. Canvas font
    // strings do NOT accept `var(--font-*)` values.
    const probe = document.createElement("span");
    probe.style.fontFamily = "var(--font-cormorant), 'Cormorant Garamond', serif";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    probe.style.pointerEvents = "none";
    document.body.appendChild(probe);
    const resolvedFamily =
      getComputedStyle(probe).fontFamily || "'Cormorant Garamond', serif";
    document.body.removeChild(probe);

    const buildParticles = () => {
      if (cancelled) return;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      if (width < 20 || height < 20) return; // layout not settled yet
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw the target text to an offscreen buffer, then sample its pixels.
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d");
      if (!octx) return;

      const fontSize = Math.min(width * 0.32, height * 0.9);
      octx.fillStyle = "#ffffff";
      octx.font = `300 ${fontSize}px ${resolvedFamily}`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";

      // Measure the text and shrink the font so it always fits with margin.
      const maxTextWidth = width * 0.9;
      const measured = octx.measureText(text).width;
      let finalFontSize = fontSize;
      if (measured > maxTextWidth) {
        finalFontSize = fontSize * (maxTextWidth / measured);
        octx.font = `300 ${finalFontSize}px ${resolvedFamily}`;
      }

      octx.fillText(text, width / 2, height / 2);

      const sample = octx.getImageData(0, 0, width, height).data;
      const gap = 3; // grid density
      const next: Particle[] = [];
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = sample[(y * width + x) * 4 + 3];
          if (alpha > 128) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 80 + Math.random() * 260;
            const hx = x + (Math.random() - 0.5) * 2;
            const hy = y + (Math.random() - 0.5) * 2;
            next.push({
              hx,
              hy,
              sx: hx + Math.cos(angle) * dist,
              sy: hy + Math.sin(angle) * dist,
              x: hx + Math.cos(angle) * dist,
              y: hy + Math.sin(angle) * dist,
              size: Math.random() * 1.6 + 0.5,
              color: Math.random() < 0.7 ? "#c9a24b" : "#e7c77a",
              // Stagger particles across ~1.2s, each with a ~1.4s flight.
              delay: Math.random() * 1200,
              duration: 1200 + Math.random() * 800,
              // Dissolve phase: drift 260–520px to the right + light y jitter.
              driftDX: 260 + Math.random() * 260,
              driftDY: (Math.random() - 0.5) * 60,
              dissolveDelay: Math.random() * 900,
              dissolveDuration: 900 + Math.random() * 700,
            });
          }
        }
      }
      particles = next;
      // Any existing animation resets when we rebuild (e.g. on resize).
      startedAt = null;
    };

    // First pass with whatever fonts are ready right now.
    buildParticles();

    // Rebuild after fonts finish loading so we get the correct serif metrics.
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) buildParticles();
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Elapsed time since the section first entered view. If we haven't been
      // triggered yet, particles stay in their spawn positions (invisible).
      const now = performance.now();
      const elapsed = startedAt !== null ? now - startedAt : 0;
      // Reduced motion → longer, gentler flight but same one-shot pattern.
      const durationScale = isReducedRef.current ? 2.5 : 1;

      // Signature choreography — three phases scaled by durationScale:
      //   1. ASSEMBLE  (0            → ~2000ms)   particles fly in to spell BOUND
      //   2. HOLD      (2000         → 2800ms)    BOUND sits, fully visible
      //   3. DISSOLVE  (2800         → 4400ms)    particles drift right, fade out
      // The 2.8s dissolve start matches the delay on the UNBOUND reveal in the
      // parent component so the two words handoff instead of overlapping.
      const DISSOLVE_START = 2800 * durationScale;

      for (const p of particles) {
        const localDur = p.duration * durationScale;
        const localDelay = p.delay * durationScale;
        const assembleProgress = Math.max(
          0,
          Math.min(1, (elapsed - localDelay) / localDur),
        );

        // Ease-out cubic — quick take-off, gentle arrival.
        const assembleEased = 1 - Math.pow(1 - assembleProgress, 3);
        let x = p.sx + (p.hx - p.sx) * assembleEased;
        let y = p.sy + (p.hy - p.sy) * assembleEased;

        // Fade in during the first 25% of the flight, then stay solid.
        let alpha = assembleProgress < 0.25 ? assembleProgress / 0.25 : 1;

        // Phase 3 — dissolve → drift right + fade out.
        if (elapsed >= DISSOLVE_START) {
          const localDissolveDelay = p.dissolveDelay * durationScale;
          const localDissolveDuration = p.dissolveDuration * durationScale;
          const dissolveProgress = Math.max(
            0,
            Math.min(
              1,
              (elapsed - DISSOLVE_START - localDissolveDelay) /
              localDissolveDuration,
            ),
          );
          if (dissolveProgress > 0) {
            const dissolveEased = 1 - Math.pow(1 - dissolveProgress, 2);
            // Drift right + slight vertical jitter + slight overall rise.
            x = p.hx + p.driftDX * dissolveEased;
            y = p.hy + p.driftDY * dissolveEased - 18 * dissolveEased;
            // Hold full opacity for the first 30%, then fade to zero.
            alpha =
              dissolveProgress < 0.3
                ? 1
                : Math.max(0, 1 - (dissolveProgress - 0.3) / 0.7);
          }
        }

        p.x = x;
        p.y = y;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9 * alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => buildParticles();
    window.addEventListener("resize", onResize);

    // Rebuild if the layout wasn't ready yet, and re-TRIGGER the assembly
    // animation every time the canvas re-enters the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (particles.length === 0) buildParticles();
            // Restart the flight-in from the spawn positions on every entry.
            for (const p of particles) {
              p.x = p.sx;
              p.y = p.sy;
            }
            startedAt = performance.now();
          } else {
            // Reset so the next entry replays the animation from the start.
            startedAt = null;
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(canvas);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [text]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={text}
      role="img"
      className="block h-[140px] w-full sm:h-[180px] md:h-[220px] lg:h-[240px]"
    />
  );
}

export default function SectionUnbound() {
  return (
    <SectionShell
      id="the-unbound"
      index="04"
      label="THE UNBOUND"
      className="relative flex flex-col items-center justify-between bg-ink-2 py-16 md:py-20"
      maxWidthClassName="max-w-8xl"
    >
      <div className="z-10 w-full flex-1 flex flex-col items-start md:items-start justify-center max-w-8xl px-6 md:px-14 gap-10 md:gap-16">
        {/* Row 1 — "WE ARE NOT" */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <p className="font-serif text-ivory tracking-[0.28em] font-light text-sm uppercase">
            {unboundCopy.eyebrow}
          </p>
        </motion.div>

        {/* Row 2 — BOUND (particles) dissolves rightward → UNBOUND (solid gold)
            materializes in sync. Timing is calibrated to the DISSOLVE_START
            constant in the canvas render loop above (2.8s after in-view). */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
        >
          <div className="w-full">
            <BoundParticleText text={unboundCopy.bound} />
          </div>
          <div className="w-full">
            <motion.span
              initial={{ opacity: 0, x: -32, letterSpacing: "0.2em", filter: "blur(4px)" }}
              whileInView={{
                opacity: 1,
                x: 0,
                letterSpacing: "-0.02em",
                filter: "blur(0px)",
              }}
              viewport={{ once: false, amount: 0.05 }}
              transition={{
                duration: 1.4,
                // Fire in sync with BOUND's dissolve start (2.8s after visible).
                delay: 2.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block font-serif font-light text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] text-gold tracking-tight leading-none drop-shadow-[0_0_40px_rgba(231,199,122,0.25)]"
            >
              {unboundCopy.unbound}
            </motion.span>
          </div>
        </motion.div>

        {/* Row 3 — Lower Grid Details */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left Column list */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.05 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } }
            }}
            className="flex flex-col gap-3 text-left"
          >
            {unboundCopy.list.map((item, idx) => (
              <motion.p
                key={idx}
                variants={fadeUp}
                className="font-serif text-xl sm:text-2xl font-light text-ivory-dim"
              >
                {item}
              </motion.p>
            ))}
          </motion.div>

          {/* Right Column closing statement */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.05 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } }
            }}
            className="flex flex-col gap-4 text-left md:text-right justify-center h-full"
          >
            {unboundCopy.closing.map((item, idx) => (
              <motion.p
                key={idx}
                variants={fadeUp}
                className="font-serif text-xl sm:text-2xl font-light text-ivory-dim"
              >
                {item.plain}
                {item.gold && <span className="text-gold font-normal">{item.gold}</span>}
                {item.trail || ""}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
