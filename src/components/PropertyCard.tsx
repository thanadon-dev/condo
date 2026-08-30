import Link from "next/link";
import Image from "next/image";
import type { Property, PropertyImage } from "@/lib/queries";
import { baht } from "@/lib/site";
import FavButton from "./FavButton";

export default function PropertyCard({
  p,
  cover,
  priority = false,
}: {
  p: Property;
  cover?: PropertyImage;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col gap-[18px] rise">
      <div className="relative w-full aspect-[4/3] bg-sand overflow-hidden">
        <Link href={`/property/${p.slug}`} className="block absolute inset-0">
          {cover ? (
            <Image
              src={cover.url}
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

        <div className="absolute left-0 bottom-0 px-[18px] py-[11px] bg-paper text-[14.5px] tracking-[0.01em] whitespace-nowrap pointer-events-none th">
          {baht(p.price)}
        </div>

        <FavButton id={p.id} className="absolute right-3 top-3 z-10" />
      </div>

      <div className="flex flex-col gap-[9px]">
        <span className="text-[9.5px] tracking-[0.32em] uppercase text-dim">
          {p.type}
        </span>
        <h3 className="serif text-[25px] font-normal leading-[1.25] tracking-[-0.005em]">
          <Link href={`/property/${p.slug}`} className="hover:underline underline-offset-[6px] decoration-line">
            {p.title}
          </Link>
        </h3>
        <span className="th text-[13px] font-light text-muted">{p.location}</span>
        <div className="flex gap-[18px] pt-2.5 mt-1 border-t border-line-2 th text-[12.5px] text-ink-2 whitespace-nowrap">
          <span>{p.beds} นอน</span>
          <span className="text-line">·</span>
          <span>{p.baths} น้ำ</span>
          <span className="text-line">·</span>
          <span>{p.area} ตร.ม.</span>
        </div>
      </div>
    </article>
  );
}
