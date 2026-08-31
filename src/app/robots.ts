import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // กันบอทไล่เก็บหน้ากรอง (เนื้อหาซ้ำ กินงบ crawl)
        disallow: [
          "/admin",
          "/login",
          "/api/",
          "/properties?",
          "/journal?",
          "/about?",
        ],
      },
      // บอท AI ที่ดูดเนื้อหาไปเทรน — ปิดไว้ก่อน
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
    ],
    sitemap: absolute("/sitemap.xml"),
    host: absolute("/"),
  };
}
