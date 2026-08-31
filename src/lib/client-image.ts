/**
 * ย่อรูปฝั่งเบราว์เซอร์ก่อนอัปโหลด
 * เหตุผล: รูปจากมือถือใบละ 5-10MB ถ้าส่งดิบ ๆ ผ่านเน็ตมือถือจะรอเป็นนาที
 * ย่อเหลือ 1920 + แปลง WebP ก่อนส่ง = เหลือหลักร้อย KB อัปโหลดเสร็จในไม่กี่วินาที
 * เซิร์ฟเวอร์ยังบีบซ้ำอีกชั้นเสมอ (ไม่เชื่อไฟล์จาก client)
 */

const MAX_EDGE = 1920;
const QUALITY = 0.82;

/** เบราว์เซอร์รองรับ createImageBitmap + canvas.toBlob(webp) ไหม */
function canCompress(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof createImageBitmap !== "function") return false;
  const c = document.createElement("canvas");
  return c.toDataURL("image/webp").startsWith("data:image/webp");
}

export type PreparedFile = {
  file: File;
  originalBytes: number;
  bytes: number;
};

/**
 * คืนไฟล์ที่ย่อแล้ว ถ้าย่อไม่ได้ (เบราว์เซอร์เก่า/ไฟล์แปลก) คืนไฟล์เดิม
 * ไม่มีทาง throw — ล้มเหลวแล้วให้เซิร์ฟเวอร์จัดการต่อ
 */
export async function prepareImage(file: File): Promise<PreparedFile> {
  const original = file.size;
  if (!canCompress()) return { file, originalBytes: original, bytes: original };

  try {
    // imageOrientation: "from-image" = หมุนตาม EXIF ให้เลย (รูปแนวตั้งจากมือถือ)
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });

    const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bmp.close();
      return { file, originalBytes: original, bytes: original };
    }
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();

    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/webp", QUALITY),
    );
    canvas.width = 0;
    canvas.height = 0;

    // ถ้าย่อแล้วไม่เล็กลง ใช้ของเดิมดีกว่า
    if (!blob || blob.size >= original) {
      return { file, originalBytes: original, bytes: original };
    }

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return {
      file: new File([blob], name, { type: "image/webp" }),
      originalBytes: original,
      bytes: blob.size,
    };
  } catch {
    return { file, originalBytes: original, bytes: original };
  }
}
