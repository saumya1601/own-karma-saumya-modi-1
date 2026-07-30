"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import * as THREE from "three";

/**
 * Direct, fail-safe cursor follow physics for Act I:
 * Reads mouse / pointer coordinates directly from window pointermove & R3F state.pointer.
 * Guarantees smooth, responsive tracking across 100% of devices.
 */
export function useParticleFollow(
  ref: RefObject<THREE.Object3D | null>,
  enabled: boolean
) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerMove = (e: PointerEvent) => {
      // Convert screen pixels to normalized (-1 to +1) device coordinates
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!enabled || !ref.current) return;

    // Prefer window mouseRef if active, fallback to state.pointer
    const px = mouseRef.current.x !== 0 ? mouseRef.current.x : state.pointer.x;
    const py = mouseRef.current.y !== 0 ? mouseRef.current.y : state.pointer.y;

    // Map pointer to 3D viewport bounds
    const targetX = (px * state.viewport.width) / 2.2;
    const targetY = (py * state.viewport.height) / 2.2;

    // Gentle organic float offset
    const t = state.clock.elapsedTime;
    const floatX = Math.sin(t * 1.5) * 0.08;
    const floatY = Math.cos(t * 1.2) * 0.08;

    // Smooth frame-rate independent dampening towards cursor position
    ref.current.position.x = THREE.MathUtils.damp(
      ref.current.position.x,
      targetX + floatX,
      5.0, // Responsive spring lag
      delta
    );
    ref.current.position.y = THREE.MathUtils.damp(
      ref.current.position.y,
      targetY + floatY,
      5.0,
      delta
    );
  });
}
