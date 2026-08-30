import Link from "next/link";
import type { Property } from "@/lib/queries";
import { baht } from "@/lib/site";

export default function PropertyCard({ p }: { p: Property }) {
  return (
    <Link
      href={`/property/${p.slug}`}
      className="group block border border-line-2 hover:border-line transition-colors bg-paper"
    >
      <div className="relative aspect-[4/3] bg-sand overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="kicker text-faint">{p.type}</span>
        </div>
        <span className="absolute left-0 top-0 bg-ink text-paper th text-[12px] px-3.5 py-2">
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
  );
}
