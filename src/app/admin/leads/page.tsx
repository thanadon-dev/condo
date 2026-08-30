import Link from "next/link";
import { listLeads, leadStatusCounts, STATUS_LABEL } from "@/lib/admin";
import { LEAD_STATUSES } from "@/lib/lead-status";
import LeadStatusForm from "@/components/admin/LeadStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminLeads({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const status =
    raw && LEAD_STATUSES.includes(raw as (typeof LEAD_STATUSES)[number])
      ? raw
      : "";

  const items = listLeads(status);
  const counts = leadStatusCounts();
  const total = counts.reduce((a, c) => a + c.count, 0);
  const countOf = (s: string) =>
    counts.find((c) => c.value === s)?.count ?? 0;

  const chip = (on: boolean) =>
    `th text-[12.5px] px-4 py-2.5 border transition-colors ${
      on
        ? "border-ink bg-ink text-paper"
        : "border-line-2 bg-paper text-ink-2 hover:border-line"
    }`;

  return (
    <>
      <div className="mb-8">
        <h2 className="display text-[26px] th">ลูกค้าที่ติดต่อเข้ามา</h2>
        <p className="th mt-1 text-[13px] text-muted">
          ทั้งหมด {total} รายการ · เรียงจากใหม่ไปเก่า
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="kicker w-[64px]">สถานะ</span>
        <Link href="/admin/leads" className={chip(!status)}>
          ทั้งหมด ({total})
        </Link>
        {LEAD_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/leads?status=${s}`}
            className={chip(status === s)}
          >
            {STATUS_LABEL[s]} ({countOf(s)})
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="th text-[13.5px] text-muted border border-line-2 p-12 text-center">
          ยังไม่มีรายการในสถานะนี้
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((l) => (
            <div key={l.id} className="border border-line-2 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="kicker">
                    {l.created_at.slice(0, 16)} · {l.kind}
                    {l.notified === 1 ? " · แจ้งเตือนแล้ว" : ""}
                  </div>
                  <div className="th mt-2 text-[17px] font-medium">
                    {l.name}
                  </div>
                  <div className="th mt-1.5 text-[13.5px]">
                    <a href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>
                    {l.email && (
                      <>
                        {" · "}
                        <a href={`mailto:${l.email}`}>{l.email}</a>
                      </>
                    )}
                  </div>
                </div>
                <LeadStatusForm id={l.id} status={l.status} />
              </div>

              {l.property_title && (
                <div className="th mt-4 text-[13px] text-muted">
                  สนใจ: {l.property_title}
                </div>
              )}

              {l.message && (
                <p className="th mt-3 text-[13.5px] leading-relaxed text-ink-2 border-l-2 border-line pl-4">
                  {l.message}
                </p>
              )}

              {l.source && (
                <div className="th mt-4 text-[11.5px] text-muted">
                  มาจากหน้า {l.source}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
