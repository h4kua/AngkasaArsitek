import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import ClosingCta from "@/components/ui/ClosingCta";
import ProjectCard from "@/components/ui/ProjectCard";
import ProjectImage from "@/components/ui/ProjectImage";
import Reveal from "@/components/ui/Reveal";
import SectionIntro from "@/components/ui/SectionIntro";
import StatStrip from "@/components/ui/StatStrip";
import Hero from "@/components/ui/Hero";
import { projects, services, stats } from "@/lib/data";

const featuredSlugs = [
  "ci-house",
  "jenny-art-center",
  "cassaville",
  "marco-revy-house",
  "sariputta-buddhist-school",
  "ad-house",
];
const featuredProjects = featuredSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const [heroProject, ...gridProjects] = featuredProjects;

export default function Home() {
  return (
    <>
      <Hero />

      {/* Stats */}
      <section id="site-content" className="mx-auto max-w-[1400px] px-6 pb-28 pt-20 lg:px-10">
        <Reveal direction="up">
          <StatStrip stats={stats} />
        </Reveal>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1400px] px-6 pb-28 lg:px-10">
        <Reveal direction="left">
          <SectionIntro
            align="left"
            label="Services"
            title="Six disciplines we work across."
            body="From private homes to public facilities. The starting point is always the same: how the space will actually be used day to day."
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
            label="Projects"
            title="Selected work."
            action={
              <Link
                href="/karya"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-accent"
              >
                View all projects
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
                  src={heroProject.images[0]}
                  alt={`${heroProject.name}, ${heroProject.category} in ${heroProject.location}`}
                  width={1600}
                  height={700}
                  sizes="(min-width: 1440px) 1360px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 48px)"
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

      <ClosingCta
        eyebrow="Have a project in mind?"
        title="Let us shape your space together."
      />
    </>
  );
}
