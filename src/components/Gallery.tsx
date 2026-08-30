"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyImage } from "@/lib/queries";
import Lightbox from "./Lightbox";

export default function Gallery({ images }: { images: PropertyImage[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-sand flex items-center justify-center">
        <span className="kicker text-faint">ยังไม่มีรูป</span>
      </div>
    );
  }

  const [cover, ...rest] = images;
  const thumbs = rest.slice(0, 4);

  return (
    <>
      <div className="grid gap-2 md:grid-cols-[2fr_1fr]">
        <button
          onClick={() => setOpen(0)}
          aria-label="ดูรูปขนาดเต็ม"
          className="relative aspect-[4/3] md:aspect-auto md:h-[440px] bg-sand overflow-hidden group"
        >
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority
          />
        </button>

        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:h-[440px]">
          {thumbs.slice(0, 2).map((im, i) => (
            <button
              key={im.id}
              onClick={() => setOpen(i + 1)}
              aria-label={`ดูรูปที่ ${i + 2}`}
              className="relative aspect-[4/3] md:aspect-auto md:h-full bg-sand overflow-hidden group"
            >
              <Image
                src={im.url}
                alt={im.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {i === 1 && images.length > 3 && (
                <span className="absolute inset-0 bg-ink/55 grid place-items-center th text-[14px] text-paper">
                  ดูรูปทั้งหมด ({images.length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {open !== null && (
        <Lightbox
          images={images}
          index={open}
          onClose={() => setOpen(null)}
          onMove={setOpen}
        />
      )}
    </>
  );
}
