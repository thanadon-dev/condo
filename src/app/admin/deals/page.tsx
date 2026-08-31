import Link from "next/link";
import { adminDeals } from "@/lib/admin";
import { thaiDate } from "@/lib/site";
import CreatePanel from "@/components/admin/CreatePanel";
import DeleteButton from "@/components/admin/DeleteButton";
import { saveDeal, deleteDeal } from "@/app/actions/admin";
import { DEAL_FIELDS } from "../fields";

export const dynamic = "force-dynamic";

export default function AdminDeals() {
  const items = adminDeals();

  const actionBtn =
    "th text-[12px] px-3 py-1.5 border border-line-2 hover:border-ink transition-colors";

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="display text-[26px] th">ไทม์ไลน์ผลงาน</h2>
          <p className="th mt-1 text-[13px] text-muted">
            ทั้งหมด {items.length} รายการ · เรียงตามวันที่ปิดดีลจากใหม่ไปเก่า
          </p>
        </div>
        <CreatePanel
          action={saveDeal}
          fields={DEAL_FIELDS}
          title="เพิ่มผลงานใหม่"
          buttonLabel="+ เพิ่มผลงาน"
        />
      </div>

      <div className="grid gap-3 md:hidden">
        {items.map((d) => (
          <div key={d.id} className="border border-line-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="th text-[14.5px] font-medium leading-snug min-w-0">
                {d.title}
              </div>
              <span className="th text-[11px] px-2 py-1 border border-line-2 shrink-0 text-muted">
                {d.published ? "เผยแพร่" : "ซ่อน"}
              </span>
            </div>
            <div className="th text-[12px] text-muted mt-2">
              {d.cat} · {d.location} · {thaiDate(d.closed_on)}
            </div>
            <div className="th text-[13px] mt-1.5">{d.value}</div>
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-line-2">
              <Link href={`/deal/${d.slug}`} className={actionBtn}>
                ดู
              </Link>
              <Link href={`/admin/deals/${d.id}`} className={actionBtn}>
                แก้ไข
              </Link>
              <DeleteButton action={deleteDeal} id={d.id} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block border border-line-2 overflow-x-auto">
        <table className="w-full th text-[13px]">
          <thead className="bg-sand/60">
            <tr>
              {[
                "ผลงาน",
                "ประเภท",
                "ทำเล",
                "มูลค่า",
                "วันที่",
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
            {items.map((d) => (
              <tr key={d.id} className="border-t border-line-2">
                <td className="px-4 py-3 max-w-[300px]">
                  <div className="font-medium truncate">{d.title}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{d.cat}</td>
                <td className="px-4 py-3 whitespace-nowrap">{d.location}</td>
                <td className="px-4 py-3 whitespace-nowrap">{d.value}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">
                  {thaiDate(d.closed_on)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={d.published ? "" : "text-muted"}>
                    {d.published ? "เผยแพร่" : "ซ่อน"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link href={`/deal/${d.slug}`} className={actionBtn}>
                      ดู
                    </Link>
                    <Link href={`/admin/deals/${d.id}`} className={actionBtn}>
                      แก้ไข
                    </Link>
                    <DeleteButton action={deleteDeal} id={d.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
