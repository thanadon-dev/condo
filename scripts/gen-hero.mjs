import sharp from "sharp";
import path from "node:path";
import { mkdirSync } from "node:fs";

const DATA_DIR =
  process.env.CONDO_DATA_DIR ||
  path.join(process.env.HOME || "/home/mark", ".local/share/condo");
const MEDIA_DIR = process.env.CONDO_MEDIA_DIR || path.join(DATA_DIR, "media");
mkdirSync(MEDIA_DIR, { recursive: true });

const W = 2400;
const H = 1350;
const HORIZON = 1105;

const rnd = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
};

function building(x, w, h, fill, op, seed, windows = true) {
  const r = rnd(seed);
  const top = HORIZON - h;
  const cells = [];
  if (windows) {
    for (let y = top + 22; y < HORIZON - 26; y += 30) {
      for (let cx = x + 10; cx < x + w - 16; cx += 20) {
        const v = r();
        if (v > 0.55) {
          cells.push(
            `<rect x="${cx}" y="${y}" width="9" height="15" fill="#ffd9a3" opacity="${(
              0.1 +
              v * 0.5
            ).toFixed(2)}"/>`,
          );
        }
      }
    }
  }
  const crown =
    h > 380
      ? `<rect x="${x + w / 2 - 3}" y="${top - 46}" width="6" height="46" fill="${fill}" opacity="${op}"/>`
      : "";
  return `${crown}<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${fill}" opacity="${op}"/>${cells.join("")}`;
}

// far layer — hazy, low contrast
const far = [
  [60, 170, 300, 3],
  [250, 130, 240, 7],
  [420, 200, 360, 11],
  [660, 150, 270, 17],
  [980, 175, 330, 23],
  [1300, 140, 250, 29],
  [1520, 190, 380, 31],
  [1790, 160, 300, 37],
  [2010, 210, 340, 41],
  [2250, 130, 260, 43],
]
  .map(([x, w, h, s]) => building(x, w, h, "#8f9ba3", 0.3, s))
  .join("");

// mid layer
const mid = [
  [150, 190, 470, 53],
  [390, 150, 380, 59],
  [700, 210, 560, 61],
  [1010, 165, 420, 67],
  [1620, 180, 500, 71],
  [1870, 220, 620, 73],
  [2150, 160, 400, 79],
]
  .map(([x, w, h, s]) => building(x, w, h, "#5f6d76", 0.55, s))
  .join("");

// hero tower — the condo, near right of centre
const heroTop = HORIZON - 830;
const heroX = 1235;
const heroW = 330;

const balconies = Array.from({ length: 22 }, (_, i) => {
  const y = heroTop + 60 + i * 34;
  return `
  <rect x="${heroX}" y="${y}" width="${heroW}" height="19" fill="#20272c" opacity="0.42"/>
  <rect x="${heroX}" y="${y + 19}" width="${heroW}" height="4" fill="#0f1418" opacity="0.5"/>
  <rect x="${heroX + 14}" y="${y + 3}" width="${heroW - 34}" height="13" fill="#ffdcab" opacity="${
    ((i * 7) % 5) > 2 ? 0.5 : 0.16
  }"/>`;
}).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#5c7285"/>
      <stop offset="30%"  stop-color="#93a3ab"/>
      <stop offset="55%"  stop-color="#d8c3a8"/>
      <stop offset="78%"  stop-color="#eec392"/>
      <stop offset="100%" stop-color="#f0d0a6"/>
    </linearGradient>
    <radialGradient id="glow" cx="66%" cy="76%" r="46%">
      <stop offset="0%"   stop-color="#ffd9a0" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#ffd9a0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#c9ac8b"/>
      <stop offset="45%"  stop-color="#7f8c93"/>
      <stop offset="100%" stop-color="#4a565e"/>
    </linearGradient>
    <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#2c353b"/>
      <stop offset="62%"  stop-color="#3c474e"/>
      <stop offset="100%" stop-color="#232b30"/>
    </linearGradient>
    <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#e9d6bb" stop-opacity="0"/>
      <stop offset="100%" stop-color="#e9d6bb" stop-opacity="0.5"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <g>${far}</g>
  <rect x="0" y="${HORIZON - 640}" width="${W}" height="640" fill="url(#haze)"/>
  <g>${mid}</g>

  <g>
    <rect x="${heroX + heroW / 2 - 4}" y="${heroTop - 70}" width="8" height="70" fill="#2c353b"/>
    <rect x="${heroX}" y="${heroTop}" width="${heroW}" height="830" fill="url(#tower)"/>
    ${balconies}
    <rect x="${heroX}" y="${heroTop}" width="10" height="830" fill="#ffffff" opacity="0.13"/>
    <rect x="${heroX + heroW - 9}" y="${heroTop}" width="9" height="830" fill="#000000" opacity="0.22"/>
  </g>

  <rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#river)"/>

  <g opacity="0.30">
    <rect x="${heroX + 30}" y="${HORIZON}" width="${heroW - 60}" height="${H - HORIZON}" fill="#1b2226"/>
  </g>
  <g opacity="0.42">
    ${Array.from({ length: 9 }, (_, i) => {
      const y = HORIZON + 14 + i * 26;
      const w = 200 + i * 150;
      return `<rect x="${1180 - i * 34}" y="${y}" width="${w}" height="5" fill="#ffe3bb" opacity="${(
        0.5 -
        i * 0.045
      ).toFixed(2)}"/>`;
    }).join("")}
  </g>
  <g opacity="0.22">
    ${Array.from({ length: 14 }, (_, i) => {
      const y = HORIZON + 8 + i * 18;
      return `<rect x="0" y="${y}" width="${W}" height="2" fill="#ffffff"/>`;
    }).join("")}
  </g>

  <rect width="${W}" height="${H}" fill="#0d1216" opacity="0.10"/>
</svg>`;

const out = path.join(MEDIA_DIR, "hero-1.webp");
await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(out);
console.log("wrote", out);
