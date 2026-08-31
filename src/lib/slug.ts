const RE_STRIP = /[^a-z0-9\s-]/g;

import { romanize, hasThai } from "./romanize";

export function slugify(input: string): string {
  const base = hasThai(String(input || ""))
    ? romanize(String(input || ""))
    : String(input || "");

  return base
    .toLowerCase()
    .trim()
    .replace(RE_STRIP, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

export function uniqueSlug(input: string, taken: Set<string>): string {
  const base = slugify(input) || "item";
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
