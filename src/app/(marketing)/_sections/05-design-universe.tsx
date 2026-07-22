"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { universe } from "@/content/universe";

// 8 tiles x 35vw = 280vw track. Travel = 280vw - 100vw = 180vw.
const SECTION_HEIGHT = "200vh";

/** Ambient gold starfield — shares the cosmic theme with the images. */
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cancelled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let { w, h } = resize();

    interface Star {
      x: number; y: number; size: number;
      alpha: number; alphaDir: number; alphaSpeed: number;
      color: string;
    }

    let stars: Star[] = [];

    const build = () => {
      stars = Array.from({ length: 280 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.4 + 0.2,
        alpha: Math.random() * 0.6 + 0.1,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        alphaSpeed: Math.random() * 0.003 + 0.001,
        color: Math.random() < 0.7 ? "201,162,75" : "231,199,122",
      }));
    };
    build();

    const onResize = () => {
      ({ w, h } = resize());
      build();
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      if (cancelled) return;
      ctx.fillStyle = "#0a0908";
      ctx.fillRect(0, 0, w, h);
      for (const s of stars) {
        s.alpha += s.alphaDir * s.alphaSpeed;
        if (s.alpha >= 0.75 || s.alpha <= 0.08) s.alphaDir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${s.alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full"
    />
  );
}

export default function SectionDesignUniverse() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-180vw"]);

  // Track which vignette is "active" (currently under the reticle) so the
  // fraction counter + reticle can pulse.
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Linear map 0→1 across 8 vignettes, clamped to [0, 7].
    const next = Math.min(universe.length - 1, Math.max(0, Math.floor(p * universe.length)));
    setActiveIndex(next);
  });

  return (
    <section
      ref={sectionRef}
      id="the-design-universe"
      aria-labelledby="design-universe-heading"
      className="relative w-full text-ivory"
      style={{ height: SECTION_HEIGHT }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Shared starfield backdrop */}
        <StarField />

        {/* Section label + fraction counter row */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-6 sm:px-10 sm:pt-8 md:px-14 md:pt-10">
          <div className="mx-auto w-full max-w-8xl flex items-start justify-between">
            <p id="design-universe-heading" className="section-label">
              <span aria-hidden className="font-serif text-ivory text-[0.85rem] sm:text-[0.95rem]">05</span>
              <span className="inline-block w-8" aria-hidden />
              <span className="text-ivory-dim">THE DESIGN UNIVERSE</span>
            </p>

            {/* Fraction counter — NN / 08 (replaces the ✦ mark on this section) */}
            <div
              className="flex items-baseline gap-1.5 font-serif text-ivory tabular-nums select-none"
              aria-live="polite"
              aria-atomic
            >
              <span className="text-gold text-lg sm:text-xl leading-none">
                {(activeIndex + 1).toString().padStart(2, "0")}
              </span>
              <span aria-hidden className="text-ivory-mute text-[0.72rem] leading-none">/</span>
              <span aria-hidden className="text-ivory-dim text-xs sm:text-sm leading-none">
                {universe.length.toString().padStart(2, "0")}
              </span>
              <span className="sr-only">
                Viewing vignette {activeIndex + 1} of {universe.length}
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal track */}
        <motion.div
          style={{ x }}
          className="absolute inset-0 flex items-center will-change-transform z-10"
        >
          {universe.map((node, idx) => (
            <div
              key={node.id}
              className="group relative shrink-0 flex flex-col items-center justify-center gap-5 pt-28 pb-10 px-2"
              style={{ width: "35vw", height: "100%" }}
            >
              {/* Fixed-height image — transparent background blends perfectly */}
              <div className="relative w-full" style={{ height: "54vh" }}>
                <Image
                  src={node.image}
                  alt={node.label}
                  fill
                  sizes="35vw"
                  className="object-contain transition-all duration-700 ease-out group-hover:scale-[1.04] group-hover:drop-shadow-[0_0_30px_rgba(201,162,75,0.25)]"
                  priority={idx < 3}
                />
              </div>

              {/* Label */}
              <span className="text-[0.68rem] sm:text-[0.75rem] tracking-[0.28em] text-ivory-dim group-hover:text-ivory transition-colors duration-500 font-medium uppercase text-center px-2">
                {node.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Center reticle — 4 corner brackets pinned to viewport center. Sits
            on top of the moving track so as tiles pass through it the current
            vignette reads as "targeted". Non-interactive, decorative only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        >
          <div className="relative w-[38vw] max-w-[420px] h-[56vh] max-h-[420px] hidden md:block">
            {/* Top-left */}
            <span className="absolute -top-px -left-px w-6 h-6 border-t border-l border-gold/45" />
            {/* Top-right */}
            <span className="absolute -top-px -right-px w-6 h-6 border-t border-r border-gold/45" />
            {/* Bottom-left */}
            <span className="absolute -bottom-px -left-px w-6 h-6 border-b border-l border-gold/45" />
            {/* Bottom-right */}
            <span className="absolute -bottom-px -right-px w-6 h-6 border-b border-r border-gold/45" />
            {/* Center micro tick */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gold/70 shadow-[0_0_8px_-1px_rgba(231,199,122,0.85)]" />
          </div>
        </div>
      </div>

      {/* SEO / a11y */}
      <ul className="sr-only">
        {universe.map((node) => (
          <li key={node.id}><strong>{node.label}</strong>: {node.blurb}</li>
        ))}
      </ul>
    </section>
  );
}