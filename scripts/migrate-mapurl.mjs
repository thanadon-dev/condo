/**
 * เพิ่มคอลัมน์ map_url ให้ properties (เก็บลิงก์ Google Maps ที่ผู้ใช้วาง)
 * lat/lng ที่มีอยู่แล้วใช้เก็บพิกัดที่แกะได้จากลิงก์
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

if (cols.has("map_url")) {
  console.log("มีคอลัมน์ map_url แล้ว");
} else {
  db.exec("ALTER TABLE properties ADD COLUMN map_url TEXT NOT NULL DEFAULT ''");
  console.log("เพิ่มคอลัมน์ map_url แล้ว");
}

for (const r of db
  .prepare("SELECT id, title, lat, lng, map_url FROM properties ORDER BY id")
  .all()) {
  console.log(
    `  ${r.id} lat=${r.lat ?? "-"} lng=${r.lng ?? "-"} map=${r.map_url ? "มี" : "-"} | ${r.title}`,
  );
}
db.close();
