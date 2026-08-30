const RE_STRIP = /[^\p{L}\p{M}\p{N}\s-]/gu;

export function slugify(input: string): string {
  return String(input || "")
    .trim()
    .replace(RE_STRIP, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function uniqueSlug(base: string, taken: Set<string>): string {
  const s = slugify(base) || "item";
  if (!taken.has(s)) {
    taken.add(s);
    return s;
  }
  let n = 2;
  while (taken.has(`${s}-${n}`)) n += 1;
  const out = `${s}-${n}`;
  taken.add(out);
  return out;
}
