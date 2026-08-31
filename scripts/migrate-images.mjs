/**
 * เพิ่มคอลัมน์ thumb_url / width / height ให้ property_images
 * รันซ้ำได้ปลอดภัย (ข้ามคอลัมน์ที่มีแล้ว)
 */
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));

const cols = new Set(
  db.prepare("PRAGMA table_info(property_images)").all().map((c) => c.name),
);

const ADD = [
  ["thumb_url", "TEXT NOT NULL DEFAULT ''"],
  ["width", "INTEGER NOT NULL DEFAULT 0"],
  ["height", "INTEGER NOT NULL DEFAULT 0"],
];

let n = 0;
for (const [name, type] of ADD) {
  if (cols.has(name)) continue;
  db.exec(`ALTER TABLE property_images ADD COLUMN ${name} ${type}`);
  console.log("  + เพิ่มคอลัมน์", name);
  n++;
}

console.log(
  n ? `\nเพิ่ม ${n} คอลัมน์` : "\nมีครบแล้ว ไม่ต้องแก้",
);
console.log(
  "schema:",
  db
    .prepare("PRAGMA table_info(property_images)")
    .all()
    .map((c) => c.name)
    .join(", "),
);
db.close();
