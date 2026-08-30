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
    <div className="group relative border border-line-2 hover:border-line transition-colors bg-paper">
      <FavButton id={p.id} className="absolute right-3 top-3 z-10" />

      <Link href={`/property/${p.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-sand overflow-hidden">
          {cover ? (
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="kicker text-faint">{p.type}</span>
            </div>
          )}
          <span className="absolute left-0 top-0 bg-ink text-paper th text-[12px] px-3.5 py-2 z-10">
            {baht(p.price)}
          </span>
        </div>

        <div className="p-5">
          <div className="kicker">{p.type}</div>
          <h3 className="th mt-2 text-[16px] font-medium leading-snug group-hover:underline underline-offset-4 decoration-line">
            {p.title}
          </h3>
          <p className="th mt-1.5 text-[12.5px] text-muted leading-relaxed">
            {p.location}
          </p>
          <p className="th mt-3 pt-3 border-t border-line-2 text-[12.5px] text-ink-2">
            {p.beds} นอน · {p.baths} น้ำ · {p.area} ตร.ม.
          </p>
        </div>
      </Link>
    </div>
  );
}
