"use client";

import { useEffect, useState } from "react";

/**
 * Reactive `prefers-reduced-motion` hook.
 * Server render always returns `false` so animated defaults hydrate correctly.
 */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(query.matches);

        const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
        query.addEventListener("change", listener);
        return () => query.removeEventListener("change", listener);
    }, []);

    return reduced;
}
