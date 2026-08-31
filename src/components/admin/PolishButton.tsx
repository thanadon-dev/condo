"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { polishText, type PolishState } from "@/app/actions/polish";
import { POLISH_STYLES, type PolishStyle } from "@/lib/polish-styles";

const INIT: PolishState = { status: "idle" };

/**
 * ปุ่ม "เรียบเรียงด้วย AI" ใต้ textarea
 * - อ่านข้อความจาก textarea ชื่อ targetName ที่อยู่ในฟอร์มเดียวกัน
 * - ได้ผลแล้วโชว์ก่อน ให้กดใช้/ยกเลิก (ไม่ทับของเดิมทันที)
 * - เก็บข้อความเดิมไว้ให้กดเลิกทำได้
 */
export default function PolishButton({
  targetName,
}: {
  targetName: string;
}) {
  const [state, run, pending] = useActionState(polishText, INIT);
  const [style, setStyle] = useState<PolishStyle>(POLISH_STYLES[0].key);
  const [preview, setPreview] = useState<string | null>(null);
  const [undoText, setUndoText] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  function textarea(): HTMLTextAreaElement | null {
    const root = boxRef.current?.closest("form");
    return (
      (root?.querySelector(
        `textarea[name="${targetName}"]`,
      ) as HTMLTextAreaElement) ?? null
    );
  }

  useEffect(() => {
    if (state.status === "ok") setPreview(state.text);
  }, [state]);

  function apply() {
    const el = textarea();
    if (!el || preview === null) return;
    setUndoText(el.value);
    el.value = preview;
    // แจ้ง React ว่าค่าเปลี่ยน (defaultValue ไม่ re-render เอง)
    el.dispatchEvent(new Event("input", { bubbles: true }));
    setPreview(null);
  }

  function undo() {
    const el = textarea();
    if (!el || undoText === null) return;
    el.value = undoText;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    setUndoText(null);
  }

  const chip =
    "th text-[12px] px-3 py-1.5 border transition-colors cursor-pointer";

  return (
    <div ref={boxRef} className="mt-2.5">
      <div className="flex flex-wrap items-center gap-2">
        {POLISH_STYLES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStyle(s.key)}
            title={s.hint}
            className={`${chip} ${
              style === s.key
                ? "border-ink bg-ink text-paper"
                : "border-line-2 hover:border-ink"
            }`}
          >
            {s.label}
            {s.recommended && (
              <span className="opacity-70"> · แนะนำ</span>
            )}
          </button>
        ))}

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            const el = textarea();
            if (!el) return;
            const fd = new FormData();
            fd.set("text", el.value);
            fd.set("style", style);
            setPreview(null);
            run(fd);
          }}
          className="th text-[12px] px-4 py-1.5 border border-ink bg-paper hover:bg-ink hover:text-paper transition-colors disabled:opacity-50 disabled:cursor-wait inline-flex items-center gap-1.5"
        >
          {pending ? (
            <>
              <span className="inline-block w-3 h-3 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
              กำลังเรียบเรียง…
            </>
          ) : (
            <>✨ เรียบเรียงด้วย AI</>
          )}
        </button>

        {undoText !== null && (
          <button
            type="button"
            onClick={undo}
            className="th text-[12px] px-3 py-1.5 border border-line-2 hover:border-ink transition-colors"
          >
            ↩ เลิกทำ
          </button>
        )}
      </div>

      {pending && (
        <p className="th text-[11.5px] text-muted mt-2">
          ใช้เวลาราว 10–30 วินาที กรุณารอสักครู่
        </p>
      )}

      {state.status === "error" && !pending && (
        <p className="th text-[12px] text-[#a33] mt-2">{state.message}</p>
      )}

      {preview !== null && !pending && (
        <div className="mt-3 border border-ink bg-sand/40">
          <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3 border-b border-line-2">
            <span className="kicker">ผลลัพธ์ที่เรียบเรียงแล้ว</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={apply}
                className="th text-[12px] px-4 py-1.5 bg-ink text-paper hover:opacity-85 transition-opacity"
              >
                ใช้ข้อความนี้
              </button>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="th text-[12px] px-3 py-1.5 border border-line-2 hover:border-ink transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
          <pre className="th text-[13px] leading-[1.85] text-ink-2 p-4 whitespace-pre-wrap font-[inherit] max-h-[320px] overflow-auto">
            {preview}
          </pre>
        </div>
      )}
    </div>
  );
}
