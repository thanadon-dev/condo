import { all, run } from "./db";
import { SITE, type SiteInfo } from "./site";
import {
  isSettingKey,
  type SettingKey,
  type SiteFlat,
} from "./settings-fields";

export { isSettingKey };
export type { SettingKey, SiteFlat };

export const DEFAULTS: SiteFlat = {
  name: SITE.name,
  tagline: SITE.tagline,
  phone: SITE.phone,
  mobile: SITE.mobile,
  line: SITE.line,
  lineUrl: SITE.lineUrl,
  email: SITE.email,
  address: SITE.address,
  agentName: SITE.agent.name,
  agentRole: SITE.agent.role,
  agentLicense: SITE.agent.license,
  gaId: SITE.gaId,
};

/** อ่านค่าจริงจาก DB ทับค่า default — ค่าว่างถือว่าไม่ตั้ง ใช้ default แทน */
export function getSettings(): SiteInfo {
  const flat = { ...DEFAULTS };
  try {
    for (const r of all<{ key: string; value: string }>(
      "SELECT key, value FROM settings",
    )) {
      if (isSettingKey(r.key) && String(r.value).trim()) {
        flat[r.key] = String(r.value).trim();
      }
    }
  } catch {
    /* DB ยังไม่พร้อม -> ใช้ default */
  }

  return {
    name: flat.name,
    tagline: flat.tagline,
    phone: flat.phone,
    mobile: flat.mobile,
    line: flat.line,
    lineUrl: flat.lineUrl,
    email: flat.email,
    address: flat.address,
    agent: {
      name: flat.agentName,
      role: flat.agentRole,
      license: flat.agentLicense,
    },
    gaId: flat.gaId,
  };
}

export function getSettingsFlat(): SiteFlat {
  const s = getSettings();
  return {
    name: s.name,
    tagline: s.tagline,
    phone: s.phone,
    mobile: s.mobile,
    line: s.line,
    lineUrl: s.lineUrl,
    email: s.email,
    address: s.address,
    agentName: s.agent.name,
    agentRole: s.agent.role,
    agentLicense: s.agent.license,
    gaId: s.gaId,
  };
}

export function saveSettings(values: Partial<SiteFlat>): void {
  for (const [k, v] of Object.entries(values)) {
    if (!isSettingKey(k)) continue;
    run(
      `INSERT INTO settings (key, value, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
      k,
      String(v ?? "").trim(),
    );
  }
}

/** เบอร์สำหรับ href="tel:" — ตัดช่องว่างและขีด */
export function telHref(phone: string): string {
  return "tel:" + String(phone || "").replace(/[\s-]/g, "");
}
