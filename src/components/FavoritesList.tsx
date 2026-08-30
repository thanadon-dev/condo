"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/useFavorites";
import type { Property } from "@/lib/queries";
import PropertyCard from "@/components/PropertyCard";

export default function FavoritesList({ all }: { all: Property[] }) {
  const { ids, clear } = useFavorites();
  const items = all.filter((p) => ids.includes(p.id));

  if (ids.length === 0) {
    return (
      <div className="border border-line-2 p-16 text-center">
        <p className="th text-[16px]">ยังไม่มีทรัพย์ที่เก็บไว้</p>
        <p className="th mt-2 text-[13.5px] text-muted">
          กดรูปหัวใจบนการ์ดทรัพย์เพื่อเก็บไว้ดูทีหลัง
        </p>
        <Link
          href="/properties"
          className="inline-block th text-[13px] mt-6 px-6 py-3 border border-line hover:border-ink transition-colors"
        >
          ดูทรัพย์ทั้งหมด
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-8">
        <span className="th text-[13.5px] text-ink-2">
          เก็บไว้ {items.length} รายการ
        </span>
        <button
          onClick={clear}
          className="th text-[13px] px-5 py-2.5 border border-line-2 hover:border-ink transition-colors"
        >
          ล้างทั้งหมด
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
