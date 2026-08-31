import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/settings";
import MobileNav from "./MobileNav";

const NAV = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/properties", label: "ทรัพย์ทั้งหมด" },
  { href: "/journal", label: "บทความ" },
  { href: "/about", label: "เกี่ยวกับฉัน" },
];

export default function SiteHeader() {
  const SITE = getSettings();

  return (
    <header className="sticky top-0 z-40 bg-paper/92 backdrop-blur-[14px] border-b border-line-2">
      <div className="wrap h-[68px] sm:h-[82px] flex items-center justify-between gap-6 lg:gap-10">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Image
            src="/media/logo.png"
            alt="Condo D Property"
            width={36}
            height={36}
            priority
            className="h-8 sm:h-9 w-auto"
          />
          <span className="flex flex-col gap-1 leading-none">
            <span className="serif text-[20px] sm:text-[23px] font-medium tracking-[0.01em]">
              Condo D
            </span>
            <span className="text-[8px] sm:text-[8.5px] tracking-[0.42em] text-dim">
              PROPERTY
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-[38px] th text-[14px] tracking-[0.02em] text-ink-2 whitespace-nowrap">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 lg:gap-[22px] shrink-0">
          <Link
            href="/favorites"
            aria-label="รายการที่บันทึกไว้"
            className="hidden lg:flex items-center gap-1.5 th text-[13px] text-ink-2 hover:text-ink transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3.5l2.6 5.3 5.9.86-4.25 4.14 1 5.85L12 16.9l-5.25 2.76 1-5.85L3.5 9.66l5.9-.86L12 3.5z" />
            </svg>
            บันทึก
          </Link>
          <span className="hidden xl:block text-[13px] tracking-[0.02em] text-ink-2 whitespace-nowrap">
            {SITE.phone}
          </span>
          <Link
            href="/contact"
            className="hidden sm:block th text-[12px] tracking-[0.14em] px-5 lg:px-6 py-3 bg-ink text-paper hover:bg-[#2c2a27] transition-colors whitespace-nowrap"
          >
            ติดต่อเช่า
          </Link>

          <MobileNav items={NAV} mobile={SITE.mobile} />
        </div>
      </div>
    </header>
  );
}
