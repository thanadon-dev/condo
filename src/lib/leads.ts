import { one, run } from "./db";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
  kind: string;
  propertyId: number | null;
  propertyTitle: string;
  source: string;
};

import { LEAD_KINDS } from "./lead-kinds";

export { LEAD_KINDS };

const KINDS = new Set<string>(LEAD_KINDS);

const PHONE_RE = /^[0-9+\-() ]{8,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

export function validateLead(raw: Record<string, unknown>): {
  ok: boolean;
  value: LeadInput;
  errors: LeadErrors;
} {
  const s = (v: unknown, max: number) =>
    String(v ?? "")
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
      .trim()
      .slice(0, max);

  const value: LeadInput = {
    name: s(raw.name, 80),
    phone: s(raw.phone, 20),
    email: s(raw.email, 120),
    message: s(raw.message, 1500),
    kind: KINDS.has(s(raw.kind, 40)) ? s(raw.kind, 40) : "สอบถามข้อมูล",
    propertyId:
      String(raw.propertyId ?? "").trim() !== "" &&
      Number.isInteger(Number(raw.propertyId)) &&
      Number(raw.propertyId) > 0
        ? Number(raw.propertyId)
        : null,
    propertyTitle: s(raw.propertyTitle, 160),
    source: s(raw.source, 160),
  };

  const errors: LeadErrors = {};
  if (value.name.length < 2) errors.name = "กรุณากรอกชื่อ";
  if (!PHONE_RE.test(value.phone)) errors.phone = "เบอร์โทรไม่ถูกต้อง";
  if (value.email && !EMAIL_RE.test(value.email))
    errors.email = "อีเมลไม่ถูกต้อง";
  if (value.message.length > 1500) errors.message = "ข้อความยาวเกินไป";

  return { ok: Object.keys(errors).length === 0, value, errors };
}

export function insertLead(v: LeadInput): number {
  const r = run(
    `INSERT INTO leads (name,phone,email,message,kind,property_id,property_title,source)
     VALUES (?,?,?,?,?,?,?,?)`,
    v.name,
    v.phone,
    v.email,
    v.message,
    v.kind,
    v.propertyId,
    v.propertyTitle,
    v.source,
  );
  return Number(r.lastInsertRowid);
}

export function markNotified(id: number): void {
  run("UPDATE leads SET notified = 1 WHERE id = ?", id);
}

export function recentLeadCount(phone: string, minutes = 10): number {
  const row = one<{ c: number }>(
    `SELECT COUNT(*) AS c FROM leads
     WHERE phone = ? AND created_at > datetime('now', ?)`,
    phone,
    `-${minutes} minutes`,
  );
  return row?.c ?? 0;
}

export function leadsTodayCount(): number {
  const row = one<{ c: number }>(
    "SELECT COUNT(*) AS c FROM leads WHERE created_at > datetime('now','-1 day')",
  );
  return row?.c ?? 0;
}
