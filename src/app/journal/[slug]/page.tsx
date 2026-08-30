import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { listArticles, articleBySlug, relatedArticles } from "@/lib/queries";
import LeadForm from "@/components/LeadForm";
import { thaiDate, SITE, SITE_URL } from "@/lib/site";
import { decodeSlug } from "@/lib/route";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(decodeSlug(slug));
  if (!a) return {};
  return {
    title: a.title,
    description: a.lead,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.lead,
      type: "article",
      publishedTime: a.published_on,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = articleBySlug(decodeSlug(slug));
  if (!a) notFound();

  const paras = a.body.split(/\n{2,}/).filter(Boolean);
  const related = relatedArticles(a);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.lead,
    datePublished: a.published_on,
    author: { "@type": "Person", name: SITE.agent.name },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/journal/${a.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-[720px] px-6 py-20">
        <Link href="/journal" className="kicker hover:text-ink">
          ← บทความทั้งหมด
        </Link>
        <div className="kicker mt-8">
          {a.tag} · {thaiDate(a.published_on)} · อ่าน {a.read_time}
        </div>
        <h1 className="display th text-[38px] md:text-[46px] mt-4 leading-tight">
          {a.title}
        </h1>
        <p className="th mt-7 text-[16px] leading-[1.9] text-ink-2 border-l-2 border-ink pl-6">
          {a.lead}
        </p>
        <div className="mt-10 space-y-6">
          {paras.map((t, i) => (
            <p key={i} className="th text-[15px] leading-[2] text-ink-2">
              {t}
            </p>
          ))}
        </div>

        <section className="mt-16 pt-12 border-t border-line-2">
          <div className="kicker">Enquiry</div>
          <h2 className="display text-[28px] th mt-2.5">
            มีทรัพย์ที่อยากปล่อยเช่าอยู่หรือเปล่า
          </h2>
          <p className="th mt-2 text-[13.5px] text-muted">
            ส่งรายละเอียดห้องมาได้ ผมประเมินราคาเช่าที่ปิดได้จริงให้ก่อนตัดสินใจ
          </p>
          <div className="mt-8">
            <LeadForm
              source={`/journal/${a.slug}`}
              defaultKind="ประเมินราคา"
              compact
            />
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16 pt-12 border-t border-line-2">
            <div className="kicker">อ่านต่อ</div>
            <div className="grid gap-5 sm:grid-cols-2 mt-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/journal/${r.slug}`}
                  className="group block border border-line-2 hover:border-line transition-colors p-6"
                >
                  <div className="kicker">{r.tag}</div>
                  <h3 className="th mt-2.5 text-[16px] font-medium leading-snug group-hover:underline underline-offset-4 decoration-line">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
