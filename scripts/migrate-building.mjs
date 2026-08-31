/**
 * เปลี่ยน properties.year -> properties.building (ป้าย "ปีที่สร้าง" -> "อาคาร")
 * รันซ้ำได้ปลอดภัย
 */
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));

const cols = new Set(
  db.prepare("PRAGMA table_info(properties)").all().map((c) => c.name),
);

if (cols.has("building")) {
  console.log("มีคอลัมน์ building แล้ว ไม่ต้องแก้");
} else if (cols.has("year")) {
  db.exec("ALTER TABLE properties RENAME COLUMN year TO building");
  console.log("เปลี่ยน year -> building แล้ว");
} else {
  db.exec("ALTER TABLE properties ADD COLUMN building TEXT NOT NULL DEFAULT ''");
  console.log("เพิ่มคอลัมน์ building");
}

for (const r of db.prepare("SELECT id, title, building FROM properties ORDER BY id").all()) {
  console.log(`  ${r.id} ${JSON.stringify(r.building)} | ${r.title}`);
}
db.close();
