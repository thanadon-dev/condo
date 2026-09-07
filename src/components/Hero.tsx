import Image from "next/image";
import HeroSearch from "./HeroSearch";
import type { Theme } from "@/lib/themes";

/**
 * Hero 5 ทรงตาม mockup — ทุกทรงใช้ข้อความ/รูปชุดเดียวกัน ต่างที่การจัดวาง
 *
 * overlay  รูปเต็ม ข้อความทับล่างซ้าย            (1a, 6a)
 * split    ซ้ายพื้นสี+ข้อความ / ขวารูป            (2a)
 * centered รูปเต็ม ข้อความจัดกลาง                (3a, 5a)
 * boxed    รูปเต็ม + กล่องข้อความลอยทับ          (4a, 8a)
 * stacked  รูปเป็นบล็อก ข้อความอยู่ใต้/ข้าง       (7a, 9a, 10a)
 */

const KICKER = "BANGKOK · REAL ESTATE";
const TITLE_A = "บ้านที่ใช่";
const TITLE_B = "ไม่ควรหายาก";
const LEAD =
  "คัดสรรคอนโด บ้านเดี่ยว และทาวน์โฮมในกรุงเทพฯ พร้อมข้อมูลครบทุกด้าน ทั้งพื้นที่ใช้สอย ค่าส่วนกลาง และทำเลรอบโครงการ";

const IMG = "/media/hero-mock.webp";
const ALT = "สระว่ายน้ำดาดฟ้าคอนโดริมแม่น้ำเจ้าพระยา มองเห็นสกายไลน์กรุงเทพฯ";

type Props = {
  theme: Theme;
  areas: string[];
  priceMin: number;
  priceMax: number;
  /** ตัวเลขสรุปสำหรับธีมที่โชว์สถิติใน hero (10a) */
  stats: { value: string; label: string; note: string }[];
};

function Photo({ priority = true }: { priority?: boolean }) {
  return (
    <Image
      src={IMG}
      alt={ALT}
      fill
      sizes="100vw"
      priority={priority}
      className="object-cover"
    />
  );
}

/** ม่านไล่สีทับรูป ให้ตัวหนังสือขาวอ่านออกเสมอ */
function Scrim({ strong = false }: { strong?: boolean }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: strong
          ? "linear-gradient(180deg,rgba(14,14,14,.32) 0%,rgba(14,14,14,.04) 34%,rgba(14,14,14,.72) 100%)"
          : "linear-gradient(180deg,rgba(14,14,14,.34) 0%,rgba(14,14,14,.10) 42%,rgba(14,14,14,.66) 100%)",
      }}
    />
  );
}

function Kicker({ light = false }: { light?: boolean }) {
  return (
    <span
      className="kicker block"
      style={light ? { color: "rgba(255,255,255,.82)" } : undefined}
    >
      {KICKER}
    </span>
  );
}

