/**
 * อ่านพิกัดจากลิงก์ Google Maps ทุกรูปแบบที่คนไทยชอบก็อปมาวาง
 * - https://www.google.com/maps/@13.7563,100.5018,17z
 * - .../place/ชื่อ/@13.75,100.50,17z/data=!3m1!4b1!4m6!...!3d13.7563!4d100.5018
 * - https://maps.google.com/?q=13.7563,100.5018
 * - https://maps.app.goo.gl/xxxx  (ลิงก์ย่อ ต้อง resolve ก่อน)
 * - โค้ด <iframe src="https://www.google.com/maps/embed?pb=..."> (ก็อปทั้งก้อนมาวางได้)
 */

export type GeoPoint = { lat: number; lng: number };

const inRange = (lat: number, lng: number) =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180 &&
  !(lat === 0 && lng === 0);

/** ดึง src ออกมาถ้าผู้ใช้วางโค้ด iframe ทั้งก้อน */
export function unwrapIframe(input: string): string {
  const m = String(input || "").match(/src\s*=\s*["']([^"']+)["']/i);
  return m ? m[1] : String(input || "").trim();
}

export function isShortLink(url: string): boolean {
  return /(maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(url);
}

/** อ่านพิกัดจากข้อความลิงก์ (ไม่ยิงเน็ต) */
export function parseCoords(input: string): GeoPoint | null {
  const url = unwrapIframe(input);
  if (!url) return null;

  let decoded = url;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    /* ลิงก์มี % ที่ decode ไม่ได้ ใช้ตัวเดิมต่อ */
  }

  // !3dLAT!4dLNG — พิกัดหมุดจริงใน URL แบบ /place/ (แม่นสุด ใช้ก่อน)
  const bang = decoded.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (bang) {
    const lat = Number(bang[1]);
    const lng = Number(bang[2]);
    if (inRange(lat, lng)) return { lat, lng };
  }

  // โค้ด iframe ของ Google (pb=...) สลับลำดับ: !2d = ลองจิจูด, !3d = ละติจูด
  const pb = decoded.match(/!2d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
  if (pb) {
    const lng = Number(pb[1]);
    const lat = Number(pb[2]);
    if (inRange(lat, lng)) return { lat, lng };
  }

  // ?q=LAT,LNG หรือ ?query=LAT,LNG หรือ ?destination=LAT,LNG
  const q = decoded.match(
    /[?&](?:q|query|destination|center|ll)=(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/,
  );
  if (q) {
    const lat = Number(q[1]);
    const lng = Number(q[2]);
    if (inRange(lat, lng)) return { lat, lng };
  }

  // @LAT,LNG,17z — จุดกึ่งกลางจอ (หยาบกว่า !3d!4d เลยไว้ทีหลัง)
  const at = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) {
    const lat = Number(at[1]);
    const lng = Number(at[2]);
    if (inRange(lat, lng)) return { lat, lng };
  }

  // เผื่อผู้ใช้วางแค่ "13.7563, 100.5018"
  const plain = decoded
    .trim()
    .match(/^(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)$/);
  if (plain) {
    const lat = Number(plain[1]);
    const lng = Number(plain[2]);
    if (inRange(lat, lng)) return { lat, lng };
  }

  return null;
}

/**
 * คลายลิงก์ย่อ (maps.app.goo.gl) ให้เป็นลิงก์เต็ม
 * ยิงเน็ตจริง — เรียกได้เฉพาะฝั่งเซิร์ฟเวอร์ตอนกดบันทึกเท่านั้น
 */
export async function expandShortLink(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
      headers: {
        // ไม่ใส่ UA จริง Google จะตอบหน้า consent แทน redirect
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
    });
    if (res.url && res.url !== url) return res.url;

    // บางเคส Google ส่ง redirect ผ่าน meta/JS ในตัว body
    const body = await res.text();
    const m = body.match(/https:\/\/www\.google\.com\/maps[^"'\\<\s]+/);
    return m ? m[0] : null;
  } catch {
    return null;
  }
}

/** พิกัด -> URL สำหรับ <iframe> (ไม่ต้องมี API key ไม่มีค่าใช้จ่าย) */
export function embedUrl(lat: number, lng: number, zoom = 16): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=th&output=embed`;
}

/** พิกัด -> ลิงก์เปิดแอป Google Maps */
export function externalUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
