import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  listProperties,
  propertyBySlug,
  amenitiesOf,
  imagesOf,
  poisOf,
  suggestedProperties,
  coverMap,
  aliasTarget,
} from "@/lib/queries";
import Gallery from "@/components/Gallery";
import LocationSection from "@/components/LocationSection";
import PropertyCard from "@/components/PropertyCard";
import LineCta from "@/components/LineCta";
import { baht } from "@/lib/site";
import { getSettings } from "@/lib/settings";
import { decodeSlug } from "@/lib/route";
import JsonLd from "@/components/JsonLd";
import { breadcrumb } from "@/lib/jsonld";
import CopyLink from "@/components/CopyLink";

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
  const key = decodeSlug(slug);
  const p = propertyBySlug(key);
  if (!p) {
    const to = aliasTarget("property", key);
    if (to) permanentRedirect(`/property/${to}`);
    notFound();
  }

  const SITE = getSettings();
  const amenities = amenitiesOf(p);
  const images = imagesOf(p.id);
  const pois = poisOf(p.id);
  const suggested = suggestedProperties(p);
  const suggestedCovers = coverMap(suggested.map((n) => n.id));
  const specs = [
    { k: "ประเภท", v: p.type },
    { k: "ห้องนอน", v: String(p.beds) },
    { k: "ห้องน้ำ", v: String(p.baths) },
    { k: "พื้นที่ใช้สอย", v: `${p.area} ตร.ม.` },
    { k: "ชั้น", v: p.floor },
    { k: "อาคาร", v: p.building },
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
      <JsonLd id="ld-prop" data={jsonLd} />
      <JsonLd
        id="ld-prop-bc"
        data={breadcrumb([
          { name: "หน้าหลัก", path: "/" },
          { name: "ทรัพย์ทั้งหมด", path: "/properties" },
          { name: p.title, path: `/property/${p.slug}` },
        ])}
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
            <div className="mt-4">
              <CopyLink path={`/property/${p.slug}`} />
            </div>
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
            {/* whitespace-pre-line = แสดงการขึ้นบรรทัดที่แอดมินพิมพ์ไว้จริง */}
            {p.descr && (
              <p className="th mt-4 text-[14.5px] leading-[1.9] text-ink-2 whitespace-pre-line">
                {p.descr}
              </p>
            )}
            {p.descr2 && (
              <p className="th mt-4 text-[14.5px] leading-[1.9] text-ink-2 whitespace-pre-line">
                {p.descr2}
              </p>
            )}

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
              mapUrl={p.map_url}
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

            {SITE.lineUrl ? (
              <a
                href={SITE.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 th text-[13.5px] mt-7 px-6 py-[14px] bg-[#06C755] text-white hover:bg-[#05b34c] transition-colors"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 5.69 2 10.23c0 4.07 3.55 7.48 8.35 8.12.32.07.77.22.88.5.1.25.07.65.03.91l-.14.85c-.04.25-.2.98.86.53s5.72-3.37 7.8-5.77C21.4 13.79 22 12.09 22 10.23 22 5.69 17.52 2 12 2z" />
                </svg>
                ทักไลน์เพื่อนัดชม
              </a>
            ) : (
              <a
                href="#lead"
                className="block text-center th text-[13.5px] mt-7 px-6 py-[14px] bg-ink text-paper hover:opacity-85 transition-opacity"
              >
                นัดชมบ้าน
              </a>
            )}
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
          <div className="kicker">Add LINE</div>
          <h2 className="display text-[32px] th mt-2.5">สนใจทรัพย์นี้</h2>
          <p className="th mt-2 text-[13.5px] text-muted">
            ทักไลน์มาได้เลย แจ้งรหัส {p.code} เพื่อดูรูปเพิ่มและนัดเวลาเข้าชม
          </p>
          <div className="max-w-[760px] mt-8">
            <LineCta
              kicker={`รหัสทรัพย์ ${p.code}`}
              title="ทักไลน์เพื่อนัดชม"
              sub={`สนใจ ${p.title} แอดไลน์แล้วแจ้งรหัส ${p.code} ได้เลย ผมส่งข้อมูลค่าส่วนกลาง เงื่อนไขสัญญา และนัดเวลาเข้าชมให้`}
            />
          </div>
        </section>

        {suggested.length > 0 && (
          <section className="border-t border-line-2 pt-14 pb-6">
            <div className="kicker">You may also like</div>
            <h2 className="display text-[32px] th mt-2.5">
              รายการที่คุณอาจจะชอบ
            </h2>
            <p className="th mt-2 text-[13.5px] text-muted">
              ทำเลและช่วงค่าเช่าใกล้เคียงกับ {p.title}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
              {suggested.map((n) => (
                <div key={n.id} className="relative">
                  {n.reason && (
                    <span className="absolute left-0 top-3 z-20 bg-ink/85 text-paper th text-[11.5px] px-2.5 py-1.5 pointer-events-none max-w-[calc(100%-3.5rem)] truncate">
                      {n.reason}
                    </span>
                  )}
                  <PropertyCard p={n} cover={suggestedCovers[n.id]} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
