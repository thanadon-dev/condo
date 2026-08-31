import { ImageResponse } from "next/og";
import { propertyBySlug, imagesOf } from "@/lib/queries";
import { decodeSlug } from "@/lib/route";
import { baht } from "@/lib/site";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { mediaPath } from "@/lib/media";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Condo D Property";

let fontCache: ArrayBuffer | null = null;

async function thaiFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  const buf = await readFile(
    path.join(process.cwd(), "src/assets/Kanit-SemiBold.ttf"),
  );
  fontCache = buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength,
  ) as ArrayBuffer;
  return fontCache;
}

async function coverDataUrl(slugImages: { url: string }[]) {
  const first = slugImages[0];
  if (!first) return null;
  const name = decodeURIComponent(first.url.replace(/^\/media\//, ""));
  const full = mediaPath(name);
  if (!full) return null;
  try {
    const buf = await readFile(full);
    const jpeg = await sharp(buf)
      .resize(1200, 630, { fit: "cover", position: "top" })
      .jpeg({ quality: 82 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = propertyBySlug(decodeSlug(slug));

  if (!p) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f4f3f0",
            fontSize: 64,
            color: "#141414",
            fontFamily: "Kanit",
          }}
        >
          Condo D Property
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Kanit",
            data: await thaiFont(),
            weight: 600,
            style: "normal",
          },
        ],
      },
    );
  }

  const cover = await coverDataUrl(imagesOf(p.id));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#f4f3f0",
          position: "relative",
          fontFamily: "Kanit",
        }}
      >
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: "cover",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background:
              "linear-gradient(to bottom, rgba(20,20,20,0.25) 30%, rgba(20,20,20,0.93) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "0 64px 60px",
            color: "#ffffff",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              opacity: 0.78,
            }}
          >
            {`${p.type} · ${p.code}`}
          </div>
          <div style={{ fontSize: 62, marginTop: 14, lineHeight: 1.15 }}>
            {p.title}
          </div>
          <div style={{ fontSize: 28, marginTop: 16, opacity: 0.82 }}>
            {p.location}
          </div>
          <div
            style={{
              display: "flex",
              gap: 34,
              marginTop: 26,
              fontSize: 32,
            }}
          >
            <span>{`${baht(p.price)} / เดือน`}</span>
            <span style={{ opacity: 0.75 }}>
              {`${p.beds} นอน · ${p.baths} น้ำ · ${p.area} ตร.ม.`}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Kanit", data: await thaiFont(), weight: 600, style: "normal" },
      ],
    },
  );
}
