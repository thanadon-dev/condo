import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin, isLocked } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const locked = isLocked();

  return (
    <div className="mx-auto max-w-[400px] px-6 py-28">
      <div className="kicker">Admin</div>
      <h1 className="display th text-[36px] mt-3">เข้าสู่ระบบหลังบ้าน</h1>
      <p className="th mt-4 text-[13.5px] text-muted leading-relaxed">
        สำหรับผู้ดูแลระบบเท่านั้น กรอกรหัสเพื่อจัดการทรัพย์ บทความ
        และดูรายชื่อลูกค้า
      </p>

      {locked ? (
        <p className="th mt-8 text-[13.5px] border border-ink px-4 py-4 bg-sand/60">
          ใส่รหัสผิดหลายครั้งเกินไป ระบบล็อกชั่วคราว กรุณารอ 15 นาที
        </p>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
