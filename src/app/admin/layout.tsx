import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { doLogout } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "หลังบ้าน",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "ภาพรวม" },
  { href: "/admin/properties", label: "ทรัพย์" },
  { href: "/admin/deals", label: "ผลงาน" },
  { href: "/admin/articles", label: "บทความ" },
  { href: "/admin/leads", label: "ลูกค้า" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await requireAdmin())) redirect("/login");

  return (
    <div className="mx-auto max-w-[1240px] px-5 sm:px-6 py-8 sm:py-12">
      <header className="flex flex-wrap items-start sm:items-end justify-between gap-4 pb-5 sm:pb-6 border-b border-line-2">
        <div>
          <div className="kicker">Admin Console</div>
          <h1 className="display th text-[25px] sm:text-[32px] mt-2">จัดการเนื้อหา</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="th text-[12.5px] px-4 py-2.5 border border-line-2 hover:border-ink transition-colors"
          >
            ดูหน้าเว็บ
          </Link>
          <form action={doLogout}>
            <button className="th text-[12.5px] px-4 py-2.5 border border-line-2 hover:border-ink transition-colors">
              ออกจากระบบ
            </button>
          </form>
        </div>
      </header>

      <nav className="flex gap-2 py-5 sm:py-6 border-b border-line-2 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="th text-[13px] px-5 py-2.5 border border-line-2 hover:border-ink transition-colors whitespace-nowrap shrink-0"
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <div className="pt-8 sm:pt-10">{children}</div>
    </div>
  );
}
