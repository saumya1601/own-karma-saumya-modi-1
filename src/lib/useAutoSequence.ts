"use client";

import { useEffect, useRef, useState } from "react";

export interface Step {
    durationMs: number;
}

export interface AutoSequenceResult {
    /** Index of the currently active step (0-based). -1 before the first step starts. */
    currentIndex: number;
    /** True while the sequence is actively advancing. */
    isRunning: boolean;
}

/**
 * Advances through a list of timed steps, calling `onComplete` after the last
 * step's duration expires. Each step occupies exactly `step.durationMs`
 * before the hook advances `currentIndex`.
 *
 * **Visibility-change pause/resume**: when the tab is hidden the remaining
 * time for the current step is stored, the timeout is cleared, and the
 * sequence freezes. When the tab becomes visible again a new timeout fires
 * for the remaining duration. This prevents the visitor from returning to
 * a mid-sequence or completed state they didn't witness.
 *
 * Designed for reuse in Act II (questions), Act VI (philosophy), and
 * Act VII (community text).
 */
export function useAutoSequence(
    steps: Step[],
    onComplete?: () => void,
): AutoSequenceResult {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // All mutable state lives in a single ref object to avoid lint issues
    // with calling Date.now() during render or recursive useCallback.
    const state = useRef({
        timer: null as ReturnType<typeof setTimeout> | null,
        stepStart: 0,
        remaining: 0,
        index: 0,
        done: false,
    });

    const onCompleteRef = useRef(onComplete);
    const stepsRef = useRef(steps);

    // Keep refs fresh
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        stepsRef.current = steps;
    }, [steps]);

    // Core effect — manages the entire timer lifecycle
    useEffect(() => {
        const s = state.current;
        s.index = 0;
        s.done = false;
        s.stepStart = Date.now();
        s.remaining = steps[0]?.durationMs ?? 0;

        if (steps.length === 0) {
            s.done = true;
            onCompleteRef.current?.();
            return;
        }

        function clearTimer() {
            if (s.timer !== null) {
                clearTimeout(s.timer);
                s.timer = null;
            }
        }

        function schedule(delayMs: number) {
            clearTimer();
            s.stepStart = Date.now();
            s.remaining = delayMs;

            s.timer = setTimeout(() => {
                const nextIndex = s.index + 1;

                if (nextIndex >= stepsRef.current.length) {
                    s.done = true;
                    setCurrentIndex(nextIndex - 1);
                    setIsComplete(true);
                    onCompleteRef.current?.();
                    return;
                }

                s.index = nextIndex;
                setCurrentIndex(nextIndex);
                schedule(stepsRef.current[nextIndex].durationMs);
            }, delayMs);
        }

        function handleVisibility() {
            if (s.done) return;

            if (document.visibilityState === "hidden") {
                const elapsed = Date.now() - s.stepStart;
                s.remaining = Math.max(s.remaining - elapsed, 0);
                clearTimer();
            } else {
                schedule(s.remaining);
            }
        }

        // Kick off the first step
        schedule(steps[0].durationMs);

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            clearTimer();
            document.removeEventListener("visibilitychange", handleVisibility);
        };
        // We intentionally run this effect only on mount. Steps are read from
        // stepsRef so the closure doesn't need to re-bind.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isRunning = !isComplete;

    return { currentIndex, isRunning };
}
