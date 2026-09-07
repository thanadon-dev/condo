import Link from "next/link";
import Image from "next/image";
import type { Theme } from "@/lib/themes";

type Area = { id: number; name: string; slug: string; cover?: string | null; count: number };

/**
 * ส่วนทำเล 6 ทรงตาม mockup
 * weighted กริด 3 ช่อง ช่องแรกกว้าง (1a) · duo 2 คอลัมน์สูง (2a)
 * list แถวแนวนอนรูปเล็ก (5a) · tiles จตุรัสชิดกัน (6a)
 * framed กรอบซ้อนจัดกลาง (7a) · grid กริด 3 เท่ากัน (ที่เหลือ)
 */
export default function AreasSection({
  areas,
  theme,
}: {
  areas: Area[];
  theme: Theme;
}) {
  const L = theme.layout;
  const center = L.centerSections;

  const head = (
    <div className={center ? "text-center" : ""}>
      {center ? (
        <span className="kicker inline-flex items-center gap-3.5">
          <span className="inline-block w-10 h-px" style={{ background: "var(--t-accent)" }} />
          Neighbourhoods
          <span className="inline-block w-10 h-px" style={{ background: "var(--t-accent)" }} />
        </span>
      ) : (
        <span className="kicker">Neighbourhoods</span>
      )}
      <h2 className="t-h2 mt-4">ทำเลที่คนมองหา</h2>
      {center && (
        <div
          className="w-[54px] h-[2px] mx-auto mt-5 mb-2"
          style={{ background: "var(--t-accent)" }}
        />
      )}
    </div>
  );

  // ---------- list (5a) ----------
  if (L.areas === "list") {
    return (
      <section className="wrap pt-[88px]">
        {head}
        <div className="mt-8 t-card overflow-hidden">
          {areas.map((a, i) => (
            <Link
              key={a.id}
              href={`/area/${a.slug}`}
              className="group grid grid-cols-[92px_1fr_auto] sm:grid-cols-[150px_1fr_auto] items-stretch"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--t-line-2)" }}
            >
              <div className="relative h-[92px] sm:h-[120px] bg-sand overflow-hidden">
                {a.cover && (
                  <Image
                    src={a.cover}
                    alt={`ทำเล${a.name}`}
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center gap-1.5 px-5 sm:px-[26px]">
                <span className="flex items-baseline gap-3">
                  <span className="num text-[12px]" style={{ color: "var(--t-accent-alt, var(--t-dim))" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="t-h3">{a.name}</span>
                </span>
                <span className="th text-[12px] text-muted">
                  {a.count} รายการ · ดูทรัพย์ในทำเล
                </span>
              </div>
              <span
                className="grid place-items-center px-5 sm:px-7 th text-[15px]"
                style={{ background: "var(--t-bg-2)" }}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // ---------- framed (7a) ----------
  if (L.areas === "framed") {
    return (
      <section className="wrap pt-[104px]">
        {head}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[34px] mt-10">
          {areas.map((a) => (
            <Link key={a.id} href={`/area/${a.slug}`} className="group flex flex-col items-center">
              <div className="w-full p-2" style={{ border: "1px solid var(--t-line)" }}>
                <div
                  className="relative w-full bg-sand overflow-hidden"
                  style={{ aspectRatio: L.areasAspect || "3/4" }}
                >
                  {a.cover && (
                    <Image
                      src={a.cover}
                      alt={`ทำเล${a.name}`}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[600ms] group-hover:scale-105"
                    />
                  )}
                </div>
              </div>
              <div className="t-h3 mt-5">{a.name}</div>
              <div className="th text-[12px] text-muted mt-1.5">
                {a.count} รายการ · ดูทรัพย์ในทำเล
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  // ---------- weighted / duo / tiles / grid ----------
  const gridClass =
    L.areas === "weighted"
      ? "grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]"
      : L.areas === "duo"
        ? "grid gap-[18px] md:grid-cols-[1.05fr_1fr]"
        : L.areas === "tiles"
          ? "grid gap-[2px] sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";

  const aspect =
    L.areas === "weighted" || L.areas === "duo" ? undefined : L.areasAspect || "4/3";
  const fixedH = L.areas === "weighted" ? 340 : L.areas === "duo" ? 480 : undefined;

  return (
    <section className={`wrap ${L.areas === "tiles" ? "pt-[80px]" : "pt-[104px]"}`}>
      {head}
      <div className={`${gridClass} mt-10`}>
        {areas.map((a) => (
          <Link
            key={a.id}
            href={`/area/${a.slug}`}
            className="group relative block overflow-hidden bg-sand"
            style={{
              height: fixedH ? `${fixedH}px` : undefined,
              aspectRatio: fixedH ? undefined : aspect,
              borderRadius: L.areas === "tiles" ? "0px" : "var(--t-radius)",
              border:
                L.areas === "duo" || L.card === "framed"
                  ? "var(--t-card-border-w,1px) solid var(--t-card-border)"
                  : undefined,
            }}
          >
            {a.cover && (
              <Image
                src={a.cover}
                alt={`ทำเล${a.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]"
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg,transparent 38%,rgba(14,14,14,.66) 100%)",
              }}
            />
            <div className="absolute left-6 right-6 bottom-[22px] flex items-end justify-between gap-4 pointer-events-none">
              <div>
                <div className="serif text-[24px] sm:text-[27px] font-normal text-white">
                  {a.name}
                </div>
                <div className="th text-[11.5px] tracking-[0.14em] text-white/78 mt-1.5">
                  {a.count} รายการ · ดูทรัพย์ในทำเล
                </div>
              </div>
              {L.areas === "duo" && (
                <span
                  className="grid place-items-center w-[38px] h-[38px] shrink-0 th text-[15px]"
                  style={{
                    background: "var(--t-accent)",
                    color: "var(--t-accent-ink)",
                  }}
                >
                  →
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
