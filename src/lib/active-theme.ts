import { one, run } from "./db";
import { DEFAULT_THEME, getTheme, isThemeId, type Theme, type ThemeId } from "./themes";

/**
 * ธีมที่ใช้อยู่ — เก็บใน settings key='theme'
 * อ่านจาก DB ทุกครั้ง (หน้าเป็น SSG อยู่แล้ว จึงอ่านแค่ตอน build/revalidate)
 */
export function getActiveThemeId(): ThemeId {
  try {
    const row = one<{ value: string }>(
      "SELECT value FROM settings WHERE key = 'theme'",
    );
    const v = row?.value?.trim();
    return isThemeId(v) ? v : DEFAULT_THEME;
  } catch {
    // DB ยังไม่พร้อม (ตอน build ครั้งแรก) -> ธีมเริ่มต้น
    return DEFAULT_THEME;
  }
}

export function getActiveTheme(): Theme {
  return getTheme(getActiveThemeId());
}

export function saveActiveTheme(id: ThemeId): void {
  run(
    `INSERT INTO settings (key, value, updated_at)
     VALUES ('theme', ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
    id,
  );
}
