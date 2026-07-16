"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * KarmicLoop
 *
 * Chapter VII (closing) — "The Circle Completes."
 *
 * Motifs:
 *   Pillar IX Philosophy — ouroboros (serpent devouring its tail), ∞, duality
 *   Pillar VII Astronomy — orbital echo (returns to hero's eclipse)
 *
 * This is where the page's argument comes home. The visitor entered through
 * an eclipse; they exit through a serpent that swallows its own tail. Same
 * shape. Same lesson. The circle closes.
 */
export default function KarmicLoop() {
    return (
        <section
            data-chapter="VIII · The Circle"
            className="relative bg-void py-[144px] px-6 overflow-hidden flex items-center justify-center min-h-screen"
        >
            {/* Distant orbit — echoes the hero eclipse */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                    className="w-[900px] h-[900px] max-w-[130vw] max-h-[130vw] rounded-full"
                    style={{
                        background:
                            "radial-gradient(circle,transparent 55%,rgba(198,161,91,0.10) 60%,transparent 66%)",
                    }}
                />
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
                <motion.p
                    className="utility-label text-gold mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2 }}
                >
                    VIII · The Karmic Loop
                </motion.p>

                <motion.h2
                    className="font-monument text-marble uppercase text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[0.14em] mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4, delay: 0.1 }}
                >
                    What you send out
                    <br />
                    <span className="text-gold-bright italic font-editorial normal-case tracking-normal">
                        comes home.
                    </span>
                </motion.h2>

                <motion.div
                    className="my-[89px] flex justify-center"
                    initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 2.2, ease: [0.22, 0.9, 0.28, 1] }}
                >
                    <Ouroboros />
                </motion.div>

                <motion.p
                    className="font-editorial italic text-marble/85 text-xl sm:text-2xl leading-relaxed max-w-2xl mx-auto mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4, delay: 0.2 }}
                >
                    The eclipse at the top of this page and the serpent at the bottom
                    are the same figure drawn in different tongues. Both close on
                    themselves. Both promise a return.
                </motion.p>

                <motion.p
                    className="font-editorial text-marble/60 text-lg leading-relaxed max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4, delay: 0.3 }}
                >
                    Choose what you send.
                </motion.p>

                <motion.div
                    className="mt-[89px] flex items-center justify-center gap-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4, delay: 0.4 }}
                >
                    <span className="h-px w-16 bg-gold/40" />
                    <InfinityMark />
                    <span className="h-px w-16 bg-gold/40" />
                </motion.div>
            </div>
        </section>
    );
}

function Ouroboros() {
    return (
        <svg
            viewBox="-140 -140 280 280"
            className="w-[320px] h-[320px] max-w-[80vw] max-h-[80vw]"
            fill="none"
        >
            {/* Faint outer aura */}
            <circle cx={0} cy={0} r={128} stroke="var(--color-gold)" strokeOpacity="0.15" strokeWidth="0.8" strokeDasharray="2 6" />

            {/* Serpent body — thick gold band */}
            <motion.circle
                cx={0}
                cy={0}
                r={100}
                stroke="var(--color-gold)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="595"
                strokeDashoffset={40}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.9 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2.4, ease: [0.22, 0.9, 0.28, 1] }}
            />

            {/* Scale texture — dashes along the band */}
            <circle
                cx={0}
                cy={0}
                r={100}
                stroke="var(--color-void)"
                strokeWidth="1"
                strokeDasharray="1 8"
                strokeOpacity="0.6"
            />

            {/* Head — swallowing the tail */}
            <g transform="rotate(0)">
                <circle cx={100} cy={0} r={16} fill="var(--color-gold)" />
                <circle cx={100} cy={0} r={16} fill="none" stroke="var(--color-void)" strokeWidth="0.8" />
                {/* Fangs / mouth */}
                <path d="M92 -6 L100 -14 L108 -6 Z" fill="var(--color-void)" />
                <path d="M92 6 L100 14 L108 6 Z" fill="var(--color-void)" />
                {/* Eye */}
                <circle cx={102} cy={-4} r={2} fill="var(--color-gold-bright)" />
                <circle cx={102} cy={-4} r={0.8} fill="var(--color-void)" />
            </g>

            {/* Tail — enters the mouth */}
            <path
                d="M 84 4 L 92 0 L 84 -4"
                fill="none"
                stroke="var(--color-void)"
                strokeWidth="1.2"
            />

            {/* Center — infinity sigil */}
            <g stroke="var(--color-gold-bright)" strokeWidth="1.4" fill="none">
                <path d="M -30 0 C -30 -14, -10 -14, 0 0 C 10 14, 30 14, 30 0 C 30 -14, 10 -14, 0 0 C -10 14, -30 14, -30 0 Z" />
            </g>
        </svg>
    );
}

function InfinityMark() {
    return (
        <svg viewBox="0 0 40 20" width="40" height="20" fill="none" className="stroke-gold-bright" strokeWidth="1.2">
            <path d="M8 10 C 8 4, 16 4, 20 10 C 24 16, 32 16, 32 10 C 32 4, 24 4, 20 10 C 16 16, 8 16, 8 10 Z" />
        </svg>
    );
}
