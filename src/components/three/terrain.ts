"use client";

import * as THREE from "three";
import { smoothstep } from "./phases";
import { mulberry32 } from "./palette";

/**
 * Hand-tuned (angle-degrees, radius) control points describing the organic
 * terrain silhouette. Every landscape element in Landscape.tsx and House.tsx
 * was measured against this envelope (a bounding-circle sweep against every
 * planting, bench, and pergola post, verified with a >=0.35 unit clearance
 * margin) so the ground can carve close to the plantings without clipping
 * anything. If new landscape elements are added far from the villa, re-check
 * their distance against terrainRadius() at their angle before trusting it.
 */
const TERRAIN_CONTROLS: ReadonlyArray<readonly [number, number]> = [
  [-180, 4.98], [-170, 5.17], [-160, 3.3], [-150, 3.3], [-141.4, 5.75],
  [-137.8, 5.78], [-130, 5.24], [-120, 3.3], [-114.6, 4.23], [-110, 4.2],
  [-100, 3.99], [-90, 3.3], [-80, 3.3], [-74.6, 3.41], [-70, 3.38],
  [-60, 4.61], [-50, 5.84], [-47.5, 5.87], [-40, 5.34], [-30, 4.92],
  [-20, 3.3], [-12.5, 4.11], [-10, 4.08], [0, 4.94], [10, 5.11],
  [16.1, 5.3], [20, 5.27], [28.3, 5.78], [40, 5.57], [50, 5.49],
  [60, 4.12], [70, 3.3], [80, 3.63], [90, 3.92], [100, 3.3], [110, 3.3],
  [115.9, 4.48], [120, 4.81], [130, 5.08], [140, 5.36], [150, 5.65],
  [160, 5.33], [170, 5.01],
];

/** Smooth (cosine-eased) lookup between the hand-tuned control points. */
export function terrainRadius(angleDeg: number): number {
  const a = (((angleDeg + 180) % 360) + 360) % 360 - 180;
  for (let i = 0; i < TERRAIN_CONTROLS.length; i++) {
    const [ca, cr] = TERRAIN_CONTROLS[i];
    const [na, nr] = TERRAIN_CONTROLS[(i + 1) % TERRAIN_CONTROLS.length];
    let naAdj = na;
    if (naAdj <= ca) naAdj += 360;
    if (naAdj - ca < 1e-6) continue;
    let aAdj = a;
    if (aAdj < ca) aAdj += 360;
    if (aAdj >= ca && aAdj <= naAdj) {
      const t = (aAdj - ca) / (naAdj - ca);
      const s = (1 - Math.cos(t * Math.PI)) / 2;
      return cr + (nr - cr) * s;
    }
  }
  return TERRAIN_CONTROLS[0][1];
}

// The lower plinth tier steps out beyond the upper site tier by this much,
// varying gently so the two edges never read as a perfect parallel offset.
function terrainLip(angleDeg: number): number {
  const r = (angleDeg * Math.PI) / 180;
  return 0.34 + 0.07 * Math.sin(r * 3 + 0.6) + 0.05 * Math.sin(r * 5 - 1.1);
}

/**
 * Samples the terrain envelope into two matched rings: `a` is the upper
 * site surface every planting/podium/path sits on, `b` is the lower plinth
 * a constant-ish lip beyond it. Both share one jitter pass so `b` always
 * encloses `a` regardless of the hand-carved wobble.
 */
export function terrainOutlines(steps = 80, seed = 5): { a: THREE.Vector2[]; b: THREE.Vector2[] } {
  const rand = mulberry32(seed);
  const a: THREE.Vector2[] = [];
  const b: THREE.Vector2[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 360 - 180;
    const rad = (angle * Math.PI) / 180;
    const jitter = 1 + (rand() - 0.5) * 0.035;
    const rA = terrainRadius(angle) * jitter;
    const rB = rA + terrainLip(angle);
    a.push(new THREE.Vector2(rA * Math.cos(rad), rA * Math.sin(rad)));
    b.push(new THREE.Vector2(rB * Math.cos(rad), rB * Math.sin(rad)));
  }
  return { a, b };
}

/** Straight-edge polygon through exact points -- no curve-fit undershoot. */
function polygonShape(points: THREE.Vector2[]): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i].x, points[i].y);
  shape.closePath();
  return shape;
}

/**
 * One terrain tier: an organic slab extruded from `points`, with vertex
 * colors carrying a flat top tone and a banded soil/stone strata down the
 * cut edge -- the "layered foundation" cross-section a diorama base shows.
 */
export function terrainSlabGeometry(
  points: THREE.Vector2[],
  depth: number,
  topHex: string,
  sideTopHex: string,
  sideBottomHex: string,
  seed: number,
  bandT = 0.4,
): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(polygonShape(points), { depth, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);

  const top = new THREE.Color(topHex);
  const sideTop = new THREE.Color(sideTopHex);
  const sideBottom = new THREE.Color(sideBottomHex);
  const rand = mulberry32((seed * 2654435761) | 0);
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const ny = nor.getY(i);
    const wobble = (rand() - 0.5) * 0.022;
    if (Math.abs(ny) < 0.5) {
      const vt = Math.min(Math.max(pos.getY(i) / depth, 0), 1);
      const band = smoothstep(Math.min(Math.max((vt - (1 - bandT - 0.1)) / 0.2, 0), 1));
      c.copy(sideBottom).lerp(sideTop, band);
      const ao = vt < 0.14 ? 0.72 + 0.28 * (vt / 0.14) : 1;
      c.multiplyScalar(ao);
      c.offsetHSL(0, 0, wobble);
    } else if (ny > 0.5) {
      c.set(top).offsetHSL(0, 0, wobble * 0.6);
    } else {
      c.copy(sideBottom).multiplyScalar(0.6);
    }
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}
