"use client";

import { useEffect, useRef } from "react";
import type { Poi } from "@/lib/queries";

type LeafletMap = { remove: () => void };

export default function PropertyMap({
  lat,
  lng,
  title,
  pois,
}: {
  lat: number;
  lng: number;
  title: string;
  pois: Poi[];
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !nodeRef.current || mapRef.current) return;

      const map = L.map(nodeRef.current, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
      });
      mapRef.current = map as unknown as LeafletMap;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const pin = (color: string, size: number) =>
        L.divIcon({
          className: "",
          html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

      L.marker([lat, lng], { icon: pin("#141414", 20), title })
        .addTo(map)
        .bindPopup(`<strong>${title}</strong>`);

      for (const p of pois) {
        L.marker([p.lat, p.lng], { icon: pin("#8f8878", 12), title: p.name })
          .addTo(map)
          .bindPopup(`${p.name}<br><small>${p.category}</small>`);
      }

      map.on("click", () => map.scrollWheelZoom.enable());
      map.on("mouseout", () => map.scrollWheelZoom.disable());
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, title, pois]);

  return (
    <div
      ref={nodeRef}
      role="application"
      aria-label={`แผนที่ทำเลของ ${title}`}
      className="w-full aspect-[16/9] bg-sand border border-line-2 z-0"
    />
  );
}
