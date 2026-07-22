"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

/**
 * Cinematic scroll progress bar — a 1-pixel gold rail pinned to the top of the
 * viewport that fills from 0% → 100% as the user descends the 10-section
 * narrative. Pairs with the right-edge chapter navigator.
 *
 * Design intent (ui-ux-pro-max landing pattern "Scroll-Triggered Storytelling"):
 *   "Use progress indicator" — narrative pages that let the reader see where
 *   they are keep users engaged 3x longer.
 *
 * Motion respects prefers-reduced-motion: we still show a static bar reflecting
 * the current scroll position, but skip the spring smoothing.
 */
export function ScrollProgress() {
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll();

    // Spring smoothing so the bar glides between scroll ticks instead of jittering.
    // Reduced-motion users get the raw value with no easing.
    const smoothed = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 24,
        restDelta: 0.0005,
    });

    const scaleX = reduced ? scrollYProgress : smoothed;

    return (
        <motion.div
            aria-hidden
            style={{ scaleX }}
            className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gold shadow-[0_0_16px_-2px_rgba(231,199,122,0.7)]"
        />
    );
}

export default ScrollProgress;
