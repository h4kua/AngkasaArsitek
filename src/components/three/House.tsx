"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PHASES, easeInOutExpo, easeOutQuart, phaseT, smoothstep, stagger } from "./phases";
import {
  ACCENT,
  CHARCOAL,
  CONCRETE,
  CONCRETE_WARM,
  FABRIC,
  GLASS,
  GLOW,
  OAK,
  OAK_LIGHT,
  OLIVE,
  STEEL,
  STONE,
  TRAVERTINE,
  applyGlow,
  grow,
} from "./palette";
import FlatBox from "./FlatBox";

export const PODIUM_TOP = 0.22;
const GF_H = 1.55;
const SLAB_T = 0.14;
const UP_H = 1.35;
const UP_Y = PODIUM_TOP + GF_H + SLAB_T + UP_H / 2;
const ROOF_Y = PODIUM_TOP + GF_H + SLAB_T + UP_H + 0.08;

// Steel column layout: [x, z, height]
const COLUMNS: Array<[number, number, number]> = [
  [-2.2, -1.3, GF_H],
  [1.2, -1.3, GF_H],
  [-2.2, 1.0, GF_H],
  [1.2, 1.0, GF_H],
  [-2.85, 1.1, ROOF_Y - PODIUM_TOP - 0.08],
  [-2.85, -1.5, ROOF_Y - PODIUM_TOP - 0.08],
];

const GLASS_PANEL_XS = [-1.82, -0.94, -0.06, 0.82];
const MULLION_XS = [-2.26, -1.38, -0.5, 0.38, 1.26];
const SLAT_COUNT = 24;

// The folio wall: a fan of stone fins standing where a single flat blade
// wall used to be, opening from a near-flush angle at the entrance end to
// a wide angle at the back, like pages turning. Z runs front to back; the
// rotation list runs in step with it.
const FIN_H = 2.92;
const FIN_D = 0.58;
const FIN_ZS = [1.75, 1.29, 0.83, 0.37, -0.09, -0.55, -1.01, -1.47, -1.93] as const;
const FIN_ROT_DEG = [4, 8, 12, 16, 20, 24, 28, 31, 34] as const;

interface HouseProps {
  smoothRef: MutableRefObject<number>;
}

/**
 * The villa itself: blueprint sketch, podium, steel frame, walls, the
 * cantilevered thin-edge roof, glazing, oak louvers, the floating balcony,
 * and a furnished warm interior. Every phase reads the shared smoothed
 * scroll progress and animates its own slice of the story.
 */
