import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { SITE, SITE_URL } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      className={`${cormorant.variable} ${jost.variable} ${notoThai.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
