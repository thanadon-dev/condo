"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearch({ areas }: { areas: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (cat) p.set("cat", cat);
    const s = p.toString();
    router.push(s ? `/properties?${s}` : "/properties");
  }

  return (
    <form
      onSubmit={go}
      className="mt-10 flex flex-wrap gap-3 max-w-[760px] border border-line-2 bg-paper p-3"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        list="condo-areas"
        placeholder="ทำเล หรือ ชื่อโครงการ"
        aria-label="ค้นหาทำเลหรือโครงการ"
        className="th flex-1 min-w-[200px] text-[14px] px-4 py-3.5 border border-line-2 focus:border-ink outline-none"
      />
      <datalist id="condo-areas">
        {areas.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>

      <select
        value={cat}
        onChange={(e) => setCat(e.target.value)}
        aria-label="หมวดหมู่"
        className="th text-[14px] px-4 py-3.5 border border-line-2 bg-paper focus:border-ink outline-none"
      >
        <option value="">ทุกหมวดหมู่</option>
        <option value="คอนโด">คอนโด</option>
        <option value="บ้านเช่า">บ้านเช่า</option>
      </select>

      <button
        type="submit"
        className="th text-[14px] px-8 py-3.5 bg-ink text-paper hover:opacity-85 transition-opacity"
      >
        ค้นหา
      </button>
    </form>
  );
}
