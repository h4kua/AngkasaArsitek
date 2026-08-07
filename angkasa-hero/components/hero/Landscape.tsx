"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { BREAKPOINTS, mapRange, PALETTE } from "./constants";

const TREE_COUNT = 48;

// Deterministic PRNG so the scatter is stable across renders/reloads
// instead of relying on Math.random (which would repaint the forest on
// every hot-reload and every visitor).
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TreeSpec {
  position: [number, number, number];
  scale: number;
  phase: number;
}

function useTreeScatter(): TreeSpec[] {
  return useMemo(() => {
    const rand = mulberry32(1337);
    const specs: TreeSpec[] = [];
    while (specs.length < TREE_COUNT) {
      const angle = rand() * Math.PI * 2;
      const radius = 3.2 + rand() * 11;
      const position: [number, number, number] = [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius - 3,
      ];
      if (position[0] > -1.5 && position[0] < 8 && position[2] > -3.5 && position[2] < 4.8) continue; // keep villa + pool footprint clear
      specs.push({ position, scale: 0.6 + rand() * 0.9, phase: rand() * Math.PI * 2 });
    }
    return specs;
  }, []);
}

function TreeInstances({
  trees,
  windRef,
}: {
  trees: TreeSpec[];
  windRef: RefObject<number>;
}) {
  const canopyRefs = useRef<(THREE.Object3D | null)[]>([]);

  useFrame(({ clock }) => {
    const wind = windRef.current;
    const time = clock.getElapsedTime();
    trees.forEach((spec, i) => {
      const ref = canopyRefs.current[i];
      if (!ref) return;
      const sway = Math.sin(time * 1.4 + spec.phase) * 0.06 * wind;
      ref.rotation.z = sway;
      ref.rotation.x = sway * 0.4;
    });
  });

  return (
    <>
      <Instances limit={TREE_COUNT}>
        <cylinderGeometry args={[0.05, 0.08, 1, 6]} />
        <meshStandardMaterial color={PALETTE.clay} roughness={0.9} />
        {trees.map((spec, i) => (
          <Instance
            key={i}
            position={[spec.position[0], 0.5 * spec.scale, spec.position[2]]}
            scale={spec.scale}
          />
        ))}
      </Instances>
      <Instances limit={TREE_COUNT}>
        <coneGeometry args={[0.55, 1.1, 7]} />
        <meshStandardMaterial color={PALETTE.sage} roughness={0.85} />
        {trees.map((spec, i) => (
          <Instance
            key={i}
            ref={(el: THREE.Object3D | null) => {
              canopyRefs.current[i] = el;
            }}
            position={[spec.position[0], 1.15 * spec.scale, spec.position[2]]}
            scale={spec.scale}
          />
        ))}
      </Instances>
    </>
  );
}

export default function Landscape({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const groundRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const windRef = useRef(0);
  const trees = useTreeScatter();

  useFrame(() => {
    const p = progressRef.current;
    const reveal = mapRange(p, BREAKPOINTS.cloudMovement, BREAKPOINTS.landscapeReveal);

    if (materialRef.current) materialRef.current.opacity = reveal;
    if (groundRef.current) {
      groundRef.current.scale.setScalar(THREE.MathUtils.lerp(0.85, 1, reveal));
    }

    windRef.current = mapRange(
      p,
      BREAKPOINTS.materialsTransition,
      BREAKPOINTS.vegetationAnimation
    );
  });

  return (
    <group>
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial
          ref={materialRef}
          color={PALETTE.sage}
          roughness={1}
          transparent
          opacity={0}
        />
      </mesh>

      <TreeInstances trees={trees} windRef={windRef} />
    </group>
  );
}
