import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/Section";
import { listArticles } from "@/lib/queries";
import { thaiDate } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "บทความ",
  description:
    "บันทึกจากงานจริงเรื่องการตั้งราคา การอ่านทำเล และการดูแลผู้เช่าในกรุงเทพฯ และปริมณฑล",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const items = listArticles();
  return (
    <Section
      kicker="Journal"
      title="บทความ"
      sub="บันทึกจากงานจริงเรื่องการตั้งราคา การอ่านทำเล และการดูแลผู้เช่า"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((a) => (
          <Link
            key={a.id}
            href={`/journal/${a.slug}`}
            className="block border border-line-2 hover:border-line transition-colors p-8"
          >
            <div className="kicker">
              {a.tag} · {thaiDate(a.published_on)} · อ่าน {a.read_time}
            </div>
            <h2 className="th mt-3.5 text-[21px] font-medium leading-snug">
              {a.title}
            </h2>
            <p className="th mt-3.5 text-[13.5px] text-muted leading-relaxed">
              {a.lead}
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
