"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * PrimordialManuscript
 *
 * Sacred palm-leaf / parchment scroll that unrolls in perfect sync with the
 * user's scroll position. Reverses identically when scrolling back up.
 *
 * Structure:
 *   - Outer <section> is 300vh tall — provides the scroll runway.
 *   - Inner sticky stage stays pinned in the viewport.
 *   - Two "rods" (top + bottom) travel outward while the parchment scales
 *     open between them.
 *   - Content inside the parchment fades in progressively at scroll milestones.
 *
 * Effects:
 *   - GSAP ScrollTrigger with `scrub: true` for 1:1 scroll linking (no snap).
 *   - SVG feTurbulence filter for handmade paper grain.
 *   - Radial + inset shadows for burnt edges and warm lighting.
 *   - Drifting dust particles via looped GSAP tweens.
 */
export default function PrimordialManuscript() {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const parchmentRef = useRef<HTMLDivElement>(null);
    const parchmentInnerRef = useRef<HTMLDivElement>(null);
    const topRodRef = useRef<HTMLDivElement>(null);
    const bottomRodRef = useRef<HTMLDivElement>(null);
    const dustLayerRef = useRef<HTMLDivElement>(null);

    // Refs for progressively-revealed manuscript content.
    const revealRefs = useRef<Array<HTMLElement | null>>([]);
    const setRevealRef = (el: HTMLElement | null, i: number) => {
        revealRefs.current[i] = el;
    };

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const parchment = parchmentRef.current;
        const parchmentInner = parchmentInnerRef.current;
        const topRod = topRodRef.current;
        const bottomRod = bottomRodRef.current;
        if (!section || !parchment || !parchmentInner || !topRod || !bottomRod) return;

        // Initial rolled-up state.
        gsap.set(parchment, {
            scaleY: 0.02,
            transformOrigin: "center center",
            filter: "brightness(0.55)",
        });
        gsap.set(parchmentInner, { opacity: 0 });
        gsap.set(topRod, { y: 0, rotate: -6 });
        gsap.set(bottomRod, { y: 0, rotate: 6 });

        const reveals = revealRefs.current.filter(Boolean) as HTMLElement[];
        gsap.set(reveals, { opacity: 0, y: 8, filter: "blur(4px)" });

        const ctx = gsap.context(() => {
            // Reusable "closed" state we can snap to as a safety net.
            const snapClosed = () => {
                gsap.set(parchment, { scaleY: 0.02, filter: "brightness(0.55)" });
                gsap.set(parchmentInner, { opacity: 0 });
                gsap.set(topRod, { y: 0, rotate: -6 });
                gsap.set(bottomRod, { y: 0, rotate: 6 });
                gsap.set(reveals, { opacity: 0, y: 8, filter: "blur(4px)" });
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "+=200%", // shorter runway = snappier open/close
                    pin: stageRef.current,
                    pinSpacing: true, // hold the below section for the full pin range
                    scrub: 0.25, // small lag; enough to feel physical, not sluggish
                    anticipatePin: 1,
                    // Safety nets — if the visitor scrolls past too fast for
                    // the scrubbed close to catch up, force the closed state.
                    onLeave: snapClosed,
                    onLeaveBack: snapClosed,
                },
            });

            // ────────────────────────────────────────────────────────────
            // Timeline is normalized to 1 unit total. ScrollTrigger scrubs
            // scroll position across it — scroll-up reverses everything.
            //
            //   0.00 → 0.20  OPEN     — parchment unrolls, rods travel apart
            //   0.16 → 0.34  REVEAL   — ink content fades in
            //   0.34 → 0.50  HOLD     — fully open, readable
            //   0.50 → 0.62  FADE     — content fades back into the paper
            //   0.55 → 0.85  CLOSE    — parchment rolls back, rods return
            //   0.85 → 1.00  BUFFER   — closed state is guaranteed before the
            //                            pin releases and the below section appears
            // ────────────────────────────────────────────────────────────

            // ── OPEN ──
            tl.to(
                parchment,
                { scaleY: 1, filter: "brightness(1)", ease: "power2.inOut", duration: 0.20 },
                0
            );
            tl.to(
                topRod,
                { y: "-46vh", rotate: 0, ease: "power2.inOut", duration: 0.20 },
                0
            );
            tl.to(
                bottomRod,
                { y: "46vh", rotate: 0, ease: "power2.inOut", duration: 0.20 },
                0
            );
            tl.to(
                parchmentInner,
                { opacity: 1, ease: "power1.out", duration: 0.16 },
                0.06
            );

            // ── REVEAL ── (staggered ink)
            reveals.forEach((el, i) => {
                const at = 0.16 + i * 0.022;
                tl.to(
                    el,
                    { opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.10 },
                    at
                );
            });

            // ── HOLD ── (empty band: 0.34 → 0.50; no tweens needed)

            // ── FADE CONTENT ── (reverse of reveal, faster)
            reveals.forEach((el, i) => {
                const at = 0.50 + i * 0.014;
                tl.to(
                    el,
                    { opacity: 0, y: -6, filter: "blur(3px)", ease: "power2.in", duration: 0.07 },
                    at
                );
            });

            // ── CLOSE ── finishes at 0.85. The 15% buffer that follows keeps
            // the paper visibly closed and the section still pinned so the
            // below section cannot appear until close is truly complete.
            tl.to(
                parchmentInner,
                { opacity: 0, ease: "power1.in", duration: 0.15 },
                0.58
            );
            tl.to(
                parchment,
                { scaleY: 0.02, filter: "brightness(0.55)", ease: "power2.inOut", duration: 0.30 },
                0.55
            );
            tl.to(
                topRod,
                { y: 0, rotate: -6, ease: "power2.inOut", duration: 0.30 },
                0.55
            );
            tl.to(
                bottomRod,
                { y: 0, rotate: 6, ease: "power2.inOut", duration: 0.30 },
                0.55
            );
        }, section);

        // Floating dust particles (ambient, not scroll-linked).
        const dustCtx = gsap.context(() => {
            const particles = dustLayerRef.current?.querySelectorAll<HTMLElement>("[data-dust]");
            particles?.forEach((p) => {
                gsap.to(p, {
                    y: `${gsap.utils.random(-40, -120)}`,
                    x: `${gsap.utils.random(-30, 30)}`,
                    opacity: gsap.utils.random(0.15, 0.55),
                    duration: gsap.utils.random(6, 14),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: gsap.utils.random(0, 4),
                });
            });
        }, section);

        return () => {
            ctx.revert();
            dustCtx.revert();
        };
    }, []);

    // Deterministic dust positions (avoid SSR/CSR hydration mismatch).
    const dustParticles = Array.from({ length: 28 }).map((_, i) => {
        const seed = (i + 1) * 37;
        const left = (seed * 13) % 100;
        const top = (seed * 29) % 100;
        const size = 1 + ((seed * 7) % 3);
        return { left, top, size, id: i };
    });

    return (
        <section
            ref={sectionRef}
            data-chapter="II · The Primordial State"
            className="relative w-full bg-void"
        >
            {/* GSAP-pinned stage — no CSS sticky (GSAP owns the pin exclusively). */}
            <div
                ref={stageRef}
                className="relative h-screen w-full overflow-hidden flex items-center justify-center"
            >
                {/* Cinematic warm background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a0f07_0%,#06060A_65%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.10)_0%,transparent_55%)]" />

                {/* Volumetric warm light shafts */}
                <div className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_210deg_at_50%_-10%,transparent_0deg,rgba(198,161,91,0.06)_20deg,transparent_60deg)]" />

                {/* SVG filter defs — paper texture retuned for a dark cosmic scroll */}
                <svg width="0" height="0" className="absolute">
                    <defs>
                        {/* Fine grain — lifts the dark surface with tiny gold-warm speckle */}
                        <filter id="paper-grain">
                            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
                            <feColorMatrix
                                values="0 0 0 0 0.78
                        0 0 0 0 0.63
                        0 0 0 0 0.36
                        0 0 0 0.22 0"
                            />
                            <feComposite in2="SourceGraphic" operator="in" />
                        </filter>
                        {/* Horizontal fibers — threads of nebula */}
                        <filter id="paper-fibers">
                            <feTurbulence type="turbulence" baseFrequency="0.02 0.9" numOctaves="1" seed="3" />
                            <feColorMatrix
                                values="0 0 0 0 0.14
                        0 0 0 0 0.14
                        0 0 0 0 0.26
                        0 0 0 0.28 0"
                            />
                            <feComposite in2="SourceGraphic" operator="in" />
                        </filter>
                        <linearGradient id="wood-grain" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#1a0f06" />
                            <stop offset="25%" stopColor="#3a1f0a" />
                            <stop offset="50%" stopColor="#5a2f10" />
                            <stop offset="75%" stopColor="#3a1f0a" />
                            <stop offset="100%" stopColor="#1a0f06" />
                        </linearGradient>
                        <radialGradient id="gold-cap" cx="0.5" cy="0.4" r="0.6">
                            <stop offset="0%" stopColor="var(--color-gold-bright)" />
                            <stop offset="45%" stopColor="var(--color-gold)" />
                            <stop offset="100%" stopColor="#7a5a20" />
                        </radialGradient>
                    </defs>
                </svg>

                {/* Drifting dust layer */}
                <div ref={dustLayerRef} className="pointer-events-none absolute inset-0 z-10">
                    {dustParticles.map((p) => (
                        <span
                            key={p.id}
                            data-dust
                            className="absolute rounded-full bg-gold"
                            style={{
                                left: `${p.left}%`,
                                top: `${p.top}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                opacity: 0.15,
                                filter: "blur(0.5px)",
                            }}
                        />
                    ))}
                </div>

                {/* Section label — matches the brand chapter pattern used elsewhere. */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                    <span className="h-px w-8 bg-gold/50" />
                    <span className="utility-label text-gold">
                        II · The Primordial State
                    </span>
                    <span className="h-px w-8 bg-gold/50" />
                </div>

                {/* Manuscript stage — centered column */}
                <div className="relative z-20 w-[min(760px,88vw)] h-[86vh] flex items-center justify-center">
                    {/* PARCHMENT — the unrolling scroll */}
                    <div
                        ref={parchmentRef}
                        className="relative w-full h-full will-change-transform"
                        style={{
                            transformOrigin: "center center",
                        }}
                    >
                        {/* Cosmic scroll base — cosmos → nebula → cosmos (matches brand palette) */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(180deg,#06060A 0%,#0D0D16 4%,#161628 12%,#1c1c34 50%,#161628 88%,#0D0D16 96%,#06060A 100%)",
                                boxShadow:
                                    "inset 0 0 120px rgba(0,0,0,0.75), inset 0 40px 80px rgba(0,0,0,0.55), inset 0 -40px 80px rgba(0,0,0,0.55), 0 30px 80px rgba(0,0,0,0.7)",
                            }}
                        />

                        {/* Nebula fibers (horizontal streaks) */}
                        <div
                            className="absolute inset-0 mix-blend-screen opacity-40"
                            style={{ filter: "url(#paper-fibers)" }}
                        />

                        {/* Fine gold-warm grain — lifts the dark surface */}
                        <div
                            className="absolute inset-0 mix-blend-screen opacity-25"
                            style={{ filter: "url(#paper-grain)" }}
                        />

                        {/* Void vignette — replaces the burnt edges */}
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(6,6,10,0.65) 92%, rgba(6,6,10,0.95) 100%)",
                            }}
                        />

                        {/* Torn / uneven vertical edge strips — void black */}
                        <div
                            className="pointer-events-none absolute inset-y-0 left-0 w-3"
                            style={{
                                background:
                                    "linear-gradient(90deg,rgba(6,6,10,0.95),transparent)",
                                maskImage:
                                    "linear-gradient(180deg,transparent,black 5%,black 95%,transparent)",
                            }}
                        />
                        <div
                            className="pointer-events-none absolute inset-y-0 right-0 w-3"
                            style={{
                                background:
                                    "linear-gradient(-90deg,rgba(6,6,10,0.95),transparent)",
                                maskImage:
                                    "linear-gradient(180deg,transparent,black 5%,black 95%,transparent)",
                            }}
                        />

                        {/* Faded nebula stains (subtle gold auras where ink once bloomed) */}
                        <div
                            className="pointer-events-none absolute w-24 h-24 rounded-full opacity-25"
                            style={{
                                top: "12%",
                                right: "8%",
                                background:
                                    "radial-gradient(circle,rgba(198,161,91,0.35) 0%,transparent 70%)",
                            }}
                        />
                        <div
                            className="pointer-events-none absolute w-16 h-16 rounded-full opacity-20"
                            style={{
                                bottom: "18%",
                                left: "10%",
                                background:
                                    "radial-gradient(circle,rgba(198,161,91,0.30) 0%,transparent 70%)",
                            }}
                        />

                        {/* Old fold marks — fine gold hairlines */}
                        <div className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gold/15" />
                        <div className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-gold/15" />

                        {/* MANUSCRIPT CONTENT */}
                        <div
                            ref={parchmentInnerRef}
                            className="absolute inset-0 flex items-center justify-center px-10 sm:px-16 md:px-24 py-16"
                        >
                            <div className="relative w-full max-w-xl text-center text-marble">
                                {/* Corner mandalas */}
                                <CornerMandala className="absolute -top-6 -left-6" />
                                <CornerMandala className="absolute -top-6 -right-6 scale-x-[-1]" />
                                <CornerMandala className="absolute -bottom-6 -left-6 scale-y-[-1]" />
                                <CornerMandala className="absolute -bottom-6 -right-6 scale-x-[-1] scale-y-[-1]" />

                                {/* 1. Sacred symbol */}
                                <div
                                    ref={(el) => setRevealRef(el, 0)}
                                    className="mb-6 flex justify-center"
                                >
                                    <SacredOm />
                                </div>

                                {/* 2. Sanskrit / handwritten label */}
                                <p
                                    ref={(el) => setRevealRef(el, 1)}
                                    className="font-editorial text-2xl sm:text-3xl tracking-[0.15em] text-gold-bright mb-2 italic"
                                >
                                    आदि स्वरूप
                                </p>

                                {/* 3. Transliteration */}
                                <p
                                    ref={(el) => setRevealRef(el, 2)}
                                    className="utility-label text-gold mb-8"
                                >
                                    Ādi Svarūpa · The Original Form
                                </p>

                                {/* 4. Heading — brand monument face (Cinzel) */}
                                <h2
                                    ref={(el) => setRevealRef(el, 3)}
                                    className="font-monument text-2xl sm:text-4xl md:text-5xl tracking-[0.14em] font-light text-marble leading-tight mb-8 uppercase"
                                >
                                    Before the
                                    <br />
                                    <span className="text-gold-bright italic font-editorial normal-case tracking-normal">first deed.</span>
                                </h2>

                                {/* 5. Lotus divider */}
                                <div
                                    ref={(el) => setRevealRef(el, 4)}
                                    className="mb-8 flex items-center justify-center gap-4"
                                >
                                    <span className="h-px w-16 bg-gold/40" />
                                    <LotusMark />
                                    <span className="h-px w-16 bg-gold/40" />
                                </div>

                                {/* 6. Body 1 */}
                                <p
                                    ref={(el) => setRevealRef(el, 5)}
                                    className="font-editorial text-base sm:text-lg leading-relaxed text-marble/85 max-w-md mx-auto mb-6 italic"
                                >
                                    In the beginning, there was no karma —
                                    only stillness, unmoved and complete.
                                    The self stood correctly, without reason,
                                    without ancestor, without echo.
                                </p>

                                {/* 7. Body 2 */}
                                <p
                                    ref={(el) => setRevealRef(el, 6)}
                                    className="font-editorial text-base sm:text-lg leading-relaxed text-marble/70 max-w-md mx-auto mb-10"
                                >
                                    To dress oneself now is to remember that first posture.
                                    Every seam a return. Every thread a vow to the origin.
                                </p>

                                {/* 8. CTA — brand button pattern (gold outline on void) */}
                                <button
                                    ref={(el) => setRevealRef(el, 7)}
                                    type="button"
                                    className="group inline-flex items-center gap-4 border border-gold/50 hover:border-gold-bright bg-transparent hover:bg-gold-bright/5 text-marble hover:text-gold-bright px-8 py-3 font-utility text-[11px] tracking-[0.35em] uppercase transition-colors cursor-pointer"
                                >
                                    <span>Return to Zero</span>
                                    <svg width="24" height="10" viewBox="0 0 24 10" className="stroke-current">
                                        <path d="M0 5 H22 M18 1 L22 5 L18 9" fill="none" strokeWidth="1.2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Subtle wrinkle overlays (diagonal gold highlights) */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-10 mix-blend-screen"
                            style={{
                                background:
                                    "repeating-linear-gradient(105deg, transparent 0 40px, rgba(233,205,139,0.10) 40px 41px, transparent 41px 80px)",
                            }}
                        />
                    </div>

                    {/* TOP ROD */}
                    <div
                        ref={topRodRef}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform"
                        style={{ width: "calc(100% + 60px)" }}
                    >
                        <WoodenRod />
                    </div>

                    {/* BOTTOM ROD */}
                    <div
                        ref={bottomRodRef}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform"
                        style={{ width: "calc(100% + 60px)" }}
                    >
                        <WoodenRod />
                    </div>
                </div>

                {/* Bottom vignette */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black to-transparent z-10" />
            </div>
        </section>
    );
}

/* ────────── Decorative sub-components ────────── */

function WoodenRod() {
    return (
        <div className="relative h-6 w-full flex items-center">
            {/* Gold end cap left */}
            <RodCap />
            {/* Rod body */}
            <div
                className="relative flex-1 h-full rounded-sm"
                style={{
                    background:
                        "linear-gradient(180deg,#1a0f06 0%,#3a1f0a 20%,#5a2f10 50%,#3a1f0a 80%,#1a0f06 100%)",
                    boxShadow:
                        "inset 0 1px 0 rgba(198,161,91,0.18), inset 0 -1px 0 rgba(0,0,0,0.6), 0 6px 14px rgba(0,0,0,0.5)",
                }}
            >
                {/* Carved Indian motif ring pattern (uses brand gold) */}
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        background:
                            "repeating-linear-gradient(90deg,transparent 0 22px,rgba(198,161,91,0.22) 22px 23px,transparent 23px 44px)",
                    }}
                />
                {/* Wood grain streaks */}
                <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{
                        background:
                            "repeating-linear-gradient(90deg,rgba(0,0,0,0.4) 0 2px,transparent 2px 12px)",
                    }}
                />
            </div>
            {/* Gold end cap right */}
            <RodCap flipped />
        </div>
    );
}

function RodCap({ flipped = false }: { flipped?: boolean }) {
    return (
        <div
            className="relative h-8 w-8 shrink-0"
            style={{ transform: flipped ? "scaleX(-1)" : undefined }}
        >
            <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
                {/* Base cap */}
                <ellipse cx="12" cy="20" rx="10" ry="14" fill="url(#gold-cap)" />
                {/* Temple-inspired notches */}
                <rect x="4" y="6" width="4" height="4" fill="#7a5a20" />
                <rect x="4" y="30" width="4" height="4" fill="#7a5a20" />
                {/* Finial */}
                <circle cx="30" cy="20" r="5" fill="url(#gold-cap)" />
                <circle cx="30" cy="20" r="2" fill="#2a1405" />
                {/* Inner highlight */}
                <ellipse cx="10" cy="16" rx="3" ry="6" fill="rgba(255,240,200,0.35)" />
            </svg>
        </div>
    );
}

function CornerMandala({ className = "" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 60 60"
            className={`w-12 h-12 stroke-gold/60 fill-none ${className}`}
            strokeWidth="0.8"
        >
            <path d="M2 30 Q2 2 30 2" />
            <path d="M8 30 Q8 8 30 8" />
            <circle cx="8" cy="8" r="1.5" fill="var(--color-gold)" />
            <path d="M2 30 L14 30" />
            <path d="M30 2 L30 14" />
            <path d="M14 14 L18 18" />
        </svg>
    );
}

function SacredOm() {
    return (
        <svg
            viewBox="0 0 60 60"
            className="w-10 h-10 stroke-gold-bright fill-none"
            strokeWidth="1.2"
        >
            <circle cx="30" cy="30" r="14" strokeDasharray="2 3" opacity="0.5" />
            <path d="M20 34 C20 26 30 26 30 32 C30 38 22 40 22 32 M32 30 C38 24 42 32 36 34 M40 22 L44 18 M44 22 L40 18" />
            <circle cx="42" cy="14" r="1.5" fill="var(--color-gold-bright)" />
        </svg>
    );
}

function LotusMark() {
    return (
        <svg
            viewBox="0 0 40 24"
            className="w-8 h-5 stroke-gold/60 fill-none"
            strokeWidth="0.8"
        >
            <path d="M20 22 Q10 14 20 4 Q30 14 20 22 Z" />
            <path d="M20 22 Q4 18 8 6" />
            <path d="M20 22 Q36 18 32 6" />
            <circle cx="20" cy="14" r="1.5" fill="var(--color-gold)" />
        </svg>
    );
}
