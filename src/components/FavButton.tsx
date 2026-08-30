"use client";

import { useFavorites } from "@/lib/useFavorites";

export default function FavButton({
  id,
  className = "",
}: {
  id: number;
  className?: string;
}) {
  const { has, toggle } = useFavorites();
  const on = has(id);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "เอาออกจากรายการโปรด" : "เก็บไว้ในรายการโปรด"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={`grid place-items-center w-9 h-9 border transition-colors ${
        on
          ? "bg-ink border-ink text-paper"
          : "bg-paper/90 border-line-2 text-ink-2 hover:border-ink"
      } ${className}`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={on ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21.2l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.9z" />
      </svg>
    </button>
  );
}
