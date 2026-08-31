import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { SITE, SITE_URL } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — คอนโด บ้านเช่า ทาวน์โฮม ในกรุงเทพฯ`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "คัดสรรคอนโด บ้านเดี่ยว และทาวน์โฮมในกรุงเทพฯ พร้อมข้อมูลครบทุกด้าน ทั้งพื้นที่ใช้สอย ค่าส่วนกลาง และทำเลรอบโครงการ",
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: SITE.name,
    url: SITE_URL,
    // รูป default ของทุกหน้าที่ไม่ได้กำหนด og:image เอง (แชร์ลิงก์แล้วต้องมีรูปเสมอ)
    images: [
      {
        url: "/media/hero-mock.webp",
        width: 1200,
        height: 630,
        alt: `${SITE.name} — คอนโดและบ้านเช่าในกรุงเทพฯ`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/media/hero-mock.webp"],
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: false, email: false },
  category: "real estate",
};

export const viewport: Viewport = {
  themeColor: "#141414",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      className={`${cormorant.variable} ${jost.variable} ${notoThai.variable}`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
