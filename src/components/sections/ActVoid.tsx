"use client";

import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BurstParticles } from "@/components/3d/BurstParticles";
import { GoldParticle } from "@/components/3d/GoldParticle";
import { usePreferences } from "@/lib/usePreferences";

export interface ActVoidProps {
    /** Called once the fade-to-black at the end of the burst has completed. */
    onComplete?: () => void;
}

const INITIAL_BLACK_MS = 3000; // "For three seconds... nothing happens."
const FADE_IN_S = 1.5;
const REASSURANCE_UI_MS = 1000; // Microscopic UI cue at 1s reassures user the app is loaded

/**
 * ACT I — "The Void"
 *
 * Pure black → gold particle fades in → breathes and drifts toward cursor
 * → click bursts it into thousands of stars → fade to black → onComplete.
 *
 * See _documents/implementation_plans/act-i-canonical-spec.md
 */
export function ActVoid({ onComplete }: ActVoidProps) {
    const { isCoarsePointer, prefersReducedMotion } = usePreferences();

    const [particleVisible, setParticleVisible] = useState(false);
    const [bursting, setBursting] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showUi, setShowUi] = useState(false);
    const [muted, setMuted] = useState(true);

    const meshRef = useRef<THREE.Mesh>(null);
    const particleMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const burstPointsRef = useRef<THREE.Points>(null);
    const burstMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const followEnabled = !bursting;

    // Reassure user at 1.0s that UI is live before 3.0s particle reveal
    useEffect(() => {
        const uiTimer = window.setTimeout(() => setShowUi(true), REASSURANCE_UI_MS);
        return () => window.clearTimeout(uiTimer);
    }, []);

    // Fade the particle in after the initial black beat
    useEffect(() => {
        const t = window.setTimeout(() => {
            setParticleVisible(true);
            const mat = particleMaterialRef.current;
            if (mat) {
                gsap.to(mat.uniforms.uOpacity, {
                    value: 1,
                    duration: FADE_IN_S,
                    ease: "power2.out",
                });
            }
        }, INITIAL_BLACK_MS);
        return () => window.clearTimeout(t);
    }, []);

    // Show a subtle "click anywhere" hint if the user hasn't clicked after 8s
    useEffect(() => {
        if (!particleVisible || bursting) return;
        const hintTimer = window.setTimeout(() => setShowHint(true), 8000);
        return () => window.clearTimeout(hintTimer);
    }, [particleVisible, bursting]);

    const runBurst = useCallback(() => {
        if (bursting) return;
        setBursting(true);
        setShowHint(false);

        const particleMat = particleMaterialRef.current;
        const burstMat = burstMaterialRef.current;
        const burstPoints = burstPointsRef.current;
        const particleMesh = meshRef.current;
        const overlay = overlayRef.current;

        if (!particleMat || !burstMat || !burstPoints || !particleMesh || !overlay) {
            return;
        }

        // Align the burst emitter with wherever the particle has drifted
        burstPoints.position.copy(particleMesh.position);
        burstPoints.visible = true;

        const tl = gsap.timeline({
            onComplete: () => {
                onComplete?.();
            },
        });

        // 1. Graceful slow-motion expansion of the central star
        tl.to(particleMesh.scale, {
            x: 2.2,
            y: 2.2,
            z: 2.2,
            duration: 1.2,
            ease: "power2.out",
        });
        // 2. Silky-smooth dissolve of the main particle as sparks float outward
        tl.to(
            particleMat.uniforms.uOpacity,
            { value: 0, duration: 1.8, ease: "power1.inOut" },
            "<0.2",
        );
        // 3. Cinematic slow-motion blast trajectory
        tl.to(
            burstMat.uniforms.uProgress,
            { value: 1, duration: 3.0, ease: "power2.out" },
            "<",
        );
        // 4. Quick fade to black early at 1.0s and hand off to Act II at 1.4s
        tl.to(
            overlay,
            { opacity: 1, duration: 0.5, ease: "power2.inOut" },
            1.0,
        );
        tl.add(() => {
            onComplete?.();
        }, 1.4);
    }, [bursting, onComplete]);

    // Click / tap anywhere (except UI) or scroll down triggers the burst once the particle is visible
    useEffect(() => {
        if (!particleVisible || bursting) return;

        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (target?.closest("[data-ok-ui]")) return;
            runBurst();
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 20) {
                runBurst();
            }
        };

        let startY = 0;
        const handleTouchStart = (e: TouchEvent) => {
            startY = e.touches[0].clientY;
        };
        const handleTouchEnd = (e: TouchEvent) => {
            const deltaY = startY - e.changedTouches[0].clientY;
            if (deltaY > 40) {
                runBurst();
            }
        };

        window.addEventListener("click", handler);
        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("click", handler);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [particleVisible, bursting, runBurst]);

    return (
        <div
            className={`fixed inset-0 select-none bg-(--ok-black) ${particleVisible && !bursting ? "cursor-pointer" : "cursor-default"
                }`}
        >
            <Canvas
                camera={{ fov: 20, position: [0, 0, 15], near: 0.1, far: 100 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: false }}
                style={{ background: "#000000" }}
            >
                <GoldParticle
                    ref={meshRef}
                    materialRef={particleMaterialRef}
                    reducedMotion={prefersReducedMotion}
                    followEnabled={followEnabled}
                />
                <BurstParticles
                    ref={burstPointsRef}
                    materialRef={burstMaterialRef}
                />
            </Canvas>

            {/* Fade-to-black overlay driven by GSAP */}
            <div
                ref={overlayRef}
                className="pointer-events-none absolute inset-0 bg-black"
                style={{ opacity: 0 }}
                aria-hidden
            />

            {/* Subtle click hint — fades in after 8s of no interaction */}
            {showHint && !bursting && (
                <p
                    className="pointer-events-none absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-xs tracking-[0.25em] uppercase"
                    style={{
                        color: "var(--ok-gold)",
                        animation: "hintPulse 4s ease-in-out infinite",
                    }}
                    aria-hidden
                >
                    {isCoarsePointer ? "tap anywhere" : "click anywhere"}
                </p>
            )}

            {/* Mute icon — fades in at 1s for immediate subconscious load confirmation */}
            {showUi && (
                <button
                    type="button"
                    data-ok-ui
                    aria-label={muted ? "Enable sound" : "Mute sound"}
                    aria-pressed={!muted}
                    onClick={(e) => {
                        e.stopPropagation();
                        setMuted((m) => !m);
                    }}
                    className="absolute bottom-6 right-6 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-(--ok-gold) opacity-40 transition-opacity duration-700 hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
                >
                    {muted ? (
                        <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 5L6 9H2v6h4l5 4z" />
                            <line x1="22" y1="9" x2="16" y2="15" />
                            <line x1="16" y1="9" x2="22" y2="15" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 5L6 9H2v6h4l5 4z" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
}
