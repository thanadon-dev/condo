import Link from "next/link";
import Image from "next/image";
import type { Property, PropertyImage } from "@/lib/queries";
import { baht } from "@/lib/site";
import FavButton from "./FavButton";
import type { Theme } from "@/lib/themes";

/**
 * การ์ดทรัพย์ — โครงเดียว รองรับ 5 ทรง (ตาม mockup 10 สไตล์)
 * ห้ามแยกเป็น 10 component: props/ข้อมูลต้องเหมือนกันทุกธีม เปลี่ยนแค่การจัดวาง
 *
 * stack   — รูปบน ข้อความล่าง ไม่มีกรอบ (1a, 3a, 9a)
 * framed  — มีพื้น/กรอบการ์ด (2a, 5a, 10a)
 * row     — รูปซ้าย ข้อความขวา (4a)
 * overlay — ราคาทับบนรูป (6a, 8a)
 * center  — จัดกึ่งกลาง (7a)
 */
export default function PropertyCard({
  p,
  cover,
  priority = false,
  theme,
}: {
  p: Property;
  cover?: PropertyImage;
  priority?: boolean;
  theme: Theme;
}) {
  const { card, price: pricePos, sep } = theme.layout;
  const row = card === "row";
  const framed = card === "framed";
  const center = card === "center";

  const spec = (
    <div
      className={`flex gap-[14px] th text-[12.5px] text-ink-2 whitespace-nowrap ${
        center ? "justify-center" : ""
      }`}
    >
      <span>{p.beds} นอน</span>
      <span className="text-line">{sep}</span>
      <span>{p.baths} น้ำ</span>
      <span className="text-line">{sep}</span>
      <span>{p.area} ตร.ม.</span>
    </div>
  );

  const priceEl = (
    <span className="num text-[15px] tracking-[0.01em] whitespace-nowrap">
      {baht(p.price)}
      <span className="text-[11.5px] text-muted"> / เดือน</span>
    </span>
  );

  const media = (
    <div
      className={`relative overflow-hidden bg-sand ${
        row ? "h-full min-h-[170px]" : "w-full aspect-[4/3]"
      }`}
      style={{
        // การ์ดแนวนอน: รูปอยู่ในกรอบที่ padding 12px -> มุมโค้งต้องเล็กลงตาม
        // ต้องมี clamp กันค่าติดลบตอนธีมมุมเหลี่ยม (radius 0)
        borderRadius: row
          ? "max(0px, calc(var(--t-radius) - 12px))"
          : "var(--t-media-radius, 0px)",
      }}
    >
      <Link href={`/property/${p.slug}`} className="block absolute inset-0">
        {cover ? (
          <Image
            src={cover.thumb_url || cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]"
            priority={priority}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center kicker text-faint">
            {p.type}
          </span>
        )}
      </Link>

      {pricePos === "onImage" && (
        <div
          className="absolute left-0 bottom-0 px-[16px] py-[10px] pointer-events-none num text-[14.5px] whitespace-nowrap"
          style={{
            background: "var(--t-card, var(--t-bg))",
            color: "var(--t-ink)",
          }}
        >
          {baht(p.price)}
          <span className="text-[11.5px] text-muted"> / เดือน</span>
        </div>
      )}

      <FavButton id={p.id} className="absolute right-3 top-3 z-10" />
    </div>
  );

  const body = (
    <div
      className={`flex flex-col gap-[9px] ${center ? "items-center text-center" : ""} ${
        framed || row ? "p-[18px] pt-[14px]" : ""
      }`}
    >
      <span className="kicker text-[9.5px]">{p.type}</span>

      <h3 className="t-h3">
        <Link
          href={`/property/${p.slug}`}
          className="hover:underline underline-offset-[6px] decoration-line"
        >
          {p.title}
        </Link>
      </h3>

      <span className="th text-[13px] font-light text-muted">{p.location}</span>

      {pricePos === "belowTitle" && (
        <div
          className={`flex items-baseline gap-3 pt-1 ${center ? "justify-center" : "justify-between"}`}
        >
          {priceEl}
          {spec}
        </div>
      )}

      {pricePos !== "belowTitle" && (
        <div
          className={`flex items-center gap-4 pt-2.5 mt-1 border-t border-line-2 ${
            center ? "justify-center" : "justify-between"
          }`}
        >
          {pricePos === "footerRow" ? (
            <>
              {priceEl}
              {spec}
            </>
          ) : (
            spec
          )}
        </div>
      )}
    </div>
  );

  if (row) {
    return (
      <article
        className="group grid grid-cols-[130px_1fr] sm:grid-cols-[210px_1fr] gap-4 t-card rise p-3"
        style={{ boxShadow: "var(--t-card-shadow)" }}
      >
        {media}
        {body}
      </article>
    );
  }

  return (
    <article
      className={`group flex flex-col rise ${framed ? "t-card overflow-hidden" : "gap-[18px]"}`}
      style={framed ? { boxShadow: "var(--t-card-shadow)" } : undefined}
    >
      {media}
      {body}
    </article>
  );
}
