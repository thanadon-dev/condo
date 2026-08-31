"use server";

import { requireAdmin } from "@/lib/auth";
import { polishWithClaude } from "@/lib/polish";
import { isPolishStyle } from "@/lib/polish-styles";

export type PolishState =
  | { status: "idle" }
  | { status: "ok"; text: string }
  | { status: "error"; message: string };

const MAX_CHARS = 4000;

/** กันกดรัว: เว้นอย่างน้อย 3 วิ ต่อครั้ง (โมเดลกินเวลา+เงิน) */
let lastRun = 0;
const COOLDOWN_MS = 3000;

export async function polishText(
  _prev: PolishState,
  form: FormData,
): Promise<PolishState> {
  if (!(await requireAdmin())) {
    return { status: "error", message: "ไม่มีสิทธิ์" };
  }

  const text = String(form.get("text") ?? "").trim();
  const style = String(form.get("style") ?? "listing");

  if (text.length < 10) {
    return { status: "error", message: "พิมพ์รายละเอียดก่อนอย่างน้อย 10 ตัวอักษร" };
  }
  if (text.length > MAX_CHARS) {
    return {
      status: "error",
      message: `ข้อความยาวเกิน ${MAX_CHARS.toLocaleString("en-US")} ตัวอักษร`,
    };
  }
  if (!isPolishStyle(style)) {
    return { status: "error", message: "สไตล์ไม่ถูกต้อง" };
  }

  const now = Date.now();
  if (now - lastRun < COOLDOWN_MS) {
    return { status: "error", message: "กดถี่เกินไป รอสักครู่แล้วลองใหม่" };
  }
  lastRun = now;

  const res = await polishWithClaude(text, style);
  if (!res.ok) return { status: "error", message: res.error };
  return { status: "ok", text: res.text };
}
