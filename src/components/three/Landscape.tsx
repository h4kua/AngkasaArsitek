"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PHASES, easeOutQuart, phaseT, smoothstep, stagger } from "./phases";
import {
  BLOSSOM,
  BOUGAINVILLEA_BRACT,
  BOUGAINVILLEA_BRACT_LIGHT,
  BOUGAINVILLEA_LEAF,
  BOX_MAT,
  CHARCOAL,
  CONCRETE,
  FABRIC,
  FRANGIPANI_BRANCH,
  FRANGIPANI_FLOWER,
  FRANGIPANI_LEAF,
  FRANGIPANI_LEAF_DARK,
  GLOW,
  GRASS_SIDE,
  GRASS_TOP,
  GRAVEL,
  OAK,
  OLIVE,
  OLIVE_DARK,
  PALM_GREEN,
  PALM_GREEN_DARK,
  PALM_TRUNK,
  SOIL_DEEP,
  SOIL_EDGE,
  STEEL,
  STONE,
  STONE_CAP,
  TERRACE_TOP,
  TRAVERTINE,
  TRUNK,
  WATER,
  WATER_SUNSET,
  applyGlow,
  grow,
  mulberry32,
} from "./palette";
import { terrainOutlines, terrainSlabGeometry } from "./terrain";
import FlatBox from "./FlatBox";
import { PODIUM_TOP } from "./House";

const PLANK_COUNT = 12;
const PEBBLE_COUNT = 26;
const LAND_POP_COUNT = 15;

const TIER_A_DEPTH = 0.1;
const TIER_B_DEPTH = 0.26;
const GRAVEL_STEP = 0.045;

// Stepping-stone path: [x, z, rotation]. A gentle wander, not a straight line.
const PATH_PADS: Array<[number, number, number]> = [
  [-3.05, 2.62, 0.09],
  [-2.35, 2.82, -0.06],
  [-1.65, 2.6, 0.12],
  [-0.95, 2.8, -0.08],
  [-0.25, 2.64, 0.05],
];

// Grass fields: [center x, center z, radius x, radius z, seed]
const GRASS_BLOBS: Array<[number, number, number, number, number]> = [
  [-2.4, 2.5, 2.1, 1.0, 11],
  [4.0, 2.5, 0.85, 0.8, 23],
  [-0.9, -2.85, 1.9, 0.6, 37],
];

// Garden path bollards along the stepping-stone walk
const BOLLARDS: Array<[number, number]> = [
  [-2.65, 2.98],
  [-1.45, 3.0],
  [-0.25, 2.98],
];

// Signature tropical trees flanking the entrance: [x, z, height scale] --
// a coconut palm and a frangipani (kamboja), the two most recognizable
// garden species in Riau, not the Mediterranean/Japanese planting a
// generic "luxury villa" render would default to.
const SIDE_TREES: Array<[number, number, number]> = [
  [-4.1, 2.3, 1.0],
  [4.15, 1.25, 0.85],
];

const WATER_COLOR = new THREE.Color(WATER);
const WATER_SUNSET_COLOR = new THREE.Color(WATER_SUNSET);
const GRASS_TOP_MAT = new THREE.MeshBasicMaterial({ color: GRASS_TOP });
const GRASS_SIDE_MAT = new THREE.MeshBasicMaterial({ color: GRASS_SIDE });

/** Smooth organic blob outline for lawns, quadratic curves through jittered radii. */
function blobShape(rx: number, rz: number, seed: number): THREE.Shape {
  const rand = mulberry32(seed);
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 0.84 + rand() * 0.3;
    return new THREE.Vector2(Math.cos(a) * rx * k, Math.sin(a) * rz * k);
  });
  const mid = (a: THREE.Vector2, b: THREE.Vector2) =>
    new THREE.Vector2((a.x + b.x) / 2, (a.y + b.y) / 2);
  const shape = new THREE.Shape();
  const m0 = mid(pts[n - 1], pts[0]);
  shape.moveTo(m0.x, m0.y);
  for (let i = 0; i < n; i++) {
    const next = pts[(i + 1) % n];
    const m = mid(pts[i], next);
    shape.quadraticCurveTo(pts[i].x, pts[i].y, m.x, m.y);
  }
  return shape;
}

function grassGeometry(rx: number, rz: number, seed: number): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(blobShape(rx, rz, seed), {
    depth: 0.045,
    bevelEnabled: false,
  });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

