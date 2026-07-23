import Button from "./Button";
import Reveal from "./Reveal";
import StackSection from "./StackSection";

interface ClosingCtaProps {
  title: string;
}

export default function ClosingCta({ title }: ClosingCtaProps) {
  return (
    <StackSection className="z-20 border-t border-line bg-surface">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-2xl px-6 py-24 text-center lg:px-10">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <div className="mt-8 flex justify-center">
            <Button href="/kontak">Hubungi Kami</Button>
          </div>
        </Reveal>
      </div>
    </StackSection>
  );
}
