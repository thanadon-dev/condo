import type { MetadataRoute } from "next";
import { listProperties, listArticles, listAreas } from "@/lib/queries";
import { absolute } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    { url: absolute("/"), lastModified: now, priority: 1 },
    { url: absolute("/properties"), lastModified: now, priority: 0.9 },
    { url: absolute("/journal"), lastModified: now, priority: 0.7 },
    { url: absolute("/about"), lastModified: now, priority: 0.6 },
    { url: absolute("/contact"), lastModified: now, priority: 0.5 },
  ];

  const props = listProperties().map((p) => ({
    url: absolute(`/property/${p.slug}`),
    lastModified: new Date(p.updated_at),
    priority: 0.8,
  }));

  const areas = listAreas().map((a) => ({
    url: absolute(`/area/${a.slug}`),
    lastModified: now,
    priority: 0.7,
  }));

  const arts = listArticles().map((a) => ({
    url: absolute(`/journal/${a.slug}`),
    lastModified: new Date(a.published_on),
    priority: 0.6,
  }));

  return [...statics, ...props, ...areas, ...arts];
}
