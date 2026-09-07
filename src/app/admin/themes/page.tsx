import { getActiveThemeId } from "@/lib/active-theme";
import ThemePicker from "@/components/admin/ThemePicker";
import { THEMES } from "@/lib/themes";

export const dynamic = "force-dynamic";

export default function AdminThemes() {
  const active = getActiveThemeId();

  return (
    <>
      <div className="mb-8">
        <h1 className="display text-[26px] th">ธีมเว็บ</h1>
        <p className="th mt-1 text-[13px] text-muted">
          เลือกได้ {THEMES.length} สไตล์ · เปลี่ยนแล้วหน้าเว็บอัปเดตทันที
          ข้อมูลทรัพย์ บทความ และลูกค้าไม่ถูกแตะต้อง
        </p>
      </div>

      <ThemePicker active={active} />
    </>
  );
}
