import Link from "next/link";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import HeroSearch from "@/components/HeroSearch";
import {
  listProperties,
  areasWithCount,
  listArticles,
  siteStats,
  coverMap,
  propertyFacets,
} from "@/lib/queries";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import JsonLd from "@/components/JsonLd";
import {
  organization,
  website,
  itemList,
  faqPage,
} from "@/lib/jsonld";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const SITE = getSettings();
  const title = `${SITE.name} — คอนโด บ้านเช่า ทาวน์โฮม ให้เช่าในกรุงเทพฯ`;
  const description =
    "คัดสรรคอนโด บ้านเดี่ยว และทาวน์โฮมให้เช่าในกรุงเทพฯ พร้อมค่าเช่าจริง พื้นที่ใช้สอย และทำเลรอบโครงการ นัดชมได้ทุกวัน";
  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      type: "website",
      images: [
        {
          url: "/media/hero-mock.webp",
          width: 1200,
          height: 630,
          alt: "คอนโดริมแม่น้ำเจ้าพระยา กรุงเทพฯ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/media/hero-mock.webp"],
    },
  };
}

const FAQ = [
  {
    q: "ค่าเช่าคอนโดและบ้านในกรุงเทพฯ เริ่มต้นเท่าไหร่",
    a: "ทรัพย์ที่คัดไว้มีค่าเช่าตั้งแต่ 7,500 บาทต่อเดือนสำหรับคอนโดหนึ่งห้องนอน ไปจนถึงประมาณ 50,000 บาทต่อเดือนสำหรับบ้านเดี่ยวและเพนท์เฮาส์",
  },
  {
    q: "ต้องวางเงินประกันกี่เดือน",
    a: "โดยทั่วไปคือค่าเช่าล่วงหน้า 1 เดือน และเงินประกัน 2 เดือน ขึ้นอยู่กับเจ้าของแต่ละราย สามารถสอบถามรายละเอียดก่อนนัดชมได้",
  },
  {
    q: "นัดชมห้องได้วันไหนบ้าง",
    a: "นัดชมได้ทุกวันรวมวันหยุด แจ้งล่วงหน้าอย่างน้อยหนึ่งวันผ่านแบบฟอร์มติดต่อหรือโทรหาเราโดยตรง",
  },
  {
    q: "มีค่าบริการสำหรับผู้เช่าไหม",
    a: "ไม่มีค่าบริการสำหรับผู้เช่า ค่าตอบแทนมาจากฝั่งเจ้าของทรัพย์ตามมาตรฐานตลาด",
  },
];

export default function Home() {
  const SITE = getSettings();
  const items = listProperties();
  const areas = areasWithCount();
  const articles = listArticles().slice(0, 2);
  const stats = siteStats();
  const featured = items.slice(0, 6);
  const covers = coverMap(featured.map((p) => p.id));
  const facets = propertyFacets();

  return (
    <>
      <JsonLd id="ld-org" data={organization(SITE)} />
      <JsonLd id="ld-site" data={website(SITE)} />
      <JsonLd
        id="ld-list"
        data={itemList(featured, (p) => `/property/${p.slug}`)}
      />
      <JsonLd id="ld-faq" data={faqPage(FAQ)} />

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
          <span className="text-[9px] sm:text-[10px] tracking-[0.36em] sm:tracking-[0.44em] text-paper/85 mb-4 sm:mb-[22px]">
            BANGKOK · REAL ESTATE
          </span>
          <h1 className="display text-paper text-[34px] sm:text-[46px] lg:text-[66px] leading-[1.1] lg:leading-[1.08] max-w-[820px] m-0">
            บ้านที่ใช่ ไม่ควรหายาก
          </h1>
          <p className="th mt-4 sm:mt-5 max-w-[520px] text-[13.5px] sm:text-[15.5px] leading-[1.75] sm:leading-[1.8] font-light text-paper/80">
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
            <h2 className="display text-[34px] md:text-[44px] leading-[1.1] mt-4">
              ทรัพย์คัดสรร {items.length} รายการ
            </h2>
          </div>
          <Link
            href="/properties"
            className="th text-[12px] tracking-[0.14em] text-ink-2 border-b border-ink pb-[5px] shrink-0"
          >
            ดูทั้งหมด
          </Link>
        </div>

        <div className="grid gap-y-[34px] gap-x-[30px] sm:grid-cols-2 lg:grid-cols-3 pt-11">
          {featured.map((p, i) => (
            <PropertyCard
              key={p.id}
              p={p}
              cover={covers[p.id]}
              priority={i < 3}
            />
          ))}
        </div>
      </section>

      <section className="wrap pt-[110px]">
        <span className="kicker">Neighbourhoods</span>
        <h2 className="display text-[34px] md:text-[44px] leading-[1.1] mt-4 mb-10">
          ทำเลที่คนมองหา
        </h2>
        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
          {areas.map((a) => (
            <Link
              key={a.id}
              href={`/area/${a.slug}`}
              className="group relative block h-[340px] overflow-hidden bg-sand"
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
              <div className="absolute left-6 bottom-[22px] text-paper pointer-events-none">
                <div className="serif text-[27px] font-normal">{a.name}</div>
                <div className="th text-[11.5px] tracking-[0.16em] text-paper/78 mt-1.5">
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
              <span className="display text-[52px] leading-none whitespace-nowrap">
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
        <h2 className="display text-[34px] md:text-[44px] leading-[1.1] mt-4 mb-10">
          บทความล่าสุด
        </h2>
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
              <h3 className="serif text-[26px] leading-[1.25] mt-3.5 group-hover:underline underline-offset-[6px] decoration-line">
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
