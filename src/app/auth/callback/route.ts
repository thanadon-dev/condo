import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  COOKIE,
  googleConfig,
  consumeState,
  upsertUser,
  createSession,
} from "@/lib/auth";
import { absolute, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

type TokenRes = { access_token?: string; id_token?: string };
type Profile = { email?: string; name?: string; picture?: string };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code") || "";
  const state = url.searchParams.get("state") || "";

  const cfg = googleConfig();
  if (!cfg) return new Response("oauth not configured", { status: 503 });
  if (!code || !consumeState(state)) redirect("/login?e=state");

  let profile: Profile;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: cfg.client_id,
        client_secret: cfg.client_secret,
        redirect_uri: absolute("/auth/callback"),
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!tokenRes.ok) redirect("/login?e=token");

    const tok = (await tokenRes.json()) as TokenRes;
    if (!tok.access_token) redirect("/login?e=token");

    const infoRes = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${tok.access_token}` },
        signal: AbortSignal.timeout(12000),
      },
    );
    if (!infoRes.ok) redirect("/login?e=profile");
    profile = (await infoRes.json()) as Profile;
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    redirect("/login?e=network");
  }

  if (!profile.email) redirect("/login?e=email");

  const user = upsertUser({
    email: profile.email,
    name: profile.name || profile.email,
    picture: profile.picture || "",
  });
  if (!user) redirect("/login?e=user");

  const token = createSession(user.id);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: SITE_URL.startsWith("https://"),
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  redirect(user.is_admin === 1 ? "/admin" : "/login?e=denied");
}
