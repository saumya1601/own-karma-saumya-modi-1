"use client";

import { useFrame } from "@react-three/fiber";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { particleFragment, particleVertex } from "@/components/shaders/particle";
import { useParticleFollow } from "@/lib/useParticleFollow";

export interface GoldParticleProps {
    reducedMotion: boolean;
    followEnabled: boolean;
    materialRef?: RefObject<THREE.ShaderMaterial | null>;
}

/**
 * The single glowing gold particle at the center of the void.
 * - Breathes via a sine wave in its vertex shader
 * - Position is driven in real-time by useParticleFollow via frame-rate independent MathUtils.damp
 * - Opacity is driven externally by GSAP (fade-in, then fade-out during burst)
 */
export const GoldParticle = forwardRef<THREE.Mesh, GoldParticleProps>(
    function GoldParticle({ reducedMotion, followEnabled, materialRef }, ref) {
        const localMeshRef = useRef<THREE.Mesh>(null);
        const localMaterialRef = useRef<THREE.ShaderMaterial>(null);

        // Expose the mesh through the forwarded ref
        useImperativeHandle(ref, () => localMeshRef.current as THREE.Mesh, []);

        // Mirror the material ref to the caller if provided
        useImperativeHandle(
            materialRef ?? { current: null },
            () => localMaterialRef.current as THREE.ShaderMaterial,
            [],
        );

        // Frame-rate independent cursor follow lerp executed inside R3F Canvas context
        useParticleFollow(localMeshRef, followEnabled);

        const uniforms = useMemo(
            () => ({
                uTime: { value: 0 },
                uReducedMotion: { value: reducedMotion ? 1 : 0 },
                uOpacity: { value: 0 }, // starts invisible; ActVoid tweens to 1
            }),
            // Intentionally omit `reducedMotion` — we update the uniform directly below
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [],
        );

        // Keep the uniform in sync if the preference flips at runtime
        if (localMaterialRef.current) {
            localMaterialRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;
        }

        useFrame((_, delta) => {
            const mat = localMaterialRef.current;
            if (mat) {
                mat.uniforms.uTime.value += delta;
            }
        });

        return (
            <mesh ref={localMeshRef}>
                <planeGeometry args={[1.0, 1.0]} />
                <shaderMaterial
                    ref={localMaterialRef}
                    vertexShader={particleVertex}
                    fragmentShader={particleFragment}
                    uniforms={uniforms}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        );
    },
);
