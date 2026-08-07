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

const HEADLINE_LINES = [
  [{ text: "Tropical" }],
  [{ text: "modern" }],
  [{ text: "spaces", accent: true }, { text: ", made" }],
  [{ text: "precise." }],
] as const;

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
  project: "Marco Revy House",
  location: "Pondok Indah, Jakarta",
};

const DETAIL_IMAGES = [
  {
    src: "/cms/2026/07/R52_2953-Edit-1024x683.jpg",
    alt: "AD House entry detail with timber screen, stone path and tropical planting",
    title: "AD House",
    meta: "Courtyard detail",
  },
  {
    src: "/cms/2025/01/TH-HOUSE-V01-1024x569.jpg",
    alt: "TH House front elevation with palms and a formal contemporary facade",
    title: "TH House",
    meta: "Private house",
  },
] as const;

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
      className="relative -mt-16 h-[calc(100svh-28px)] min-h-[660px] w-full overflow-hidden bg-ink"
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

      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,241,233,0.97)_0%,rgba(246,241,233,0.88)_34%,rgba(246,241,233,0.24)_63%,rgba(42,37,32,0.3)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,transparent_0%,transparent_28%,rgba(42,37,32,0.48)_100%)]"
      />
      <div
        aria-hidden
        className="blueprint-grid-full absolute inset-0 opacity-25 mix-blend-multiply"
      />
      <div
        aria-hidden
        className="absolute left-[52%] top-0 hidden h-full w-px bg-paper/25 lg:block"
      />

      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative flex h-full flex-col justify-end will-change-transform lg:justify-center"
      >
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-6 pb-10 pt-28 sm:px-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.6fr)] lg:px-14 lg:pb-0 lg:pt-16">
          <div className="max-w-[760px]">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              className="flex items-center gap-3"
            >
              <motion.span
                aria-hidden
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                className="h-px w-12 origin-left bg-accent"
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-paper/70 sm:text-xs">
                Angkasa Architects · Since 2015
              </p>
            </motion.div>

            <h1 className="mt-6 font-display text-[2.4rem] font-extrabold leading-[0.98] tracking-normal text-paper min-[420px]:text-5xl sm:text-6xl sm:leading-[0.95] lg:text-7xl xl:text-8xl">
              {HEADLINE_LINES.map((line, li) => (
                <span key={li} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={reduce ? false : { y: "108%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: 1.05,
                      delay: 0.3 + li * 0.11,
                      ease: EASE,
                    }}
                  >
                    {line.map((part, pi) =>
                      "accent" in part && part.accent ? (
                        <em key={pi} className="not-italic text-accent">
                          {part.text}
                        </em>
                      ) : (
                        <span key={pi}>{part.text}</span>
                      ),
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.72, ease: EASE }}
              className="mt-7 max-w-[31ch] text-base leading-relaxed text-paper/78 sm:max-w-[52ch] sm:text-lg lg:text-xl"
            >
              Private homes, villas, commercial spaces and public buildings
              shaped around climate, light and everyday use.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.84, ease: EASE }}
              className="mt-8 flex flex-col items-start gap-3 min-[520px]:flex-row min-[520px]:items-center min-[520px]:gap-4"
            >
              <Button href="/karya">View Our Work</Button>
              <Button href="/kontak" variant="ghost">
                Start a Project
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
            className="hidden self-end lg:block"
          >
            <div className="ml-auto w-full max-w-[480px]">
              <div className="border-y border-on-accent/35 py-4 text-on-accent">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-accent/65">
                  Featured frame
                </p>
                <p className="mt-2 font-display text-3xl font-bold leading-tight tracking-normal">
                  {HERO_IMAGE.project}
                </p>
                <p className="mt-1 text-sm text-on-accent/72">
                  {HERO_IMAGE.location}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {DETAIL_IMAGES.map((image) => (
                  <figure key={image.src} className="group">
                    <div className="relative aspect-[4/3] overflow-hidden border border-on-accent/30 bg-paper">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="220px"
                        quality={90}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="mt-2 border-t border-on-accent/25 pt-2 text-on-accent">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-on-accent/58">
                        {image.meta}
                      </span>
                      <span className="mt-1 block text-sm font-semibold">
                        {image.title}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </motion.div>

          <dl className="grid grid-cols-3 gap-4 border-t border-paper/20 pt-4 sm:max-w-[640px] lg:col-span-2 lg:max-w-none lg:border-on-accent/35 lg:text-on-accent">
            {META.map((m, i) => (
              <motion.div
                key={m.value}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 1.05 + i * 0.09,
                  ease: EASE,
                }}
              >
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-extrabold tracking-normal sm:text-3xl">
                    {m.value}
                  </span>
                  <span className="mt-1 block max-w-[16ch] font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] opacity-70 sm:text-[10px] sm:tracking-[0.16em]">
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
        aria-label="Skip to main content"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
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
