import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import FeatureCard from "@/components/FeatureCard";
import Hero from "@/components/Hero";
import AreasSection from "@/components/AreasSection";
import { StatsSection, JournalSection } from "@/components/PageSections";
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
 *   1. หน้าจริง `/`                        -> ธีมที่ใช้อยู่ (SSG)
 *   2. หน้าพรีวิว `/theme-preview/[id]`     -> ธีมที่กำลังดู (dynamic, แอดมินเท่านั้น)
 * ห้ามอ่านธีมเองในนี้ ต้องรับผ่าน prop เท่านั้น ไม่งั้นพรีวิวจะโชว์ธีมจริง
 */
export default function HomeContent({ theme }: { theme: Theme }) {
  const L = theme.layout;
  const items = listProperties();
  const areas = areasWithCount();
  const articles = listArticles().slice(0, 2);
  const stats = siteStats();
  const facets = propertyFacets();

  // ธีม photo-first โชว์ทรัพย์ชิ้นแรกเป็นการ์ดใหญ่ + อีก 6 ใบในกริด
  const featured = items.slice(0, L.featureFirst ? 7 : 6);
  const covers = coverMap(featured.map((p) => p.id));
  const [lead, ...rest] = featured;
  const gridItems = L.featureFirst ? rest : featured;

  return (
    <>
      <Hero
        theme={theme}
        areas={areas.map((a) => a.query || a.name)}
        priceMin={facets.priceMin}
        priceMax={facets.priceMax}
        stats={stats}
      />

      <section className="wrap pt-20">
        <div
          className={`border-b border-line-2 pb-[26px] ${
            L.centerSections
              ? "flex flex-col items-center text-center gap-4"
              : "flex items-end justify-between gap-10"
          }`}
        >
          <div>
            {L.centerSections ? (
              <span className="kicker inline-flex items-center gap-3.5">
                <span
                  className="inline-block w-10 h-px"
                  style={{ background: "var(--t-accent)" }}
                />
                Properties
                <span
                  className="inline-block w-10 h-px"
                  style={{ background: "var(--t-accent)" }}
                />
              </span>
            ) : (
              <span className="kicker">Properties</span>
            )}
            <h2 className="t-h2 mt-4">ทรัพย์คัดสรร {items.length} รายการ</h2>
          </div>
          <Link
            href="/properties"
            className="th text-[12px] tracking-[0.14em] text-ink-2 border-b border-ink pb-[5px] shrink-0"
          >
            ดูทั้งหมด
          </Link>
        </div>

        {L.featureFirst && lead && (
          <div className="pt-11">
            <FeatureCard p={lead} cover={covers[lead.id]} theme={theme} />
          </div>
        )}

        <div
          className={`grid gap-y-[34px] gap-x-[30px] sm:grid-cols-2 ${
            { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" }[
              L.cols
            ]
          } ${L.featureFirst ? "pt-[34px]" : "pt-11"}`}
        >
          {gridItems.map((p, i) => (
            <PropertyCard
              key={p.id}
              p={p}
              cover={covers[p.id]}
              priority={!L.featureFirst && i < 3}
              theme={theme}
              index={i}
            />
          ))}
        </div>
      </section>

      <AreasSection areas={areas} theme={theme} />
      <StatsSection stats={stats} theme={theme} />
      <JournalSection articles={articles} theme={theme} />
    </>
  );
}
