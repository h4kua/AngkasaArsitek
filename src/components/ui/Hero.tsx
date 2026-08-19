"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { company, projects } from "@/lib/data";
import Button from "./Button";

const EASE = [0.16, 1, 0.3, 1] as const;

const META = [
  { value: String(company.founded), label: "Founded in Pekanbaru" },
  {
    value: `${projects.filter((p) => p.source === "official").length}+`,
    label: "Documented projects",
  },
  { value: String(company.cities.length), label: "Cities covered" },
] as const;

const HERO_IMAGE = {
  src: "/cms/2025/01/1-1024x576.png",
  alt: "Marco Revy House by Angkasa Architects, a futuristic tropical residence with a sculptural white facade and patterned copper screen",
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-2%", "6%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[60px] h-[calc(100svh-28px)] min-h-[660px] w-full overflow-hidden bg-ink"
    >
      <motion.div
        style={reduce ? undefined : { y: imageY }}
        className="absolute -inset-y-8 inset-x-0 will-change-transform"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative h-full w-full"
        >
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover object-[58%_center]"
          />
        </motion.div>
      </motion.div>

      {/* Below lg the hero is single-column and bottom-anchored, so wrapped
          text can reach much further across the viewport than the two-column
          desktop layout ever does -- a flat, near-opaque wash keeps every
          line legible regardless of wrap width. The angled fade only takes
          over at lg, where the text column is reliably narrow and the photo
          needs to stay visible on the right for the featured-frame card. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[rgba(246,241,233,0.94)] lg:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(246,241,233,0.97)_0%,rgba(246,241,233,0.92)_52%,rgba(246,241,233,0.62)_72%,rgba(42,37,32,0.34)_100%)] lg:block"
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-[radial-gradient(circle_at_78%_42%,transparent_0%,transparent_24%,rgba(42,37,32,0.56)_100%)] lg:block"
      />
      <div
        aria-hidden
        className="blueprint-grid-full absolute inset-0 opacity-25 mix-blend-multiply"
      />

      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative flex h-full flex-col justify-end will-change-transform lg:justify-center"
      >
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-6 pb-10 pt-28 sm:px-10 lg:px-14 lg:pb-0 lg:pt-16">
          <div className="max-w-[760px]">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-paper/70 sm:text-xs">
                Angkasa Architects · Since 2015
              </p>
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.28, ease: EASE }}
              className="mt-6 text-balance font-display text-[1.9rem] font-semibold leading-[1.12] tracking-normal text-paper min-[420px]:text-4xl sm:text-5xl sm:leading-[1.08] lg:text-6xl"
            >
              Tropical modern{" "}
              <em className="not-italic text-accent">spaces</em>, made
              precise.
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
              className="mt-6 max-w-[31ch] text-base leading-relaxed text-paper/78 sm:max-w-[52ch] sm:text-lg lg:text-xl"
            >
              Private homes, villas, commercial spaces and public buildings
              shaped around climate, light and everyday use.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.64, ease: EASE }}
              className="mt-7 flex flex-col items-start gap-3 min-[520px]:flex-row min-[520px]:items-center min-[520px]:gap-4"
            >
              <Button href="/karya">View Our Work</Button>
              <Button href="/kontak" variant="ghost">
                Start a Project
              </Button>
            </motion.div>
          </div>

          <dl className="grid grid-cols-3 gap-4 border-t border-paper/20 pt-4 sm:max-w-[640px]">
            {META.map((m, i) => (
              <motion.div
                key={m.value}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.8 + i * 0.08,
                  ease: EASE,
                }}
              >
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-extrabold tracking-normal text-accent sm:text-3xl">
                    {m.value}
                  </span>
                  <span className="mt-1 block max-w-[16ch] font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-paper/70 sm:text-[10px] sm:tracking-[0.16em]">
                    {m.label}
                  </span>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </motion.div>

      <motion.a
        href="#site-content"
        aria-label="Scroll to content"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.05 }}
        style={reduce ? undefined : { opacity: copyOpacity }}
        className="group absolute bottom-8 right-6 hidden flex-col items-center gap-3 text-on-accent/58 transition-colors duration-300 hover:text-accent lg:right-10 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative h-14 w-px overflow-hidden bg-current/30">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={reduce ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
