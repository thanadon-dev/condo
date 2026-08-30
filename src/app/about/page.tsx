import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { listDeals } from "@/lib/queries";
import { SITE, thaiDate } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "เกี่ยวกับฉัน",
  description: `${SITE.agent.name} ที่ปรึกษาอสังหาริมทรัพย์ในกรุงเทพฯ และปริมณฑล ใบอนุญาต ${SITE.agent.license}`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const deals = listDeals();
  const rent = deals.filter((d) => d.cat !== "ขายขาด").length;

  return (
    <>
      <Section kicker="About" title={SITE.agent.name}>
        <p className="th text-[13px] text-muted -mt-6 mb-8">
          ที่ปรึกษาอสังหาริมทรัพย์ · ใบอนุญาต {SITE.agent.license} · กรุงเทพฯ
        </p>
        <div className="max-w-[720px] space-y-5 th text-[15px] leading-[2] text-ink-2">
          <p>
            ผมทำงานกับบ้านเช่าและคอนโดปล่อยเช่าในกรุงเทพฯ เป็นหลักตั้งแต่ปี 2555
            งานส่วนใหญ่มาจากเจ้าของที่เคยลงประกาศเองแล้วห้องว่างนานกว่าที่คิด
          </p>
          <p>
            สิ่งที่ผมทำคือหาสาเหตุว่าทำไมผู้เช่าไม่ติดต่อ แก้ที่ราคา รูป
            หรือเงื่อนไข แล้วพาห้องกลับเข้าตลาดใหม่ให้ตรงกลุ่ม
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 max-w-[520px] mt-10">
          <div className="border border-line-2 p-6">
            <div className="display text-[38px] leading-none">
              {deals.length}
            </div>
            <div className="th mt-2 text-[13px] text-muted">ดีลที่ปิดแล้ว</div>
          </div>
          <div className="border border-line-2 p-6">
            <div className="display text-[38px] leading-none">{rent}</div>
            <div className="th mt-2 text-[13px] text-muted">งานปล่อยเช่า</div>
          </div>
        </div>
      </Section>

      <div className="bg-sand/60 border-y border-line-2">
        <Section kicker="Track Record" title="ไทม์ไลน์ผลงาน">
          <ol className="space-y-5 max-w-[820px]">
            {deals.map((d) => (
              <li key={d.id} className="bg-paper border border-line-2 p-7">
                <div className="kicker">
                  {thaiDate(d.closed_on)} · {d.cat}
                </div>
                <h3 className="th mt-3 text-[18px] font-medium leading-snug">
                  {d.title}
                </h3>
                <div className="th mt-1.5 text-[12.5px] text-muted">
                  {d.location} · {d.value}
                </div>
                <p className="th mt-4 text-[13.5px] leading-[1.95] text-ink-2">
                  {d.body}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      </div>
    </>
  );
}
