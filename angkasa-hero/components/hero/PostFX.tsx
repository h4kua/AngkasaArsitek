"use client";

import { EffectComposer, Bloom, Vignette, N8AO } from "@react-three/postprocessing";

export default function PostFX() {
  return (
    <EffectComposer multisampling={0} enableNormalPass>
      <N8AO
        aoRadius={0.4}
        intensity={1.1}
        distanceFalloff={1}
        quality="performance"
        halfRes
      />
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.72}
        luminanceSmoothing={0.2}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.28} darkness={0.55} />
    </EffectComposer>
  );
}
