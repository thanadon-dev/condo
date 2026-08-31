"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { saveSettings } from "@/lib/settings";
import { isSettingKey, type SiteFlat } from "@/lib/settings-fields";

export type SettingsState = { ok: boolean; message: string };

const clean = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .trim()
    .slice(0, max);

export async function saveSiteSettings(
  _prev: SettingsState,
  form: FormData,
): Promise<SettingsState> {
  if (!(await requireAdmin())) return { ok: false, message: "ไม่มีสิทธิ์" };

  const values: Partial<SiteFlat> = {};
  for (const [k, v] of form.entries()) {
    if (isSettingKey(k)) values[k] = clean(v, k === "tagline" ? 300 : 160);
  }

  if (!values.name || values.name.length < 2)
    return { ok: false, message: "กรุณากรอกชื่อเว็บ" };

  if (values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email))
    return { ok: false, message: "อีเมลไม่ถูกต้อง" };

  for (const key of ["phone", "mobile"] as const) {
    const v = values[key];
    if (v && !/^[0-9+\s-]{6,20}$/.test(v))
      return { ok: false, message: "เบอร์โทรใส่ได้เฉพาะตัวเลข เว้นวรรค + และ -" };
  }

  try {
    saveSettings(values);
  } catch {
    return { ok: false, message: "บันทึกไม่สำเร็จ" };
  }

  for (const p of [
    "/",
    "/properties",
    "/journal",
    "/about",
    "/contact",
    "/favorites",
    "/sitemap.xml",
    "/admin/settings",
  ]) {
    try {
      revalidatePath(p, p === "/" ? "layout" : "page");
    } catch {
      /* ignore */
    }
  }

  return { ok: true, message: "บันทึกแล้ว · หน้าเว็บอัปเดตทันที" };
}
