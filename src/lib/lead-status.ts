export const LEAD_STATUSES = ["new", "contacted", "closed"] as const;

export const STATUS_LABEL: Record<string, string> = {
  new: "ใหม่",
  contacted: "ติดต่อแล้ว",
  closed: "ปิดงาน",
};
