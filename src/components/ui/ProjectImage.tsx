"use client";

import { useState } from "react";
import Image from "next/image";

interface ProjectImageProps {
  seed: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export default function ProjectImage({
  seed,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: ProjectImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={`https://picsum.photos/seed/${seed}/${width}/${height}`}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      onLoad={() => setLoaded(true)}
      className={`object-cover grayscale contrast-[1.05] transition-opacity duration-700 ease-out ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
