"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * HeroEclipse
 *
 * The universe opens. A living starfield drifts behind an eclipse — a dark
 * sun rimmed by a corona of gold-bright light. The brand wordmark emerges
 * *through* the eclipse, not on top of it.
 *
 * Pillars invoked:
 *   IV Egyptian (sun disk / eclipse as central light)
 *   VII Astronomy (starfield, corona, orbital motion)
 *   IX Philosophy (∞ tagline lockup)
 */
export default function HeroEclipse() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Animated starfield — deterministic seed, GPU-cheap point sprites.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = 0;
        let h = 0;

        type Star = { x: number; y: number; r: number; a: number; s: number };
        const stars: Star[] = [];

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        // Deterministic pseudo-random so field is stable across renders.
        const seed = (n: number) => {
            const x = Math.sin(n * 9301 + 49297) * 233280;
            return x - Math.floor(x);
        };

        const spawn = () => {
            stars.length = 0;
            const count = Math.floor((w * h) / 4800);
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: seed(i * 3 + 1) * w,
                    y: seed(i * 3 + 2) * h,
                    r: 0.4 + seed(i * 3 + 3) * 1.4,
                    a: 0.15 + seed(i * 3 + 4) * 0.6,
                    s: 0.03 + seed(i * 3 + 5) * 0.06,
                });
            }
        };

        let raf = 0;
        let t = 0;
        const tick = () => {
            t += 0.008;
            ctx.clearRect(0, 0, w, h);

            // Nebula wash
            const g = ctx.createRadialGradient(w / 2, h * 0.55, 0, w / 2, h * 0.55, Math.max(w, h) * 0.7);
            g.addColorStop(0, "rgba(35,35,67,0.35)");
            g.addColorStop(0.4, "rgba(13,13,22,0.4)");
            g.addColorStop(1, "rgba(6,6,10,0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);

            // Stars
            for (const s of stars) {
                const flicker = 0.5 + 0.5 * Math.sin(t * s.s * 40 + s.x);
                ctx.globalAlpha = s.a * (0.5 + 0.5 * flicker);
                ctx.fillStyle = s.a > 0.55 ? "#E9CD8B" : "#EDE7D8";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            raf = requestAnimationFrame(tick);
        };

        resize();
        spawn();
        tick();

        const onResize = () => {
            resize();
            spawn();
        };
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            cancelAnimationFrame(raf);
        };
    }, []);

    const easeSlow = [0.22, 0.9, 0.28, 1] as const;

    return (
        <section
            data-chapter="I · The Arrival"
            className="relative w-full h-screen min-h-[760px] overflow-hidden bg-void flex items-center justify-center"
        >
            {/* Starfield canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                aria-hidden
            />

            {/* Eclipse — dark disk with gold corona */}
            <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 3.2, ease: easeSlow, delay: 4.4 }}
            >
                <div className="relative w-[540px] h-[540px] max-w-[85vw] max-h-[85vw]">
                    {/* Outermost corona bloom */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle,rgba(233,205,139,0.35) 0%,rgba(198,161,91,0.15) 30%,transparent 65%)",
                            filter: "blur(6px)",
                        }}
                    />
                    {/* Inner corona ring */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle,transparent 44%,rgba(233,205,139,0.9) 46%,rgba(198,161,91,0.4) 49%,transparent 55%)",
                        }}
                    />
                    {/* Dark disk (the "black sun") */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle,#06060A 42%,rgba(6,6,10,0) 46%)",
                        }}
                    />
                    {/* Orbital arc — faint gold ellipse tilted */}
                    <motion.svg
                        viewBox="-300 -300 600 600"
                        className="absolute inset-0 w-full h-full"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 220, ease: "linear", repeat: Infinity }}
                    >
                        <ellipse
                            cx={0}
                            cy={0}
                            rx={260}
                            ry={90}
                            fill="none"
                            stroke="var(--color-gold)"
                            strokeOpacity={0.15}
                            strokeWidth={0.8}
                            transform="rotate(-18)"
                        />
                        <ellipse
                            cx={0}
                            cy={0}
                            rx={210}
                            ry={60}
                            fill="none"
                            stroke="var(--color-gold)"
                            strokeOpacity={0.08}
                            strokeWidth={0.6}
                            transform="rotate(28)"
                        />
                    </motion.svg>
                </div>
            </motion.div>

            {/* Cosmos vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,6,10,0.9)_100%)]" />

            {/* Wordmark anchor — sits at the EXACT vertical center of the viewport.
                Tagline / divider / description are absolutely positioned around it
                so they never shift the wordmark's centered position. */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center px-6 w-full max-w-4xl">
                {/* Tagline — floats above the wordmark */}
                <motion.p
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-8 whitespace-nowrap utility-label text-gold/70"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.4, ease: easeSlow, delay: 5.2 }}
                >
                    A Universe · Not a Store
                </motion.p>

                {/* The wordmark itself — its center IS the page's center */}
                <motion.h1
                    className="font-monument text-marble uppercase leading-none whitespace-nowrap"
                    style={{ fontSize: "clamp(36px, 6.5vw, 84px)", letterSpacing: "0.16em" }}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 2.2, ease: easeSlow, delay: 5.4 }}
                >
                    Own <span className="text-gold-bright">·</span> Karma
                </motion.h1>

                {/* Divider + description — float below the wordmark */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-8 w-full flex flex-col items-center">
                    <motion.div
                        className="flex items-center justify-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.4, delay: 6.4 }}
                    >
                        <span className="h-px w-20 bg-gold/40" />
                        <InfinityMark />
                        <span className="h-px w-20 bg-gold/40" />
                    </motion.div>

                    <motion.p
                        className="mt-8 font-editorial italic text-marble/80 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.6, ease: easeSlow, delay: 6.6 }}
                    >
                        What you place into the world <span className="text-gold-bright">returns</span>.
                        Every action is a thread in a larger design.
                    </motion.p>
                </div>
            </div>

            {/* CTA — anchored to the lower portion of the viewport, well below the eclipse */}
            <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-32 sm:bottom-36 md:bottom-40 z-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 7.2 }}
            >
                <a
                    href="#manifesto"
                    className="group inline-flex items-center gap-4 border border-gold/50 hover:border-gold-bright px-8 py-4 font-utility text-[11px] tracking-[0.35em] uppercase text-marble hover:text-gold-bright transition-colors"
                >
                    <span>Begin the Journey</span>
                    <svg width="24" height="10" viewBox="0 0 24 10" className="stroke-current">
                        <path d="M0 5 H22 M18 1 L22 5 L18 9" fill="none" strokeWidth="1.2" />
                    </svg>
                </a>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1.4, delay: 7.8 }}
            >
                <span className="utility-label text-[9px] text-stone">Descend</span>
                <span className="block w-px h-10 bg-gradient-to-b from-gold/70 to-transparent" />
            </motion.div>
        </section>
    );
}

function InfinityMark() {
    return (
        <svg
            viewBox="0 0 40 20"
            width="40"
            height="20"
            fill="none"
            className="stroke-gold-bright"
            strokeWidth="1.2"
        >
            <path d="M8 10 C 8 4, 16 4, 20 10 C 24 16, 32 16, 32 10 C 32 4, 24 4, 20 10 C 16 16, 8 16, 8 10 Z" />
        </svg>
    );
}
