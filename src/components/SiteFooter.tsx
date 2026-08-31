import Link from "next/link";
import { getSettings } from "@/lib/settings";

const COLS = [
  {
    title: "เมนู",
    links: [
      { href: "/", label: "หน้าหลัก" },
      { href: "/properties", label: "ทรัพย์ทั้งหมด" },
      { href: "/journal", label: "บทความ" },
      { href: "/about", label: "เกี่ยวกับฉัน" },
    ],
  },
  {
    title: "หมวดหมู่",
    links: [
      { href: "/properties?cat=คอนโด", label: "คอนโด" },
      { href: "/properties?cat=บ้านเช่า", label: "บ้านเช่า" },
      { href: "/properties", label: "ทรัพย์ทั้งหมด" },
    ],
  },
];

export default function SiteFooter() {
  const SITE = getSettings();
  const year = new Date().getFullYear() + 543;
  return (
    <footer className="border-t border-line-2 bg-sand/60 mt-24">
      <div className="mx-auto max-w-[1240px] px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="display text-[24px]">Condo D</div>
          <div className="kicker mt-1">Property</div>
          <p className="th mt-5 text-[13.5px] leading-relaxed text-muted max-w-[320px]">
            {SITE.tagline}
          </p>
        </div>

        {COLS.map((c) => (
          <div key={c.title}>
            <div className="kicker mb-4">{c.title}</div>
            <ul className="space-y-2.5 th text-[13.5px] text-ink-2">
              {c.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="kicker mb-4">ติดต่อ</div>
          <ul className="space-y-2.5 th text-[13.5px] text-ink-2">
            <li>{SITE.phone}</li>
            <li>{SITE.email}</li>
            <li className="leading-relaxed">{SITE.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-2">
        <div className="mx-auto max-w-[1240px] px-6 py-6 th text-[12px] text-muted flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>
            © {year} {SITE.name} Co., Ltd.
          </span>
          <span>นโยบายความเป็นส่วนตัว · เงื่อนไขการใช้งาน</span>
        </div>
      </div>
    </footer>
  );
}
