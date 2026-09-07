import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getTheme, isThemeId, themeVars, THEMES } from "@/lib/themes";
import { getActiveThemeId } from "@/lib/active-theme";
import HomeContent from "@/components/HomeContent";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ดูตัวอย่างธีม",
  robots: { index: false, follow: false },
};

/**
 * พรีวิวธีมก่อนใช้จริง — แอดมินเท่านั้น
 *
 * เหตุผลที่ทำเป็น route แยกแทนคุกกี้/query บนหน้าจริง:
 * อ่านคุกกี้หรือ searchParams ในหน้า `/` จะทำให้ Next ถอดหน้านั้นออกจาก SSG
 * กลายเป็น dynamic ทั้งเว็บ -> SEO และความเร็วเสียหมด
 * แยก route ทำให้หน้าจริงยังเป็น static เหมือนเดิม
 *
 * ตัวแปรธีมใส่ที่ <div> ครอบ ไม่ใช่ <html> — CSS variable ถ่ายทอดลงลูกได้อยู่แล้ว
 * จึงทับค่าของ root layout ได้ทั้งก้อนโดยไม่ต้องแตะ layout จริง
 */
export default async function ThemePreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await requireAdmin())) redirect("/login");

  const { id } = await params;
  if (!isThemeId(id)) notFound();

  const theme = getTheme(id);
  const active = getActiveThemeId();
  const vars = themeVars(theme);
  const i = THEMES.findIndex((t) => t.id === id);
  const prev = THEMES[(i - 1 + THEMES.length) % THEMES.length];
  const next = THEMES[(i + 1) % THEMES.length];

  return (
    <div
      data-btn={theme.layout.ghostBtn ? "ghost" : "solid"}
      style={
        {
          ...vars,
          "--t-scheme": theme.layout.dark ? "dark" : "light",
          background: "var(--t-bg)",
          color: "var(--t-ink)",
          minHeight: "100vh",
        } as React.CSSProperties
      }
    >
      <SiteHeader />
      <main>
        <HomeContent theme={theme} />
      </main>
      <SiteFooter />

      <div className="theme-preview-bar">
        <span>
          ตัวอย่าง: <strong>{theme.name}</strong> ({theme.code})
          {theme.id === active && " · ใช้อยู่"}
        </span>
        <Link href={`/theme-preview/${prev.id}`}>← ก่อนหน้า</Link>
        <Link href={`/theme-preview/${next.id}`}>ถัดไป →</Link>
        <Link href="/admin/themes">ปิด</Link>
      </div>
    </div>
  );
}
