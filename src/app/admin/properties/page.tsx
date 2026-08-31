import Link from "next/link";
import { adminProperties } from "@/lib/admin";
import { baht } from "@/lib/site";
import CreatePanel from "@/components/admin/CreatePanel";
import DeleteButton from "@/components/admin/DeleteButton";
import { saveProperty, deleteProperty } from "@/app/actions/admin";
import { PROPERTY_FIELDS } from "./fields";

export const dynamic = "force-dynamic";

export default function AdminProperties() {
  const items = adminProperties();

  const actionBtn =
    "th text-[12px] px-3 py-1.5 border border-line-2 hover:border-ink transition-colors";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="display text-[26px] th">ทรัพย์ในระบบ</h2>
          <p className="th mt-1 text-[13px] text-muted">
            ทั้งหมด {items.length} รายการ · แก้ไขแล้วอัปเดตบนหน้าเว็บทันที
          </p>
        </div>
        <CreatePanel
          action={saveProperty}
          fields={PROPERTY_FIELDS}
          title="เพิ่มทรัพย์ใหม่"
          buttonLabel="+ เพิ่มทรัพย์"
        />
      </div>

      {/* มือถือ: การ์ด */}
      <div className="grid gap-3 md:hidden">
        {items.map((p) => (
          <div key={p.id} className="border border-line-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="th text-[14.5px] font-medium leading-snug">
                  {p.title}
                </div>
                <div className="th text-[11.5px] text-muted mt-1">
                  {p.code} · {p.type} · {p.district}
                </div>
              </div>
              <span
                className={`th text-[11px] px-2 py-1 border shrink-0 ${
                  p.published
                    ? "border-line-2 text-ink-2"
                    : "border-line-2 text-muted"
                }`}
              >
                {p.published ? "เผยแพร่" : "ซ่อน"}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 th text-[13px] text-ink-2">
              <span>{baht(p.price)} / เดือน</span>
              <span className="text-line">·</span>
              <span>{p.area} ตร.ม.</span>
              <span className="text-line">·</span>
              <span>{p.beds} นอน</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-line-2">
              <Link href={`/property/${p.slug}`} className={actionBtn}>
                ดู
              </Link>
              <Link href={`/admin/properties/${p.id}`} className={actionBtn}>
                แก้ไข
              </Link>
              <DeleteButton action={deleteProperty} id={p.id} />
            </div>
          </div>
        ))}
      </div>

      {/* จอใหญ่: ตาราง */}
      <div className="hidden md:block border border-line-2 overflow-x-auto">
        <table className="w-full th text-[13px]">
          <thead className="bg-sand/60">
            <tr>
              {[
                "ทรัพย์",
                "หมวด",
                "ทำเล",
                "ค่าเช่า/เดือน",
                "พื้นที่",
                "สถานะ",
                "จัดการ",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left kicker px-4 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-line-2">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-[11.5px] text-muted mt-0.5">
                    {p.code} · {p.type}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{p.cat}</td>
                <td className="px-4 py-3 whitespace-nowrap">{p.district}</td>
                <td className="px-4 py-3 whitespace-nowrap">{baht(p.price)}</td>
                <td className="px-4 py-3 whitespace-nowrap">{p.area} ตร.ม.</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={p.published ? "" : "text-muted"}>
                    {p.published ? "เผยแพร่" : "ซ่อน"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link href={`/property/${p.slug}`} className={actionBtn}>
                      ดู
                    </Link>
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className={actionBtn}
                    >
                      แก้ไข
                    </Link>
                    <DeleteButton action={deleteProperty} id={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="th mt-4 text-[12px] text-muted">
        กด “ลบ” หนึ่งครั้งเพื่อยืนยัน · การลบทรัพย์จะลบรูปและจุดสำคัญที่ผูกไว้ด้วย
      </p>
    </>
  );
}
