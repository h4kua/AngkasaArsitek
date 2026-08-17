import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found — Angkasa Architects",
};

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-28 text-center lg:px-10 lg:py-36">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted">
        The page you&apos;re looking for may have moved or the link may be
        out of date.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button href="/">Back to Home</Button>
        <Button href="/karya" variant="ghost">
          View Our Work
        </Button>
      </div>
    </section>
  );
}
