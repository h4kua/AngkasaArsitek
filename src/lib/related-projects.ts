import type { Project } from "./types";

// Directional qualifiers are common across unrelated cities ("South Jakarta"
// vs "Serpong, South Tangerang") and would otherwise register as a region
// match on "south" alone -- excluded so only real place names count.
const DIRECTIONAL_WORDS = new Set(["north", "south", "east", "west"]);

function regionTokens(location: string): Set<string> {
  return new Set(
    location
      .toLowerCase()
      .split(/[,\s]+/)
      .filter((word) => word.length > 3 && !DIRECTIONAL_WORDS.has(word)),
  );
}

/**
 * True if the two locations share a real place name, e.g. "PIK 2, North
 * Jakarta" and "Pondok Indah, Jakarta" both mention "jakarta" even though
 * the strings aren't equal.
 */
function sameRegion(a: string, b: string): boolean {
  const tokensA = regionTokens(a);
  for (const token of regionTokens(b)) {
    if (tokensA.has(token)) return true;
  }
  return false;
}

/**
 * Ranks every other project against `current` and returns the closest
 * matches. Priority: same category, then same region, then officially
 * documented projects (fuller case studies than the Instagram-sourced
 * records) over undocumented ones, with recency as the final tiebreak.
 * Never returns `current` itself.
 */
export function getRelatedProjects(
  current: Project,
  all: Project[],
  count = 3,
): Project[] {
  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 4;
      if (sameRegion(p.location, current.location)) score += 2;
      if (p.source === "official") score += 1;
      return { project: p, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.project.year ?? 0) - (a.project.year ?? 0);
    })
    .slice(0, count)
    .map((entry) => entry.project);
}
