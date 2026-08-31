"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { SORTS } from "@/lib/filters";

type Facet = { value: string; count: number };

export default function FilterBar({
  cats,
  types,
  priceMin,
  priceMax,
  total,
  shown,
}: {
  cats: Facet[];
  types: Facet[];
  priceMin: number;
  priceMax: number;
  total: number;
  shown: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const [q, setQ] = useState(sp.get("q") ?? "");

  useEffect(() => {
    setQ(sp.get("q") ?? "");
  }, [sp]);

  function apply(patch: Record<string, string | null>) {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    const s = next.toString();
    start(() => router.push(s ? `${pathname}?${s}` : pathname, { scroll: false }));
  }

  const cat = sp.get("cat") ?? "";
  const type = sp.get("type") ?? "";
  const beds = sp.get("beds") ?? "";
  const sort = sp.get("sort") ?? "new";
  const min = sp.get("min") ?? "";
  const max = sp.get("max") ?? "";
  const dirty = Boolean(q || cat || type || beds || min || max);

  const chip = (on: boolean) =>
    `th text-[12.5px] px-4 py-2.5 border transition-colors ${
      on
        ? "border-ink bg-ink text-paper"
        : "border-line-2 text-ink-2 hover:border-line"
    }`;

  return (
    <div className="border border-line-2 bg-paper">
      <form
        className="flex flex-wrap gap-3 p-5 border-b border-line-2"
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q: q.trim() || null });
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหาทำเล ชื่อโครงการ หรือถนน"
          aria-label="ค้นหาทรัพย์"
          className="th flex-1 min-w-[220px] text-[13.5px] px-4 py-3 border border-line-2 focus:border-ink outline-none"
        />
        <button
          type="submit"
          className="th text-[13px] px-7 py-3 bg-ink text-paper hover:opacity-85 transition-opacity"
        >
          ค้นหา
        </button>
        {dirty && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              start(() => router.push(pathname, { scroll: false }));
            }}
            className="th text-[13px] px-5 py-3 border border-line-2 hover:border-ink transition-colors"
          >
            ล้างตัวกรอง
          </button>
        )}
      </form>

      <div className="p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker w-[76px]">หมวดหมู่</span>
          <button onClick={() => apply({ cat: null })} className={chip(!cat)}>
            ทั้งหมด
          </button>
          {cats.map((c) => (
            <button
              key={c.value}
              onClick={() => apply({ cat: c.value })}
              className={chip(cat === c.value)}
            >
              {c.value} ({c.count})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker w-[76px]">ประเภท</span>
          <button onClick={() => apply({ type: null })} className={chip(!type)}>
            ทุกประเภท
          </button>
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => apply({ type: t.value })}
              className={chip(type === t.value)}
            >
              {t.value} ({t.count})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker w-[76px]">ห้องนอน</span>
          <button onClick={() => apply({ beds: null })} className={chip(!beds)}>
            ไม่ระบุ
          </button>
          {["1", "2", "3", "4"].map((b) => (
            <button
              key={b}
              onClick={() => apply({ beds: b })}
              className={chip(beds === b)}
            >
              {b}+
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="kicker w-[76px]">ค่าเช่า</span>
          <input
            type="number"
            inputMode="numeric"
            defaultValue={min}
            key={"min" + min}
            onBlur={(e) => apply({ min: e.target.value || null })}
            placeholder={String(priceMin)}
            aria-label="ค่าเช่าต่ำสุด (บาท/เดือน)"
            className="th w-[150px] text-[13px] px-3.5 py-2.5 border border-line-2 focus:border-ink outline-none"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            inputMode="numeric"
            defaultValue={max}
            key={"max" + max}
            onBlur={(e) => apply({ max: e.target.value || null })}
            placeholder={String(priceMax)}
            aria-label="ค่าเช่าสูงสุด (บาท/เดือน)"
            className="th w-[150px] text-[13px] px-3.5 py-2.5 border border-line-2 focus:border-ink outline-none"
          />
          <span className="th text-[12px] text-muted">บาท / เดือน</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-line-2 bg-sand/50">
        <span className="th text-[13px] text-ink-2">
          {pending ? "กำลังกรอง…" : `พบ ${shown} จาก ${total} รายการ`}
        </span>
        <label className="flex items-center gap-2.5">
          <span className="kicker">เรียงตาม</span>
          <select
            value={sort}
            onChange={(e) => apply({ sort: e.target.value })}
            className="th text-[13px] px-3.5 py-2.5 border border-line-2 bg-paper focus:border-ink outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
