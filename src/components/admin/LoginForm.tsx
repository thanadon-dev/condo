"use client";

import { useActionState } from "react";
import { doLogin, type LoginState } from "@/app/actions/auth";

const INIT: LoginState = { ok: false, message: "" };

export default function LoginForm() {
  const [state, action, pending] = useActionState(doLogin, INIT);

  return (
    <form action={action} className="mt-8">
      <label className="block">
        <span className="kicker">รหัสเข้าระบบ</span>
        <input
          name="pin"
          type="password"
          inputMode="numeric"
          autoFocus
          autoComplete="current-password"
          maxLength={64}
          placeholder="••••"
          className="th w-full text-[18px] tracking-[0.3em] text-center px-4 py-4 mt-2 border border-line-2 focus:border-ink outline-none bg-paper"
        />
      </label>

      {state.message && (
        <p className="th mt-4 text-[13px] border border-ink px-4 py-3 bg-sand/60">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full th text-[14px] mt-6 px-6 py-[15px] bg-ink text-paper hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {pending ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
