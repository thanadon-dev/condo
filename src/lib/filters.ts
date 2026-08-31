import type { Filters, Sort } from "./queries";

export const SORTS: { value: Sort; label: string }[] = [
  { value: "new", label: "ล่าสุด" },
  { value: "price-asc", label: "ค่าเช่าน้อย → มาก" },
  { value: "price-desc", label: "ค่าเช่ามาก → น้อย" },
  { value: "area-desc", label: "พื้นที่มากสุด" },
];

const SORT_VALUES = new Set(SORTS.map((s) => s.value));

export type RawParams = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined): string {
  const s = Array.isArray(v) ? v[0] : v;
  return (s ?? "").trim().slice(0, 120);
}

function num(v: string | string[] | undefined): number | null {
  const s = str(v);
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n) || n < 0 || n > 10_000_000) return null;
  return Math.floor(n);
}

export function parseFilters(sp: RawParams): Filters {
  const sortRaw = str(sp.sort) as Sort;
  let min = num(sp.min);
  let max = num(sp.max);
  if (min !== null && max !== null && min > max) [min, max] = [max, min];

  return {
    q: str(sp.q),
    cat: str(sp.cat),
    type: str(sp.type),
    min,
    max,
    beds: num(sp.beds),
    sort: SORT_VALUES.has(sortRaw) ? sortRaw : "new",
  };
}

export function isFiltered(f: Filters): boolean {
  return Boolean(
    f.q || f.cat || f.type || f.min !== null || f.max !== null || f.beds !== null,
  );
}

export function filtersToQuery(f: Partial<Filters>): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.cat) p.set("cat", f.cat);
  if (f.type) p.set("type", f.type);
  if (f.min != null) p.set("min", String(f.min));
  if (f.max != null) p.set("max", String(f.max));
  if (f.beds != null) p.set("beds", String(f.beds));
  if (f.sort && f.sort !== "new") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function describeFilters(f: Filters): string {
  const bits: string[] = [];
  if (f.cat) bits.push(f.cat);
  if (f.type) bits.push(f.type);
  if (f.beds !== null) bits.push(`${f.beds}+ ห้องนอน`);
  if (f.q) bits.push(`คำค้น “${f.q}”`);
  return bits.join(" · ");
}
