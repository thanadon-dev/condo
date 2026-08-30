"use client";

import { useActionState } from "react";
import { toggleAdmin, type ActionState } from "@/app/actions/admin";

const INIT: ActionState = { ok: false, message: "" };

export default function AdminToggle({
  id,
  isAdmin,
  self,
}: {
  id: number;
  isAdmin: boolean;
  self: boolean;
}) {
  const [state, action, pending] = useActionState(toggleAdmin, INIT);

  if (self) {
    return <span className="th text-[12px] text-muted">บัญชีของคุณ</span>;
  }

  return (
    <form action={action} className="flex items-center gap-3">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="on" value={isAdmin ? "0" : "1"} />
      <button
        type="submit"
        disabled={pending}
        className="th text-[12px] px-3.5 py-1.5 border border-line-2 hover:border-ink transition-colors disabled:opacity-50"
      >
        {pending ? "…" : isAdmin ? "ถอนสิทธิ์" : "ให้สิทธิ์ผู้ดูแล"}
      </button>
      {state.message && !state.ok && (
        <span className="th text-[11.5px]">{state.message}</span>
      )}
    </form>
  );
}
