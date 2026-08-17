/**
 * Canonical production origin, used for metadataBase, canonical URLs, the
 * sitemap and JSON-LD. Override with NEXT_PUBLIC_SITE_URL at deploy time if
 * this site is served from a different domain than the studio's official
 * one -- angkasaarchitects.com is the real, already-published domain this
 * rebuild mirrors content from, so it is the only defensible default.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://angkasaarchitects.com";
