/**
 * Mirrors Angkasa's photography from the studio CMS into public/cms.
 *
 * Why images are vendored rather than hotlinked: cms.angkasaarchitects.com is
 * intermittently slow (a 105 KB file was measured at 8.9s once, then 1.2s
 * minutes later), and Next's image optimizer has a fixed 7s upstream fetch
 * timeout that is not configurable in Next 16. A slow response therefore
 * surfaced the "image unavailable" placeholder to whoever hit a page first.
 *
 * Run after changing image URLs in src/lib/data.ts, or to pick up new
 * photography the studio has published:
 *
 *   node scripts/sync-cms-images.mjs
 *
 * Existing files are left alone, so re-running is cheap. Pass --force to
 * re-download everything.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "src/lib/data.ts");
const OUT_ROOT = path.join(ROOT, "public/cms");
const UPSTREAM = "https://cms.angkasaarchitects.com/wp-content/uploads";

const force = process.argv.includes("--force");

const data = fs.readFileSync(DATA, "utf8");
const paths = [
  ...new Set([...data.matchAll(/\$\{CMS\}(\/[^`]+)`/g)].map((m) => m[1])),
];

if (paths.length === 0) {
  console.error("No ${CMS}/... image paths found in src/lib/data.ts — aborting.");
  process.exit(1);
}

console.log(`${paths.length} image paths referenced in data.ts`);

let downloaded = 0;
let skipped = 0;
let bytes = 0;
const failed = [];

for (const rel of paths) {
  const dest = path.join(OUT_ROOT, rel);

  if (!force && fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    bytes += fs.statSync(dest).size;
    skipped++;
    continue;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });

  let saved = false;
  // The upstream host is unreliable rather than broken, so retry before
  // treating a path as genuinely missing.
  for (let attempt = 1; attempt <= 3 && !saved; attempt++) {
    try {
      const res = await fetch(UPSTREAM + rel, {
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0) throw new Error("empty body");
      fs.writeFileSync(dest, buf);
      bytes += buf.length;
      downloaded++;
      saved = true;
    } catch (err) {
      if (attempt === 3) failed.push({ rel, why: err.message });
    }
  }
}

console.log(`downloaded: ${downloaded}, already present: ${skipped}`);
console.log(`total on disk: ${(bytes / 1024 / 1024).toFixed(1)} MB`);

if (failed.length) {
  console.error(`\n${failed.length} failed after 3 attempts:`);
  failed.forEach((f) => console.error(`  ${f.rel} — ${f.why}`));
  process.exit(1);
}
