import { notFound } from "next/navigation";
import Link from "next/link";
import { adminArticleById } from "@/lib/admin";
import AdminForm from "@/components/admin/AdminForm";
import { saveArticle } from "@/app/actions/admin";
import { ARTICLE_FIELDS } from "../../fields";

export const dynamic = "force-dynamic";

export default async function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = adminArticleById(Number(id));
  if (!a) notFound();

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/articles" className="kicker hover:text-ink">
            ← บทความทั้งหมด
          </Link>
          <h2 className="display text-[26px] th mt-3">{a.title}</h2>
        </div>
        <Link
          href={`/journal/${a.slug}`}
          className="th text-[12.5px] px-4 py-2.5 border border-line-2 hover:border-ink transition-colors"
        >
          ดูหน้าจริง
        </Link>
      </div>

      <AdminForm
        action={saveArticle}
        fields={ARTICLE_FIELDS}
        id={a.id}
        values={{
          title: a.title,
          tag: a.tag,
          published_on: a.published_on,
          read_time: a.read_time,
          lead: a.lead,
          body: a.body,
          published: a.published,
        }}
      />
    </>
  );
}
