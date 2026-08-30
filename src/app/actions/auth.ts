"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login, destroySession, COOKIE } from "@/lib/auth";
import { SESSION_DAYS } from "@/lib/auth-const";
import { SITE_URL } from "@/lib/site";

export type LoginState = { ok: boolean; message: string };

const MESSAGES: Record<string, string> = {
  locked: "ใส่รหัสผิดหลายครั้ง กรุณารอ 15 นาทีแล้วลองใหม่",
  wrong: "รหัสไม่ถูกต้อง",
  unconfigured: "ยังไม่ได้ตั้งรหัสในเซิร์ฟเวอร์",
};

export async function doLogin(
  _prev: LoginState,
  form: FormData,
): Promise<LoginState> {
  const res = login(String(form.get("pin") ?? ""));

  if (!res.ok) {
    return { ok: false, message: MESSAGES[res.reason] ?? "เข้าสู่ระบบไม่สำเร็จ" };
  }

  const jar = await cookies();
  jar.set(COOKIE, res.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: SITE_URL.startsWith("https://"),
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });

  redirect("/admin");
}

export async function doLogout(): Promise<void> {
  const jar = await cookies();
  destroySession(jar.get(COOKIE)?.value ?? "");
  jar.delete(COOKIE);
  redirect("/login");
}
