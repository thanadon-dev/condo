/**
 * เปลี่ยน slug ไทย -> อังกฤษ ทั้ง properties / articles / deals / areas
 * เก็บ slug เดิมไว้ในตาราง slug_aliases เพื่อ 301 redirect (ลิงก์เก่าที่แชร์ไปแล้วต้องไม่พัง)
 * รันซ้ำได้ปลอดภัย
 */
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { readFileSync } from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

const src = readFileSync(path.join(ROOT, "src/lib/romanize.ts"), "utf8");

// ดึงตารางแปลงจากไฟล์จริง เพื่อไม่ให้ logic แยกกันสองที่
function tableFrom(name) {
  const m = src.match(
    new RegExp(`const ${name}: \\[RegExp, string\\]\\[\\] = \\[([\\s\\S]*?)\\n\\];`),
  );
  if (!m) throw new Error("ไม่พบตาราง " + name + " ใน romanize.ts");
  const out = [];
  for (const line of m[1].split("\n")) {
    const p = line.match(/\[\/(.+?)\/g,\s*"(.*?)"\]/);
    if (p) out.push([new RegExp(p[1], "g"), p[2]]);
  }
  return out;
}

function mapFrom(name) {
  const m = src.match(
    new RegExp(`const ${name}: Record<string, string> = \\{([\\s\\S]*?)\\n\\};`),
  );
  if (!m) throw new Error("ไม่พบ map " + name);
  const out = {};
  for (const p of m[1].matchAll(/([\u0E00-\u0E7F"]+)\s*:\s*"(.*?)"/g)) {
    out[p[1].replace(/"/g, "")] = p[2];
  }
  return out;
}

const PROPER = tableFrom("PROPER");
const WORDS = tableFrom("WORDS");
const CONSONANTS = mapFrom("CONSONANTS");
const VOWELS = mapFrom("VOWELS");
const DIGITS = mapFrom("DIGITS");

const hasThai = (s) => /[\u0E00-\u0E7F]/.test(s);

function romanize(input) {
  let s = String(input || "");
  for (const [re, en] of PROPER) s = s.replace(re, ` ${en} `);
  for (const [re, en] of WORDS) s = s.replace(re, ` ${en} `);
  let out = "";
  for (const ch of s) {
    if (DIGITS[ch] !== undefined) out += DIGITS[ch];
    else if (VOWELS[ch] !== undefined) out += VOWELS[ch];
    else if (CONSONANTS[ch] !== undefined) out += CONSONANTS[ch];
    else if (/[\u0E00-\u0E7F]/.test(ch)) out += "";
    else out += ch;
  }
  return out.replace(/\s+/g, " ").trim();
}

function slugify(input) {
  const base = hasThai(String(input || ""))
    ? romanize(String(input || ""))
    : String(input || "");
  return base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));
db.exec(readFileSync(path.join(ROOT, "src/lib/schema-007-slug-aliases.sql"), "utf8"));

/**
 * ประโยคไทยยาว ๆ ถอดเสียงแล้วอ่านไม่ออก (54 ตัวอักษรติดกัน) แย่กว่าไทยอีก
 * บทความ/ดีลจึงกำหนด slug สั้นที่สื่อความหมายด้วยมือ — จำนวนไม่เยอะ คุ้มกว่าปล่อยอัตโนมัติ
 */
const MANUAL = {
  article: {
    "ตั้งราคาเช่าเท่าไหร่จึงได้ผู้เช่าเร็วและไม่ขาดทุน": "how-to-price-your-rental",
    "อ่านทำเลด้วยเวลาเดินทาง-ไม่ใช่ระยะทาง": "location-by-commute-time",
    "เจ็ดจุดที่ควรตรวจก่อนเซ็นสัญญาเช่า": "7-checks-before-signing-lease",
  },
  deal: {
    "บ้านเดี่ยว-สุขุมวิท-71-ปล่อยเช่าได้ใน-11-วัน":
      "single-house-sukhumvit-71-rented-in-11-days",
    "คอนโด-แอชตัน-อโศก-ปล่อยเช่าเต็มปี-พร้อมผู้เช่าต่อสัญญา":
      "ashton-asoke-full-year-lease-renewed",
    "ทาวน์โฮม-เอกมัย-12-เช่าพร้อมเฟอร์นิเจอร์ครบ":
      "townhome-ekkamai-12-fully-furnished",
    "เดอะ-ลอฟท์-สาทร-ปล่อยเช่าสองห้องพร้อมกันในสัปดาห์เดียว":
      "the-loft-sathorn-two-units-in-one-week",
    "วิลล่า-ราชพฤกษ์-ขายขาดหลังตั้งขายมาปีครึ่ง":
      "villa-ratchaphruek-sold-after-18-months",
  },
};

const TABLES = [
  { table: "properties", kind: "property", field: "title" },
  { table: "articles", kind: "article", field: "title" },
  { table: "deals", kind: "deal", field: "title" },
  { table: "areas", kind: "area", field: "name" },
];

let total = 0;

for (const { table, kind, field } of TABLES) {
  const rows = db.prepare(`SELECT id, slug, ${field} AS label FROM ${table}`).all();
  const taken = new Set(rows.map((r) => r.slug));

  for (const r of rows) {
    if (!hasThai(r.slug)) continue;

    let next = MANUAL[kind]?.[r.slug] || slugify(r.label);
    if (!next) next = `${kind}-${r.id}`;
    // ถอดเสียงแล้วยาวเกินอ่านไม่ออก -> ตัดให้เหลือ 40 ตัวแล้วต่อ id
    if (!MANUAL[kind]?.[r.slug] && next.length > 46) {
      next = next.slice(0, 40).replace(/-[^-]*$/, "") + "-" + r.id;
    }
    if (next !== r.slug && taken.has(next)) {
      let i = 2;
      while (taken.has(`${next}-${i}`)) i++;
      next = `${next}-${i}`;
    }

    db.prepare(`UPDATE ${table} SET slug = ? WHERE id = ?`).run(next, r.id);
    db.prepare(
      "INSERT OR REPLACE INTO slug_aliases (kind, old_slug, new_slug) VALUES (?,?,?)",
    ).run(kind, r.slug, next);

    taken.delete(r.slug);
    taken.add(next);
    console.log(`  ${kind}: ${r.slug}`);
    console.log(`        -> ${next}`);
    total++;
  }
}

console.log(`\nเปลี่ยน ${total} slug · เก็บ alias ไว้ redirect แล้ว`);
db.close();
