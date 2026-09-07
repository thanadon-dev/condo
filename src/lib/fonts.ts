/**
 * ฟอนต์ทุกตัวที่ธีมทั้ง 10 ใช้ — self-host ผ่าน next/font/google (ไม่เรียก Google ตอน runtime)
 *
 * ทุกตัว preload:false เพราะธีมที่ใช้จริงมีตัวเดียว — ปล่อยให้เบราว์เซอร์
 * ดาวน์โหลดเฉพาะฟอนต์ที่ CSS var ของธีมชี้ถึงจริง ๆ (ตัวที่ไม่ถูกใช้จะไม่ถูกโหลด)
 * ยกเว้น noto (fallback ไทยของทุกธีม) ที่ preload ไว้
 *
 * ค่า weight ถอดจาก mockup — อย่าลดทิ้งเอง หัวเรื่องจะบางผิดดีไซน์
 */
import {
  Anuphan,
  Athiti,
  Bai_Jamjuree,
  Bricolage_Grotesque,
  Chakra_Petch,
  Cormorant_Garamond,
  Fahkwang,
  IBM_Plex_Mono,
  IBM_Plex_Sans_Thai,
  IBM_Plex_Sans_Thai_Looped,
  K2D,
  Kanit,
  Krub,
  Maitree,
  Marcellus,
  Mitr,
  Niramit,
  Noto_Sans_Thai,
  Prompt,
  Sarabun,
  Trirong,
} from "next/font/google";

/** fallback ไทยของทุกธีม + ฟอนต์ body ของธีม editorial */
export const noto = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--f-noto",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--f-cormorant",
  display: "swap",
  preload: false,
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--f-sarabun",
  display: "swap",
  preload: false,
});

const plexLooped = IBM_Plex_Sans_Thai_Looped({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--f-plex-looped",
  display: "swap",
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--f-bricolage",
  display: "swap",
  preload: false,
});

const trirong = Trirong({
  subsets: ["thai", "latin"],
  weight: ["300", "400"],
  variable: "--f-trirong",
  display: "swap",
  preload: false,
});

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--f-plex-thai",
  display: "swap",
  preload: false,
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--f-marcellus",
  display: "swap",
  preload: false,
});

const mitr = Mitr({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500"],
  variable: "--f-mitr",
  display: "swap",
  preload: false,
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--f-prompt",
  display: "swap",
  preload: false,
});

const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--f-anuphan",
  display: "swap",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-plex-mono",
  display: "swap",
  preload: false,
});

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-kanit",
  display: "swap",
  preload: false,
});

const baiJamjuree = Bai_Jamjuree({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-bai",
  display: "swap",
  preload: false,
});

const maitree = Maitree({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--f-maitree",
  display: "swap",
  preload: false,
});

const athiti = Athiti({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--f-athiti",
  display: "swap",
  preload: false,
});

const k2d = K2D({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-k2d",
  display: "swap",
  preload: false,
});

const niramit = Niramit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--f-niramit",
  display: "swap",
  preload: false,
});

const krub = Krub({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--f-krub",
  display: "swap",
  preload: false,
});

const fahkwang = Fahkwang({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--f-fahkwang",
  display: "swap",
  preload: false,
});

const chakra = Chakra_Petch({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-chakra",
  display: "swap",
  preload: false,
});

/** className รวมทุกฟอนต์ ใส่ที่ <html> ครั้งเดียว */
export const ALL_FONT_CLASSES = [
  noto,
  cormorant,
  sarabun,
  plexLooped,
  bricolage,
  trirong,
  plexThai,
  marcellus,
  mitr,
  prompt,
  anuphan,
  plexMono,
  kanit,
  baiJamjuree,
  maitree,
  athiti,
  k2d,
  niramit,
  krub,
  fahkwang,
  chakra,
]
  .map((f) => f.variable)
  .join(" ");

/** สร้าง font-family stack ของฟอนต์ตัวหนึ่ง — ต่อท้ายด้วย fallback ไทยเสมอ */
export { fontStack, FONT_VARS, type FontKey } from "./font-keys";
