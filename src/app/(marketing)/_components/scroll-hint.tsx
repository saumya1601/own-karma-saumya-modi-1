"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/** Subtle "SCROLL ↓" hint at the bottom of full-height sections. */
export function ScrollHint({
    label = "SCROLL",
    className,
}: {
    label?: string;
    className?: string;
}) {
    const reduced = useReducedMotion();

    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 text-ivory-mute",
                className,
            )}
            aria-hidden
        >
            <span className="text-[0.65rem] uppercase [letter-spacing:var(--tracking-label)]">
                {label}
            </span>
            {reduced ? (
                <span className="text-ivory-mute">↓</span>
            ) : (
                <motion.span
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
                >
                    ↓
                </motion.span>
            )}
        </div>
    );
}
