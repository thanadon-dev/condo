import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COOKIE, destroySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value ?? "";
  destroySession(token);
  jar.delete(COOKIE);
  redirect("/login");
}

export async function GET() {
  return POST();
}
