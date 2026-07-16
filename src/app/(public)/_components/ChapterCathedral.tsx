"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * ChapterCathedral
 *
 * Chapter V — "The Cathedral of Time."
 *
 * Motifs:
 *   Pillar V Gothic — pointed arches, rose window
 *   Pillar VIII Ancient — Roman marble plinth, seal-like inscribed stamp
 *
 * Interpretation: A garment can be a chapel. Silence has architecture.
 * This section previews the first artifact — but framed as an object of
 * reverence, not a product tile.
 */
export default function ChapterCathedral() {
    const artifacts = [
        {
            name: "The First Vestment",
            subtitle: "Nimbus · I",
            edition: "037 / 108",
            material: "Selvedge Cotton · Hand-Bleached",
        },
        {
            name: "The Silent Column",
            subtitle: "Stylite · II",
            edition: "021 / 108",
            material: "Wool · Cashmere Blend",
        },
        {
            name: "The Marble Standard",
            subtitle: "Cardo · III",
            edition: "008 / 108",
            material: "Linen · Undyed",
        },
    ];

    return (
        <section
            data-chapter="VI · The Cathedral"
            className="relative bg-cosmos py-[144px] px-6 overflow-hidden"
        >
            {/* Rose window backdrop */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-10">
                <RoseWindow size={640} />
            </div>

            <div className="relative max-w-6xl mx-auto">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4 }}
                >
                    <p className="utility-label text-gold mb-6">VI · The Cathedral of Time</p>
                    <h2 className="font-monument text-marble uppercase text-4xl sm:text-5xl md:text-6xl tracking-[0.14em] leading-[1.05]">
                        The First
                        <br />
                        <span className="text-gold-bright italic font-editorial normal-case tracking-normal">
                            artifacts.
                        </span>
                    </h2>
                    <p className="mt-8 font-editorial text-marble/70 text-lg max-w-xl mx-auto leading-relaxed">
                        Each garment is issued as an edition of one hundred and eight — the
                        sacred count. Inscribed, numbered, and released once.
                    </p>
                </motion.div>

                {/* Three arched artifacts */}
                <div className="grid md:grid-cols-3 gap-[55px] mt-[89px]">
                    {artifacts.map((a, i) => (
                        <motion.article
                            key={a.name}
                            className="group relative"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.4, delay: i * 0.15, ease: [0.22, 0.9, 0.28, 1] }}
                        >
                            <ArtifactArch>
                                {/* Interior — marble plinth silhouette */}
                                <div className="relative w-full h-full flex flex-col items-center justify-end pb-14">
                                    {/* Column silhouette */}
                                    <svg
                                        viewBox="0 0 120 220"
                                        className="absolute inset-x-0 bottom-0 w-full h-full"
                                        fill="none"
                                    >
                                        <defs>
                                            <linearGradient id={`marble-${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--color-nebula)" stopOpacity="0.6" />
                                                <stop offset="100%" stopColor="var(--color-cosmos)" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M40 220 L40 60 L52 40 L68 40 L80 60 L80 220 Z" fill={`url(#marble-${i})`} />
                                        <path d="M40 60 L80 60" stroke="var(--color-gold)" strokeOpacity="0.4" />
                                        <path d="M52 40 L68 40" stroke="var(--color-gold)" strokeOpacity="0.4" />
                                        {/* Flutes */}
                                        {[48, 54, 60, 66, 72].map((x) => (
                                            <line
                                                key={x}
                                                x1={x}
                                                y1={60}
                                                x2={x}
                                                y2={220}
                                                stroke="var(--color-gold)"
                                                strokeOpacity="0.15"
                                            />
                                        ))}
                                        <circle cx={60} cy={50} r={2} fill="var(--color-gold-bright)" />
                                    </svg>

                                    {/* Edition seal */}
                                    <div className="relative z-10 flex flex-col items-center">
                                        <SealStamp />
                                        <p className="mt-4 font-monument uppercase tracking-[0.28em] text-marble text-[13px]">
                                            {a.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </ArtifactArch>

                            <div className="mt-8 text-center">
                                <h3 className="font-monument text-marble uppercase tracking-[0.2em] text-base group-hover:text-gold-bright transition-colors duration-500">
                                    {a.name}
                                </h3>
                                <p className="font-editorial italic text-stone text-base mt-2">
                                    {a.material}
                                </p>
                                <p className="mt-3 utility-label text-gold text-[10px]">
                                    Edition · {a.edition}
                                </p>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {/* Invitation, not command */}
                <motion.div
                    className="mt-[144px] text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4 }}
                >
                    <a
                        href="#"
                        className="group inline-flex items-center gap-4 border border-gold/50 hover:border-gold-bright px-8 py-4 font-utility text-[11px] tracking-[0.35em] uppercase text-marble hover:text-gold-bright transition-colors"
                    >
                        <span>Discover the Artifacts</span>
                        <svg width="24" height="10" viewBox="0 0 24 10" className="stroke-current">
                            <path d="M0 5 H22 M18 1 L22 5 L18 9" fill="none" strokeWidth="1.2" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}

function ArtifactArch({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full aspect-[3/4] overflow-hidden">
            {/* Arch frame — SVG mask */}
            <svg
                viewBox="0 0 120 160"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                aria-hidden
            >
                <path
                    d="M0,160 L0,80 C0,38 38,4 60,4 C82,4 120,38 120,80 L120,160 Z"
                    stroke="currentColor"
                    strokeOpacity="0.45"
                    strokeWidth="0.6"
                />
                {/* Keystone accent */}
                <circle cx="60" cy="4" r="1.2" fill="var(--color-gold-bright)" />
            </svg>
            <div className="absolute inset-0">{children}</div>
        </div>
    );
}

function RoseWindow({ size = 480 }: { size?: number }) {
    const half = size / 2;
    return (
        <svg
            viewBox={`-${half} -${half} ${size} ${size}`}
            width={size}
            height={size}
            className="stroke-gold"
            strokeWidth="0.8"
            fill="none"
        >
            {/* Outer band */}
            <circle cx={0} cy={0} r={half - 8} />
            <circle cx={0} cy={0} r={half - 22} />
            {/* Inner hub */}
            <circle cx={0} cy={0} r={half / 3} />
            <circle cx={0} cy={0} r={half / 6} fill="var(--color-gold-bright)" fillOpacity="0.2" />
            {/* Radial mullions */}
            {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const x1 = (Math.cos(a) * (half / 6)).toFixed(3);
                const y1 = (Math.sin(a) * (half / 6)).toFixed(3);
                const x2 = (Math.cos(a) * (half - 22)).toFixed(3);
                const y2 = (Math.sin(a) * (half - 22)).toFixed(3);
                return <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            {/* Petal quatrefoils */}
            {Array.from({ length: 12 }).map((_, i) => {
                const a = ((i + 0.5) / 12) * Math.PI * 2;
                const cx = (Math.cos(a) * (half / 2 + 20)).toFixed(3);
                const cy = (Math.sin(a) * (half / 2 + 20)).toFixed(3);
                return <circle key={`p${i}`} cx={cx} cy={cy} r={16} />;
            })}
        </svg>
    );
}

function SealStamp() {
    return (
        <svg viewBox="-40 -40 80 80" width="72" height="72" fill="none" className="stroke-gold" strokeWidth="1">
            <circle cx={0} cy={0} r={34} />
            <circle cx={0} cy={0} r={28} strokeDasharray="2 4" />
            <circle cx={0} cy={0} r={16} />
            {/* Inscription arc marks */}
            {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                const x1 = (Math.cos(a) * 28).toFixed(3);
                const y1 = (Math.sin(a) * 28).toFixed(3);
                const x2 = (Math.cos(a) * 34).toFixed(3);
                const y2 = (Math.sin(a) * 34).toFixed(3);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
            {/* Ouroboros hint at core */}
            <path d="M -10 -2 A 10 10 0 1 1 10 -2 L 8 -6 M 10 -2 L 6 -3" />
        </svg>
    );
}
