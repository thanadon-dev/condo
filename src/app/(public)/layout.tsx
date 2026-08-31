import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Analytics from "@/components/Analytics";
import { getSettings } from "@/lib/settings";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const SITE = getSettings();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      {/* วางที่ layout หน้าลูกค้าเท่านั้น -> ไม่นับตอนแอดมินเข้า /admin */}
      <Analytics gaId={SITE.gaId} />
    </>
  );
}
