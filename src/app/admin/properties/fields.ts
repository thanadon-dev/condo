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
  { key: "price", label: "ราคา (บาท)", type: "number", placeholder: "12500000" },
  {
    key: "location",
    label: "ที่ตั้งแบบเต็ม",
    placeholder: "ถนน, แขวง, จังหวัด",
    full: true,
  },
  { key: "beds", label: "ห้องนอน", type: "number" },
  { key: "baths", label: "ห้องน้ำ", type: "number" },
  { key: "area", label: "พื้นที่ (ตร.ม.)", type: "number" },
  { key: "floor", label: "ชั้น", placeholder: "เช่น ชั้น 24" },
  { key: "year", label: "ปีที่สร้าง", placeholder: "เช่น 2564" },
  { key: "park", label: "ที่จอดรถ", placeholder: "เช่น 1 คัน" },
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
