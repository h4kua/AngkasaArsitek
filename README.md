# Angkasa Architects — cinematic scroll hero

A working v1 of the 7-scene scroll-driven hero: Next.js 16 (App Router) +
TypeScript + Tailwind v4 + React Three Fiber + GSAP/ScrollTrigger + Lenis.
`npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass clean as of
this build.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build — needs normal internet access for
                 # next/font/google to fetch Syne + Inter at build time
```

## Visual verification — what was and wasn't possible

I tried to get an actual screenshot of the running scene before writing more
code on top of it, on the theory that polishing an unseen composition risks
wasted work. That failed for reasons worth recording:

- `chromium-browser` and `firefox` are both apt packages on Ubuntu 24.04,
  but both are transitional stubs that shell out to `snap install` — and
  this sandbox has no working snapd, so neither produces a real binary.
- Playwright's own Chromium download is blocked outright by this sandbox's
  network allowlist (`cdn.playwright.dev` is not on it).

So there is **no visual confirmation that the composition, framing, or
material look actually reads well** — only that the code runs and the
math is sound (see below). Treat the visual quality as unverified until
you run `npm run dev` and look at it yourself.

What I could do instead: `npm run validate:camera` runs a headless,
non-visual sanity check of the camera spline against the placeholder
volumes' bounding boxes — confirms the camera never clips into geometry,
never dips underground, the path has no discontinuous jumps, and the
look-at direction never degenerates. It also reports the villa's on-screen
scale at the final frame (currently ~45% of frame height, ~64% of frame
width at 32° FOV) so you have *some* numeric handle on framing before
looking at it. This catches logic bugs, not aesthetic ones — it cannot
tell you whether the shot looks good.

## What's real vs. placeholder

**Real:** the scroll-progress engine, camera rig, sky/atmosphere, ground +
instanced/wind-animated trees, reflective water, the wireframe→solid
material transition system, interior window lighting, post-processing
(AO/bloom/vignette), and the reduced-motion / low-tier fallback path. All of
it runs end-to-end today at `/`.

**Placeholder:** `components/hero/ArchitectureSequence.tsx` is a generic
"modern tropical villa" built from primitives — two boxes and a roof slab —
standing in for the real Angkasa building. **No reference photo or 3D model
was attached to the brief**, and the brief's final frame is defined by that
photo, so there was nothing to match yet. This file, and the camera
keyframes in `constants.ts`, are what get replaced once you have:

1. The reference photo (defines final materials, proportions, camera
   framing, composition).
2. Ideally a GLB/GLTF export of the actual design from whatever CAD/BIM
   tool produced it. Without one, the villa stays primitive-built —
   procedural code cannot infer real massing from a photo.

The scroll engine, camera spline, and crossfade technique underneath the
placeholder do not need to change when you swap the geometry.

## Deliberate substitutions (and why)

The original brief asked for some techniques that don't hold up under
"60fps desktop, 45fps mobile" simultaneously, or that need assets that
don't exist yet. Substituted, not silently dropped:

| Brief asked for | Shipped instead | Why |
|---|---|---|
| Volumetric clouds, atmospheric scattering | drei `<Sky>` (real Preetham-model scattering) + drei `<Clouds>`/`<Cloud>` (billboarded, not ray-marched) | Sky scattering is cheap and genuinely physically-based. True volumetric clouds are not — ray-marched volumetrics at this fidelity commonly cost several ms/frame alone, which breaks the mobile budget outright. |
| SSR water reflections | `MeshReflectorMaterial` (blurred planar reflection) | SSR reads back the frame buffer every frame; planar reflection is a fraction of the cost and, on a mostly-flat water plane, looks nearly identical. |
| Contact shadows + AO + soft shadows as three separate systems | PCF soft shadows + `N8AO` (fast SSAO variant) | Real AO, just the modern cheap kind instead of the old expensive kind. |
| GSAP `pin: true` for the sticky hero | CSS `position: sticky` + ScrollTrigger for progress only | Avoids known pin/Lenis transform conflicts; sticky is simpler and just as pinned. |
| Theatre.js, Leva | Nothing (GSAP timeline drives everything directly) | Both are tuning/authoring tools for iterating on an animation by hand. For a fixed, code-defined timeline they're overhead, not capability. Leva is trivial to bolt on later as a dev-only panel if you'd rather hand-tune values than edit `constants.ts`. |

## Accessibility

The brief said "scroll controls everything" and separately "ensure
accessibility" without reconciling the two — scroll-jacked hero sections
are a known problem for keyboard users, screen readers, and motion-sensitive
users. What's implemented:

- A "Skip intro animation" link, visible on focus, that jumps straight to
  `#site-content`.
- The Canvas is `aria-hidden`; all real heading/nav copy lives in
  `HeroOverlay` as normal DOM text, not baked into WebGL.
- `prefers-reduced-motion` and a conservative low-tier-mobile heuristic
  (narrow viewport + coarse pointer + ≤4 cores) skip the Canvas entirely
  and render a static gradient instead — checked via `useSyncExternalStore`
  so it also reacts live if the OS setting changes mid-session.
- Visible focus rings everywhere (`:focus-visible` in `globals.css`).

## Known gaps / next steps

- **No audio.** The brief mentions "soft ambient sound" — that needs a
  licensed asset, which wasn't provided and can't be fabricated here.
- **No real device perf pass.** The `useDeviceTier` heuristic is a
  reasonable guess, not a measurement. Test on an actual mid-tier Android
  phone and tune the threshold.
- **Copy is placeholder.** The overlay headline and the post-hero section
  in `app/page.tsx` are stand-ins, flagged inline.
- **HDRI.** Lighting currently comes from the Sky's directional light plus
  a hemisphere fill, not a real environment map. Fine for now; add a
  bespoke HDRI once the real material palette is locked in, for closer
  brand-matched reflections on the glass/concrete.
