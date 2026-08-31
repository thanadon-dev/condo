import type { Field } from "@/components/admin/AdminForm";

export const CATS = ["คอนโด", "บ้านเช่า"] as const;
export const TYPES = [
  "คอนโดมิเนียม",
  "บ้านเดี่ยว",
  "ทาวน์โฮม",
  "เพนท์เฮาส์",
] as const;

export const PROPERTY_FIELDS: Field[] = [
  {
    key: "title",
    label: "ชื่อทรัพย์",
    placeholder: "เช่น เดอะ ลอฟท์ สาทร",
    full: true,
  },
  { key: "cat", label: "หมวดหมู่", select: CATS },
  { key: "type", label: "ประเภท", select: TYPES },
  { key: "district", label: "ทำเล", placeholder: "เช่น สาทร" },
  {
    key: "price",
    label: "ค่าเช่า (บาท/เดือน)",
    type: "number",
    placeholder: "28000",
  },
  {
    key: "location",
    label: "ที่ตั้งแบบเต็ม",
    placeholder: "ถนน, แขวง, จังหวัด",
    full: true,
  },
  { key: "beds", label: "ห้องนอน", type: "number" },
  { key: "baths", label: "ห้องน้ำ", type: "number" },
  {
    key: "area",
    label: "พื้นที่ (ตร.ม.)",
    type: "number",
    step: "0.01",
    placeholder: "เช่น 22.70",
  },
  { key: "floor", label: "ชั้น", placeholder: "เช่น ชั้น 24" },
  { key: "building", label: "อาคาร", placeholder: "เช่น อาคาร A" },
  { key: "park", label: "ที่จอดรถ", placeholder: "เช่น 1 คัน" },
  {
    key: "map_url",
    label: "ลิงก์ Google Maps",
    placeholder: "วางลิงก์จากปุ่ม 'แชร์' ใน Google Maps ได้เลย",
    full: true,
  },
  {
    key: "descr",
    label: "รายละเอียด",
    area: true,
    rows: 3,
    full: true,
  },
  {
    key: "descr2",
    label: "รายละเอียดเพิ่มเติม",
    area: true,
    rows: 3,
    full: true,
  },
];
