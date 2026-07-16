/**
 * Utilities for controlling an HTMLVideoElement's playback speed.
 *
 * These are framework-agnostic helpers. Pair them with a React ref via
 * `createVideoSpeedController(videoRef, onChange?)` for ergonomic use.
 */

export const SPEED_STEP = 0.25;
export const MIN_SPEED = 0.25;
export const MAX_SPEED = 3;
export const DEFAULT_SPEED = 1;

/** Clamp and round a speed value to a safe playbackRate. */
export function clampSpeed(rate: number): number {
    if (!Number.isFinite(rate)) return DEFAULT_SPEED;
    const rounded = Number(rate.toFixed(2));
    return Math.min(MAX_SPEED, Math.max(MIN_SPEED, rounded));
}

/** Apply a speed to a video element. Returns the applied (clamped) rate, or null if no element. */
export function applyVideoSpeed(
    video: HTMLVideoElement | null,
    rate: number
): number | null {
    if (!video) return null;
    const clamped = clampSpeed(rate);
    video.playbackRate = clamped;
    return clamped;
}

/** Compute the next speed after an increase step (clamped). */
export function nextSpeedUp(current: number, step: number = SPEED_STEP): number {
    return clampSpeed(current + step);
}

/** Compute the next speed after a decrease step (clamped). */
export function nextSpeedDown(current: number, step: number = SPEED_STEP): number {
    return clampSpeed(current - step);
}

export type VideoSpeedController = {
    increase: () => number | null;
    decrease: () => number | null;
    reset: () => number | null;
    set: (rate: number) => number | null;
    get: () => number;
};

/**
 * Create a controller bound to a video ref. `onChange` is invoked with the new
 * clamped rate whenever a change is applied — useful for syncing React state.
 */
export function createVideoSpeedController(
    videoRef: { current: HTMLVideoElement | null },
    onChange?: (rate: number) => void
): VideoSpeedController {
    const apply = (rate: number): number | null => {
        const applied = applyVideoSpeed(videoRef.current, rate);
        if (applied !== null) onChange?.(applied);
        return applied;
    };

    const current = () =>
        videoRef.current?.playbackRate ?? DEFAULT_SPEED;

    return {
        increase: () => apply(nextSpeedUp(current())),
        decrease: () => apply(nextSpeedDown(current())),
        reset: () => apply(DEFAULT_SPEED),
        set: (rate: number) => apply(rate),
        get: current,
    };
}
