"use client";

import { useActionState } from "react";
import {
  saveSiteSettings,
  type SettingsState,
} from "@/app/actions/settings";
import { FIELDS, GROUPS, type SiteFlat } from "@/lib/settings-fields";

const INIT: SettingsState = { ok: false, message: "" };

export default function SettingsForm({ values }: { values: SiteFlat }) {
  const [state, action, pending] = useActionState(saveSiteSettings, INIT);

  const input =
    "th w-full text-[13.5px] px-3.5 py-2.5 mt-2 border border-line-2 focus:border-ink outline-none bg-paper";

  return (
    <form action={action} className="space-y-10">
      {GROUPS.map((g) => (
        <section key={g}>
          <h2 className="display text-[22px] th border-b border-line-2 pb-3">
            {g}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 mt-5">
            {FIELDS.filter((f) => f.group === g).map((f) => (
              <label
                key={f.key}
                className={`block ${f.full ? "sm:col-span-2" : ""}`}
              >
                <span className="kicker">{f.label}</span>
                <input
                  name={f.key}
                  defaultValue={values[f.key]}
                  maxLength={f.key === "tagline" ? 300 : 160}
                  className={input}
                />
                {f.hint && (
                  <span className="th block mt-1.5 text-[11.5px] text-muted">
                    {f.hint}
                  </span>
                )}
              </label>
            ))}
          </div>
        </section>
      ))}

      {state.message && (
        <p
          className={`th text-[13px] px-4 py-3 border ${
            state.ok ? "border-line-2 bg-sand/60" : "border-ink bg-paper"
          }`}
        >
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="th text-[13.5px] px-7 py-3 bg-ink text-paper hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {pending ? "กำลังบันทึก…" : "บันทึกการตั้งค่า"}
        </button>
        <span className="th text-[12px] text-muted">
          เว้นว่างไว้ = ใช้ค่าเริ่มต้น
        </span>
      </div>
    </form>
  );
}
