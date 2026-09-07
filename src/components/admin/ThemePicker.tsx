"use client";

import { useActionState } from "react";
import Link from "next/link";
import { switchTheme, type ThemeState } from "@/app/actions/theme";
import { THEMES, themeVars, type Theme, type ThemeId } from "@/lib/themes";

const INIT: ThemeState = { ok: false, message: "" };

/** ตัวอย่างย่อของธีม — วาดด้วย CSS variables ชุดเดียวกับหน้าจริง ไม่ใช่ภาพนิ่ง */
function Swatch({ t }: { t: Theme }) {
  const vars = themeVars(t) as React.CSSProperties;
  return (
    <div
      style={{ ...vars, background: t.vars["--t-bg"] }}
      className="h-[168px] p-4 flex flex-col gap-2.5 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          style={{
            fontFamily: "var(--t-font-display)",
            color: t.vars["--t-ink"],
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Condo D
        </span>
        <span
          style={{
            background: t.vars["--t-accent"],
            color: t.vars["--t-accent-ink"],
            borderRadius: t.layout.radiusPill,
            fontFamily: "var(--t-font-body)",
            fontSize: 9,
            padding: "4px 10px",
          }}
        >
          ติดต่อเช่า
        </span>
      </div>

      <div
        style={{
          fontFamily: "var(--t-font-display)",
          color: t.vars["--t-ink"],
          fontSize: 21,
          fontWeight: Number(t.vars["--t-h2-weight"] || 400),
          lineHeight: 1.15,
        }}
      >
        บ้านที่ใช่ ไม่ควรหายาก
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              background: t.vars["--t-card"] === "transparent" ? "transparent" : t.vars["--t-card"],
              border:
                t.vars["--t-card-border"] === "transparent"
                  ? "none"
                  : `${t.vars["--t-card-border-w"] || "1px"} solid ${t.vars["--t-card-border"]}`,
              borderRadius: t.layout.radius,
              boxShadow: t.layout.cardShadow,
            }}
            className="p-1.5 flex flex-col gap-1"
          >
            <div
              style={{ background: t.vars["--t-bg-2"], borderRadius: t.layout.radius }}
              className="h-8"
            />
            <div
              style={{
                fontFamily: "var(--t-font-body)",
                color: t.vars["--t-ink"],
                fontSize: 8.5,
              }}
            >
              ฿8,900
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThemePicker({ active }: { active: ThemeId }) {
  const [state, action, pending] = useActionState(switchTheme, INIT);

  return (
    <>
      {state.message && (
        <div
          className={`th text-[13px] mb-6 px-4 py-3 border ${
            state.ok
              ? "border-line-2 bg-sand-2"
              : "border-red-300 text-red-700 bg-red-50"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {THEMES.map((t) => {
          const on = t.id === active;
          return (
            <div
              key={t.id}
              className={`border transition-colors ${
                on ? "border-ink" : "border-line-2 hover:border-line"
              }`}
            >
              <Swatch t={t} />

              <div className="p-4 flex flex-col gap-1.5 border-t border-line-2">
                <div className="flex items-center gap-2">
                  <span className="th text-[15px]">{t.name}</span>
                  <span className="th text-[10.5px] text-faint">({t.code})</span>
                  {on && (
                    <span className="th text-[10px] ml-auto px-2 py-1 bg-ink text-paper">
                      ใช้อยู่
                    </span>
                  )}
                </div>
                <p className="th text-[12px] leading-[1.65] text-muted min-h-[38px]">
                  {t.desc}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <Link
                    href={`/theme-preview/${t.id}`}
                    className="th text-[12px] px-4 py-2.5 border border-line-2 hover:border-ink transition-colors"
                  >
                    ดูตัวอย่าง
                  </Link>

                  {!on && (
                    <form action={action}>
                      <input type="hidden" name="theme" value={t.id} />
                      <button
                        disabled={pending}
                        className="th text-[12px] px-4 py-2.5 bg-ink text-paper hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {pending ? "กำลังเปลี่ยน…" : "ใช้ธีมนี้"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
