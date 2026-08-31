import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  listProperties,
  propertyBySlug,
  amenitiesOf,
  imagesOf,
  poisOf,
  nearbyProperties,
  coverMap,
} from "@/lib/queries";
import Gallery from "@/components/Gallery";
import LocationSection from "@/components/LocationSection";
import PropertyCard from "@/components/PropertyCard";
import LeadForm from "@/components/LeadForm";
import { baht } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { decodeSlug } from "@/lib/route";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return listProperties().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = propertyBySlug(decodeSlug(slug));
  if (!p) return {};
  const title = `${p.title} — ${p.type} ${p.beds} ห้องนอน ${p.area} ตร.ม. ${p.district}`;
  return {
    title,
    description: `${p.title} ${p.location} ค่าเช่า ${baht(p.price)} บาท/เดือน ${p.beds} ห้องนอน ${p.baths} ห้องน้ำ พื้นที่ ${p.area} ตร.ม.`,
    alternates: { canonical: `/property/${p.slug}` },
    openGraph: { title, url: `/property/${p.slug}`, type: "article" },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = propertyBySlug(decodeSlug(slug));
  if (!p) notFound();

  const SITE = getSettings();
  const amenities = amenitiesOf(p);
  const images = imagesOf(p.id);
  const pois = poisOf(p.id);
  const nearby = nearbyProperties(p);
  const nearbyCovers = coverMap(nearby.map((n) => n.id));
  const specs = [
    { k: "ประเภท", v: p.type },
    { k: "ห้องนอน", v: String(p.beds) },
    { k: "ห้องน้ำ", v: String(p.baths) },
    { k: "พื้นที่ใช้สอย", v: `${p.area} ตร.ม.` },
    { k: "ชั้น", v: p.floor },
    { k: "ปีที่สร้าง", v: p.year },
    { k: "ที่จอดรถ", v: p.park },
    { k: "รหัสทรัพย์", v: p.code },
  ].filter((s) => s.v);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: p.title,
    description: p.descr,
    address: { "@type": "PostalAddress", streetAddress: p.location },
    ...(p.lat !== null && p.lng !== null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: p.lat,
            longitude: p.lng,
          },
        }
      : {}),
    numberOfRooms: p.beds,
    floorSize: { "@type": "QuantitativeValue", value: p.area, unitCode: "MTK" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.price,
        priceCurrency: "THB",
        unitCode: "MON",
        unitText: "เดือน",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1240px] px-6 pt-10">
        <nav className="th text-[12px] text-muted flex gap-2">
          <Link href="/" className="hover:text-ink">
            หน้าหลัก
          </Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-ink">
            {p.type}
          </Link>
          <span>/</span>
          <span className="text-ink-2">{p.title}</span>
        </nav>

        <header className="mt-6 sm:mt-8 flex flex-wrap items-end justify-between gap-5 sm:gap-6 pb-8 sm:pb-10 border-b border-line-2">
          <div>
            <div className="kicker">
              {p.type} · {p.code}
            </div>
            <h1 className="display th text-[30px] sm:text-[40px] lg:text-[52px] mt-2.5 sm:mt-3 leading-tight">
              {p.title}
            </h1>
            <p className="th mt-2 text-[14px] text-muted">{p.location}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="kicker">ค่าเช่า / เดือน</div>
            <div className="th text-[27px] sm:text-[34px] mt-1 font-light tracking-tight">
              {baht(p.price)}
            </div>
            <div className="th text-[12.5px] text-muted mt-1">
              {baht(Math.round(p.price / (p.area || 1)))} / ตร.ม. / เดือน
            </div>
          </div>
        </header>

        <div className="mt-8 sm:mt-10">
          <Gallery images={images} />
        </div>

        <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1fr_340px] mt-10 sm:mt-14 pb-10">
          <div>
            <h2 className="display text-[25px] sm:text-[30px] th">รายละเอียดทรัพย์</h2>
            <p className="th mt-4 text-[14.5px] leading-[1.9] text-ink-2">
              {p.descr}
            </p>
            <p className="th mt-4 text-[14.5px] leading-[1.9] text-ink-2">
              {p.descr2}
            </p>

            <h2 className="display text-[25px] sm:text-[30px] th mt-10 sm:mt-14">ข้อมูลสำคัญ</h2>
            <dl className="mt-5 grid gap-x-10 sm:grid-cols-2">
              {specs.map((s) => (
                <div
                  key={s.k}
                  className="flex justify-between py-3.5 border-b border-line-2 th text-[13.5px]"
                >
                  <dt className="text-muted">{s.k}</dt>
                  <dd className="text-ink">{s.v}</dd>
                </div>
              ))}
            </dl>

            {amenities.length > 0 && (
              <>
                <h2 className="display text-[30px] th mt-14">
                  สิ่งอำนวยความสะดวก
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {amenities.map((a) => (
                    <li
                      key={a}
                      className="th text-[13px] px-4 py-2.5 border border-line-2"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <LocationSection
              lat={p.lat}
              lng={p.lng}
              title={p.title}
              district={p.district}
              pois={pois}
            />
          </div>

          <aside className="lg:sticky lg:top-[100px] h-fit border border-line-2 p-6 sm:p-7">
            <div className="kicker">ที่ปรึกษาประจำทรัพย์</div>
            <div className="th mt-3 text-[17px] font-medium">
              {SITE.agent.name}
            </div>
            <div className="th mt-1 text-[12.5px] text-muted">
              {SITE.agent.role} · ใบอนุญาต {SITE.agent.license}
            </div>

            <a
              href="#lead"
              className="block text-center th text-[13.5px] mt-7 px-6 py-[14px] bg-ink text-paper hover:opacity-85 transition-opacity"
            >
              นัดชมบ้าน
            </a>
            <a
              href={`tel:${SITE.mobile.replace(/\s/g, "")}`}
              className="block text-center th text-[13.5px] mt-3 px-6 py-[14px] border border-line hover:border-ink transition-colors"
            >
              โทร {SITE.mobile}
            </a>

            <p className="th mt-6 pt-6 border-t border-line-2 text-[12px] text-muted leading-relaxed">
              เข้าชมทรัพย์นี้ {p.views.toLocaleString("en-US")} ครั้ง ·
              ราคาอาจเปลี่ยนแปลงตามการเจรจา
            </p>
          </aside>
        </div>

        <section id="lead" className="border-t border-line-2 pt-14 pb-6 scroll-mt-[90px]">
          <div className="kicker">Enquiry</div>
          <h2 className="display text-[32px] th mt-2.5">สนใจทรัพย์นี้</h2>
          <p className="th mt-2 text-[13.5px] text-muted">
            ฝากเบอร์ไว้ได้เลย ผมติดต่อกลับพร้อมข้อมูลค่าส่วนกลางและเงื่อนไขจริง
          </p>
          <div className="max-w-[640px] mt-8">
            <LeadForm
              propertyId={p.id}
              propertyTitle={`${p.title} (${p.code})`}
              source={`/property/${p.slug}`}
              defaultKind="นัดชมบ้าน"
            />
          </div>
        </section>

        {nearby.length > 0 && (
          <section className="border-t border-line-2 pt-14 pb-6">
            <div className="kicker">Nearby</div>
            <h2 className="display text-[32px] th mt-2.5">
              อสังหาฯ ในพื้นที่ใกล้เคียง
            </h2>
            <p className="th mt-2 text-[13.5px] text-muted">
              รอบ {p.district} ในรัศมี 4 กม.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {nearby.map((n) => (
                <div key={n.id} className="relative">
                  <span className="absolute right-3 top-[calc(75%-2.6rem)] z-20 bg-ink/85 text-paper th text-[11.5px] px-2.5 py-1.5 pointer-events-none">
                    ห่าง{" "}
                    {n.distanceKm < 1
                      ? `${Math.round(n.distanceKm * 1000)} ม.`
                      : `${n.distanceKm.toFixed(1)} กม.`}
                  </span>
                  <PropertyCard p={n} cover={nearbyCovers[n.id]} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
