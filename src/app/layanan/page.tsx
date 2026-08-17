import type { Metadata } from "next";
import ClosingCta from "@/components/ui/ClosingCta";
import Reveal from "@/components/ui/Reveal";
import { faqs, processSteps, services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services — Angkasa Architects",
  description:
    "Private housing, residential areas, villas and resorts, commercial complexes, master planning and architectural interiors — the six disciplines of Angkasa Architects, with process and deliverables.",
  alternates: { canonical: "/layanan" },
};

export default function LayananPage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-6 pt-14 pb-16 text-center lg:px-10 lg:pt-20">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Six disciplines.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            Whether it is a private house or a large public facility, the process
            is the same: from initial consultation through to supervision on
            site. Below is each discipline and exactly what you receive.
          </p>
        </Reveal>
      </section>

      {/* Services index — each with its concrete deliverables */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
        <div className="divide-y divide-line/70 overflow-hidden rounded-2xl border border-line/70 bg-surface-raised/50">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.04}>
              <div
                id={service.slug}
                className="grid scroll-mt-24 grid-cols-1 gap-4 px-5 py-8 transition-colors duration-300 hover:bg-surface-raised sm:grid-cols-[80px_1fr] sm:gap-8 sm:px-8 lg:grid-cols-[80px_1fr_1fr]"
              >
                <p className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </p>

                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    {service.name}
                  </h2>
                  <p className="mt-3 max-w-[55ch] text-sm leading-relaxed text-muted">
                    {service.detail}
                  </p>
                </div>

                <div className="sm:col-start-2 lg:col-start-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    What you receive
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-paper/85">
                        <span
                          aria-hidden
                          className="mt-[9px] h-px w-3 shrink-0 bg-accent"
                        />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="border-y border-line/70 bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
          <Reveal direction="left">
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-accent" aria-hidden />
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                Process
              </p>
            </div>
            <h2 className="mt-4 max-w-[20ch] font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Five stages, from first conversation to handover.
            </h2>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted">
              Every stage has an output you can hold, and only proceeds once you
              have approved it.
            </p>
          </Reveal>

          <ol className="mt-14 border-t border-line/70">
            {processSteps.map((step, i) => (
              <Reveal
                key={step.name}
                direction="up"
                delay={i * 0.05}
                className="grid grid-cols-1 gap-4 border-b border-line/70 py-8 sm:grid-cols-[64px_1fr] sm:gap-8 lg:grid-cols-[64px_minmax(0,7fr)_minmax(0,4fr)]"
              >
                <span className="font-mono text-sm tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight lg:text-2xl">
                    {step.name}
                  </h3>
                  <p className="mt-2.5 max-w-[58ch] text-sm leading-relaxed text-muted lg:text-base">
                    {step.description}
                  </p>
                </div>
                <div className="sm:col-start-2 lg:col-start-3 lg:pl-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    Output
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-paper/85">
                    {step.output}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ — native disclosure, works without JS and is keyboard-accessible */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
        <Reveal direction="left">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-accent" aria-hidden />
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
              Frequently Asked
            </p>
          </div>
          <h2 className="mt-4 max-w-[18ch] font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            The questions we get most.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-16 lg:grid-cols-2">
          {faqs.map((faq, i) => (
            <Reveal
              key={faq.question}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={(i % 2) * 0.06}
            >
              <details className="group border-b border-line/70 py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-1 text-left [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight transition-colors duration-200 group-hover:text-accent">
                    {faq.question}
                  </h3>
                  <span
                    aria-hidden
                    className="relative h-3 w-3 shrink-0 text-accent"
                  >
                    <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                    <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-90" />
                  </span>
                </summary>
                <p className="mt-4 max-w-[62ch] pr-10 text-sm leading-relaxed text-muted">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <ClosingCta
        eyebrow="Ready when you are"
        title="Tell us what you need to build."
      />
    </>
  );
}
