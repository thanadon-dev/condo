import type { Metadata } from "next";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  robots: { index: false, follow: false },
};

const MESSAGES: Record<string, string> = {
  state: "เซสชันหมดอายุ กรุณาลองเข้าสู่ระบบใหม่",
  token: "แลกโทเคนกับ Google ไม่สำเร็จ",
  profile: "ดึงข้อมูลบัญชีไม่สำเร็จ",
  network: "เชื่อมต่อ Google ไม่ได้ กรุณาลองใหม่",
  email: "บัญชีนี้ไม่มีอีเมล",
  user: "สร้างบัญชีไม่สำเร็จ",
  denied: "บัญชีนี้ยังไม่ได้รับสิทธิ์เข้าหลังบ้าน",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await currentUser();
  if (user?.is_admin === 1) redirect("/admin");

  const sp = await searchParams;
  const raw = Array.isArray(sp.e) ? sp.e[0] : sp.e;
  const msg = raw && MESSAGES[raw] ? MESSAGES[raw] : "";

  return (
    <div className="mx-auto max-w-[440px] px-6 py-28">
      <div className="kicker">Admin</div>
      <h1 className="display th text-[38px] mt-3">เข้าสู่ระบบหลังบ้าน</h1>
      <p className="th mt-4 text-[13.5px] text-muted leading-relaxed">
        สำหรับผู้ดูแลระบบเท่านั้น เข้าสู่ระบบด้วยบัญชี Google ที่ได้รับสิทธิ์
      </p>

      {msg && (
        <p className="th mt-6 text-[13px] border border-line px-4 py-3 bg-sand/60">
          {msg}
        </p>
      )}

      <a
        href="/auth/login"
        className="block text-center th text-[14px] mt-8 px-6 py-[15px] bg-ink text-paper hover:opacity-85 transition-opacity"
      >
        เข้าสู่ระบบด้วย Google
      </a>

      {user && (
        <div className="mt-6 th text-[12.5px] text-muted">
          ล็อกอินอยู่ในชื่อ {user.email} แต่ยังไม่มีสิทธิ์ผู้ดูแล ·{" "}
          <a href="/auth/logout" className="underline">
            ออกจากระบบ
          </a>
        </div>
      )}
    </div>
  );
}
