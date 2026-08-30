import type { Field } from "@/components/admin/AdminForm";

export const DEAL_CATS = ["บ้านเช่า", "คอนโดปล่อยเช่า", "ขายขาด"] as const;

export const DEAL_FIELDS: Field[] = [
  { key: "closed_on", label: "วันที่ปิดดีล (ค.ศ.)", type: "date" },
  { key: "cat", label: "ประเภทผลงาน", select: DEAL_CATS },
  {
    key: "title",
    label: "หัวข้อผลงาน",
    placeholder: "เช่น ปล่อยเช่าคอนโดอโศกได้ใน 2 สัปดาห์",
    full: true,
  },
  { key: "location", label: "ทำเล", placeholder: "แขวง, จังหวัด" },
  { key: "value", label: "มูลค่าดีล", placeholder: "เช่น 42,000 บาท / เดือน" },
  {
    key: "body",
    label: "รายละเอียด",
    area: true,
    rows: 8,
    placeholder: "เล่าที่มา ปัญหา วิธีที่ใช้ และผลลัพธ์ · เว้นบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่",
    full: true,
  },
];

export const ARTICLE_FIELDS: Field[] = [
  {
    key: "title",
    label: "หัวข้อบทความ",
    placeholder: "เช่น ตั้งราคาเช่าเท่าไหร่จึงได้ผู้เช่าเร็ว",
    full: true,
  },
  { key: "tag", label: "หมวด", placeholder: "เช่น คู่มือผู้ปล่อยเช่า" },
  { key: "published_on", label: "วันที่เผยแพร่ (ค.ศ.)", type: "date" },
  { key: "read_time", label: "เวลาอ่าน", placeholder: "เช่น 6 นาที" },
  {
    key: "lead",
    label: "คำนำ",
    area: true,
    rows: 3,
    placeholder: "สรุปใจความสำคัญใน 1–2 ประโยค",
    full: true,
  },
  {
    key: "body",
    label: "เนื้อหา — เว้นบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่",
    area: true,
    rows: 14,
    full: true,
  },
];
