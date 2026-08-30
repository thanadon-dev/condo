"use client";

import { useActionState } from "react";
import { submitLead, type LeadState } from "@/app/actions/lead";
import { LEAD_KINDS } from "@/lib/lead-kinds";

const INIT: LeadState = { ok: false, message: "", errors: {} };

export default function LeadForm({
  propertyId = null,
  propertyTitle = "",
  source = "",
  defaultKind = "สอบถามข้อมูล",
  compact = false,
}: {
  propertyId?: number | null;
  propertyTitle?: string;
  source?: string;
  defaultKind?: string;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(submitLead, INIT);

  if (state.ok) {
    return (
      <div className="border border-line-2 bg-sand/50 p-8 text-center">
        <p className="th text-[15px]">{state.message}</p>
        {propertyTitle && (
          <p className="th mt-2 text-[12.5px] text-muted">{propertyTitle}</p>
        )}
      </div>
    );
  }

  const field =
    "th w-full text-[13.5px] px-4 py-3 border border-line-2 focus:border-ink outline-none bg-paper";
  const err = (k: string) =>
    state.errors[k] ? (
      <span className="th block mt-1.5 text-[12px] text-ink">
        {state.errors[k]}
      </span>
    ) : null;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="propertyId" value={propertyId ?? ""} />
      <input type="hidden" name="propertyTitle" value={propertyTitle} />
      <input type="hidden" name="source" value={source} />

      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          บริษัท
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <label className="block">
          <span className="kicker">ชื่อ *</span>
          <input
            name="name"
            required
            maxLength={80}
            className={`${field} mt-2`}
            placeholder="ชื่อ-นามสกุล"
          />
          {err("name")}
        </label>

        <label className="block">
          <span className="kicker">เบอร์โทร *</span>
          <input
            name="phone"
            required
            inputMode="tel"
            maxLength={20}
            className={`${field} mt-2`}
            placeholder="089 442 1180"
          />
          {err("phone")}
        </label>

        <label className="block">
          <span className="kicker">อีเมล</span>
          <input
            name="email"
            type="email"
            maxLength={120}
            className={`${field} mt-2`}
            placeholder="you@example.com"
          />
          {err("email")}
        </label>

        <label className="block">
          <span className="kicker">เรื่องที่ติดต่อ</span>
          <select name="kind" defaultValue={defaultKind} className={`${field} mt-2`}>
            {LEAD_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="kicker">ข้อความ</span>
        <textarea
          name="message"
          rows={compact ? 3 : 4}
          maxLength={1500}
          className={`${field} mt-2 resize-y`}
          placeholder="เล่ารายละเอียดที่อยากให้ช่วย เช่น งบประมาณ ทำเล หรือวันที่สะดวกเข้าชม"
        />
        {err("message")}
      </label>

      {state.message && !state.ok && (
        <p className="th text-[13px] text-ink border border-line px-4 py-3 bg-sand/60">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="th text-[13.5px] px-8 py-[15px] bg-ink text-paper hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {pending ? "กำลังส่ง…" : "ส่งข้อมูลติดต่อ"}
      </button>

      <p className="th text-[11.5px] text-muted leading-relaxed">
        ข้อมูลของคุณถูกส่งถึงที่ปรึกษาโดยตรง ไม่ถูกเผยแพร่ต่อบุคคลที่สาม
      </p>
    </form>
  );
}
