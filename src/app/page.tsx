import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Button from "@/components/ui/Button";
import ClosingCta from "@/components/ui/ClosingCta";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectImage from "@/components/ui/ProjectImage";
import Reveal from "@/components/ui/Reveal";
import SectionIntro from "@/components/ui/SectionIntro";
import StackSection from "@/components/ui/StackSection";
import StatStrip from "@/components/ui/StatStrip";
import HeroHouse from "@/components/three/HeroHouse";
import { company, founders, projects, services, stats } from "@/lib/data";

const featuredSlugs = [
  "ci-house",
  "jenny-art-center",
  "cassaville",
  "marco-revy-house",
  "sariputta-buddhist-school",
  "ochado-cafe",
];
const featuredProjects = featuredSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const [heroProject, ...gridProjects] = featuredProjects;

export default function Home() {
  return (
    <>
      <HeroHouse />

      {/* Stats */}
      <section className="mx-auto max-w-[1400px] px-6 pb-28 lg:px-10">
        <Reveal direction="up">
          <StatStrip stats={stats} />
        </Reveal>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1400px] px-6 pb-28 lg:px-10">
        <Reveal direction="left">
          <SectionIntro
            align="left"
            label="— Layanan"
            title="Enam disiplin, satu cara berpikir."
            body="Dari rumah tinggal hingga fasilitas publik, setiap proyek kami mulai dari cara ruang itu akan benar-benar dipakai."
          />
        </Reveal>

        <div className="mt-12 border-t border-line">
          {services.map((service, i) => (
            <Reveal key={service.slug} direction="up" delay={i * 0.04}>
              <Link
                href="/layanan"
                className="group flex items-center gap-6 border-b border-line py-6 transition-colors duration-300 hover:bg-surface/30 lg:py-7 lg:gap-10"
              >
                <span className="w-8 shrink-0 font-mono text-xs text-accent lg:w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-xl font-bold tracking-tight group-hover:text-accent transition-colors duration-300 lg:text-2xl">
                    {service.name}
                  </span>
                  <span className="mt-1 hidden text-sm leading-relaxed text-muted sm:block lg:max-w-[55ch]">
                    {service.description}
                  </span>
                </span>
                <ArrowUpRight
                  size={20}
                  weight="bold"
                  className="shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="mx-auto max-w-[1400px] px-6 pb-28 lg:px-10">
        <Reveal direction="left">
          <SectionIntro
            align="left"
            label="— Karya"
            title="Karya pilihan."
            action={
              <Link
                href="/karya"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-accent"
              >
                Lihat semua karya
                <ArrowUpRight size={16} weight="bold" />
              </Link>
            }
          />
        </Reveal>

        {/* Hero project */}
        {heroProject && (
          <Reveal direction="up" className="mt-12">
            <Link
              href={`/karya/${heroProject.slug}`}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-surface">
                <ProjectImage
                  seed={heroProject.imageSeed}
                  alt={`${heroProject.name}, ${heroProject.category} di ${heroProject.location}`}
                  width={1600}
                  height={700}
                  priority
                  className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
                <div className="absolute inset-0 bg-accent/5 mix-blend-screen" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-10">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                      {heroProject.category} · {heroProject.year}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-paper sm:text-3xl lg:text-4xl">
                      {heroProject.name}
                    </h3>
                    <p className="mt-1 hidden max-w-[50ch] text-sm leading-relaxed text-paper/70 sm:block">
                      {heroProject.summary}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={28}
                    weight="bold"
                    className="mb-1 shrink-0 text-paper/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                  />
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {/* Grid projects */}
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {gridProjects.map((project, i) => {
            const col = i % 3;
            const dir: "left" | "up" | "right" =
              col === 0 ? "left" : col === 2 ? "right" : "up";
            return (
              <Reveal
                key={project.slug}
                direction={dir}
                delay={Math.floor(i / 3) * 0.1}
              >
                <ProjectCard project={project} />
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Manifesto / About teaser */}
      <StackSection className="z-10 border-t border-b border-line bg-surface">
        <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Project mosaic */}
            <Reveal direction="left" className="relative">
              <div className="grid grid-cols-2 gap-2">
                {featuredProjects.slice(0, 4).map((p) => (
                  <div
                    key={p.slug}
                    className="relative aspect-square overflow-hidden bg-surface"
                  >
                    <ProjectImage
                      seed={p.imageSeed}
                      alt={p.name}
                      width={600}
                      height={600}
                      className="h-full w-full transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-4 -right-4 border border-line bg-ink px-5 py-4 lg:-bottom-6 lg:-right-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Berdiri sejak</p>
                <p className="font-display text-3xl font-extrabold tracking-tight text-paper">
                  {company.founded}
                </p>
              </div>
            </Reveal>

            {/* Text column */}
            <Reveal direction="right" className="flex flex-col justify-center">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                — Tentang Kami
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Didirikan oleh dua arsitek, satu visi.
              </h2>
              <blockquote className="mt-6 border-l-2 border-accent pl-5">
                <p className="font-display text-lg italic leading-relaxed text-paper/80">
                  &ldquo;{company.motto}&rdquo;
                </p>
              </blockquote>
              <p className="mt-6 max-w-[55ch] text-base leading-relaxed text-muted">
                Nama Angkasa merepresentasikan semangat terbang setinggi mungkin.{" "}
                {founders[0].name.split(",")[0]} dan {founders[1].name} mendirikan
                studio ini dengan satu keyakinan: setiap kota berhak atas bangunan
                yang dirancang dengan sungguh-sungguh.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                {founders.map((f) => (
                  <div key={f.name} className="border-t border-line pt-3 pr-8">
                    <p className="text-sm font-semibold text-paper">{f.name.split(",")[0]}</p>
                    <p className="text-xs text-muted">{f.role}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button href="/tentang" variant="ghost">
                  Tentang Kami
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </StackSection>

      <ClosingCta title="Mari wujudkan ruang Anda bersama kami." />
    </>
  );
}
