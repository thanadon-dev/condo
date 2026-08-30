"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/app/actions/admin";

const INIT: ActionState = { ok: false, message: "" };

export default function DeleteButton({
  action,
  id,
  label = "ลบ",
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  id: number;
  label?: string;
}) {
  const [state, formAction, pending] = useActionState(action, INIT);
  const [armed, setArmed] = useState(false);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type={armed ? "submit" : "button"}
        onClick={(e) => {
          if (!armed) {
            e.preventDefault();
            setArmed(true);
            setTimeout(() => setArmed(false), 4000);
          }
        }}
        disabled={pending}
        className={`th text-[12px] px-3 py-1.5 border transition-colors ${
          armed
            ? "border-ink bg-ink text-paper"
            : "border-line-2 text-muted hover:border-ink hover:text-ink"
        }`}
      >
        {pending ? "…" : armed ? "ยืนยันลบ" : state.message || label}
      </button>
    </form>
  );
}
