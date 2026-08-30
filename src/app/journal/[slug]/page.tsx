import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { listArticles, articleBySlug } from "@/lib/queries";
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
      </article>
    </>
  );
}
