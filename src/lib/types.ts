export interface Service {
  slug: string;
  name: string;
  description: string;
  detail: string;
  /** Concrete outputs the client receives for this service. */
  deliverables: string[];
}

/** One stage of the studio's working method, shown on /layanan. */
export interface ProcessStep {
  name: string;
  description: string;
  /** What physically changes hands at the end of this stage. */
  output: string;
}

export interface Faq {
  question: string;
  answer: string;
}

/**
 * One entry in the studio timeline. Every entry is anchored to something
 * already recorded elsewhere in this data file -- a founder's bio, the
 * founding year, the Inara Award, a city list, or a project's `year` and
 * `location`. Nothing here is narrative invention.
 */
export interface Milestone {
  year: string;
  title: string;
  text: string;
}

/**
 * Taxonomy mirrors the project types published on angkasaarchitects.com.
 * "Villa & Resort" is retained for the Instagram-sourced entries that do not
 * appear on the official site.
 */
export type ProjectCategory =
  | "House"
  | "Housing"
  | "Commercial"
  | "Interior"
  | "Public Building"
  | "Hospitality"
  | "Villa & Resort";

export type ProjectStatus = "completed" | "ongoing" | "design";

/** Where a project record's facts came from, so unverified rows stay visible. */
export type ProjectSource = "official" | "instagram";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  location: string;
  year?: number;
  status?: ProjectStatus;
  /** Site area in m², as published. */
  landSize?: number;
  /** Gross floor area in m², as published. */
  buildingSize?: number;
  summary: string;
  description: string;
  architectsInCharge?: string[];
  /**
   * Named design moves. Only populated for records whose `description` comes
   * from the official site, so no bullet restates invented prose.
   */
  strategies?: string[];
  /**
   * `official` records mirror angkasaarchitects.com verbatim. `instagram`
   * records were assembled from social posts and are NOT verified against the
   * official site -- their prose is unsourced and pending client review.
   */
  source: ProjectSource;
  /** Absolute https URLs from Angkasa's own media library. */
  images: string[];
  /** Legacy picsum seed, used only where no real photography exists yet. */
  imageSeed?: string;
}

export interface Founder {
  name: string;
  role: string;
  bio: string;
  imageSeed: string;
  instagram: string;
}

export interface TeamMember {
  name: string;
  role: string;
}

export interface Stat {
  value: string;
  label: string;
}
