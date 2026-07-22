"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * A subtle luxury cursor overlay — a small gold dot that follows the cursor,
 * paired with an outer ring that only appears when hovering an interactive
 * element (button, link, or anything with `[role="button"]` /
 * `[data-cursor="pointer"]`).
 *
 * IMPORTANT: the native OS cursor is NOT hidden. This dot is *additive* — it
 * sits on top of the standard pointer, giving a fashion-editorial feel without
 * breaking text selection, drag operations, or system cursor states.
 *
 * Disabled entirely on:
 *   - touch devices (no `hover: hover` / `pointer: fine`)
 *   - users with `prefers-reduced-motion: reduce`
 */

/**
 * useSyncExternalStore subscription to matchMedia queries. This is the
 * React-19-idiomatic way to derive client-only boolean state without tripping
 * the `react-hooks/set-state-in-effect` rule.
 */
function useCursorEnabled(): boolean {
    return useSyncExternalStore(
        (callback) => {
            if (typeof window === "undefined") return () => undefined;
            const hoverQ = window.matchMedia("(hover: hover) and (pointer: fine)");
            const reducedQ = window.matchMedia("(prefers-reduced-motion: reduce)");
            hoverQ.addEventListener("change", callback);
            reducedQ.addEventListener("change", callback);
            return () => {
                hoverQ.removeEventListener("change", callback);
                reducedQ.removeEventListener("change", callback);
            };
        },
        () => {
            const hoverQ = window.matchMedia("(hover: hover) and (pointer: fine)");
            const reducedQ = window.matchMedia("(prefers-reduced-motion: reduce)");
            return hoverQ.matches && !reducedQ.matches;
        },
        // Server snapshot — cursor is never rendered before hydration.
        () => false,
    );
}

export function CustomCursor() {
    const enabled = useCursorEnabled();
    const [hovering, setHovering] = useState(false);

    // Motion values driven directly by the mouse position — springs give a
    // subtle trailing lag that feels expensive rather than robotic.
    const cursorX = useMotionValue(-50);
    const cursorY = useMotionValue(-50);
    const dotX = useSpring(cursorX, { stiffness: 800, damping: 40, mass: 0.4 });
    const dotY = useSpring(cursorY, { stiffness: 800, damping: 40, mass: 0.4 });
    const ringX = useSpring(cursorX, { stiffness: 220, damping: 22, mass: 0.7 });
    const ringY = useSpring(cursorY, { stiffness: 220, damping: 22, mass: 0.7 });

    useEffect(() => {
        if (!enabled) return;

        const move = (e: PointerEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const over = (e: PointerEvent) => {
            const target = e.target as Element | null;
            const isInteractive = !!target?.closest?.(
                'a, button, [role="button"], [role="link"], [data-cursor="pointer"], input, textarea, select, summary',
            );
            setHovering(isInteractive);
        };

        window.addEventListener("pointermove", move, { passive: true });
        window.addEventListener("pointerover", over, { passive: true });

        return () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerover", over);
        };
    }, [enabled, cursorX, cursorY]);

    if (!enabled) return null;

    return (
        <>
            {/* Inner dot — tight spring, tracks mouse closely */}
            <motion.div
                aria-hidden
                style={{ x: dotX, y: dotY }}
                className="fixed top-0 left-0 z-[70] pointer-events-none"
            >
                <div
                    className={cn(
                        "-translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color,opacity] duration-(--motion-base) ease-standard",
                        hovering
                            ? "h-2 w-2 bg-gold-hi shadow-[0_0_10px_rgba(231,199,122,0.7)]"
                            : "h-1.5 w-1.5 bg-gold/85",
                    )}
                />
            </motion.div>

            {/* Outer ring — looser spring, only visible on interactive elements */}
            <motion.div
                aria-hidden
                style={{ x: ringX, y: ringY }}
                className="fixed top-0 left-0 z-[70] pointer-events-none"
            >
                <div
                    className={cn(
                        "-translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60 transition-[width,height,opacity,border-color] duration-(--motion-base) ease-standard",
                        hovering ? "h-11 w-11 opacity-100" : "h-6 w-6 opacity-0",
                    )}
                />
            </motion.div>
        </>
    );
}

export default CustomCursor;
