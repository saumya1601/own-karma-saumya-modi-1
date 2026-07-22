import type { Variants } from "framer-motion";

/** Standard fade-up used by section reveals. */
export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
};

/** Slow, subtle fade for hero moments — stillness -> movement -> stillness. */
export const softFade: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
};

/** Parent stagger container. */
export const stagger = (delayChildren = 0.15, staggerChildren = 0.12): Variants => ({
    hidden: {},
    show: {
        transition: { delayChildren, staggerChildren },
    },
});

/** Gold word ink-in — reserved for accented keywords. */
export const goldInk: Variants = {
    hidden: { opacity: 0, filter: "blur(6px)" },
    show: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
    },
};
