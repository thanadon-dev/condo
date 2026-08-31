import { notFound } from "next/navigation";
import Link from "next/link";
import { adminPropertyById } from "@/lib/admin";
import AdminForm from "@/components/admin/AdminForm";
import ImageManager from "@/components/admin/ImageManager";
import { saveProperty } from "@/app/actions/admin";
import { imagesOf } from "@/lib/queries";
import { PROPERTY_FIELDS } from "../fields";

export const dynamic = "force-dynamic";

export default async function EditProperty({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = adminPropertyById(Number(id));
  if (!p) notFound();

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/properties" className="kicker hover:text-ink">
            ← ทรัพย์ทั้งหมด
          </Link>
          <h2 className="display text-[26px] th mt-3">{p.title}</h2>
          <p className="th mt-1 text-[12.5px] text-muted">
            {p.code} · /property/{p.slug}
          </p>
        </div>
        <Link
          href={`/property/${p.slug}`}
          className="th text-[12.5px] px-4 py-2.5 border border-line-2 hover:border-ink transition-colors"
        >
          ดูหน้าจริง
        </Link>
      </div>

      <AdminForm
        action={saveProperty}
        fields={PROPERTY_FIELDS}
        id={p.id}
        values={{
          title: p.title,
          cat: p.cat,
          type: p.type,
          district: p.district,
          price: p.price,
          location: p.location,
          beds: p.beds,
          baths: p.baths,
          area: p.area,
          floor: p.floor,
          year: p.year,
          park: p.park,
          descr: p.descr,
          descr2: p.descr2,
          published: p.published,
        }}
      />

      <ImageManager
        propertyId={p.id}
        images={imagesOf(p.id).map((img) => ({
          id: img.id,
          url: img.url,
          thumb_url: img.thumb_url,
          alt: img.alt,
          width: img.width,
          height: img.height,
        }))}
      />
    </>
  );
}
