import path from "node:path";
import { mkdirSync } from "node:fs";

export const MEDIA_DIR =
  process.env.CONDO_MEDIA_DIR ||
  path.join(
    process.env.HOME || "/home/mark",
    ".local/share/condo/media",
  );

export function mediaDir(): string {
  mkdirSync(MEDIA_DIR, { recursive: true });
  return MEDIA_DIR;
}

const NAME_RE = /^[a-z0-9][a-z0-9._-]{0,95}$/;

export function safeName(name: string): string | null {
  const n = String(name || "").toLowerCase();
  if (!NAME_RE.test(n)) return null;
  if (n.includes("..")) return null;
  return n;
}

export function mediaPath(name: string): string | null {
  const n = safeName(name);
  if (!n) return null;
  const full = path.join(mediaDir(), n);
  if (path.dirname(full) !== path.resolve(mediaDir())) return null;
  return full;
}

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
};

export function mimeOf(name: string): string {
  return MIME[path.extname(name).toLowerCase()] || "application/octet-stream";
}

export function mediaUrl(name: string): string {
  return `/media/${encodeURIComponent(name)}`;
}
