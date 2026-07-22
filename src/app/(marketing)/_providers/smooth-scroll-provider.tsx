"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Mounts Lenis smooth scroll for the whole document.
 * Disables itself when the user prefers reduced motion.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (media.matches) return;

        const lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.2,
        });

        let rafId = 0;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
