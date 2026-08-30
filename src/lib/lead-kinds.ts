export const LEAD_KINDS = [
  "นัดชมบ้าน",
  "สอบถามข้อมูล",
  "ฝากปล่อยเช่า",
  "ประเมินราคา",
] as const;

export type LeadKind = (typeof LEAD_KINDS)[number];
