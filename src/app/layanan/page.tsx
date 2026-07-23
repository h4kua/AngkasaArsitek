import type { Metadata } from "next";
import ClosingCta from "@/components/ui/ClosingCta";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Layanan — Angkasa Architects",
  description:
    "Rumah tinggal, perumahan, komersial, interior, landscape, dan bangunan publik — enam layanan inti Angkasa Architects.",
};

const process = [
  {
    label: "Konsultasi",
    text: "Memahami kebutuhan, anggaran, dan karakter lahan sejak pertemuan pertama.",
  },
  {
    label: "Konsep Desain",
    text: "Menerjemahkan kebutuhan menjadi skema ruang, bentuk, dan material awal.",
  },
  {
    label: "Pengembangan Desain",
    text: "Menyempurnakan detail teknis, struktur, dan spesifikasi material.",
  },
  {
    label: "Pengawasan Konstruksi",
    text: "Mendampingi proses pembangunan agar sesuai dengan rancangan.",
  },
];

export default function LayananPage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-6 pt-14 pb-16 text-center lg:px-10 lg:pt-20">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Enam layanan, satu standar kerja.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            Baik untuk rumah tinggal maupun fasilitas publik berskala besar,
            setiap layanan kami dikerjakan dengan proses yang sama teliti dari
            konsep hingga pengawasan konstruksi.
          </p>
        </Reveal>
      </section>

      {/* Services index */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
        <div className="divide-y divide-line border-t border-b border-line">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.04}>
              <div
                id={service.slug}
                className="grid scroll-mt-24 grid-cols-1 gap-4 px-4 py-9 transition-colors duration-300 hover:bg-surface sm:grid-cols-[80px_1fr_1fr] sm:gap-8 sm:px-6"
              >
                <p className="font-mono text-sm text-muted">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-display text-2xl font-bold tracking-tight">
                  {service.name}
                </p>
                <p className="max-w-[55ch] text-sm leading-relaxed text-muted">
                  {service.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
        <Reveal direction="right">
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cara kami bekerja.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <Reveal
              key={step.label}
              direction={i < 2 ? "left" : "right"}
              delay={(i % 2) * 0.08}
              className="bg-ink p-7 text-center transition-colors duration-300 hover:bg-surface"
            >
              <p className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-4 font-display text-lg font-bold tracking-tight">
                {step.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <ClosingCta title="Ceritakan kebutuhan ruang Anda." />
    </>
  );
}
