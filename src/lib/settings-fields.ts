/** ไฟล์บริสุทธิ์ — ห้าม import db/settings ที่นี่ เพราะ client component ใช้ไฟล์นี้ */

export type SettingKey =
  | "name"
  | "tagline"
  | "phone"
  | "mobile"
  | "line"
  | "email"
  | "address"
  | "agentName"
  | "agentRole"
  | "agentLicense";

export type SiteFlat = Record<SettingKey, string>;

export const SETTING_KEYS: SettingKey[] = [
  "name",
  "tagline",
  "phone",
  "mobile",
  "line",
  "email",
  "address",
  "agentName",
  "agentRole",
  "agentLicense",
];

export const FIELDS: {
  key: SettingKey;
  label: string;
  hint?: string;
  full?: boolean;
  group: string;
}[] = [
  { key: "name", label: "ชื่อเว็บ / บริษัท", group: "ข้อมูลเว็บ", full: true },
  {
    key: "tagline",
    label: "คำโปรย",
    hint: "แสดงใต้ชื่อใน footer",
    group: "ข้อมูลเว็บ",
    full: true,
  },
  {
    key: "phone",
    label: "เบอร์สำนักงาน",
    hint: "แสดงบนแถบเมนูและ footer",
    group: "ช่องทางติดต่อ",
  },
  {
    key: "mobile",
    label: "เบอร์มือถือ",
    hint: "ใช้เป็นปุ่มโทรออกในหน้าติดต่อและเมนูมือถือ",
    group: "ช่องทางติดต่อ",
  },
  { key: "line", label: "LINE ID", group: "ช่องทางติดต่อ" },
  { key: "email", label: "อีเมล", group: "ช่องทางติดต่อ" },
  { key: "address", label: "ที่อยู่", group: "ช่องทางติดต่อ", full: true },
  { key: "agentName", label: "ชื่อผู้ดูแล", group: "ที่ปรึกษา" },
  { key: "agentRole", label: "ตำแหน่ง", group: "ที่ปรึกษา" },
  { key: "agentLicense", label: "เลขใบอนุญาต", group: "ที่ปรึกษา" },
];

export const GROUPS = ["ข้อมูลเว็บ", "ช่องทางติดต่อ", "ที่ปรึกษา"];

export function isSettingKey(k: string): k is SettingKey {
  return (SETTING_KEYS as string[]).includes(k);
}
