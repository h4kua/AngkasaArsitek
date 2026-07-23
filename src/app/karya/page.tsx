import type { Metadata } from "next";
import ClosingCta from "@/components/ui/ClosingCta";
import ProjectsGrid from "@/components/ui/ProjectsGrid";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Karya — Angkasa Architects",
  description:
    "Kumpulan rumah tinggal, perumahan, komersial, dan bangunan publik rancangan Angkasa Architects di Pekanbaru dan sekitarnya.",
};

export default function KaryaPage() {
  return (
    <>
      <section className="mx-auto max-w-2xl px-6 pt-14 pb-12 text-center lg:px-10 lg:pt-20">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Karya yang sudah berdiri.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
            {projects.length} proyek terdokumentasi, dari rumah tinggal
            hingga fasilitas publik, tersebar di Pekanbaru dan sekitarnya.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 lg:px-10">
        <ProjectsGrid projects={projects} />
      </section>

      <ClosingCta title="Proyek Anda bisa menjadi yang berikutnya." />
    </>
  );
}
