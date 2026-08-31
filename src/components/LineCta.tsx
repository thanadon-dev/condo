import Image from "next/image";
import { getSettings } from "@/lib/settings";

/**
 * บล็อกชวนแอด LINE OA — ใช้แทนฟอร์มกรอกข้อมูล
 * ลิงก์/ไอดี ตั้งค่าได้ที่ /admin/settings (ไม่ hardcode)
 */
export default function LineCta({
  kicker = "Add LINE",
  title = "ทักไลน์คุยได้เลย",
  sub = "แอดไลน์แล้วส่งรายละเอียดมาได้ทันที ตอบกลับเองทุกข้อความ",
  compact = false,
}: {
  kicker?: string;
  title?: string;
  sub?: string;
  /** true = ย่อขนาดลง ใช้ในคอลัมน์แคบ */
  compact?: boolean;
}) {
  const SITE = getSettings();
  const url = SITE.lineUrl || "";
  const qr = "/media/line-qr.webp";

  return (
    <div className="border border-line-2 bg-sand/40">
      <div
        className={`grid gap-8 items-center ${
          compact ? "p-6" : "p-7 sm:p-9"
        } sm:grid-cols-[auto_1fr]`}
      >
        <div className="mx-auto sm:mx-0">
          <div className="bg-paper border border-line-2 p-3">
            <Image
              src={qr}
              alt={`QR code เพิ่มเพื่อน LINE ${SITE.line}`}
              width={compact ? 150 : 178}
              height={compact ? 150 : 178}
              sizes="178px"
              className="block"
            />
          </div>
          <p className="th text-[11px] text-muted text-center mt-2">
            สแกนเพื่อเพิ่มเพื่อน
          </p>
        </div>

        <div className="text-center sm:text-left">
          <div className="kicker">{kicker}</div>
          <h3
            className={`display th mt-2 ${
              compact ? "text-[24px]" : "text-[28px] sm:text-[32px]"
            }`}
          >
            {title}
          </h3>
          <p className="th mt-2.5 text-[13.5px] text-muted leading-relaxed max-w-[420px] mx-auto sm:mx-0">
            {sub}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="th text-[13.5px] px-7 py-3 bg-[#06C755] text-white hover:bg-[#05b34c] transition-colors inline-flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 5.69 2 10.23c0 4.07 3.55 7.48 8.35 8.12.32.07.77.22.88.5.1.25.07.65.03.91l-.14.85c-.04.25-.2.98.86.53s5.72-3.37 7.8-5.77C21.4 13.79 22 12.09 22 10.23 22 5.69 17.52 2 12 2zM7.9 13.1H6.06a.53.53 0 01-.53-.53V8.9c0-.29.24-.53.53-.53s.53.24.53.53v3.15H7.9c.29 0 .53.24.53.53s-.24.52-.53.52zm2.07-.53c0 .29-.24.53-.53.53a.53.53 0 01-.53-.53V8.9c0-.29.24-.53.53-.53s.53.24.53.53v3.67zm4.42 0c0 .23-.15.43-.36.5a.6.6 0 01-.17.03.53.53 0 01-.43-.21l-1.88-2.56v2.24c0 .29-.24.53-.53.53a.53.53 0 01-.53-.53V8.9c0-.23.15-.43.36-.5a.5.5 0 01.17-.03c.16 0 .32.08.42.21l1.89 2.57V8.9c0-.29.24-.53.53-.53s.53.24.53.53v3.67zm2.97-2.36c.29 0 .53.24.53.53s-.24.53-.53.53h-1.31v.84h1.31c.29 0 .53.24.53.53s-.24.52-.53.52h-1.84a.53.53 0 01-.53-.52V8.9c0-.29.24-.53.53-.53h1.84c.29 0 .53.24.53.53s-.24.53-.53.53h-1.31v.84h1.31z" />
                </svg>
                เพิ่มเพื่อนใน LINE
              </a>
            )}
            {SITE.line && (
              <span className="th text-[13.5px] px-5 py-3 border border-line-2 bg-paper">
                LINE ID: <strong className="font-medium">{SITE.line}</strong>
              </span>
            )}
          </div>

          <p className="th mt-4 text-[12px] text-muted">
            หรือโทร{" "}
            <a
              href={`tel:${SITE.mobile.replace(/[\s-]/g, "")}`}
              className="text-ink-2 hover:text-ink underline underline-offset-2"
            >
              {SITE.mobile}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
