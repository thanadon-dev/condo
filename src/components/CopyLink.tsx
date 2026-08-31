"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ปุ่มคัดลอกลิงก์ ใช้ได้ทั้งหน้าเว็บจริงและหลังบ้าน
 * - ส่ง path มา (เช่น "/property/ashton-asoke") แล้วจะเติมโดเมนให้เอง
 * - navigator.clipboard ใช้ได้เฉพาะ HTTPS/localhost -> มี fallback execCommand
 */
export default function CopyLink({
  path,
  label = "คัดลอกลิงก์",
  className = "",
  compact = false,
}: {
  path: string;
  label?: string;
  className?: string;
  /** true = ปุ่มเล็กสำหรับตาราง/การ์ดหลังบ้าน */
  compact?: boolean;
}) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function flash(next: "ok" | "fail") {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }

  async function copy() {
    const url = new URL(path, window.location.origin).href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return flash("ok");
      }
      // http:// หรือเบราว์เซอร์เก่า — ใช้วิธีเดิม
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const done = document.execCommand("copy");
      document.body.removeChild(ta);
      flash(done ? "ok" : "fail");
    } catch {
      flash("fail");
    }
  }

  const text =
    state === "ok" ? "คัดลอกแล้ว" : state === "fail" ? "คัดลอกไม่ได้" : label;

  const base = compact
    ? "th text-[12px] px-3 py-1.5 border transition-colors"
    : "th text-[12.5px] px-4 py-2.5 border transition-colors inline-flex items-center gap-1.5";

  const tone =
    state === "ok"
      ? "border-ink bg-ink text-paper"
      : state === "fail"
        ? "border-[#a33] text-[#a33]"
        : "border-line-2 hover:border-ink";

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      title={`คัดลอกลิงก์ ${path}`}
      className={`${base} ${tone} ${className}`}
    >
      {!compact && (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          {state === "ok" ? (
            <path d="M4 12.5l5 5L20 6.5" />
          ) : (
            <>
              <rect x="9" y="9" width="12" height="12" rx="1.5" />
              <path d="M6 15H4.5A1.5 1.5 0 013 13.5v-9A1.5 1.5 0 014.5 3h9A1.5 1.5 0 0115 4.5V6" />
            </>
          )}
        </svg>
      )}
      {text}
    </button>
  );
}
