"use server";

import { validateLead, insertLead, markNotified, recentLeadCount } from "@/lib/leads";
import { notify } from "@/lib/notify";
import { SITE_URL } from "@/lib/site";

export type LeadState = {
  ok: boolean;
  message: string;
  errors: Record<string, string>;
};

export async function submitLead(
  _prev: LeadState,
  form: FormData,
): Promise<LeadState> {
  if (String(form.get("company") || "").trim() !== "") {
    return { ok: true, message: "ส่งข้อมูลเรียบร้อยแล้ว", errors: {} };
  }

  const raw = Object.fromEntries(form.entries());
  const { ok, value, errors } = validateLead(raw);

  if (!ok) {
    return {
      ok: false,
      message: "กรุณาตรวจสอบข้อมูลอีกครั้ง",
      errors: errors as Record<string, string>,
    };
  }

  if (recentLeadCount(value.phone, 10) >= 3) {
    return {
      ok: false,
      message: "ส่งคำขอถี่เกินไป กรุณารออีกสักครู่",
      errors: {},
    };
  }

  let id: number;
  try {
    id = insertLead(value);
  } catch {
    return {
      ok: false,
      message: "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่หรือโทรหาเราโดยตรง",
      errors: {},
    };
  }

  const lines = [
    "ลูกค้าใหม่ — Condo D Property",
    `เรื่อง: ${value.kind}`,
    `ชื่อ: ${value.name}`,
    `โทร: ${value.phone}`,
    value.email ? `อีเมล: ${value.email}` : "",
    value.propertyTitle ? `ทรัพย์: ${value.propertyTitle}` : "",
    value.source ? `หน้า: ${SITE_URL}${value.source}` : "",
    value.message ? `ข้อความ: ${value.message}` : "",
    `#lead${id}`,
  ].filter(Boolean);

  if (await notify(lines.join("\n"))) markNotified(id);

  return {
    ok: true,
    message: "ส่งข้อมูลเรียบร้อยแล้ว ผมจะติดต่อกลับโดยเร็วที่สุด",
    errors: {},
  };
}
