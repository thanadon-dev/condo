"use client";

import { useSyncExternalStore, useCallback } from "react";

const KEY = "condo:favs";

let cache: number[] = [];
let raw = "";
const listeners = new Set<() => void>();

function read(): number[] {
  if (typeof window === "undefined") return [];
  const cur = window.localStorage.getItem(KEY) ?? "";
  if (cur === raw) return cache;
  raw = cur;
  try {
    const v = JSON.parse(cur || "[]");
    cache = Array.isArray(v) ? v.filter((n) => Number.isInteger(n)) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: number[]) {
  raw = JSON.stringify(next);
  cache = next;
  window.localStorage.setItem(KEY, raw);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

const EMPTY: number[] = [];

export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((id: number) => {
    const cur = read();
    write(cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  }, []);

  const clear = useCallback(() => write([]), []);

  return { ids, toggle, clear, has: (id: number) => ids.includes(id) };
}
