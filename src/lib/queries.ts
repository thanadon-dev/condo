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

export type PropertyImage = {
  id: number;
  property_id: number;
  url: string;
  alt: string;
  sort: number;
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

export function imagesOf(propertyId: number): PropertyImage[] {
  return all<PropertyImage>(
    "SELECT * FROM property_images WHERE property_id = ? ORDER BY sort, id",
    propertyId,
  );
}

export function coverMap(ids: number[]): Record<number, PropertyImage> {
  if (ids.length === 0) return {};
  const marks = ids.map(() => "?").join(",");
  const rows = all<PropertyImage>(
    `SELECT * FROM property_images WHERE property_id IN (${marks}) ORDER BY property_id, sort, id`,
    ...ids,
  );
  const out: Record<number, PropertyImage> = {};
  for (const r of rows) if (!out[r.property_id]) out[r.property_id] = r;
  return out;
}

export function amenitiesOf(p: Property): string[] {
  try {
    const v = JSON.parse(p.amenities);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export type Sort = "new" | "price-asc" | "price-desc" | "area-desc";

export type Filters = {
  q: string;
  cat: string;
  type: string;
  min: number | null;
  max: number | null;
  beds: number | null;
  sort: Sort;
};

const SORT_SQL: Record<Sort, string> = {
  new: "id DESC",
  "price-asc": "price ASC",
  "price-desc": "price DESC",
  "area-desc": "area DESC",
};

export function searchProperties(f: Filters): Property[] {
  const where: string[] = ["published = 1"];
  const args: (string | number)[] = [];

  if (f.q) {
    where.push("(title LIKE ? OR location LIKE ? OR district LIKE ?)");
    const like = `%${f.q}%`;
    args.push(like, like, like);
  }
  if (f.cat) {
    where.push("cat = ?");
    args.push(f.cat);
  }
  if (f.type) {
    where.push("type = ?");
    args.push(f.type);
  }
  if (f.min !== null) {
    where.push("price >= ?");
    args.push(f.min);
  }
  if (f.max !== null) {
    where.push("price <= ?");
    args.push(f.max);
  }
  if (f.beds !== null) {
    where.push("beds >= ?");
    args.push(f.beds);
  }

  const sql = `SELECT * FROM properties WHERE ${where.join(" AND ")} ORDER BY ${
    SORT_SQL[f.sort] || SORT_SQL.new
  }`;
  return all<Property>(sql, ...args);
}

export function propertyFacets(): {
  cats: { value: string; count: number }[];
  types: { value: string; count: number }[];
  priceMin: number;
  priceMax: number;
  total: number;
} {
  const cats = all<{ value: string; count: number }>(
    "SELECT cat AS value, COUNT(*) AS count FROM properties WHERE published = 1 GROUP BY cat ORDER BY count DESC",
  );
  const types = all<{ value: string; count: number }>(
    "SELECT type AS value, COUNT(*) AS count FROM properties WHERE published = 1 GROUP BY type ORDER BY count DESC",
  );
  const r =
    one<{ lo: number; hi: number; n: number }>(
      "SELECT MIN(price) AS lo, MAX(price) AS hi, COUNT(*) AS n FROM properties WHERE published = 1",
    ) || { lo: 0, hi: 0, n: 0 };

  return {
    cats,
    types,
    priceMin: r.lo || 0,
    priceMax: r.hi || 0,
    total: r.n || 0,
  };
}

export function areasWithCount(): (Area & { count: number })[] {
  return listAreas().map((a) => {
    const q = a.query.trim();
    const row = one<{ n: number }>(
      "SELECT COUNT(*) AS n FROM properties WHERE published = 1 AND (district LIKE ? OR location LIKE ?)",
      `%${q}%`,
      `%${q}%`,
    );
    return { ...a, count: row?.n ?? 0 };
  });
}

export function propertiesInArea(a: Area): Property[] {
  const q = `%${a.query.trim()}%`;
  return all<Property>(
    "SELECT * FROM properties WHERE published = 1 AND (district LIKE ? OR location LIKE ?) ORDER BY price DESC",
    q,
    q,
  );
}

export function siteStats(): { value: string; label: string; note: string }[] {
  const props =
    one<{ n: number; avgArea: number }>(
      "SELECT COUNT(*) AS n, AVG(area) AS avgArea FROM properties WHERE published = 1",
    ) ?? { n: 0, avgArea: 0 };
  const deals =
    one<{ n: number; oldest: string }>(
      "SELECT COUNT(*) AS n, MIN(closed_on) AS oldest FROM deals WHERE published = 1",
    ) ?? { n: 0, oldest: "" };
  const districts =
    one<{ n: number }>(
      "SELECT COUNT(DISTINCT district) AS n FROM properties WHERE published = 1",
    ) ?? { n: 0 };

  return [
    {
      value: String(props.n),
      label: "ทรัพย์ในระบบ",
      note: `พื้นที่เฉลี่ย ${Math.round(props.avgArea || 0)} ตร.ม.`,
    },
    {
      value: String(deals.n),
      label: "ดีลที่ปิดแล้ว",
      note: "ทั้งปล่อยเช่าและขายขาด",
    },
    {
      value: String(districts.n),
      label: "ทำเลที่ดูแล",
      note: "กรุงเทพฯ และปริมณฑล",
    },
  ];
}

export function propertiesByIds(ids: number[]): Property[] {
  if (ids.length === 0) return [];
  const marks = ids.map(() => "?").join(",");
  return all<Property>(
    `SELECT * FROM properties WHERE published = 1 AND id IN (${marks})`,
    ...ids,
  );
}
