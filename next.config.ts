import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 defaults `qualities` to [75] and silently coerces any other
    // `quality` prop to the nearest allowed value. The hero render is the
    // one asset where compression artifacts are actually visible, so 90 is
    // opted in explicitly here.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        // Angkasa's own WordPress media library — the source the official
        // site serves project photography from. It publishes URLs as http://,
        // which browsers block as mixed content, so URLs are rewritten to
        // https (verified serving correctly) before reaching next/image.
        protocol: "https",
        hostname: "cms.angkasaarchitects.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
