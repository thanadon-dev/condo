import Link from "next/link";
import { Section } from "@/components/Section";
import PropertyCard from "@/components/PropertyCard";
import HeroSearch from "@/components/HeroSearch";
import {
  listProperties,
  areasWithCount,
  listArticles,
  siteStats,
} from "@/lib/queries";
import { SITE, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default function Home() {
  const items = listProperties();
  const areas = areasWithCount();
  const articles = listArticles().slice(0, 2);
  const stats = siteStats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE.name,
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: "กรุงเทพมหานคร",
      addressCountry: "TH",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-line-2">
        <div className="mx-auto max-w-[1240px] px-6 pt-24 pb-20">
          <div className="kicker">Bangkok · Real Estate</div>
          <h1 className="display th text-[52px] md:text-[76px] mt-4 leading-[1.06]">
            บ้านที่ใช่ ไม่ควรหายาก
          </h1>
          <p className="th mt-6 text-[15px] md:text-[16px] text-muted max-w-[620px] leading-relaxed">
            คัดสรรคอนโด บ้านเดี่ยว และทาวน์โฮมในกรุงเทพฯ พร้อมข้อมูลครบทุกด้าน
            ทั้งพื้นที่ใช้สอย ค่าส่วนกลาง และทำเลรอบโครงการ
          </p>

          <HeroSearch areas={areas.map((a) => a.query || a.name)} />
        </div>
      </section>

      <Section
        kicker="Properties"
        title="ทรัพย์คัดสรร"
        sub={`ทั้งหมด ${items.length} รายการในระบบ`}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/properties"
            className="inline-block th text-[13.5px] px-7 py-[15px] border border-line hover:border-ink transition-colors"
          >
            ดูทรัพย์ทั้งหมด ({items.length})
          </Link>
        </div>
      </Section>

      <div className="bg-sand/60 border-y border-line-2">
        <Section kicker="Neighbourhoods" title="ทำเลที่คนมองหา">
          <div className="grid gap-6 sm:grid-cols-3">
            {areas.map((a) => (
              <Link
                key={a.id}
                href={`/area/${a.slug}`}
                className="block bg-paper border border-line-2 hover:border-line transition-colors p-7"
              >
                <div className="th text-[19px] font-medium">{a.name}</div>
                <div className="th mt-2 text-[12.5px] text-muted">
                  {a.count} รายการ
                </div>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mt-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-paper border border-line-2 p-7">
                <div className="th text-[40px] font-light leading-none">
                  {s.value}
                </div>
                <div className="th mt-3 text-[13.5px] font-medium">
                  {s.label}
                </div>
                <div className="th mt-1 text-[12.5px] text-muted">{s.note}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section kicker="Journal" title="บทความล่าสุด">
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/journal/${a.slug}`}
              className="block border border-line-2 hover:border-line transition-colors p-7"
            >
              <div className="kicker">
                {a.tag} · อ่าน {a.read_time}
              </div>
              <h3 className="th mt-3 text-[20px] font-medium leading-snug">
                {a.title}
              </h3>
              <p className="th mt-3 text-[13.5px] text-muted leading-relaxed">
                {a.lead}
              </p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
