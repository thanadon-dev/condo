import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));

const cols = db
  .prepare("PRAGMA table_info(settings)")
  .all()
  .map((r) => r.name);

if (!cols.includes("updated_at")) {
  db.exec(
    "ALTER TABLE settings ADD COLUMN updated_at TEXT NOT NULL DEFAULT '1970-01-01 00:00:00'",
  );
  console.log("เพิ่มคอลัมน์ updated_at แล้ว");
} else {
  console.log("มี updated_at อยู่แล้ว ไม่ต้องแก้");
}

console.log(
  "schema ปัจจุบัน:",
  db
    .prepare("PRAGMA table_info(settings)")
    .all()
    .map((r) => r.name)
    .join(", "),
);

db.close();
