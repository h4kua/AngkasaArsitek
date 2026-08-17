"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const links = [
  { href: "/", label: "Home" },
  { href: "/tentang", label: "About" },
  { href: "/layanan", label: "Services" },
  { href: "/karya", label: "Projects" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A floating glass panel rather than a full-bleed bar -- it reads as one
 * object suspended above the page instead of a strip fused to the
 * viewport edge, and its rounded corners flatten into the mobile menu
 * beneath it so the two read as a single card rather than two stacked
 * pieces.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-3 z-50 px-3 sm:top-4 sm:px-4 lg:top-5 lg:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div
          className={`flex h-[60px] items-center justify-between border border-line/70 bg-surface-raised/80 px-5 shadow-[0_16px_44px_-22px_rgba(42,37,32,0.35)] backdrop-blur-xl transition-[border-radius] duration-300 sm:px-6 lg:px-8 ${
            open ? "rounded-t-2xl" : "rounded-2xl"
          }`}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-display text-lg font-extrabold tracking-tight"
          >
            ANGKASA
            <span className="text-accent">.</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:bg-accent after:transition-transform after:duration-[400ms] after:ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    active
                      ? "text-paper after:scale-x-100"
                      : "text-muted after:scale-x-0 hover:text-paper hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/kontak"
              className="group inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent shadow-[0_0_0_0_rgba(140,104,54,0)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dim hover:shadow-[0_10px_28px_-10px_rgba(140,104,54,0.55)] active:translate-y-0 active:scale-[0.97]"
            >
              Contact Us
              <ArrowUpRight
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 -mr-2.5 flex h-11 w-11 items-center justify-center rounded-full text-paper transition-colors duration-200 hover:bg-line/40 lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={reduce ? false : { opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={reduce ? undefined : { opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {open ? <X size={22} /> : <List size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              id="mobile-menu"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden rounded-b-2xl border-x border-b border-line/70 bg-surface-raised/95 shadow-[0_16px_44px_-22px_rgba(42,37,32,0.35)] backdrop-blur-xl lg:hidden"
            >
              <ul className="flex flex-col px-6 py-2">
                {links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={reduce ? false : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex min-h-11 items-center font-display text-lg font-medium ${
                        pathname === link.href ? "text-paper" : "text-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  className="mt-3 mb-2"
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: links.length * 0.04 }}
                >
                  <Link
                    href="/kontak"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent"
                  >
                    Contact Us
                    <ArrowUpRight size={14} weight="bold" />
                  </Link>
                </motion.li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
