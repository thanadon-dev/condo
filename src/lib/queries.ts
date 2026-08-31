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
  map_url: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  floor: string;
  building: string;
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
  /** ธัมบ์เนล 640px (ว่าง = รูปเก่าที่ยังไม่ได้ผ่านระบบอัปโหลด ให้ fallback ไป url) */
  thumb_url: string;
  width: number;
  height: number;
};

export type Poi = {
  id: number;
  property_id: number;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distance_m: number;
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

/** slug เดิมที่ถูกเปลี่ยนแล้ว -> slug ปัจจุบัน (ใช้ 301 redirect) */
export function aliasTarget(kind: string, oldSlug: string): string | null {
  const r = one<{ new_slug: string }>(
    "SELECT new_slug FROM slug_aliases WHERE kind = ? AND old_slug = ?",
    kind,
    oldSlug,
  );
  return r?.new_slug ?? null;
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

export function dealBySlug(slug: string): Deal | null {
  return one<Deal>(
    "SELECT * FROM deals WHERE slug = ? AND published = 1",
    slug,
  );
}

export function dealCats(): { value: string; count: number }[] {
  return all<{ value: string; count: number }>(
    "SELECT cat AS value, COUNT(*) AS count FROM deals WHERE published = 1 GROUP BY cat ORDER BY count DESC",
  );
}

export function articleTags(): { value: string; count: number }[] {
  return all<{ value: string; count: number }>(
    "SELECT tag AS value, COUNT(*) AS count FROM articles WHERE published = 1 AND tag != '' GROUP BY tag ORDER BY count DESC",
  );
}

export function relatedArticles(a: Article, limit = 2): Article[] {
  const sameTag = all<Article>(
    "SELECT * FROM articles WHERE published = 1 AND id != ? AND tag = ? ORDER BY published_on DESC LIMIT ?",
    a.id,
    a.tag,
    limit,
  );
  if (sameTag.length >= limit) return sameTag;
  const seen = new Set([a.id, ...sameTag.map((x) => x.id)]);
  const rest = all<Article>(
    "SELECT * FROM articles WHERE published = 1 ORDER BY published_on DESC LIMIT 10",
  ).filter((x) => !seen.has(x.id));
  return [...sameTag, ...rest].slice(0, limit);
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

export function poisOf(propertyId: number): Poi[] {
  return all<Poi>(
    "SELECT * FROM property_pois WHERE property_id = ? ORDER BY distance_m, id",
    propertyId,
  );
}

const EARTH_KM = 6371;

export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(s)));
}

export function nearbyProperties(
  p: Property,
  radiusKm = 4,
  limit = 3,
): (Property & { distanceKm: number })[] {
  if (p.lat === null || p.lng === null) return [];

  const dLat = radiusKm / 111;
  const dLng = radiusKm / (111 * Math.cos((p.lat * Math.PI) / 180) || 1);

  const rows = all<Property>(
    `SELECT * FROM properties
     WHERE published = 1 AND id != ?
       AND lat IS NOT NULL AND lng IS NOT NULL
       AND lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?`,
    p.id,
    p.lat - dLat,
    p.lat + dLat,
    p.lng - dLng,
    p.lng + dLng,
  );

  return rows
    .map((r) => ({
      ...r,
      distanceKm: haversineKm(p.lat!, p.lng!, r.lat!, r.lng!),
    }))
    .filter((r) => r.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export type Suggested = Property & {
  distanceKm: number | null;
  /** เหตุผลที่แนะนำ เช่น "ทำเลเดียวกัน" — เอาไปโชว์บนการ์ด */
  reason: string;
};

/**
 * "รายการที่คุณอาจจะชอบ" — ให้คะแนนจากหลายด้าน ไม่พึ่งพิกัดอย่างเดียว
 * เพราะทรัพย์ที่ยังไม่ได้ใส่ลิงก์แผนที่จะไม่มี lat/lng
 *
 * คะแนน: ทำเลเดียวกัน 50 · ใกล้กันเชิงพิกัด 0-40 · ราคาใกล้เคียง 0-30
 *        ประเภทเดียวกัน 12 · หมวดเดียวกัน 8 · ห้องนอนเท่ากัน 6
 */
export function suggestedProperties(p: Property, limit = 3): Suggested[] {
  const rows = all<Property>(
    "SELECT * FROM properties WHERE published = 1 AND id != ?",
    p.id,
  );
  if (!rows.length) return [];

  const sameDistrict = (a: string, b: string) => {
    const x = (a || "").trim();
    const y = (b || "").trim();
    if (!x || !y) return false;
    return x === y || x.includes(y) || y.includes(x);
  };

  const scored = rows.map((r) => {
    let score = 0;
    const reasons: string[] = [];

    const distanceKm =
      p.lat !== null && p.lng !== null && r.lat !== null && r.lng !== null
        ? haversineKm(p.lat, p.lng, r.lat, r.lng)
        : null;

    if (distanceKm !== null && distanceKm <= 8) {
      score += Math.round(40 * (1 - distanceKm / 8));
      reasons.push(
        distanceKm < 1
          ? `ห่าง ${Math.round(distanceKm * 1000)} ม.`
          : `ห่าง ${distanceKm.toFixed(1)} กม.`,
      );
    }

    if (sameDistrict(p.district, r.district)) {
      score += 50;
      if (!reasons.length) reasons.push(`ทำเล${r.district}`);
    }

    // ราคาต่างกันไม่เกิน 40% ถือว่าอยู่ในงบเดียวกัน
    if (p.price > 0 && r.price > 0) {
      const diff = Math.abs(r.price - p.price) / p.price;
      if (diff <= 0.4) {
        score += Math.round(30 * (1 - diff / 0.4));
        if (diff <= 0.15) reasons.push("ค่าเช่าใกล้เคียง");
      }
    }

    if (p.type === r.type) score += 12;
    if (p.cat === r.cat) score += 8;
    if (p.beds === r.beds) {
      score += 6;
      if (reasons.length < 2) reasons.push(`${r.beds} ห้องนอน`);
    }

    return {
      ...r,
      distanceKm,
      score,
      reason: reasons.slice(0, 2).join(" · "),
    };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.price - b.price)
    .slice(0, limit)
    .map(({ score, ...rest }) => rest);
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
