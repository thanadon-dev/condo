import { getSettingsFlat } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default function AdminSettings() {
  const values = getSettingsFlat();

  return (
    <>
      <div className="mb-8">
        <h1 className="display text-[26px] th">ตั้งค่าเว็บ</h1>
        <p className="th mt-1 text-[13px] text-muted">
          ข้อมูลติดต่อและชื่อที่แสดงบนหน้าเว็บทั้งหมด · บันทึกแล้วหน้าเว็บอัปเดตทันที
        </p>
      </div>

      <SettingsForm values={values} />
    </>
  );
}
