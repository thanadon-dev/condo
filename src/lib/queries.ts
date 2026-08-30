import { all, one } from "./db";

export type Property = {
  id: number;
  slug: string;
  code: string;
  title: string;
  cat: string;
  type: string;
  district: string;
  location: string;
  lat: number | null;
  lng: number | null;
  price: number;
  beds: number;
  baths: number;
  area: number;
  floor: string;
  year: string;
  park: string;
  descr: string;
  descr2: string;
  amenities: string;
  views: number;
  published: number;
  created_at: string;
  updated_at: string;
};

export type Area = {
  id: number;
  slug: string;
  name: string;
  query: string;
  cover: string;
  sort: number;
};

export type Deal = {
  id: number;
  slug: string;
  closed_on: string;
  title: string;
  cat: string;
  location: string;
  value: string;
  imgs: number;
  body: string;
  published: number;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  tag: string;
  published_on: string;
  read_time: string;
  lead: string;
  body: string;
  published: number;
};

export function listProperties(): Property[] {
  return all<Property>(
    "SELECT * FROM properties WHERE published = 1 ORDER BY id",
  );
}

export function propertyBySlug(slug: string): Property | null {
  return one<Property>(
    "SELECT * FROM properties WHERE slug = ? AND published = 1",
    slug,
  );
}

export function listAreas(): Area[] {
  return all<Area>("SELECT * FROM areas ORDER BY sort, id");
}

export function listDeals(): Deal[] {
  return all<Deal>(
    "SELECT * FROM deals WHERE published = 1 ORDER BY closed_on DESC",
  );
}

export function listArticles(): Article[] {
  return all<Article>(
    "SELECT * FROM articles WHERE published = 1 ORDER BY published_on DESC",
  );
}

export function articleBySlug(slug: string): Article | null {
  return one<Article>(
    "SELECT * FROM articles WHERE slug = ? AND published = 1",
    slug,
  );
}

export function amenitiesOf(p: Property): string[] {
  try {
    const v = JSON.parse(p.amenities);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}
