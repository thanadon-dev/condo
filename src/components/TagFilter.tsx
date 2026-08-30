"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function TagFilter({
  tags,
  active,
  total,
  label = "หมวด",
}: {
  tags: { value: string; count: number }[];
  active: string;
  total: number;
  label?: string;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();

  function href(tag: string) {
    const next = new URLSearchParams(sp.toString());
    if (tag) next.set("tag", tag);
    else next.delete("tag");
    const s = next.toString();
    return s ? `${pathname}?${s}` : pathname;
  }

  const chip = (on: boolean) =>
    `th text-[12.5px] px-4 py-2.5 border transition-colors ${
      on
        ? "border-ink bg-ink text-paper"
        : "border-line-2 bg-paper text-ink-2 hover:border-line"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="kicker w-[64px]">{label}</span>
      <Link href={href("")} scroll={false} className={chip(!active)}>
        ทั้งหมด ({total})
      </Link>
      {tags.map((t) => (
        <Link
          key={t.value}
          href={href(t.value)}
          scroll={false}
          className={chip(active === t.value)}
        >
          {t.value} ({t.count})
        </Link>
      ))}
    </div>
  );
}
