import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 defaults `qualities` to [75] and silently coerces any other
    // `quality` prop to the nearest allowed value. The hero render is the
    // one asset where compression artifacts are actually visible, so 90 is
    // opted in explicitly here.
    qualities: [75, 90],
  },
};

export default nextConfig;
