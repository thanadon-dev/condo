"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const TYPES = ["ทุกประเภท", "คอนโด", "บ้านเช่า"];
const CHIPS = [
  "ทั้งหมด",
  "คอนโดมิเนียม",
  "บ้านเดี่ยว",
  "ทาวน์โฮม",
  "เพนท์เฮาส์",
];

const STEP = 1000;

/** ปัดลง/ขึ้นให้ลงตัวหลักพัน เพื่อให้ slider ลากได้สวย */
const floorTo = (n: number) => Math.max(0, Math.floor(n / STEP) * STEP);
const ceilTo = (n: number) => Math.ceil(n / STEP) * STEP;

export default function HeroSearch({
  areas,
  priceMin,
  priceMax,
}: {
  areas: string[];
  priceMin: number;
  priceMax: number;
}) {
  const router = useRouter();

  // ขอบเขต slider = ราคาจริงต่ำสุด/สูงสุดในระบบ
  const MIN = floorTo(priceMin || 0);
  const MAX = ceilTo(priceMax || MIN + STEP);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [pMin, setPMin] = useState(MIN);
  const [pMax, setPMax] = useState(MAX);
  const [chipOn, setChipOn] = useState("ทั้งหมด");

  const lo = Math.min(pMin, pMax);
  const hi = Math.max(pMin, pMax);

  const fmt = (n: number) => n.toLocaleString("en-US");
  const priceLabel =
    lo === MIN && hi === MAX
      ? `${fmt(MIN)} – ${fmt(MAX)} บาท/เดือน`
      : `${fmt(lo)} – ${fmt(hi)} บาท/เดือน`;

  function push() {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (cat) p.set("cat", cat);
    if (lo > MIN) p.set("min", String(lo));
    if (hi < MAX) p.set("max", String(hi));
    const s = p.toString();
    router.push(s ? `/properties?${s}` : "/properties");
  }

  function chip(label: string) {
    setChipOn(label);
    if (label === "ทั้งหมด") return router.push("/properties");
    router.push(`/properties?${new URLSearchParams({ type: label })}`);
  }

  const label = "text-[9.5px] tracking-[0.3em] uppercase text-dim";
  const field =
    "th w-full text-[15px] text-ink bg-transparent border-0 outline-none p-0";

  return (
    <>
      <div className="bg-paper border border-line-2 shadow-[0_24px_60px_-30px_rgba(20,20,20,0.34)] grid grid-cols-1 md:grid-cols-[1.35fr_.95fr_1.3fr_auto] items-stretch">
        <label className="px-[26px] py-5 flex flex-col gap-[7px] border-b md:border-b-0 md:border-r border-line-2">
          <span className={label}>ทำเล / โครงการ</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && push()}
            list="condo-areas"
            placeholder="พิมพ์ทำเล เช่น สุขุมวิท"
            aria-label="ค้นหาทำเลหรือโครงการ"
            className={field}
          />
          <datalist id="condo-areas">
            {areas.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </label>

        <label className="px-[26px] py-5 flex flex-col gap-[7px] border-b md:border-b-0 md:border-r border-line-2">
          <span className={label}>ประเภท</span>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            aria-label="ประเภททรัพย์"
            className={`${field} cursor-pointer appearance-none`}
          >
            {TYPES.map((t) => (
              <option key={t} value={t === "ทุกประเภท" ? "" : t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <div className="px-[26px] py-[18px] flex flex-col gap-1 border-b md:border-b-0 md:border-r border-line-2">
          <div className="flex justify-between items-baseline gap-3">
            <span className={label}>ค่าเช่า</span>
            <span className="th text-[13px] text-ink whitespace-nowrap">
              {priceLabel}
            </span>
          </div>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={pMin}
            onChange={(e) => setPMin(Number(e.target.value))}
            aria-label="ค่าเช่าต่ำสุด (บาทต่อเดือน)"
          />
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={pMax}
            onChange={(e) => setPMax(Number(e.target.value))}
            aria-label="ค่าเช่าสูงสุด (บาทต่อเดือน)"
          />
        </div>

        <button
          onClick={push}
          className="th text-[12px] tracking-[0.16em] px-[46px] py-5 bg-ink text-paper hover:bg-[#2c2a27] transition-colors"
        >
          ค้นหา
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-5">
        <span className="text-[11px] tracking-[0.24em] text-faint mr-2">
          หมวดหมู่
        </span>
        {CHIPS.map((c) => {
          const on = chipOn === c;
          return (
            <button
              key={c}
              onClick={() => chip(c)}
              className={`th text-[12.5px] px-[18px] py-2.5 border transition-colors ${
                on
                  ? "bg-ink text-paper border-ink"
                  : "bg-paper border-line-2 text-ink-2 hover:border-ink hover:text-ink"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </>
  );
}
