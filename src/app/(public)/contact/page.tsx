import type { Metadata } from "next";
import { Section } from "@/components/Section";
import LeadForm from "@/components/LeadForm";
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
      <div className="grid gap-14 lg:grid-cols-[1fr_320px]">
        <div className="max-w-[640px]">
          <LeadForm source="/contact" defaultKind="ฝากปล่อยเช่า" />
        </div>

        <aside className="space-y-3 h-fit">
          <a
            href={`tel:${SITE.mobile.replace(/\s/g, "")}`}
            className="block border border-line-2 hover:border-ink transition-colors p-6"
          >
            <div className="kicker">โทรศัพท์</div>
            <div className="th mt-2.5 text-[18px]">{SITE.mobile}</div>
          </a>
          <div className="border border-line-2 p-6">
            <div className="kicker">LINE</div>
            <div className="th mt-2.5 text-[18px]">{SITE.line}</div>
          </div>
          <div className="border border-line-2 p-6">
            <div className="kicker">อีเมล</div>
            <div className="th mt-2.5 text-[14.5px]">{SITE.email}</div>
          </div>
          <div className="border border-line-2 p-6">
            <div className="kicker">ออฟฟิศ</div>
            <div className="th mt-2.5 text-[13.5px] leading-relaxed">
              {SITE.address}
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
