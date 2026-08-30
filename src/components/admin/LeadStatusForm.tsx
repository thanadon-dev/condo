"use client";

import { useActionState } from "react";
import { setLeadStatus, type ActionState } from "@/app/actions/admin";
import { LEAD_STATUSES, STATUS_LABEL } from "@/lib/lead-status";

const INIT: ActionState = { ok: false, message: "" };

export default function LeadStatusForm({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const [state, action, pending] = useActionState(setLeadStatus, INIT);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        className="th text-[12px] px-2.5 py-1.5 border border-line-2 bg-paper focus:border-ink outline-none"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="th text-[12px] px-3 py-1.5 border border-line-2 hover:border-ink transition-colors disabled:opacity-50"
      >
        {pending ? "…" : state.ok ? "บันทึกแล้ว" : "บันทึก"}
      </button>
    </form>
  );
}
