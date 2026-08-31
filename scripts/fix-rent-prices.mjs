/**
 * แปลงราคาทรัพย์จาก "ราคาขาย" เป็น "ค่าเช่ารายเดือน" ให้ตรงบริบทเว็บ (เว็บเช่า)
 * อ้างอิงช่วงราคาตลาดเช่ากรุงเทพฯ ตามทำเล + ขนาด + จำนวนห้องนอน
 * รันซ้ำได้ปลอดภัย (idempotent) — จับคู่ด้วย slug ไม่ใช่ id
 */
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

// slug -> ค่าเช่า/เดือน (บาท)
const RENT = {
  "นิช-โมโน-รามคำแหง": 7500,
  "แอชตัน-อโศก": 28000,
  "ทาวน์โฮม-เอกมัย-12": 35000,
  "เดอะ-ลอฟท์-สาทร": 38000,
  "เดอะ-ริเวอร์-เรสซิเดนซ์": 42000,
  "วิลล่า-ราชพฤกษ์": 32000,
  "บ้านกลางเมือง-สุขุมวิท-71": 48000,
  "เพนท์เฮาส์-ทองหล่อ": 50000,
};

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));

const rows = db.prepare("SELECT id, slug, title, price FROM properties").all();
let changed = 0;

for (const r of rows) {
  const rent = RENT[r.slug];
  if (!rent) {
    // ทรัพย์ที่เพิ่มใหม่ภายหลัง: ถ้าราคายังเป็นหลักล้าน ให้ประมาณจากพื้นที่
    if (r.price > 200000) {
      const est = Math.max(6000, Math.round((r.price / 300) / 500) * 500);
      db.prepare("UPDATE properties SET price = ? WHERE id = ?").run(est, r.id);
      console.log(`  ~ ${r.title}: ${r.price} -> ${est} (ประมาณจากราคาขาย)`);
      changed++;
    }
    continue;
  }
  if (r.price !== rent) {
    db.prepare("UPDATE properties SET price = ? WHERE id = ?").run(rent, r.id);
    console.log(`  ✓ ${r.title}: ${r.price} -> ${rent}`);
    changed++;
  }
}

const m = db
  .prepare("SELECT MIN(price) lo, MAX(price) hi FROM properties WHERE published = 1")
  .get();

console.log(`\nแก้ ${changed} รายการ · ช่วงราคาจริงตอนนี้ ${m.lo} – ${m.hi} บาท/เดือน`);
db.close();
