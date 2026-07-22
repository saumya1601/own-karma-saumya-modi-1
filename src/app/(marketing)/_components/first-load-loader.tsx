"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "own-karma:seen-loader";

/**
 * Full-screen ink overlay that plays for ~900ms on first visit each session,
 * revealing a gold serif "OK" glyph before dissolving to expose §01. Gives the
 * page a premium arrival moment (design intel: fashion / luxury sites use a
 * short branded curtain to set the mood before the reader lands).
 *
 * Behavior:
 *   - Only shows once per session (sessionStorage flag) — subsequent scroll
 *     restores after a hash-nav or SPA return do NOT retrigger it.
 *   - Skipped entirely for prefers-reduced-motion users; page renders instantly.
 *   - Uses a one-shot effect with empty deps so no state change can strand the
 *     curtain on screen when `useReducedMotion` re-resolves after hydration.
 */
export function FirstLoadLoader() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Reduced-motion users: skip the curtain entirely. We read matchMedia
        // directly (not via `useReducedMotion`) so we don't take a dependency on
        // a value that flips between server-render (false) and client-hydrate,
        // which previously cleaned up the dismiss timer and stranded the OK glyph.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Repeat visits in the same tab session: skip.
        try {
            if (sessionStorage.getItem(STORAGE_KEY) === "true") return;
        } catch {
            // sessionStorage can throw in private mode — fall through and play.
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);

        const dismissTimer = window.setTimeout(() => {
            setVisible(false);
            try {
                sessionStorage.setItem(STORAGE_KEY, "true");
            } catch {
                /* noop */
            }
        }, 950);

        // Safety net — if anything goes wrong with the timer above (paused tab,
        // interrupted RAF, extension throttling), a second harder deadline
        // guarantees the reader never gets stuck behind the curtain.
        const safetyTimer = window.setTimeout(() => setVisible(false), 3000);

        return () => {
            window.clearTimeout(dismissTimer);
            window.clearTimeout(safetyTimer);
        };
    }, []); // one-shot on mount; the check inside handles reduced-motion

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="first-load-loader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden
                    className="fixed inset-0 z-80 bg-ink flex items-center justify-center pointer-events-none"
                >
                    {/* Faint gold radial behind the glyph */}
                    <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(circle at center, rgba(201,162,75,0.10) 0%, rgba(0,0,0,0) 55%)",
                        }}
                    />

                    <motion.div
                        initial={{ opacity: 0, letterSpacing: "0.55em", filter: "blur(6px)" }}
                        animate={{ opacity: 1, letterSpacing: "0.18em", filter: "blur(0px)" }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="font-serif text-gold text-6xl md:text-7xl font-light select-none"
                    >
                        OK
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default FirstLoadLoader;
