/**
 * Utilities for controlling an HTMLVideoElement's muted state.
 *
 * These are framework-agnostic helpers. The page passes in the video element
 * and a callback to sync React state when the muted state changes.
 */

export type MuteChangeHandler = (muted: boolean) => void;

/**
 * Attempt to unmute a video and resume playback. Returns the resulting muted
 * state (true if the browser blocked unmuted playback, false on success).
 */
export function unmuteVideo(video: HTMLVideoElement | null): Promise<boolean> {
    if (!video) return Promise.resolve(true);
    if (!video.muted) return Promise.resolve(false);

    video.muted = false;
    video.volume = 1;

    const playResult = video.play();
    if (!playResult || typeof playResult.then !== "function") {
        return Promise.resolve(false);
    }

    return playResult
        .then(() => false)
        .catch(() => {
            // Browser blocked unmuted playback — revert to muted.
            video.muted = true;
            return true;
        });
}

/** Mute the video. Returns the resulting muted state (always true). */
export function muteVideo(video: HTMLVideoElement | null): boolean {
    if (!video) return true;
    video.muted = true;
    return true;
}

/**
 * Toggle the muted state of a video. Resolves with the resulting muted state.
 * Handles the async unmute path (browsers may reject `play()` on unmute).
 */
export async function toggleVideoMute(
    video: HTMLVideoElement | null
): Promise<boolean> {
    if (!video) return true;
    if (video.muted) {
        return unmuteVideo(video);
    }
    return muteVideo(video);
}

/**
 * Attach one-time listeners that unmute the video on the first user gesture.
 * Browsers block autoplay with sound until a user interacts with the page.
 *
 * @param getVideo - lazy getter for the video element (safe for React refs).
 * @param onChange - optional callback fired with the resulting muted state.
 * @returns cleanup function that removes the listeners.
 */
export function attachUnmuteOnFirstInteraction(
    getVideo: () => HTMLVideoElement | null,
    onChange?: MuteChangeHandler
): () => void {
    const events: Array<keyof WindowEventMap> = [
        "pointerdown",
        "keydown",
        "touchstart",
    ];

    const cleanup = () => {
        for (const evt of events) {
            window.removeEventListener(evt, handler);
        }
    };

    const handler = () => {
        const v = getVideo();
        if (v && v.muted) {
            void unmuteVideo(v).then((muted) => {
                onChange?.(muted);
            });
        }
        cleanup();
    };

    for (const evt of events) {
        window.addEventListener(evt, handler);
    }

    return cleanup;
}
