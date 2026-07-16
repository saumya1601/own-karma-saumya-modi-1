"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * ChapterLabyrinth
 *
 * Chapter IV — "The Path That Returns."
 *
 * Motifs:
 *   Pillar II Greek — labyrinth meander (horizontal repeating divider)
 *   Pillar IV Egyptian — Eye of Horus, sun disk over pyramid horizon
 *
 * Interpretation: In every ancient culture the path was drawn as a maze
 * that led back to its own center. To go far is to return home.
 */
export default function ChapterLabyrinth() {
    return (
        <section
            data-chapter="V · The Path"
            className="relative bg-void py-[144px] px-6 overflow-hidden"
        >
            {/* Egyptian horizon backdrop — pyramid silhouettes + rising sun disk */}
            <div className="absolute inset-x-0 top-0 h-[420px] pointer-events-none opacity-40">
                <svg
                    viewBox="0 0 1440 420"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                >
                    {/* Sun disk */}
                    <circle
                        cx="720"
                        cy="220"
                        r="90"
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeWidth="1"
                        strokeOpacity="0.6"
                    />
                    <circle
                        cx="720"
                        cy="220"
                        r="60"
                        fill="var(--color-gold)"
                        opacity="0.06"
                    />
                    <circle cx="720" cy="220" r="4" fill="var(--color-gold-bright)" />

                    {/* Rays */}
                    <g stroke="var(--color-gold)" strokeOpacity="0.3" strokeWidth="0.6">
                        {Array.from({ length: 16 }).map((_, i) => {
                            const a = (i / 16) * Math.PI * 2;
                            const x1 = (720 + Math.cos(a) * 100).toFixed(3);
                            const y1 = (220 + Math.sin(a) * 100).toFixed(3);
                            const x2 = (720 + Math.cos(a) * 140).toFixed(3);
                            const y2 = (220 + Math.sin(a) * 140).toFixed(3);
                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                        })}
                    </g>

                    {/* Pyramid silhouettes */}
                    <path
                        d="M0 420 L360 260 L720 400 L1080 240 L1440 420 Z"
                        fill="var(--color-cosmos)"
                        opacity="0.9"
                    />
                    <path
                        d="M240 420 L420 220 L600 420 Z"
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeOpacity="0.35"
                        strokeWidth="0.8"
                    />
                    <path
                        d="M900 420 L1080 240 L1260 420 Z"
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeOpacity="0.35"
                        strokeWidth="0.8"
                    />
                </svg>
            </div>

            <div className="relative max-w-6xl mx-auto pt-[89px]">
                {/* Chapter label */}
                <motion.div
                    className="flex items-center gap-4 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2 }}
                >
                    <EyeOfHorus />
                    <p className="utility-label text-gold">V · The Path That Returns</p>
                </motion.div>

                <motion.h2
                    className="font-monument text-marble uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[0.14em] mb-12 max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4, delay: 0.1 }}
                >
                    To go far is to
                    <br />
                    <span className="text-gold-bright italic font-editorial normal-case tracking-normal">
                        arrive at yourself.
                    </span>
                </motion.h2>

                <div className="grid lg:grid-cols-12 gap-[89px] items-start">
                    <motion.div
                        className="lg:col-span-7"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.2 }}
                    >
                        <p className="font-editorial text-marble/85 text-xl leading-relaxed mb-6">
                            In Crete, they drew the path as a labyrinth. In Thebes, as an eye.
                            Both taught the same lesson: the way out is the way in.
                        </p>
                        <p className="font-editorial text-marble/70 text-lg leading-relaxed">
                            Karma follows the same geometry. What is sent walks a long
                            corridor of consequence and returns, without fail, to the
                            doorway it left.
                        </p>
                    </motion.div>

                    <motion.div
                        className="lg:col-span-5 flex justify-center"
                        initial={{ opacity: 0, scale: 0.94 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.6, ease: [0.22, 0.9, 0.28, 1] }}
                    >
                        <ClassicalLabyrinth />
                    </motion.div>
                </div>

                {/* Meander divider — Greek key motif */}
                <motion.div
                    className="mt-[89px]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.6, delay: 0.2 }}
                >
                    <MeanderDivider />
                </motion.div>
            </div>
        </section>
    );
}

function EyeOfHorus() {
    return (
        <svg
            viewBox="0 0 50 30"
            width="50"
            height="30"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 15 Q 12 4 25 4 Q 40 4 48 15 Q 40 26 25 26 Q 12 26 2 15 Z" />
            <circle cx="25" cy="15" r="4.5" fill="var(--color-gold)" stroke="none" />
            <circle cx="25" cy="15" r="2" fill="var(--color-void)" stroke="none" />
            {/* Marking below */}
            <path d="M25 26 L22 30" />
            <path d="M38 22 Q 44 26 44 32" />
        </svg>
    );
}

function ClassicalLabyrinth() {
    // 7-circuit Cretan labyrinth built parametrically from concentric arcs.
    const rings = [30, 44, 58, 72, 86, 100, 114];
    return (
        <svg
            viewBox="-140 -140 280 280"
            className="w-[300px] h-[300px] max-w-[80vw] max-h-[80vw] stroke-gold"
            strokeWidth="1.4"
            fill="none"
        >
            {/* Concentric arcs — alternate opening on top and bottom to form the classic meander */}
            {rings.map((r, i) => {
                const isTop = i % 2 === 0;
                const d = isTop
                    ? `M ${-r} 0 A ${r} ${r} 0 1 1 ${r} 0`
                    : `M ${r} 0 A ${r} ${r} 0 1 1 ${-r} 0`;
                return <path key={r} d={d} />;
            })}

            {/* Vertical spine connecting the arcs — the "path" */}
            {rings.map((r, i) => {
                const next = rings[i + 1];
                if (!next) return null;
                const isTop = i % 2 === 0;
                const y1 = isTop ? 0 : 0;
                const x1 = isTop ? -r : r;
                const x2 = isTop ? -next : next;
                return <line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y1} />;
            })}

            {/* Bridging vertical segments */}
            <line x1={-30} y1={0} x2={-114} y2={0} strokeOpacity="0.0" />
            <path d="M -30 0 L -44 0" />
            <path d="M -58 0 L -72 0" />
            <path d="M -86 0 L -100 0" />
            <path d="M 30 0 L 44 0" />
            <path d="M 58 0 L 72 0" />
            <path d="M 86 0 L 100 0" />

            {/* Center — the arrival */}
            <circle cx="0" cy="0" r="6" fill="var(--color-gold-bright)" stroke="none" />
            <circle cx="0" cy="0" r="14" fill="none" stroke="var(--color-gold-bright)" strokeOpacity="0.6" />
        </svg>
    );
}

function MeanderDivider() {
    // Greek key / meander pattern — repeating decorative border.
    return (
        <svg
            viewBox="0 0 400 24"
            preserveAspectRatio="xMidYMid meet"
            className="w-full max-w-3xl mx-auto h-6 stroke-gold"
            strokeWidth="1"
            fill="none"
        >
            <defs>
                <pattern id="meander" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse">
                    <path d="M0 22 L0 4 L36 4 L36 18 L12 18 L12 10 L28 10 L28 14 L20 14 L20 12" />
                </pattern>
            </defs>
            <rect width="400" height="24" fill="url(#meander)" opacity="0.8" />
        </svg>
    );
}
