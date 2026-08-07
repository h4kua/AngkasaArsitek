import HeroExperience from "@/components/hero/HeroExperience";

export default function Home() {
  return (
    <>
      <HeroExperience />

      {/* Placeholder post-hero content — replace with real site sections.
          Exists so the page doesn't dead-end after the intro, and so the
          skip-intro link has something real to land on. */}
      <main id="site-content" className="bg-stone px-6 py-24 text-ink md:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs tracking-[0.3em] uppercase text-clay">
            Studio
          </p>
          <h2 className="font-display text-3xl leading-tight md:text-4xl">
            Placeholder copy — replace with the real studio introduction.
          </h2>
          <p className="mt-6 max-w-xl leading-relaxed text-ink/70">
            This section, the project grid, and the contact block below it
            are stand-ins so the page has a real destination after the
            intro. None of this copy is final.
          </p>
        </div>
      </main>

      <footer className="bg-ink px-6 py-10 text-xs tracking-[0.2em] text-stone/50 uppercase md:px-16">
        Angkasa Architects — Pekanbaru, Indonesia
      </footer>
    </>
  );
}
