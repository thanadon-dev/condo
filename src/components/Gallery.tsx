"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyImage } from "@/lib/queries";
import Lightbox from "./Lightbox";

/**
 * Layout ตามภาพร่างที่คุณมาร์คส่งมา:
 *   แถวบน  = รูปใหญ่ซ้าย (2/3) + รูปเล็กซ้อนกัน 2 ใบขวา (1/3)
 *   แถวล่าง = ธัมบ์เนล 5 ช่อง ช่องสุดท้ายขึ้น +N ถ้ามีรูปเหลือ
 */
export default function Gallery({ images }: { images: PropertyImage[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full aspect-[16/9] bg-sand grid place-items-center">
        <span className="kicker text-faint">ยังไม่มีรูป</span>
      </div>
    );
  }

  const show = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const hero = images[0];
  const side = images.slice(1, 3);
  const thumbs = images.slice(0, 5);
  const more = Math.max(0, images.length - 5);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => show(0)}
            aria-label={`ดูรูป ${hero.alt}`}
            className="group relative sm:col-span-2 aspect-[4/3] bg-sand overflow-hidden"
          >
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              sizes="(max-width: 640px) 100vw, 66vw"
              priority
              className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
            />
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
            {side.map((img, i) => (
              <button
                key={img.id}
                onClick={() => show(i + 1)}
                aria-label={`ดูรูป ${img.alt}`}
                className="group relative aspect-[4/3] sm:aspect-auto sm:h-full bg-sand overflow-hidden"
              >
                <Image
                  src={img.thumb_url || img.url}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.04]"
                />
              </button>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {thumbs.map((img, i) => {
              const last = i === 4 && more > 0;
              return (
                <button
                  key={img.id}
                  onClick={() => show(last ? 4 : i)}
                  aria-label={
                    last ? `ดูรูปทั้งหมด ${images.length} รูป` : `ดูรูป ${img.alt}`
                  }
                  className="group relative aspect-square bg-sand overflow-hidden"
                >
                  <Image
                    src={img.thumb_url || img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 20vw, 160px"
                    className={`object-cover transition-transform duration-[600ms] group-hover:scale-[1.06] ${
                      last ? "brightness-[0.45]" : ""
                    }`}
                  />
                  {last && (
                    <span className="absolute inset-0 grid place-items-center th text-paper text-[15px] sm:text-[17px] font-light">
                      +{more}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {open && (
        <Lightbox
          images={images}
          index={index}
          onMove={setIndex}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
