import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    const row = db().prepare("SELECT COUNT(*) c FROM properties").get() as {
      c: number;
    };
    return NextResponse.json({ ok: true, db: true, properties: row.c > 0 });
  } catch {
    return NextResponse.json({ ok: false, db: false }, { status: 503 });
  }
}
