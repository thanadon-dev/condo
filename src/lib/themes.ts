/**
 * นิยามธีม — ไฟล์บริสุทธิ์ ห้าม import db ที่นี่ (client component ใช้ไฟล์นี้ด้วย)
 *
 * ค่าทุกตัวถอดจาก mockup จริงใน design/themes-src/*.html ด้วยสคริปต์
 * ห้ามแก้ค่าสี/ฟอนต์เอง — ถ้าดีไซน์เปลี่ยน ให้ถอดจากไฟล์ต้นทางใหม่
 */
import { fontStack, type FontKey } from "./font-keys";

export type ThemeId =
  | "editorial"
  | "teal"
  | "luxury"
  | "warm"
  | "mono"
  | "photo"
  | "heritage"
  | "glass"
  | "minimal"
  | "night";

/** โครงการ์ดทรัพย์ — mockup ใช้ต่างกัน 5 แบบ */
export type CardShape =
  | "stack" // รูปบน ข้อความล่าง ไม่มีกรอบ (1a, 3a, 9a)
  | "framed" // มีกรอบ/พื้นการ์ด (2a, 5a, 10a)
  | "row" // รูปซ้าย ข้อความขวา มุมโค้ง (4a)
  | "overlay" // ราคาทับบนรูป (6a, 8a)
  | "center"; // จัดกลาง (7a)

/** ตำแหน่งราคาบนการ์ด */
export type PricePos = "onImage" | "belowTitle" | "footerRow";

export type Theme = {
  id: ThemeId;
  code: string; // รหัสอ้างอิงกับไฟล์ mockup (1a..10a)
  name: string; // ชื่อไทยที่โชว์ในหลังบ้าน
  desc: string; // คำอธิบายภาษาภาพ (จาก mockup)
  fonts: {
    /** key ของฟอนต์ใน src/lib/fonts.ts — โหลดทุกตัวที่ layout แต่ CSS var ชี้เฉพาะของธีมที่ใช้ */
    display: FontKey; // หัวเรื่องใหญ่
    body: FontKey; // เนื้อหา
    /** ฟอนต์หัวข้อเล็ก (kicker) ถ้า mockup ใช้คนละตัวกับ body */
    kicker?: FontKey;
    /** ฟอนต์ตัวเลข/โมโนสเปซ ถ้า mockup ใช้ */
    mono?: FontKey;
  };
  /** CSS custom properties ที่จะ inject ที่ <html> — ทุก component อ่านผ่านตัวแปรนี้ */
  vars: Record<string, string>;
  layout: {
    card: CardShape;
    price: PricePos;
    /** ทรัพย์ชิ้นแรกแสดงเป็นการ์ดใหญ่เต็มความกว้าง (6a) */
    featureFirst: boolean;
    /** ธีมพื้นมืด — ใช้เลือกโทน overlay/เงา และ colorScheme */
    dark: boolean;
    /** มุมโค้งหลัก (การ์ด/ปุ่ม) */
    radius: string;
    radiusPill: string;
    /** ตัวคั่นสเปคในการ์ด */
    sep: string;
    /** header จัดกลางแบบ 3 คอลัมน์ (7a) */
    centerNav: boolean;
    /** เงาการ์ด */
    cardShadow: string;
  };
};

