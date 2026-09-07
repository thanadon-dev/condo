import Link from "next/link";
import Image from "next/image";
import type { Property, PropertyImage } from "@/lib/queries";
import { baht } from "@/lib/site";
import FavButton from "./FavButton";
import type { Theme } from "@/lib/themes";

/**
 * การ์ดใหญ่เต็มความกว้าง — ใช้เฉพาะธีมที่ layout.featureFirst = true (6a photo-first)
 * ข้อความทับบนรูป ราคาชิดขวา
 */
export default function FeatureCard({
  p,
  cover,
  theme,
}: {
  p: Property;
  cover?: PropertyImage;
  theme: Theme;
}) {
  return (
    <article
      className="group relative h-[340px] sm:h-[440px] overflow-hidden bg-sand rise"
      style={{ borderRadius: "var(--t-radius)" }}
    >
      <Link href={`/property/${p.slug}`} className="block absolute inset-0">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="100vw"
            priority
            className="object-cover transition-transform duration-[700ms] group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center kicker text-faint">
            {p.type}
          </span>
        )}
      </Link>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg,rgba(16,16,16,.05) 40%,rgba(16,16,16,.82) 100%)",
        }}
      />

      <FavButton id={p.id} className="absolute right-4 top-4 z-10" />

      <div className="absolute left-0 right-0 bottom-0 p-6 sm:p-9 flex flex-wrap items-end justify-between gap-5 pointer-events-none">
        <div className="flex flex-col gap-2.5 max-w-[760px]">
          <span
            className="th self-start text-[11px] px-2.5 py-1"
            style={{
              background: "var(--t-accent)",
              color: "var(--t-accent-ink)",
              borderRadius: "var(--t-radius-pill)",
            }}
          >
            {p.type}
          </span>
          <h3
            className="t-h3 text-white"
            style={{ fontSize: "clamp(22px,3.4vw,44px)", lineHeight: 1.16 }}
          >
            <Link href={`/property/${p.slug}`} className="pointer-events-auto">
              {p.title}
            </Link>
          </h3>
          <span className="th text-[12.5px] text-white/78">
            {p.location} {theme.layout.sep} {p.beds} นอน {theme.layout.sep}{" "}
            {p.baths} น้ำ {theme.layout.sep} {p.area} ตร.ม.
          </span>
        </div>

        <span className="num text-white text-[26px] sm:text-[34px] whitespace-nowrap">
          {baht(p.price)}
          <span className="text-[13px] text-white/72"> / เดือน</span>
        </span>
      </div>
    </article>
  );
}
