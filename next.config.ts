import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // ปิดไว้ ให้ Caddy บีบด้วย zstd แทน (เล็กกว่า gzip ~15%)
  // ถ้าวันไหนถอด Caddy ออก ต้องเปิดกลับเป็น true
  compress: false,
  reactStrictMode: true,

  images: {
    // AVIF เล็กกว่า WebP ~20-30% · เบราว์เซอร์เก่าจะได้ WebP อัตโนมัติ
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1200, 1920],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    optimizePackageImports: ["leaflet"],
    serverActions: {
      // ดีฟอลต์ 1MB — อัปโหลดหลายรูปพร้อมกันจะพัง (client ย่อมาแล้วแต่ยังรวมกันเกินได้)
      bodySizeLimit: "48mb",
    },
  },

  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      },
    ];

    return [
      { source: "/:path*", headers: security },
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
