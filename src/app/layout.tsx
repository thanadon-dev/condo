import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE, SITE_URL } from "@/lib/site";
import { ALL_FONT_CLASSES } from "@/lib/fonts";
import { getActiveTheme } from "@/lib/active-theme";
import { themeVars } from "@/lib/themes";

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

export function generateViewport(): Viewport {
  const t = getActiveTheme();
  return {
    // แถบเบราว์เซอร์มือถือใช้สีของธีม
    themeColor: t.vars["--t-bg"],
    colorScheme: t.layout.dark ? "dark" : "light",
    width: "device-width",
    initialScale: 1,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = getActiveTheme();
  const vars = themeVars(theme);

  return (
    <html
      lang="th"
      data-theme={theme.id}
      className={ALL_FONT_CLASSES}
      style={
        {
          ...vars,
          "--t-scheme": theme.layout.dark ? "dark" : "light",
        } as React.CSSProperties
      }
    >
      <head>
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
