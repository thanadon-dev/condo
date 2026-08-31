import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Section } from "@/components/Section";
import PropertyCard from "@/components/PropertyCard";
import {
  listAreas,
  propertiesInArea,
  coverMap,
  aliasTarget,
} from "@/lib/queries";
import { decodeSlug } from "@/lib/route";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return listAreas().map((a) => ({ slug: a.slug }));
}

function areaBySlug(slug: string) {
  const s = decodeSlug(slug);
  return listAreas().find((a) => a.slug === s) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = areaBySlug(slug);
  if (!a) return {};
  return {
    title: `อสังหาริมทรัพย์ทำเล${a.name}`,
    description: `รวมคอนโดและบ้านเช่าในทำเล${a.name} กรุงเทพฯ พร้อมราคาและพื้นที่ใช้สอย`,
    alternates: { canonical: `/area/${a.slug}` },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = areaBySlug(slug);
  if (!a) {
    const to = aliasTarget("area", decodeSlug(slug));
    if (to) permanentRedirect(`/area/${to}`);
    notFound();
  }

  const items = propertiesInArea(a);
  const covers = coverMap(items.map((p) => p.id));

  return (
    <Section
      kicker="Neighbourhood"
      title={`ทำเล${a.name}`}
      sub={`พบ ${items.length} รายการที่ตรงกับทำเลนี้`}
    >
      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        <p className="th text-[14px] text-muted">
          ยังไม่มีทรัพย์ในทำเลนี้ ลองดูทรัพย์ทั้งหมดแทน
        </p>
      )}
    </Section>
  );
}
