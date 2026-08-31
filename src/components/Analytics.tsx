import Script from "next/script";

/**
 * Google Analytics 4 — โหลดเฉพาะเมื่อตั้งรหัสไว้แล้ว
 * วางไว้ใน layout ของหน้าลูกค้าเท่านั้น (ไม่นับตอนแอดมินเข้าหลังบ้าน)
 *
 * strategy="afterInteractive" = โหลดหลังหน้าเว็บพร้อมใช้ ไม่ถ่วง LCP
 */
export default function Analytics({ gaId }: { gaId: string }) {
  const id = String(gaId || "").trim();

  // รับเฉพาะรูปแบบ G-XXXXXXXXXX เท่านั้น กันค่าขยะหลุดเข้า <script>
  if (!/^G-[A-Z0-9]{4,20}$/i.test(id)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
