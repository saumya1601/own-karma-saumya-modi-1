"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Preloader — the "ritual of entry".
 *
 * A Flower of Life geometric figure draws itself in gold, ringed by an outer
 * mandala. The brand mark rises through it as a whispered wordmark, then the
 * whole veil dissolves upward as if the universe is opening.
 *
 * Pillars invoked: VI (Sacred Geometry), I (Indian mandala), IX (∞).
 */
export default function Preloader() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Lock scroll during the ritual.
        document.body.style.overflow = "hidden";
        const t = window.setTimeout(() => {
            setVisible(false);
            document.body.style.overflow = "";
        }, 4200);
        return () => {
            window.clearTimeout(t);
            document.body.style.overflow = "";
        };
    }, []);

    // Six-around-one hexagonal centers for the Flower of Life.
    const R = 60;
    const centers = [
        { x: 0, y: 0 },
        { x: R, y: 0 },
        { x: -R, y: 0 },
        { x: R / 2, y: (R * Math.sqrt(3)) / 2 },
        { x: -R / 2, y: (R * Math.sqrt(3)) / 2 },
        { x: R / 2, y: -(R * Math.sqrt(3)) / 2 },
        { x: -R / 2, y: -(R * Math.sqrt(3)) / 2 },
    ];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="preloader"
                    className="fixed inset-0 z-[100] bg-void flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: "-30%" }}
                    transition={{ duration: 1.2, ease: [0.22, 0.9, 0.28, 1] }}
                >
                    {/* Faint mandala halo */}
                    <motion.div
                        className="absolute w-[520px] h-[520px] max-w-[85vw] max-h-[85vw] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle,rgba(198,161,91,0.10) 0%,transparent 60%)",
                        }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.6, ease: "easeOut" }}
                    />

                    {/* Flower of Life SVG */}
                    <svg
                        viewBox="-160 -160 320 320"
                        className="relative w-[320px] h-[320px] max-w-[70vw] max-h-[70vw]"
                    >
                        {/* Outer mandala ring */}
                        <motion.circle
                            cx={0}
                            cy={0}
                            r={140}
                            fill="none"
                            stroke="var(--color-gold)"
                            strokeWidth={0.6}
                            strokeDasharray="2 4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.5 }}
                            transition={{ duration: 2.2, ease: "easeInOut" }}
                        />
                        <motion.circle
                            cx={0}
                            cy={0}
                            r={125}
                            fill="none"
                            stroke="var(--color-gold)"
                            strokeWidth={0.6}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.6 }}
                            transition={{ duration: 2.2, ease: "easeInOut", delay: 0.1 }}
                        />

                        {/* Seed / Flower of Life */}
                        {centers.map((c, i) => (
                            <motion.circle
                                key={i}
                                cx={c.x}
                                cy={c.y}
                                r={R}
                                fill="none"
                                stroke="var(--color-gold)"
                                strokeWidth={1.2}
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 0.9 }}
                                transition={{
                                    duration: 1.8,
                                    ease: [0.22, 0.9, 0.28, 1],
                                    delay: 0.2 + i * 0.18,
                                }}
                            />
                        ))}

                        {/* Central point */}
                        <motion.circle
                            cx={0}
                            cy={0}
                            r={2.4}
                            fill="var(--color-gold-bright)"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 2.4 }}
                        />
                    </svg>

                    {/* Whispered wordmark rising through the flower */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.4, delay: 2.6 }}
                    >
                        <p className="utility-label text-gold/70 mb-4">Ritual of Entry</p>
                        <h1 className="font-monument tracking-[0.3em] text-marble text-lg sm:text-xl">
                            OWN &nbsp;·&nbsp; KARMA
                        </h1>
                        <div className="mt-4 w-16 h-px bg-gold/40" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
