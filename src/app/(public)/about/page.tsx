import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Section } from "@/components/Section";
import TimelineFilter from "@/components/TimelineFilter";
import LeadForm from "@/components/LeadForm";
import { listDeals, dealCats } from "@/lib/queries";
import { SITE, thaiDate } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "เกี่ยวกับฉัน",
  description: `${SITE.agent.name} ที่ปรึกษาอสังหาริมทรัพย์ในกรุงเทพฯ และปริมณฑล ใบอนุญาต ${SITE.agent.license}`,
  alternates: { canonical: "/about" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

async function Timeline({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.cat) ? sp.cat[0] : sp.cat;
  const cats = dealCats();
  const valid = new Set(cats.map((c) => c.value));
  const cat = raw && valid.has(raw) ? raw : "";

  const all = listDeals();
  const deals = cat ? all.filter((d) => d.cat === cat) : all;

  return (
    <>
      <TimelineFilter cats={cats} active={cat} total={all.length} />

      <ol className="space-y-5 max-w-[820px] mt-8">
        {deals.map((d) => (
          <li key={d.id}>
            <Link
              href={`/deal/${d.slug}`}
              className="group block bg-paper border border-line-2 hover:border-line transition-colors p-7"
            >
              <div className="kicker">
                {thaiDate(d.closed_on)} · {d.cat}
              </div>
              <h3 className="th mt-3 text-[18px] font-medium leading-snug group-hover:underline underline-offset-4 decoration-line">
                {d.title}
              </h3>
              <div className="th mt-1.5 text-[12.5px] text-muted">
                {d.location} · {d.value}
              </div>
              <p className="th mt-4 text-[13.5px] leading-[1.95] text-ink-2 line-clamp-3">
                {d.body}
              </p>
              <span className="kicker inline-block mt-4">อ่านรายละเอียด →</span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}

export default function AboutPage({ searchParams }: { searchParams: SP }) {
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
            <div className="th text-[38px] font-light leading-none">
              {deals.length}
            </div>
            <div className="th mt-2 text-[13px] text-muted">ดีลที่ปิดแล้ว</div>
          </div>
          <div className="border border-line-2 p-6">
            <div className="th text-[38px] font-light leading-none">{rent}</div>
            <div className="th mt-2 text-[13px] text-muted">งานปล่อยเช่า</div>
          </div>
        </div>
      </Section>

      <div className="bg-sand/60 border-y border-line-2">
        <Section kicker="Track Record" title="ไทม์ไลน์ผลงาน">
          <Suspense
            fallback={
              <div className="th text-[13.5px] text-muted">กำลังโหลด…</div>
            }
          >
            <Timeline searchParams={searchParams} />
          </Suspense>
        </Section>
      </div>

      <Section
        kicker="Enquiry"
        title="อยากให้ช่วยดูทรัพย์ของคุณไหม"
        sub="คุยได้ทั้งกรณีปล่อยเช่าใหม่ ผู้เช่าเดิมย้ายออก หรือประกาศไว้แล้วยังไม่มีคนติดต่อ"
      >
        <div className="max-w-[640px]">
          <LeadForm source="/about" defaultKind="ประเมินราคา" />
        </div>
      </Section>
    </>
  );
}
