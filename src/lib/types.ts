export interface Service {
  slug: string;
  name: string;
  description: string;
  detail: string;
}

export type ProjectCategory =
  | "Rumah Tinggal"
  | "Perumahan"
  | "Komersial"
  | "Bangunan Publik"
  | "Villa & Resort";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  location: string;
  year?: number;
  summary: string;
  description: string;
  imageSeed: string;
  gallerySeeds: string[];
}

export interface Founder {
  name: string;
  role: string;
  bio: string;
  imageSeed: string;
}

export interface Stat {
  value: string;
  label: string;
}
