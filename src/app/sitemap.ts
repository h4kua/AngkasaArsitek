import type { MetadataRoute } from "next";
import { projects } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/tentang`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/layanan`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/karya`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/kontak`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/karya/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
