"use client";

import { useEffect, useState } from "react";

export interface Preferences {
    isCoarsePointer: boolean;
    prefersReducedMotion: boolean;
}

const initial: Preferences = {
    isCoarsePointer: false,
    prefersReducedMotion: false,
};

/**
 * Reactive media-query preferences for Act I.
 * SSR-safe: returns `initial` on the server and hydrates on mount.
 */
export function usePreferences(): Preferences {
    const [prefs, setPrefs] = useState<Preferences>(initial);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const coarse = window.matchMedia("(pointer: coarse)");
        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const update = () => {
            setPrefs({
                isCoarsePointer: coarse.matches,
                prefersReducedMotion: motion.matches,
            });
        };

        update();
        coarse.addEventListener("change", update);
        motion.addEventListener("change", update);

        return () => {
            coarse.removeEventListener("change", update);
            motion.removeEventListener("change", update);
        };
    }, []);

    return prefs;
}
