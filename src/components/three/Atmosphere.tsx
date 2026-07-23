"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PHASES, phaseT, smoothstep } from "./phases";
import { mulberry32 } from "./palette";

// The backdrop lives in camera space (this component mounts as a child of
// the orthographic camera), so the illustrated world always frames the
// villa identically at every aspect ratio. Each layer sits at its own
// depth and drifts at its own speed for cinematic parallax: mountains
// barely move, forest a little more, clouds and birds visibly cross frame.
const SKY_W = 34;
const SKY_H = 30;
const HORIZON = 0.535;

function makeSkyTexture(): THREE.CanvasTexture {
  const W = 768;
  const H = 768;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(42);

  // Blue-hour gradient: pure near-black at the top deepening into the
  // site's ink navy, with a faint accent-blue breath at the horizon --
  // the exact palette the rest of the site lives in.
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0,      "#05070D");
  sky.addColorStop(0.18,   "#080C18");
  sky.addColorStop(0.36,   "#0C1226");
  sky.addColorStop(0.50,   "#101830");
  sky.addColorStop(0.555,  "#131E3A");
  sky.addColorStop(HORIZON,"#182040");
  sky.addColorStop(1,      "#182040");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // More stars, cooler blue-white to match the site's cool palette.
  for (let i = 0; i < 90; i++) {
    const x = rand() * W;
    const y = rand() * H * 0.52;
    const r = 0.3 + rand() * 0.9;
    ctx.fillStyle = `rgba(195, 215, 255, ${0.18 + rand() * 0.42})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cool moon: pale blue-white disc, upper-right quadrant so it stays
  // clear of the building. Wide atmospheric glow, crisp core.
  const moonX = 0.71 * W;
  const moonY = 0.19 * H;
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 0.1 * W);
  moonGlow.addColorStop(0,   "rgba(180, 210, 255, 0.22)");
  moonGlow.addColorStop(0.5, "rgba(180, 210, 255, 0.06)");
  moonGlow.addColorStop(1,   "rgba(180, 210, 255, 0)");
  ctx.fillStyle = moonGlow;
  ctx.fillRect(0, 0, W, H);
  const moonCore = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 0.02 * W);
  moonCore.addColorStop(0, "rgba(225, 238, 255, 0.88)");
  moonCore.addColorStop(1, "rgba(225, 238, 255, 0)");
  ctx.fillStyle = moonCore;
  ctx.fillRect(0, 0, W, H);

  // Ground below the horizon: accent-blue tinted, fading cleanly into
  // the site's ink black so the seam with the page disappears.
  const ground = ctx.createLinearGradient(0, HORIZON * H, 0, H);
  ground.addColorStop(0,    "#182040");
  ground.addColorStop(0.06, "#0E1220");
  ground.addColorStop(0.22, "#0A0D15");
  ground.addColorStop(1,    "#0E0F11");
  ctx.fillStyle = ground;
  ctx.fillRect(0, HORIZON * H - 1, W, H - HORIZON * H + 1);

  // Thin cool-blue haze line right at the horizon.
  ctx.fillStyle = "rgba(61, 99, 255, 0.06)";
  ctx.fillRect(0, 0.521 * H, W, 0.008 * H);
  ctx.fillStyle = "rgba(61, 99, 255, 0.03)";
  ctx.fillRect(0, 0.531 * H, W, 0.005 * H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Distant range, hazed by atmosphere -- the slowest-drifting layer. Kept
 * deliberately subtle (a low ridge, not dramatic peaks) so it reads as far
 * away and sits close to the sky texture's own baked-in horizon line.
 */
function makeMountainTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 260;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(71);
  const drawRange = (baseY: number, amp: number, humps: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    let x = 0;
    while (x < W) {
      const w = (W / humps) * (0.7 + rand() * 0.6);
      const peak = amp * (0.55 + rand() * 0.45);
      ctx.quadraticCurveTo(x + w * 0.5, baseY - peak, x + w, baseY - peak * rand() * 0.25);
      x += w;
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
  };
  drawRange(H * 0.7, H * 0.22, 6, "#111928");
  drawRange(H * 0.74, H * 0.3, 5, "#0C1120");
  return new THREE.CanvasTexture(canvas);
}

/**
 * Treeline hugging the horizon, closer and a touch faster than the peaks --
 * a thin fringe, not a wall of trees.
 */
function makeForestTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 110;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(88);
  ctx.fillStyle = "#0D1018";
  ctx.beginPath();
  ctx.moveTo(0, H * 0.55);
  let x = 0;
  while (x < W) {
    const w = 12 + rand() * 30;
    const h = 6 + rand() * 20;
    ctx.quadraticCurveTo(x + w * 0.5, H * 0.55 - h, x + w, H * 0.55);
    x += w;
  }
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}

/** Soft warm haze band sitting right on the horizon line for depth. */
function makeFogTexture(): THREE.CanvasTexture {
  const W = 512;
  const H = 96;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0,   "rgba(61, 99, 255, 0)");
  g.addColorStop(0.5, "rgba(80, 115, 220, 0.28)");
  g.addColorStop(1,   "rgba(61, 99, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  return new THREE.CanvasTexture(canvas);
}

/** Dark blade silhouettes for a barely-there foreground fringe. */
function makeForegroundGrassTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 220;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(19);
  ctx.fillStyle = "#0A0C0A";
  let x = 0;
  while (x < W) {
    const bw = 3 + rand() * 5;
    const bh = 40 + rand() * 140;
    const lean = (rand() - 0.5) * 18;
    ctx.beginPath();
    ctx.moveTo(x, H);
    ctx.quadraticCurveTo(x + lean, H - bh * 0.6, x + lean * 1.4, H - bh);
    ctx.quadraticCurveTo(x + bw + lean, H - bh * 0.6, x + bw, H);
    ctx.closePath();
    ctx.fill();
    x += bw * (0.55 + rand() * 0.35);
  }
  return new THREE.CanvasTexture(canvas);
}

function makeCloudTexture(): THREE.CanvasTexture {
  const W = 256;
  const H = 128;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const blobs: Array<[number, number, number, number]> = [
    [0.36, 0.56, 0.3, 0.6],
    [0.54, 0.46, 0.26, 0.7],
    [0.7, 0.58, 0.22, 0.55],
    [0.46, 0.63, 0.2, 0.5],
  ];
  for (const [cx, cy, r, a] of blobs) {
    const g = ctx.createRadialGradient(cx * W, cy * H, 0, cx * W, cy * H, r * W);
    g.addColorStop(0, `rgba(190, 215, 255, ${a})`);
    g.addColorStop(1, "rgba(190, 215, 255, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  return new THREE.CanvasTexture(canvas);
}

function makeBirdTexture(): THREE.CanvasTexture {
  const W = 192;
  const H = 96;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "#1A2035";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const birds: Array<[number, number, number]> = [
    [58, 44, 11],
    [96, 30, 14],
    [132, 48, 9],
    [84, 62, 8],
    [152, 34, 7],
  ];
  for (const [cx, cy, s] of birds) {
    ctx.beginPath();
    ctx.moveTo(cx - s, cy);
    ctx.quadraticCurveTo(cx - s / 2, cy - s * 0.72, cx, cy);
    ctx.quadraticCurveTo(cx + s / 2, cy - s * 0.72, cx + s, cy);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(canvas);
}

// Cloud planes: [x, y, width, height, drift speed, opacity]
const CLOUDS: Array<[number, number, number, number, number, number]> = [
  [-5, 3.1, 5.2, 2.0, 0.1, 0.5],
  [3, 4.6, 4.0, 1.55, 0.16, 0.42],
  [8.5, 2.4, 6.0, 2.3, 0.07, 0.38],
  [-9.5, 6.4, 4.6, 1.8, 0.12, 0.38],
];

// Bird flocks: [y, width, height, speed, loop offset]
const BIRDS: Array<[number, number, number, number, number]> = [
  [2.05, 2.3, 1.15, 0.5, 4],
  [3.35, 1.45, 0.72, 0.36, 21],
];

const LOOP_SPAN = 38;
const MOUNTAIN_SPEED = 0.006;
const FOREST_SPEED = 0.016;

interface AtmosphereProps {
  smoothRef: MutableRefObject<number>;
}

/**
 * The final act of the scroll story: an illustrated dusk sky layered front
 * to back -- foreground grass fringe, birds, clouds, haze, forest, distant
 * mountains, gradient sky -- each drifting at its own speed for parallax,
 * plus a warm additive wash that pulls the whole model into golden hour.
 */
export default function Atmosphere({ smoothRef }: AtmosphereProps) {
  const skyMesh = useRef<THREE.Mesh>(null);
  const skyMat = useRef<THREE.MeshBasicMaterial>(null);
  const mountainMesh = useRef<THREE.Mesh>(null);
  const mountainMat = useRef<THREE.MeshBasicMaterial>(null);
  const forestMesh = useRef<THREE.Mesh>(null);
  const forestMat = useRef<THREE.MeshBasicMaterial>(null);
  const fogMat = useRef<THREE.MeshBasicMaterial>(null);
  const grassMat = useRef<THREE.MeshBasicMaterial>(null);
  const washMat = useRef<THREE.MeshBasicMaterial>(null);
  const cloudMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const cloudMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const birdMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const birdMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  const skyTex = useMemo(() => makeSkyTexture(), []);
  const mountainTex = useMemo(() => makeMountainTexture(), []);
  const forestTex = useMemo(() => makeForestTexture(), []);
  const fogTex = useMemo(() => makeFogTexture(), []);
  const grassTex = useMemo(() => makeForegroundGrassTexture(), []);
  const cloudTex = useMemo(() => makeCloudTexture(), []);
  const birdTex = useMemo(() => makeBirdTexture(), []);

  useFrame((state, delta) => {
    const p = smoothRef.current;
    const aT = smoothstep(phaseT(p, PHASES.atmosphere));
    const on = aT > 0.004;
    const t = state.clock.elapsedTime;

    if (skyMesh.current) skyMesh.current.visible = on;
    if (skyMat.current) skyMat.current.opacity = aT;
    if (washMat.current) washMat.current.opacity = 0.055 * aT;

    if (mountainMesh.current) {
      mountainMesh.current.visible = on;
      mountainMesh.current.position.x = -t * MOUNTAIN_SPEED;
    }
    if (mountainMat.current) mountainMat.current.opacity = aT;

    if (forestMesh.current) {
      forestMesh.current.visible = on;
      forestMesh.current.position.x = -t * FOREST_SPEED;
    }
    if (forestMat.current) forestMat.current.opacity = aT;
    if (fogMat.current) fogMat.current.opacity = 0.5 * aT;

    // The foreground grass fringe belongs to the landscape act, not the
    // atmosphere -- it should already be there once the garden grows in.
    const groundT = smoothstep(phaseT(p, PHASES.landscape));
    if (grassMat.current) grassMat.current.opacity = 0.55 * groundT;

    cloudMeshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.visible = on;
      if (!on) return;
      let x = mesh.position.x + CLOUDS[i][4] * delta;
      if (x > 19) x = -19;
      mesh.position.x = x;
      const mat = cloudMats.current[i];
      if (mat) mat.opacity = CLOUDS[i][5] * aT;
    });

    const birdGate = smoothstep(Math.max((aT - 0.45) / 0.55, 0));
    birdMeshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const [y, , , speed, offset] = BIRDS[i];
      const raw = (t * speed + offset) % LOOP_SPAN;
      const x = ((raw + LOOP_SPAN) % LOOP_SPAN) - LOOP_SPAN / 2;
      mesh.position.x = x;
      mesh.position.y = y + Math.sin(t * 0.9 + i * 2.4) * 0.12;
      const edgeFade = Math.min(Math.max((16 - Math.abs(x)) / 3, 0), 1);
      const mat = birdMats.current[i];
      if (mat) mat.opacity = 0.85 * birdGate * edgeFade;
      mesh.visible = birdGate > 0.02 && edgeFade > 0.01;
    });
  });

  return (
    <group>
      <mesh ref={skyMesh} position={[0, 0, -46]} renderOrder={-20} visible={false}>
        <planeGeometry args={[SKY_W, SKY_H]} />
        <meshBasicMaterial ref={skyMat} map={skyTex} transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={mountainMesh} position={[0, -0.8, -45.6]} renderOrder={-19} visible={false}>
        <planeGeometry args={[46, 3.0]} />
        <meshBasicMaterial
          ref={mountainMat}
          map={mountainTex}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={forestMesh} position={[0, -1.2, -45.2]} renderOrder={-18} visible={false}>
        <planeGeometry args={[46, 1.1]} />
        <meshBasicMaterial ref={forestMat} map={forestTex} transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh position={[0, -1.05, -44.8]} renderOrder={-17}>
        <planeGeometry args={[SKY_W, 2.4]} />
        <meshBasicMaterial
          ref={fogMat}
          map={fogTex}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {CLOUDS.map(([x, y, w, h], i) => (
        <mesh
          key={i}
          position={[x, y, -44.4]}
          renderOrder={-16}
          visible={false}
          ref={(el) => {
            cloudMeshes.current[i] = el;
          }}
        >
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={(m) => {
              cloudMats.current[i] = m;
            }}
            map={cloudTex}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      {BIRDS.map(([y, w, h], i) => (
        <mesh
          key={i}
          position={[-LOOP_SPAN / 2, y, -42]}
          renderOrder={-15}
          visible={false}
          ref={(el) => {
            birdMeshes.current[i] = el;
          }}
        >
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={(m) => {
              birdMats.current[i] = m;
            }}
            map={birdTex}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* A faint, barely-there fringe of grass just below frame, tips only
          just breaking into view -- grows more present as the finale
          framing pulls back. */}
      <mesh position={[0, -5.6, -40]} renderOrder={-14}>
        <planeGeometry args={[SKY_W, 1.4]} />
        <meshBasicMaterial ref={grassMat} map={grassTex} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Golden-hour wash: a faint additive veil over the whole frame. */}
      <mesh position={[0, 0, -0.8]} renderOrder={40}>
        <planeGeometry args={[SKY_W, SKY_H]} />
        <meshBasicMaterial
          ref={washMat}
          color="#3D63FF"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
