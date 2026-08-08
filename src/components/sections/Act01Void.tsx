"use client";

import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BurstParticles } from "@/components/3d/BurstParticles";
import { GoldParticle } from "@/components/3d/GoldParticle";
import { usePreferences } from "@/lib/usePreferences";
import { audioEngine } from "@/utils/audioEngine";

export interface Act01VoidProps {
    /** Called once the fade-to-black at the end of the burst has completed. */
    onComplete?: () => void;
}

const INITIAL_BLACK_MS = 3000; // "For three seconds... nothing happens."
const FADE_IN_S = 1.5;

/**
 * ACT I — "The Void"
 *
 * Pure black → gold particle fades in → breathes slowly and drifts toward
 * cursor → click bursts it into thousands of microscopic golden stars →
 * fade to black → onComplete.
 *
 * See _documents/OWN_KARMA_Landing_Page_Experience_Spec.md — ACT I.
 */
export function Act01Void({ onComplete }: Act01VoidProps) {
    const { prefersReducedMotion } = usePreferences();

    const [particleVisible, setParticleVisible] = useState(false);
    const [bursting, setBursting] = useState(false);

    const meshRef = useRef<THREE.Mesh>(null);
    const particleMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const burstPointsRef = useRef<THREE.Points>(null);
    const burstMaterialRef = useRef<THREE.ShaderMaterial>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const followEnabled = !bursting;

    // Prime the ambient hum graph on mount — will only actually make sound
    // after the first user gesture (browser autoplay policy).
    useEffect(() => {
        audioEngine.init();
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

    const runBurst = useCallback(() => {
        if (bursting) return;
        setBursting(true);

        // First user gesture — unmute the ambient hum so it carries into Act II.
        if (audioEngine.getMutedState()) {
            audioEngine.toggle();
        }

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

        const tl = gsap.timeline();

        // 1. Micro-flash — the particle brightens and swells for a heartbeat
        tl.to(particleMesh.scale, {
            x: 2.0, y: 2.0, z: 2.0,
            duration: 0.25,
            ease: "power3.out",
        });
        // 2. The central star dissolves as the shatter begins
        tl.to(
            particleMat.uniforms.uOpacity,
            { value: 0, duration: 0.6, ease: "power2.out" },
            "<0.1",
        );
        // 3. Thousands of microscopic golden stars drift outward in slow motion.
        //    `sine.out` keeps velocity even instead of front-loading the motion,
        //    which is what made the previous power2.out timing feel rushed.
        tl.to(
            burstMat.uniforms.uProgress,
            { value: 1, duration: 3.0, ease: "sine.out" },
            "<",
        );
        // 4. Everything disappears — fade to black (starts once the explosion
        //    has been visibly witnessed for ~1.7s).
        tl.to(
            overlay,
            { opacity: 1, duration: 1.4, ease: "power2.inOut" },
            1.8,
        );
        // 5. Hand off to Act II the instant the screen is fully black
        tl.add(() => onComplete?.(), 3.2);
    }, [bursting, onComplete]);

    // Click / tap anywhere triggers the burst — spec: "The visitor clicks."
    useEffect(() => {
        if (!particleVisible || bursting) return;

        const handler = () => runBurst();
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, [particleVisible, bursting, runBurst]);

    return (
        <div
            className={`fixed inset-0 select-none bg-(--ok-black) ${particleVisible && !bursting ? "cursor-pointer" : "cursor-default"
                }`}
        >
            <Canvas
                camera={{ fov: 20, position: [0, 0, 15], near: 0.1, far: 100 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
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
        </div>
    );
}
