"use client";

import Image from "next/image";
import { useEffect, useRef, useCallback } from "react";
import type { PropertyImage } from "@/lib/queries";

export default function Lightbox({
  images,
  index,
  onClose,
  onMove,
}: {
  images: PropertyImage[];
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const prev = useCallback(
    () => onMove((index - 1 + images.length) % images.length),
    [index, images.length, onMove],
  );
  const next = useCallback(
    () => onMove((index + 1) % images.length),
    [index, images.length, onMove],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab") {
        e.preventDefault();
        boxRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  const img = images[index];
  if (!img) return null;

  return (
    <div
      ref={boxRef}
      role="dialog"
      aria-modal="true"
      aria-label="แกลเลอรีรูปทรัพย์"
      tabIndex={-1}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const d = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(d) > 55) (d > 0 ? prev : next)();
        touchX.current = null;
      }}
      className="fixed inset-0 z-50 bg-ink flex flex-col outline-none"
    >
      <div className="flex items-center justify-between px-6 h-[68px] shrink-0">
        <span className="th text-[13px] text-paper/70">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="th text-[12.5px] text-paper/80 hover:text-paper px-4 py-2.5 border border-paper/25 hover:border-paper/60 transition-colors"
        >
          ปิด (ESC)
        </button>
      </div>

      <div
        className="flex-1 relative min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={img.id}
          src={img.url}
          alt={img.alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      <div
        className="flex items-center justify-center gap-3 h-[86px] shrink-0 px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prev}
          aria-label="รูปก่อนหน้า"
          className="th text-[15px] text-paper/80 hover:text-paper w-11 h-11 border border-paper/25 hover:border-paper/60 transition-colors"
        >
          ←
        </button>
        <p className="th text-[12.5px] text-paper/60 max-w-[560px] text-center truncate px-2">
          {img.alt}
        </p>
        <button
          onClick={next}
          aria-label="รูปถัดไป"
          className="th text-[15px] text-paper/80 hover:text-paper w-11 h-11 border border-paper/25 hover:border-paper/60 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
