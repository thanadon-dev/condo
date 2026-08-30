import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");
const MAPS = path.join(
  process.env.HOME || "/home/mark",
  ".hermes/skills/productivity/maps/scripts/maps_client.py",
);

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));
db.exec("PRAGMA foreign_keys = ON");

const QUERIES = {
  เจริญนคร: "Charoen Nakhon Road, Khlong San, Bangkok",
  พระโขนง: "Sukhumvit 71, Phra Khanong Nuea, Watthana, Bangkok",
  อโศก: "Asok Montri Road, Watthana, Bangkok",
  สาทร: "Charoen Rat Road, Bang Kho Laem, Bangkok",
  ราชพฤกษ์: "Ratchaphruek Road, Bang Kruai, Nonthaburi",
  รามคำแหง: "Ramkhamhaeng 22, Hua Mak, Bang Kapi, Bangkok",
  เอกมัย: "Ekkamai 12, Khlong Tan Nuea, Watthana, Bangkok",
  ทองหล่อ: "Thong Lo, Khlong Tan Nuea, Watthana, Bangkok",
};

function geocode(q) {
  const out = execFileSync("python3", [MAPS, "search", q], {
    encoding: "utf8",
    timeout: 45000,
  });
  const d = JSON.parse(out);
  const r = d.results?.[0];
  return r ? { lat: Number(r.lat), lng: Number(r.lon) } : null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const rows = db
  .prepare("SELECT id, title, district FROM properties WHERE lat IS NULL")
  .all();

let ok = 0;
for (const r of rows) {
  const q = QUERIES[r.district];
  if (!q) {
    console.log("no query mapping for district:", r.district);
    continue;
  }
  const hit = geocode(q);
  await sleep(1300);
  if (!hit) {
    console.log("miss:", r.district);
    continue;
  }
  const jitter = () => (Math.random() - 0.5) * 0.006;
  db.prepare("UPDATE properties SET lat = ?, lng = ? WHERE id = ?").run(
    Number((hit.lat + jitter()).toFixed(6)),
    Number((hit.lng + jitter()).toFixed(6)),
    r.id,
  );
  ok++;
  console.log("ok:", r.district, hit.lat, hit.lng);
}

console.log("geocoded:", ok, "/", rows.length);
console.log(
  "with coords:",
  db.prepare("SELECT COUNT(*) c FROM properties WHERE lat IS NOT NULL").get().c,
);
db.close();
