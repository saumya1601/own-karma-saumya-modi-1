"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * SymbolLexicon
 *
 * The Rosetta Stone of the brand. Every mythological pillar's key motif is
 * catalogued here, drawn in the same thin-line gold dialect. Hovering a cell
 * reveals its name, tradition, and meaning — the promise the brief made:
 * "every symbol earns its place, and each is findable."
 *
 * Contains at least one motif from every one of the Nine Pillars.
 */
type Symbol = {
    key: string;
    name: string;
    tradition: string;
    meaning: string;
    pillar: string;
    draw: () => React.ReactNode;
};

const symbols: Symbol[] = [
    {
        key: "lotus",
        name: "Padma",
        tradition: "Indian",
        meaning: "The self, opening upward through dark water toward light.",
        pillar: "I",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <path
                        key={deg}
                        d="M0 -22 Q 6 -8 0 6 Q -6 -8 0 -22"
                        transform={`rotate(${deg})`}
                    />
                ))}
                <circle cx={0} cy={0} r={2} fill="currentColor" />
            </g>
        ),
    },
    {
        key: "labyrinth",
        name: "Meander",
        tradition: "Greek",
        meaning: "The winding path that returns to its center. All journeys arrive.",
        pillar: "II",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1.2" fill="none">
                <path d="M-22 22 L-22 -22 L22 -22 L22 12 L-12 12 L-12 -12 L12 -12 L12 2 L-2 2" />
            </g>
        ),
    },
    {
        key: "vegvisir",
        name: "Vegvísir",
        tradition: "Norse",
        meaning: "The way-finder. Even in the dark, find your bearing.",
        pillar: "III",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
                {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i / 8) * Math.PI * 2;
                    const x = (Math.cos(a) * 20).toFixed(3);
                    const y = (Math.sin(a) * 20).toFixed(3);
                    return (
                        <g key={i}>
                            <line x1={0} y1={0} x2={x} y2={y} />
                            <circle cx={x} cy={y} r={2} fill="currentColor" />
                        </g>
                    );
                })}
                <circle cx={0} cy={0} r={3} fill="currentColor" />
            </g>
        ),
    },
    {
        key: "eye",
        name: "Wedjat",
        tradition: "Egyptian",
        meaning: "The eye that heals — protection, wholeness, restoration.",
        pillar: "IV",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
                <path d="M-22 0 Q -10 -14 4 -14 Q 20 -14 24 0 Q 20 12 4 12 Q -10 12 -22 0 Z" />
                <circle cx={4} cy={0} r={4} fill="currentColor" stroke="none" />
                <path d="M4 12 L0 20" />
                <path d="M20 8 Q 26 12 26 20" />
            </g>
        ),
    },
    {
        key: "arch",
        name: "Ogive",
        tradition: "Gothic",
        meaning: "The pointed arch that lifts weight toward transcendence.",
        pillar: "V",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1.2" fill="none">
                <path d="M-20 22 L-20 -4 Q -20 -22 0 -22 Q 20 -22 20 -4 L20 22" />
                <path d="M-20 8 L20 8" />
                <circle cx={0} cy={-22} r={1.5} fill="currentColor" stroke="none" />
            </g>
        ),
    },
    {
        key: "seed",
        name: "Seed of Life",
        tradition: "Sacred Geometry",
        meaning: "Six worlds around one — the geometry from which everything unfolds.",
        pillar: "VI",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1" fill="none">
                {[
                    [0, 0],
                    [12, 0],
                    [-12, 0],
                    [6, 10.4],
                    [-6, 10.4],
                    [6, -10.4],
                    [-6, -10.4],
                ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r={12} />
                ))}
            </g>
        ),
    },
    {
        key: "constellation",
        name: "Constellation",
        tradition: "Astronomy",
        meaning: "The map of night — meaning drawn between distant points.",
        pillar: "VII",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round">
                <line x1={-20} y1={-14} x2={-6} y2={-6} />
                <line x1={-6} y1={-6} x2={8} y2={-14} />
                <line x1={8} y1={-14} x2={16} y2={4} />
                <line x1={16} y1={4} x2={2} y2={14} />
                <line x1={2} y1={14} x2={-14} y2={8} />
                <line x1={-14} y1={8} x2={-6} y2={-6} />
                {[
                    [-20, -14],
                    [-6, -6],
                    [8, -14],
                    [16, 4],
                    [2, 14],
                    [-14, 8],
                ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={1.6} fill="currentColor" />
                ))}
            </g>
        ),
    },
    {
        key: "seal",
        name: "Sigillum",
        tradition: "Ancient Civilizations",
        meaning: "The circular seal — origin and authenticity, pressed into wax.",
        pillar: "VIII",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1" fill="none">
                <circle cx={0} cy={0} r={22} />
                <circle cx={0} cy={0} r={16} strokeDasharray="2 3" />
                {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i / 12) * Math.PI * 2;
                    const x1 = (Math.cos(a) * 16).toFixed(3);
                    const y1 = (Math.sin(a) * 16).toFixed(3);
                    const x2 = (Math.cos(a) * 22).toFixed(3);
                    const y2 = (Math.sin(a) * 22).toFixed(3);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                })}
                <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="currentColor"
                    fontFamily="var(--font-monument)"
                    fontSize={9}
                    letterSpacing={2}
                >
                    OK
                </text>
            </g>
        ),
    },
    {
        key: "ouroboros",
        name: "Ouroboros",
        tradition: "Philosophy · Symbolism",
        meaning: "The serpent that eats its tail. What is sent returns.",
        pillar: "IX",
        draw: () => (
            <g stroke="currentColor" strokeWidth="1.4" fill="none">
                <circle cx={0} cy={0} r={20} />
                <circle cx={20} cy={0} r={3} fill="currentColor" stroke="none" />
                <path d="M20 -3 L26 -6" />
                <path d="M20 3 L26 6" />
            </g>
        ),
    },
];

