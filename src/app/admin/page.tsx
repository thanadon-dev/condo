import Link from "next/link";
import { dashboardStats, listLeads, STATUS_LABEL } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default function AdminHome() {
  const s = dashboardStats();
  const recent = listLeads().slice(0, 6);

  const cards = [
    { label: "ทรัพย์ทั้งหมด", value: s.properties, note: `เผยแพร่ ${s.published}` },
    { label: "ลูกค้าใหม่", value: s.leadsNew, note: `7 วันล่าสุด ${s.leads7d}` },
    { label: "ผลงาน", value: s.deals, note: "ในไทม์ไลน์" },
    { label: "บทความ", value: s.articles, note: `รูปในระบบ ${s.images}` },
  ];

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-line-2 p-6">
            <div className="th text-[34px] font-light leading-none">
              {c.value}
            </div>
            <div className="th mt-3 text-[13px] font-medium">{c.label}</div>
            <div className="th mt-1 text-[12px] text-muted">{c.note}</div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display text-[26px] th">ลูกค้าล่าสุด</h2>
          <Link href="/admin/leads" className="kicker hover:text-ink">
            ดูทั้งหมด →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="th mt-6 text-[13.5px] text-muted border border-line-2 p-10 text-center">
            ยังไม่มีลูกค้าติดต่อเข้ามา
          </p>
        ) : (
          <>
          <div className="mt-6 grid gap-3 md:hidden">
            {recent.map((l) => (
              <div key={l.id} className="border border-line-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="th text-[14.5px] font-medium">{l.name}</div>
                  <span className="th text-[11px] px-2 py-1 border border-line-2 shrink-0 text-muted">
                    {STATUS_LABEL[l.status] ?? l.status}
                  </span>
                </div>
                <a
                  href={`tel:${l.phone.replace(/[\s-]/g, "")}`}
                  className="th block mt-1.5 text-[13.5px]"
                >
                  {l.phone}
                </a>
                <div className="th text-[12px] text-muted mt-2">
                  {l.created_at.slice(0, 16)} · {l.kind}
                </div>
                {l.property_title && (
                  <div className="th text-[12px] text-muted mt-1">
                    สนใจ: {l.property_title}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 hidden md:block border border-line-2 overflow-x-auto">
            <table className="w-full th text-[13px]">
              <thead className="bg-sand/60">
                <tr>
                  {["วันที่", "ชื่อ", "เบอร์", "เรื่อง", "ทรัพย์", "สถานะ"].map(
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
                {recent.map((l) => (
                  <tr key={l.id} className="border-t border-line-2">
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {l.created_at.slice(0, 16)}
                    </td>
                    <td className="px-4 py-3">{l.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{l.phone}</td>
                    <td className="px-4 py-3">{l.kind}</td>
                    <td className="px-4 py-3 text-muted max-w-[220px] truncate">
                      {l.property_title || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {STATUS_LABEL[l.status] ?? l.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </section>
    </>
  );
}
