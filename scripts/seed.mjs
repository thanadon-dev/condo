import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

const RE_STRIP = /[^\p{L}\p{M}\p{N}\s-]/gu;
const slugify = (s) =>
  String(s || "")
    .trim()
    .replace(RE_STRIP, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const taken = new Set();
const uniq = (base) => {
  const s = slugify(base) || "item";
  if (!taken.has(s)) return taken.add(s), s;
  let n = 2;
  while (taken.has(`${s}-${n}`)) n += 1;
  const out = `${s}-${n}`;
  return taken.add(out), out;
};

mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");
db.exec(readFileSync(path.join(ROOT, "src/lib/schema.sql"), "utf8"));

const seed = JSON.parse(readFileSync(path.join(ROOT, "data/seed.json"), "utf8"));

const count = (t) => db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c;

const AMENITIES = [
  "สระว่ายน้ำ",
  "ฟิตเนส",
  "ที่จอดรถ",
  "รปภ. 24 ชม.",
  "กล้องวงจรปิด",
  "สวนส่วนกลาง",
  "ลิฟต์",
  "ร้านสะดวกซื้อ",
];

if (count("areas") === 0) {
  const ins = db.prepare(
    "INSERT INTO areas (slug,name,query,cover,sort) VALUES (?,?,?,?,?)",
  );
  seed.AREAS.forEach((a, i) => ins.run(uniq(a.name), a.name, a.q, "", i));
}

if (count("properties") === 0) {
  const ins = db.prepare(`INSERT INTO properties
    (slug,code,title,cat,type,district,location,price,beds,baths,area,floor,year,park,descr,descr2,amenities,views)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  seed.SEED.forEach((p, i) => {
    const code = "CD-" + String(1000 + i + 1);
    ins.run(
      uniq(p.title),
      code,
      p.title,
      p.cat,
      p.type,
      p.district,
      p.location,
      p.price,
      p.beds,
      p.baths,
      p.area,
      p.floor,
      p.year,
      p.park,
      `${p.type}${p.floor ? " " + p.floor : ""} ในทำเล${p.district} พื้นที่ใช้สอย ${p.area} ตร.ม. ${p.beds} ห้องนอน ${p.baths} ห้องน้ำ`,
      `ตรวจสอบข้อมูลจริงกับเจ้าของ ณ วันที่ลงประกาศ ราคาอาจเปลี่ยนแปลงตามการเจรจา`,
      JSON.stringify(AMENITIES.slice(0, 5 + (i % 4))),
      p.views,
    );
  });
}

if (count("deals") === 0) {
  const ins = db.prepare(
    "INSERT INTO deals (slug,closed_on,title,cat,location,value,imgs,body) VALUES (?,?,?,?,?,?,?,?)",
  );
  seed.DEALS.forEach((d) => {
    const [y, m, dd] = d.date.split("-");
    const ce = Number(y) > 2500 ? Number(y) - 543 : Number(y);
    ins.run(
      uniq(d.title),
      `${ce}-${m}-${dd}`,
      d.title,
      d.cat,
      d.location,
      d.value,
      d.imgs,
      d.text,
    );
  });
}

if (count("articles") === 0) {
  const ins = db.prepare(
    "INSERT INTO articles (slug,title,tag,published_on,read_time,lead,body) VALUES (?,?,?,?,?,?,?)",
  );
  const dates = ["2026-08-20", "2026-08-06", "2026-07-24"];
  seed.ARTICLES.forEach((a, i) => {
    ins.run(
      uniq(a.title),
      a.title,
      a.tag,
      dates[i] || "2026-01-01",
      a.read,
      a.lead,
      a.body.join("\n\n"),
    );
  });
}

for (const t of ["areas", "properties", "deals", "articles"]) {
  console.log(t, count(t));
}
db.close();
