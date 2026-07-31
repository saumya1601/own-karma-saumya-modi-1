"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";
import { burstVertex, burstFragment } from "@/components/shaders/particle";

const BURST_COUNT = 3000;

export interface BurstParticlesProps {
    materialRef?: RefObject<THREE.ShaderMaterial | null>;
}

/**
 * A hidden field of ~3000 gold star-points that explode outward when the
 * parent drives `uProgress` from 0 → 1 (via GSAP). Each point has its own
 * random 3D direction AND a random speed multiplier so the shatter reads
 * as an organic cloud rather than a perfect ring.
 *
 * The forwarded ref exposes the Points object so the parent can:
 *   - copy the main particle's position onto it before revealing
 *   - toggle `visible` on
 */
export const BurstParticles = forwardRef<THREE.Points, BurstParticlesProps>(
    function BurstParticles({ materialRef }, ref) {
        const localPointsRef = useRef<THREE.Points>(null);
        const localMaterialRef = useRef<THREE.ShaderMaterial>(null);

        useImperativeHandle(ref, () => localPointsRef.current as THREE.Points, []);
        useImperativeHandle(
            materialRef ?? { current: null },
            () => localMaterialRef.current as THREE.ShaderMaterial,
            [],
        );

        // Pre-build geometry once. Positions all start at origin; direction is a
        // uniformly-distributed vector on the unit sphere, flattened toward the
        // XY plane (small z variance) and scaled by a per-particle speed factor
        // between 0.4x and 1.4x so the shatter looks organic.
        const geometry = useMemo(() => {
            const positions = new Float32Array(BURST_COUNT * 3);
            const directions = new Float32Array(BURST_COUNT * 3);
            const scales = new Float32Array(BURST_COUNT);
            const rotations = new Float32Array(BURST_COUNT);

            for (let i = 0; i < BURST_COUNT; i++) {
                const u = Math.random();
                const v = Math.random();
                const theta = 2 * Math.PI * u;
                const phi = Math.acos(2 * v - 1);
                const speed = 0.4 + Math.random() * 1.0; // 0.4x .. 1.4x

                directions[i * 3 + 0] = Math.sin(phi) * Math.cos(theta) * speed;
                directions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
                directions[i * 3 + 2] = Math.cos(phi) * 0.3 * speed;

                scales[i] = 0.55 + Math.random() * 0.85; // 0.55x .. 1.4x scale variation
                rotations[i] = Math.random() * Math.PI * 2; // Random 4-corner diamond star orientation
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            geo.setAttribute("aDirection", new THREE.BufferAttribute(directions, 3));
            geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
            geo.setAttribute("aRotation", new THREE.BufferAttribute(rotations, 1));
            return geo;
        }, []);

        const uniforms = useMemo(
            () => ({
                uProgress: { value: 0 },
            }),
            [],
        );

        return (
            <points ref={localPointsRef} visible={false} geometry={geometry}>
                <shaderMaterial
                    ref={localMaterialRef}
                    vertexShader={burstVertex}
                    fragmentShader={burstFragment}
                    uniforms={uniforms}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        );
    },
);