export const THEMES: Theme[] = [
  {
    id: "editorial",
    code: "1a",
    name: "เอดิทอเรียล ขาว-ดำ",
    desc: "ตัวอักษรเซริฟ พื้นขาว เว้นวรรคเยอะ อ่านสบายแบบนิตยสาร",
    fonts: { display: "cormorant", body: "noto" },
    vars: {
      "--t-bg": "#ffffff",
      "--t-bg-2": "#f4f3f0",
      "--t-bg-3": "#f7f6f4",
      "--t-ink": "#141414",
      "--t-ink-2": "#3d3b38",
      "--t-muted": "#6b6862",
      "--t-dim": "#8a8783",
      "--t-faint": "#a8a5a0",
      "--t-line": "#dcdad5",
      "--t-line-2": "#ecece8",
      "--t-accent": "#141414",
      "--t-accent-ink": "#ffffff",
      "--t-card": "#ffffff",
      "--t-card-border": "transparent",
      "--t-header": "rgba(255,255,255,.92)",
      "--t-panel-bg": "#ffffff",
      "--t-footer": "#faf9f7",
      "--t-footer-ink": "#141414",
      "--t-footer-muted": "#6b6862",
      "--t-footer-line": "#ecece8",
      "--t-kicker-ls": "0.42em",
      "--t-kicker-color": "#8a8783",
      "--t-h1-size": "66px",
      "--t-h1-weight": "300",
      "--t-h1-lh": "1.08",
      "--t-h1-ls": "-0.01em",
      "--t-h2-size": "44px",
      "--t-h2-weight": "300",
      "--t-h3-size": "25px",
      "--t-h3-weight": "400",
    },
    layout: {
      card: "stack",
      price: "onImage",
      featureFirst: false,
      dark: false,
      radius: "0px",
      radiusPill: "0px",
      sep: "·",
      centerNav: false,
      cardShadow: "none",
    },
  },
  {
    id: "teal",
    code: "2a",
    name: "เขียวหัวเป็ด-ทองเหลือง",
    desc: "กรอบหนา 2px คอนทราสต์สูง ตัวอักษรโปสเตอร์",
    fonts: { display: "plexLooped", body: "sarabun", kicker: "bricolage" },
    vars: {
      "--t-bg": "#fffdf7",
      "--t-bg-2": "#f7f2e6",
      "--t-bg-3": "#f7f2e6",
      "--t-ink": "#0d3b3a",
      "--t-ink-2": "#0d3b3a",
      "--t-muted": "#5c7370",
      "--t-dim": "#5c7370",
      "--t-faint": "#8a6420",
      "--t-line": "#0d3b3a",
      "--t-line-2": "#e6dfd0",
      "--t-accent": "#c8963e",
      "--t-accent-ink": "#0d3b3a",
      "--t-card": "#fffdf7",
      "--t-card-border": "#0d3b3a",
      "--t-panel-bg": "#fffdf7",
      "--t-card-border-w": "2px",
      "--t-header": "#fffdf7",
      "--t-footer": "#082827",
      "--t-footer-ink": "#fffdf7",
      "--t-footer-muted": "rgba(255,253,247,.66)",
      "--t-footer-line": "rgba(255,253,247,.18)",
      "--t-kicker-ls": "0.28em",
      "--t-kicker-color": "#8a6420",
      "--t-h1-size": "58px",
      "--t-h1-weight": "600",
      "--t-h1-lh": "1.08",
      "--t-h1-ls": "-0.02em",
      "--t-h2-size": "52px",
      "--t-h2-weight": "600",
      "--t-h3-size": "21px",
      "--t-h3-weight": "500",
    },
    layout: {
      card: "framed",
      price: "onImage",
      featureFirst: false,
      dark: false,
      radius: "0px",
      radiusPill: "0px",
      sep: "◆",
      centerNav: false,
      cardShadow: "none",
    },
  },
  {
    id: "luxury",
    code: "3a",
    name: "ลักซ์ชัวรี ดำ-ทอง",
    desc: "พื้นมืด ตัวอักษรเซริฟไทย แอคเซนต์ทอง หรูสุขุม",
    fonts: { display: "trirong", body: "plexThai", kicker: "marcellus" },
    vars: {
      "--t-bg": "#14110f",
      "--t-bg-2": "#1c1815",
      "--t-bg-3": "#1c1815",
      "--t-ink": "#f7f3ec",
      "--t-ink-2": "#f2ede5",
      "--t-muted": "#a39b90",
      "--t-dim": "#8a7d6b",
      "--t-faint": "#6f665c",
      "--t-line": "rgba(201,168,106,.28)",
      "--t-line-2": "rgba(201,168,106,.18)",
      "--t-accent": "#c9a86a",
      "--t-accent-ink": "#14110f",
      "--t-card": "transparent",
      "--t-card-border": "transparent",
      "--t-header": "rgba(20,17,15,.92)",
      "--t-panel-bg": "#1c1815",
      "--t-footer": "#0f0d0b",
      "--t-footer-ink": "#f7f3ec",
      "--t-footer-muted": "#a39b90",
      "--t-footer-line": "rgba(201,168,106,.22)",
      "--t-kicker-ls": "0.42em",
      "--t-kicker-color": "#c9a86a",
      "--t-h1-size": "78px",
      "--t-h1-weight": "300",
      "--t-h1-lh": "1.14",
      "--t-h1-ls": "-0.01em",
      "--t-h2-size": "54px",
      "--t-h2-weight": "300",
      "--t-h3-size": "31px",
      "--t-h3-weight": "400",
    },
    layout: {
      card: "stack",
      price: "belowTitle",
      featureFirst: false,
      dark: true,
      radius: "0px",
      radiusPill: "0px",
      sep: "·",
      centerNav: false,
      cardShadow: "none",
    },
  },
  {
    id: "warm",
    code: "4a",
    name: "ดินเผา อบอุ่น",
    desc: "มุมโค้งมน เงานุ่ม การ์ดแนวนอน โทนครีม-อิฐ เป็นมิตร",
    fonts: { display: "mitr", body: "prompt" },
    vars: {
      "--t-bg": "#faf5ee",
      "--t-bg-2": "#f7efe6",
      "--t-bg-3": "#f4e7db",
      "--t-ink": "#3b2d24",
      "--t-ink-2": "#6b5647",
      "--t-muted": "#85705f",
      "--t-dim": "#85705f",
      "--t-faint": "#9c4123",
      "--t-line": "#e8d5c4",
      "--t-line-2": "#f4e7db",
      "--t-accent": "#b8542f",
      "--t-accent-ink": "#fff6ee",
      "--t-card": "#fffdf9",
      "--t-card-border": "transparent",
      "--t-header": "rgba(255,253,249,.92)",
      "--t-panel-bg": "#fffdf9",
      "--t-footer": "#3b2d24",
      "--t-footer-ink": "#fff6ee",
      "--t-footer-muted": "rgba(255,246,238,.7)",
      "--t-footer-line": "rgba(255,246,238,.16)",
      "--t-kicker-ls": "0.28em",
      "--t-kicker-color": "#9c4123",
      "--t-h1-size": "52px",
      "--t-h1-weight": "500",
      "--t-h1-lh": "1.24",
      "--t-h1-ls": "0",
      "--t-h2-size": "40px",
      "--t-h2-weight": "500",
      "--t-h3-size": "20px",
      "--t-h3-weight": "400",
    },
    layout: {
      card: "row",
      price: "onImage",
      featureFirst: false,
      dark: false,
      radius: "26px",
      radiusPill: "999px",
      sep: "·",
      centerNav: false,
      cardShadow: "0 12px 30px -20px rgba(90,60,40,.3)",
    },
  },
  {
    id: "mono",
    code: "5a",
    name: "โมโน/เทค เขียวสะท้อนแสง",
    desc: "เส้นคม ตัวเลขโมโนสเปซ แอคเซนต์เขียวนีออน ดูเป็นเครื่องมือ",
    fonts: { display: "anuphan", body: "anuphan", mono: "plexMono" },
    vars: {
      "--t-bg": "#f2f3f0",
      "--t-bg-2": "#e4e6e1",
      "--t-bg-3": "#ffffff",
      "--t-ink": "#15181c",
      "--t-ink-2": "#3f454a",
      "--t-muted": "#5c625a",
      "--t-dim": "#5c625a",
      "--t-faint": "#b4bab2",
      "--t-line": "#15181c",
      "--t-line-2": "#d5d7d2",
      "--t-accent": "#c2f53c",
      "--t-accent-ink": "#15181c",
      "--t-card": "#ffffff",
      "--t-card-border": "#15181c",
      "--t-panel-bg": "#ffffff",
      "--t-card-border-w": "1px",
      "--t-header": "#f2f3f0",
      "--t-footer": "#15181c",
      "--t-footer-ink": "#f2f3f0",
      "--t-footer-muted": "#b4bab2",
      "--t-footer-line": "rgba(242,243,240,.16)",
      "--t-kicker-ls": "0.24em",
      "--t-kicker-color": "#8a9114",
      "--t-h1-size": "60px",
      "--t-h1-weight": "600",
      "--t-h1-lh": "1.16",
      "--t-h1-ls": "-0.02em",
      "--t-h2-size": "44px",
      "--t-h2-weight": "600",
      "--t-h3-size": "19px",
      "--t-h3-weight": "600",
    },
    layout: {
      card: "framed",
      price: "footerRow",
      featureFirst: false,
      dark: false,
      radius: "0px",
      radiusPill: "0px",
      sep: "·",
      centerNav: false,
      cardShadow: "none",
    },
  },
  {
    id: "photo",
    code: "6a",
    name: "โฟโต้เฟิร์สต์ แดงชาด",
    desc: "รูปเต็มพื้นที่ ตัวหนังสือหนาตัวโต ทรัพย์ชิ้นแรกเป็นการ์ดใหญ่",
    fonts: { display: "kanit", body: "bai" },
    vars: {
      "--t-bg": "#fbfbf9",
      "--t-bg-2": "#e9e7e2",
      "--t-bg-3": "#e7e5e0",
      "--t-ink": "#101010",
      "--t-ink-2": "#3d3b38",
      "--t-muted": "#575551",
      "--t-dim": "#575551",
      "--t-faint": "#8a8783",
      "--t-line": "#dcdad5",
      "--t-line-2": "#e7e5e0",
      "--t-accent": "#c9280c",
      "--t-accent-ink": "#ffffff",
      "--t-card": "transparent",
      "--t-card-border": "transparent",
      "--t-header": "rgba(251,251,249,.94)",
      "--t-panel-bg": "#ffffff",
      "--t-footer": "#101010",
      "--t-footer-ink": "#ffffff",
      "--t-footer-muted": "rgba(255,255,255,.66)",
      "--t-footer-line": "rgba(255,255,255,.16)",
      "--t-kicker-ls": "0.24em",
      "--t-kicker-color": "#c9280c",
      "--t-h1-size": "82px",
      "--t-h1-weight": "700",
      "--t-h1-lh": "1.06",
      "--t-h1-ls": "-0.035em",
      "--t-h2-size": "52px",
      "--t-h2-weight": "700",
      "--t-h3-size": "22px",
      "--t-h3-weight": "600",
    },
    layout: {
      card: "overlay",
      price: "footerRow",
      featureFirst: true,
      dark: false,
      radius: "0px",
      radiusPill: "0px",
      sep: "·",
      centerNav: false,
      cardShadow: "none",
    },
  },
  {
    id: "heritage",
    code: "7a",
    name: "ไทยเฮอริเทจ คราม-ทอง",
    desc: "เมนูจัดกลาง เซริฟไทย โทนครามและทองเก่า สงบมีระดับ",
    fonts: { display: "maitree", body: "athiti" },
    vars: {
      "--t-bg": "#f6f2e9",
      "--t-bg-2": "#dfe4dc",
      "--t-bg-3": "#dfe9e2",
      "--t-ink": "#1f3350",
      "--t-ink-2": "#4a5a75",
      "--t-muted": "#4a5a75",
      "--t-dim": "#7d6230",
      "--t-faint": "#7d6230",
      "--t-line": "#b99a5b",
      "--t-line-2": "rgba(185,154,91,.34)",
      "--t-accent": "#b99a5b",
      "--t-accent-ink": "#1f3350",
      "--t-card": "transparent",
      "--t-card-border": "transparent",
      "--t-header": "rgba(246,242,233,.94)",
      "--t-panel-bg": "#ffffff",
      "--t-footer": "#1f3350",
      "--t-footer-ink": "#f6f2e9",
      "--t-footer-muted": "#cbd6e6",
      "--t-footer-line": "rgba(185,154,91,.4)",
      "--t-kicker-ls": "0.32em",
      "--t-kicker-color": "#7d6230",
      "--t-h1-size": "62px",
      "--t-h1-weight": "400",
      "--t-h1-lh": "1.28",
      "--t-h1-ls": "0",
      "--t-h2-size": "46px",
      "--t-h2-weight": "400",
      "--t-h3-size": "27px",
      "--t-h3-weight": "400",
    },
    layout: {
      card: "center",
      price: "footerRow",
      featureFirst: false,
      dark: false,
      radius: "0px",
      radiusPill: "0px",
      sep: "◆",
      centerNav: true,
      cardShadow: "none",
    },
  },
  {
    id: "glass",
    code: "8a",
    name: "กลาส ซอฟต์เทค ฟ้าอิเล็กทริก",
    desc: "การ์ดโปร่งฟุ้ง มุมโค้ง เงาฟุ้ง แอคเซนต์ฟ้าสด ทันสมัย",
    fonts: { display: "k2d", body: "niramit" },
    vars: {
      "--t-bg": "#eef1f5",
      "--t-bg-2": "#dfe4ec",
      "--t-bg-3": "#d5dcec",
      "--t-ink": "#10182b",
      "--t-ink-2": "#3c4763",
      "--t-muted": "#55617a",
      "--t-dim": "#55617a",
      "--t-faint": "#7f92c4",
      "--t-line": "#b8c2da",
      "--t-line-2": "#dfe4ec",
      "--t-accent": "#2f5bff",
      "--t-accent-ink": "#ffffff",
      "--t-card": "rgba(255,255,255,.66)",
      "--t-card-border": "rgba(255,255,255,.7)",
      "--t-panel-bg": "rgba(255,255,255,.92)",
      "--t-card-border-w": "1px",
      "--t-header": "rgba(255,255,255,.66)",
      "--t-footer": "#10182b",
      "--t-footer-ink": "#ffffff",
      "--t-footer-muted": "#b8c2da",
      "--t-footer-line": "rgba(255,255,255,.14)",
      "--t-kicker-ls": "0.24em",
      "--t-kicker-color": "#2f5bff",
      "--t-h1-size": "50px",
      "--t-h1-weight": "600",
      "--t-h1-lh": "1.2",
      "--t-h1-ls": "-0.02em",
      "--t-h2-size": "44px",
      "--t-h2-weight": "600",
      "--t-h3-size": "20px",
      "--t-h3-weight": "600",
    },
    layout: {
      card: "overlay",
      price: "belowTitle",
      featureFirst: false,
      dark: false,
      radius: "22px",
      radiusPill: "999px",
      sep: "·",
      centerNav: false,
      cardShadow: "0 18px 44px -26px rgba(16,24,43,.42)",
    },
  },
  {
    id: "minimal",
    code: "9a",
    name: "มินิมอล เทาอ่อน",
    desc: "เบาที่สุด ไม่มีกรอบไม่มีเงา ตัวอักษรบาง เว้นวรรคกว้าง",
    fonts: { display: "krub", body: "krub" },
    vars: {
      "--t-bg": "#fcfcfb",
      "--t-bg-2": "#f0f0ee",
      "--t-bg-3": "#f0f0ee",
      "--t-ink": "#242424",
      "--t-ink-2": "#6e6e6b",
      "--t-muted": "#6e6e6b",
      "--t-dim": "#6e6e6b",
      "--t-faint": "#a3a3a0",
      "--t-line": "#d9d9d5",
      "--t-line-2": "#e6e6e3",
      "--t-accent": "#242424",
      "--t-accent-ink": "#fcfcfb",
      "--t-card": "transparent",
      "--t-card-border": "transparent",
      "--t-header": "rgba(252,252,251,.92)",
      "--t-panel-bg": "#ffffff",
      "--t-footer": "#f0f0ee",
      "--t-footer-ink": "#242424",
      "--t-footer-muted": "#6e6e6b",
      "--t-footer-line": "#e6e6e3",
      "--t-kicker-ls": "0.3em",
      "--t-kicker-color": "#6e6e6b",
      "--t-h1-size": "40px",
      "--t-h1-weight": "300",
      "--t-h1-lh": "1.34",
      "--t-h1-ls": "0",
      "--t-h2-size": "30px",
      "--t-h2-weight": "300",
      "--t-h3-size": "19px",
      "--t-h3-weight": "400",
    },
    layout: {
      card: "stack",
      price: "footerRow",
      featureFirst: false,
      dark: false,
      radius: "0px",
      radiusPill: "0px",
      sep: "·",
      centerNav: false,
      cardShadow: "none",
    },
  },
  {
    id: "night",
    code: "10a",
    name: "ไนต์ เออร์เบิน น้ำเงินหมึก",
    desc: "พื้นมืดน้ำเงินหมึก แอคเซนต์ฟ้าน้ำแข็ง ดูเท่ตอนกลางคืน",
    fonts: { display: "fahkwang", body: "chakra" },
    vars: {
      "--t-bg": "#0a1020",
      "--t-bg-2": "#0d1526",
      "--t-bg-3": "#121a2e",
      "--t-ink": "#eaf0fb",
      "--t-ink-2": "#b6c4de",
      "--t-muted": "#8fa2c4",
      "--t-dim": "#8fa2c4",
      "--t-faint": "#5c6a86",
      "--t-line": "rgba(95,212,230,.26)",
      "--t-line-2": "rgba(95,212,230,.16)",
      "--t-accent": "#5fd4e6",
      "--t-accent-ink": "#0a1020",
      "--t-card": "#121a2e",
      "--t-card-border": "rgba(95,212,230,.16)",
      "--t-panel-bg": "#121a2e",
      "--t-card-border-w": "1px",
      "--t-header": "rgba(10,16,32,.92)",
      "--t-footer": "#060a14",
      "--t-footer-ink": "#eaf0fb",
      "--t-footer-muted": "#8fa2c4",
      "--t-footer-line": "rgba(95,212,230,.2)",
      "--t-kicker-ls": "0.24em",
      "--t-kicker-color": "#5fd4e6",
      "--t-h1-size": "64px",
      "--t-h1-weight": "500",
      "--t-h1-lh": "1.18",
      "--t-h1-ls": "-0.01em",
      "--t-h2-size": "42px",
      "--t-h2-weight": "500",
      "--t-h3-size": "17px",
      "--t-h3-weight": "400",
    },
    layout: {
      card: "framed",
      price: "onImage",
      featureFirst: false,
      dark: true,
      radius: "0px",
      radiusPill: "0px",
      sep: "·",
      centerNav: false,
      cardShadow: "none",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "editorial";

export const THEME_IDS = THEMES.map((t) => t.id);

export function isThemeId(v: unknown): v is ThemeId {
  return typeof v === "string" && THEME_IDS.includes(v as ThemeId);
}

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

/** แปลง Theme เป็น CSS custom properties พร้อม inject ที่ <html> */
export function themeVars(t: Theme): Record<string, string> {
  return {
    ...t.vars,
    "--t-font-display": fontStack(t.fonts.display),
    "--t-font-body": fontStack(t.fonts.body),
    "--t-font-kicker": fontStack(t.fonts.kicker || t.fonts.body),
    "--t-font-num": fontStack(t.fonts.mono || t.fonts.body),
    "--t-radius": t.layout.radius,
    "--t-radius-pill": t.layout.radiusPill,
    "--t-card-shadow": t.layout.cardShadow,
    // รูปในการ์ดทรงตั้ง: ธีมที่การ์ดมีกรอบ/พื้น จะโค้งที่ตัวการ์ดแทน (overflow-hidden)
    // ธีมที่การ์ดโปร่ง (stack/overlay) ต้องโค้งที่ตัวรูปเอง ไม่งั้นมุมเหลี่ยมโดดจากธีม
    "--t-media-radius":
      t.layout.card === "framed" || t.layout.card === "row"
        ? "0px"
        : t.layout.radius,
  };
}
