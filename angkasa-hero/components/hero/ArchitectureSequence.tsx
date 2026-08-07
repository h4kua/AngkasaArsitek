"use client";

/**
 * PLACEHOLDER ARCHITECTURE — read this before touching camera framing.
 *
 * Massing below is now shaped after a reference image the user supplied
 * (filename indicates it was AI-generated via Gemini, not a photo of a
 * real, built structure — treated here as a style/composition/material
 * reference, not a "must match exactly" target). Signature moves pulled
 * from it: two-story massing, a dramatic one-directional cantilevered
 * roof with a dark wood soffit, a vertical wood slat screen, and three
 * distinct material zones (white render, warm travertine, dark wood).
 *
 * This is still primitive-built (boxes + instanced slats), not a real
 * model — proportions and detail are an approximation, not a match.
 * Once a real photo or GLB/GLTF of the actual Angkasa design exists, this
 * file — and the camera keyframes in constants.ts — are what get
 * replaced. The wireframe→solid crossfade technique and the scroll-
 * progress wiring underneath it do not need to change.
 */

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { BREAKPOINTS, mapRange, PALETTE } from "./constants";

const WOOD = "#4A3324";

interface Volume {
  position: [number, number, number];
  size: [number, number, number];
  material: "render" | "travertine" | "wood";
}

// Loosely reads left-to-right, back-to-front against the reference image.
const VOLUMES: Volume[] = [
  { position: [4.6, 1.0, -1.7], size: [3.6, 2.0, 0.4], material: "render" }, // rear wall / stair core
  { position: [5.85, 2.15, -1.3], size: [2.6, 1.5, 2.8], material: "render" }, // upper 2nd-story volume
  { position: [5.7, 0.55, 0.4], size: [2.0, 1.1, 2.0], material: "travertine" }, // lower forward volume
  { position: [4, 0.12, -0.5], size: [7.6, 0.24, 4.6], material: "travertine" }, // podium / plinth
  { position: [2.1, 2.55, -1], size: [9.4, 0.16, 4.2], material: "wood" }, // cantilevered roof slab
];

const GLASS_FACADES: { position: [number, number, number]; size: [number, number] }[] = [
  { position: [3.7, 1.05, 0.42], size: [3.4, 1.9] },
  { position: [5.85, 2.1, 0.12], size: [1.1, 1.3] },
];

const SLAT_COUNT = 11;
const SLAT_X_RANGE: [number, number] = [4.75, 6.95];

function materialColor(kind: Volume["material"]) {
  switch (kind) {
    case "render":
      return PALETTE.stone;
    case "travertine":
      return PALETTE.clay;
    case "wood":
      return WOOD;
  }
}

function VolumeMesh({
  volume,
  entranceRef,
  crossfadeRef,
}: {
  volume: Volume;
  entranceRef: RefObject<number>;
  crossfadeRef: RefObject<number>;
}) {
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const solidMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const solidMeshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const entrance = entranceRef.current; // 0 = not arrived yet, 1 = fully arrived
    const t = crossfadeRef.current; // 0 = pure wireframe, 1 = pure solid
    // Wireframe fades IN with entrance — it must never be visible before
    // its scene (a real bug in an earlier pass left it at opacity 1 from
    // scroll position 0, floating in the sky before scene 1-2 played).
    // It settles to a faint residual accent rather than fully disappearing
    // once the solid volume takes over.
    const wireOpacity = entrance * THREE.MathUtils.lerp(1, 0.12, t);
    if (wireMatRef.current) wireMatRef.current.opacity = wireOpacity;
    if (solidMatRef.current) solidMatRef.current.opacity = entrance * t;
    if (solidMeshRef.current) {
      solidMeshRef.current.scale.setScalar(THREE.MathUtils.lerp(0.985, 1, t));
    }
  });

  return (
    <group position={volume.position}>
      {/* Wireframe guide (scene 3) */}
      <mesh>
        <boxGeometry args={volume.size} />
        <meshBasicMaterial
          ref={wireMatRef}
          color={PALETTE.gold}
          wireframe
          transparent
          opacity={0}
        />
      </mesh>
      {/* Solid PBR volume (scenes 4-5), crossfaded in over the wireframe.
          castShadow only on volumes with real visual shadow value; the
          thin roof slab and podium contribute little and are skipped to
          keep the shadow pass cheap. */}
      <mesh
        ref={solidMeshRef}
        castShadow={volume.size[1] > 0.3}
        receiveShadow
      >
        <boxGeometry args={volume.size} />
        <meshStandardMaterial
          ref={solidMatRef}
          color={materialColor(volume.material)}
          roughness={volume.material === "wood" ? 0.6 : 0.8}
          metalness={0.03}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

function SlatScreen({
  entranceRef,
  crossfadeRef,
}: {
  entranceRef: RefObject<number>;
  crossfadeRef: RefObject<number>;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const slats = useMemo(() => {
    const [minX, maxX] = SLAT_X_RANGE;
    return Array.from({ length: SLAT_COUNT }, (_, i) => {
      const x = minX + (i / (SLAT_COUNT - 1)) * (maxX - minX);
      return { x };
    });
  }, []);

  useFrame(() => {
    const opacity = entranceRef.current * crossfadeRef.current;
    if (matRef.current) matRef.current.opacity = opacity;
  });

  return (
    <Instances limit={SLAT_COUNT} castShadow={false}>
      <boxGeometry args={[0.07, 1.5, 0.06]} />
      <meshStandardMaterial
        ref={matRef}
        color={WOOD}
        roughness={0.65}
        transparent
        opacity={0}
      />
      {slats.map((s, i) => (
        <Instance key={i} position={[s.x, 2.15, 0.16]} />
      ))}
    </Instances>
  );
}

const BOULDERS: { position: [number, number, number]; scale: number }[] = [
  { position: [-1.4, 0.18, 1.8], scale: 0.32 },
  { position: [-0.6, 0.14, 2.4], scale: 0.22 },
  { position: [7.2, 0.2, 2.1], scale: 0.36 },
];

function Boulders({ entranceRef }: { entranceRef: RefObject<number> }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    if (matRef.current) matRef.current.opacity = entranceRef.current;
  });
  return (
    <Instances limit={BOULDERS.length} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        ref={matRef}
        color={PALETTE.clay}
        roughness={1}
        transparent
        opacity={0}
      />
      {BOULDERS.map((b, i) => (
        <Instance key={i} position={b.position} scale={b.scale} rotation={[i, i * 2, i * 0.5]} />
      ))}
    </Instances>
  );
}

