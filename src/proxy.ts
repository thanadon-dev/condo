import { NextResponse, type NextRequest } from "next/server";
import { COOKIE } from "@/lib/auth-const";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // /theme-preview = พรีวิวธีมของแอดมิน ต้องกันเหมือน /admin ทุกประการ
  const guarded =
    pathname.startsWith("/admin") || pathname.startsWith("/theme-preview");
  if (!guarded) return NextResponse.next();

  // instance ทดลองธีม (DB read-only) -> ปิดหลังบ้านสนิท กันหน้า error ดิบ
  // แก้ข้อมูลได้ที่ condo.thanadon.com ตัวจริงเท่านั้น
  if (process.env.CONDO_READONLY === "1") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!req.cookies.get(COOKIE)?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/theme-preview/:path*"],
};
