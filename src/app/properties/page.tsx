import type { Metadata } from "next";
import { Section } from "@/components/Section";
import PropertyCard from "@/components/PropertyCard";
import { listProperties } from "@/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "ทรัพย์ทั้งหมด",
  description:
    "รวมคอนโด บ้านเดี่ยว ทาวน์โฮม และเพนท์เฮาส์ในกรุงเทพฯ และปริมณฑล พร้อมราคาและพื้นที่ใช้สอย",
  alternates: { canonical: "/properties" },
};

export default function PropertiesPage() {
  const items = listProperties();
  return (
    <Section
      kicker="Properties"
      title="ทรัพย์ทั้งหมด"
      sub={`${items.length} รายการในระบบ · ตัวกรองและช่วงราคาจะเปิดใน Phase 2`}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </div>
    </Section>
  );
}
