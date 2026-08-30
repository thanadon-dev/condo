"use client";

import { useState } from "react";
import AdminForm, { type Field } from "./AdminForm";
import type { ActionState } from "@/app/actions/admin";

export default function CreatePanel({
  action,
  fields,
  title,
  buttonLabel = "+ เพิ่มรายการใหม่",
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  fields: Field[];
  title: string;
  buttonLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="th text-[13px] px-6 py-3 border border-line hover:border-ink transition-colors"
      >
        {buttonLabel}
      </button>
    );
  }

  return (
    <div className="border border-line-2 p-7 bg-sand/30">
      <div className="flex items-center justify-between mb-6">
        <h2 className="display text-[24px] th">{title}</h2>
        <button
          onClick={() => setOpen(false)}
          className="th text-[12.5px] px-4 py-2 border border-line-2 hover:border-ink transition-colors"
        >
          ปิด
        </button>
      </div>
      <AdminForm action={action} fields={fields} submitLabel="เพิ่ม" />
    </div>
  );
}
