"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/actions/admin";
import PolishButton from "./PolishButton";

const INIT: ActionState = { ok: false, message: "" };

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "date";
  area?: boolean;
  rows?: number;
  select?: readonly string[];
  full?: boolean;
  placeholder?: string;
  /** คำอธิบายเล็ก ๆ ใต้ label */
  hint?: string;
  /** true = มีปุ่ม "เรียบเรียงด้วย AI" ใต้ช่อง (ใช้กับ area เท่านั้น) */
  polish?: boolean;
  /** ช่องตัวเลข: ไม่ใส่ = จำนวนเต็ม · "0.01" = ใส่ทศนิยมได้ (เช่น พื้นที่ 22.70) */
  step?: string;
};

export default function AdminForm({
  action,
  fields,
  values = {},
  id = null,
  submitLabel = "บันทึก",
  publishedDefault = true,
  onDone,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  fields: Field[];
  values?: Record<string, string | number>;
  id?: number | null;
  submitLabel?: string;
  publishedDefault?: boolean;
  onDone?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, INIT);

  if (state.ok && onDone) onDone();

  const input =
    "th w-full text-[13.5px] px-3.5 py-2.5 border border-line-2 focus:border-ink outline-none bg-paper";

  return (
    <form action={formAction} className="space-y-4">
      {id !== null && <input type="hidden" name="id" value={id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label
            key={f.key}
            className={`block ${f.full ? "sm:col-span-2" : ""}`}
          >
            <span className="kicker">{f.label}</span>
            {f.hint && (
              <span className="th block text-[11.5px] text-muted mt-1">
                {f.hint}
              </span>
            )}
            {f.select ? (
              <select
                name={f.key}
                defaultValue={String(values[f.key] ?? f.select[0])}
                className={`${input} mt-2`}
              >
                {f.select.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : f.area ? (
              <>
                <textarea
                  name={f.key}
                  rows={f.rows ?? 4}
                  defaultValue={String(values[f.key] ?? "")}
                  placeholder={f.placeholder}
                  className={`${input} mt-2 resize-y`}
                />
                {f.polish && <PolishButton targetName={f.key} />}
              </>
            ) : (
              <input
                name={f.key}
                type={f.type ?? "text"}
                defaultValue={String(values[f.key] ?? "")}
                placeholder={f.placeholder}
                {...(f.type === "number"
                  ? {
                      step: f.step ?? "1",
                      min: 0,
                      // decimal = คีย์บอร์ดมือถือมีปุ่มจุด (numeric ไม่มี)
                      inputMode: f.step ? ("decimal" as const) : ("numeric" as const),
                    }
                  : {})}
                className={`${input} mt-2`}
              />
            )}
          </label>
        ))}
      </div>

      <label className="flex items-center gap-2.5 th text-[13px]">
        <input
          type="checkbox"
          name="published"
          value="1"
          defaultChecked={
            values.published !== undefined
              ? Number(values.published) === 1
              : publishedDefault
          }
          className="w-4 h-4 accent-[#141414]"
        />
        เผยแพร่บนหน้าเว็บ
      </label>

      {state.message && (
        <p
          className={`th text-[13px] px-4 py-3 border ${
            state.ok ? "border-line-2 bg-sand/60" : "border-ink bg-paper"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="th text-[13.5px] px-7 py-3 bg-ink text-paper hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {pending ? "กำลังบันทึก…" : submitLabel}
      </button>
    </form>
  );
}
