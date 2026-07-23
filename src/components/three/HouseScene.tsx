"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { PHASES, easeOutQuart, phaseT, smoothstep } from "./phases";
import { mulberry32 } from "./palette";
import LuxuryVilla from "./LuxuryVilla";
import Atmosphere from "./Atmosphere";
import Hotspots from "./Hotspots";

interface HouseSceneProps {
  progressRef: MutableRefObject<number>;
  active: boolean;
}

// Cinematic low-angle presentation: more frontal azimuth shows the glass
// curtain wall and fin details; lower elevation reads like a photographer
// standing near the site, not a plan diagram from above.
const ISO_AZIMUTH = THREE.MathUtils.degToRad(32);
const ISO_ELEVATION = THREE.MathUtils.degToRad(20);

// Tight-fit half-extents for this azimuth/elevation/sweep combination,
// measured against the full terrain silhouette + roofline at every point in
// the reveal sweep (azimuth 32-40deg, targetY 1.2-1.48) with ~12% margin.
// Re-measure if the camera angle, dist, or targetY range changes.
const CONTENT_HALF_W = 6.5;
const CONTENT_HALF_H = 4.1;

interface ProgressDamperProps {
  progressRef: MutableRefObject<number>;
  smoothRef: MutableRefObject<number>;
}

/**
 * Smooths raw scroll progress once per frame for every consumer. Mounted
 * first so its useFrame runs before any animation reads smoothRef.
 */
function ProgressDamper({ progressRef, smoothRef }: ProgressDamperProps) {
  useFrame((_, delta) => {
    smoothRef.current = THREE.MathUtils.damp(smoothRef.current, progressRef.current, 10, delta);
  });
  return null;
}

interface CameraRigProps {
  smoothRef: MutableRefObject<number>;
}

/**
 * Cinematic low-angle framing: contain-fit at any aspect ratio, with a
 * slow 8° azimuth sweep as the villa is revealed (pulls the viewer around
 * the building), a gentle pull-back for the night-sky finale, a hair of
 * breathing parallax drift, and a subtle cursor-follow tilt so the scene
 * visibly responds to the visitor instead of reading as a static image.
 */
function CameraRig({ smoothRef }: CameraRigProps) {
  const mouseAz = useRef(0);
  const mouseEl = useRef(0);

  useFrame((state, delta) => {
    const p = smoothRef.current;
    const aspect = state.size.width / state.size.height;
    const cam = state.camera as THREE.OrthographicCamera;

    const reveal = easeOutQuart(Math.min(p / 0.5, 1));
    const finale = smoothstep(phaseT(p, PHASES.atmosphere));
    const zoomK = (0.87 + 0.13 * reveal) * (1 + 0.06 * finale);

    const halfH = Math.max(CONTENT_HALF_H, CONTENT_HALF_W / aspect) * zoomK;
    const halfW = halfH * aspect;
    cam.left = -halfW;
    cam.right = halfW;
    cam.top = halfH;
    cam.bottom = -halfH;
    cam.near = 0.1;
    cam.far = 60;
    cam.updateProjectionMatrix();

    // Cursor parallax: the camera eases toward the pointer, capped small
    // enough to stay well inside the tight-fit frustum margin.
    mouseAz.current = THREE.MathUtils.damp(mouseAz.current, state.pointer.x * 0.042, 4, delta);
    mouseEl.current = THREE.MathUtils.damp(mouseEl.current, state.pointer.y * 0.02, 4, delta);

    // Slow cinematic sweep: starts at +8° offset and settles to ISO_AZIMUTH
    // as the building completes — feels like the camera circles in to present
    // the finished villa.
    const sweep = THREE.MathUtils.degToRad(8) * (1 - reveal);
    const drift = Math.sin(state.clock.elapsedTime * 0.07) * 0.003;
    const azimuth = ISO_AZIMUTH + sweep + drift + mouseAz.current;
    const elevation = ISO_ELEVATION + mouseEl.current;

    const targetY = 1.2 + 0.28 * reveal;
    const dist = 26;
    cam.position.set(
      Math.sin(azimuth) * Math.cos(elevation) * dist,
      Math.sin(elevation) * dist + targetY,
      Math.cos(azimuth) * Math.cos(elevation) * dist,
    );
    cam.lookAt(0, targetY, 0.0);
  });

  return null;
}

const MOTE_COUNT_DESKTOP = 70;
const MOTE_COUNT_MOBILE = 30;

/** A few slow, faint motes drifting through the scene, always present and never distracting. */
function AmbientMotes() {
  const { size } = useThree();
  const count = size.width < 768 ? MOTE_COUNT_MOBILE : MOTE_COUNT_DESKTOP;
  const points = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const rand = mulberry32(1987);
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 8.5;
      pos[i * 3 + 1] = rand() * 3.6;
      pos[i * 3 + 2] = (rand() - 0.5) * 5.5;
      spd[i] = 0.03 + rand() * 0.05;
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  useFrame((_, delta) => {
    if (!points.current) return;
    const attr = points.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = attr.getY(i) + speeds[i] * delta;
      if (y > 3.7) y = 0;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#D6CEC2"
        transparent
        opacity={0.22}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function HouseScene({ progressRef, active }: HouseSceneProps) {
  const smoothRef = useRef(0);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
      style={{ background: "transparent" }}
    >
      <ProgressDamper progressRef={progressRef} smoothRef={smoothRef} />

      {/* The illustrated backdrop rides on the camera so it frames the
          villa identically at every aspect ratio. */}
      <OrthographicCamera makeDefault position={[17, 12, 17]} zoom={1}>
        <Atmosphere smoothRef={smoothRef} />
      </OrthographicCamera>
      <CameraRig smoothRef={smoothRef} />

      {/* Flat, unlit materials do the shading; this is just gentle fill so
          non-model helpers (shadow plane) read correctly. */}
      <ambientLight intensity={0.9} />

      <LuxuryVilla smoothRef={smoothRef} />
      <AmbientMotes />
      <Hotspots smoothRef={smoothRef} />

      <ContactShadows position={[0, 0.003, 0]} opacity={0.35} scale={11} blur={2.4} far={4} />
    </Canvas>
  );
}
