"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { run, all, one } from "@/lib/db";
import { processImage, MAX_UPLOAD_BYTES } from "@/lib/upload";
import { mediaPath } from "@/lib/media";
import { unlink } from "node:fs/promises";

export type UploadState = {
  ok: boolean;
  message: string;
  added?: number;
  saved?: string;
};

const MAX_FILES = 20;

/** อัปโหลดรูปเข้าทรัพย์: บีบ + แปลง WebP ก่อนเก็บเสมอ */
export async function uploadPropertyImages(
  _prev: UploadState,
  form: FormData,
): Promise<UploadState> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "ต้องเข้าสู่ระบบก่อน" };
  }

  const propertyId = Number(form.get("propertyId"));
  if (!Number.isInteger(propertyId) || propertyId <= 0) {
    return { ok: false, message: "ไม่พบทรัพย์" };
  }
  const prop = one<{ id: number; title: string }>(
    "SELECT id, title FROM properties WHERE id = ?",
    propertyId,
  );
  if (!prop) return { ok: false, message: "ไม่พบทรัพย์" };

  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!files.length) return { ok: false, message: "ยังไม่ได้เลือกไฟล์" };
  if (files.length > MAX_FILES) {
    return { ok: false, message: `อัปโหลดได้ครั้งละไม่เกิน ${MAX_FILES} รูป` };
  }
  for (const f of files) {
    if (f.size > MAX_UPLOAD_BYTES) {
      return { ok: false, message: `"${f.name}" ใหญ่เกิน 12MB` };
    }
  }

  const maxSort =
    one<{ m: number }>(
      "SELECT COALESCE(MAX(sort), -1) AS m FROM property_images WHERE property_id = ?",
      propertyId,
    )?.m ?? -1;

  let added = 0;
  let originalTotal = 0;
  let finalTotal = 0;
  const failed: string[] = [];

  // ทำทีละไฟล์ (sharp ใช้ thread pool อยู่แล้ว ยิงพร้อมกันหมดจะแย่งกันจนช้าลง)
  for (const [i, file] of files.entries()) {
    try {
      const out = await processImage(await file.arrayBuffer());
      run(
        `INSERT INTO property_images
           (property_id, url, alt, sort, thumb_url, width, height)
         VALUES (?,?,?,?,?,?,?)`,
        propertyId,
        out.url,
        `${prop.title} รูปที่ ${maxSort + added + 2}`,
        maxSort + i + 1,
        out.thumbUrl,
        out.width,
        out.height,
      );
      added++;
      originalTotal += out.originalBytes;
      finalTotal += out.bytes;
    } catch (e) {
      failed.push(file.name || `ไฟล์ที่ ${i + 1}`);
    }
  }

  if (!added) {
    return {
      ok: false,
      message: `อัปโหลดไม่สำเร็จ: ${failed.join(", ")}`,
    };
  }

  revalidatePath("/", "layout");

  // ถ้าเบราว์เซอร์ย่อมาก่อน ให้ใช้ขนาดต้นฉบับจริงที่ส่งมา (ไม่งั้นตัวเลขจะดูน้อยเกินจริง)
  const claimed = Number(form.get("originalBytes"));
  const trueOriginal =
    Number.isFinite(claimed) && claimed > originalTotal
      ? claimed
      : originalTotal;

  const pct =
    trueOriginal > 0 ? Math.round((1 - finalTotal / trueOriginal) * 100) : 0;
  const saved = `${(trueOriginal / 1048576).toFixed(1)}MB → ${(finalTotal / 1048576).toFixed(1)}MB (เล็กลง ${pct}%)`;

  return {
    ok: true,
    added,
    saved,
    message:
      `อัปโหลด ${added} รูปแล้ว · ${saved}` +
      (failed.length ? ` · ข้าม ${failed.length} ไฟล์` : ""),
  };
}

export async function deletePropertyImage(
  _prev: UploadState,
  form: FormData,
): Promise<UploadState> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "ต้องเข้าสู่ระบบก่อน" };
  }
  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, message: "ไม่พบรูป" };
  }

  const img = one<{ url: string; thumb_url: string }>(
    "SELECT url, thumb_url FROM property_images WHERE id = ?",
    id,
  );
  if (!img) return { ok: false, message: "ไม่พบรูป" };

  run("DELETE FROM property_images WHERE id = ?", id);

  // ลบไฟล์จริงด้วย แต่เฉพาะที่อยู่ในโฟลเดอร์ media เท่านั้น
  for (const u of [img.url, img.thumb_url]) {
    if (!u) continue;
    const name = u.split("/").pop();
    if (!name) continue;
    const full = mediaPath(decodeURIComponent(name));
    if (full) await unlink(full).catch(() => {});
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "ลบรูปแล้ว" };
}

/** เลื่อนลำดับรูป (รูปแรก = รูปปก) */
export async function movePropertyImage(
  _prev: UploadState,
  form: FormData,
): Promise<UploadState> {
  if (!(await requireAdmin())) {
    return { ok: false, message: "ต้องเข้าสู่ระบบก่อน" };
  }
  const id = Number(form.get("id"));
  const dir = String(form.get("dir") || "");
  if (!Number.isInteger(id) || !["up", "down"].includes(dir)) {
    return { ok: false, message: "คำสั่งไม่ถูกต้อง" };
  }

  const cur = one<{ id: number; property_id: number; sort: number }>(
    "SELECT id, property_id, sort FROM property_images WHERE id = ?",
    id,
  );
  if (!cur) return { ok: false, message: "ไม่พบรูป" };

  const rows = all<{ id: number }>(
    "SELECT id FROM property_images WHERE property_id = ? ORDER BY sort, id",
    cur.property_id,
  );
  const idx = rows.findIndex((r) => r.id === id);
  const swap = dir === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= rows.length) {
    return { ok: true, message: "" };
  }

  // เขียน sort ใหม่ทั้งชุดตามลำดับที่สลับแล้ว — กันค่า sort ซ้ำจากข้อมูลเก่า
  const order = [...rows];
  [order[idx], order[swap]] = [order[swap], order[idx]];
  order.forEach((r, i) =>
    run("UPDATE property_images SET sort = ? WHERE id = ?", i, r.id),
  );

  revalidatePath("/", "layout");
  return { ok: true, message: "" };
}
