"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * ChapterThreads
 *
 * Chapter III — "The Threads That Bind."
 *
 * Motifs:
 *   Pillar I Indian — chakra ring (7 concentric marks) and Kailash triangular horizon
 *   Pillar III Norse — Yggdrasil branching tree of lines
 *
 * Interpretation: Every life is a thread; every thread is anchored to a
 * cosmic axis (Kailash = Yggdrasil = the World Tree in different tongues).
 */
export default function ChapterThreads() {
    return (
        <section
            data-chapter="IV · The Threads"
            className="relative bg-cosmos overflow-hidden py-[144px] px-6"
        >
            {/* Kailash triangular horizon — subtle background */}
            <svg
                aria-hidden
                viewBox="0 0 1440 400"
                preserveAspectRatio="none"
                className="absolute inset-x-0 bottom-0 w-full h-64 opacity-25 pointer-events-none"
            >
                <defs>
                    <linearGradient id="kailash" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-nebula)" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="var(--color-cosmos)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Distant peaks */}
                <path
                    d="M0 400 L200 260 L340 320 L540 200 L720 300 L900 180 L1080 300 L1260 240 L1440 320 L1440 400 Z"
                    fill="url(#kailash)"
                />
                {/* Sacred foreground peak */}
                <path
                    d="M540 400 L720 120 L900 400 Z"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                />
                <line
                    x1="720"
                    y1="120"
                    x2="720"
                    y2="400"
                    stroke="var(--color-gold)"
                    strokeOpacity="0.15"
                    strokeWidth="0.6"
                    strokeDasharray="2 5"
                />
            </svg>

            <div className="relative max-w-6xl mx-auto grid lg:grid-cols-12 gap-[89px] items-center">
                {/* Left — copy */}
                <div className="lg:col-span-6">
                    <motion.p
                        className="utility-label text-gold mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2 }}
                    >
                        IV · The Threads That Bind
                    </motion.p>

                    <motion.h2
                        className="font-monument text-marble uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[0.14em] mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.1 }}
                    >
                        Every life is a
                        <br />
                        <span className="text-gold-bright italic font-editorial normal-case tracking-normal">
                            thread.
                        </span>
                    </motion.h2>

                    <motion.p
                        className="font-editorial text-marble/80 text-xl leading-relaxed max-w-md mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.2 }}
                    >
                        The mystics of the Himalayas call it <em>sūtra</em> — the cord that
                        binds a soul to its axis. The Norse call the same principle
                        <em> Yggdrasil</em>: the world-tree from which every fate hangs.
                    </motion.p>

                    <motion.p
                        className="font-editorial text-marble/70 text-lg leading-relaxed max-w-md mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.3 }}
                    >
                        Different names. One truth. To act correctly is to pull the thread
                        straight — to keep the cord taut between yourself and the origin.
                    </motion.p>

                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.4, delay: 0.4 }}
                    >
                        <span className="h-px w-16 bg-gold/50" />
                        <span className="utility-label text-stone text-[10px]">
                            Sūtra · Yggdrasil · The Cord
                        </span>
                    </motion.div>
                </div>

                {/* Right — chakra + tree composite */}
                <motion.div
                    className="lg:col-span-6 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.94 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.6, ease: [0.22, 0.9, 0.28, 1] }}
                >
                    <div className="relative w-[440px] h-[440px] max-w-[85vw] max-h-[85vw]">
                        {/* Chakra ring */}
                        <svg viewBox="-200 -200 400 400" className="absolute inset-0 w-full h-full">
                            {/* Outer petals — thousand-petal lotus stylization.
                                Rotates slowly — the wheel is always turning. */}
                            <motion.g
                                stroke="var(--color-gold)"
                                strokeWidth="0.6"
                                fill="none"
                                opacity="0.4"
                                style={{ transformOrigin: "center", transformBox: "fill-box" }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 140, ease: "linear", repeat: Infinity }}
                            >
                                {Array.from({ length: 24 }).map((_, i) => {
                                    const a = (i / 24) * Math.PI * 2;
                                    const x = (Math.cos(a) * 180).toFixed(3);
                                    const y = (Math.sin(a) * 180).toFixed(3);
                                    return (
                                        <line key={i} x1={0} y1={0} x2={x} y2={y} strokeDasharray="2 6" />
                                    );
                                })}
                            </motion.g>

                            {/* Concentric chakra rings — seven, one per traditional wheel.
                                They breathe together — subtle expand/contract pulse. */}
                            <motion.g
                                style={{ transformOrigin: "center", transformBox: "fill-box" }}
                                animate={{ scale: [1, 1.015, 1], opacity: [1, 0.85, 1] }}
                                transition={{ duration: 5.4, ease: "easeInOut", repeat: Infinity }}
                            >
                                {[40, 60, 84, 110, 138, 164, 190].map((r, i) => (
                                    <circle
                                        key={r}
                                        cx={0}
                                        cy={0}
                                        r={r}
                                        fill="none"
                                        stroke="var(--color-gold)"
                                        strokeOpacity={0.15 + i * 0.05}
                                        strokeWidth={0.8}
                                    />
                                ))}
                            </motion.g>

                            {/* Cardinal petals — slow counter-rotation vs the outer spokes,
                                creating a gentle cosmic parallax. */}
                            <motion.g
                                style={{ transformOrigin: "center", transformBox: "fill-box" }}
                                animate={{ rotate: -360 }}
                                transition={{ duration: 220, ease: "linear", repeat: Infinity }}
                            >
                                {[0, 60, 120, 180, 240, 300].map((deg) => (
                                    <g key={deg} transform={`rotate(${deg})`}>
                                        <path
                                            d="M0 -190 Q 20 -130 0 -70 Q -20 -130 0 -190"
                                            fill="none"
                                            stroke="var(--color-gold)"
                                            strokeOpacity="0.55"
                                            strokeWidth="1"
                                        />
                                    </g>
                                ))}
                            </motion.g>

                            {/* Root splay — breathes in counter-phase with the branches */}
                            <motion.g
                                stroke="var(--color-gold)"
                                strokeWidth="0.8"
                                fill="none"
                                animate={{ opacity: [0.35, 0.65, 0.35] }}
                                transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity, delay: 2.4 }}
                            >
                                <path d="M0 190 Q -30 210 -60 220" />
                                <path d="M0 190 Q  30 210  60 220" />
                                <path d="M0 190 Q 0 220 0 240" />
                            </motion.g>

                            {/* Center bindu — breathes softly, the wheel's heartbeat */}
                            <motion.circle
                                cx={0}
                                cy={0}
                                r={5}
                                fill="var(--color-gold-bright)"
                                animate={{ scale: [1, 1.35, 1], opacity: [0.9, 1, 0.9] }}
                                transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity }}
                                style={{ transformOrigin: "center", transformBox: "fill-box" }}
                            />
                            <motion.circle
                                cx={0}
                                cy={0}
                                r={12}
                                fill="none"
                                stroke="var(--color-gold-bright)"
                                strokeWidth="0.6"
                                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
                                transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity, delay: 0.15 }}
                                style={{ transformOrigin: "center", transformBox: "fill-box" }}
                            />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
