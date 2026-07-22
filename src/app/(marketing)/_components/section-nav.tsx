"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * Fixed-position vertical indicator that lists the 10 chapters on the right
 * edge of the viewport. Each dot is a real anchor to `#<section id>`, so
 * keyboard + assistive tech get real navigation semantics.
 *
 * Design intent (per design-system/own-karma/MASTER.md):
 * - Stays out of the cinematic frame (small, right-aligned, hidden below md).
 * - Uses only gold + ivory tokens — no new colors introduced.
 * - The label balloons appear on hover/focus and animate with the shared
 *   motion tokens (--motion-base, ease-standard).
 * - Every interactive dot has a min 32px hit target; the anchor is padded
 *   so keyboard focus rings sit clear of the dot.
 * - Fully respects prefers-reduced-motion: no scale/translate transitions,
 *   still shows the active state.
 */
const CHAPTERS: Array<{ id: string; index: string; label: string }> = [
    { id: "the-void", index: "01", label: "The Void" },
    { id: "the-portal", index: "02", label: "The Portal" },
    { id: "what-is-own-karma", index: "03", label: "What Is Own Karma?" },
    { id: "the-unbound", index: "04", label: "The Unbound" },
    { id: "the-design-universe", index: "05", label: "The Design Universe" },
    { id: "the-four-pillars", index: "06", label: "The Four Pillars" },
    { id: "philosophy-to-garment", index: "07", label: "Philosophy to Garment" },
    { id: "the-first-product", index: "08", label: "The First Product" },
    { id: "the-karma-archive", index: "09", label: "The Karma Archive" },
    { id: "the-final-question", index: "10", label: "The Final Question" },
];

export function SectionNav() {
    const [activeId, setActiveId] = useState<string>(CHAPTERS[0].id);
    const reduced = useReducedMotion();

    // Track which section owns the most viewport area — treat it as active.
    useEffect(() => {
        if (typeof window === "undefined") return;

        const sections = CHAPTERS
            .map((c) => document.getElementById(c.id))
            .filter((el): el is HTMLElement => el !== null);

        if (sections.length === 0) return;

        // Track how much of each section is currently in view; the biggest wins.
        const ratios = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    ratios.set(entry.target.id, entry.intersectionRatio);
                }
                let bestId = activeId;
                let bestRatio = 0;
                for (const [id, ratio] of ratios) {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        bestId = id;
                    }
                }
                if (bestRatio > 0 && bestId !== activeId) {
                    setActiveId(bestId);
                }
            },
            {
                // Multiple thresholds so we get progressive ratio updates as user scrolls.
                threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
            },
        );

        for (const s of sections) observer.observe(s);
        return () => observer.disconnect();
        // We intentionally omit activeId so IntersectionObserver isn't recreated on state change.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <nav
            aria-label="Chapter navigation"
            className="pointer-events-none fixed inset-y-0 right-3 z-40 hidden md:flex flex-col items-end justify-center gap-3"
        >
            <ul className="pointer-events-auto flex flex-col items-end gap-2.5">
                {CHAPTERS.map((chapter) => {
                    const isActive = activeId === chapter.id;
                    return (
                        <li key={chapter.id}>
                            <a
                                href={`#${chapter.id}`}
                                aria-label={`Jump to chapter ${chapter.index}: ${chapter.label}`}
                                aria-current={isActive ? "location" : undefined}
                                className={cn(
                                    // Real 32×32 hit target for pointer + touch (ui-ux-pro-max: touch-target-size).
                                    "group relative flex items-center justify-end gap-2.5 h-8 w-8 pr-0.5 cursor-pointer rounded-full",
                                    "focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
                                    "transition-colors duration-(--motion-base) ease-standard",
                                )}
                            >
                                {/* Tooltip label appears on hover / focus. */}
                                <span
                                    aria-hidden
                                    className={cn(
                                        "absolute right-full mr-2 whitespace-nowrap rounded-sm bg-ink-2/90 border border-ivory/10 px-2.5 py-1",
                                        "text-[0.62rem] tracking-[0.24em] uppercase text-ivory-dim",
                                        "opacity-0 translate-x-1 transition-[opacity,transform] duration-(--motion-base) ease-standard motion-reduce:transition-none",
                                        "group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0",
                                        isActive && "text-gold border-gold/30",
                                    )}
                                >
                                    <span className="text-gold/70 mr-2">{chapter.index}</span>
                                    {chapter.label}
                                </span>

                                {/* The dot itself. Grows and warms on hover / active. */}
                                <span
                                    aria-hidden
                                    className={cn(
                                        "block rounded-full transition-[background-color,transform,box-shadow] duration-(--motion-base) ease-standard motion-reduce:transition-none",
                                        isActive
                                            ? "h-2.5 w-2.5 bg-gold shadow-[0_0_12px_-2px_rgba(231,199,122,0.75)]"
                                            : "h-1.5 w-1.5 bg-ivory/25 group-hover:bg-gold group-focus-visible:bg-gold",
                                        !reduced && !isActive && "group-hover:scale-125 group-focus-visible:scale-125",
                                    )}
                                />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default SectionNav;