export default function SymbolLexicon() {
    const [active, setActive] = useState<Symbol | null>(null);

    return (
        <section
            data-chapter="IX · The Lexicon"
            className="relative bg-cosmos py-[144px] px-6"
        >
            <div className="max-w-6xl mx-auto">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4 }}
                >
                    <p className="utility-label text-gold mb-6">
                        IX · The Symbol Lexicon
                    </p>
                    <h2 className="font-monument text-marble uppercase text-4xl sm:text-5xl md:text-6xl tracking-[0.14em] leading-[1.05]">
                        Nothing is decoration.
                        <br />
                        <span className="text-gold-bright italic font-editorial normal-case tracking-normal">
                            Everything is language.
                        </span>
                    </h2>
                    <p className="mt-8 font-editorial text-marble/70 text-lg max-w-2xl mx-auto leading-relaxed">
                        Hover any glyph to read the tradition it belongs to and the meaning
                        it carries. Every symbol on this page appears here.
                    </p>
                </motion.div>

                {/* Grid — 3×3 lexicon of the nine pillars */}
                <div className="grid grid-cols-3 lg:grid-cols-9 gap-6">
                    {symbols.map((s, i) => (
                        <motion.button
                            type="button"
                            key={s.key}
                            onMouseEnter={() => setActive(s)}
                            onMouseLeave={() => setActive(null)}
                            onFocus={() => setActive(s)}
                            onBlur={() => setActive(null)}
                            className="group aspect-square flex items-center justify-center relative border border-gold/15 hover:border-gold-bright/60 bg-void/40 text-gold hover:text-gold-bright transition-colors cursor-help"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                        >
                            <svg
                                viewBox="-30 -30 60 60"
                                className="w-14 h-14 transition-transform duration-700 group-hover:scale-110"
                            >
                                {s.draw()}
                            </svg>
                            <span className="absolute top-1.5 left-2 utility-label text-[8px] text-stone/70">
                                {s.pillar}
                            </span>
                        </motion.button>
                    ))}
                </div>

                {/* Hover readout */}
                <div className="mt-[89px] min-h-[120px] max-w-2xl mx-auto text-center">
                    {active ? (
                        <motion.div
                            key={active.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <p className="utility-label text-gold text-[10px] mb-3">
                                Pillar {active.pillar} · {active.tradition}
                            </p>
                            <h3 className="font-monument text-marble uppercase text-2xl tracking-[0.2em] mb-4">
                                {active.name}
                            </h3>
                            <p className="font-editorial italic text-marble/80 text-lg leading-relaxed">
                                {active.meaning}
                            </p>
                        </motion.div>
                    ) : (
                        <p className="font-editorial italic text-stone/60 text-lg">
                            Hover a glyph to read its meaning.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
