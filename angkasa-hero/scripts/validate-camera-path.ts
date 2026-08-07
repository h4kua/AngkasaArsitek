// Numerical sanity check for the camera spline — NOT a visual render.
// Confirms the math is well-behaved (no clipping into geometry, no
// degenerate look-at vectors, no discontinuous jumps). This is the honest
// substitute for the screenshot verification that this sandbox can't do
// (no working headless browser — see chat). It catches logic bugs, not
// aesthetic/framing quality.

import * as THREE from "three";
import { CAMERA_KEYFRAMES } from "../components/hero/constants";

interface VolumeBounds {
  position: [number, number, number];
  size: [number, number, number];
}

// Mirrors ArchitectureSequence.tsx's VOLUMES — kept in sync manually since
// that file is a React component we can't cleanly import from plain Node.
const VOLUMES: VolumeBounds[] = [
  { position: [4.6, 1.0, -1.7], size: [3.6, 2.0, 0.4] },
  { position: [5.85, 2.15, -1.3], size: [2.6, 1.5, 2.8] },
  { position: [5.7, 0.55, 0.4], size: [2.0, 1.1, 2.0] },
  { position: [4, 0.12, -0.5], size: [7.6, 0.24, 4.6] },
  { position: [2.1, 2.55, -1], size: [9.4, 0.16, 4.2] },
];

function pointInsideBox(p: THREE.Vector3, vol: VolumeBounds): boolean {
  const [cx, cy, cz] = vol.position;
  const [sx, sy, sz] = vol.size;
  return (
    Math.abs(p.x - cx) < sx / 2 &&
    Math.abs(p.y - cy) < sy / 2 &&
    Math.abs(p.z - cz) < sz / 2
  );
}

const positionCurve = new THREE.CatmullRomCurve3(
  CAMERA_KEYFRAMES.map((k) => new THREE.Vector3(...k.position)),
  false,
  "catmullrom",
  0.15
);
const lookAtCurve = new THREE.CatmullRomCurve3(
  CAMERA_KEYFRAMES.map((k) => new THREE.Vector3(...k.lookAt)),
  false,
  "catmullrom",
  0.15
);

const SAMPLES = 400;
const issues: string[] = [];
let prevPos: THREE.Vector3 | null = null;
let maxStep = 0;

console.log("t      | position (x, y, z)         | lookAt (x, y, z)          | dist");
console.log("-------|----------------------------|----------------------------|------");

for (let i = 0; i <= SAMPLES; i++) {
  const t = i / SAMPLES;
  const pos = positionCurve.getPoint(t);
  const look = lookAtCurve.getPoint(t);
  const dist = pos.distanceTo(look);

  if (pos.y < 0.05) {
    issues.push(`t=${t.toFixed(3)}: camera below/at ground (y=${pos.y.toFixed(3)})`);
  }
  if (dist < 0.3) {
    issues.push(`t=${t.toFixed(3)}: position and lookAt nearly coincide (dist=${dist.toFixed(3)}) — degenerate direction`);
  }
  for (const [vi, vol] of VOLUMES.entries()) {
    if (pointInsideBox(pos, vol)) {
      issues.push(`t=${t.toFixed(3)}: camera INSIDE volume #${vi} at (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`);
    }
  }
  if (prevPos) {
    const step = pos.distanceTo(prevPos);
    maxStep = Math.max(maxStep, step);
    if (step > 0.5) {
      issues.push(`t=${t.toFixed(3)}: large discontinuous jump (${step.toFixed(3)} units) from previous sample`);
    }
  }
  prevPos = pos;

  // Print only at the 9 actual keyframes for a readable table.
  const isKeyframe = CAMERA_KEYFRAMES.some((k) => Math.abs(k.t - t) < 1 / (SAMPLES * 2));
  if (isKeyframe) {
    console.log(
      `${t.toFixed(2)}   | (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`.padEnd(38) +
        `| (${look.x.toFixed(2)}, ${look.y.toFixed(2)}, ${look.z.toFixed(2)})`.padEnd(28) +
        `| ${dist.toFixed(2)}`
    );
  }
}

console.log(`\nmax step between adjacent samples (${SAMPLES} samples across t=0..1): ${maxStep.toFixed(4)} units`);

if (issues.length === 0) {
  console.log("\n✓ No issues found: camera never clips a volume, never goes underground, path is smooth, look direction never degenerates.");
} else {
  console.log(`\n✗ ${issues.length} issue(s):`);
  issues.forEach((s) => console.log(" - " + s));
}
