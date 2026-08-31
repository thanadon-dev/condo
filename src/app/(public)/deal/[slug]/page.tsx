import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { listDeals, dealBySlug, aliasTarget } from "@/lib/queries";
import { decodeSlug } from "@/lib/route";
import { thaiDate, SITE, SITE_URL } from "@/lib/site";
import LeadForm from "@/components/LeadForm";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return listDeals().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = dealBySlug(decodeSlug(slug));
  if (!d) return {};
  return {
    title: d.title,
    description: d.body.slice(0, 160),
    alternates: { canonical: `/deal/${d.slug}` },
    openGraph: { title: d.title, description: d.body.slice(0, 160) },
  };
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const key = decodeSlug(slug);
  const d = dealBySlug(key);
  if (!d) {
    const to = aliasTarget("deal", key);
    if (to) permanentRedirect(`/deal/${to}`);
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.title,
    datePublished: d.closed_on,
    author: { "@type": "Person", name: SITE.agent.name },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/deal/${d.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-[720px] px-6 py-20">
        <Link href="/about" className="kicker hover:text-ink">
          ← ไทม์ไลน์ผลงานทั้งหมด
        </Link>

        <div className="kicker mt-8">
          {thaiDate(d.closed_on)} · {d.cat}
        </div>
        <h1 className="display th text-[36px] md:text-[44px] mt-4 leading-tight">
          {d.title}
        </h1>

        <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
          <div className="flex justify-between py-3.5 border-b border-line-2 th text-[13.5px]">
            <dt className="text-muted">ทำเล</dt>
            <dd>{d.location}</dd>
          </div>
          <div className="flex justify-between py-3.5 border-b border-line-2 th text-[13.5px]">
            <dt className="text-muted">มูลค่าดีล</dt>
            <dd>{d.value}</dd>
          </div>
        </dl>

        <div className="mt-10 space-y-6">
          {d.body.split(/\n{2,}/).filter(Boolean).map((t, i) => (
            <p key={i} className="th text-[15px] leading-[2] text-ink-2">
              {t}
            </p>
          ))}
        </div>

        <section className="mt-16 pt-12 border-t border-line-2">
          <div className="kicker">Enquiry</div>
          <h2 className="display text-[28px] th mt-2.5">
            อยากให้ช่วยดูทรัพย์ของคุณไหม
          </h2>
          <p className="th mt-2 text-[13.5px] text-muted">
            คุยได้ทั้งกรณีปล่อยเช่าใหม่ ผู้เช่าเดิมย้ายออก
            หรือประกาศไว้แล้วยังไม่มีคนติดต่อ
          </p>
          <div className="mt-8">
            <LeadForm
              source={`/deal/${d.slug}`}
              defaultKind="ฝากปล่อยเช่า"
              compact
            />
          </div>
        </section>
      </article>
    </>
  );
}
