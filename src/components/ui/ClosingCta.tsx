import Button from "./Button";
import Reveal from "./Reveal";
import StackSection from "./StackSection";

interface ClosingCtaProps {
  title: string;
  eyebrow?: string;
}

export default function ClosingCta({ title, eyebrow }: ClosingCtaProps) {
  return (
    <StackSection className="z-20 border-t border-line bg-surface">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
        <Reveal>
          {eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-9 bg-accent" aria-hidden />
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                {eyebrow}
              </p>
              <span className="h-px w-9 bg-accent" aria-hidden />
            </div>
          )}
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <div className="mt-8 flex justify-center">
            <Button href="/kontak">Contact Us</Button>
          </div>
        </Reveal>
      </div>
    </StackSection>
  );
}
