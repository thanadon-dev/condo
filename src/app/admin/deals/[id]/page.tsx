import { notFound } from "next/navigation";
import Link from "next/link";
import { adminDealById } from "@/lib/admin";
import AdminForm from "@/components/admin/AdminForm";
import { saveDeal } from "@/app/actions/admin";
import { DEAL_FIELDS } from "../../fields";

export const dynamic = "force-dynamic";

export default async function EditDeal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const d = adminDealById(Number(id));
  if (!d) notFound();

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/deals" className="kicker hover:text-ink">
            ← ผลงานทั้งหมด
          </Link>
          <h2 className="display text-[26px] th mt-3">{d.title}</h2>
        </div>
        <Link
          href={`/deal/${d.slug}`}
          className="th text-[12.5px] px-4 py-2.5 border border-line-2 hover:border-ink transition-colors"
        >
          ดูหน้าจริง
        </Link>
      </div>

      <AdminForm
        action={saveDeal}
        fields={DEAL_FIELDS}
        id={d.id}
        values={{
          closed_on: d.closed_on,
          cat: d.cat,
          title: d.title,
          location: d.location,
          value: d.value,
          body: d.body,
          published: d.published,
        }}
      />
    </>
  );
}
