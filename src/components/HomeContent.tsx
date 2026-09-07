import Link from "next/link";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import FeatureCard from "@/components/FeatureCard";
import HeroSearch from "@/components/HeroSearch";
import {
  listProperties,
  areasWithCount,
  listArticles,
  siteStats,
  coverMap,
  propertyFacets,
} from "@/lib/queries";
import type { Theme } from "@/lib/themes";

/**
 * เนื้อหาหน้าแรกทั้งหมด — แยกออกมาเพื่อให้ใช้ได้ 2 ที่:
 *   1. หน้าจริง `/`            -> ธีมที่ใช้อยู่ (SSG)
 *   2. หน้าพรีวิว `/admin/themes/preview/[id]` -> ธีมที่กำลังดู (dynamic, แอดมินเท่านั้น)
 * ห้ามอ่านธีมเองในนี้ ต้องรับผ่าน prop เท่านั้น ไม่งั้นพรีวิวจะโชว์ธีมจริง
 */
export default function HomeContent({ theme }: { theme: Theme }) {
  const items = listProperties();
  const areas = areasWithCount();
  const articles = listArticles().slice(0, 2);
  const stats = siteStats();
  const facets = propertyFacets();

  // ธีม photo-first โชว์ทรัพย์ชิ้นแรกเป็นการ์ดใหญ่ + อีก 6 ใบในกริด
  const featured = items.slice(0, theme.layout.featureFirst ? 7 : 6);
  const covers = coverMap(featured.map((p) => p.id));
  const [lead, ...rest] = featured;
  const gridItems = theme.layout.featureFirst ? rest : featured;

  return (
    <>
      <section className="relative h-[440px] sm:h-[540px] lg:h-[660px] overflow-hidden bg-sand">
        <Image
          src="/media/hero-mock.webp"
          alt="สระว่ายน้ำดาดฟ้าคอนโดริมแม่น้ำเจ้าพระยา มองเห็นสกายไลน์กรุงเทพฯ"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg,rgba(14,14,14,.34) 0%,rgba(14,14,14,.12) 45%,rgba(14,14,14,.52) 100%)",
          }}
        />
        <div className="relative h-full wrap pb-10 sm:pb-16 flex flex-col justify-end">
          <span className="text-[9px] sm:text-[10px] tracking-[0.36em] sm:tracking-[0.44em] text-white/85 mb-4 sm:mb-[22px]">
            BANGKOK · REAL ESTATE
          </span>
          <h1 className="t-h1 text-white max-w-[820px] m-0">
            บ้านที่ใช่ ไม่ควรหายาก
          </h1>
          <p className="th mt-4 sm:mt-5 max-w-[520px] text-[13.5px] sm:text-[15.5px] leading-[1.75] sm:leading-[1.8] font-light text-white/80">
            คัดสรรคอนโด บ้านเดี่ยว และทาวน์โฮมในกรุงเทพฯ พร้อมข้อมูลครบทุกด้าน
            ทั้งพื้นที่ใช้สอย ค่าส่วนกลาง และทำเลรอบโครงการ
          </p>
        </div>
      </section>

      <section className="wrap relative z-10 -mt-8 lg:-mt-14">
        <HeroSearch
          areas={areas.map((a) => a.query || a.name)}
          priceMin={facets.priceMin}
          priceMax={facets.priceMax}
        />
      </section>

      <section className="wrap pt-20">
        <div className="flex items-end justify-between gap-10 border-b border-line-2 pb-[26px]">
          <div>
            <span className="kicker">Properties</span>
            <h2 className="t-h2 mt-4">ทรัพย์คัดสรร {items.length} รายการ</h2>
          </div>
          <Link
            href="/properties"
            className="th text-[12px] tracking-[0.14em] text-ink-2 border-b border-ink pb-[5px] shrink-0"
          >
            ดูทั้งหมด
          </Link>
        </div>

        {theme.layout.featureFirst && lead && (
          <div className="pt-11">
            <FeatureCard p={lead} cover={covers[lead.id]} theme={theme} />
          </div>
        )}

        <div
          className={`grid gap-y-[34px] gap-x-[30px] sm:grid-cols-2 ${
            theme.layout.card === "row" ? "lg:grid-cols-2" : "lg:grid-cols-3"
          } ${theme.layout.featureFirst ? "pt-[34px]" : "pt-11"}`}
        >
          {gridItems.map((p, i) => (
            <PropertyCard
              key={p.id}
              p={p}
              cover={covers[p.id]}
              priority={!theme.layout.featureFirst && i < 3}
              theme={theme}
            />
          ))}
        </div>
      </section>

      <section className="wrap pt-[110px]">
        <span className="kicker">Neighbourhoods</span>
        <h2 className="t-h2 mt-4 mb-10">ทำเลที่คนมองหา</h2>
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
          {areas.map((a) => (
            <Link
              key={a.id}
              href={`/area/${a.slug}`}
              className="group relative block h-[340px] overflow-hidden bg-sand"
              style={{ borderRadius: "var(--t-radius)" }}
            >
              {a.cover && (
                <Image
                  src={a.cover}
                  alt={`ทำเล${a.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]"
                />
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg,transparent 40%,rgba(14,14,14,.6) 100%)",
                }}
              />
              <div className="absolute left-6 bottom-[22px] pointer-events-none">
                <div className="serif text-[27px] font-normal text-white">
                  {a.name}
                </div>
                <div className="th text-[11.5px] tracking-[0.16em] text-white/78 mt-1.5">
                  {a.count} รายการ
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-[110px] bg-sand-2 border-y border-line-2">
        <div className="wrap py-[72px] grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-3">
              <span
                className="num text-[52px] leading-none whitespace-nowrap"
                style={{ color: "var(--t-accent)" }}
              >
                {s.value}
              </span>
              <span className="th text-[12px] tracking-[0.14em] text-dim">
                {s.label}
              </span>
              <span className="th text-[11.5px] leading-[1.6] text-faint">
                {s.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap py-[110px]">
        <span className="kicker">Journal</span>
        <h2 className="t-h2 mt-4 mb-10">บทความล่าสุด</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/journal/${a.slug}`}
              className="group block border-t border-line-2 pt-7"
            >
              <div className="th text-[11px] tracking-[0.16em] text-dim">
                {a.tag} · อ่าน {a.read_time}
              </div>
              <h3 className="t-h3 mt-3.5 group-hover:underline underline-offset-[6px] decoration-line">
                {a.title}
              </h3>
              <p className="th mt-3.5 text-[13.5px] leading-[1.9] text-muted font-light">
                {a.lead}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
