/**
 * แก้ slug บทความ/ดีลที่ถอดเสียงออกมายาวจนอ่านไม่ออก ให้เป็น slug อังกฤษที่สื่อความหมาย
 * อัปเดต alias เดิม (ที่ชี้ไป slug ยาว) ให้ชี้ปลายทางใหม่ด้วย — ลิงก์เก่าทุกรุ่นต้องยังใช้ได้
 * รันซ้ำได้ปลอดภัย
 */
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

const FIX = {
  articles: {
    kind: "article",
    map: {
      tangrakhaechaethaaihrchuengaidphuechaerwaelaaimkhadthun:
        "how-to-price-your-rental",
      "oanthameldwyewlaedinthang-aimaichrayathang":
        "location-by-commute-time",
      echdchudthikhwrtrwchkonesnsayyaecha: "7-checks-before-signing-lease",
    },
  },
  deals: {
    kind: "deal",
    map: {
      "single-house-sukhumvit-71-ployechaaidain-11-wan":
        "single-house-sukhumvit-71-rented-in-11-days",
      "condo-ashton-asoke-ployechaetmpi-phromphuechatosayya":
        "ashton-asoke-full-year-lease-renewed",
      "townhome-ekkamai-12-echaphromeforniechorkhrb":
        "townhome-ekkamai-12-fully-furnished",
      "the-loft-sathorn-ployechasonghongphromkanainsapdahediyw":
        "the-loft-sathorn-two-units-in-one-week",
      "villa-ratchaphruek-khaykhadhlangtangkhaymapikhrueng":
        "villa-ratchaphruek-sold-after-18-months",
    },
  },
};

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));
let n = 0;

for (const [table, { kind, map }] of Object.entries(FIX)) {
  for (const [oldSlug, newSlug] of Object.entries(map)) {
    const row = db
      .prepare(`SELECT id FROM ${table} WHERE slug = ?`)
      .get(oldSlug);
    if (!row) continue;

    db.prepare(`UPDATE ${table} SET slug = ? WHERE id = ?`).run(newSlug, row.id);

    // alias เดิมที่ชี้ไป slug ยาว -> ให้ชี้ปลายทางใหม่
    db.prepare(
      "UPDATE slug_aliases SET new_slug = ? WHERE kind = ? AND new_slug = ?",
    ).run(newSlug, kind, oldSlug);

    // เก็บ slug ยาวไว้เป็น alias ด้วย เผื่อมีคนก็อปไปแล้ว
    db.prepare(
      "INSERT OR REPLACE INTO slug_aliases (kind, old_slug, new_slug) VALUES (?,?,?)",
    ).run(kind, oldSlug, newSlug);

    console.log(`  ${kind}: ${oldSlug}\n        -> ${newSlug}`);
    n++;
  }
}

console.log(`\nแก้ ${n} slug`);
console.log("\n--- slug ทั้งหมดตอนนี้ ---");
for (const t of ["properties", "articles", "deals", "areas"]) {
  for (const r of db.prepare(`SELECT slug FROM ${t} ORDER BY id`).all()) {
    console.log(`  ${t.padEnd(11)} ${r.slug}`);
  }
}
db.close();