export default function Hero({ theme, areas, priceMin, priceMax, stats }: Props) {
  const L = theme.layout;
  const search = (
    <HeroSearch
      areas={areas}
      priceMin={priceMin}
      priceMax={priceMax}
      theme={theme}
    />
  );

  // ---------- split (2a) ----------
  if (L.hero === "split") {
    return (
      <>
        <section
          className="grid lg:grid-cols-[minmax(0,660px)_1fr]"
          style={{ minHeight: L.heroH }}
        >
          <div
            className="flex flex-col justify-center px-6 sm:px-12 lg:pl-[92px] lg:pr-14 py-14 lg:py-0"
            style={{ background: "var(--t-ink)" }}
          >
            <div
              className="w-[64px] h-[6px] mb-7"
              style={{ background: "var(--t-accent)" }}
            />
            <span
              className="kicker block mb-4"
              style={{ color: "var(--t-accent)" }}
            >
              {KICKER}
            </span>
            <h1 className="t-h1 m-0" style={{ color: "var(--t-bg)" }}>
              {TITLE_A}
              <br />
              <span style={{ color: "var(--t-accent)" }}>{TITLE_B}</span>
            </h1>
            <p
              className="th mt-6 max-w-[440px] text-[14.5px] leading-[1.85]"
              style={{ color: "rgba(255,255,255,.72)" }}
            >
              {LEAD}
            </p>
          </div>
          <div className="relative min-h-[280px] lg:min-h-0 bg-sand">
            <Photo />
          </div>
        </section>
        <section className="wrap pt-11">{search}</section>
      </>
    );
  }

  // ---------- stacked (7a, 9a, 10a) ----------
  if (L.hero === "stacked") {
    // 10a: ข้อความซ้าย + ตัวเลขสรุปขวา แล้วรูปเต็มด้านล่าง
    if (L.stats === "rows") {
      return (
        <>
          <section className="wrap pt-14 lg:pt-20 grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-[60px] items-center">
            <div>
              <span className="kicker inline-flex items-center gap-2.5">
                <span
                  className="inline-block w-8 h-px"
                  style={{ background: "var(--t-accent)" }}
                />
                {KICKER}
              </span>
              <h1 className="t-h1 mt-4 m-0">
                {TITLE_A} {TITLE_B}
              </h1>
              <p className="th mt-5 max-w-[540px] text-[14.5px] leading-[1.85] text-muted">
                {LEAD}
              </p>
            </div>
            <div className="flex flex-col">
              {stats.map((s, i) => (
                <span
                  key={s.label}
                  className="flex items-baseline gap-3.5 py-3.5"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid var(--t-line-2)",
                  }}
                >
                  <span
                    className="num text-[28px]"
                    style={{ color: "var(--t-accent)" }}
                  >
                    {s.value}
                  </span>
                  <span className="th text-[13px] text-muted">{s.label}</span>
                </span>
              ))}
            </div>
          </section>

          <section className="wrap pt-10">
            <div
              className="relative overflow-hidden bg-sand h-[300px] sm:h-[420px]"
              style={{ borderRadius: "var(--t-radius)" }}
            >
              <Photo />
            </div>
          </section>
          <section className="wrap pt-10">{search}</section>
        </>
      );
    }

    // 7a: จัดกลาง มีเส้นประดับ รูปอยู่ในกรอบซ้อน
    if (L.centerSections) {
      return (
        <>
          <section className="wrap pt-12 lg:pt-14 text-center">
            <span className="kicker inline-flex items-center gap-3.5">
              <span
                className="inline-block w-10 h-px"
                style={{ background: "var(--t-accent)" }}
              />
              {KICKER}
              <span
                className="inline-block w-10 h-px"
                style={{ background: "var(--t-accent)" }}
              />
            </span>

            <div
              className="mt-7 p-[9px]"
              style={{ border: "1px solid var(--t-line)" }}
            >
              <div
                className="relative overflow-hidden bg-sand"
                style={{ height: L.heroH }}
              >
                <Photo />
              </div>
            </div>

            <h1 className="t-h1 mt-10 m-0">
              {TITLE_A} {TITLE_B}
            </h1>
            <p className="th mt-4 max-w-[660px] mx-auto text-[14.5px] leading-[1.9] text-muted">
              {LEAD}
            </p>
          </section>
          <section className="wrap pt-11">{search}</section>
        </>
      );
    }

    // 9a: มินิมอล — รูปเป็นบล็อก แล้วข้อความ 2 คอลัมน์
    return (
      <>
        <section className="wrap pt-10">
          <div
            className="relative overflow-hidden bg-sand"
            style={{ height: L.heroH, borderRadius: "var(--t-radius)" }}
          >
            <Photo />
          </div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 pt-10">
            <div>
              <Kicker />
              <h1 className="t-h1 mt-4 m-0">
                {TITLE_A} {TITLE_B}
              </h1>
            </div>
            <p className="th text-[14.5px] leading-[1.95] text-muted self-end">
              {LEAD}
            </p>
          </div>
        </section>
        <section className="wrap pt-12">{search}</section>
      </>
    );
  }

  // ---------- centered (3a, 5a) ----------
  if (L.hero === "centered") {
    // 5a: กล่องทึบจัดกลางล่าง + ป้ายมุมซ้ายบน · 3a: ข้อความจัดกลาง ไม่มีป้าย
    const boxed = L.search === "bare" && L.areas === "list";
    return (
      <>
        <section
          className="relative overflow-hidden bg-sand"
          style={{ height: L.heroH }}
        >
          <Photo />
          <Scrim />
          {boxed && (
            <span
              className="absolute left-0 top-0 th text-[12px] px-4 py-2.5 z-10"
              style={{
                background: "var(--t-accent)",
                color: "var(--t-accent-ink)",
              }}
            >
              {KICKER}
            </span>
          )}

          {boxed ? (
            <div className="absolute inset-0 flex items-end justify-center px-6 pb-11">
              <div
                className="px-8 sm:px-10 py-8 text-center max-w-[860px]"
                style={{ background: "var(--t-bg)" }}
              >
                <h1 className="t-h1 m-0">
                  {TITLE_A} {TITLE_B}
                </h1>
                <p className="th mt-4 max-w-[620px] mx-auto text-[14px] leading-[1.85] text-muted">
                  {LEAD}
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <div
                className="w-[70px] h-px mb-6"
                style={{ background: "var(--t-accent)" }}
              />
              <Kicker light />
              <h1 className="t-h1 mt-5 m-0 text-white">
                {TITLE_A}
                <br />
                {TITLE_B}
              </h1>
              <p className="th mt-6 max-w-[620px] text-[14.5px] leading-[1.9] text-white/78">
                {LEAD}
              </p>
            </div>
          )}
        </section>
        <section className="wrap pt-10">{search}</section>
      </>
    );
  }

  // ---------- boxed (4a, 8a) ----------
  if (L.hero === "boxed") {
    const glass = L.stats === "cards" && L.search === "inHero";
    return (
      <>
        <section
          className="relative overflow-hidden bg-sand"
          style={{ height: L.heroH }}
        >
          <Photo />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,14,26,.18)" }}
          />

          <div className="absolute inset-0 flex items-center">
            <div className="wrap w-full">
              <div
                className="p-7 sm:p-9 max-w-[640px]"
                style={{
                  background: "var(--t-panel-bg)",
                  borderRadius: "var(--t-radius)",
                  boxShadow: "var(--t-card-shadow)",
                  ...(glass ? { backdropFilter: "blur(14px)" } : {}),
                }}
              >
                <span
                  className="kicker inline-block px-3.5 py-1.5"
                  style={{
                    background: "var(--t-bg-3)",
                    borderRadius: "var(--t-radius-pill)",
                  }}
                >
                  {KICKER}
                </span>
                <h1 className="t-h1 mt-4 m-0">
                  {TITLE_A} {TITLE_B}
                </h1>
                <p className="th mt-4 text-[14px] leading-[1.85] text-muted">
                  {LEAD}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`wrap relative z-10 ${
            L.search === "overlap" ? "-mt-10" : "pt-10"
          }`}
        >
          {search}
        </section>
      </>
    );
  }

  // ---------- overlay (1a, 6a) — ค่าเริ่มต้น ----------
  const big = L.hero === "overlay" && L.areas === "tiles"; // 6a ตัวหนังสือใหญ่กว่า
  return (
    <>
      <section
        className="relative overflow-hidden bg-sand"
        style={{ height: L.heroH }}
      >
        <Photo />
        <Scrim strong={big} />
        {big && (
          <span
            className="absolute left-0 top-0 th text-[12.5px] px-4 py-3 z-10"
            style={{
              background: "var(--t-accent)",
              color: "var(--t-accent-ink)",
            }}
          >
            {KICKER}
          </span>
        )}

        <div className="relative h-full wrap pb-12 sm:pb-[84px] flex flex-col justify-end">
          {!big && <Kicker light />}
          <h1 className="t-h1 mt-4 text-white max-w-[1000px] m-0">
            {TITLE_A}{" "}
            {big ? (
              <span style={{ color: "var(--t-accent)" }}>{TITLE_B}</span>
            ) : (
              TITLE_B
            )}
          </h1>
          {!big && (
            <p className="th mt-5 max-w-[520px] text-[14px] sm:text-[15.5px] leading-[1.8] font-light text-white/80">
              {LEAD}
            </p>
          )}
        </div>
      </section>

      {big ? (
        // 6a: คำโปรยอยู่ข้างแถบค้นหา
        <section className="wrap pt-9">
          <div className="grid lg:grid-cols-[1.05fr_1.35fr] gap-8 lg:gap-11 items-end">
            <p className="th text-[14px] leading-[1.9] text-muted">{LEAD}</p>
            {search}
          </div>
        </section>
      ) : (
        <section className="wrap relative z-10 -mt-8 lg:-mt-14">{search}</section>
      )}
    </>
  );
}