/** Blueprint grid on the ground plane, radially faded, replaced by nature late on. */
function makeGridTexture(): THREE.CanvasTexture {
  const W = 520;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = W;
  const ctx = canvas.getContext("2d")!;
  const cell = 10;
  for (let i = 0; i <= W / cell; i++) {
    const major = i % 5 === 0;
    ctx.strokeStyle = major ? "rgba(61, 99, 255, 0.4)" : "rgba(42, 43, 47, 0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(i * cell + 0.5, 0);
    ctx.lineTo(i * cell + 0.5, W);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cell + 0.5);
    ctx.lineTo(W, i * cell + 0.5);
    ctx.stroke();
  }
  const fade = ctx.createRadialGradient(W / 2, W / 2, 0, W / 2, W / 2, W / 2);
  fade.addColorStop(0, "rgba(255,255,255,1)");
  fade.addColorStop(0.55, "rgba(255,255,255,0.85)");
  fade.addColorStop(1, "rgba(255,255,255,0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, W);
  return new THREE.CanvasTexture(canvas);
}

/** Faint concentric ripple rings, tiled and drifted across the pool surface. */
function makeRippleTexture(): THREE.CanvasTexture {
  const W = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = W;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#7E7E7E";
  ctx.fillRect(0, 0, W, W);
  const rand = mulberry32(303);
  for (let i = 0; i < 5; i++) {
    const cx = rand() * W;
    const cy = rand() * W;
    const maxR = 40 + rand() * 60;
    for (let r = maxR; r > 4; r -= 7) {
      const t = r / maxR;
      ctx.strokeStyle = `rgba(255,255,255,${(0.12 * (1 - t)).toFixed(3)})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.4, 1.2);
  return tex;
}

function seedPebbles(mesh: THREE.InstancedMesh) {
  const rand = mulberry32(77);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  for (let i = 0; i < PEBBLE_COUNT; i++) {
    const s = 0.6 + rand() * 0.85;
    pos.set(2.7 + (rand() - 0.5) * 2.6, 0.045 * s * 0.5 + 0.03, -2.95 + (rand() - 0.5) * 0.72);
    scl.set(s, s * 0.5, s);
    m.compose(pos, q, scl);
    mesh.setMatrixAt(i, m);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

interface LandscapeProps {
  smoothRef: MutableRefObject<number>;
}

/**
 * Everything around the villa: an organic, two-tier carved terrain (a site
 * surface holding lawns/gravel/pool/podium, and a lower plinth showing a
 * soil-and-stone strata edge), pool, gravel garden with pergola, fire pit,
 * palm and olive trees, sculpture, and garden lighting -- growing in as the
 * landscape act of the scroll story, then settling into golden-hour life.
 */
export default function Landscape({ smoothRef }: LandscapeProps) {
  const gridMat = useRef<THREE.MeshBasicMaterial>(null);
  const terrainG = useRef<THREE.Group>(null);
  const grassRefs = useRef<(THREE.Group | null)[]>([]);
  const landPops = useRef<(THREE.Group | null)[]>([]);
  const plankRefs = useRef<(THREE.Group | null)[]>([]);
  const padRefs = useRef<(THREE.Group | null)[]>([]);
  const gravelBedG = useRef<THREE.Group>(null);
  const bollardRefs = useRef<(THREE.Group | null)[]>([]);
  const uplightG = useRef<THREE.Group>(null);
  const uplightMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const waterMat = useRef<THREE.MeshBasicMaterial>(null);
  const poolGlowMat = useRef<THREE.MeshBasicMaterial>(null);
  const emberMat = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMat = useRef<THREE.MeshBasicMaterial>(null);
  const foliageRefs = useRef<(THREE.Group | null)[]>([]);

  const gridTex = useMemo(() => makeGridTexture(), []);
  const rippleTex = useMemo(() => makeRippleTexture(), []);
  const grassGeos = useMemo(
    () => GRASS_BLOBS.map(([, , rx, rz, seed]) => grassGeometry(rx, rz, seed)),
    [],
  );
  const terrainGeo = useMemo(() => {
    const { a, b } = terrainOutlines(80, 5);
    return {
      a: terrainSlabGeometry(a, TIER_A_DEPTH, TERRACE_TOP, STONE_CAP, SOIL_EDGE, 11, 0.6),
      b: terrainSlabGeometry(b, TIER_B_DEPTH, STONE_CAP, SOIL_EDGE, SOIL_DEEP, 12, 0.4),
    };
  }, []);
  const shadowGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-3.6, -2.42);
    s.lineTo(2.8, -2.42);
    s.lineTo(4.7, -3.5);
    s.lineTo(-1.3, -3.5);
    s.closePath();
    const geo = new THREE.ShapeGeometry(s);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame((state) => {
    const p = smoothRef.current;
    const bT = phaseT(p, PHASES.blueprint);
    const fT = smoothstep(phaseT(p, PHASES.foundation));
    const lT = phaseT(p, PHASES.landscape);
    const aT = smoothstep(phaseT(p, PHASES.atmosphere));

    // Blueprint paper: brightens while sketching, dissolves into nature
    if (gridMat.current) {
      gridMat.current.opacity = 0.9 * (0.5 + 0.5 * bT) * (1 - smoothstep(phaseT(p, [0.76, 0.88])));
    }
    grow(terrainG.current, easeOutQuart(fT), "y");

    grassRefs.current.forEach((g, i) => {
      const t = stagger(Math.min(lT / 0.6, 1), i, GRASS_BLOBS.length, 0.55);
      grow(g, easeOutQuart(t), "all");
    });

    landPops.current.forEach((g, i) => {
      grow(g, easeOutQuart(stagger(lT, i, LAND_POP_COUNT, 0.62)), "all");
    });
    plankRefs.current.forEach((g, i) => {
      grow(g, easeOutQuart(stagger(lT, i, PLANK_COUNT, 0.85)), "z");
    });
    padRefs.current.forEach((g, i) => {
      grow(g, easeOutQuart(stagger(lT, i, PATH_PADS.length + 2, 0.7)), "all");
    });
    grow(gravelBedG.current, easeOutQuart(smoothstep(lT)), "all");

    const uplightT = easeOutQuart(smoothstep(lT));
    grow(uplightG.current, uplightT, "all");
    bollardRefs.current.forEach((g, i) => {
      grow(g, easeOutQuart(stagger(uplightT, i, BOLLARDS.length, 0.6)), "all");
    });
    const uplightGlow = smoothstep(Math.max((uplightT - 0.5) / 0.5, 0));
    uplightMats.current.forEach((m) => applyGlow(m, uplightGlow));
    if (poolGlowMat.current) poolGlowMat.current.opacity = 0.4 * uplightGlow;

    const waterT = smoothstep(Math.min(Math.max((lT - 0.2) / 0.8, 0), 1));
    const t = state.clock.elapsedTime;

    // Fire pit embers breathe once lit; stronger through golden hour
    const fireBase = smoothstep(Math.max((lT - 0.75) / 0.25, 0));
    applyGlow(emberMat.current, fireBase * (0.7 + 0.3 * Math.sin(t * 6.3) * 0.5 + 0.15 * aT));

    // Long dusk shadow stretching toward the viewer
    if (shadowMat.current) shadowMat.current.opacity = 0.12 * aT;

    // Idle life once complete: swaying foliage, drifting ripples, water
    // easing from cool daylight toward a warm sunset reflection
    if (waterMat.current) {
      const shimmer = waterT > 0.5 ? 0.94 + 0.06 * Math.sin(t * 1.7) : 1;
      waterMat.current.opacity = 0.85 * waterT * shimmer;
      waterMat.current.color.copy(WATER_COLOR).lerp(WATER_SUNSET_COLOR, aT * 0.55);
      const map = waterMat.current.map;
      if (map) {
        map.offset.x = Math.sin(t * 0.12) * 0.5;
        map.offset.y = (t * 0.025) % 1;
      }
    }
    // Foliage sways as soon as the garden has mostly grown in, not just at
    // the very end of scroll -- the space should feel alive while you're
    // still exploring it, not only once you've stopped.
    const swayT = smoothstep(Math.min(Math.max((lT - 0.5) / 0.5, 0), 1));
    if (swayT > 0.01) {
      foliageRefs.current.forEach((g, i) => {
        if (g) g.rotation.z = Math.sin(t * 0.6 + i * 2.1) * 0.015 * swayT;
      });
    }
  });

  return (
    <group>
      {/* Blueprint ground grid (in-scene sibling of the DOM one) */}
      <mesh position={[0, -0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial ref={gridMat} map={gridTex} transparent opacity={0.45} depthWrite={false} />
      </mesh>

      {/* The carved terrain the whole world stands on: an organic upper
          site tier, and a lower plinth revealing a soil-and-stone edge. */}
      <group ref={terrainG} scale={[1, 0.001, 1]} visible={false}>
        <mesh geometry={terrainGeo.a} material={BOX_MAT} position={[0, -TIER_A_DEPTH, 0]} />
        <mesh
          geometry={terrainGeo.b}
          material={BOX_MAT}
          position={[0, -TIER_A_DEPTH - TIER_B_DEPTH, 0]}
        />
      </group>

      {/* Lawns, organic blobs spreading from their centers */}
      {GRASS_BLOBS.map(([x, z], i) => (
        <group
          key={i}
          position={[x, 0.001, z]}
          scale={0.001}
          visible={false}
          ref={(el) => {
            grassRefs.current[i] = el;
          }}
        >
          <mesh geometry={grassGeos[i]} material={[GRASS_TOP_MAT, GRASS_SIDE_MAT]} />
        </group>
      ))}

      {/* Pool: the second focal point. Travertine coping, floating
          stepping stones, an undercut cantilever edge on the long side,
          and a soft underwater glow that wakes with the garden lights. */}
      <group scale={0.001} ref={(el) => { landPops.current[0] = el; }}>
        <FlatBox size={[2.8, 0.16, 1.45]} position={[1.9, 0.08, 2.05]} color={CHARCOAL} />
        <mesh position={[1.9, 0.13, 2.05]}>
          <boxGeometry args={[2.7, 0.1, 1.35]} />
          <meshBasicMaterial ref={waterMat} map={rippleTex} color={WATER} transparent opacity={0} />
        </mesh>
        <mesh position={[1.9, 0.075, 2.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 1.15]} />
          <meshBasicMaterial
            ref={poolGlowMat}
            color={GLOW}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        {(
          [
            [[3.0, 0.05, 0.14], [1.9, 0.185, 2.845]],
            [[3.0, 0.05, 0.14], [1.9, 0.185, 1.255]],
            [[0.14, 0.05, 1.72], [0.42, 0.185, 2.05]],
            [[0.14, 0.05, 1.72], [3.38, 0.185, 2.05]],
          ] as const
        ).map(([size, pos], i) => (
          <FlatBox key={i} size={size} position={pos} color={TRAVERTINE} edges={false} />
        ))}
        {/* Undercut shadow on the cantilevered long edge */}
        <FlatBox size={[0.03, 0.1, 1.4]} position={[3.435, 0.13, 2.05]} color={SOIL_DEEP} edges={false} />
        {(
          [
            [2.5, 2.5],
            [2.88, 2.18],
            [3.26, 1.86],
          ] as const
        ).map(([sx, sz], i) => (
          <FlatBox
            key={i}
            size={[0.3, 0.045, 0.3]}
            position={[sx, 0.2, sz]}
            color={TRAVERTINE}
            edges={false}
          />
        ))}
      </group>

      {/* A second palm and a frangipani flank the entrance */}
      {SIDE_TREES.map(([x, z, hs], ti) => (
        <group key={ti} position={[x, 0, z]} scale={0.001} ref={(el) => { landPops.current[1 + ti] = el; }}>
          {ti === 0 ? (
            <>
              {/* Leaning coconut palm, a shorter companion to the poolside one */}
              <mesh position={[0, 0.5 * hs, 0]} rotation={[0, 0, -0.09]}>
                <cylinderGeometry args={[0.05 * hs, 0.085 * hs, 1.0 * hs, 8]} />
                <meshBasicMaterial color={PALM_TRUNK} />
              </mesh>
              <mesh position={[-0.1 * hs, 1.02 * hs, 0]} rotation={[0, 0, -0.14]}>
                <cylinderGeometry args={[0.035 * hs, 0.05 * hs, 0.5 * hs, 8]} />
                <meshBasicMaterial color={PALM_TRUNK} />
              </mesh>
              <group position={[-0.16 * hs, 1.3 * hs, 0]} ref={(el) => { foliageRefs.current[ti] = el; }}>
                {Array.from({ length: 7 }, (_, i) => {
                  const a = (i / 7) * Math.PI * 2;
                  const droop = i % 2 === 0 ? -0.35 : -0.22;
                  return (
                    <mesh
                      key={i}
                      position={[Math.cos(a) * 0.06 * hs, 0, Math.sin(a) * 0.06 * hs]}
                      rotation={[Math.sin(a) * -0.7 + droop, a, Math.cos(a) * 0.7]}
                      scale={[0.05 * hs, 0.6 * hs, 0.155 * hs]}
                    >
                      <icosahedronGeometry args={[1, 1]} />
                      <meshBasicMaterial color={i % 3 === 0 ? PALM_GREEN_DARK : PALM_GREEN} />
                    </mesh>
                  );
                })}
              </group>
            </>
          ) : (
            <>
              {/* Frangipani (kamboja): a thick stubby trunk with a handful
                  of branches candelabra-ing outward, leaf clusters and a
                  couple of blossoms at the tips. */}
              <mesh position={[0, 0.25 * hs, 0]}>
                <cylinderGeometry args={[0.06 * hs, 0.09 * hs, 0.5 * hs, 7]} />
                <meshBasicMaterial color={FRANGIPANI_BRANCH} />
              </mesh>
              <group position={[0, 1.05 * hs, 0]} ref={(el) => { foliageRefs.current[ti] = el; }}>
                {Array.from({ length: 4 }, (_, i) => {
                  const a = (i / 4) * Math.PI * 2 + 0.4;
                  return (
                    <group key={i} position={[0, -0.55 * hs, 0]} rotation={[0, a, 0]}>
                      <mesh position={[0.13 * hs, 0.09 * hs, 0]} rotation={[0, 0, -1.05]}>
                        <cylinderGeometry args={[0.026 * hs, 0.045 * hs, 0.26 * hs, 6]} />
                        <meshBasicMaterial color={FRANGIPANI_BRANCH} />
                      </mesh>
                      <mesh position={[0.26 * hs, 0.19 * hs, 0]}>
                        <icosahedronGeometry args={[0.2 * hs, 1]} />
                        <meshBasicMaterial color={i % 2 === 0 ? FRANGIPANI_LEAF : FRANGIPANI_LEAF_DARK} />
                      </mesh>
                      {i < 2 && (
                        <mesh position={[0.32 * hs, 0.27 * hs, 0]}>
                          <sphereGeometry args={[0.032 * hs, 6, 5]} />
                          <meshBasicMaterial color={FRANGIPANI_FLOWER} />
                        </mesh>
                      )}
                    </group>
                  );
                })}
              </group>
            </>
          )}
        </group>
      ))}

      {/* Planters at the right approach */}
      <group scale={0.001} ref={(el) => { landPops.current[3] = el; }}>
        <FlatBox size={[0.85, 0.28, 0.38]} position={[3.15, 0.14, -0.7]} color={CONCRETE} />
        <FlatBox size={[0.75, 0.16, 0.3]} position={[3.15, 0.34, -0.7]} color={OLIVE_DARK} edges={false} />
      </group>

      {/* Low hedge behind the house */}
      <group scale={0.001} ref={(el) => { landPops.current[4] = el; }}>
        <FlatBox size={[2.8, 0.22, 0.3]} position={[-1.2, 0.11, -2.62]} color={OLIVE_DARK} edges={false} />
      </group>

      {/* Poolside loungers and table */}
      <group scale={0.001} ref={(el) => { landPops.current[5] = el; }}>
        {[0.2, 0.75].map((x) => (
          <group key={x} position={[x, 0.27, 1.72]}>
            <FlatBox size={[0.3, 0.09, 0.75]} position={[0, 0.06, 0]} color={OAK} edges={false} />
            <FlatBox
              size={[0.3, 0.07, 0.4]}
              position={[0, 0.2, -0.28]}
              rotation={[-0.55, 0, 0]}
              color={FABRIC}
              edges={false}
            />
          </group>
        ))}
        <mesh position={[0.48, 0.36, 1.72]}>
          <cylinderGeometry args={[0.09, 0.09, 0.16, 10]} />
          <meshBasicMaterial color={STEEL} />
        </mesh>
      </group>

      {/* Japanese gravel terrace behind the house: raised one step above
          the lawn, with pebbles, feature rocks, a freestanding pergola
          and a stone bench beneath it */}
      <group scale={0.001} ref={(el) => { landPops.current[6] = el; }}>
        <FlatBox
          size={[3.16, GRAVEL_STEP, 1.16]}
          position={[2.7, GRAVEL_STEP / 2, -2.95]}
          color={TERRACE_TOP}
          edges={false}
        />
        <group position={[0, GRAVEL_STEP, 0]}>
          <FlatBox size={[3.0, 0.035, 1.0]} position={[2.7, 0.018, -2.95]} color={GRAVEL} edges={false} />
          <instancedMesh
            args={[undefined, undefined, PEBBLE_COUNT]}
            ref={(mesh) => {
              if (mesh && !mesh.userData.seeded) {
                mesh.userData.seeded = true;
                seedPebbles(mesh);
              }
            }}
          >
            <sphereGeometry args={[0.045, 6, 5]} />
            <meshBasicMaterial color="#958F82" />
          </instancedMesh>
          {(
            [
              [1.75, -2.7, 0.13],
              [3.6, -3.2, 0.09],
              [3.1, -2.68, 0.07],
            ] as const
          ).map(([rx, rz, r], i) => (
            <mesh key={i} position={[rx, r * 0.6 + 0.03, rz]} scale={[1, 0.62, 1]}>
              <icosahedronGeometry args={[r, 0]} />
              <meshBasicMaterial color={i === 1 ? "#8F887B" : "#7A756B"} />
            </mesh>
          ))}
          {/* Pergola frame */}
          {(
            [
              [1.5, -2.55],
              [3.9, -2.55],
              [1.5, -3.35],
              [3.9, -3.35],
            ] as const
          ).map(([px, pz], i) => (
            <FlatBox key={i} size={[0.07, 1.0, 0.07]} position={[px, 0.5, pz]} color={OAK} edges={false} />
          ))}
          {[-2.55, -3.35].map((pz) => (
            <FlatBox key={pz} size={[2.64, 0.055, 0.08]} position={[2.7, 1.03, pz]} color={OAK} edges={false} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <FlatBox
              key={i}
              size={[0.05, 0.028, 0.98]}
              position={[1.65 + i * 0.3, 1.08, -2.95]}
              color={OAK}
              edges={false}
            />
          ))}
          {/* Stone bench beneath */}
          <FlatBox size={[0.9, 0.06, 0.26]} position={[2.7, 0.35, -2.95]} color={TRAVERTINE} edges={false} />
          {[-0.3, 0.3].map((dx) => (
            <FlatBox
              key={dx}
              size={[0.08, 0.3, 0.2]}
              position={[2.7 + dx, 0.17, -2.95]}
              color={STONE}
              edges={false}
            />
          ))}
        </group>
      </group>

      {/* Concrete retaining wall with cap and rear hedge */}
      <group scale={0.001} ref={(el) => { landPops.current[7] = el; }}>
        <FlatBox size={[2.6, 0.3, 0.16]} position={[-3.2, 0.15, -2.55]} color={CONCRETE} />
        <FlatBox size={[2.7, 0.045, 0.22]} position={[-3.2, 0.322, -2.55]} color={TRAVERTINE} edges={false} />
        <FlatBox size={[2.4, 0.24, 0.3]} position={[-3.2, 0.12, -2.9]} color={OLIVE_DARK} edges={false} />
      </group>

      {/* Bougainvillea peeking over the retaining wall, in bloom */}
      <group position={[-3.75, 0, -3.0]} scale={0.001} ref={(el) => { landPops.current[8] = el; }}>
        {([-0.05, 0.06] as const).map((dx, si) => (
          <mesh key={dx} position={[dx, 0.4, si * 0.05]} rotation={[0, 0, si === 0 ? 0.08 : -0.1]}>
            <cylinderGeometry args={[0.02, 0.035, 0.8, 6]} />
            <meshBasicMaterial color={TRUNK} />
          </mesh>
        ))}
        <group position={[0, 0.95, 0]} ref={(el) => { foliageRefs.current[2] = el; }}>
          {(
            [
              [0, 0, 0, 0.3, BOUGAINVILLEA_LEAF],
              [0.22, -0.08, 0.1, 0.22, BOUGAINVILLEA_LEAF],
              [-0.2, -0.1, -0.08, 0.2, BOUGAINVILLEA_LEAF],
              [0.14, 0.14, -0.06, 0.16, BOUGAINVILLEA_BRACT],
              [-0.16, 0.1, 0.1, 0.14, BOUGAINVILLEA_BRACT_LIGHT],
            ] as const
          ).map(([fx, fy, fz, r, c], fi) => (
            <mesh key={fi} position={[fx, fy, fz]}>
              <icosahedronGeometry args={[r, 1]} />
              <meshBasicMaterial color={c} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Loose shrubs softening the site edges */}
      <group scale={0.001} ref={(el) => { landPops.current[9] = el; }}>
        {(
          [
            [-4.35, 1.0, 0.15, OLIVE_DARK],
            [4.4, 0.3, 0.13, OLIVE],
            [0.75, -2.72, 0.16, OLIVE_DARK],
          ] as const
        ).map(([sx, sz, r, c], i) => (
          <mesh key={i} position={[sx, r * 0.8, sz]}>
            <icosahedronGeometry args={[r, 1]} />
            <meshBasicMaterial color={c} />
          </mesh>
        ))}
      </group>

      {/* Garden sculpture by the path: travertine ring on a stone plinth */}
      <group position={[-3.55, 0, 3.1]} scale={0.001} ref={(el) => { landPops.current[10] = el; }}>
        <FlatBox size={[0.34, 0.1, 0.34]} position={[0, 0.05, 0]} color={STONE} />
        <mesh position={[0, 0.34, 0]} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[0.2, 0.042, 10, 28]} />
          <meshBasicMaterial color={TRAVERTINE} />
        </mesh>
      </group>

      {/* Fire pit corner: embers, stone bench and oak stools */}
      <group scale={0.001} ref={(el) => { landPops.current[11] = el; }}>
        <mesh position={[4.0, 0.07, 2.85]}>
          <cylinderGeometry args={[0.24, 0.26, 0.14, 12]} />
          <meshBasicMaterial color={CHARCOAL} />
        </mesh>
        <mesh position={[4.0, 0.145, 2.85]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 12]} />
          <meshBasicMaterial ref={emberMat} color={CHARCOAL} />
        </mesh>
        <group position={[3.35, 0, 3.12]} rotation={[0, -0.6, 0]}>
          <FlatBox size={[0.85, 0.055, 0.26]} position={[0, 0.31, 0]} color={TRAVERTINE} edges={false} />
          {[-0.28, 0.28].map((dx) => (
            <FlatBox key={dx} size={[0.07, 0.28, 0.18]} position={[dx, 0.14, 0]} color={STONE} edges={false} />
          ))}
        </group>
        <FlatBox
          size={[0.26, 0.24, 0.26]}
          position={[4.55, 0.12, 2.45]}
          rotation={[0, 0.4, 0]}
          color={OAK}
          edges={false}
        />
      </group>

      {/* Outdoor dining on the terrace, sheltered under the cantilever */}
      <group scale={0.001} ref={(el) => { landPops.current[12] = el; }}>
        <FlatBox size={[0.85, 0.045, 0.55]} position={[2.55, 0.62, 0.75]} color={OAK} />
        {[-0.3, 0.3].map((dx) => (
          <FlatBox
            key={dx}
            size={[0.06, 0.38, 0.45]}
            position={[2.55 + dx, 0.41, 0.75]}
            color={STEEL}
            edges={false}
          />
        ))}
        {(
          [
            [2.2, 0.44],
            [2.9, 0.44],
            [2.2, 1.08],
            [2.9, 1.08],
          ] as const
        ).map(([sx, sz], i) => (
          <FlatBox
            key={i}
            size={[0.22, 0.2, 0.22]}
            position={[sx, 0.32, sz]}
            color={OAK}
            edges={false}
          />
        ))}
        {(
          [
            [2.42, 0.68],
            [2.72, 0.85],
          ] as const
        ).map(([mx, mz]) => (
          <mesh key={mx} position={[mx, 0.66, mz]}>
            <cylinderGeometry args={[0.02, 0.02, 0.035, 8]} />
            <meshBasicMaterial color={FABRIC} />
          </mesh>
        ))}
      </group>

      {/* Signature palm beside the pool, framing the golden-hour sky */}
      <group position={[1.85, 0, 3.15]} scale={0.001} ref={(el) => { landPops.current[13] = el; }}>
        <mesh position={[0.05, 0.55, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.045, 0.075, 1.15, 8]} />
          <meshBasicMaterial color={PALM_TRUNK} />
        </mesh>
        <mesh position={[0.13, 1.12, 0]} rotation={[0, 0, 0.16]}>
          <cylinderGeometry args={[0.032, 0.048, 0.55, 8]} />
          <meshBasicMaterial color={PALM_TRUNK} />
        </mesh>
        <group position={[0.19, 1.42, 0]} ref={(el) => { foliageRefs.current[3] = el; }}>
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2;
            const droop = i % 2 === 0 ? -0.35 : -0.22;
            return (
              <mesh
                key={i}
                position={[Math.cos(a) * 0.06, 0, Math.sin(a) * 0.06]}
                rotation={[Math.sin(a) * -0.7 + droop, a, Math.cos(a) * 0.7]}
                scale={[0.05, 0.62, 0.16]}
              >
                <icosahedronGeometry args={[1, 1]} />
                <meshBasicMaterial color={i % 3 === 0 ? PALM_GREEN_DARK : PALM_GREEN} />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* A few minimal blossoms at the path edge */}
      <group scale={0.001} ref={(el) => { landPops.current[14] = el; }}>
        {(
          [
            [-2.05, 2.45], [-1.95, 2.58], [-0.65, 2.42], [-0.55, 2.55], [-2.85, 2.5],
          ] as const
        ).map(([fx, fz], i) => (
          <mesh key={i} position={[fx, 0.045, fz]} scale={[1, 0.55, 1]}>
            <icosahedronGeometry args={[0.028, 0]} />
            <meshBasicMaterial color={BLOSSOM} />
          </mesh>
        ))}
      </group>

      {/* Wood deck planks */}
      <group position={[0, PODIUM_TOP + 0.025, 0]}>
        {Array.from({ length: PLANK_COUNT }, (_, i) => {
          const x = -0.45 + i * 0.18;
          return (
            <group key={i} position={[x, 0, 1.7]} scale={[1, 1, 0.001]} ref={(el) => { plankRefs.current[i] = el; }}>
              <FlatBox size={[0.15, 0.045, 1.3]} position={[0, 0, 0]} color={OAK} edges={false} />
            </group>
          );
        })}
      </group>

      {/* Gravel bed beneath the stepping-stone path */}
      <group ref={gravelBedG} scale={0.001} visible={false}>
        <FlatBox
          size={[3.15, 0.025, 0.55]}
          position={[-1.65, 0.0125, 2.7]}
          rotation={[0, 0.05, 0]}
          color={GRAVEL}
          edges={false}
        />
      </group>

      {/* Stepping stone path, then two floating entrance treads */}
      {PATH_PADS.map(([x, z, rotY], i) => (
        <group
          key={i}
          position={[x, 0.058, z]}
          rotation={[0, rotY, 0]}
          scale={0.001}
          ref={(el) => { padRefs.current[i] = el; }}
        >
          <FlatBox size={[0.55, 0.05, 0.42]} position={[0, 0, 0]} color={TRAVERTINE} edges={false} />
        </group>
      ))}
      <group position={[0.35, 0.0625, 2.9]} scale={0.001} ref={(el) => { padRefs.current[5] = el; }}>
        <FlatBox size={[0.72, 0.045, 0.34]} position={[0, 0, 0]} color={TRAVERTINE} edges={false} />
        <FlatBox size={[0.05, 0.045, 0.05]} position={[0, -0.045, -0.1]} color={STEEL} edges={false} />
      </group>
      <group position={[0.35, 0.1425, 2.64]} scale={0.001} ref={(el) => { padRefs.current[6] = el; }}>
        <FlatBox size={[0.72, 0.045, 0.34]} position={[0, 0, 0]} color={TRAVERTINE} edges={false} />
        <FlatBox size={[0.05, 0.125, 0.05]} position={[0, -0.085, -0.1]} color={STEEL} edges={false} />
      </group>

      {/* Uplight fixtures at the base of the folio wall */}
      <group ref={uplightG} scale={0.001} visible={false}>
        {[-1.2, 0, 1.2].map((z, ui) => (
          <mesh key={z} position={[-3.18, 0.26, z - 0.1]}>
            <boxGeometry args={[0.09, 0.025, 0.09]} />
            <meshBasicMaterial
              ref={(m) => {
                uplightMats.current[ui] = m;
              }}
              color={CHARCOAL}
            />
          </mesh>
        ))}
      </group>

      {/* Garden bollard lights along the path */}
      {BOLLARDS.map(([bx, bz], i) => (
        <group key={i} position={[bx, 0, bz]} scale={0.001} ref={(el) => { bollardRefs.current[i] = el; }}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.022, 0.026, 0.16, 8]} />
            <meshBasicMaterial color={STEEL} />
          </mesh>
          <mesh position={[0, 0.175, 0]}>
            <boxGeometry args={[0.05, 0.035, 0.05]} />
            <meshBasicMaterial
              ref={(m) => {
                uplightMats.current[3 + i] = m;
              }}
              color={CHARCOAL}
            />
          </mesh>
        </group>
      ))}

      {/* Long dusk shadow cast toward the viewer at golden hour */}
      <mesh geometry={shadowGeo} position={[0, 0.006, 0]}>
        <meshBasicMaterial
          ref={shadowMat}
          color="#0A0B10"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
