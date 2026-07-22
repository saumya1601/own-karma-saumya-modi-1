"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils/cn";

/**
 * Continue-to-next-chapter link — a bottom-anchored micro CTA that closes each
 * chapter's narrative loop. Anchored at bottom-center; keyboard-focusable;
 * on hover its short hairline extends and its chevron drops half a step.
 *
 * Design intent (ui-ux-pro-max Scroll-Triggered Storytelling pattern):
 *   "End of each chapter (mini) + Final climax CTA"
 *
 * Renders a semantic `<a>` linking to the next section's id so hash routing +
 * scroll-margin-top (from globals.css) land the reader cleanly at the top of
 * the next chapter.
 */
export function ContinueLink({
    href,
    label = "CONTINUE",
    hint,
    className,
}: {
    /** Anchor id of the next section (e.g. `#the-portal`). */
    href: string;
    /** Micro-caps label — defaults to "CONTINUE". */
    label?: string;
    /** Optional smaller hint below the label (e.g. the next chapter name). */
    hint?: ReactNode;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <a
            href={href}
            aria-label={`${label}${hint ? ` — ${typeof hint === "string" ? hint : ""}` : ""}`}
            className={cn(
                "group pointer-events-auto absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30",
                "flex flex-col items-center gap-2.5 py-2 px-3 rounded-sm cursor-pointer",
                "focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ink",
                className,
            )}
        >
            <span className="text-[0.62rem] sm:text-[0.65rem] tracking-[0.32em] text-ivory-mute uppercase font-medium group-hover:text-gold group-focus-visible:text-gold transition-colors duration-(--motion-base) ease-standard">
                {label}
            </span>

            {hint && (
                <span className="text-[0.58rem] tracking-[0.22em] text-ivory-mute/70 uppercase group-hover:text-ivory-dim group-focus-visible:text-ivory-dim transition-colors duration-(--motion-base) ease-standard">
                    {hint}
                </span>
            )}

            {/* Vertical hairline that lengthens on hover */}
            <span
                aria-hidden
                className="block w-px bg-ivory-mute/40 h-6 group-hover:h-9 group-hover:bg-gold group-focus-visible:h-9 group-focus-visible:bg-gold transition-all duration-(--motion-base) ease-standard motion-reduce:transition-none"
            />

            {/* Chevron that gently bobs when idle, drops on hover */}
            <motion.svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3 text-ivory-mute group-hover:text-gold group-focus-visible:text-gold transition-colors duration-(--motion-base) ease-standard motion-reduce:transition-none"
                animate={reduced ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
                <path d="M6 9l6 6 6-6" />
            </motion.svg>
        </a>
    );
}

export default ContinueLink;
