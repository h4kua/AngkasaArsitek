"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/ui/Button";
import Highlight from "@/components/ui/Highlight";
import HouseScene from "./HouseScene";

export default function HeroHouse() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      progressRef.current = 1;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        const header = headerRef.current;
        if (header) {
          const fade = Math.min(self.progress / 0.13, 1);
          header.style.opacity = String(1 - fade);
          header.style.transform = `translateY(${-44 * fade}px)`;
        }
        // The blueprint paper dims as the sky takes over the finale, but
        // never fully disappears -- a faint blue thread ties the golden
        // hour back to the rest of the site's identity.
        const grid = gridRef.current;
        if (grid) {
          const gone = Math.min(Math.max((self.progress - 0.84) / 0.1, 0), 1);
          grid.style.opacity = String(1 - gone * 0.82);
        }
      },
    });

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "40% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[280vh]">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <div
          ref={gridRef}
          className="blueprint-grid-full pointer-events-none absolute inset-0 z-0"
          aria-hidden
        />

        <div className="absolute inset-0 z-10">
          <HouseScene progressRef={progressRef} active={active} />
        </div>

        <div
          ref={headerRef}
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-start px-6 pt-24 text-center will-change-transform lg:pt-28"
        >
          <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Arsitektur yang <Highlight>menyatu</Highlight> dengan cara Anda
            hidup.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            Angkasa Architects merancang rumah, ruang komersial, dan
            bangunan publik di Pekanbaru sejak 2015 dengan pendekatan modern
            tropis.
          </p>
          <div className="pointer-events-auto mt-9">
            <Button href="/karya">Lihat Karya Kami</Button>
          </div>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Gulir untuk menjelajah
          </p>
        </div>

        {/* Resolves whatever the sky is doing into the site's ink black
            before the next section starts, so the seam never reads as a
            hard cut between two different designs. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[26vh] bg-gradient-to-b from-transparent to-ink"
          aria-hidden
        />
      </div>
    </section>
  );
}
