import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { mediaDir, mediaUrl } from "./media";

/** ชนิดไฟล์ที่รับ — ตรวจจาก magic bytes จริง ไม่เชื่อ MIME ที่เบราว์เซอร์ส่งมา */
const MAGIC: { ext: string; test: (b: Buffer) => boolean }[] = [
  { ext: "jpeg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: "png",
    test: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    ext: "webp",
    test: (b) =>
      b.subarray(0, 4).toString("ascii") === "RIFF" &&
      b.subarray(8, 12).toString("ascii") === "WEBP",
  },
  {
    ext: "avif",
    test: (b) => b.subarray(4, 8).toString("ascii") === "ftyp",
  },
  {
    ext: "gif",
    test: (b) => b.subarray(0, 3).toString("ascii") === "GIF",
  },
  {
    ext: "heic",
    test: (b) =>
      b.subarray(4, 8).toString("ascii") === "ftyp" &&
      ["heic", "heix", "hevc", "mif1"].includes(
        b.subarray(8, 12).toString("ascii"),
      ),
  },
];

export const MAX_UPLOAD_BYTES = 12 * 1024 * 1024; // 12MB ต่อไฟล์

/** ขนาดที่เก็บ: ตัวเต็มไว้ดูใน lightbox + ตัวย่อไว้ทำธัมบ์เนล */
const FULL_WIDTH = 1920;
const THUMB_WIDTH = 640;
const QUALITY = 78;
const THUMB_QUALITY = 72;

export type UploadResult = {
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  bytes: number;
  originalBytes: number;
};

function detect(buf: Buffer): string | null {
  if (buf.length < 16) return null;
  for (const m of MAGIC) if (m.test(buf)) return m.ext;
  return null;
}

function newName(): string {
  // ชื่อสุ่ม: กันชนกัน + กันเดา URL ไฟล์คนอื่น + ตรงกับ regex ใน media.ts
  return `u${Date.now().toString(36)}${randomBytes(4).toString("hex")}`;
}

/**
 * บีบรูป + แปลงเป็น WebP
 * - หมุนตาม EXIF ก่อน แล้วลบ metadata ทิ้ง (กันพิกัด GPS บ้านลูกค้าหลุด)
 * - ย่อฝั่งกว้างสุดไม่เกิน 1920 (ไม่ขยายรูปเล็ก)
 * - เขียน 2 ไฟล์: ตัวเต็ม + ธัมบ์ 640
 */
export async function processImage(
  input: ArrayBuffer | Buffer,
  opts: { effort?: number } = {},
): Promise<UploadResult> {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);

  if (buf.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error("ไฟล์ใหญ่เกิน 12MB");
  }
  const kind = detect(buf);
  if (!kind) throw new Error("ไฟล์นี้ไม่ใช่รูปภาพที่รองรับ");

  const base = newName();
  const dir = mediaDir();
  const fullName = `${base}.webp`;
  const thumbName = `${base}-t.webp`;

  // วัดจริงกับรูปมือถือ 6.4MB (ดู bench ใน CONTEXT):
  //   effort 2 = 502ms / 723KB · effort 3 = 763ms / 701KB · effort 6 = 1993ms / 670KB
  // เลือก 2 เพราะเร็วกว่า 3 อยู่ 35% แต่ไฟล์ใหญ่กว่าแค่ 3% — ผู้ใช้รออยู่หน้าจอ
  const effort = opts.effort ?? 2;

  const pipeline = sharp(buf, { failOn: "none" })
    .rotate() // ใช้ EXIF orientation ก่อน แล้ว metadata จะถูกทิ้งตอน encode
    .resize({
      width: FULL_WIDTH,
      height: FULL_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    });

  const [full, thumb] = await Promise.all([
    pipeline
      .clone()
      .webp({ quality: QUALITY, effort })
      .toBuffer({ resolveWithObject: true }),
    pipeline
      .clone()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY, effort })
      .toBuffer(),
  ]);

  await Promise.all([
    writeFile(path.join(dir, fullName), full.data),
    writeFile(path.join(dir, thumbName), thumb),
  ]);

  return {
    url: mediaUrl(fullName),
    thumbUrl: mediaUrl(thumbName),
    width: full.info.width,
    height: full.info.height,
    bytes: full.data.byteLength,
    originalBytes: buf.byteLength,
  };
}
