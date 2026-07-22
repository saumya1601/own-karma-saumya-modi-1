import { cn } from "@/lib/utils/cn";

export interface SectionShellProps {
    id: string;
    index: string;
    label: string;
    children: React.ReactNode;
    className?: string;
    /** Use `min-h-screen` (default) or a taller ambient stage. */
    minHeight?: "screen" | "tall" | "auto";
    as?: "section" | "footer" | "header";
    maxWidthClassName?: string;
}

/**
 * Full-viewport section with the top-left "NN   NAME" eyebrow used across the mock.
 * The number + label are semantic (`aria-labelledby`) so screen readers get the
 * outline of the experience.
 */
export function SectionShell({
    id,
    index,
    label,
    children,
    className,
    minHeight = "screen",
    as: Tag = "section",
    maxWidthClassName = "max-w-7xl",
}: SectionShellProps) {
    const heading = `${id}-heading`;

    const heightClass =
        minHeight === "tall"
            ? "min-h-[120vh]"
            : minHeight === "auto"
                ? ""
                : "min-h-screen";

    return (
        <Tag
            id={id}
            aria-labelledby={heading}
            className={cn(
                "relative isolate w-full overflow-hidden bg-ink text-ivory",
                heightClass,
                className,
            )}
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-6 sm:px-10 sm:pt-8 md:px-14 md:pt-10">
                <div className={cn("mx-auto w-full flex items-start justify-between", maxWidthClassName)}>
                    <p id={heading} className="section-label">
                        <span aria-hidden className="font-serif text-ivory text-[0.85rem] sm:text-[0.95rem]">
                            {index}
                        </span>
                        <span className="inline-block w-8" aria-hidden />
                        <span className="text-ivory-dim">{label}</span>
                    </p>
                    <span aria-hidden className="section-label text-ivory-mute">
                        ✦
                    </span>
                </div>
            </div>
            {children}
        </Tag>
    );
}
