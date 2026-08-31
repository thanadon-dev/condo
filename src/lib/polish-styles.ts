/** ไฟล์บริสุทธิ์ — ห้าม import node:child_process ที่นี่ เพราะ client component ใช้ไฟล์นี้ */

export const POLISH_STYLES = [
  {
    key: "listing",
    label: "ประกาศเช่า",
    hint: "จัดบรรทัดอ่านง่าย ใช้อิโมจิพอดี",
    recommended: true,
  },
  {
    key: "formal",
    label: "ทางการ",
    hint: "สุภาพ ไม่ใช้อิโมจิ",
    recommended: false,
  },
  {
    key: "short",
    label: "สั้นกระชับ",
    hint: "เหลือเฉพาะข้อมูลสำคัญ",
    recommended: false,
  },
] as const;

export type PolishStyle = (typeof POLISH_STYLES)[number]["key"];

export function isPolishStyle(v: string): v is PolishStyle {
  return POLISH_STYLES.some((s) => s.key === v);
}
