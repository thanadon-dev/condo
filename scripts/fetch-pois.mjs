import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");
const MAPS = path.join(
  process.env.HOME || "/home/mark",
  ".hermes/skills/productivity/maps/scripts/maps_client.py",
);

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));
db.exec("PRAGMA foreign_keys = ON");
db.exec(readFileSync(path.join(ROOT, "src/lib/schema-002-pois.sql"), "utf8"));

const CATS = [
  ["train_station", "รถไฟฟ้า / สถานี"],
  ["supermarket", "ซูเปอร์มาร์เก็ต"],
  ["hospital", "โรงพยาบาล"],
  ["school", "สถานศึกษา"],
  ["park", "สวนสาธารณะ"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function nearby(lat, lng, cat) {
  try {
    const out = execFileSync(
      "python3",
      [MAPS, "nearby", String(lat), String(lng), cat, "--radius", "2500", "--limit", "3"],
      { encoding: "utf8", timeout: 70000 },
    );
    return JSON.parse(out).results || [];
  } catch (e) {
    console.log("  overpass fail", cat, String(e.message).slice(0, 60));
    return [];
  }
}

const props = db
  .prepare("SELECT id, title, lat, lng FROM properties WHERE lat IS NOT NULL ORDER BY id")
  .all();

let total = 0;
for (const p of props) {
  const have = db
    .prepare("SELECT COUNT(*) c FROM property_pois WHERE property_id = ?")
    .get(p.id).c;
  if (have > 0) {
    console.log("skip (has pois):", p.title);
    continue;
  }

  console.log("fetching:", p.title);
  for (const [cat, label] of CATS) {
    const hits = nearby(p.lat, p.lng, cat);
    await sleep(1500);
    for (const h of hits.slice(0, 2)) {
      if (!h.name) continue;
      db.prepare(
        "INSERT INTO property_pois (property_id,name,category,lat,lng,distance_m) VALUES (?,?,?,?,?,?)",
      ).run(
        p.id,
        String(h.name).slice(0, 120),
        label,
        Number(h.lat),
        Number(h.lon),
        Math.round(Number(h.distance_m) || 0),
      );
      total++;
    }
  }
}

console.log("pois inserted:", total);
console.log("rows:", db.prepare("SELECT COUNT(*) c FROM property_pois").get().c);
db.close();
