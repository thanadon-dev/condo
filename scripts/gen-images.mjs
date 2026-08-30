import sharp from "sharp";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, existsSync } from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");
const MEDIA_DIR =
  process.env.CONDO_MEDIA_DIR || path.join(DATA_DIR, "media");

mkdirSync(MEDIA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, "condo.db"));
db.exec("PRAGMA foreign_keys = ON");

const W = 1600;
const H = 1067;

const PALETTES = [
  ["#e8e4dc", "#c9c2b4", "#8f8878"],
  ["#dfe3e2", "#bcc4c2", "#7d8785"],
  ["#e9e2d9", "#cbbca9", "#93826c"],
  ["#e2e4ea", "#bcc0cc", "#7f8496"],
  ["#eae6de", "#ccc3b3", "#8d8474"],
];

function svg(label, sub, i, n) {
  const [bg, mid, dark] = PALETTES[i % PALETTES.length];

  const horizon = 640 + (n % 3) * 40;
  const bx = 260 + (n % 4) * 90;
  const bw = 360 + (n % 3) * 70;
  const bh = 300 + ((n + 1) % 4) * 60;

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${mid}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect x="${bx}" y="${horizon - bh}" width="${bw}" height="${bh}" fill="${dark}" opacity="0.34"/>
  <rect x="${bx + bw + 60}" y="${horizon - bh * 0.72}" width="${bw * 0.62}" height="${bh * 0.72}" fill="${dark}" opacity="0.24"/>
  <rect x="${bx - 210}" y="${horizon - bh * 0.5}" width="180" height="${bh * 0.5}" fill="${dark}" opacity="0.18"/>
  <rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${dark}" opacity="0.12"/>
  <line x1="0" y1="${horizon}" x2="${W}" y2="${horizon}" stroke="${dark}" stroke-width="2" opacity="0.35"/>
</svg>`);
}

async function render(buf, out) {
  await sharp(buf).webp({ quality: 82 }).toFile(out);
}

const props = db.prepare("SELECT * FROM properties ORDER BY id").all();
const ANGLES = ["EXTERIOR", "LIVING", "BEDROOM", "VIEW", "BATHROOM"];

let made = 0;
for (const p of props) {
  const have = db
    .prepare("SELECT COUNT(*) c FROM property_images WHERE property_id = ?")
    .get(p.id).c;
  if (have > 0) continue;

  const shots = 4 + (p.id % 2);
  for (let k = 0; k < shots; k++) {
    const name = `p${p.id}-${k + 1}.webp`;
    const out = path.join(MEDIA_DIR, name);
    if (!existsSync(out)) {
      await render(svg(p.title, ANGLES[k % ANGLES.length], p.id, p.id + k), out);
      made++;
    }
    db.prepare(
      "INSERT INTO property_images (property_id,url,alt,sort) VALUES (?,?,?,?)",
    ).run(
      p.id,
      `/media/${name}`,
      `${p.title} — ${p.type} ${p.district} รูปที่ ${k + 1}`,
      k,
    );
  }
}

const areas = db.prepare("SELECT * FROM areas ORDER BY sort, id").all();
for (const a of areas) {
  if (a.cover) continue;
  const name = `area-${a.id}.webp`;
  const out = path.join(MEDIA_DIR, name);
  if (!existsSync(out)) {
    await render(svg(a.name, "NEIGHBOURHOOD", a.id + 2, a.id), out);
    made++;
  }
  db.prepare("UPDATE areas SET cover = ? WHERE id = ?").run(
    `/media/${name}`,
    a.id,
  );
}

console.log(
  "images created:",
  made,
  "| rows:",
  db.prepare("SELECT COUNT(*) c FROM property_images").get().c,
);
db.close();
