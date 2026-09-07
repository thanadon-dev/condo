"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { saveActiveTheme } from "@/lib/active-theme";
import { getTheme, isThemeId } from "@/lib/themes";

export type ThemeState = { ok: boolean; message: string };

/**
 * เปลี่ยนธีมทั้งเว็บ
 * ธีมกระทบทุกหน้า (สี/ฟอนต์อยู่ที่ <html> ใน root layout)
 * -> ต้อง revalidate แบบ "layout" ที่ราก ไม่ใช่รายหน้า ไม่งั้นหน้าที่ prerender ไว้ยังเป็นธีมเดิม
 */
export async function switchTheme(
  _prev: ThemeState,
  form: FormData,
): Promise<ThemeState> {
  if (!(await requireAdmin())) return { ok: false, message: "ไม่มีสิทธิ์" };

  const id = String(form.get("theme") || "");
  if (!isThemeId(id)) return { ok: false, message: "ไม่รู้จักธีมนี้" };

  try {
    saveActiveTheme(id);
  } catch {
    return { ok: false, message: "บันทึกไม่สำเร็จ" };
  }

  try {
    // "layout" ที่ "/" = ล้างทุกหน้าที่อยู่ใต้ root layout (คือทั้งเว็บ)
    revalidatePath("/", "layout");
  } catch {
    /* ignore */
  }

  return {
    ok: true,
    message: `ใช้ธีม “${getTheme(id).name}” แล้ว · หน้าเว็บเปลี่ยนทันที`,
  };
}
