import { execFile, type ExecFileException } from "node:child_process";

/**
 * เรียก Claude CLI มาเรียบเรียงข้อความประกาศเช่า (shelling out)
 *
 * ความปลอดภัย:
 * - ใช้ execFile + array args ไม่ผ่าน shell -> ไม่มี shell injection
 * - ส่ง prompt ทาง stdin ไม่ใช่ argv -> ไม่ชน ARG_MAX และข้อความยาวไม่พัง
 * - timeout + maxBuffer กันค้าง/กินแรม
 */

import { POLISH_STYLES, isPolishStyle, type PolishStyle } from "./polish-styles";

export { POLISH_STYLES, isPolishStyle };
export type { PolishStyle };

const RULES: Record<PolishStyle, string> = {
  listing: `เรียบเรียงเป็นประกาศปล่อยเช่าที่อ่านง่ายบนมือถือ
- แยกเป็นบรรทัดสั้น ๆ บรรทัดละประเด็น
- ใช้อิโมจิเปิดหัวบรรทัดเท่าที่เหมาะ (เช่น 💰 ราคา, 🛏 ห้องนอน, 📍 ทำเล, ✅ สิ่งที่รวมให้, ❌ ข้อห้าม) ไม่เกิน 1 ตัวต่อบรรทัด
- จัดกลุ่มเรื่องเดียวกันไว้ด้วยกัน คั่นแต่ละกลุ่มด้วยบรรทัดว่าง`,
  formal: `เรียบเรียงด้วยภาษาสุภาพเป็นทางการ
- ห้ามใช้อิโมจิเด็ดขาด
- เขียนเป็นย่อหน้าที่อ่านลื่น ไม่ใช้เครื่องหมายหัวข้อ
- ใช้คำสุภาพ เช่น "ห้องพัก" "ผู้เช่า" "ค่าเช่ารายเดือน"`,
  short: `ย่อให้สั้นที่สุดโดยไม่ตัดข้อมูลสำคัญ
- เหลือเฉพาะ ราคา / ขนาด / จำนวนห้อง / ทำเล / เงื่อนไขสำคัญ
- บรรทัดละประเด็น ไม่เกิน 8 บรรทัด
- ตัดคำโฆษณาเกินจริงและคำฟุ่มเฟือยออก`,
};

function buildPrompt(text: string, style: PolishStyle): string {
  return `คุณคือบรรณาธิการประกาศอสังหาริมทรัพย์ให้เช่าในไทย

งาน: เรียบเรียงข้อความประกาศด้านล่างให้อ่านง่ายและน่าเชื่อถือขึ้น

${RULES[style]}

กฎเหล็ก (ห้ามฝ่าฝืน):
- ห้ามแต่งข้อมูลใหม่ที่ไม่มีในต้นฉบับเด็ดขาด (ห้ามเดาราคา ขนาด ชื่อโครงการ สิ่งอำนวยความสะดวก)
- ตัวเลขทุกตัวต้องตรงกับต้นฉบับเป๊ะ ๆ
- ถ้าต้นฉบับไม่ได้บอกอะไรไว้ ห้ามเติมเอง
- ตอบกลับเป็นข้อความที่เรียบเรียงแล้วเท่านั้น ห้ามมีคำอธิบาย ห้ามมีคำนำ ห้ามครอบด้วย \`\`\`

--- ต้นฉบับ ---
${text}
--- จบต้นฉบับ ---`;
}

export type PolishResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export function polishWithClaude(
  text: string,
  style: PolishStyle,
): Promise<PolishResult> {
  const prompt = buildPrompt(text, style);

  return new Promise((resolve) => {
    const child = execFile(
      "claude",
      ["-p", "--output-format", "text"],
      {
        encoding: "utf8" as const,
        timeout: 120_000,
        maxBuffer: 2 * 1024 * 1024,
        env: {
          ...process.env,
          PATH: process.env.PATH || "/home/mark/.local/bin:/usr/bin:/bin",
          HOME: process.env.HOME || "/home/mark",
          // CI=1 ปิด spinner/prompt ให้ stdout สะอาด
          CI: "1",
        },
      },
      (err: ExecFileException | null, stdout: string, stderr: string) => {
        if (err) {
          if (err.killed) {
            return resolve({
              ok: false,
              error: "ใช้เวลานานเกินไป ลองใหม่อีกครั้ง",
            });
          }
          if (err.code === "ENOENT") {
            return resolve({
              ok: false,
              error: "ไม่พบคำสั่ง claude บนเครื่อง",
            });
          }
          return resolve({
            ok: false,
            error: String(stderr || err.message).slice(0, 160),
          });
        }

        const out = cleanOutput(stdout);
        if (!out) {
          return resolve({ ok: false, error: "AI ไม่ได้ตอบข้อความกลับมา" });
        }
        resolve({ ok: true, text: out });
      },
    );

    child.stdin?.end(prompt);
  });
}

/** ตัดกรอบโค้ด/คำนำที่โมเดลอาจแถมมา */
function cleanOutput(raw: string): string {
  let s = String(raw || "").trim();

  // ```lang ... ```
  const fence = s.match(/^```[a-zA-Z]*\n([\s\S]*?)\n```$/);
  if (fence) s = fence[1].trim();

  // เผลอขึ้นต้นด้วยคำนำ
  s = s.replace(/^(นี่คือ|ข้อความที่เรียบเรียงแล้ว|ผลลัพธ์)[:：]\s*/i, "");

  return s.replace(/\r\n/g, "\n").trim();
}
