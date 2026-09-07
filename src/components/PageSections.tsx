import Link from "next/link";
import type { Theme } from "@/lib/themes";

type Stat = { value: string; label: string; note: string };
type Article = {
  id: number;
  slug: string;
  title: string;
  lead: string;
  tag: string;
  read_time: string;
};

/**
 * บล็อกสถิติ 4 ทรง
 * plain ตัวเลขบน-ป้ายล่าง · cards การ์ดมีพื้น · inline ตัวเลขซ้าย-ข้อความขวา
 * (rows ของ 10a ย้ายไปอยู่ใน Hero แล้ว จึงไม่เรนเดอร์ซ้ำที่นี่)
 */
export function StatsSection({
  stats,
  theme,
}: {
  stats: Stat[];
  theme: Theme;
}) {
  const L = theme.layout;
  // 10a โชว์สถิติใน hero แล้ว ไม่ต้องซ้ำ
  if (L.stats === "rows") return null;

  const cards = L.stats === "cards";
  const inline = L.stats === "inline";

  return (
    <section
      className="mt-[110px]"
      style={
        cards
          ? undefined
          : {
              background: "var(--t-stats-bg, var(--t-bg-3))",
              borderTop: "1px solid var(--t-line-2)",
              borderBottom: "1px solid var(--t-line-2)",
            }
      }
    >
      <div
        className={`wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ${
          cards ? "py-0" : "py-[72px]"
        }`}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={
              inline
                ? "flex items-baseline gap-5"
                : `flex flex-col gap-3 ${cards ? "p-8 sm:p-9" : ""}`
            }
            style={
              cards
                ? {
                    background: "var(--t-bg-3)",
                    borderRadius: "var(--t-radius)",
                    boxShadow: "var(--t-card-shadow)",
                  }
                : L.stats === "plain" && i > 0
                  ? { borderLeft: "1px solid var(--t-line-2)", paddingLeft: "34px" }
                  : undefined
            }
          >
            <span
              className={`num leading-none whitespace-nowrap ${
                inline ? "text-[46px]" : "text-[48px] sm:text-[52px]"
              }`}
              style={{ color: "var(--t-accent)" }}
            >
              {s.value}
            </span>
            <span className={inline ? "flex flex-col gap-1.5" : "contents"}>
              <span className="th text-[12.5px] tracking-[0.1em] text-dim">
                {s.label}
              </span>
              <span className="th text-[11.5px] leading-[1.6] text-faint">
                {s.note}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * บทความ 3 ทรง
 * ruled เส้นคาดบน · filled การ์ดมีพื้น/กรอบ · framed กรอบเส้น
 */
export function JournalSection({
  articles,
  theme,
}: {
  articles: Article[];
  theme: Theme;
}) {
  const L = theme.layout;
  const center = L.centerSections;
  const filled = L.journal === "filled";
  const framed = L.journal === "framed";

  // 2a เรียงเป็นแถวเต็มความกว้าง ไม่ใช่ 2 คอลัมน์
  const stackRows = filled && L.card === "framed" && !L.dark;

  return (
    <section className="wrap py-[110px]">
      <div className={center ? "text-center" : ""}>
        {center ? (
          <span className="kicker inline-flex items-center gap-3.5">
            <span className="inline-block w-10 h-px" style={{ background: "var(--t-accent)" }} />
            Journal
            <span className="inline-block w-10 h-px" style={{ background: "var(--t-accent)" }} />
          </span>
        ) : (
          <span className="kicker">Journal</span>
        )}
        <h2 className="t-h2 mt-4 mb-10">บทความล่าสุด</h2>
      </div>

      <div
        className={
          stackRows ? "flex flex-col gap-[18px]" : "grid gap-8 md:grid-cols-2"
        }
      >
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/journal/${a.slug}`}
            className={`group block ${
              filled || framed ? "p-7 sm:p-9" : "pt-7"
            }`}
            style={
              filled
                ? {
                    background: "var(--t-panel-bg)",
                    border: "var(--t-card-border-w,1px) solid var(--t-line-2)",
                    borderRadius: "var(--t-radius)",
                    boxShadow: "var(--t-card-shadow)",
                  }
                : framed
                  ? { border: "1px solid var(--t-line)" }
                  : { borderTop: "1px solid var(--t-line-2)" }
            }
          >
            <span
              className={`th text-[11px] tracking-[0.14em] ${
                filled ? "inline-block px-3 py-1.5" : "text-dim"
              }`}
              style={
                filled
                  ? {
                      background: "var(--t-bg-3)",
                      color: "var(--t-ink-2)",
                      borderRadius: "var(--t-radius-pill)",
                    }
                  : undefined
              }
            >
              {a.tag} · อ่าน {a.read_time}
            </span>
            <h3 className="t-h3 mt-3.5 group-hover:underline underline-offset-[6px] decoration-line">
              {a.title}
            </h3>
            <p className="th mt-3.5 text-[13.5px] leading-[1.9] text-muted font-light">
              {a.lead}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
