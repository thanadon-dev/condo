import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Section } from "@/components/Section";
import TagFilter from "@/components/TagFilter";
import { listArticles, articleTags } from "@/lib/queries";
import { thaiDate } from "@/lib/site";

export const revalidate = 3600;

type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SP;
}): Promise<Metadata> {
  const sp = await searchParams;
  const raw = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag;
  const valid = new Set(articleTags().map((t) => t.value));
  const tag = raw && valid.has(raw) ? raw : "";

  return {
    title: tag ? `บทความหมวด${tag}` : "บทความ",
    description:
      "บันทึกจากงานจริงเรื่องการตั้งราคา การอ่านทำเล และการดูแลผู้เช่าในกรุงเทพฯ และปริมณฑล",
    alternates: { canonical: "/journal" },
    robots: tag ? { index: false, follow: true } : { index: true, follow: true },
  };
}

async function List({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag;
  const tags = articleTags();
  const valid = new Set(tags.map((t) => t.value));
  const tag = raw && valid.has(raw) ? raw : "";

  const all = listArticles();
  const items = tag ? all.filter((a) => a.tag === tag) : all;

  return (
    <>
      <TagFilter tags={tags} active={tag} total={all.length} />

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {items.map((a) => (
          <Link
            key={a.id}
            href={`/journal/${a.slug}`}
            className="group block border border-line-2 hover:border-line transition-colors p-8"
          >
            <div className="kicker">
              {a.tag} · {thaiDate(a.published_on)} · อ่าน {a.read_time}
            </div>
            <h2 className="th mt-3.5 text-[21px] font-medium leading-snug group-hover:underline underline-offset-4 decoration-line">
              {a.title}
            </h2>
            <p className="th mt-3.5 text-[13.5px] text-muted leading-relaxed">
              {a.lead}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function JournalPage({ searchParams }: { searchParams: SP }) {
  return (
    <Section
      kicker="Journal"
      title="บทความ"
      sub="บันทึกจากงานจริงเรื่องการตั้งราคา การอ่านทำเล และการดูแลผู้เช่า"
    >
      <Suspense
        fallback={<div className="th text-[13.5px] text-muted">กำลังโหลด…</div>}
      >
        <List searchParams={searchParams} />
      </Suspense>
    </Section>
  );
}
