import type { MetadataRoute } from "next";
import {
  listProperties,
  listArticles,
  listAreas,
  listDeals,
  coverMap,
} from "@/lib/queries";
import { absolute } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const props = listProperties();
  const covers = coverMap(props.map((p) => p.id));

  const staticPages: MetadataRoute.Sitemap = [
    { url: absolute("/"), lastModified: now, priority: 1, changeFrequency: "daily" },
    {
      url: absolute("/properties"),
      lastModified: now,
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      url: absolute("/journal"),
      lastModified: now,
      priority: 0.7,
      changeFrequency: "weekly",
    },
    {
      url: absolute("/about"),
      lastModified: now,
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      url: absolute("/contact"),
      lastModified: now,
      priority: 0.6,
      changeFrequency: "monthly",
    },
  ];

  // หน้าทรัพย์: แนบรูปปกเข้า sitemap ให้ Google Images เก็บได้
  const propertyPages: MetadataRoute.Sitemap = props.map((p) => {
    const cover = covers[p.id];
    return {
      url: absolute(`/property/${p.slug}`),
      lastModified: p.updated_at ? new Date(p.updated_at) : now,
      priority: 0.8,
      changeFrequency: "weekly" as const,
      ...(cover ? { images: [absolute(cover.url)] } : {}),
    };
  });

  const areaPages: MetadataRoute.Sitemap = listAreas().map((a) => ({
    url: absolute(`/area/${a.slug}`),
    lastModified: now,
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  const articlePages: MetadataRoute.Sitemap = listArticles().map((a) => ({
    url: absolute(`/journal/${a.slug}`),
    lastModified: a.published_on ? new Date(a.published_on) : now,
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  const dealPages: MetadataRoute.Sitemap = listDeals().map((d) => ({
    url: absolute(`/deal/${d.slug}`),
    lastModified: d.closed_on ? new Date(d.closed_on) : now,
    priority: 0.5,
    changeFrequency: "monthly",
  }));

  return [
    ...staticPages,
    ...propertyPages,
    ...areaPages,
    ...articlePages,
    ...dealPages,
  ];
}
