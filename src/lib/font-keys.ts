/**
 * ไฟล์บริสุทธิ์ — key ฟอนต์ + ชื่อ CSS variable เท่านั้น
 * ห้าม import next/font ที่นี่ เพราะ themes.ts (ซึ่ง client component ใช้) import ไฟล์นี้
 */

export const FONT_VARS = {
  noto: "--f-noto",
  cormorant: "--f-cormorant",
  sarabun: "--f-sarabun",
  plexLooped: "--f-plex-looped",
  bricolage: "--f-bricolage",
  trirong: "--f-trirong",
  plexThai: "--f-plex-thai",
  marcellus: "--f-marcellus",
  mitr: "--f-mitr",
  prompt: "--f-prompt",
  anuphan: "--f-anuphan",
  plexMono: "--f-plex-mono",
  kanit: "--f-kanit",
  bai: "--f-bai",
  maitree: "--f-maitree",
  athiti: "--f-athiti",
  k2d: "--f-k2d",
  niramit: "--f-niramit",
  krub: "--f-krub",
  fahkwang: "--f-fahkwang",
  chakra: "--f-chakra",
} as const;

export type FontKey = keyof typeof FONT_VARS;

/** ฟอนต์เซริฟ — ใช้เลือก generic fallback */
const SERIF: FontKey[] = ["cormorant", "trirong", "marcellus", "maitree"];

/**
 * font-family stack ของฟอนต์ตัวหนึ่ง
 * ต่อท้ายด้วย noto เสมอ เพราะฟอนต์ latin-only (Cormorant, Marcellus, Bricolage)
 * ไม่มีอักษรไทย ถ้าไม่ต่อจะกลายเป็นสี่เหลี่ยม
 */
export function fontStack(key: FontKey): string {
  const generic =
    key === "plexMono" ? "monospace" : SERIF.includes(key) ? "Georgia, serif" : "sans-serif";
  return `var(${FONT_VARS[key]}), var(--f-noto), ${generic}`;
}
