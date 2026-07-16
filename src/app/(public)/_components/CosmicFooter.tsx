"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * CosmicFooter
 *
 * The page closes with a constellation drawn between distant points. Small
 * navigation links whisper along a horizontal hairline. The brand seal — a
 * circular inscribed stamp — anchors the page's final gravity.
 *
 * Pillars invoked: VII Astronomy (constellations), VIII Ancient (seal).
 */
export default function CosmicFooter() {
    return (
        <footer
            data-chapter="X · The Constellation"
            className="relative bg-void border-t border-gold/15 pt-[89px] pb-[55px] px-6 overflow-hidden"
        >
            {/* Constellation canvas — decorative connect-the-dots */}
            <div className="absolute inset-x-0 top-0 h-64 pointer-events-none opacity-40">
                <Constellation />
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Central seal + wordmark */}
                <motion.div
                    className="text-center mb-[89px] flex flex-col items-center gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4 }}
                >
                    <BrandSeal />
                    <h3 className="font-monument text-marble uppercase tracking-[0.3em] text-lg">
                        Own · Karma
                    </h3>
                    <p className="font-editorial italic text-stone text-base max-w-md">
                        A universe of artifacts, released once.
                    </p>
                </motion.div>

                {/* Whispered navigation */}
                <div className="gold-hairline text-center mb-12">
                    <span className="w-1 h-1 bg-gold rotate-45" />
                </div>

                <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 font-utility text-[11px] tracking-[0.3em] uppercase text-stone">
                    <a href="#manifesto" className="hover:text-gold-bright transition-colors">
                        Manifesto
                    </a>
                    <a href="#" className="hover:text-gold-bright transition-colors">
                        Artifacts
                    </a>
                    <a href="#" className="hover:text-gold-bright transition-colors">
                        The Lexicon
                    </a>
                    <a href="#" className="hover:text-gold-bright transition-colors">
                        Editions
                    </a>
                    <a href="#" className="hover:text-gold-bright transition-colors">
                        Correspondence
                    </a>
                </nav>

                <div className="mt-[55px] flex flex-col md:flex-row items-center justify-between gap-4 font-utility text-[10px] tracking-[0.28em] uppercase text-stone/70">
                    <p>© {new Date().getFullYear()} · Own Karma · Edition One</p>
                    <p className="flex items-center gap-3">
                        <span className="w-1 h-1 bg-gold rotate-45" />
                        Every thread returns.
                        <span className="w-1 h-1 bg-gold rotate-45" />
                    </p>
                </div>
            </div>
        </footer>
    );
}

function BrandSeal() {
    return (
        <svg
            viewBox="-60 -60 120 120"
            className="w-24 h-24 stroke-gold"
            strokeWidth="0.9"
            fill="none"
        >
            <circle cx={0} cy={0} r={54} />
            <circle cx={0} cy={0} r={44} strokeDasharray="2 4" />
            <circle cx={0} cy={0} r={30} />

            {/* Inscription tick marks around the outer band */}
            {Array.from({ length: 24 }).map((_, i) => {
                const a = (i / 24) * Math.PI * 2;
                const x1 = (Math.cos(a) * 44).toFixed(3);
                const y1 = (Math.sin(a) * 44).toFixed(3);
                const x2 = (Math.cos(a) * 54).toFixed(3);
                const y2 = (Math.sin(a) * 54).toFixed(3);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}

            {/* Central monogram — OK woven with an ouroboros hint */}
            <path
                d="M -18 0 A 18 18 0 1 1 18 0 L 14 -4"
                stroke="var(--color-gold-bright)"
                strokeWidth="1.2"
            />
            <path d="M 18 0 L 14 4" stroke="var(--color-gold-bright)" strokeWidth="1.2" />
            <text
                x="0"
                y="1"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="var(--font-monument)"
                fontSize={12}
                letterSpacing={4}
                fill="var(--color-gold-bright)"
            >
                OK
            </text>
        </svg>
    );
}

function Constellation() {
    // Fixed-seed nodes so the constellation is stable across renders.
    const nodes = [
        { x: 6, y: 62 },
        { x: 14, y: 34 },
        { x: 22, y: 68 },
        { x: 30, y: 24 },
        { x: 38, y: 50 },
        { x: 48, y: 20 },
        { x: 55, y: 72 },
        { x: 62, y: 38 },
        { x: 70, y: 60 },
        { x: 78, y: 28 },
        { x: 86, y: 66 },
        { x: 94, y: 42 },
    ];
    const edges: Array<[number, number]> = [
        [0, 1],
        [1, 2],
        [1, 3],
        [3, 4],
        [3, 5],
        [4, 6],
        [5, 7],
        [6, 8],
        [7, 8],
        [8, 9],
        [9, 10],
        [10, 11],
    ];
    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full stroke-gold"
            strokeWidth="0.15"
            fill="none"
        >
            {edges.map(([a, b], i) => (
                <line
                    key={i}
                    x1={nodes[a].x}
                    y1={nodes[a].y}
                    x2={nodes[b].x}
                    y2={nodes[b].y}
                    strokeOpacity="0.5"
                />
            ))}
            {nodes.map((n, i) => (
                <circle
                    key={i}
                    cx={n.x}
                    cy={n.y}
                    r={i % 3 === 0 ? 0.8 : 0.4}
                    fill="var(--color-gold-bright)"
                />
            ))}
        </svg>
    );
}
