import Link from "next/link";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/properties", label: "ทรัพย์ทั้งหมด" },
  { href: "/journal", label: "บทความ" },
  { href: "/about", label: "เกี่ยวกับฉัน" },
  { href: "/favorites", label: "รายการโปรด" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line-2">
      <div className="mx-auto max-w-[1240px] px-6 h-[74px] flex items-center justify-between gap-6">
        <Link href="/" className="leading-none">
          <span className="display block text-[22px] tracking-tight">
            Condo D
          </span>
          <span className="kicker block text-[9px] mt-[3px]">Property</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 th text-[13.5px] text-ink-2">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="hidden sm:block text-[13px] tracking-[0.04em] text-ink-2"
          >
            {SITE.phone}
          </a>
          <Link
            href="/contact"
            className="th text-[13px] px-5 py-[11px] bg-ink text-paper hover:opacity-85 transition-opacity"
          >
            ติดต่อเช่า
          </Link>
        </div>
      </div>
    </header>
  );
}