export default function House({ smoothRef }: HouseProps) {
  const blueprintLines = useRef<THREE.LineSegments>(null);
  const blueprintMat = useRef<THREE.LineBasicMaterial>(null);
  const dimMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const foundationG = useRef<THREE.Group>(null);
  const columnRefs = useRef<(THREE.Group | null)[]>([]);
  const slabG = useRef<THREE.Group>(null);
  const wallRefs = useRef<(THREE.Group | null)[]>([]);
  const finRefs = useRef<(THREE.Group | null)[]>([]);
  const roofG = useRef<THREE.Group>(null);
  const roofLedMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const glassRefs = useRef<(THREE.Mesh | null)[]>([]);
  const mullionsG = useRef<THREE.Group>(null);
  const slatRefs = useRef<(THREE.Group | null)[]>([]);
  const upperGlassRibbon = useRef<THREE.Group>(null);
  const upperGlassEnd = useRef<THREE.Group>(null);
  const balconyG = useRef<THREE.Group>(null);
  const ribbonMat = useRef<THREE.MeshBasicMaterial>(null);
  const endWindowMat = useRef<THREE.MeshBasicMaterial>(null);
  const interiorPops = useRef<(THREE.Group | null)[]>([]);
  const pendantMats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const washMat = useRef<THREE.MeshBasicMaterial>(null);
  const glassStreakMat = useRef<THREE.MeshBasicMaterial>(null);
  const curtainG = useRef<THREE.Group>(null);

  // Blueprint: merged edge lines of the main massing volumes, drawn in sequence
  const blueprintGeo = useMemo(() => {
    const volumes: Array<[[number, number, number], [number, number, number]]> = [
      [[7.6, 0.22, 4.8], [-0.1, 0.11, 0]],
      [[3.6, GF_H, 2.5], [-0.5, PODIUM_TOP + GF_H / 2, -0.15]],
      [[4.2, UP_H, 2.3], [0.55, UP_Y, -0.25]],
      [[7.5, 0.17, 3.55], [-0.15, ROOF_Y + 0.02, -0.2]],
      [[0.28, 3.0, 3.6], [-3.35, PODIUM_TOP + 1.5, -0.1]],
    ];
    const verts: number[] = [];
    for (const [size, pos] of volumes) {
      const box = new THREE.BoxGeometry(size[0], size[1], size[2]);
      const edges = new THREE.EdgesGeometry(box);
      const arr = edges.attributes.position.array;
      for (let i = 0; i < arr.length; i += 3) {
        verts.push(arr[i] + pos[0], arr[i + 1] + pos[1], arr[i + 2] + pos[2]);
      }
      box.dispose();
      edges.dispose();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const p = smoothRef.current;

    const bT = phaseT(p, PHASES.blueprint);
    const fT = smoothstep(phaseT(p, PHASES.foundation));
    const sT = phaseT(p, PHASES.structure);
    const wT = phaseT(p, PHASES.walls);
    const rT = smoothstep(phaseT(p, PHASES.roof));
    const gT = phaseT(p, PHASES.glass);
    const cT = phaseT(p, PHASES.cladding);
    const iT = phaseT(p, PHASES.interior);

    // Blueprint draws in, then fades as real walls rise
    const blueprintOpacity = 0.85 * bT * (1 - smoothstep(wT));
    if (blueprintLines.current) {
      const total = blueprintGeo.attributes.position.count;
      const count = Math.floor((total * easeInOutExpo(bT)) / 2) * 2;
      blueprintLines.current.geometry.setDrawRange(0, count);
      blueprintLines.current.visible = blueprintOpacity > 0.01;
    }
    if (blueprintMat.current) blueprintMat.current.opacity = blueprintOpacity;
    const siteOpacity = (0.45 + 0.35 * bT) * (1 - smoothstep(wT));
    for (const m of dimMats.current) {
      if (m) m.opacity = siteOpacity;
    }

    if (foundationG.current) {
      grow(foundationG.current, easeOutQuart(fT), "y");
      foundationG.current.position.y = -0.03 * (1 - fT);
    }

    columnRefs.current.forEach((g, i) => {
      grow(g, easeOutQuart(stagger(sT, i, COLUMNS.length, 0.65)), "y");
    });
    if (slabG.current) {
      const sl = easeOutQuart(smoothstep(Math.min(Math.max((sT - 0.55) / 0.45, 0), 1)));
      grow(slabG.current, sl, "all");
    }

    wallRefs.current.forEach((g, i) => {
      grow(g, easeOutQuart(stagger(wT, i, 4, 0.5)), "y");
    });
    finRefs.current.forEach((g, i) => {
      grow(g, easeOutQuart(stagger(wT, i, FIN_ZS.length, 0.55)), "y");
    });

    // Roof floats down; the hidden LED strips wake at the end of its travel
    if (roofG.current) {
      roofG.current.position.y = (1 - rT) * 1.6;
      roofG.current.visible = rT > 0.002;
    }
    const ledT = smoothstep(Math.max((rT - 0.55) / 0.45, 0));
    for (const m of roofLedMats.current) applyGlow(m, ledT);

    glassRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const gt = easeOutQuart(stagger(gT, i, 5, 0.6));
      mesh.position.y = mesh.userData.baseY + (1 - gt) * 0.3;
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.32 * gt;
      mesh.visible = gt > 0.012;
    });
    if (mullionsG.current) grow(mullionsG.current, easeOutQuart(gT), "y");
    if (glassStreakMat.current) glassStreakMat.current.opacity = 0.14 * easeOutQuart(gT);

    slatRefs.current.forEach((g, i) => {
      grow(g, easeOutQuart(stagger(cT, i, SLAT_COUNT, 0.88)), "y");
    });
    const ribbonT = easeOutQuart(smoothstep(cT));
    const endT = easeOutQuart(smoothstep(Math.max(cT - 0.15, 0) / 0.85));
    const balconyT = easeOutQuart(smoothstep(Math.max(cT - 0.3, 0) / 0.7));
    if (upperGlassRibbon.current) grow(upperGlassRibbon.current, ribbonT, "all");
    if (upperGlassEnd.current) grow(upperGlassEnd.current, endT, "all");
    if (balconyG.current) grow(balconyG.current, balconyT, "all");
    applyGlow(ribbonMat.current, smoothstep(Math.max((ribbonT - 0.6) / 0.4, 0)));
    applyGlow(endWindowMat.current, smoothstep(Math.max((endT - 0.6) / 0.4, 0)));

    let kitchenT = 0;
    interiorPops.current.forEach((g, i) => {
      const t = easeOutQuart(stagger(iT, i, 5, 0.55));
      if (i === 3) kitchenT = t;
      grow(g, t, "all");
    });
    pendantMats.current.forEach((m) => applyGlow(m, smoothstep(Math.max((kitchenT - 0.5) / 0.5, 0))));
    if (washMat.current) washMat.current.opacity = 0.28 * easeOutQuart(stagger(iT, 4, 5, 0.55));

    // The curtain breathes with a faint draft as soon as the interior has
    // mostly settled in, not only once scrolling has fully stopped.
    if (curtainG.current) {
      const breathT = smoothstep(Math.min(Math.max((iT - 0.3) / 0.7, 0), 1));
      curtainG.current.rotation.y = 0.06 + Math.sin(state.clock.elapsedTime * 0.5) * 0.025 * breathT;
    }
  });

  return (
    <group>
      {/* Blueprint massing outline, drawn in as the story begins */}
      <lineSegments ref={blueprintLines} geometry={blueprintGeo} visible={false}>
        <lineBasicMaterial ref={blueprintMat} color={ACCENT} transparent opacity={0} />
      </lineSegments>

      {/* Site boundary, four surveyor lines visible from the first frame */}
      {(
        [
          [[8.2, 0.014, 0.014], [-0.1, 0.015, 2.7]],
          [[8.2, 0.014, 0.014], [-0.1, 0.015, -2.7]],
          [[0.014, 0.014, 5.4], [-4.2, 0.015, 0]],
          [[0.014, 0.014, 5.4], [4.0, 0.015, 0]],
        ] as const
      ).map(([size, pos], i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <boxGeometry args={[size[0], size[1], size[2]]} />
          <meshBasicMaterial
            ref={(m) => {
              dimMats.current[i] = m;
            }}
            color={ACCENT}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* Phase: foundation, the terrace podium with shadow joints */}
      <group ref={foundationG} scale={[1, 0.001, 1]}>
        <FlatBox size={[7.6, 0.22, 4.8]} position={[-0.1, 0.11, 0]} color={CONCRETE} />
        {[-1.5, 1.9].map((x) => (
          <FlatBox
            key={x}
            size={[0.014, 0.224, 4.804]}
            position={[x, 0.11, 0]}
            color="#C4BCAC"
            edges={false}
          />
        ))}
      </group>

      {/* Phase: structure, steel columns and the upper slab */}
      <group position={[0, PODIUM_TOP, 0]}>
        {COLUMNS.map(([x, z, h], i) => (
          <group
            key={i}
            position={[x, 0, z]}
            scale={[1, 0.001, 1]}
            ref={(el) => {
              columnRefs.current[i] = el;
            }}
          >
            <FlatBox size={[0.09, h, 0.09]} position={[0, h / 2, 0]} color={STEEL} edges={false} />
          </group>
        ))}
      </group>
      <group ref={slabG} scale={0.001}>
        <FlatBox
          size={[4.6, SLAB_T, 2.5]}
          position={[0.3, PODIUM_TOP + GF_H + SLAB_T / 2, -0.2]}
          color={CONCRETE}
        />
      </group>

      {/* Phase: walls */}
      <group position={[0, PODIUM_TOP, 0]}>
        <group scale={[1, 0.001, 1]} ref={(el) => { wallRefs.current[0] = el; }}>
          <FlatBox size={[3.7, GF_H, 0.12]} position={[-0.5, GF_H / 2, -1.34]} color={CONCRETE} />
          <FlatBox
            size={[0.016, GF_H + 0.004, 0.124]}
            position={[0.42, GF_H / 2, -1.34]}
            color="#C4BCAC"
            edges={false}
          />
        </group>
        <group scale={[1, 0.001, 1]} ref={(el) => { wallRefs.current[1] = el; }}>
          <FlatBox size={[0.12, GF_H, 1.0]} position={[1.24, GF_H / 2, -0.9]} color={CONCRETE} />
        </group>
        {/* Folio wall: a fan of stone fins standing where a single flat
            blade wall used to be, opening from near-flush at the entrance
            end to a wide angle at the back -- pages turning in stone. */}
        {FIN_ZS.map((z, i) => (
          <group
            key={z}
            position={[-3.35, 0, z]}
            rotation={[0, (FIN_ROT_DEG[i] * Math.PI) / 180, 0]}
            scale={[1, 0.001, 1]}
            ref={(el) => { finRefs.current[i] = el; }}
          >
            <FlatBox
              size={[0.1, FIN_H, FIN_D]}
              position={[0, FIN_H / 2, 0]}
              color={i % 2 === 0 ? TRAVERTINE : STONE}
            />
          </group>
        ))}
        {/* Cantilevered upper volume with an oak soffit reading from below */}
        <group position={[0, GF_H + SLAB_T, 0]} scale={[1, 0.001, 1]} ref={(el) => { wallRefs.current[3] = el; }}>
          <FlatBox size={[4.2, UP_H, 2.3]} position={[0.55, UP_H / 2, -0.25]} color={CONCRETE_WARM} />
          <FlatBox
            size={[4.16, 0.026, 2.26]}
            position={[0.55, -0.014, -0.25]}
            color={OAK_LIGHT}
            edges={false}
          />
        </group>
      </group>

      {/* Phase: roof. Deep cantilever, knife-thin fascia, oak ceiling below,
          and hidden LED strips along two edges. */}
      <group ref={roofG} position={[0, 1.6, 0]} visible={false}>
        <FlatBox size={[7.5, 0.07, 3.55]} position={[-0.15, ROOF_Y + 0.055, -0.2]} color={CHARCOAL} />
        <FlatBox
          size={[7.0, 0.1, 3.05]}
          position={[-0.15, ROOF_Y - 0.03, -0.2]}
          color={CHARCOAL}
          edges={false}
        />
        <FlatBox
          size={[6.9, 0.028, 2.95]}
          position={[-0.15, ROOF_Y - 0.095, -0.2]}
          color={OAK_LIGHT}
          edges={false}
        />
        {/* Membrane seams, skylight and vent stack break the roof plane */}
        {[-1.35, 1.05].map((x) => (
          <FlatBox
            key={x}
            size={[0.016, 0.01, 3.4]}
            position={[x, ROOF_Y + 0.092, -0.2]}
            color="#141519"
            edges={false}
          />
        ))}
        <FlatBox size={[0.6, 0.05, 0.6]} position={[1.9, ROOF_Y + 0.115, -0.85]} color={STEEL} edges={false} />
        <mesh position={[1.9, ROOF_Y + 0.150, -0.85]}>
          <boxGeometry args={[0.54, 0.024, 0.54]} />
          <meshBasicMaterial color={GLASS} transparent opacity={0.55} depthWrite={false} />
        </mesh>
        <FlatBox size={[0.2, 0.09, 0.2]} position={[-2.7, ROOF_Y + 0.135, -1.1]} color={STEEL} edges={false} />
        <FlatBox size={[0.24, 0.02, 0.24]} position={[-2.7, ROOF_Y + 0.19, -1.1]} color={CHARCOAL} edges={false} />
        <mesh position={[-0.15, ROOF_Y - 0.115, 1.26]}>
          <boxGeometry args={[6.4, 0.03, 0.03]} />
          <meshBasicMaterial ref={(m) => { roofLedMats.current[0] = m; }} color={CHARCOAL} />
        </mesh>
        <mesh position={[3.42, ROOF_Y - 0.115, -0.2]}>
          <boxGeometry args={[0.03, 0.03, 2.8]} />
          <meshBasicMaterial ref={(m) => { roofLedMats.current[1] = m; }} color={CHARCOAL} />
        </mesh>
      </group>

      {/* Phase: glass */}
      {GLASS_PANEL_XS.map((x, i) => (
        <mesh
          key={i}
          position={[x, PODIUM_TOP + GF_H / 2, 1.04]}
          userData={{ baseY: PODIUM_TOP + GF_H / 2 }}
          ref={(el) => { glassRefs.current[i] = el; }}
        >
          <boxGeometry args={[0.82, GF_H - 0.12, 0.04]} />
          <meshBasicMaterial color={GLASS} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
      <mesh
        position={[1.28, PODIUM_TOP + GF_H / 2, 0.4]}
        userData={{ baseY: PODIUM_TOP + GF_H / 2 }}
        ref={(el) => { glassRefs.current[4] = el; }}
      >
        <boxGeometry args={[0.04, GF_H - 0.12, 1.35]} />
        <meshBasicMaterial color={GLASS} transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={mullionsG} position={[0, PODIUM_TOP, 0]} scale={[1, 0.001, 1]}>
        {MULLION_XS.map((x) => (
          <FlatBox
            key={x}
            size={[0.06, GF_H - 0.06, 0.08]}
            position={[x, (GF_H - 0.06) / 2, 1.04]}
            color={STEEL}
            edges={false}
          />
        ))}
      </group>
      {/* A single diagonal highlight crossing the glazed run, the flat-
          illustration shorthand for a glass reflection */}
      <mesh position={[-0.6, PODIUM_TOP + GF_H / 2 + 0.04, 1.07]} rotation={[0, 0, 0.38]}>
        <planeGeometry args={[0.4, GF_H + 0.4]} />
        <meshBasicMaterial ref={glassStreakMat} color="#FFFFFF" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Phase: cladding, oak slat screen across the upper volume */}
      <group position={[0, UP_Y - UP_H / 2 - 0.04, 0]}>
        {Array.from({ length: SLAT_COUNT }, (_, i) => {
          const x = -1.5 + i * 0.178;
          return (
            <group key={i} position={[x, 0, 1.0]} scale={[1, 0.001, 1]} ref={(el) => { slatRefs.current[i] = el; }}>
              <FlatBox
                size={[0.06, UP_H + 0.08, 0.045]}
                position={[0, (UP_H + 0.08) / 2, 0]}
                color={OAK}
                edges={false}
              />
            </group>
          );
        })}
      </group>
      {/* Ribbon window glowing behind the slats and cantilever end window */}
      <group ref={upperGlassRibbon} position={[0.55, UP_Y, 0.93]} scale={0.001} visible={false}>
        <mesh>
          <boxGeometry args={[3.9, 0.52, 0.03]} />
          <meshBasicMaterial ref={ribbonMat} color={CHARCOAL} />
        </mesh>
      </group>
      <group ref={upperGlassEnd} position={[2.67, UP_Y, -0.25]} scale={0.001} visible={false}>
        <mesh>
          <boxGeometry args={[0.03, 0.85, 1.4]} />
          <meshBasicMaterial ref={endWindowMat} color={CHARCOAL} />
        </mesh>
      </group>

      {/* Floating balcony off the cantilever end: glass balustrade, oak
          handrail, and a planted corner. */}
      <group ref={balconyG} position={[3.22, 1.875, -0.25]} scale={0.001} visible={false}>
        <FlatBox size={[1.05, 0.07, 1.65]} position={[0, 0, 0]} color={CONCRETE_WARM} />
        {(
          [
            [[1.0, 0.3, 0.022], [0, 0.185, 0.8]],
            [[1.0, 0.3, 0.022], [0, 0.185, -0.8]],
            [[0.022, 0.3, 1.6], [0.5, 0.185, 0]],
          ] as const
        ).map(([size, pos], i) => (
          <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
            <boxGeometry args={[size[0], size[1], size[2]]} />
            <meshBasicMaterial color={GLASS} transparent opacity={0.3} depthWrite={false} />
          </mesh>
        ))}
        <FlatBox size={[1.04, 0.028, 0.05]} position={[0, 0.35, 0.8]} color={OAK} edges={false} />
        <FlatBox size={[1.04, 0.028, 0.05]} position={[0, 0.35, -0.8]} color={OAK} edges={false} />
        <FlatBox size={[0.05, 0.028, 1.64]} position={[0.5, 0.35, 0]} color={OAK} edges={false} />
        <FlatBox size={[0.3, 0.18, 0.3]} position={[0.33, 0.12, -0.6]} color={CONCRETE} edges={false} />
        <mesh position={[0.33, 0.3, -0.6]}>
          <icosahedronGeometry args={[0.12, 1]} />
          <meshBasicMaterial color={OLIVE} />
        </mesh>
      </group>

      {/* Phase: interior */}
      <group position={[0, PODIUM_TOP, 0]}>
        {/* Sofa, rug and window curtain */}
        <group scale={0.001} ref={(el) => { interiorPops.current[0] = el; }}>
          <FlatBox size={[1.7, 0.012, 1.05]} position={[-1.52, 0.012, -0.1]} color="#CDBFA8" edges={false} />
          <FlatBox size={[1.35, 0.26, 0.6]} position={[-1.55, 0.27, -0.55]} color={FABRIC} />
          <FlatBox size={[1.35, 0.34, 0.13]} position={[-1.55, 0.51, -0.82]} color={FABRIC} />
          <group ref={curtainG} position={[-2.02, GF_H / 2, 0.9]} rotation={[0, 0.06, 0]}>
            <FlatBox size={[0.42, GF_H - 0.24, 0.03]} position={[0, 0, 0]} color={FABRIC} edges={false} />
          </group>
        </group>
        {/* Coffee table with books and a mug */}
        <group scale={0.001} ref={(el) => { interiorPops.current[1] = el; }}>
          <FlatBox size={[0.65, 0.15, 0.42]} position={[-1.5, 0.16, 0.25]} color={OAK} />
          <FlatBox size={[0.14, 0.022, 0.1]} position={[-1.62, 0.246, 0.3]} color={ACCENT} edges={false} />
          <FlatBox
            size={[0.11, 0.02, 0.08]}
            position={[-1.61, 0.267, 0.29]}
            rotation={[0, 0.3, 0]}
            color="#A5573B"
            edges={false}
          />
          <mesh position={[-1.32, 0.252, 0.13]}>
            <cylinderGeometry args={[0.022, 0.022, 0.035, 8]} />
            <meshBasicMaterial color={FABRIC} />
          </mesh>
        </group>
        {/* Dining set */}
        <group scale={0.001} ref={(el) => { interiorPops.current[2] = el; }}>
          <FlatBox size={[1.05, 0.05, 0.6]} position={[0.45, 0.46, -0.3]} color={OAK} />
          {[-0.38, 0.38].map((dx) => (
            <FlatBox
              key={dx}
              size={[0.06, 0.42, 0.5]}
              position={[0.45 + dx, 0.22, -0.3]}
              color={STEEL}
              edges={false}
            />
          ))}
          {(
            [
              [0.25, -0.22],
              [0.64, -0.4],
            ] as const
          ).map(([mx, mz]) => (
            <mesh key={mx} position={[mx, 0.503, mz]}>
              <cylinderGeometry args={[0.02, 0.02, 0.035, 8]} />
              <meshBasicMaterial color={CONCRETE} />
            </mesh>
          ))}
        </group>
        {/* Kitchen island and pendants */}
        <group scale={0.001} ref={(el) => { interiorPops.current[3] = el; }}>
          <FlatBox size={[1.5, 0.5, 0.45]} position={[0.15, 0.25, -1.1]} color={CONCRETE} />
          {[-0.25, 0.15, 0.55].map((x, pi) => (
            <group key={x}>
              <mesh position={[x, 1.32, -1.1]}>
                <cylinderGeometry args={[0.012, 0.012, 0.24, 6]} />
                <meshBasicMaterial color={STEEL} />
              </mesh>
              <mesh position={[x, 1.18, -1.1]}>
                <sphereGeometry args={[0.045, 12, 10]} />
                <meshBasicMaterial
                  ref={(m) => {
                    pendantMats.current[pi] = m;
                  }}
                  color={CHARCOAL}
                />
              </mesh>
            </group>
          ))}
        </group>
        {/* Warm interior wash */}
        <group scale={0.001} ref={(el) => { interiorPops.current[4] = el; }}>
          <mesh position={[-0.5, 0.72, -1.25]}>
            <boxGeometry args={[3.2, 1.2, 0.02]} />
            <meshBasicMaterial ref={washMat} color={GLOW} transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
