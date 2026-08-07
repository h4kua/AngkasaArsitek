"use client";

import { useMemo, useRef, type ElementRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky, Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";
import { BREAKPOINTS, mapRange, PALETTE } from "./constants";

const BIRD_COUNT = 7;

function Birds({ progressRef }: { progressRef: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: BIRD_COUNT }, (_, i) => ({
        radius: 9 + (i % 3) * 2.5,
        height: 7 + ((i * 37) % 5),
        speed: 0.05 + (i % 4) * 0.01,
        phase: (i / BIRD_COUNT) * Math.PI * 2,
        flapPhase: i * 1.7,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    // Birds are most visible early, and thin out once the architecture
    // becomes the visual focus so they don't clutter the material reveal.
    const visibility =
      1 - mapRange(progressRef.current, BREAKPOINTS.structuralGrid, BREAKPOINTS.architectureVolume);
    group.current.visible = visibility > 0.02;
    group.current.children.forEach((child, i) => {
      const s = seeds[i];
      const t = clock.getElapsedTime() * s.speed + s.phase;
      child.position.set(
        Math.cos(t) * s.radius,
        s.height + Math.sin(clock.getElapsedTime() * 2 + s.flapPhase) * 0.15,
        -6 + Math.sin(t) * s.radius * 0.4
      );
      child.rotation.y = -t + Math.PI / 2;
      const flap = Math.sin(clock.getElapsedTime() * 9 + s.flapPhase) * 0.5;
      child.rotation.z = flap;
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = visibility * 0.85;
    });
  });

  return (
    <group ref={group}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <planeGeometry args={[0.5, 0.14]} />
          <meshBasicMaterial
            color={PALETTE.ink}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SkyLayer({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const skyRef = useRef<ElementRef<typeof Sky>>(null);
  const fogRef = useRef<THREE.FogExp2>(null);
  const cloudGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const p = progressRef.current;

    // Sun climbs slightly through the sequence — "golden sunrise"
    // progressing. This ONLY touches the Sky shader's uniform (a cosmetic,
    // cheap change), not the actual shadow-casting light below.
    //
    // Previously this also repositioned the directionalLight every frame,
    // which forces three.js to recompute the entire shadow map from
    // scratch every single frame (a moving shadow-casting light can never
    // be cached) — across the whole scroll range, on top of everything
    // else in the scene. That was the single biggest cause of the reported
    // slowdown during the architecture-reveal scenes. The key light is now
    // static; only the sky visual moves.
    const elevation = THREE.MathUtils.lerp(0.08, 0.22, mapRange(p, 0, 1));
    const sunUniform = skyRef.current?.material.uniforms.sunPosition;
    if (sunUniform) sunUniform.value.set(0.42, elevation, -0.62);

    // Fog thins as the landscape resolves (spec: "subtle fog" in scene 1,
    // "morning mist" easing by scene 2).
    if (fogRef.current) {
      const density = THREE.MathUtils.lerp(
        0.045,
        0.014,
        mapRange(p, BREAKPOINTS.skyOnly, BREAKPOINTS.landscapeReveal)
      );
      fogRef.current.density = density;
    }

    if (cloudGroupRef.current) {
      cloudGroupRef.current.position.x += delta * 0.06;
      if (cloudGroupRef.current.position.x > 20) cloudGroupRef.current.position.x = -20;
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={[PALETTE.skyDawn, 0.03]} />
      <Sky
        ref={skyRef}
        sunPosition={[0.42, 0.08, -0.62]}
        turbidity={6}
        rayleigh={1.4}
        mieCoefficient={0.02}
        mieDirectionalG={0.85}
      />
      <directionalLight
        position={[16, 11, -10]}
        intensity={2.6}
        color={PALETTE.gold}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
      />
      <hemisphereLight
        args={[PALETTE.skyDeep, PALETTE.sage, 0.5]}
      />

      <group ref={cloudGroupRef}>
        <Clouds limit={12} material={THREE.MeshLambertMaterial}>
          <Cloud
            seed={1}
            segments={24}
            bounds={[10, 1.2, 3]}
            volume={7}
            color={PALETTE.stone}
            opacity={0.55}
            fade={30}
            growth={4}
            speed={0.06}
            position={[-4, 8.5, -14]}
          />
          <Cloud
            seed={2}
            segments={20}
            bounds={[8, 1, 3]}
            volume={5}
            color={PALETTE.mist}
            opacity={0.4}
            fade={30}
            growth={4}
            speed={0.05}
            position={[6, 7, -18]}
          />
        </Clouds>
      </group>

      <Birds progressRef={progressRef} />
    </>
  );
}
