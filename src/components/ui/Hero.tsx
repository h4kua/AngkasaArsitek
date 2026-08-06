"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import heroVilla from "@/assets/hero-villa.png";
import { company, projects } from "@/lib/data";
import Button from "./Button";

const EASE = [0.16, 1, 0.3, 1] as const;

// Headline is split into explicit lines so each can be masked and revealed
// independently. Auto-wrapping can't be masked per-line -- the overflow
// clip needs a real element per line to hide behind.
const HEADLINE_LINES = [
  [{ text: "Architecture that" }],
  [{ text: "fits", accent: true }, { text: " the way" }],
  [{ text: "you live." }],
] as const;

// Derived from the data file rather than hardcoded, so the figures cannot
// drift out of sync with the project list they describe.
const META = [
  { value: String(company.founded), label: "Founded in Pekanbaru" },
  {
    value: `${projects.filter((p) => p.source === "official").length}+`,
    label: "Documented projects",
  },
  { value: String(company.cities.length), label: "Cities covered" },
] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Two planes moving at different rates: the photo lags, the copy leads.
  // Transform/opacity only -- nothing here triggers layout.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // The Nav is `sticky`, so it occupies 64px of normal flow. The negative
  // top margin below pulls the hero up under it: the floating glass nav then
  // sits over the photo (its intended look) and the full 100svh stays inside
  // the fold -- without it the CTAs land just past the bottom edge at 900px.
  return (
    <section
      ref={sectionRef}
      className="relative -mt-16 h-[100svh] min-h-[600px] w-full overflow-hidden bg-paper"
    >
      {/* Photo plane. The initial scale-down "settles" the frame on load,
          which reads as a camera coming to rest rather than a static drop-in. */}
      <motion.div
        style={reduce ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <motion.div
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
          className="relative h-full w-full"
        >
          <Image
            src={heroVilla}
            alt="Modern tropical house by Angkasa Architects: a long swimming pool, travertine terrace and two-storey glass facade at sunrise"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            quality={90}
            className="object-cover object-[62%_center]"
          />
        </motion.div>
      </motion.div>

      {/* Scrim: strong at the bottom-left where the copy sits, clearing fast
          toward the top-right so the sunrise and the villa stay visible. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(42,37,32,0.94)_0%,rgba(42,37,32,0.72)_28%,rgba(42,37,32,0.28)_58%,rgba(42,37,32,0.08)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(42,37,32,0.34)_0%,rgba(42,37,32,0.08)_45%,transparent_75%)]"
      />

      <motion.div
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative flex h-full flex-col justify-end will-change-transform"
      >
        <div className="mx-auto w-full max-w-[1600px] px-6 pb-10 sm:px-10 lg:px-14 lg:pb-14">
          {/* Eyebrow */}
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
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-on-accent/80 sm:text-xs">
              Pekanbaru, Riau · Since 2015
            </p>
          </motion.div>

          {/* Headline -- per-line mask reveal */}
          <h1 className="mt-6 font-display font-extrabold leading-[0.94] tracking-[-0.03em] text-on-accent text-[clamp(2.75rem,9vw,9.5rem)]">
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

          <div className="mt-8 flex flex-col gap-9 lg:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <div>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.72, ease: EASE }}
                className="max-w-[48ch] text-base leading-relaxed text-on-accent/85 sm:text-lg lg:text-xl"
              >
                Private homes, commercial spaces and public buildings. Designed
                from Pekanbaru since 2015.
              </motion.p>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.84, ease: EASE }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Button href="/karya">View Our Work</Button>
                <Button
                  href="/kontak"
                  variant="ghost"
                  className="!border-on-accent/40 !text-on-accent hover:!border-accent hover:!text-accent"
                >
                  Start a Project
                </Button>
              </motion.div>
            </div>

            {/* Meta strip -- staggered, gives the frame editorial density
                instead of a lone headline floating over a photo. */}
            <dl className="flex shrink-0 gap-8 sm:gap-12">
              {META.map((m, i) => (
                <motion.div
                  key={m.value}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.95 + i * 0.09,
                    ease: EASE,
                  }}
                  className="border-t border-on-accent/25 pt-3"
                >
                  <dt className="sr-only">{m.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-extrabold tracking-tight text-on-accent sm:text-3xl">
                      {m.value}
                    </span>
                    <span className="mt-1 block max-w-[14ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-on-accent/60">
                      {m.label}
                    </span>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#site-content"
        aria-label="Skip to main content"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        style={reduce ? undefined : { opacity: copyOpacity }}
        className="group absolute bottom-8 right-6 hidden flex-col items-center gap-3 text-on-accent/55 transition-colors duration-300 hover:text-accent lg:right-10 lg:flex"
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
