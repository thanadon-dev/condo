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

      <div className="border border-line-2 overflow-x-auto">
        <table className="w-full th text-[13px]">
          <thead className="bg-sand/60">
            <tr>
              {["ทรัพย์", "หมวด", "ทำเล", "ค่าเช่า/เดือน", "พื้นที่", "สถานะ", "จัดการ"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left kicker px-4 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ),
              )}
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
                    <Link
                      href={`/property/${p.slug}`}
                      className="th text-[12px] px-3 py-1.5 border border-line-2 hover:border-ink transition-colors"
                    >
                      ดู
                    </Link>
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="th text-[12px] px-3 py-1.5 border border-line-2 hover:border-ink transition-colors"
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
