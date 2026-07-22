"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const DEFAULT_MODEL_URL = "/3D-model/classic_black_flame_hoodie.glb";

/* ------------------------------------------------------------------ */
/*  Camera choreography — one preset per facet.                        */
/*  The camera ORBITS to each preset (spherical interpolation), so it  */
/*  never cuts through the garment, and the user can grab + rotate at  */
/*  any moment — dragging cancels the fly-in instead of fighting it.   */
/* ------------------------------------------------------------------ */

type Vec3 = [number, number, number];
type View = { pos: Vec3; target: Vec3 };

const FACET_VIEWS: View[] = [
  { pos: [0, 0.25, 4.4], target: [0, 0.05, 0] },               // 0 · 360° VIEW
  { pos: [-1.15, -0.15, 1.95], target: [-0.42, -0.25, 0.35] }, // 1 · FABRIC
  { pos: [0.15, 0.2, 1.7], target: [0, 0.08, 0.5] },           // 2 · EMBROIDERY
  { pos: [1.55, 1.15, 1.75], target: [0.5, 0.75, 0.15] },      // 3 · STITCHING
  { pos: [0, 0.35, -3.3], target: [0, 0.15, 0] },              // 4 · ARTWORK (back)
  { pos: [0.1, -0.85, 1.9], target: [0, -1.0, 0.45] },         // 5 · LABELS
];

/* Scratch objects reused every frame — no per-frame allocation */
const _desiredPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();
const _offset = new THREE.Vector3();
const _sph = new THREE.Spherical();
const _sphTarget = new THREE.Spherical();

/* ------------------------------------------------------------------ */
/*  Hoodie GLB — auto-centered + scaled to match the stage             */
/* ------------------------------------------------------------------ */

const TARGET_HEIGHT = 2.2; // world units — matches the previous procedural body

function HoodieModel({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);

  const normalizedScene = useMemo(() => {
    const clone = scene.clone(true);

    // Bounding-box normalize: center at origin, scale to a consistent height,
    // so the camera choreography in FACET_VIEWS lines up regardless of the
    // model's authored scale.
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    clone.position.sub(center);

    const wrapper = new THREE.Group();
    wrapper.add(clone);
    if (size.y > 0) wrapper.scale.setScalar(TARGET_HEIGHT / size.y);

    // Shadows + studio look: catch the warm rim light without going flat.
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((m) => {
        const std = m as THREE.MeshStandardMaterial;
        if (std && "envMapIntensity" in std) std.envMapIntensity = 0.85;
      });
    });

    return wrapper;
  }, [scene]);

  return <primitive object={normalizedScene} />;
}

useGLTF.preload(DEFAULT_MODEL_URL);
useGLTF.preload("/3D-model/orange-hoodie.glb");
useGLTF.preload("/3D-model/underrated_hoodie.glb");
useGLTF.preload("/3D-model/balenciaga_hoodie.glb");
useGLTF.preload("/3D-model/stylized_hoodie_jacket.glb");

/* ------------------------------------------------------------------ */
/*  The stage — GLB hoodie + facet-driven camera choreography          */
/* ------------------------------------------------------------------ */

function Stage({ activeFacet, modelUrl }: { activeFacet: number; modelUrl: string }) {
  const hoodieRef = useRef<THREE.Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const transitioningRef = useRef(true);
  const draggingRef = useRef(false);

  /* Every facet change starts one camera fly-in, then hands control back */
  useEffect(() => {
    transitioningRef.current = true;
  }, [activeFacet]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    /* Gentle studio idle — position only, never rotation, so it can't
       fight the user's drag */
    if (hoodieRef.current) {
      hoodieRef.current.position.y =
        0.03 + Math.sin(state.clock.elapsedTime * 0.9) * 0.008;
    }

    const controls = controlsRef.current;
    if (!controls) return;

    const view = FACET_VIEWS[activeFacet] ?? FACET_VIEWS[0];

    if (transitioningRef.current && !draggingRef.current) {
      const t = 1 - Math.exp(-3.4 * dt); // framerate-independent damping

      _desiredTarget.set(...view.target);
      controls.target.lerp(_desiredTarget, t);

      /* Interpolate in spherical space around the (moving) target so the
         camera swings AROUND the hoodie instead of clipping through it */
      _offset.copy(state.camera.position).sub(controls.target);
      _sph.setFromVector3(_offset);
      _desiredPos.set(...view.pos).sub(_desiredTarget);
      _sphTarget.setFromVector3(_desiredPos);

      let dTheta = _sphTarget.theta - _sph.theta;
      dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta)); // shortest arc
      _sph.theta += dTheta * t;
      _sph.phi += (_sphTarget.phi - _sph.phi) * t;
      _sph.radius += (_sphTarget.radius - _sph.radius) * t;
      _sph.makeSafe();

      state.camera.position.setFromSpherical(_sph).add(controls.target);

      _desiredPos.set(...view.pos);
      if (
        state.camera.position.distanceToSquared(_desiredPos) < 0.0006 &&
        controls.target.distanceToSquared(_desiredTarget) < 0.0003
      ) {
        state.camera.position.copy(_desiredPos);
        controls.target.copy(_desiredTarget);
        transitioningRef.current = false;
      }
    }

    /* Slow turntable in 360° mode; pauses while the user drags and while
       flying between facets, resumes on release */
    controls.autoRotate =
      activeFacet === 0 && !transitioningRef.current && !draggingRef.current;
    controls.update();
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.8}
        autoRotateSpeed={0.8}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4.5}
        onStart={() => {
          draggingRef.current = true;
          transitioningRef.current = false; // user takes over instantly
        }}
        onEnd={() => {
          draggingRef.current = false;
        }}
      />

      <group ref={hoodieRef} position={[0, 0.03, 0]}>
        <HoodieModel modelUrl={modelUrl} />
      </group>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas wrapper — same public API as before                         */
/* ------------------------------------------------------------------ */

export default function HoodieCanvas({ activeFacet, modelUrl = DEFAULT_MODEL_URL }: { activeFacet: number; modelUrl?: string }) {
  return (
    <div className="w-full h-full relative" style={{ height: "450px" }}>
      <Canvas
        camera={{ position: [0, 0.25, 4.4], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 5]} intensity={1.15} color="#f4ead6" />
        <directionalLight position={[-6, 3, -4]} intensity={0.45} color="#c9a24b" />
        <pointLight position={[0, 2.4, -3]} intensity={0.5} color="#e7c77a" />
        <pointLight position={[0, 1.5, 3]} intensity={0.55} color="#ede6d3" />

        <Suspense fallback={null}>
          <Stage activeFacet={activeFacet} modelUrl={modelUrl} />
        </Suspense>

        <ContactShadows
          position={[0, -1.42, 0]}
          opacity={0.5}
          scale={7}
          blur={2.6}
          far={2.2}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}