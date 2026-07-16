"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * ChapterGeometry
 *
 * Chapter VI — "The Universe Is Measured."
 *
 * Motifs:
 *   Pillar VI Sacred Geometry — Fibonacci spiral that draws itself, φ ratio,
 *   Metatron's-cube-adjacent hexagram, Seed of Life.
 *
 * Interpretation: The typography, spacing, and layout of this entire page
 * literally embody the golden ratio. This section is the reveal — the math
 * that has been ordering everything the visitor has read so far.
 */
export default function ChapterGeometry() {
    return (
        <section
            data-chapter="VII · The Measure"
            className="relative bg-void py-[144px] px-6 overflow-hidden"
        >
            <div className="relative max-w-6xl mx-auto grid lg:grid-cols-12 gap-[89px] items-center">
                {/* Left — spiral / seed of life */}
                <motion.div
                    className="lg:col-span-6 flex justify-center"
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.6, ease: [0.22, 0.9, 0.28, 1] }}
                >
                    <FibonacciComposite />
                </motion.div>

                {/* Right — copy */}
                <div className="lg:col-span-6">
                    <motion.p
                        className="utility-label text-gold mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2 }}
                    >
                        VII · The Universe Is Measured
                    </motion.p>

                    <motion.h2
                        className="font-monument text-marble uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[0.14em] mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.1 }}
                    >
                        The universe
                        <br />
                        <span className="text-gold-bright italic font-editorial normal-case tracking-normal">
                            has a number.
                        </span>
                    </motion.h2>

                    <motion.p
                        className="font-editorial text-marble/80 text-xl leading-relaxed max-w-md mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.2 }}
                    >
                        One point six one eight. The proportion of a nautilus, a galaxy&apos;s
                        arm, the ratio between the length of your finger bones.
                    </motion.p>

                    <motion.p
                        className="font-editorial text-marble/70 text-lg leading-relaxed max-w-md mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.3 }}
                    >
                        This entire page is composed to it. The type sizes, the spacing,
                        the rhythm between chapters — φ orders everything. You have been
                        reading a geometry lesson without knowing it.
                    </motion.p>

                    <motion.div
                        className="grid grid-cols-3 gap-[21px] pt-[21px] border-t border-gold/20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.4 }}
                    >
                        <RatioCell numeric="φ" label="1.618" />
                        <RatioCell numeric="Fφ" label="Fibonacci" />
                        <RatioCell numeric="∞" label="Recursion" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function RatioCell({ numeric, label }: { numeric: string; label: string }) {
    return (
        <div>
            <p className="font-monument text-gold-bright text-3xl">{numeric}</p>
            <p className="utility-label text-stone mt-2">{label}</p>
        </div>
    );
}

function FibonacciComposite() {
    // Fibonacci squares & spiral computed from φ-based ratios.
    // Squares: 1, 1, 2, 3, 5, 8, 13, 21 — scaled to fit a 320-unit viewbox.
    const s = 8;
    const squares = [
        { x: 0, y: 0, w: 13 * s, h: 13 * s },      // largest — top-left
        { x: 13 * s, y: 0, w: 8 * s, h: 8 * s },    // right of it
        { x: 13 * s, y: 8 * s, w: 5 * s, h: 5 * s },
        { x: 18 * s, y: 8 * s, w: 3 * s, h: 3 * s },
        { x: 18 * s, y: 11 * s, w: 2 * s, h: 2 * s },
        { x: 20 * s, y: 11 * s, w: 1 * s, h: 1 * s },
        { x: 20 * s, y: 12 * s, w: 1 * s, h: 1 * s },
    ];

    // Spiral drawn as concentric quarter-arcs anchored to each square's corner.
    // We approximate the classic golden spiral traversing the squares.
    const arcs = [
        // biggest arc — sweeps from top-right to bottom-left of the 13s square
        { d: `M ${13 * s} 0 A ${13 * s} ${13 * s} 0 0 0 0 ${13 * s}` },
        // next in 8s square
        { d: `M ${13 * s} 0 A ${8 * s} ${8 * s} 0 0 1 ${21 * s} ${8 * s}` },
        // 5s
        { d: `M ${21 * s} ${8 * s} A ${5 * s} ${5 * s} 0 0 1 ${16 * s} ${13 * s}` },
        // 3s
        { d: `M ${16 * s} ${13 * s} A ${3 * s} ${3 * s} 0 0 1 ${13 * s} ${10 * s}` },
        // 2s
        { d: `M ${13 * s} ${10 * s} A ${2 * s} ${2 * s} 0 0 1 ${15 * s} ${8 * s}` },
    ];

    return (
        <svg
            viewBox="-20 -20 200 200"
            className="w-[420px] h-[420px] max-w-[85vw] max-h-[85vw]"
            fill="none"
        >
            {/* Background Seed of Life halo */}
            <g opacity="0.2">
                {[
                    [80, 60],
                    [104, 74],
                    [104, 102],
                    [80, 116],
                    [56, 102],
                    [56, 74],
                    [80, 88],
                ].map(([cx, cy], i) => (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={14}
                        stroke="var(--color-gold)"
                        strokeWidth="0.5"
                    />
                ))}
            </g>

            {/* Fibonacci squares */}
            {squares.map((sq, i) => (
                <g key={i}>
                    <rect
                        x={sq.x}
                        y={sq.y}
                        width={sq.w}
                        height={sq.h}
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeOpacity="0.35"
                        strokeWidth="0.6"
                    />
                    <text
                        x={sq.x + sq.w / 2}
                        y={sq.y + sq.h / 2}
                        fill="var(--color-gold)"
                        opacity="0.35"
                        fontFamily="var(--font-monument)"
                        fontSize={Math.max(3, Math.min(sq.w, sq.h) / 4)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        {[13, 8, 5, 3, 2, 1, 1][i]}
                    </text>
                </g>
            ))}

            {/* Spiral */}
            <g stroke="var(--color-gold-bright)" strokeWidth="1.1" fill="none">
                {arcs.map((a, i) => (
                    <motion.path
                        key={i}
                        d={a.d}
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 2.2, delay: 0.2 + i * 0.15, ease: "easeInOut" }}
                    />
                ))}
            </g>

            {/* φ marker */}
            <text
                x={80}
                y={88}
                fill="var(--color-gold-bright)"
                fontFamily="var(--font-monument)"
                fontSize={7}
                textAnchor="middle"
                dominantBaseline="middle"
            >
                φ
            </text>
        </svg>
    );
}
