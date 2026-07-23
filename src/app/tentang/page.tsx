import type { Metadata } from "next";
import ClosingCta from "@/components/ui/ClosingCta";
import ProjectImage from "@/components/ui/ProjectImage";
import Reveal from "@/components/ui/Reveal";
import { company, founders } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tentang Kami — Angkasa Architects",
  description:
    "Angkasa Architects didirikan oleh Jeffri Angkasa dan Indri Sisilia pada 2015 di Pekanbaru, dengan visi merancang ruang tanpa batas.",
};

const milestones = [
  {
    year: "2009",
    text: "Jeffri Angkasa bergabung dengan Hans Brouwer Design di Singapura, mengasah pendekatan desain terstruktur selama lima tahun.",
  },
  {
    year: "2015",
    text: "Angkasa Architects didirikan di Pekanbaru oleh Jeffri Angkasa dan Indri Sisilia.",
  },
  {
    year: "2019",
    text: "Meraih Best Architecture Firm dan Best Architect pada Inara Award.",
  },
  {
    year: "2022",
    text: "Cakupan proyek meluas ke tujuh kota, dari Pekanbaru hingga Jakarta dan Bali.",
  },
];

export default function TentangPage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-6 pt-14 pb-16 text-center lg:px-10 lg:pt-20">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Nama yang berarti terbang setinggi mungkin.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            Angkasa lahir dari keyakinan bahwa merancang ruang seharusnya
            tidak dibatasi oleh kebiasaan. Sejak {company.founded}, kami
            bekerja seperti seniman menghadapi kanvas kosong pada setiap
            proyek baru di Pekanbaru dan sekitarnya.
          </p>
        </Reveal>
      </section>

      {/* Founders */}
      {founders.map((founder, i) => {
        const flipped = i % 2 === 1;
        return (
          <section
            key={founder.name}
            className="mx-auto max-w-[1400px] px-6 pb-20 lg:px-10"
          >
            <div
              className={`grid grid-cols-1 items-center gap-10 border-t border-line pt-16 lg:grid-cols-2 lg:gap-16 ${
                flipped ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal direction={flipped ? "right" : "left"} className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
                <ProjectImage
                  seed={founder.imageSeed}
                  alt={founder.name}
                  width={800}
                  height={1000}
                  className="h-full w-full"
                />
              </Reveal>
              <Reveal
                direction={flipped ? "left" : "right"}
                delay={0.1}
                className="flex flex-col justify-center text-center lg:text-left"
              >
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  {founder.role}
                </p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {founder.name}
                </h2>
                <p className="mx-auto mt-5 max-w-[55ch] text-base leading-relaxed text-muted lg:mx-0">
                  {founder.bio}
                </p>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* Milestones */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
        <Reveal direction="left">
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Perjalanan singkat.
          </h2>
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-line border-t border-line">
          {milestones.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.05}>
              <div className="grid grid-cols-[auto_1fr] gap-6 py-7 sm:grid-cols-[120px_1fr] sm:gap-10">
                <p className="font-mono text-lg text-accent">{m.year}</p>
                <p className="max-w-[55ch] text-base leading-relaxed text-muted">
                  {m.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ClosingCta title="Ingin berdiskusi tentang proyek Anda?" />
    </>
  );
}
