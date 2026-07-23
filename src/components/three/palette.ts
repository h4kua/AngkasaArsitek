"use client";

import * as THREE from "three";

// Architectural presentation-board palette: warm white, concrete, oak,
// charcoal, plus the muted landscape and dusk tones around them.
export const ACCENT = "#3D63FF";
export const CONCRETE = "#D9D4C7";
export const CONCRETE_WARM = "#CBC3B0";
export const CHARCOAL = "#1C1D21";
export const STEEL = "#3A3C42";
export const OAK = "#BC8E58";
export const OAK_LIGHT = "#D2A873";
export const GLASS = "#CBDCE3";
export const GLOW = "#FFC978";
export const WATER = "#5FA3B5";
export const OLIVE = "#828F70";
export const OLIVE_DARK = "#5D6752";
export const MAPLE = "#A5573B";
export const MAPLE_LIGHT = "#C07850";
export const FABRIC = "#F1ECE0";
export const TRAVERTINE = "#DED5C1";
export const STONE = "#A8A296";
export const GRASS_TOP = "#7E8B66";
export const GRASS_SIDE = "#5E6B4A";
export const GRAVEL = "#B7B1A4";
export const TRUNK = "#6B5A45";

// Terrain strata: the site tier's soil edge, and the plinth's stone cap
// fading into richer earth as the cross-section drops away.
export const SOIL_EDGE = "#5B4E3E";
export const STONE_CAP = "#8C8577";
export const SOIL_DEEP = "#332A20";
export const TERRACE_TOP = "#BDB6A5";

export const WATER_SUNSET = "#D99A78";
export const PALM_GREEN = "#5E7A52";
export const PALM_GREEN_DARK = "#455C3C";
export const PALM_TRUNK = "#8A7860";
export const BLOSSOM = "#E7C9C2";

// Tropical Sumatran garden species, replacing the Mediterranean/temperate
// planting that didn't belong in a Pekanbaru, Riau context.
export const FRANGIPANI_BRANCH = "#8C8670";
export const FRANGIPANI_LEAF = "#5C8A4A";
export const FRANGIPANI_LEAF_DARK = "#436234";
export const FRANGIPANI_FLOWER = "#F6EEDD";
export const BOUGAINVILLEA_LEAF = "#4F6B42";
export const BOUGAINVILLEA_BRACT = "#C93B7A";
export const BOUGAINVILLEA_BRACT_LIGHT = "#DB6B95";

export const OFF_GLOW = new THREE.Color(CHARCOAL);
export const ON_GLOW = new THREE.Color(GLOW);

/** Lerps a "lamp" material between its unlit charcoal and warm glow state. */
export function applyGlow(m: THREE.MeshBasicMaterial | null, t: number) {
  if (!m) return;
  m.color.copy(OFF_GLOW).lerp(ON_GLOW, t);
}

/** Deterministic PRNG so procedural layouts stay stable across renders. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Every opaque box in the model shares this one unlit material; all shading
// is baked into vertex colors, which keeps draw state tiny and the look
// consistent with a hand-illustrated presentation model.
export const BOX_MAT = new THREE.MeshBasicMaterial({ vertexColors: true });

// One shared line material for box edges. It starts as blueprint linework
// and is tuned globally (see tuneEdges) to quiet gray once the villa is built.
export const EDGE_MAT = new THREE.LineBasicMaterial({
  color: ACCENT,
  transparent: true,
  opacity: 0.45,
});

const EDGE_EARLY = new THREE.Color(ACCENT);
const EDGE_LATE = new THREE.Color("#63666E");

/** t 0 = blueprint-blue linework, t 1 = faint built-model linework. */
export function tuneEdges(t: number) {
  EDGE_MAT.color.copy(EDGE_EARLY).lerp(EDGE_LATE, t);
  EDGE_MAT.opacity = 0.45 - 0.33 * t;
}

/**
 * Grows an element along one axis (or uniformly) and hides it entirely
 * below a threshold so squashed geometry never leaves sliver artifacts.
 */
export function grow(g: THREE.Object3D | null, v: number, axis: "x" | "y" | "z" | "all") {
  if (!g) return;
  const s = Math.max(v, 0.001);
  if (axis === "all") g.scale.setScalar(s);
  else g.scale[axis] = s;
  g.visible = v > 0.012;
}

// Fixed tonal step per face orientation fakes soft daylight without any
// real lighting calculation.
function faceTone(nx: number, ny: number, nz: number) {
  if (ny > 0.5) return 0.11;
  if (ny < -0.5) return -0.22;
  if (nx > 0.5) return -0.04;
  if (nx < -0.5) return -0.15;
  if (nz > 0.5) return 0;
  return -0.09;
}

/**
 * Box geometry with all shading baked into vertex colors: the per-face
 * tonal step, a soft vertical gradient that pools ambient occlusion at the
 * base of each side, a faint diagonal drift across top faces, and a tiny
 * deterministic tint wobble so repeated surfaces never read dead flat.
 */
export function flatBoxGeometry(
  sx: number,
  sy: number,
  sz: number,
  hex: string,
  seed = 1,
): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(sx, sy, sz);
  const base = new THREE.Color(hex);
  const rand = mulberry32((seed * 1013904223) | 0);
  const wobble = (rand() - 0.5) * 0.018;
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const nx = nor.getX(i);
    const ny = nor.getY(i);
    const nz = nor.getZ(i);
    let shade = 1;
    if (Math.abs(ny) < 0.5) {
      const vt = sy > 0 ? pos.getY(i) / sy + 0.5 : 1;
      shade = 0.955 + 0.045 * vt;
    } else if (ny > 0.5) {
      const ht = ((pos.getX(i) / sx + 0.5) + (pos.getZ(i) / sz + 0.5)) / 2;
      shade = 0.975 + 0.04 * ht;
    }
    c.set(base).offsetHSL(0, 0, faceTone(nx, ny, nz) + wobble);
    c.multiplyScalar(shade);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}
