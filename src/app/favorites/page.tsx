import type { Metadata } from "next";
import { Section } from "@/components/Section";
import FavoritesList from "@/components/FavoritesList";
import { listProperties } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "รายการโปรด",
  description: "ทรัพย์ที่คุณเก็บไว้ดูทีหลัง",
  alternates: { canonical: "/favorites" },
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <Section
      kicker="Saved"
      title="รายการโปรด"
      sub="เก็บไว้ในเครื่องของคุณเท่านั้น ไม่ได้ส่งขึ้นเซิร์ฟเวอร์"
    >
      <FavoritesList all={listProperties()} />
    </Section>
  );
}
