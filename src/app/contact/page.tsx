import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "ติดต่อเช่า",
  description: `ติดต่อ ${SITE.agent.name} เพื่อประเมินราคาเช่าและนัดชมทรัพย์ในกรุงเทพฯ`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section
      kicker="Contact"
      title="ติดต่อเช่า"
      sub="ส่งรายละเอียดห้องมาได้ ผมประเมินราคาเช่าที่ปิดได้จริงให้ก่อนตัดสินใจ"
    >
      <div className="grid gap-6 sm:grid-cols-2 max-w-[720px]">
        <a
          href={`tel:${SITE.mobile.replace(/\s/g, "")}`}
          className="border border-line-2 hover:border-ink transition-colors p-7"
        >
          <div className="kicker">โทรศัพท์</div>
          <div className="th mt-3 text-[19px]">{SITE.mobile}</div>
        </a>
        <div className="border border-line-2 p-7">
          <div className="kicker">LINE</div>
          <div className="th mt-3 text-[19px]">{SITE.line}</div>
        </div>
        <div className="border border-line-2 p-7">
          <div className="kicker">อีเมล</div>
          <div className="th mt-3 text-[16px]">{SITE.email}</div>
        </div>
        <div className="border border-line-2 p-7">
          <div className="kicker">ออฟฟิศ</div>
          <div className="th mt-3 text-[14px] leading-relaxed">
            {SITE.address}
          </div>
        </div>
      </div>

      <p className="th mt-8 text-[13px] text-muted">
        ฟอร์มส่งข้อมูลและระบบเก็บ lead จะเปิดใน Phase 5
      </p>
    </Section>
  );
}
