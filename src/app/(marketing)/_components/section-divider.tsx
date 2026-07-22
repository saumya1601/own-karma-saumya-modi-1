import { cn } from "@/lib/utils/cn";

/**
 * Editorial hairline separator with a small gold sigil — sits between full-viewport
 * sections to give the scroll narrative visible chapter beats without adding chrome.
 *
 *   ─────────────  ✦  ─────────────
 *
 * Rendered as a plain <hr aria-hidden /> pattern so screen readers ignore it —
 * the semantic chapter structure lives on each <section> and in the SectionNav.
 */
export function SectionDivider({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={cn(
                "relative z-10 mx-auto flex w-full max-w-md items-center justify-center gap-4 py-8 sm:py-10",
                className,
            )}
        >
            <span className="h-px flex-1 bg-linear-to-r from-transparent via-ivory/15 to-transparent" />
            <span className="text-gold/70 text-[0.85rem] leading-none select-none" style={{ fontFamily: "var(--font-serif)" }}>
                ✦
            </span>
            <span className="h-px flex-1 bg-linear-to-l from-transparent via-ivory/15 to-transparent" />
        </div>
    );
}

export default SectionDivider;
