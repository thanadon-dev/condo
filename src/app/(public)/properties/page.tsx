import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Section } from "@/components/Section";
import PropertyCard from "@/components/PropertyCard";
import FilterBar from "@/components/FilterBar";
import { searchProperties, propertyFacets, coverMap } from "@/lib/queries";
import { parseFilters, isFiltered, describeFilters } from "@/lib/filters";
import JsonLd from "@/components/JsonLd";
import { itemList, breadcrumb } from "@/lib/jsonld";

export const revalidate = 3600;

type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const sp = await searchParams;
  const f = parseFilters(sp);
  const filtered = isFiltered(f);
  const desc = describeFilters(f);

  return {
    title: filtered && desc ? `ทรัพย์: ${desc}` : "ทรัพย์ทั้งหมด",
    description:
      "รวมคอนโด บ้านเดี่ยว ทาวน์โฮม และเพนท์เฮาส์ในกรุงเทพฯ และปริมณฑล พร้อมราคาและพื้นที่ใช้สอย",
    alternates: { canonical: "/properties" },
    robots: filtered
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

async function Results({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const f = parseFilters(sp);
  const facets = propertyFacets();
  const items = searchProperties(f);
  const covers = coverMap(items.map((p) => p.id));

  return (
    <>
      <JsonLd
        id="ld-props"
        data={itemList(items, (p) => `/property/${p.slug}`)}
      />
      <FilterBar
        cats={facets.cats}
        types={facets.types}
        priceMin={facets.priceMin}
        priceMax={facets.priceMax}
        total={facets.total}
        shown={items.length}
      />

      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {items.map((p, i) => (
            <PropertyCard
              key={p.id}
              p={p}
              cover={covers[p.id]}
              priority={i < 3}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-line-2 p-16 text-center">
          <p className="th text-[16px]">ไม่พบทรัพย์ที่ตรงกับเงื่อนไข</p>
          <p className="th mt-2 text-[13.5px] text-muted">
            ลองขยายช่วงราคาหรือเปลี่ยนหมวดหมู่
          </p>
          <Link
            href="/properties"
            className="inline-block th text-[13px] mt-6 px-6 py-3 border border-line hover:border-ink transition-colors"
          >
            ล้างตัวกรองทั้งหมด
          </Link>
        </div>
      )}
    </>
  );
}

export default function PropertiesPage({ searchParams }: { searchParams: SP }) {
  return (
    <Section
      as="h1"
      kicker="Properties"
      title="ทรัพย์ทั้งหมด"
      sub="กรองตามหมวดหมู่ ประเภท ห้องนอน และช่วงราคา — เงื่อนไขถูกเก็บไว้ใน URL แชร์ต่อได้"
    >
      <Suspense
        fallback={
          <div className="border border-line-2 p-16 th text-[13.5px] text-muted">
            กำลังโหลด…
          </div>
        }
      >
        <Results searchParams={searchParams} />
      </Suspense>
    </Section>
  );
}
