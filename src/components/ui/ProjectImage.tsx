"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

interface ProjectImageProps {
  /** Real photography from Angkasa's media library. Wins when present. */
  src?: string;
  /** picsum seed, used only for records with no real photography yet. */
  seed?: string;
  alt: string;
  width: number;
  height: number;
  /**
   * Layout width hint for the responsive srcset. Without it next/image falls
   * back to a DPR-based srcset sized off the `width` prop, which over-fetches
   * badly on retina screens (measured: a 1920px file pulled for a 1320px slot).
   */
  sizes: string;
  className?: string;
  priority?: boolean;
}

export default function ProjectImage({
  src,
  seed,
  alt,
  width,
  height,
  sizes,
  className = "",
  priority = false,
}: ProjectImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // An image restored from cache can finish before React attaches onLoad. The
  // fade-in gate is one-way, so without this check such an image would stay at
  // opacity-0 permanently.
  const captureRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  const resolved = src ?? (seed ? `https://picsum.photos/seed/${seed}/${width}/${height}` : null);

  // No source at all, or the remote host failed. Either way the old behaviour
  // left the fade gate closed forever and rendered a silent blank card; this
  // degrades to a visible, on-brand placeholder instead.
  if (!resolved || failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} (image unavailable)`}
        className={`relative flex items-center justify-center overflow-hidden bg-surface ${className}`}
      >
        <div className="blueprint-grid absolute inset-0 opacity-40" aria-hidden />
        <span className="relative px-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          Image unavailable
        </span>
      </div>
    );
  }

  // Fade is 300ms, not 700ms: it stacks on top of the network fetch, so a long
  // transition reads as the image being slow rather than as polish. Starting at
  // opacity-35 rather than 0 also stops the frame sitting visibly empty while
  // the last of the image decodes.
  return (
    <Image
      ref={captureRef}
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`object-cover transition-opacity duration-300 ease-out ${
        loaded ? "opacity-100" : "opacity-35"
      } ${className}`}
    />
  );
}
