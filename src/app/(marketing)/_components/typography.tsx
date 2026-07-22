import React, { type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CommonProps {
    children: ReactNode;
    className?: string;
}

/** Small-caps tracked label used above every headline. */
export function EyebrowLabel({
    children,
    className,
    as = "p",
}: CommonProps & { as?: ElementType }) {
    return React.createElement(
        as,
        {
            className: cn(
                "text-[0.72rem] uppercase text-ivory-dim",
                "[letter-spacing:var(--tracking-label)]",
                className,
            ),
        },
        children,
    );
}

/** Monumental display serif. */
export function DisplayHeading({
    children,
    className,
    as = "h2",
}: CommonProps & { as?: ElementType }) {
    return React.createElement(
        as,
        {
            className: cn(
                "font-serif font-light leading-[0.95] tracking-[-0.01em] text-ivory",
                "text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem]",
                className,
            ),
        },
        children,
    );
}

/** Body copy used across editorial sections. */
export function BodyProse({ children, className }: CommonProps) {
    return (
        <div
            className={cn(
                "font-serif text-lg leading-relaxed text-ivory-dim sm:text-xl",
                "[&_strong]:font-normal [&_strong]:text-gold",
                className,
            )}
        >
            {children}
        </div>
    );
}

/** Wrap a single word so it renders as an accented gold keyword. */
export function GoldWord({ children, className }: CommonProps) {
    return (
        <span className={cn("text-gold", className)}>
            {children}
        </span>
    );
}
