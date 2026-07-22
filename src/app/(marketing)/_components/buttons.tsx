"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CommonProps = {
    children: ReactNode;
    className?: string;
    /** Wraps label in `[  ...  ]` brackets — the §01 ENTER treatment. */
    withBrackets?: boolean;
};

type PolymorphicProps<T> = CommonProps &
    Omit<T, "children" | "className"> & {
        href?: string;
    };

/**
 * Shared button chrome:
 *  - `cursor-pointer` on every clickable element (ui-ux-pro-max: cursor-pointer)
 *  - Transition sits in the 150–300ms band recommended for micro-interactions
 *    (ui-ux-pro-max: duration-timing) — colors, shadows, transform all animate together.
 *  - `active:scale-[0.98]` gives the tactile press feedback missing before
 *    (ui-ux-pro-max: scale-feedback).
 *  - `focus:outline-none` is intentionally paired with a `focus-visible:` ring
 *    so keyboard users still see focus (ui-ux-pro-max: focus-states).
 *  - Min height 44px meets the touch-target rule on mobile
 *    (ui-ux-pro-max: touch-target-size).
 */
const baseClasses = cn(
    "group relative inline-flex items-center justify-center gap-3",
    "px-8 py-3.5 min-h-11 text-[0.7rem] font-medium uppercase",
    "cursor-pointer select-none",
    "[letter-spacing:var(--tracking-label)]",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-(--motion-base) ease-standard",
    "active:scale-[0.98]",
    "focus:outline-none focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
    "motion-reduce:transition-none motion-reduce:active:scale-100",
);

/**
 * Outlined gold-border button used across every section that isn't the final CTA.
 * Renders `<a>` when `href` is provided, `<button>` otherwise.
 */
export function OutlinedButton({
    children,
    className,
    withBrackets,
    href,
    ...rest
}: PolymorphicProps<
    ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>
>) {
    const content = withBrackets ? (
        <>
            <span aria-hidden className="text-gold/60 transition-colors duration-(--motion-base) group-hover:text-gold">
                [
            </span>
            <span className="text-gold">{children}</span>
            <span aria-hidden className="text-gold/60 transition-colors duration-(--motion-base) group-hover:text-gold">
                ]
            </span>
        </>
    ) : (
        <span className="text-gold">{children}</span>
    );

    const classes = cn(
        baseClasses,
        "border border-gold/50 hover:border-gold hover:shadow-[0_0_36px_-8px_rgba(231,199,122,0.45)]",
        "backdrop-blur-[1px]",
        className,
    );

    if (href) {
        return (
            <a href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {content}
            </a>
        );
    }

    return (
        <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
            {content}
        </button>
    );
}

/** Filled gold CTA — reserved for the final section. */
export function PrimaryButton({
    children,
    className,
    href,
    ...rest
}: PolymorphicProps<
    ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>
>) {
    const classes = cn(
        baseClasses,
        "bg-gold text-ink hover:bg-gold-hi hover:shadow-[0_0_48px_-6px_rgba(231,199,122,0.7)]",
        className,
    );

    const content = <span className="text-ink">{children}</span>;

    if (href) {
        return (
            <a href={href} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
                {content}
            </a>
        );
    }

    return (
        <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
            {content}
        </button>
    );
}
