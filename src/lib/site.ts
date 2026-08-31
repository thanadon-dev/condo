export const SITE_URL = (
  process.env.SITE_URL || "https://condo.thanadon.com"
).replace(/\/+$/, "");

export type SiteInfo = {
  name: string;
  tagline: string;
  phone: string;
  mobile: string;
  line: string;
  /** ลิงก์เพิ่มเพื่อน LINE OA เช่น https://lin.ee/xxxx */
  lineUrl: string;
  email: string;
  address: string;
  agent: { name: string; role: string; license: string };
  /** Google Analytics 4 measurement ID (G-XXXXXXXXXX) — ว่าง = ปิด */
  gaId: string;
};

/** ค่าเริ่มต้น (demo) — ค่าจริงตั้งได้ที่ /admin/settings แล้วเก็บลงตาราง settings */
export const SITE: SiteInfo = {
  name: "Condo D Property",
  tagline: "ที่ปรึกษาอสังหาริมทรัพย์ในกรุงเทพฯ และปริมณฑล ตั้งแต่ปี 2555",
  phone: "081 234 5667",
  mobile: "081 234 5667",
  line: "@condod",
  lineUrl: "",
  email: "hello@condod.co.th",
  address: "ชั้น 12 อาคารสาทรสแควร์ กรุงเทพฯ 10120",
  agent: {
    name: "ณัฐพงษ์ วิริยะกุล",
    role: "Senior Consultant",
    license: "0341",
  },
  gaId: "",
};

export function absolute(pathname: string): string {
  return SITE_URL + (pathname.startsWith("/") ? pathname : "/" + pathname);
}

export function baht(n: number): string {
  return "฿" + Number(n || 0).toLocaleString("en-US");
}

const TH_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export function thaiDate(iso: string): string {
  const p = String(iso || "").split("-");
  if (p.length < 3) return String(iso || "");
  const m = TH_MONTHS[Number(p[1]) - 1] || p[1];
  const y = Number(p[0]) < 2500 ? Number(p[0]) + 543 : Number(p[0]);
  return `${Number(p[2])} ${m} ${y}`;
}
