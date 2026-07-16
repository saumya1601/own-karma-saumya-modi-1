"use client";

import React, { useEffect, useState } from "react";

/**
 * Vegvísir Scroll Progress
 *
 * A Norse Vegvísir ("wayfinder") sigil fixed to the corner of the viewport.
 * The outer arc fills as the visitor descends through the page — the sigil
 * literally *guides* them through the journey.
 *
 * Pillar invoked: III (Norse) + III/VII (compass + celestial navigation).
 */
export default function VegvisirProgress() {
    const [progress, setProgress] = useState(0);
    const [chapter, setChapter] = useState("");

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const doc = document.documentElement;
                const scrollTop = window.scrollY;
                const height = doc.scrollHeight - window.innerHeight;
                setProgress(height > 0 ? Math.min(1, scrollTop / height) : 0);

                // Chapter label from data-chapter attributes on sections.
                const sections = document.querySelectorAll<HTMLElement>("[data-chapter]");
                let current = "";
                const y = scrollTop + window.innerHeight * 0.35;
                sections.forEach((s) => {
                    if (s.offsetTop <= y) current = s.dataset.chapter ?? current;
                });
                setChapter(current);
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    const circumference = 2 * Math.PI * 34;
    const offset = circumference * (1 - progress);

    const scrollToTop = () => {
        // Custom animated scroll — browser's native behavior:"smooth" is
        // implementation-dependent and often feels either abrupt or sluggish.
        // This gives us a controlled ~1.2s cinematic easeInOutCubic curve.
        const start = window.scrollY;
        if (start === 0) return;

        const duration = Math.min(1600, Math.max(700, start * 0.6));
        const startTime = performance.now();
        const easeInOutCubic = (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const step = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            const eased = easeInOutCubic(t);
            window.scrollTo(0, start * (1 - eased));
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-4 select-none">
            <div className="text-right pointer-events-none">
                <p className="utility-label text-stone text-[10px]">
                    {chapter || "Ritual of Entry"}
                </p>
                <p className="font-monument text-gold text-[11px] tracking-[0.3em] mt-1">
                    {String(Math.round(progress * 100)).padStart(2, "0")}
                </p>
            </div>

            {/* Vegvísir sigil — click to return to the beginning */}
            <button
                type="button"
                onClick={scrollToTop}
                aria-label="Return to the beginning"
                className="group relative w-16 h-16 rounded-full cursor-pointer transition-transform duration-500 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright/60"
            >
                {/* Slow orbiting outer sigil marks */}
                <svg
                    viewBox="-40 -40 80 80"
                    className="absolute inset-0 w-full h-full ok-orbit"
                    style={{ ["--orbit-dur" as string]: "80s" }}
                >
                    {Array.from({ length: 8 }).map((_, i) => {
                        const angle = (i / 8) * Math.PI * 2;
                        const x1 = (Math.cos(angle) * 38).toFixed(3);
                        const y1 = (Math.sin(angle) * 38).toFixed(3);
                        const x2 = (Math.cos(angle) * 34).toFixed(3);
                        const y2 = (Math.sin(angle) * 34).toFixed(3);
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="var(--color-gold)"
                                strokeOpacity={0.5}
                                strokeWidth={1}
                            />
                        );
                    })}
                </svg>

                {/* Progress ring */}
                <svg viewBox="-40 -40 80 80" className="absolute inset-0 w-full h-full">
                    <circle
                        cx={0}
                        cy={0}
                        r={34}
                        fill="none"
                        stroke="var(--color-nebula)"
                        strokeWidth={1.5}
                    />
                    <circle
                        cx={0}
                        cy={0}
                        r={34}
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeWidth={1.5}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90)"
                        style={{ transition: "stroke-dashoffset 0.15s linear" }}
                    />

                    {/* Vegvísir 8-armed sigil — brightens on hover as an affordance */}
                    <g
                        stroke="var(--color-gold)"
                        strokeWidth={1.2}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-[stroke] duration-500 group-hover:stroke-gold-bright"
                    >
                        {Array.from({ length: 8 }).map((_, i) => {
                            const angle = (i / 8) * Math.PI * 2;
                            const x = (Math.cos(angle) * 20).toFixed(3);
                            const y = (Math.sin(angle) * 20).toFixed(3);
                            return (
                                <g key={i}>
                                    <line x1={0} y1={0} x2={x} y2={y} />
                                    <circle cx={x} cy={y} r={2} fill="var(--color-gold)" stroke="none" />
                                </g>
                            );
                        })}
                        <circle cx={0} cy={0} r={4} fill="var(--color-gold-bright)" stroke="none" />
                    </g>
                </svg>
            </button>
        </div>
    );
}