function GlassFacade({
  spec,
  glassOpacityRef,
  interiorRef,
}: {
  spec: (typeof GLASS_FACADES)[number];
  glassOpacityRef: RefObject<number>;
  interiorRef: RefObject<number>;
}) {
  const glassRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    // Plain transparent + opacity "fake glass" instead of a physically
    // transmissive material. MeshPhysicalMaterial's `transmission` needs
    // an extra full scene capture per transmissive object per frame — one
    // of the most expensive PBR features available, and the direct cause
    // of a large chunk of the reported slowdown once these facades became
    // visible. This reads as glass-enough (tinted, slightly reflective
    // via envMap, backed by a warm interior glow) without that cost.
    if (glassRef.current) glassRef.current.opacity = glassOpacityRef.current * 0.4;
    if (lightMatRef.current) {
      lightMatRef.current.opacity = glassOpacityRef.current;
      lightMatRef.current.emissiveIntensity = interiorRef.current * 1.8;
    }
  });

  return (
    <group position={spec.position}>
      {/* warm interior light glow, sits behind the glass */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={spec.size} />
        <meshStandardMaterial
          ref={lightMatRef}
          color={PALETTE.ink}
          emissive={PALETTE.gold}
          emissiveIntensity={0}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <planeGeometry args={spec.size} />
        <meshStandardMaterial
          ref={glassRef}
          color={PALETTE.mist}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

export default function ArchitectureSequence({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const gridVisibilityRef = useRef(0);
  const entranceRef = useRef(0);
  const crossfadeRef = useRef(0);
  const glassOpacityRef = useRef(0);
  const interiorRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);

  const groundGridLines = useMemo(() => {
    const lines: [number, number, number, number][] = [];
    for (let i = -8; i <= 8; i++) {
      lines.push([i, -8, i, 8]);
      lines.push([-8, i, 8, i]);
    }
    return lines;
  }, []);

  const gridGeometry = useMemo(() => {
    const positions = new Float32Array(groundGridLines.length * 6);
    groundGridLines.forEach(([x1, z1, x2, z2], i) => {
      positions.set([x1, 0, z1, x2, 0, z2], i * 6);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [groundGridLines]);

  const gridMatRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    const p = progressRef.current;

    gridVisibilityRef.current = mapRange(
      p,
      BREAKPOINTS.landscapeReveal,
      BREAKPOINTS.structuralGrid
    );
    entranceRef.current = gridVisibilityRef.current;

    if (gridMatRef.current) {
      gridMatRef.current.opacity =
        gridVisibilityRef.current *
        (1 - mapRange(p, BREAKPOINTS.architectureVolume, BREAKPOINTS.materialsTransition));
    }

    crossfadeRef.current = mapRange(
      p,
      BREAKPOINTS.structuralGrid,
      BREAKPOINTS.materialsTransition
    );

    glassOpacityRef.current = mapRange(
      p,
      BREAKPOINTS.architectureVolume,
      BREAKPOINTS.materialsTransition
    );

    interiorRef.current = mapRange(
      p,
      BREAKPOINTS.vegetationAnimation,
      BREAKPOINTS.interiorLighting
    );

    if (groupRef.current) {
      groupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(0.94, 1, mapRange(p, BREAKPOINTS.structuralGrid, BREAKPOINTS.architectureVolume))
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Scene 3: thin ground construction grid */}
      <lineSegments position={[0, 0.005, 0]}>
        <primitive object={gridGeometry} attach="geometry" />
        <lineBasicMaterial ref={gridMatRef} color={PALETTE.gold} transparent opacity={0} />
      </lineSegments>

      {VOLUMES.map((v, i) => (
        <VolumeMesh key={i} volume={v} entranceRef={entranceRef} crossfadeRef={crossfadeRef} />
      ))}

      <SlatScreen entranceRef={entranceRef} crossfadeRef={crossfadeRef} />
      <Boulders entranceRef={entranceRef} />

      {GLASS_FACADES.map((spec, i) => (
        <GlassFacade
          key={i}
          spec={spec}
          glassOpacityRef={glassOpacityRef}
          interiorRef={interiorRef}
        />
      ))}
    </group>
  );
}
