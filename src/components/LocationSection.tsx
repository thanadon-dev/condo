import dynamic from "next/dynamic";
import type { Poi } from "@/lib/queries";
import { embedUrl, externalUrl } from "@/lib/gmap";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  loading: () => (
    <div className="w-full aspect-[16/9] bg-sand border border-line-2 flex items-center justify-center">
      <span className="kicker text-faint">กำลังโหลดแผนที่…</span>
    </div>
  ),
});

const CAT_ORDER = [
  "รถไฟฟ้า / สถานี",
  "ซูเปอร์มาร์เก็ต",
  "โรงพยาบาล",
  "สถานศึกษา",
  "สวนสาธารณะ",
];

function walkMinutes(m: number): number {
  return Math.max(1, Math.round(m / 80));
}

export default function LocationSection({
  lat,
  lng,
  title,
  district,
  pois,
  mapUrl = "",
}: {
  lat: number | null;
  lng: number | null;
  title: string;
  district: string;
  pois: Poi[];
  /** ลิงก์ Google Maps ที่แอดมินวางไว้ — มีแล้วจะใช้แผนที่ Google แทน OSM */
  mapUrl?: string;
}) {
  const grouped = CAT_ORDER.map((c) => ({
    cat: c,
    items: pois.filter((p) => p.category === c),
  })).filter((g) => g.items.length > 0);

  const hasCoords = lat !== null && lng !== null;
  const useGoogle = hasCoords && Boolean(mapUrl);

  return (
    <>
      <h2 className="display text-[30px] th mt-14">ทำเลและการเดินทาง</h2>
      <p className="th mt-2 text-[13.5px] text-muted">
        {district}
        {grouped.length > 0 && " · จุดสำคัญโดยรอบจากข้อมูล OpenStreetMap"}
      </p>

      <div className="mt-5">
        {useGoogle ? (
          <div className="border border-line-2">
            <iframe
              src={embedUrl(lat!, lng!)}
              title={`แผนที่ ${title}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="w-full aspect-[16/9] block"
            />
          </div>
        ) : hasCoords ? (
          <PropertyMap lat={lat!} lng={lng!} title={title} pois={pois} />
        ) : (
          <div className="w-full aspect-[16/9] bg-sand border border-line-2 flex items-center justify-center">
            <span className="kicker text-faint">ยังไม่มีพิกัด</span>
          </div>
        )}
      </div>

      {hasCoords && (
        <a
          href={externalUrl(lat!, lng!)}
          target="_blank"
          rel="noopener noreferrer"
          className="th inline-flex items-center gap-1.5 mt-3 text-[13px] text-ink-2 hover:text-ink transition-colors"
        >
          เปิดใน Google Maps
          <span aria-hidden="true">↗</span>
        </a>
      )}

      {grouped.length > 0 && (
        <div className="mt-8 grid gap-x-10 sm:grid-cols-2">
          {grouped.map((g) => (
            <div key={g.cat} className="mb-6">
              <div className="kicker mb-3">{g.cat}</div>
              <ul className="space-y-2.5">
                {g.items.map((p) => (
                  <li
                    key={p.id}
                    className="flex justify-between gap-4 th text-[13.5px] pb-2.5 border-b border-line-2"
                  >
                    <span className="text-ink-2 truncate">{p.name}</span>
                    <span className="text-muted shrink-0 tabular-nums">
                      {p.distance_m >= 1000
                        ? `${(p.distance_m / 1000).toFixed(1)} กม.`
                        : `${p.distance_m} ม.`}
                      {" · "}
                      {walkMinutes(p.distance_m) <= 25
                        ? `เดิน ${walkMinutes(p.distance_m)} นาที`
                        : `รถ ${Math.max(1, Math.round(p.distance_m / 400))} นาที`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
