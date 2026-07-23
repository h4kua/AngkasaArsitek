"use client";

import { useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { phaseT, smoothstep } from "./phases";

interface HotspotsProps {
  smoothRef: MutableRefObject<number>;
}

interface FadeGateProps {
  smoothRef: MutableRefObject<number>;
  delay?: number;
  children: ReactNode;
}

/**
 * Fades its children in once the build has settled (well into the
 * landscape phase), on a plain DOM div so it works inside drei's <Html>
 * portal. A small per-hotspot delay lets them appear as a light cascade
 * rather than all at once.
 */
function FadeGate({ smoothRef, delay = 0, children }: FadeGateProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFrame(() => {
    const p = smoothRef.current;
    const t = smoothstep(phaseT(p, [0.78 + delay, 0.88 + delay]));
    const el = ref.current;
    if (el) {
      el.style.opacity = String(t);
      el.style.transform = `scale(${0.7 + 0.3 * t})`;
      el.style.pointerEvents = t > 0.6 ? "auto" : "none";
    }
  });
  return (
    <div ref={ref} className="origin-center transition-opacity duration-300" style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

const PIN_DOT = (
  <span className="relative flex h-3.5 w-3.5">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
    <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-paper bg-accent" />
  </span>
);

interface InfoPinProps {
  label: string;
  detail: string;
  align?: "left" | "right";
}

/** A discoverable pin: hover on desktop, tap on touch, reveals an architectural note. */
function InfoPin({ label, detail, align = "left" }: InfoPinProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      {PIN_DOT}
      <div
        className={`absolute bottom-[145%] w-52 border border-line bg-surface px-3.5 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] transition-all duration-200 ${
          align === "left" ? "left-0" : "right-0"
        } ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"}`}
      >
        <p className="font-display text-xs font-bold tracking-tight text-paper">{label}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">{detail}</p>
      </div>
    </div>
  );
}

interface CtaPinProps {
  align?: "left" | "right";
}

/** The one pin that turns "I like this house" into a next step. */
function CtaPin({ align = "left" }: CtaPinProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      {PIN_DOT}
      <div
        className={`absolute bottom-[145%] w-56 border border-accent/50 bg-surface px-3.5 py-3 shadow-[0_16px_40px_-12px_rgba(61,99,255,0.45)] transition-all duration-200 ${
          align === "left" ? "left-0" : "right-0"
        } ${open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"}`}
      >
        <p className="font-display text-xs font-bold tracking-tight text-paper">Suka dengan rumah ini?</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Kami merancang rumah seperti ini dari nol, disesuaikan dengan lahan dan gaya hidup Anda.
        </p>
        <Link
          href="/kontak"
          className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-accent transition-colors hover:text-paper"
        >
          Mulai proyek Anda
          <ArrowUpRight size={12} weight="bold" />
        </Link>
      </div>
    </div>
  );
}

/**
 * A handful of discoverable pins scattered over the finished villa: two
 * architectural notes and one that turns admiration into a contact-page
 * visit. They only appear once the build has settled, so they read as a
 * reward for lingering rather than clutter during the construction story.
 */
export default function Hotspots({ smoothRef }: HotspotsProps) {
  return (
    <group>
      <Html position={[2.75, 3.52, -0.15]} center zIndexRange={[30, 0]}>
        <FadeGate smoothRef={smoothRef}>
          <InfoPin
            label="Kantilever 3.5m"
            detail="Atap menjorok tanpa kolom penyangga di ujungnya — struktur baja tersembunyi di dalam plafon."
            align="right"
          />
        </FadeGate>
      </Html>

      <Html position={[-3.5, 2.1, -1.0]} center zIndexRange={[30, 0]}>
        <FadeGate smoothRef={smoothRef} delay={0.02}>
          <InfoPin
            label="Dinding folio"
            detail="Panel travertine yang membuka bertahap, seperti halaman buku — pengganti dinding datar biasa."
            align="left"
          />
        </FadeGate>
      </Html>

      <Html position={[-0.5, 1.05, 1.35]} center zIndexRange={[30, 0]}>
        <FadeGate smoothRef={smoothRef} delay={0.04}>
          <CtaPin align="left" />
        </FadeGate>
      </Html>
    </group>
  );
}
