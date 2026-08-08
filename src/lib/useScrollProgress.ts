"use client";

import { useEffect, useRef, useState } from "react";

export interface ScrollProgressResult {
    /** 0 → 1 scroll progress through the virtual scroll distance. */
    progress: number;
    /** True while the user is actively producing scroll input. */
    isScrolling: boolean;
}

/**
 * Smooth virtual scroll progress hook (Lenis-free).
 * Captures wheel, touch drag, and keyboard inputs, accumulating virtual delta,
 * and interpolates progress from 0 to 1 with smooth momentum dampening.
 *
 * Cleaned up on unmount.
 */
export function useScrollProgress(enabled: boolean = true): ScrollProgressResult {
    const [progress, setProgress] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    const targetRef = useRef(0);
    const currentRef = useRef(0);
    const isScrollingTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!enabled) return;
        if (typeof window === "undefined") return;

        targetRef.current = 0;
        currentRef.current = 0;

        // Lock body scrolling so virtual scroll takes over cleanly
        const prevOverflow = document.body.style.overflow;
        const prevOverscroll = document.body.style.overscrollBehavior;
        const prevTouchAction = document.body.style.touchAction;

        document.body.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";
        document.body.style.touchAction = "none";

        const triggerScrollingState = () => {
            setIsScrolling(true);
            if (isScrollingTimerRef.current !== null) {
                window.clearTimeout(isScrollingTimerRef.current);
            }
            isScrollingTimerRef.current = window.setTimeout(() => {
                setIsScrolling(false);
            }, 200);
        };

        const updateTarget = (delta: number) => {
            // Speed factor: 1 full virtual scroll length takes ~3000px of wheel delta
            const SENSITIVITY = 0.00035;
            targetRef.current = Math.max(0, Math.min(1, targetRef.current + delta * SENSITIVITY));
            triggerScrollingState();
        };

        // 1. Mouse Wheel Listener
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            let delta = e.deltaY;
            if (e.deltaMode === 1) delta *= 33; // Line mode
            if (e.deltaMode === 2) delta *= window.innerHeight; // Page mode
            updateTarget(delta);
        };

        // 2. Touch Drag Listeners
        let lastTouchY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                lastTouchY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                e.preventDefault();
                const currentY = e.touches[0].clientY;
                const deltaY = lastTouchY - currentY; // Pulling up advances forward
                lastTouchY = currentY;
                updateTarget(deltaY * 2.5); // Slightly higher sensitivity for touch
            }
        };

        // 3. Keyboard Navigation
        const handleKeyDown = (e: KeyboardEvent) => {
            const step = 0.06;
            if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
                e.preventDefault();
                targetRef.current = Math.max(0, Math.min(1, targetRef.current + step));
                triggerScrollingState();
            } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
                e.preventDefault();
                targetRef.current = Math.max(0, Math.min(1, targetRef.current - step));
                triggerScrollingState();
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        window.addEventListener("keydown", handleKeyDown);

        // Animation Loop for smooth dampening (lerp)
        let animationFrameId: number;
        let lastTime = performance.now();

        const animate = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;

            // Exponential decay smoothing (fps-independent lerp)
            const smoothingFactor = 1 - Math.exp(-12 * dt);
            const diff = targetRef.current - currentRef.current;

            if (Math.abs(diff) > 0.0001) {
                currentRef.current += diff * smoothingFactor;
                setProgress(currentRef.current);
            } else if (currentRef.current !== targetRef.current) {
                currentRef.current = targetRef.current;
                setProgress(currentRef.current);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("keydown", handleKeyDown);
            cancelAnimationFrame(animationFrameId);

            if (isScrollingTimerRef.current !== null) {
                window.clearTimeout(isScrollingTimerRef.current);
            }

            document.body.style.overflow = prevOverflow;
            document.body.style.overscrollBehavior = prevOverscroll;
            document.body.style.touchAction = prevTouchAction;
        };
    }, [enabled]);

    return { progress, isScrolling };
}
