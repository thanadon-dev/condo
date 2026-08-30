"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function TimelineFilter({
  cats,
  active,
  total,
}: {
  cats: { value: string; count: number }[];
  active: string;
  total: number;
}) {
  const pathname = usePathname();
  const sp = useSearchParams();

  function href(cat: string) {
    const next = new URLSearchParams(sp.toString());
    if (cat) next.set("cat", cat);
    else next.delete("cat");
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
      <span className="kicker w-[76px]">ประเภท</span>
      <Link href={href("")} scroll={false} className={chip(!active)}>
        ทั้งหมด ({total})
      </Link>
      {cats.map((c) => (
        <Link
          key={c.value}
          href={href(c.value)}
          scroll={false}
          className={chip(active === c.value)}
        >
          {c.value} ({c.count})
        </Link>
      ))}
    </div>
  );
}
