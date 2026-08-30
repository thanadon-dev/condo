import { readFile, stat } from "node:fs/promises";
import { mediaPath, mimeOf } from "@/lib/media";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const full = mediaPath(decoded);
  if (!full) return new Response("not found", { status: 404 });

  try {
    const info = await stat(full);
    if (!info.isFile()) return new Response("not found", { status: 404 });
    const buf = await readFile(full);
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": mimeOf(decoded),
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
