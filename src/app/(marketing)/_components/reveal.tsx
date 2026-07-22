"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "@/lib/motion/variants";
import { cn } from "@/lib/utils/cn";

interface RevealProps {
    children: ReactNode;
    className?: string;
    /** Root margin passed to whileInView. */
    amount?: number;
    /** Delay before the animation starts (seconds). */
    delay?: number;
    /** Fire once, or every time the element re-enters the viewport (default). */
    once?: boolean;
    /** Override variant. */
    variants?: Variants;
}

/**
 * Fade-up wrapper that respects `prefers-reduced-motion`.
 * When the user prefers reduced motion, the content renders visible immediately.
 */
export function Reveal({
    children,
    className,
    amount = 0.35,
    delay = 0,
    once = false,
    variants = fadeUp,
}: RevealProps) {
    const reduced = useReducedMotion();

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount }}
            variants={variants}
            transition={{ delay }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Container that staggers direct children (which should themselves be `Reveal` items).
 */
export function RevealGroup({
    children,
    className,
    delayChildren = 0.2,
    staggerChildren = 0.14,
    once = false,
    amount = 0.35,
}: {
    children: ReactNode;
    className?: string;
    delayChildren?: number;
    staggerChildren?: number;
    once?: boolean;
    amount?: number;
}) {
    const reduced = useReducedMotion();

    if (reduced) {
        return <div className={cn(className)}>{children}</div>;
    }

    return (
        <motion.div
            className={cn(className)}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount }}
            variants={stagger(delayChildren, staggerChildren)}
        >
            {children}
        </motion.div>
    );
}
