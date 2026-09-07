"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Theme } from "@/lib/themes";

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
  theme,
}: {
  areas: string[];
  priceMin: number;
  priceMax: number;
  theme: Theme;
}) {
  const router = useRouter();
  const L = theme.layout;

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

  const label = "kicker text-[9.5px]";
  // color: inherit ไม่พอ — select/option ใน Chrome ใช้สีระบบถ้าไม่กำหนด
  const field =
    "th w-full text-[15px] bg-transparent border-0 outline-none p-0 text-ink [&>option]:text-black";

  // bare = ไม่มีพื้น ใช้เส้นคั่นอย่างเดียว (3a, 5a, 6a, 9a, 10a)
  const bare = L.search === "bare";
  // inHero = อยู่ในกล่อง hero แล้ว ไม่ต้องมีพื้นซ้อน (8a)
  const inHero = L.search === "inHero";

  const cellBorder = bare
    ? "border-b md:border-b-0 md:border-r border-line-2 last:border-r-0"
    : "border-b md:border-b-0 md:border-r border-line-2";

  const cell = `px-0 md:px-[26px] first:md:pl-0 py-5 flex flex-col gap-[7px] ${
    bare ? cellBorder : cellBorder
  }`;

  return (
    <>
      <div
        className={`grid grid-cols-1 items-stretch overflow-hidden ${
          bare || inHero ? "" : "t-panel"
        } ${bare ? "border-y border-line-2" : ""}`}
        style={{
          gridTemplateColumns: undefined,
          // สัดส่วนคอลัมน์ของแต่ละธีมถอดจาก mockup
          ["--search-cols" as string]: L.searchCols,
          padding: inHero ? 0 : undefined,
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-[var(--search-cols)] items-stretch w-full"
          style={{ padding: bare ? 0 : undefined }}
        >
          <label className={cell}>
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

          <label className={cell}>
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

          <div className={`${cell} gap-1`}>
            <div className="flex justify-between items-baseline gap-3">
              <span className={label}>ค่าเช่า</span>
              <span className="num text-[13px] text-ink whitespace-nowrap">
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
            className={`t-btn th text-[13px] tracking-[0.1em] px-[46px] ${
              bare ? "py-4 my-3 md:ml-6" : "py-5"
            }`}
            style={{
              // ธีมมุมโค้ง: ปุ่มในแถบทึบใช้มุมของธีม ปุ่มในแถบเปล่าใช้ pill
              borderRadius: bare
                ? "var(--t-radius-pill)"
                : "var(--t-radius-btn, 0px)",
            }}
          >
            ค้นหา
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-5">
        <span className="kicker text-[10px] mr-2">หมวดหมู่</span>
        {CHIPS.map((c) => {
          const on = chipOn === c;
          return (
            <button
              key={c}
              onClick={() => chip(c)}
              className={`th text-[12.5px] px-[18px] py-2.5 border transition-colors ${
                on
                  ? "t-btn border-transparent"
                  : "border-line-2 text-ink-2 hover:border-ink hover:text-ink"
              }`}
              style={{
                borderRadius: "var(--t-radius-pill)",
                // ธีมมืดที่ --t-card เป็น transparent ต้องมีพื้นของตัวเอง ไม่งั้นชิปหายไปกับพื้น
                background: on ? undefined : "var(--t-panel-bg)",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
    </>
  );
}
