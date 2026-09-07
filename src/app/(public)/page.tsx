import HomeContent from "@/components/HomeContent";
import { listProperties } from "@/lib/queries";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { getActiveTheme } from "@/lib/active-theme";
import JsonLd from "@/components/JsonLd";
import { organization, website, itemList, faqPage } from "@/lib/jsonld";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  const SITE = getSettings();
  const title = `${SITE.name} — คอนโด บ้านเช่า ทาวน์โฮม ให้เช่าในกรุงเทพฯ`;
  const description =
    "คัดสรรคอนโด บ้านเดี่ยว และทาวน์โฮมให้เช่าในกรุงเทพฯ พร้อมค่าเช่าจริง พื้นที่ใช้สอย และทำเลรอบโครงการ นัดชมได้ทุกวัน";
  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: "/",
      type: "website",
      images: [
        {
          url: "/media/hero-mock.webp",
          width: 1200,
          height: 630,
          alt: "คอนโดริมแม่น้ำเจ้าพระยา กรุงเทพฯ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/media/hero-mock.webp"],
    },
  };
}

const FAQ = [
  {
    q: "ค่าเช่าคอนโดและบ้านในกรุงเทพฯ เริ่มต้นเท่าไหร่",
    a: "ทรัพย์ที่คัดไว้มีค่าเช่าตั้งแต่ 7,500 บาทต่อเดือนสำหรับคอนโดหนึ่งห้องนอน ไปจนถึงประมาณ 50,000 บาทต่อเดือนสำหรับบ้านเดี่ยวและเพนท์เฮาส์",
  },
  {
    q: "ต้องวางเงินประกันกี่เดือน",
    a: "โดยทั่วไปคือค่าเช่าล่วงหน้า 1 เดือน และเงินประกัน 2 เดือน ขึ้นอยู่กับเจ้าของแต่ละราย สามารถสอบถามรายละเอียดก่อนนัดชมได้",
  },
  {
    q: "นัดชมห้องได้วันไหนบ้าง",
    a: "นัดชมได้ทุกวันรวมวันหยุด แจ้งล่วงหน้าอย่างน้อยหนึ่งวันผ่านแบบฟอร์มติดต่อหรือโทรหาเราโดยตรง",
  },
  {
    q: "มีค่าบริการสำหรับผู้เช่าไหม",
    a: "ไม่มีค่าบริการสำหรับผู้เช่า ค่าตอบแทนมาจากฝั่งเจ้าของทรัพย์ตามมาตรฐานตลาด",
  },
];

export default function Home() {
  const SITE = getSettings();
  const theme = getActiveTheme();
  const featured = listProperties().slice(0, 6);

  return (
    <>
      <JsonLd id="ld-org" data={organization(SITE)} />
      <JsonLd id="ld-site" data={website(SITE)} />
      <JsonLd
        id="ld-list"
        data={itemList(featured, (p) => `/property/${p.slug}`)}
      />
      <JsonLd id="ld-faq" data={faqPage(FAQ)} />

      <HomeContent theme={theme} />
    </>
  );
}
