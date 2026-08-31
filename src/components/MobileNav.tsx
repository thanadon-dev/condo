"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { SITE } from "@/lib/site";

export default function MobileNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="เปิดเมนู"
        aria-expanded={open}
        className="lg:hidden grid place-items-center w-11 h-11 -mr-2 text-ink"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div className="lg:hidden fixed inset-0 z-[60] bg-paper flex flex-col">
          <div className="h-[82px] px-[22px] flex items-center justify-between border-b border-line-2">
            <span className="serif text-[21px]">Condo D</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="ปิดเมนู"
              className="grid place-items-center w-11 h-11 -mr-2"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-[22px] py-8">
            <ul className="flex flex-col">
              {items.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="th block text-[19px] py-4 border-b border-line-2 hover:text-muted"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/favorites"
                  className="th block text-[19px] py-4 border-b border-line-2 hover:text-muted"
                >
                  รายการโปรด
                </Link>
              </li>
            </ul>

            <div className="mt-10 flex flex-col gap-3">
              <Link
                href="/contact"
                className="th text-center text-[14px] tracking-[0.14em] px-6 py-4 bg-ink text-paper"
              >
                ติดต่อเช่า
              </Link>
              <a
                href={`tel:${SITE.mobile.replace(/\s/g, "")}`}
                className="th text-center text-[14px] px-6 py-4 border border-line"
              >
                โทร {SITE.mobile}
              </a>
            </div>
          </nav>
        </div>,
          document.body,
        )}
    </>
  );
}
